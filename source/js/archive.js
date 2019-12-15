
var s = {
	
    /*获取坐标*/
	getPos : (node) =>{
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return {top:pos.top + scrollt, right:pos.right + scrollx, bottom:pos.bottom + scrollt, left:pos.left + scrollx }		
	},

	//constructor : this,

	initialize : function (options) {
        var inputId = options.inputId;
        this.input = document.querySelector(inputId);
        this.input.autocomplete="off";
        this.boxId = options.boxId;
        this.selectData = options.selectData;
        this._template = options._template;
        this.placeholder = options.placeholder;
        //this.inputEvent();
        this.createWarp();
        this.createSearchUl();
	},

    /*创建wrap框架，一个UI界面*/
	createWarp : function(){
        //如果已经创建了warp，不重复创建
        var idName = '#'+this.boxId;
        var wrap = document.querySelector(idName);
        if(wrap) { return; }

        //初始化
		var that = this;
        var inputPos = that.getPos(that.input);
        var div = that.rootDiv = document.createElement('div');
 
        // 设置DIV阻止冒泡
        that.rootDiv.addEventListener('click',function(event){
            event = event || window.event;
            event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        });

        // 设置点击文档隐藏弹出的选择框
        // document.addEventListener('click', function (event){
        //     event = event || window.event;
        //     var target = event.target || event.srcElement;
        //     if(target == that.input) return false;

        //     if (that.menuBarBox) that.menuBarBox.classList.add('hide');
        //     if (that.ul) that.ul.classList.add('hide');
        //     if(that.myIframe) that.myIframe.classList.add('hide');
        // });
        // if(window.innerWidth>768){
        //     window.onresize = function() {
        //         if (that.menuBarBox) that.menuBarBox.classList.add('hide');
        //     };            
        // }


        div.className = 'archiveBarSelector';
        div.style.position = 'absolute';
        div.style.left = inputPos.left + 'px';
        div.style.top = inputPos.bottom + 'px';
        div.style.zIndex = 5;

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        var isIe = (document.all) ? true : false;
        var isIE6 = that.isIE6 = isIe && !window.XMLHttpRequest;
        if(isIE6){
            var myIframe = that.myIframe =  document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            that.rootDiv.appendChild(that.myIframe);
        }

        var childdiv = that.menuBarBox = document.createElement('div');
        childdiv.className = 'archiveBarBox';
        childdiv.id = this.boxId;
        childdiv.innerHTML = this._template.join('');
        var hotmenuBar = that.hotmenuBar =  document.createElement('div');
        hotmenuBar.className = 'hotmenuBar';
        childdiv.appendChild(hotmenuBar);
        div.appendChild(childdiv);
        that.createHotmenuBar();
    },

    /*在创建的wrap框架基础上，添加数据*/
    createHotmenuBar : function(){
        var odiv,odl,odt,odd,odda=[],str,key,ckey,sortKey,
            regEx = /^([1-9]\d*)\|([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)$/g,
            DataBox = this.selectData,
            firstFlag = true;

            DataBox.forEach((dataItem,i) => {

                if((key = i%4) == 0){ //每4个json表格数据创建一个页面
                    odiv = this[key] = document.createElement('div');//创建一个界面，往界面填表格数据
                    // 先设置全部隐藏hide
                    odiv.className = 'page-'+ key + ' ' + 'archiveBarTab hide';
                }
                

                {
                    odl = document.createElement('dl');
                    odt = document.createElement('dt');
                    odd = document.createElement('dd');
                    odt.innerHTML = '<a href="#" data-type="year" title=' + dataItem.year  +'>' + dataItem.year + '</a>';
                    
                    odda = [];
                    for(var m=0,n=dataItem.months.length;m<n;m++){
                        var content = (/([\u4E00-\u9FA5\uf900-\ufa2d]+)/g).exec(dataItem.months[m])[0]; //取中文显示
                        var num = (/([1-9]\d*)/g).exec(dataItem.months[m])[0]; //取数字显示
                        str = '<a href="#" data-type="months" title=' + dataItem.year + '/' + num +'>' + content + '</a>';
                        odda.push(str);
                    }
                    odd.innerHTML = odda.join('');
                    odl.appendChild(odt);
                    odl.appendChild(odd);
                    odiv.appendChild(odl);
                }
                // 移除第一个div的隐藏CSS
                if(firstFlag == true){   
                	odiv.classList.remove('hide');
                    firstFlag = false;
                }
                
                this.hotmenuBar.appendChild(odiv);
                

        });
        document.body.appendChild(this.rootDiv);
        /* IE6 */
        this.changeIframe();

        //this.searchLiBarEvent();    //去除模板_template的input后，该函数失效
        //this.tabChange();
        //this.hotMenulinkEvent();
    },

    /*在创建的wrap框架基础上，tabs切换*/
    tabChange : function(){
        var lis = this.menuBarBox.querySelectorAll('li');        
        var divs = this.hotmenuBar.querySelectorAll('div');
        var that = this;
        for(var i=0,n=lis.length;i<n;i++){
            lis[i].index = i;
            lis[i].onclick = function(){
                for(var j=0;j<n;j++){
                	lis[j].classList.remove('on');
                	divs[j].classList.add('hide');
                }
                this.classList.add('on');
                divs[this.index].classList.remove('hide');

                /* IE6 改变TAB的时候 改变Iframe 大小*/
                that.changeIframe();
            };
        }
    },

    searchResultUl:function(monthN,monthC,year){
        var str;
        str = '<li title = '+ year +'/'+ monthN +' data-type="months"><b class="archiveBarname">' + year + '</b><b class="archiveBarspell">' + monthC + '</b></li>';
        return str;
    },

    /*在创建的wrap框架基础上，搜索结果界面*/
    createSearchUl :function (value=null) {
        var searchData = this.selectData;
        var that = this;
        var str,match = null,searchResult=[];
        var regExChiese = /[\u4e00-\u9fa5]+/g,
            regExNum = /([1-9]\d*)/g,
            regExEnglish = /([a-zA-Z]+)/g;

        var value = value || this.input.value.trim();
        // 当value不等于空的时候执行
        if (value !== '') {
            //var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            var reg = new RegExp( value, 'i');
            // 此处需设置中文输入法也可用onpropertychange

            searchData.forEach((dataItem,i) => {
                if(dataItem.months instanceof Array){
                    for(var i=0,len=dataItem.months.length;i<len;i++){
                        if(reg.test(dataItem.months[i])){
                            var monthNum = regExNum.exec(dataItem.months[i]);
                            //var monthEN = regExEnglish.exec(dataItem.months[i]);
                            var monthCN = regExChiese.exec(dataItem.months[i]);
                            searchResult.push(that.searchResultUl(monthNum[0],monthCN[0],dataItem.year));
                        }
                    }
                }
            });

            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到数据 "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.id = 'archiveBarSlide';
                ul.className = 'archiveBarslide';//hide
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && this.ul.classList.contains('hide')) {
                this.count = 0;
                this.ul.classList.remove('hide');
            }
            this.ul.innerHTML = searchResult.join('');
            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            //this.searchLiEvent();
        }else{
        	this.ul && this.ul.classList.add('hide');
        	this.menuBarBox && this.menuBarBox.classList.remove('hide');
        	this.myIframe && this.myIframe.classList.remove('hide');

            this.changeIframe();
        }
    },

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    changeIframe:function(){
        if(!this.isIE6)return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    } 
}


