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
let lastUpdatedScripts = [];


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
    let html = await fetchFile(`src/controls/${dirName}/${sampleData.routerPath}/index.html`);
    let js = await fetchFile(`src/controls/${dirName}/${sampleData.routerPath}/index.js`);
    let tags = new DOMParser().parseFromString(html, 'text/html');
    let container = tags.querySelector('div');
    demo.innerHTML = container ? container.outerHTML : '';
    await loadScriptsFromHTML(tags);
    eval(js);
}

async function loadScriptsFromHTML(container) {
    if (lastUpdatedScripts && lastUpdatedScripts.length > 0) {
        removeScriptsFromHTML(lastUpdatedScripts);
        lastUpdatedScripts = [];
    }

    if (!container) return;
    let scriptTags = container.querySelectorAll('script');
    if (scriptTags && scriptTags.length > 0) {
        for (let index = 0; index < scriptTags.length; index++) {
            let existingScript = document.head.querySelector(`script[src="${scriptTags[index].src}"]`);
            if (!existingScript) {
                let newScript = document.createElement('script');
                newScript.src = scriptTags[index].src;
                await new Promise((resolve, reject) => {
                    newScript.onload = resolve;
                    newScript.onerror = reject;
                    document.head.appendChild(newScript);
                    lastUpdatedScripts.push(newScript.src);
                });
            }
        }
    }
}

function removeScriptsFromHTML(scriptList) {
    if (scriptList && scriptList.length > 0) {
        for (let index = 0; index < scriptList.length; index++) {
            let targetTag = scriptList[index];
            if (targetTag && targetTag.parentNode) {
                targetTag.parentNode.removeChild(targetTag);
            }
        }
    }
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
