
/* local search */

var dataList = null;
var inputValue = null;
//click event for the UI change

const $listInput = document.getElementById('search-list-input');
const $boxInput = document.getElementById('search-box-input');


// Get the contents from search data
const fetchData = (res,isXml) => {
	let dataList;
	NodeList.prototype.map = Array.prototype.map;
    dataList = isXml ? [...new DOMParser().parseFromString(res, 'text/xml').querySelectorAll('entry')].map(item => {
      return {
        title      : item.querySelector('title').textContent.trim() !== '' ? item.querySelector('title').textContent : 'Untitled',
        content    : item.querySelector('content').textContent,
        url        : item.querySelector('url').innerHTML,
        categories : item.querySelector('category')?item.querySelectorAll('category').map((m)=>{ return m.textContent; }): [],
        tags       : item.querySelector('tag')?item.querySelectorAll('tag').map((m)=>{ return m.textContent; }): []
      };
    }) : JSON.parse(res);
	return dataList;
};


//<(\/|\!|\?|[a-zA-Z])([^>]*)>
//Get the subscript of the search matching character
const getIndexByKeyWord = (keyWord,text,caseSensitive) => {
	let position = 0,startPosition = 0;
	let array = [];

	if(keyWord.length === 0) {	//search keyword
		return;
	}
	if(!caseSensitive){
		keyWord = keyWord.toLowerCase();
		text = text.toLowerCase();
	}

	while((position = text.indexOf(keyWord,startPosition))> -1 ) {
		array.push(position);
		startPosition = position + keyWord.length;
	}

	return ({
		keyWord  : keyWord,
		position : array
	});
};

//get some useful information from data
const MergeSearchMsg = (keyWords,text,textType,caseSensitive) => {
	let isMatch = false;
	let keyResult;
	let keyResultArray = [];
	let keyResultLen = 0;
	text = typeof text != 'undefined' ? text : '';

	keyWords.forEach((key,i) => {
		keyResult = getIndexByKeyWord(key,text,caseSensitive);
		if(keyResult.position.length > 0){
			keyResultArray.push(keyResult);
			keyResultLen = keyResult.position.length;
			isMatch = true;
		}
	});

	return ({
		isMatch        : isMatch,
		textType       : textType,
		textLength     : text.length,
		keyResultArray : keyResultArray,
		searchCount    : keyResultLen
	});
};


// Highlight title and content
const highlightKeyword = (text, textType, textLen, sliceArray) => {
	let prevStart = 0,preEnd;
	let reRext,result = '',sliceKey = '';
	let sliceArrayLen = sliceArray.length;
	
	sliceArray.forEach((slice,i)=>{
	  if(sliceKey === slice.keyWord){ return true; }	//continues to other
	  sliceKey = slice.keyWord;
	  
	  if(textType === 'content'){
	  	prevStart = prevStart<slice.position[0] ? slice.position[0] : prevStart;
	  }
	  result = '<b class="search-keyword">' + sliceKey + '</b>';
	  reRext = new RegExp(sliceKey, "g");
	  text = text.replace(reRext,result);

	});

	if(textType === 'content'){
		prevStart = prevStart-5<0 ? 0 : prevStart-5;
		preEnd = prevStart+20>textLen ? textLen : prevStart+40;
		if(prevStart>30) text = text.substr(prevStart,preEnd);
		else text = text.substr(0,100);
	}

	return text;
};

const showTotalUI = (itemNum,totalNum,$resultMsg) => {
	let resultItem = '';
	resultItem += '<p>itemNum:'+ itemNum +'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;totalNum:'+ totalNum +'</p>';
	$resultMsg.innerHTML = resultItem;
};

