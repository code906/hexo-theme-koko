
//解析每篇文章对应多个的分类url
function assembleCategoriesUrl(post){
    //let yaml = require("js-yaml");

    var postyml,cateArray,text='',isArrayflag=false,cateResult='';
    var sectionArray=[],depth=0,dataArray=[];

    postyml = (post.raw).indexOf(post._content);
    postyml = (post.raw).substring(0,postyml);

    cateArray = (postyml).match(/(?<=(categories:))[\s\S]*(?=((\n(\S)*:)))/g);
    if(cateArray == null){cateArray = (postyml).match(/(?<=(categories:))[\s\S]*(?=(---))/g)};
    if(cateArray == null) return;
    //console.log(cateArray);
    text = cateArray != null && cateArray instanceof Array ? cateArray[0].match(/(?<=(- ))[^\n]*/g) : [];
    //console.log(text);
    for(i=0;i<text.length;i++){
        isArrayflag = (/\[|\]/g).test(text[i]);
        if(isArrayflag) break;
    }

    if(isArrayflag){
        var i,j,m='',k='',n='',temp=null,changeflag=false;
        
        for(i=0;i<text.length;i++){
            sectionArray = [];  //清空数据
            m = text[i].trim().match(/(?<=(\[))[\s\S]*(?=(\]))/g); 
            
            if(m != null){
                while(m != null && (/\[([^\[\]]*)\]/g).test(m[0])){
                    k = m[0].trim().match(/\[([^\[\]]*)\]/g);
                    for(j=0;j<k.length;j++){
                       temp = k[j].replace(/[^0-9a-zA-Z]+/g,'-');                      
                       m[0] = m[0].replace(k[j],temp);
                    }
                    changeflag = true;
                }
                //console.log(changeflag);
                if(true){
                    m[0] = m[0].replace(/(,-|-,)+/g,','); 
                    k = m[0].split(',');
                    //console.log(k);
                    for(j=0;j<k.length;j++){
                        k[j] = k[j].replace(/(^[^0-9a-zA-Z]+)|([^0-9a-zA-Z]+$)/g,'');
                        sectionArray.push(k[j]);
                    }
                    depth = j;

                    m[0] = k.join('/');
                    changeflag = false;
                } 
                //console.log(m);
            }else{

                    n = text[i].trim().replace(/[^0-9a-zA-Z]+/g,'-');
                    sectionArray.push(n);
                    depth = 1;
            }

            m = m != null ? ('/' + m[0]) : ('/' + text[i].trim().replace(/[^0-9a-zA-Z]+/g,'-'));
            
            dataArray.push({
                categoryUrl: m,
                sectionArray: sectionArray,
                depth: depth,
                data: {
                    postName: post.title,
                    postId: post._id,
                    postPath: post.path,
                    postContent: post.content,
                    postMore: post.more,
                    postData: post.date,
                    postTags: post.tags,
                    postCategories: post.categories
                }
            });
        }
        cateResult = dataArray;
    }else{
        var i=0,m='';
        for(i=0;i<text.length;i++){
            m += '/' + (text[i].trim().replace(/[^0-9a-zA-Z]+/g,'-'));
            sectionArray.push(text[i].trim().replace(/[^0-9a-zA-Z]+/g,'-'));
        }
        depth = i;

        dataArray.push({
            categoryUrl: m,
            sectionArray: sectionArray,
            depth: depth,
            data: {
                postName: post.title,
                postId: post._id,
                postPath: post.path,
                postContent: post.content,
                postMore: post.more,
                postData: post.date,
                postTags: post.tags,
                postCategories: post.categories
            }
        });
        cateResult = dataArray;
    }
    
    //console.log(cateResult);
    return cateResult;
}


//将有关系的数组转为树结构
function assembleArrayToTree(params){
    var options = {
        data: params.data,
        parentId: params.parent,
        id: params.id,
        childId: params.child,
        currentPost: params.currentpost
    };
    let tree = options.data.filter( (parent) => {

        let item = options.data.filter( (child) => {

            return parent[options.id] == child[options.parentId];
        });
        if (item.length > 0) {
            parent[options.childId] = item; 

        }

        //console.log(parent.path);
        return (typeof(parent[options.parentId]) == 'undefined' || (parent[options.parentId]) == '');
    });

    return tree;
}

