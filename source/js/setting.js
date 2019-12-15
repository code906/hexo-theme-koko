//设置cookies
function setCookie(c_name, value, expiredays) {                   
    var exp = new Date();
    exp.setTime(exp.getTime() + expiredays*24*60*60*1000);           
    document.cookie = c_name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
} 


//读取cookies 
function getCookie(c_name) {
    var arr, reg = new RegExp("(^| )" + c_name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}

// 检查cookie 
function checkCookie(c_name) {     
    username = getCookie(c_name);        
    if (username != null && username != "")     
        { return true; }     
    else
        { return false;  }
}

// 清除cookie 
function clearCookie(name) {     
    setCookie(name, "", -1); 
}

const showSubMenus = (menu) =>{
    if(menu){
        //menu.classList.add();
    }
};

const reset = ($) =>{
    let article = document.querySelectorAll('article');
    $('#setting-box-ex').on('click',$('#reset'),(event)=>{
        document.cookie = ''; 
        article.forEach((item)=>{
            item.setAttribute('style','');
        });
        setCookie('layout_fontstatus','reset',7);
    });
}

const reloadCookies = (layout,$) =>{
    if(getCookie('header_fixed') == 'true'){
        layout.classList.add('app-header-fixed');  
        $('input[name="header-fixed"]').checked=true;
    }else{
        layout.classList.remove('app-header-fixed');
    }

    if(getCookie('aside_fixed') == 'true'){
        layout.classList.add('app-aside-fixed');
        $('input[name="aside-fixed"]').checked=true;
    }else{
        layout.classList.remove('app-aside-fixed');
    }

    if(getCookie('aside_hide') == 'true'){
        layout.classList.add('app-aside-hide');
        $('input[name="aside-hide"]').checked=true;
    }else{
        layout.classList.remove('app-aside-hide');
    }

    if(getCookie('layout_box') == 'true'){
        layout.classList.add('container');
        $('input[name="layout-boxed"]').checked=true;
    }else{
        layout.classList.remove('container');
    }
    
    if(getCookie('theme_mode')){
        var temp = [];
        var themes = layout.classList;
        for(var i=0,len=themes.length;i<len;i++){
            if((/theme-/g).test(themes[i])){
                layout.classList.remove(themes[i]);
                break;
            }
        }
        layout.classList.add(getCookie('theme_mode'));
    }

    // if(getCookie('read_mode')){
    //     var temp = [];
    //     if($('article')){
    //         var bgs = $('article').classList;
    //         for(var i=0,len=bgs.length;i<len;i++){
    //             if((/bg-/g).test(bgs[i])){
    //                 bgs.classList.remove(bgs[i]);
    //                 break;
    //             }
    //         }
    //         $('article').classList.add(getCookie('read_mode'));
    //     }
    // }
};

const switchSet = (layout,a,b,c,d) =>{

    a.addEventListener('change',(event)=>{
        a.checked ? layout.classList.add('app-header-fixed') : layout.classList.remove('app-header-fixed');
        setCookie('header_fixed',a.checked,7);
    });
    b.addEventListener('change',(event)=>{
        b.checked ? layout.classList.add('app-aside-fixed') : layout.classList.remove('app-aside-fixed');
        setCookie('aside_fixed',b.checked,7);
    });   
    c.addEventListener('change',(event)=>{
        c.checked ? layout.classList.add('app-aside-hide') : layout.classList.remove('app-aside-hide');
        setCookie('aside_hide',c.checked,7);
    }); 
    d.addEventListener('change',(event)=>{
        d.checked ? layout.classList.add('container') : layout.classList.remove('container');
        setCookie('layout_box',d.checked,7);;
    }); 
};

const changeFontSizeAdd = (vnum) =>{
    var article = document.querySelectorAll('article');
    article.forEach((item) =>{
        item.setAttribute('style','font-size:calc(100% + '+ vnum +'px);line-height:calc(100% + '+ vnum +'px);');
    });
};

const changeFontSizeMinus = (vnum) =>{
    var article = document.querySelectorAll('article');
    if(vnum < 0) {vnum=0;return;}
    article.forEach((item) =>{
        item.setAttribute('style','font-size:calc(100% + '+ vnum +'px);line-height:calc(100% + '+ vnum +'px);');
    });
};

const changeFontSize = ($) =>{
    var vnum = 0;
    $('#setting-box-ex').on('click',$('#font-add'),(event)=>{
        vnum++;
        if(getCookie('layout_fontstatus') == 'reset'){
            vnum=0;
            setCookie('layout_fontstatus','');
        }
        changeFontSizeAdd(vnum);
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });
    $('#setting-box-ex').on('click',$('#font-minus'),(event)=>{
        vnum--;
        if(getCookie('layout_fontstatus') == 'reset'){
            vnum=0;
            setCookie('layout_fontstatus','');
        }
        changeFontSizeMinus(vnum);
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });
};

const changeTheme = (layout,theme) =>{
    var oldClass='';
    if(getCookie('theme_mode')){
        oldClass = getCookie('theme_mode');
    }
    theme.forEach((item,i) => {
        item.addEventListener('click',()=>{
            if(item.checked == true && !layout.classList.contains(item.value)){ 
                oldClass != '' && layout.classList.remove(oldClass);
                layout.classList.add(item.value);
                oldClass = item.value;
                setCookie('theme_mode',item.value,7);
            }
        });
    });
};

const switchReadMode = ($,$$) =>{
    var readMode = $$('input[name="readMode"]');

    readMode.forEach((item,i) => {
        $('#setting-box-ex').on('click',item,(event)=>{
            if(item.checked == true ){
                var oldClass='';
                    oldClass = getCookie('read_mode');
                var article = $$('article');
                for(var j=0,len=article.length;j<len;j++){
                        if(!article[j].classList.contains(item.value)){
                            oldClass != '' && article[j].classList.remove(oldClass);
                            article[j].classList.add(item.value);                        
                        }
                    }
                oldClass = item.value;
                setCookie('read_mode',item.value,7);
            }
        });
    });

};

function dragFunc(id) {
    var Drag = document.getElementById(id);
    Drag.onmousedown = function(event) {
        var ev = event || window.event;
        event.stopPropagation();
        var disX = ev.clientX - Drag.offsetLeft;
        var disY = ev.clientY - Drag.offsetTop;
        Drag.onmousemove = function(event) {
            var ev = event || window.event;
            //Drag.style.left = ev.clientX - disX + "px";//左右拖动
            Drag.style.top = ev.clientY - disY + "px";//上下拖动
            Drag.style.cursor = "move";
        };
    };
    Drag.onmouseup = function() {
        document.onmousemove = null;
        this.style.cursor = "default";
    };
};

//事件委托,原生实现jquery的on函数
Element.prototype.on = function(type,...arg) {
    let str,selector,data,callback;
    type = typeof type == 'object' ? 
            typeof type.length == 'number' ? type : []
            : type.split(' ');
           
    arg.forEach((item)=>{
        //str要么是一个false要么是一个字符串要么null
        if(item){
            switch(typeof item){
                case 'string': 
                    str=item;
                    break;
                case 'object':
                    if(item.toString()=="[object Object]") data=item;
                    else if(typeof item.length != 'number') selector=item;
                    break;
                case 'function':
                    callback=item;
                    break;                 
            }
        }
    });    

    function run(e) {
        if(data)e.data=data;
        if(str){
            if(e.target.tagName==str.toUpperCase()){
                callback&&callback.call(e.target,e)
            }
        }else {
            callback&&callback.call(this,e);
        }
    }

    for(let j=0,len=type.length;j<len;j++){
        if(selector){
            window.addEventListener ? selector.addEventListener(type[j],run)
                    : selector.attachEvent('on'+type[j],run);            
        }
    }
};

//Main function entry
(function () {
    var body = document.body,
        d = document,
        $ = d.querySelector.bind(d),
        $$ = d.querySelectorAll.bind(d),

        ex = $('.setting-box-ex');

    //基本显示/隐藏
    $('#setting-box-ex').addEventListener('click',(event)=>{
        ex.classList.toggle('active');
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });
    ex.addEventListener('click',(event)=>{
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;  
    });
    d.addEventListener('click', (event)=>{
        event = event || window.event;
        var target = event.target || event.srcElement;
        if(ex.classList.contains('active')) ex.classList.remove('active');
    });

    //预存Cookies数据,以便页面刷新或重载提取之前的值
    reloadCookies($('#alllayout'),$);

    //一些设置
    switchSet($('#alllayout'),
        $('input[name="header-fixed"]'),
        $('input[name="aside-fixed"]'),
        $('input[name="aside-hide"]'),
        $('input[name="layout-boxed"]'),
    );

    //手机端sub-menu 展开/收缩

    //复位
    reset($);

    //主题
    changeTheme($('#alllayout'),
        $$('input[name="theme"]')
    );

    //字体大小
    changeFontSize($);

    //阅读模式
    switchReadMode($,$$);

	//可拖动
    if(window.innerWidth<768){
         //dragFunc('setting-box');    
    }

}).call(this);

