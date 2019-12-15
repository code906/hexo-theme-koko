// generate 404 page
// hexo.extend.generator.register('_404', function (locals) {
//   return {
//     path: '404.html',
//     data: locals.theme,
//     layout: '404'
//   };
// });

// generate tags Page
hexo.extend.generator.register('_tags', function (locals) {
  return {
    path: 'tags/index.html',
    data: locals.theme,
    layout: 'tags'
  };
});

// generate categories Page
hexo.extend.generator.register('_categories', function (locals) {
  return {
    path: 'categories/index.html',
    data: locals.theme,
    layout: 'categories'
  };
});

// generate about page
hexo.extend.generator.register('_about', function (locals) {
  return {
    path: 'about/index.html',
    data: locals.theme,
    layout: 'about'
  };
});

// generate links page
// hexo.extend.generator.register('_friends', function (locals) {
//   return {
//     path: 'friends/index.html',
//     data: locals.theme,
//     layout: 'friends'
//   };
// });

// generate galleries page
hexo.extend.generator.register('_galleries', function (locals) {
  return {
    path: 'galleries/index.html',
    data: locals.theme,
    layout: 'galleries'
  };
});

// generate lab page
// hexo.extend.generator.register('_lab', function (locals) {
//   return {
//     path: 'lab/index.html',
//     data: locals.theme,
//     layout: 'lab'
//   };
// });

const path = require('path');
hexo.extend.helper.register('about_body', function () {
  var rootPath = path.join(__dirname, '../');
  var mdPath = path.join(rootPath, hexo.theme.config.about.md_path);
  return hexo.render.renderSync({ path: mdPath });
});
