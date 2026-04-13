//Toolbar click event handler
function ontoolBarItemClick(args) {
    if (args.value === "CustomItem") {
        //Implement the code to CustomItem toolbar option
        alert("CustomItem toolbar option Clicked");
    }
}

$(function () {
                $("#viewer").boldReportViewer({
                    reportServiceUrl: "https://demos.boldreports.com/services/api/ReportViewer",
                    reportPath: '~/Resources/docs/sales-order-detail.rdl',
                    toolbarSettings: {
                        showToolbar: true,
                        items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Print,
                        customItems: [{
                            groupIndex: 1,
                            index: 1,
                            type: 'Default',
                            id:'CustomItem',
                            cssClass: "e-icon e-mail e-reportviewer-icon CustomItem",
                            tooltip: { header: 'CustomItem', content: 'toolbaritems'}
                        }]
                    },
                    toolBarItemClick: ontoolBarItemClick
                });
            });