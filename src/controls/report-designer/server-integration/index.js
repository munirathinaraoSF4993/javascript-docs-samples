var isSubmit = true;

function formSubmit(args) {
    isSubmit = false;
}

function windowUnload(args) {
    var designer = $('#designer').data('boldReportDesigner');
    if (designer && designer.hasReportChanges() && isSubmit) {
        return 'Changes you made may not be saved';
    }
    isSubmit = true;
}

$(function () {
    $(document.body).bind('submit', $.proxy(formSubmit, this));
    $(window).bind('beforeunload', $.proxy(windowUnload, this));
    var dataValue = "";
    var apiRequest = new Object({
        password: "HdEW_Y9EC[$bCtg",
        userid: "demo@boldreports.com"
        });

    $.ajax({
        type: "POST",
        url: "https://adhoc.boldreports.com/reporting/api/site/site1/get-user-key",
        data: apiRequest,
        success: function (data) {
            dataValue = data.Token;
            var token = JSON.parse(dataValue);

            $("#designer").boldReportDesigner(
                {
                    serviceUrl: "https://adhoc.boldreports.com/reporting/reportservice/api/Designer",
                    reportServerUrl: "https://adhoc.boldreports.com/reporting/api/site/site1",
                    serviceAuthorizationToken: token.token_type + " " + token.access_token,
                    ajaxBeforeLoad: "onAjaxRequest"
                });
        }
    });
});

function onAjaxRequest(args) {
    args.headers.push({
        Key: 'serverurl', Value: 'https://adhoc.boldreports.com/reporting/api/site/site1'
    });
}