import * as jquery from 'jquery';
window['$'] = jquery;
import './index.css';

//report
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min';
import '@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-designer.min';

import 'bootstrap';

//code-mirror
import 'codemirror/lib/codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/vb/vb';

import * as CodeMirror from 'codemirror';
window['CodeMirror'] = CodeMirror;

import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import * as data from './samples.json';
import {
    routerInit
} from './router';

let header,sidebar;
let reportViewer = 'report-viewer';
let reportDesigner = 'report-designer';
let loadedScriptSrcs = new Set();


document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

async function onDOMContentLoaded() {
    header = new Header(document.getElementsByTagName('ej-header')[0]);
    sidebar = new Sidebar(document.getElementsByTagName('ej-sidebar')[0]);
    await header.init();
    await sidebar.init();
    routerInit();
}

export function onInit() {
    document.querySelector(".splash").classList.add('e-hidden');
    document.querySelector('.ej-body.e-hidden').classList.remove('e-hidden');
    document.querySelector('.mobile-overlay').addEventListener('click', onMobileOverlayClick.bind(this));
    document.querySelector('.mobile-overlay').classList.add('e-hidden');
    window.addEventListener('resize', () => {
        onResize();
    });
}

function setReportsHeight() {
    let style = document.getElementById('reports-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'reports-style';
        document.body.appendChild(style);
    }
    style.textContent = `ej-sample{
      display:block;
      overflow: hidden;
      height: ${window.innerHeight -
        (48- document.body.getBoundingClientRect().top)}px
    }`;
}

export function updateData(sampleData, isReportViewer) {
    tocSelection(sampleData, isReportViewer);
    updataSample(sampleData, isReportViewer);
    updateMetaData(sampleData);
    setReportsHeight();
}

export async function updataSample(sampleData, isReportViewer) {
    let dirName = isReportViewer ? reportViewer : reportDesigner;
    let demo = document.getElementsByTagName("ej-sample")[0];
    let [html, js] = await Promise.all([
        fetchFile(`src/controls/${dirName}/${sampleData.routerPath}/index.html`),
        fetchFile(`src/controls/${dirName}/${sampleData.routerPath}/index.js`)
    ]);
    demo.replaceChildren();
    let doc = document.implementation.createHTMLDocument('');
    let wrapper = doc.createElement('div');
    wrapper.innerHTML = html;
    let nodes = Array.from(wrapper.childNodes);
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') return;
        demo.appendChild(document.importNode(node, true));
    });
    let scripts = wrapper.querySelectorAll('script');
    for (let oldScript of scripts) {
        let newScript = document.createElement('script');
        for (let attr of oldScript.attributes) newScript.setAttribute(attr.name, attr.value);

        if (oldScript.src && !loadedScriptSrcs.has(oldScript.src)) {
            loadedScriptSrcs.add(oldScript.src);
            await new Promise((resolve, reject) => {
                newScript.addEventListener('load', resolve, { once: true });
                newScript.addEventListener('error', reject, { once: true });
                demo.appendChild(newScript);
            });
        } else {
            if (!newScript.hasAttribute('type')) newScript.type = 'text/javascript';
            newScript.text = oldScript.textContent || '';
            demo.appendChild(newScript);
        }
    }
    eval(js);
}

function onResize() {
    setReportsHeight();
    updateOverlay();
}

function tocSelection(sampleData, isReportViewer) {
    let samples = isReportViewer ? data.default.ReportViewer.samples : data.default.ReportDesigner.samples;
    let tocClassName = isReportViewer ? 'collapseReportViewer' : 'collapseReportDesigner'
    let ele = document.querySelectorAll(`#${tocClassName} .ej-doc-list-item`)[samples.indexOf(sampleData)];
    let previousSelected = document.querySelector('.ej-doc-toc-selected');
    if (previousSelected) {
        previousSelected.classList.remove('ej-doc-toc-selected')
    }
    ele.classList.add('ej-doc-toc-selected');
    ele.focus();
}

async function fetchFile(path) {
    let response = await fetch(path);
    let data = await response.text();
    return data;
}

function updateOverlay() {
    let mobileOverlay = document.querySelector('.mobile-overlay');
    let mobileSideBar = document.querySelector('ej-sidebar');
    if (!window.matchMedia('(max-width:550px)').matches) {
        mobileSideBar.classList.remove('ej-doc-toc-mobile-slide-left');
        mobileOverlay.classList.add('e-hidden');
    }
}

function onMobileOverlayClick() {
    header.onHamBurgerClick();
}

function updateMetaData(sampleData) {
    var title = sampleData.metaData.title;
    if (!title) {
        title = sampleData.sampleName;
    }
    document.title = `${title} | Bold Reports JavaScript | Syncfusion`;
    document.querySelector('meta[name="description"]').setAttribute('content', sampleData.metaData.description);
}
