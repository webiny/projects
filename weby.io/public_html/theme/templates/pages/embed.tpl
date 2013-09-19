{extends file="layouts/embed.tpl"}

{block name="title"}{$weby.title}{/block}
{block name="head"}
    {include file="templates/common/linkWidgetTemplates.tpl"}
    <script type="text/javascript" id="initScript">
        var weby = {$weby->toJson()};
    </script>
{/block}
{block name="content"}
    {include file="templates/common/webyContent.tpl"}
    <div class="embed-background" style="background: url({$weby->getImage('original-screenshot')})"></div>
    <div class="loading-overlay">
        <div class="loading-title">
            <p>weby.io presents<span>{$weby.title|truncate:35:'...'}</span></p>
            <p class="click-to-see">
                <a id="playWeby" href="javascript:void(0)" class="progress-message">Click to see this Weby!</a>
                <span class="progressbar" style="width: 100%; display:none; margin-top: 6px;"><span class="percentage" style="width:0; background-color:#fff; height: 3px;"></span></span>
            </p>
        </div>
    </div>
    <div class="footer embed-footer">
        <a href="">weby.io/mywebb</a>
    </div>
    <span id="lazyLoad" style="display:none">
        <!--
        {include file="templates/pages/includes/embedIncludes.tpl"}
        {include file="templates/pages/includes/embedRemoteIncludes.tpl"}
        -->
    </span>
{/block}