const showTagOrCate = (tagReArray,cateReArray,$resultMsg) => {
	let resultItem = 'tagNum( ' + tagReArray.length + ' ): ';
	for(let i=0,len=tagReArray.length;i<len;i++){
		resultItem += tagReArray[i] + ' ';
	}
	if(tagReArray.length>0){ resultItem += '<br/>categoryNum( '+ cateReArray.length +' ): '; }
	else{ resultItem = 'categoryNum( '+ cateReArray.length +' ): '; }
	for(let j=0,len=cateReArray.length;j<len;j++){
		resultItem += cateReArray[j] + '  ';
	}
	if(tagReArray.length + cateReArray.length == 0) return;
	$resultMsg.innerHTML += resultItem;
};

const showResultUI = (titleResult,contentResult,urlResult,totalNum,$resultContent) => {
	let resultItem = '';

	resultItem += '<a href="'+ urlResult +'" class="search-result-title">'+ titleResult;
	resultItem += '<p style="float:right">'+ totalNum +' result</p><br/>';
	resultItem += '<p style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">'+contentResult+'</p></a>';
	const fragment = document.createDocumentFragment();
	let newChild = document.createElement("li");
	newChild.innerHTML = resultItem;
	fragment.appendChild(newChild);
	$resultContent.append(fragment);
	return resultItem;
};


const inputSwitchList = () =>{
	var searchText = $listInput.value.trim().toLowerCase(),
        $resultMsg = document.getElementById('search-list-Msg'),
        $resultContent = document.getElementById('search-list-result'),
    	$searchList = document.getElementById('search-list');
    (searchText!=null && dataList!=null) ? $searchList.classList.add('block') : $searchList.classList.remove('block');
    inputEventFunction(searchText,$resultMsg,$resultContent);
};

const inputSwitchBox = () =>{
    var searchText = $boxInput.value.trim().toLowerCase(),
        $resultMsg = document.getElementById('search-box-Msg'),
        $resultContent = document.getElementById('search-box-result');
    
    inputEventFunction(searchText,$resultMsg,$resultContent);
};

// input Event
const inputEventFunction = (searchText,$resultMsg,$resultContent) => {
	
	let isShowTitle = false, isShowContent = false, isShowTagOrCate = false;
	let cateReArray = [], tagReArray = [];
	let itemNum=0,totalNum=0,cateCount=0,tagCount=0;
	let titleText,contentText;


	if(inputValue == searchText) return;
	if(searchText.length <= 0) return;
    var keywords = searchText.split(/[\s]+/);	//split into multiple segments
    $resultContent.innerHTML = '';
    inputValue = searchText;

    dataList.forEach(function (data) {
    	let searchCount = 0;

    	let title = data.title.trim();
    	let resultTitle = MergeSearchMsg(keywords,title,'title',false);
    	if(resultTitle.isMatch) 
    	{ 
    		searchCount += resultTitle.searchCount;
    		titleText = highlightKeyword(title,resultTitle.textType,resultTitle.textLength,resultTitle.keyResultArray); 
    		isShowTitle = true;
    	}
    	
    	let content = data.content ? data.content.trim().replace(/<(\/|\!|\?|[a-zA-Z])([^>]*)>/g,'') : '';
    	let resultContent = MergeSearchMsg(keywords,content,'content',false);
    	if(resultContent.isMatch)
    	{
    		searchCount += resultContent.searchCount;
    	    contentText = highlightKeyword(content,resultContent.textType,resultContent.textLength, resultContent.keyResultArray); 
    	    isShowContent = true;
    	}

     	let articleUrl = decodeURIComponent(data.url).replace(/\/{2,}/g,'/');

     	let tagArray = data.tags;
     	for(let m=0,len=tagArray.length;m<len;m++){
     		let resultTags = MergeSearchMsg(keywords,tagArray[m],'tags',false);
     		if(resultTags.isMatch){
     			tagReArray.push(tagArray[m]);
     			isShowTagOrCate = true;
     		}
     		tagCount = tagReArray.length;
     	}

     	let categoryArray = data.categories;
     	for(let n=0,len=tagArray.length;n<len;n++){
     		let resultCategories = MergeSearchMsg(keywords,categoryArray[n],'categories',false);
     		if(resultCategories.isMatch){
     			cateReArray.push(categoryArray[n]);
     			isShowTagOrCate = true;
     		}
     		cateCount = cateReArray.length;
     	}
     	
    	if(isShowTitle || isShowContent){
    		titleText = isShowTitle ? titleText : title;
    		contentText = isShowContent ? contentText : content;

            showResultUI(titleText,contentText,articleUrl,searchCount,$resultContent);  
            itemNum++; 
            totalNum += searchCount;
            isShowTitle = false;
            isShowContent = false;
    	}
    });
    totalNum += tagCount + cateCount;
    showTotalUI(itemNum,totalNum,$resultMsg);
    showTagOrCate(tagReArray,cateReArray,$resultMsg);

};



