/*
该文件是对markdown渲染成html后，图片相关操作
两种方法只选其一，有冲突
*/

/*第一种lightBox*/
/*把文档内的<img...>替换成设定的标签包裹*/
/*
function renderImage(src, alt = '', title = '') {
    return `<figure class="image-bubble">
                <div class="img-lightbox">
                    <div class="overlay"></div>
                    <img src="${src}" alt="${alt}" title="${title}">
                </div>
                <div class="image-caption">${title || alt}</div>
            </figure>`
}

hexo.extend.tag.register('image', ([src, alt = '', title = '']) => {
    return hexo.theme.config.lightbox ? renderImage(src, alt, title) : `<img src="${src}" alt="${alt}" title="${title}">`
})


hexo.extend.filter.register('before_post_render', data => {

    if (hexo.theme.config.lightbox) {
        // 包含图片的代码块 <escape>[\s\S]*\!\[(.*)\]\((.+)\)[\s\S]*<\/escape>
        // 行内图片 [^`]\s*\!\[(.*)\]\((.+)\)([^`]|$)
        data.content = data.content.replace(/<escape>.*\!\[(.*)\]\((.+)\).*<\/escape>|([^`]\s*|^)\!\[(.*)\]\((.+)\)([^`]|$)/gm, match => {

            // 忽略代码块中的图片
            if (/<escape>[\s\S]*<\/escape>|.?\s{3,}/.test(match)) {
                return match
            }

            return match.replace(/\!\[(.*)\]\((.+)\)/, (img, alt, src) => {
                const attrs = src.split(' ')
                const title = (attrs[1] && attrs[1].replace(/\"|\'/g, '')) || ''
                return `{% image ${attrs[0]} '${alt}' '${title}' %}`
            })
        })
    }
    return data
})
*/

/*第二种fancybox*/
/*把文档内的<img...>替换成设定的标签包裹*/

function renderImage(src, alt = '', title = '') {
    return `<figure class="image-bubble">
                <a data-fancybox="gallery" href="${src}" no-pjax data-type="image">
                    <img src="${src}" alt="${alt}" title="${title}">
                </a>
                <div class="image-caption">${title || alt}</div>
            </figure>`
}

hexo.extend.tag.register('image', ([src, alt = '', title = '']) => {
    return hexo.theme.config.fancybox ? renderImage(src, alt, title) : `<img src="${src}" alt="${alt}" title="${title}">`
})

hexo.extend.filter.register('before_post_render', data => {

    if (hexo.theme.config.fancybox) {
        // 包含图片的代码块 <escape>[\s\S]*\!\[(.*)\]\((.+)\)[\s\S]*<\/escape>
        // 行内图片 [^`]\s*\!\[(.*)\]\((.+)\)([^`]|$)
        data.content = data.content.replace(/<escape>.*\!\[(.*)\]\((.+)\).*<\/escape>|([^`]\s*|^)\!\[(.*)\]\((.+)\)([^`]|$)/gm, match => {

            // 忽略代码块中的图片
            if (/<escape>[\s\S]*<\/escape>|.?\s{3,}/.test(match)) {
                return match
            }

            return match.replace(/\!\[(.*)\]\((.+)\)/, (img, alt, src) => {
                const attrs = src.split(' ')
                const title = (attrs[1] && attrs[1].replace(/\"|\'/g, '')) || ''
                return `{% image ${attrs[0]} '${alt}' '${title}' %}`
            })
        })
    }
    return data
})

