$(function(){
  //winlogin();
  new_pro_list();
});

function new_pro_list(){
	//JSON调用列表JS
    http.getAjax_clean("/photo-album/index/newProduct",
    	function(data) {
        console.log(data);
        var new_Product_list = "";
        if(data.length == 0){
          var new_Product_list='<li>新款产品暂无数据</li>';
        }else{
          for(var i = 0 ; i < data.length;i++){
            new_Product_list +=' <li class="product_detailed">';
            new_Product_list +=' <a href="product_detailed.html#' + data[i].number + '" class="product_img"><img src="/photo-album/image/' + data[i].image + '"  width="90" height="90"/></a>';
            new_Product_list +='  <div class="product_content" style="padding-top:10px;"><a href="product_detailed.html#' + data[i].number + '">' + data[i].name + '</a><h3><span style="font-size:14px;color:#333;">产品编号：' + data[i].number.split("$")[8] + '</span></h3>';
            new_Product_list +='   <h2>克重：<i>' + data[i].number.split("$")[10] +'</i>克</h2></div>';
            new_Product_list +=' </li>';
          }
        }
        $("#new_Product_list").append(new_Product_list);

    });
}