var Vmoment = {

    /* HTML模板 */
    _template : [
        '<p class="tip">年月(支持汉字/英文/数字搜索)</p>',
        '<input id="searchArchiveBar" class="archiveSearchBar">',
        '<ul id="menul">',
        // '<li><input type="text" id="menuBarSearch"/></li>',
        '<li class="on" data-type="tabs">年月数据</li>',
        //'<li data-type="tabs">2016~2019</li>',
        //'<li data-type="tabs">2020~2023</li>',
        '</ul>',
    ],

    menuBarSelector : function () {
        arguments[0]._template = Vmoment._template;
        this.initialize.apply(this, arguments);
    }
};


const wrapEvent = (dataItem,inputBar) =>{
		var dataType = dataItem.getAttribute('data-type');
        if(dataType==='year' && inputBar)
        {
            var result = dataItem.getAttribute('title');
            inputBar.value=result;
            inputBar.setAttribute('data-result',result);
            var m = inputBar.nextElementSibling;
            m.setAttribute('href','/archives/' + result)
        }else if(dataType==='months' && inputBar){
            var result = dataItem.getAttribute('title');
            inputBar.value=result;
            inputBar.setAttribute('data-result',result);
            var m = inputBar.nextElementSibling;
            m.setAttribute('href','/archives/' + result)
        }
};