//获取Categories对应的id
function getCategoriesId(categories,options) {
    var startNodeIdArray = [];
    const relativeUrl = (options.relativeUrl.indexOf('/') == 0 ? options.relativeUrl.substring(1) : options.relativeUrl) || '';
    const startNode = options.startNode || '';

    if(relativeUrl != '' && startNode !=''){
        var i=0;
        for(i=0;i<categories.length;i++){
            startNodeId = categories.data[i].path.indexOf(relativeUrl)>=0 && categories.data[i].name == startNode ? 
                         categories.data[i]._id : '';
            if(startNodeId != '') 
            { 
                return startNodeId; 
            }
        }
        //console.log(startNodeIdArray);
    }

    return null;
}


//生成html
function listCategories(categories,options) {
    if (!options && (!categories || !Object.prototype.hasOwnProperty.call(categories, 'length'))) {
        options = categories;
        categories = this.site.categories;
    }

    if (!categories || !categories.length) return '';
    options = options || {};

    const { style = 'list', transform, separator = ', ', suffix = '' } = options;
    const showCount = Object.prototype.hasOwnProperty.call(options, 'show_count') ? options.show_count : true;
    const className = options.class || 'category';
    const depth = options.depth ? parseInt(options.depth, 10) : 0;
    const orderby = options.orderby || 'name';
    const order = options.order || 1;
    const showCurrent = options.show_current || false;
    const startNodeId = options.cateId || '';

    const prepareQuery = parent => {
        const query = {};

        if (parent) {
          query.parent = parent;
        } else {
          query.parent = startNodeId == '' ? {$exists: false} : startNodeId;//parent不存在时候，将参数{$exists: false}传入集合query内的parent
        }
        //console.log(categories);
        return categories.find(query).sort(orderby, order).filter(cat => cat.length);//找某个_id值得数组，在结果中再取dare.length不为0
    };

    //并行列表
    const hierarchicalList = (level, parent) => {
        let result = '';
        //此处parent传的是某个目录节点的_id值，非名字name，因为有重名的可能
        //console.log(level);
        //console.log(parent);
        prepareQuery(parent).forEach((cat, i) => {
          let child,upath;
          if (!depth || level + 1 < depth) {
            child = hierarchicalList(level + 1, cat._id); //找到无子节点的节点，即末尾
          }

          if((cat.path).indexOf('/') > 0){ upath = '/' + cat.path;}
          else { upath = cat.path; }
          //console.log(child);
          //console.log(cat.path);
          // let isCurrent = false;
          // if (showCurrent && this.page) {
          //   for (let j = 0; j < cat.length; j++) {
          //     const post = cat.posts.data[j];
          //     if (post && post._id === this.page._id) {
          //       isCurrent = true;
          //       break;
          //     }
          //   }

          //   // special case: category page
          //   isCurrent = isCurrent || (this.page.base && this.page.base.startsWith(cat.path));
          // }
          //${isCurrent ? ' current' : ''}

          result += `<li class="list-item">`;
          result += `<span class="flex-row">`;

          result += `<a class="list-link" href="${(upath)}${suffix}">`;
          result += transform ? transform(cat.name) : cat.name;
          result += `</a>`;

          result += `<p class="slide-line"></p>`;

          if (showCount) {
            result += `<p class="list-count">(${cat.length})</p>`;
          }

          result += `</span>`;

          if (child) {
            result += `<ul class="list-child">${child}</ul>`;
          }

          result += '</li>';
        });

        return result;
    };

    return `<ul class="${className}-list">${hierarchicalList(0)}</ul>`;
}

//启动hexo时候，注册js函数，供任意ejs模板调用，因为ejs没有模块引用，防止公共代码到处copy
hexo.extend.helper.register('assembleCategoriesUrl', assembleCategoriesUrl);
hexo.extend.helper.register('assembleArrayToTree', assembleArrayToTree);
hexo.extend.helper.register('getCategoriesId', getCategoriesId);
hexo.extend.helper.register('listCategories', listCategories);