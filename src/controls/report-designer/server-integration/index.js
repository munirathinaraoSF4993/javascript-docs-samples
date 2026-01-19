var isSubmit = true;
var domainName = '';

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

    if (domainName) {
        $.ajax({
            type: "POST",
            url: "https://" + domainName + "/reporting/api/site/site1/get-user-key",
            data: apiRequest,
            success: function (data) {
                var token = data && data.Token ? JSON.parse(data.Token) : null;
                if (!token || !token.token_type || !token.access_token) return showInfoMessage();

                $("#designer").boldReportDesigner(
                    {
                        serviceUrl: "https://" + domainName + "/reporting/reportservice/api/Designer",
                        reportServerUrl: "https://" + domainName + "/reporting/api/site/site1",
                        serviceAuthorizationToken: token.token_type + " " + token.access_token
                    });
            },
            error: function () {
                showInfoMessage();
            }
        });
    } else {
        showInfoMessage();
    }
});

function showInfoMessage() {
    let designerTag = document.getElementById('designer');
    let container = document.getElementById('server_info_msg');
    let textNode = container.querySelector('span');
    if (designerTag) designerTag.style.display = 'none';
    if (container && textNode) {
        container.style.display = 'flex';
        textNode.innerHTML = 'This sample uses placeholder credentials. To run it, configure your </br><b>on-premises domain</b> using the global variable <b>"domainName"</b> for concatenation</br> and provide <b>valid credentials (username and password)</b> to obtain the service authorization token.';
    }
}