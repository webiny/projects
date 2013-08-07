{extends file="layouts/empty.tpl"}
{block name="content"}
    <script src="//platform.linkedin.com/in.js" type="text/javascript"></script>
    <script type="IN/MemberProfile" data-id="http://www.linkedin.com/in/{$name}" data-format="inline"
            data-related="false"></script>
    <script type="text/javascript" id="process">

        $(function () {
            try {
                var interval = setInterval(function () {
                    // First try getting iframe (LinkedIn is loading it with JS so it doesn't exist at this point)
                    var liIframe = $('body').find('iframe');
                    if (liIframe.length === 0) {
                        return;
                    }
                    // Once we have the iframe - clear the interval and bind iframe load event
                    clearInterval(interval);
                    liIframe.on("load", function () {
                        var counter = 200;
                        // The final iframe height is set from within the iframe
                        var interval = setInterval(function () {
                            if(counter == 0){
                                clearInterval(interval);
                                $('#process').remove();
                                return;
                            }
                            if (liIframe.css("height") == "1px") {
                                return;
                            }
                            clearInterval(interval);
                            var iframe = window.top.document.getElementById('{$id}');
                            iframe.setAttribute("height", liIframe.css("height"));
                            iframe.setAttribute("width", liIframe.css("width"));
                        }, 50);
                    });

                }, 50);
            } catch (ex) {
                // Nothing...
            } finally {
                $('#process').remove();
            }

        });
    </script>
{/block}