//Main function entry
(function () {
	// Popup Window
	let isfetched = false;
	let isXml = true;		/*ture is xml;false is json*/
	let searchPath = CONFIG.SEARCH_PATH;

	var $ = document.querySelector.bind(document),
		mask = $('#mask'),
		search_form = $('#search-form'),
		search_wrap = $('#search-wrap'),
		search_list = $('#search-list'),
		search_box_close = $('#popup-btn-close'),
		search_box = $('#search-box-popup');

	//Register click event
	//事件委托
	search_form && search_form.addEventListener('click',(e)=>{
        var target = e.target || e.srcElement;
        if(!!target){
            if (target.id.toLowerCase()==='search_search' ||
                target.parentNode.id.toLowerCase()==='search_search') {
					if(document.body.clientWidth<=768){
                        mask.classList.add('in');
                        search_box.classList.add('in');
					}else{
						search_wrap.classList.toggle('in');
						search_list.classList.remove('block');
					}
			}else if(target.id.toLowerCase()==='search_close' ||
				target.parentNode.id.toLowerCase()==='search_close'){
					if($listInput) $listInput.value = '';
			}else if(target.id.toLowerCase()==='search_expand' ||
				target.parentNode.id.toLowerCase()==='search_expand'){
					mask.classList.contains('in') ? {} : mask.classList.add('in');
					search_box.classList.add('in');
			}
		}
		e = e || window.e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	});
	search_list && search_list.addEventListener('click',(e)=>{
        var target = e.target || e.srcElement;
        e = e || window.e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    });
    search_box && search_box.addEventListener('click',(e)=>{
        var count = 3;
        var target = e.target || e.srcElement; 
        if (target.id.toLowerCase()==='popup-btn-close' ||
                target.parentNode.id.toLowerCase()==='popup-btn-close') {
        	mask.classList.remove('in');
            search_box.classList.remove('in');
        }
        while(target.tagName.toLowerCase()!=='li'&&count>0){
        	count--;
        	target=target.parentNode;        	
        }
        if(target.tagName.toLowerCase()==='li'){
            mask.classList.remove('in');
            search_box.classList.remove('in');
        }
        e = e || window.e;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    });
	document.addEventListener('click', function (event){
		if(search_list.classList.contains('block')){
			search_list.classList.remove('block');
		}
	});


	//Register a listen event
	$listInput.addEventListener('input', inputSwitchList);
	$boxInput.addEventListener('input', inputSwitchBox);

	mask && mask.addEventListener('click', ()=>{
		mask.classList.remove('in');
		search_box.classList.remove('in');
	});


	if (searchPath.length === 0) {
	    searchPath = 'search.xml';
	} else if (/json$/i.test(searchPath)) {
	    isXml = false;
	}
	const path = CONFIG.ROOT + searchPath;

  	ajax({

  		url: path,
  		type: 'get',
  		success: function(response,xml) {
  			dataList = fetchData(response,isXml);
  			//console.log(dataList);
  			//let interval = setInterval(func, 2000); //启动,func不能使用括号
			//clearInterval(interval );//停止
  		},
  		fail: function (status) {
            // 此处放失败后执行的代码
        }
  	});

}).call(this);