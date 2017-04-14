$(function(){
  var u = navigator.userAgent, app = navigator.appVersion;

  //android终端或者uc浏览器
  if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){

   $("#app01").show();
   $("#app02").hide();
  }
  //ios终端
  if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
   $("#app01").hide();
   $("#app02").show();
  }
  winlogin();
  newpro_list();
  hotpro_list();
  //产品输入框添加产品列表提示
  var search_product_datalist = "";
  http.getAjax_clean("/photo-album/image/getdir_number", function(data){
    $.each(data, function(i, field){
      //console.log(field);
      search_product_datalist += '<option value="' + i + '">';
    });
    $("#search_product_datalist").append(search_product_datalist);
  });

  //首页轮播json图片加载
  $.ajax({
    type : "POST",
    url : "/photo-album/manger/miantab",
    dataType : "json",
    async: false,
    data : {},
    tranditional : true,
    success: function(data){
      // console.log(data);
      var index_tab_html = "";
      var index_tab_list_html = "";
      for(var i=0 ; i<data[0].image.length ; i++){
        index_tab_html += '<li><a href="#"><img src="/photo-album/index/image_tab/' + data[0].image[i].name + '" width="80" height="60"/></a></li>';
        index_tab_list_html +='<li style="display:list-item;"><a href="#"><img src="/photo-album/index/image_tab/' + data[0].image[i].name + '" width="100%" height="190"/></a></li>';
      }
      $("#index_tab_img").append(index_tab_html);
      $("#index_tab_list_img").append(index_tab_list_html);
    },
   error:function(){
    alert("数据连接失败！");
   }



  });
  //首页轮播JS调用
  $(document).ready(function(){
    //幻灯片调用
    slider.init({
      'id': $('#PicSlide'),
      way:'left',
      interval:4000
    });
  });

});

//用户登记COSSION
function winlogin(){
  var post_data = new FormData();
  post_data.append("username","batar");
  post_data.append("password","shang");
    http.postAjax_clean("/photo-album/login",post_data,
      function(data) {
        //console.log(data);
      });
}
//新款产品列表
function newpro_list(){
	//JSON调用列表JS
    http.getAjax_clean("/photo-album/index/newProduct",
    	function(data) {
        var newProduct_list = "";
        if(data.length == 0){
          var newProduct_list='<ul><li>新款产品暂无数据</li></ul>';
        }else{
          for(var i = 0 ; i < data.length;i++){
            newProduct_list +=' <ul>';
            newProduct_list +='  <div class="Spacing">';
            newProduct_list +='   <li class="hot_img"><a href="product_detailed.html#' + data[i].number+ '"><img src="/photo-album/image/' + data[i].image + '"></a></li>';
            newProduct_list +='   <li class="title_name"><a href="product_detailed.html#' + data[i].number + '">' + data[i].name + '</a></li>';
            newProduct_list +='  </div>';
            newProduct_list +=' </ul>';
          }
        }
        $("#newProduct_list").append(newProduct_list);
    });
}
//人气产品列表
function hotpro_list(){
	//JSON调用列表JS
    http.getAjax_clean("/photo-album/index/popularity",
    	function(data) {
        //console.log(data);
        var hotProduct_list = "";
        if(data.length == 0){
          var hotProduct_list='<ul><li>人气产品暂无数据</li></ul>';
        }else{
          for(var i = 0 ; i < data.length;i++){
            //console.log(data[i].number.split("$")[8]);
            hotProduct_list +=' <ul>';
            hotProduct_list +='    <div class="Spacing">';
            hotProduct_list +='      <li class="hot_img"><a href="product_detailed.html#' + data[i].number + '"><img src="/photo-album/image/' + data[i].image + '"></a></li>';
            hotProduct_list +='      <li class="title_name"><a href="product_detailed.html#' + data[i].number + '">' + data[i].name + '</a></li>';
            hotProduct_list +='    </div>';
            hotProduct_list +=' </ul>';
          }
        }
        $("#hotpro_list").append(hotProduct_list);
    });
}

//关闭app下载提示选项
function close_appdiv(){
  $("#appdiv").css('display','none');
}

//首页产品编码查询
function search_product(elem){
  //console.log($("#search_product").val());
  var search_product_name =$("#search_product").val();
  var search_url = "search_product_list.html#" + search_product_name;
  window.location.href= search_url;
}

//APP下载按钮判断是安卓还是IOS
function app_search(){
  var u = navigator.userAgent, app = navigator.appVersion;

  //android终端或者uc浏览器
  if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
    // window.location.href = "http://zbtj.batar.cn:8888/photo-album/app/download/newversion";
    //window.location.href = "http://192.168.21.51:8083/weixin/Android_download.html";
  }
  //ios终端
  if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
    window.location.href = "http://fir.im/enterpriseUrl";
  }

}
