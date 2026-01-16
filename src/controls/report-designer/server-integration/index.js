var isSubmit = true;
var domainURL = '';

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
    var apiRequest = new Object({ password: "", userid: "" });

    if (domainURL !== '' && domainURL.length > 0) {
        $.ajax({
            type: "POST",
            url: "https://" + domainURL + "/reporting/api/site/site1/get-user-key",
            data: apiRequest,
            success: function (data) {
                var token = data && data.Token ? JSON.parse(data.Token) : null;
                if (!token || !token.token_type || !token.access_token) return renderMessage();

                $("#designer").boldReportDesigner(
                    {
                        serviceUrl: "https://" + domainURL + "/reporting/reportservice/api/Designer",
                        reportServerUrl: "https://" + domainURL + "/reporting/api/site/site1",
                        serviceAuthorizationToken: token.token_type + " " + token.access_token,
                        ajaxBeforeLoad: "onAjaxRequest"
                    });
            },
            error: function () {
                renderMessage();
            }
        });
    } else {
        renderMessage();
    }
});

function renderMessage() {
    let designerTag = document.getElementById('designer');
    let container = document.getElementById('sample_error_msg');
    let textNode = container.querySelector('span');
    if (designerTag) designerTag.style.display = 'none';
    if (container && textNode) {
        container.style.display = 'flex';
        textNode.textContent = 'This sample uses placeholder credentials. To run it, configure your on-premises server URL, service URL, and valid username, password to obtain the service authorization token.';
    }
}

function onAjaxRequest(args) {
    args.headers.push({
        Key: 'serverurl', Value: 'https://' + domainURL + '/reporting/api/site/site1'
    });
}