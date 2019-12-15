/*只有该js用了jquery，其他js文件均原生，无任何依赖*/

/*pjax-container*/
if ($.support.pjax) {
  $(document).pjax('a','#main',{
    fragment: '#main',
    timeout: 1000,
    cache: false
  });
}

$(document).on('pjax:complete', function() {
	pjax_loadtocBtn();//pjax加载完成之后调用函数
  //lazyload();
});

function pjax_loadtocBtn(){
  var toc = document.querySelector('#toc'),
      article_toc = document.querySelector('#article_toc');
	if(toc){
    article_toc.setAttribute('style','display:block');
  }else{
    article_toc.setAttribute('style','display:none');
  }
}


/*懒加载*/
// function lazyload() {  
// //对所有 img 标签进行懒加载        
//   $("img") && $("img").lazyload({
//       //设置占位图，我这里选用了一个 loading 的加载动画
//       placeholder:"../img/img-loading.png",
//       //加载效果
//       effect:"fadeIn"
//     });
// }



/*fancybox*/
/*集成fancybox, 为所有img元素添加父元素*/
// $("img").each(function () {
//    // $(this).attr("data-fancybox", "gallery"); 直接给img添加data-fancybox会导致点击图片后图片消失
//     var element = document.createElement("a");
//     $(element).attr("data-fancybox", "gallery");
//     $(element).attr("href", $(this).attr("src"));
//     $(this).wrap(element);
// });