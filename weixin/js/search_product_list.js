var a = window.location.hash;
var t = a.slice(1);
$(function(){
  search_pro_list(t,0);
});

function search_pro_list(pro_name,page_num){
	//JSON调用列表JS
    http.getAjax_clean("/photo-album/product/product_search?key="+pro_name+"&page="+page_num+"&size=12",
    	function(data) {
        //console.log(data.page);
        var new_Product_list = "";
        var pages_htmlcode ='';
        console.log(data.totlesize);
        var pages_number=parseInt((data.totlesize-1)/12);
        for(var j = 1;j<=pages_number;j++){
          pages_htmlcode +=' <button type="button" class="pages_btn" onclick="pages_click('+j+')">'+j+'</button> ';
        }
        $("#pages_html_div").html(pages_htmlcode);
        if(data.page.length == 0){
          var new_Product_list='<li>产品搜索暂无数据</li>';
        }else{
          for(var i = 0 ; i < data.page.length;i++){
            new_Product_list +=' <li class="product_detailed">';
            new_Product_list +=' <a href="product_detailed.html#' + data.page[i].number + '" class="product_img"><img src="/photo-album/image/' + data.page[i].image + '"  width="90" height="90"/></a>';
            new_Product_list +='  <div class="product_content" style="padding-top:10px;"><a href="product_detailed.html#' + data.page[i].number + '">' + data.page[i].name + '</a><h3><span style="font-size:14px;color:#333;">产品编号：' + data.page[i].number + '</span></h3>';
            new_Product_list +='   <h2>克重：<i>' + data.page[i].number_module.split("$")[10] +'</i>克</h2></div>';
            new_Product_list +=' </li>';
          }
        }
        $("#new_Product_list").html(new_Product_list);
    });
}

function pages_click(num){
  var number = parseInt(num);
  search_pro_list(t,number);
}
