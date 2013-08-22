{* Templates for various link types (eg. .gif, .jpg or files like .pdf, .ppt, .doc etc.) *}

{literal}
    <!-- Basic input field for pasting links which our widget will know how to handle -->
    <script type="weby/linkWidgetTemplate" id="link-widget-field-tpl">
        <div style="width: 400px" class="link-input">
            <input class="link-widget-field" id="link-widget-{id}" type="text" value="{value}"
                   placeholder="Paste a link to a file or a website"/>
            <span class="dropbox-button"></span>
            <span class="gdrive-button"></span>
        </div>
        <span class="message"></span>
    </script>

    <!-- Link template - used for web links that includes image, title and short content of site -->
    <script type="weby/linkWidgetTemplate" id="link-widget-link-tpl">
        <div class="link">
            <a href="{url}" target="_blank"><img src="{imageUrl}" height="80"/></a>
            <div class="website">
                <a href="{url}" target="_blank" class="title">{title}</a>
                <span class="description">{description}</span>
            </div>
        </div>
    </script>

    <!-- File template - used for types of files which displays basic information such as name, size etc. -->
    <script type="weby/linkWidgetTemplate" id="link-widget-file-tpl">
        <div style="400px">
            <a href="{url}" target="_blank"><span class="link-widget-type-icon type-{extension}"></span></a>
        <span class="link-widget-details">
            <table class="link-widget-file-details">
                <tr>
                    <td>Name:</td>
                    <td>{baseName}</td>
                </tr>
                <tr>
                    <td>Type:</td>
                    <td>{type}</td>
                </tr>
                <tr>
                    <td>Size:</td>
                    <td>{size}</td>
                </tr>
                <tr>
                    <td>Hosted on:</td>
                    <td>{host}</td>
                </tr>
            </table>
        </span>
        </div>
    </script>

    <!-- Image template - used for displaying images, this template doesn't include any file data -->
    <script type="weby/linkWidgetTemplate" id="link-widget-image-tpl">
        <img id="{image_id}" class="link-widget-image" src="{url}"></img>
    </script>

    <!-- Dropbox template - used for displaying files from dropbox service -->
    <script type="weby/linkWidgetTemplate" id="link-widget-dropbox-file-tpl">
        <a href="{url}" target="_blank"><span class="link-widget-type-icon type-dropbox}"></span></a>
        <span class="link-widget-details">
            <table class="link-widget-file-details">
                <tr>
                    <td>Name:</td>
                    <td>{baseName}</td>
                </tr>
                <tr>
                    <td>Type:</td>
                    <td>Drop</td>
                </tr>
                <tr>
                    <td>Size:</td>
                    <td>{size}</td>
                </tr>
                <tr>
                    <td>Hosted on:</td>
                    <td>{host}</td>
                </tr>
            </table>
        </span>
    </script>

    <!-- Error template - used for displaying error messages -->
    <script type="weby/linkWidgetTemplate" id="link-widget-error-tpl">
        <span class="link-widget-error">{message}</span>
    </script>
{/literal}