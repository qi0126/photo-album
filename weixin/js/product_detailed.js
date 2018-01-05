$(function(){
  var a = window.location.hash;
  var t = a.split("#")[1];
  t = t.split("?appinstall=0")[0]; 
  // console.log(t);
  product_list(t);


    //首页轮播json图片加载
    $.ajax({
      type : "POST",
      url : "/photo-album/search/classify/?number=" + t,
      dataType : "json",
      async: false,
      data : {},
      tranditional : true,
      success: function(data){
        var index_tab_html = "";
        var index_tab_list_html = "";
        for(var i=0 ; i<data.imgs.length ; i++){
          index_tab_html += '<li><a href="#"><img src="/photo-album/image/' + data.imgs[i].img + '" width="100%" height="60"/></a></li>';
          index_tab_list_html +='<li style="display:list-item;"><a href="#"><img src="/photo-album/image/' + data.imgs[i].img + '" width="100%" height="300"/></a></li>';
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
//读取产品资料库内容
function product_list(proid){
  http.getAjax_clean("/photo-album/search/classify/?number=" + proid,
    function(data) {
      //console.log(data.imgs.length);
      //产品图片轮播
      var pro_detail_html = "";
      var pro_detail_img = "";
      for(var i = 0; i < data.imgs.length;i++){
         pro_detail_html +='<li><img src="images/product/0001.jpg" class="bannerimg" style="width:100%;"/></li>';
        pro_detail_img +='<img src="/photo-album/image/' + data.imgs[i].img + '" style="width:100%;"/><br/>';
      }

      $("#pro_detail_html").append(pro_detail_html);
      $("#pro_detail_img").append(pro_detail_img);
      $("#prduct_Size").html('<a href="#" class="on">'+ data.weight + '</a>');
      $("#pro_number,#pro_number1").html(data.number);
      $("#pro_category").html(data.category);
      $("#pro_name").html(data.name);
      $("#pro_craft").html(data.craft);
      $("#pro_material").html(data.material);
      $("#pro_weight").html(data.weight);
      $("#pro_shapes").html(data.shapes);
      $("#pro_crowd").html(data.crowd);
      $("#pro_size").html(data.size);
    });
}

//APP下载按钮判断是安卓还是IOS
function app_search(){
  var u = navigator.userAgent, app = navigator.appVersion;

  //android终端或者uc浏览器
  if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
    alert("aaa");
    // window.location.href = "http://zbtj.batar.cn:8888/photo-album/app/download/newversion";
    //window.location.href = "http://192.168.21.51:8083/weixin/Android_download.html";
  }
  //ios终端
  if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
    window.location.href = "http://fir.im/enterpriseUrl";
  }

}
