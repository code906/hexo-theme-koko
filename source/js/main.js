
//加载script
const loadScript = (scripts) =>{
    scripts.forEach(function (src) {
        var s = document.createElement('script');
        s.src = src;
        s.async = true;
        document.body.appendChild(s);
    })
};


//article_toc
const tocBtn = () =>{
    let body = document.querySelector('body');
    let article = document.querySelector('.post-table');
    if(article && !article.classList.contains('expand')){
        article.classList.add('expand');
        article.querySelector('#toc').addEventListener('click',(event)=>{
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
    }else if(article){
        article.classList.remove('expand');
    }
    let event = window.event || arguments.callee.caller.arguments[0];
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    activeTocPos();
};

//at rate from position scroll to destination
const goToPos = (position, destination, rate, callback) => {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
    if(position === null) position = scrollTop;//当前位置
    if (position === destination || typeof destination !== 'number') {
        return false;
    }
    destination = destination || 0;
    if(destination<0) destination = 0;
    rate = rate || 2;
    // 不存在原生`requestAnimationFrame`，用`setTimeout`模拟替代
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (fn) {
        return setTimeout(fn, 17);
        }
    }
    var step = function () {
        position = position + (destination - position) / rate;
        if (Math.abs(destination - position) < 1) {
            callback(destination, true);
            return;
        }
        callback(position, false);
        requestAnimationFrame(step);
    };
    step();
}

//goToTop
const goToTop = () => {
    let gotop = document.querySelector('#gotop');

    if(gotop){
        // 当前滚动高度
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
        goToPos(scrollTop,0,5,function (val) {
            window.scrollTo(0, val);
        });
    }
    let event = window.event || arguments.callee.caller.arguments[0];
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
};


//导航上的分享功能
const shareMenuBtn = ($,$$,event) => {
    $('#menuShare') && $('#menuShare').addEventListener('click',(event)=>{
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        let globalShare = $('#globalShare');
        globalShare.classList.toggle('in');
        globalShare.addEventListener('click',(event)=>{
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
    });
};

//微信二维码dialog
const wxShare = (el) =>{
    let event = window.event || arguments.callee.caller.arguments[0];
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    let wxShare = document.querySelector('#wxShare');
    wxShare.parentNode.classList.toggle('in');
}


//文章的分享功能
const sharePostBtn = (el) => {
    let event = window.event || arguments.callee.caller.arguments[0];
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    let barShare = document.querySelector('#barShare');
    let wxShare = document.querySelector('#wxShare');
    if(barShare){
        barShare.classList.toggle('in');
        barShare.addEventListener('click',(event)=>{
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
        //微信二维码dialog
        //有重复绑定的风险
    }
};

//文章赞赏功能
const rewardBtn = (el) => {
    let event = window.event || arguments.callee.caller.arguments[0];
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    let rewardDialog = document.querySelector('#reward-dialog');   
    if(rewardDialog){
        rewardDialog.parentNode.classList.toggle('in');
        rewardDialog.addEventListener('click',(event)=>{
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
    }
};


//关闭按钮
const closeModal = (el) => {
    let count = 5;
    while(!el.classList.contains('modal') && count>0){      
        count--;
        el = el.parentNode;
    }
    el && el.classList.remove('in');
};

/*可视区域数组下标*/
const findIndex = (entries,sections) =>{
    let index = 0;
    let entry = entries[index];
    if (entry.boundingClientRect.top > 0) {
        index = sections.indexOf(entry.target);
        return index === 0 ? 0 : index - 1;
    }
    for (;index < entries.length; index++) {
        if (entries[index].boundingClientRect.top <= 0) {
            entry = entries[index];
        } else {
            return sections.indexOf(entry.target);
        }
    }
    return sections.indexOf(entry.target);
}

/*可视区域监视*/
const createIntersectionObserver = (toc,marginTop,options) => {
    if(!toc || !marginTop || !options) return;
    marginTop = Math.floor(marginTop + 10000);
    let intersectionObserver = new IntersectionObserver((entries, observe) => {
        let scrollHeight = document.documentElement.scrollHeight + 100;
        if (scrollHeight > marginTop) {
            observe.disconnect();
            createIntersectionObserver(scrollHeight);
            return;
        }

        let index = findIndex(entries,options.sections);
        activateTocByIndex(toc,options.navItems[index]);
    }, {
        rootMargin: marginTop + 'px 0px -100% 0px',
        threshold : 0
    });

    options.sections.forEach(item => {
        item && intersectionObserver.observe(item);
    });
};

/*启动toc定位功能*/
const activeTocPos = () =>{
    var toc = document.querySelector('#toc');
    var options = registerSidebarTOC(toc);    //注册点击事件
    var scrollHeight = document.documentElement.scrollHeight;
    createIntersectionObserver(toc,scrollHeight,options);
};

/*toc变色折叠*/
const activateTocByIndex = (toc,target) =>{
    if (target.classList.contains('active-current')) return;
    toc = toc || document;
    toc.querySelectorAll('.active').forEach(element => {
        element.classList.remove('active', 'active-current');
    });
    target.classList.add('active', 'active-current');
    var parent = target.parentNode;

    while ((parent.tagName).toLowerCase() != 'nav') {//非目录顶层标签<nav>
        if (parent.matches('li')) parent.classList.add('active');
            parent = parent.parentNode;
    }
};

/*toc点击事件*/
const registerSidebarTOC = (toc) => {
    if(!toc) return;
    const navItems = toc.querySelectorAll('li');
    const sections = [...navItems].map(element => {
        var link = element.querySelector('a.post-toc-link');
        // TOC item animation navigate.
        link.addEventListener('click', event => {
            event.preventDefault();
            var target = document.getElementById(event.currentTarget.getAttribute('href').replace('#', ''));
            if(!target) return;
            var offset = target.getBoundingClientRect().top + window.scrollY;
            goToPos(null,offset-50,5,function (val) {
                window.scrollTo(0, val);
            });
        });
        return document.getElementById(link.getAttribute('href').replace('#', ''));
    });

    const tocNavTitle = toc.querySelector('title');
    tocNavTitle && tocNavTitle.addEventListener('click',(event)=>{
        event.preventDefault();
        toc.querySelector('.post-toc-wrap').classList.toggle('post-toc-expand');
    });

    return ({
        sections: sections,
        navItems: navItems
    });
}

//show toc at load first
const showTocFirst = () => {
    let toc =  document.querySelector('#toc');
    let tocBtn = document.querySelector('#article_toc');
    toc && tocBtn.setAttribute('style','display:block');
};

//tabs-bar点击，切换下拉功能
const tabBarBtn = (el) => {
    el.parentNode.parentNode.classList.toggle('expand');
};


//左侧sidebar点击按钮
const sideBarToggle = (btn,aside,mask) =>{
    let body = document.querySelector('body');
    btn.addEventListener('click',(event)=>{
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        aside.addEventListener('click',(event)=>{
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
        aside.addEventListener('touchmove',(event)=>{

            //event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
        aside.addEventListener('scroll',(event)=>{

            //event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });
        if(aside.classList.contains('expand')){
            body.classList.remove('lock');
            aside.classList.remove('expand');
        }else{
            body.classList.add('lock');
            aside.classList.add('expand');

        }
    });
};

//mask遮挡层
const maskEvent = (mask) =>{
    mask.addEventListener('touchmove',(event)=>{
        event.preventDefault();
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    });
    mask.addEventListener('scroll',(event)=>{
        event.preventDefault();
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    });
};


(function (w,d) {

    var body = d.body,
        $ = d.querySelector.bind(d),
        $$ = d.querySelectorAll.bind(d),
        root = $('html'),
        loading = $('#loading'),
        menu = $('#menu'),
        mask = $('#mask'),

        event = ('ontouchstart' in w && /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent)) ? 'touchstart' : 'click',
        isWX = /micromessenger/i.test(navigator.userAgent);

        /*mask event*/
        //maskEvent(mask);

        /*article_toc*/
        showTocFirst();

        /*toc position*/


        /*loading*/
        d.onreadystatechange = function(){
            if(d.readyState == 'complete'){
                // 页面加载完毕
                loading.classList.remove('active');
            }
        }

        /*点击按钮纹波效果*/
        if (w.innerWidth>768 && w.Waves) {
            Waves.init();
            Waves.attach('.global-share li', ['waves-block']);
            Waves.attach('.article-tag-list-link, #page-nav a, #page-nav span', ['waves-button']);
        } else {
            //console.error('Waves loading failed.')
        }

        /*gotop*/
        //暴露函数供外部使用

        /*share*//*导航上的分享按钮*/
        shareMenuBtn($,$$,event);

        /*reward*/
        //暴露函数供外部使用

        /*sideBar*/
        sideBarToggle($('#barsIcon'),$('#aside'),mask);

        /*阻止冒泡*/
        $('#wxShare') && $('#wxShare').addEventListener('click',(e)=>{
            e = e || window.e;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });

        /*document*/
        document.addEventListener('click',(e)=>{
            /*点击其他关闭dialog*/
            $('#aside') && $('#aside').classList.remove('expand');
            body.classList.remove('lock');
            if(window.innerWidth<768){$('#toc') && $('#toc').parentNode.classList.remove('expand');}
            $('#globalShare') && $('#globalShare').classList.remove('in');
            $('.modal.in') && $('.modal.in').classList.remove('in');
            $('#barShare') && $('#barShare').classList.remove('in');
            
        });
        // document.addEventListener('scroll',(event)=>{
        //     event = event || window.event;
        //     event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        //     event.preventDefault();
        // });   
        // document.addEventListener('touchmove',(event)=>{
        //     event = event || window.event;
        //     event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        //     event.preventDefault();
        // });   
        /*暴露函数供外部使用*/
        var k = { 
                  tabBarBtn:tabBarBtn , 
                  tocBtn:tocBtn , 
                  goToTop:goToTop , 
                  rewardBtn:rewardBtn ,
                  sharePostBtn:sharePostBtn , 
                  closeModal:closeModal , 
                  wxShare:wxShare
              };
        Object.keys(k).reduce(function (g, e) {
            g[e] = k[e];
            return g
        }, w.BLOG);
})(window, document);



