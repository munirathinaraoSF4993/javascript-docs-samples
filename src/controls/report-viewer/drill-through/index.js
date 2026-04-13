function onDrillThrough(args) {
    args.actionInfo.ReportName = "personal-details";
    args.actionInfo.Parameters = [{ name: 'EmployeeID', value: ['3'] }];
}

$(function () {
    $("#viewer").boldReportViewer({
                    reportServiceUrl: "https://demos.boldreports.com/ReportService/api/Viewer",
                    reportPath: '~/Resources/docs/sales-by-product.rdl',
                    drillThrough: onDrillThrough
                });
});