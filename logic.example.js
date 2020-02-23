const path = require('path')
const { download, getDom } = require('./src/functions')
const {urls} = require('./config')
const date = require('date-fns')
const db = require('./src/db')
const sanitize = require('./src/sanitize')

module.exports =  async function() {
  for (let url of urls) {
    const dom = await getDom(url)
    const previews = Array.prototype.slice.call(dom.querySelectorAll('.blog_preview2'), 0)

    for (let preview of previews.reverse()) {
      const link = preview.querySelector('a').href
      // {created_at, updated_at, published, title, sub_title, content, slug}
      let db_obj = {}
      // Get date field
      let created_at = preview.querySelector('.blog_preview_description')
                              .innerHTML
                              .replace(/ +(?= )/g, '')
      created_at = date.parse(created_at, 'd MMMM yyyy', new Date())
      created_at = date.format(created_at, 'yyyy-MM-dd HH:mm:ss')

      db_obj.created_at = created_at
      db_obj.updated_at = created_at

      const imgName = link.replace('\/blog\/', '')
                          .replace('?', '-')
                          .replace('=', '-')
      const linkDom = await getDom(encodeURI(link))
      db_obj.title = linkDom.querySelector('h1').innerHTML.replace(/&nbsp;/g, ' ').trim()
      let content = linkDom.querySelector('#container > div.container_inside > div.blog_columns > div.blog_column1 > div > div').innerHTML
      content = sanitize(content)
      db_obj.content = sanitize(content)
      db_obj.sub_title = null
      db_obj.slug = link
      await db(db_obj)

      const images = linkDom.querySelectorAll('.project_image')
      if (images) {
        let i = 1
        for (let image of images) {
          const imgUrl = image.src
          const imgType = path.extname(imgUrl).toLocaleLowerCase()
          await download(imgUrl, `./images/${imgName}-0${i++}${imgType}`)
        }
      }
    }
  }
}