const slideEvent = (inputBar) =>{
    var slide = document.querySelector('#archiveBarSlide');
    slide && slide.addEventListener('click',e=>{
        var target = e.target || e.srcElement;
        var dataItem = target.getAttribute('title')?target:
                    target.parentNode.getAttribute('title')?target:
                    null;
        if(dataItem){
            wrapEvent(dataItem,inputBar);
        }
    });
};

const addWrapListener = (wrap,inputBar,archives) =>{
	wrap && wrap.addEventListener('click',e=>{
		var target = e.target || e.srcElement;
		if(target.getAttribute('data-type')==='year'){
				wrapEvent(target,inputBar);
		}else if(target.getAttribute('data-type')==='months'){
				wrapEvent(target,inputBar);
		}else if(target.getAttribute('data-type')==='tabs'){
				//console.log('tabs');
		}
	});
	var search = wrap && wrap.querySelector('#searchArchiveBar');
	search && search.addEventListener('input',e=>{
		var n=search.parentNode.children,value = search.value,
			index=[].indexOf.call(n,search);
		if(value!=''){
			for(var i=index+1;i<n.length;i++){
				n[i].classList.add('none');
			}
			var h=document.querySelector('.archiveBarslide');
			h && h.classList.remove('none');
			archives.createSearchUl(value);
            slideEvent(inputBar);
		}else{
			for(var i=index+1;i<n.length;i++){
				n[i].classList.remove('none');
			}
			var h=document.querySelector('.archiveBarslide');
			h && h.classList.add('none');
		}
	});
};

//Main function entry
const archiveClick = () =>{

	var archive_json = (typeof ARCHIVE != "undefined") ? ARCHIVE.DATA.replace(/&#34;/g,'"').replace(/&#39;/g,"'") : '';
    if(archive_json == '') return;
	archive_json = JSON.parse(archive_json);
	//console.log(archive_json);

    /*input添加初始化*/
	Vmoment.menuBarSelector.prototype = s;
	const k = new Vmoment.menuBarSelector({
		inputId:'#archivesBarInput',
        boxId:'archiveBarBox',
		selectData:archive_json,
		placeholder:'请输入内容'
	});

	return k;
};

(function (w,d){
    var archives,initflag=true;
    document.addEventListener('click',e=>{
        var target = e.target || e.srcElement;
        var wrap = document.querySelector('#archiveBarBox');
        var inputBar = document.querySelector('#archivesBarInput');

        if(target.id.toLowerCase()==='archivesbarinput'){
            wrap && wrap.classList.toggle('hide');
            var inputPos = inputBar.getBoundingClientRect();
            console.log(inputPos);
            wrap && wrap.parentNode.setAttribute('style','position:absolute;left:'+ inputPos.x +'px;top:'+ (inputPos.y+inputPos.height) +'px;z-index: 5;');
            if(initflag){
                archives=archiveClick();
                initflag = false;
                wrap = document.querySelector('#archiveBarBox');
            } 
        }else{
            wrap && wrap.classList.add('hide'); 
        }
        addWrapListener(wrap,inputBar,archives);
    });
	
    /*暴露函数供外部使用*/
    var k = { archiveClick:archiveClick };
    Object.keys(k).reduce(function (g, e) {
        g[e] = k[e];
        return g
    }, w.BLOG);
})(window, document);