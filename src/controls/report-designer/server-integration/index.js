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
    renderMessage();
    $(document.body).bind('submit', $.proxy(formSubmit, this));
    $(window).bind('beforeunload', $.proxy(windowUnload, this));
    var dataValue = "";
    var apiRequest = new Object({ password: "", userid: "" });

    $.ajax({
        type: "POST",
        url: "https://{your-report-server-domain}/reporting/api/site/site1/get-user-key",
        data: apiRequest,
        success: function (data) {
            dataValue = data.Token;
            var token = JSON.parse(dataValue);

            $("#designer").boldReportDesigner(
                {
                    serviceUrl: "https://{your-report-server-domain}/reporting/reportservice/api/Designer",
                    reportServerUrl: "https://{your-report-server-domain}/reporting/api/site/site1",
                    serviceAuthorizationToken: token.token_type + " " + token.access_token,
                    ajaxBeforeLoad: "onAjaxRequest"
                });
        }
    });
});

function renderMessage() {
    let demo = document.getElementsByTagName("ej-sample")[0];
    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.height = '100%';

    let textNode = document.createElement('span');
    textNode.textContent = 'To run this sample, configure your on-premises server URL and valid user credentials.';
    textNode.style.zIndex = '9999';
    container.append(textNode);
    demo.append(container);
}

function onAjaxRequest(args) {
    args.headers.push({
        Key: 'serverurl', Value: 'https://{your-report-server-domain}/reporting/api/site/site1'
    });
}