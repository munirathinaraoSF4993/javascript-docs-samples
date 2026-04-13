$("#viewer").boldReportViewer(
        {
            reportServiceUrl: "https://demos.boldreports.com/services/api/ReportViewer",
            reportPath: '~/Resources/docs/sales-order-detail.rdl',
            //Render Report Viewer in French locale
            locale: "fr-FR"
        });