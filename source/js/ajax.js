/**
 * 封装简单的ajax 函数
 * @param url  请求地址
 * @param method 请求方法 get||post
 * @param async 是否异步 true 异步 || false  同步
 * @param data 发送数据,只支持post方式
 * @param Callback  回调函数(数据,对象)
 * @param type  回调数据类型 text||xml
 */
function ajax(options) {
  options = options || {};
  options.url = options.url || "";
  options.method = options.method || "GET";
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  options.async = options.async || true;
  options.success = options.success || function (response) { console.log(response) };
  options.error = options.error || function (response) { console.log(response) };

  var params = formatParams(options.data);
  //创建xhr对象 - 非IE6
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //GET POST 两种请求方式，发送请求
  if (options.type == "GET") {
    xhr.open("GET", options.url + "?" + params, options.async);
    xhr.send(null);

  } else if (options.type == "POST") {
    xhr.open("POST", options.url, options.async);
    //设置表单提交时的内容类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    xhr.send(params);
  }
  //接收，服务器响应
  xhr.onreadystatechange = function () {
  	// 请求未初始化 xmlHttp.readyState==0
    // 服务器连接已建立 xmlHttp.readyState==1
    // 请求已连接 xmlHttp.readyState==2
    // 请求处理中 xmlHttp.readyState==3
    // 请求已完成且响应已就绪
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText);
      } else {
        options.error && options.error(status);
      }
    }
  }
}
//格式化参数
function formatParams(data) {
  var arr = [];
  for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  arr.push(("v=" + Math.random()).replace(".",""));
  return arr.join("&");
}

