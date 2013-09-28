{literal}
    <script type="weby/tpl" id="listing-tpl">
        <div id="page{pageNumber}" class="tpl{templateNumber}"></div>
    </script>
    <script type="weby/tpl" id="listing-box-tpl">
        <div id="box-{pageNumber}-{boxNumber}" class="box{boxNumber} box">
            <div class="content" style="{screenshot}">
                <a class="image-weby-link" href="{publicUrl}"></a>
                <div class="author">
                    <a class="author-photo" href="{userUrl}"><img src="{authorAvatarUrl}"></a>
                    <a class="author-name" href="{userUrl}">{authorName}</a>
                </div>
            </div>

            <div class="weby-info">
                <h2><a class="header-url" href="{publicUrl}">{webyTitle}</h2>
                <ul>
                    <li class="favs">
                             <span>
                                 {favoritedCount}
                             </span>
                        Favs
                    </li>
                    <li class="views">
                             <span>
                                 {hitsCount}
                             </span>
                        Views
                    </li>
                    <li class="date">
                        <time class="passed" datetime="${createdOn}">{createdOn}</time>
                    </li>
                </ul>
            </div>
        </div>
    </script>
{/literal}