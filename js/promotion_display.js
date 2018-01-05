var promo_id = '';
var promo_name ='';
var pro_disp_num = 0;
var temp_sumdata = [];

$.ajaxSetup({
  async: false
  });

$(function(){
  //首页读取新款产品数据
  // get_new_Product(number);
  pro_display_onload();
  var lStorage=window.localStorage;
  // console.log(lStorage);
  if(lStorage.checkpro){
    var temp_pro_json = JSON.parse(lStorage.checkpro);
    pro_img_list(temp_pro_json[0].proid,temp_pro_json[0].proname);
  }
  //权限管理适配开始
  setTimeout('Menu()',200);
  //权限管理适配结束


});

//权限事件读取
function Menu(){
  var lStorage=window.localStorage;
  var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
    $(NoAuthMenu_data).each(function(o,oelem){
      if(oelem.type == 1){
        switch (oelem.btnmark) {
          // 添加推广展示
          case 'create_category':
            $('#create_category').hide();
            break;
          //调整展示顺序
          case 'category_indexorder':
            var list_area_new_htmltext = $("#list_area_new")[0].outerHTML;
            $("#list_area_new").html(list_area_new_htmltext);
            break;
          //更换产品
          case 'category_edit_pro_btn':
            $('button[name=category_edit_pro_btn]').each(function(i,ielem){
              $(ielem).hide();
            });
            break;
        }
      }
    });
}

function pro_display_onload(){
  // var lStorage=window.localStorage;
  // console.log(lStorage.checkpro);

  //读取快速推广的接口
  http.getAjax_clean("/photo-album/index/main_model", function(data) {
    // var category_list_li_html ='';
    var list_area_new_html ='';
    if(data.length!=0){
      promo_name = data[0].name;
      var lStorage=window.localStorage;
      // console.log(lStorage);
      if(lStorage.checkpro){
        var temp_pro_json = JSON.parse(lStorage.checkpro);
        pro_img_list(temp_pro_json[0].proid,temp_pro_json[0].proname);
      }else{
        pro_img_list(data[0].id,data[0].name);
      }
      promo_id =data[0].id;
      $("#category_edit_text").html("--"+data[0].name);
      for(var i = 0;i<data.length;i++){
        if(i==0){
          list_area_new_html+='<li class="category_class" name="category_edit" id="'+data[i].id+'" style="background-color:#e99f00"><div onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="cursor: pointer;"><a id="pro-'+ data[i].id +'" onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="width:60%;padding-left:0px;">'+data[i].name+'</a><span style="width:20px;float:right;margin-right:30px;"><button id="btn-'+ data[i].id +'" onclick="del_Promotion_fun(\''+data[i].id+'\')" class="del_btn" style="padding:0px 10px 0px 10px;margin-top:5px;">X</button></span></div></li>';
          // category_list_li_html+='<li name="category_edit" id="'+data[i].name+'" style="background-color:#e99f00"><a onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="width:60%;padding-left:0px;">'+data[i].name+'</a><span style="width:20px;float:right;margin-right:30px;"><button onclick="del_Promotion_fun(\''+data[i].id+'\')" class="del_btn" style="padding:0px 10px 0px 10px;margin-top:5px;">X</button></span></li>';
        }else{
          list_area_new_html+='<li class="category_class" name="category_edit" id="'+data[i].id+'"><div onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="cursor: pointer;" ><a id="pro-'+ data[i].id +'" onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="width:60%;padding-left:0px;">'+data[i].name+'</a><span style="width:20px;float:right;margin-right:30px;"><button id="btn-'+ data[i].id +'" onclick="del_Promotion_fun(\''+data[i].id+'\')" class="del_btn" style="padding:0px 10px 0px 10px;margin-top:5px;">X</button></span></div></li>';
          // category_list_li_html+='<li name="category_edit" id="'+data[i].name+'"><a onclick="pro_img_list(\''+data[i].id+'\',\''+data[i].name+'\')" style="width:60%;padding-left:0px;">'+data[i].name+'</a><span style="width:20px;float:right;margin-right:30px;"><button onclick="del_Promotion_fun(\''+data[i].id+'\')" class="del_btn" style="padding:0px 10px 0px 10px;margin-top:5px;">X</button></span></li>';
        }
      }
      // $("#category_list_ul").html(category_list_li_html);
      $("#list_area_new").html(list_area_new_html);
    }else{
      $("#category_list_ul").html("推广展示暂无系列产品，请点“添加首页推广展示”进行添加！");
    }
  });

  //推广类别目录输入
  http.getAjax_clean("/photo-album/manger/get_products", function(data) {
    if(data.length !=0){
      var html = '';
      for(var k=0;k<data.length;k++){
        html += '<div id="div_'+data[k].id+'"><input type="radio" id="'+data[k].id+'" style="margin:0;" name="selected_promo" value="'+data[k].productsname+'"/>'+data[k].productsname + '</div>';
      }
      $("#pro_id_div").html(html);
    }else{
      $("#pro_id_div").html("推广类别暂无数据，请到“推广类别”添加产品！");
    }
  });

  $('#list_area_new').find('li').each(function(p,pelem){
    var divid_html = $('#div_'+pelem.id)[0].innerHTML;
    divid_html += ' <span style="color:red;font-size:14px;">（已选）</span>'
    $('#div_'+pelem.id).html(divid_html);
  });


  $("#list_area_new").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div></div></li>" });
  //推广展示拖动顺序
  function saveOrder() {
    var post_data = new FormData();
    $('.category_class').each(function(k,kelem){
      post_data.append('typeids', kelem.id);
    });
    http.postAjax_clean("/photo-album/manger/updateIndexPageOrderNumber", post_data,function(data) {
      if(data.code == 0){
      }else{
        alert(data.msg);
      }
    });
    //权限管理适配开始
    setTimeout('Menu()',200);
    //权限管理适配结束
  };

}




//点击左边菜单，右边产品库显示
function pro_img_list(elem,promoid){
  var temp_pro_ch = [];
  temp_pro_ch.push({"proid":elem,"proname":promoid})
  var lStorage=window.localStorage;
  lStorage.checkpro=JSON.stringify(temp_pro_ch);

  $("#category_edit_text").html("--"+promoid);
  promo_id = elem;
  promo_name = promoid;
  // console.log(promo_name);
  //菜单栏变色
  var ul_elem=$("li[name='category_edit']");
  if(ul_elem.length !=0){
    for(var i=0;i<ul_elem.length; i++){
      if(promo_id == ul_elem[i].id){
        ul_elem[i].style="background-color:#e99f00";
      }else{
        ul_elem[i].style="background-color:#2b6aa2";
      }
      // ul_elem[i].style.background-color="#000";
    }
  }
  //
  var post_data = new FormData();
  post_data.append('id', elem);
  http.postAjax_clean("/photo-album/index/main_model_id", post_data,function(data) {
    // console.log(data.page.length);
    $("#select_num").val(data.totlesize);
    if(data.page.length !=0){
      var new_Product_html="";
      for(var i = 0 ; i < data.page.length ; i++){
        // console.log(data.page[i].number);
            new_Product_html += '<tr>'
                             +'    <td><img src="/photo-album/image/'+data.page[i].image+';width=180;height=180;equalratio=1" width="120px"></td>'
                             +'    <td style="line-height:34px;text-align:left;">产品品名：'+data.page[i].name+'<br/>产品品类：'+data.page[i].category+'</td>'
                             +'    <td class="pro_number">'+data.page[i].number+'</td>'
                            //  +'    <td><button id="'+data.page[i].index+'" class="btn btn-warning" data-toggle="modal" data-target="#myModal" onclick="edit_newpro_index(\''+data.page[i].number+'\')">更换产品</button></td>'
                             +'    <td><button id="btn-'+data.page[i].number+'" class="btn btn-warning" name="category_edit_pro_btn" data-toggle="modal" data-target="#myModal" onclick="edit_newpro_index('+i+')" ondblclick="edit_newpro_index('+i+')">更换产品</button></td>'
                             +'  </tr>';
      }

      // $("#promotion_display_list").html(new_Product_html);
      $("#promotion_display_list").html(new_Product_html);
    }else{
      $("#promotion_display_list").html("<div style='padding:20px;'>此类别主题没有产品，请到“推广类别”中添加产品！</div>");
    }
  });


}
//删除系列
function del_Promotion_fun(elem){
  // console.log(elem);
  if(confirm("确认要删除推广展示类别？")){
    var post_data = new FormData();
  	post_data.append('linkedid', elem);
  	post_data.append('delete',true);
  	post_data.append('size', 8);
  	http.postAjax_clean("/photo-album/product/set_index_product", post_data,function(data) {
    	// console.log(data);
      if(data.state==true){
        location.reload();
      }else{
        alert("删除推广展示类别失败！");
      }
    });
  }
}

//产品更换后产品渲染，而不用刷新页面。
function pro_img_click_list(elem){
  var post_data = new FormData();
  post_data.append('id', elem);
  http.postAjax_clean("/photo-album/index/main_model_id", post_data,function(data) {
    // console.log(data);
    $("#select_num").val(data.totlesize);
    if(data.page.length !=0){
      var new_Product_html="";
      for(var i = 0 ; i < data.page.length ; i++){
            new_Product_html += '<tr>'
                             +'    <td><img src="/photo-album/image/'+data.page[i].image+';width=180;height=180;equalratio=1" width="120px"></td>'
                             +'    <td style="line-height:34px;text-align:left;">产品品名：'+data.page[i].name+'<br/>产品品类：'+data.page[i].category+'</td>'
                             +'    <td class="pro_number">'+data.page[i].number+'</td>'
                            //  +'    <td><button id="'+data.page[i].index+'" class="btn btn-warning" data-toggle="modal" data-target="#myModal" onclick="edit_newpro_index(\''+data.page[i].number+'\')">更换产品</button></td>'
                             +'    <td><button id="'+data.page[i].index+'" class="btn btn-warning" data-toggle="modal" onclick="edit_newpro_index('+i+')">更换产品</button></td>'
                             +'  </tr>';
      }

      // $("#promotion_display_list").html(new_Product_html);
      $("#promotion_display_list").html(new_Product_html);
    }else{
      $("#promotion_display_list").html("<div style='padding:20px;'>此类别主题没有产品，请到“推广类别”中添加产品！</div>");
    }
    //权限导入
    Menu();
  });
}

//添加首页推广展示
function add_categorydisplay_submit(){
  $("#cover").hide();
  $("#oncover").hide();
  var promo_tempname;
  var promo_tempid;
  var promo_tf = true;
  //取name和ID值
  $("input[name='selected_promo']:checked").each(function () {
     promo_tempname = $(this).context.value;
     promo_tempid = $(this).context.id;
  });
  //遍历推广展示的数据，看有没有重复
  http.getAjax_clean("/photo-album/index/main_model", function(data) {
    $(data).each(function(i,elem){
      if(elem.name == promo_tempname){
        promo_tf = false;
      }
  });

    //判断有没有重复，没有重复就添加推广展示中
    if(promo_tf){
      post_data = new FormData();
      post_data.append('linkedid', promo_tempid);
      post_data.append('size', 4);
      http.postAjax_clean("/photo-album/product/set_index_product", post_data,function(data) {
         if(data.state == true){
           location.reload();
         }else{
           alert("添加首页推广展示失败！");
           return;
         }
      });
    }else{
      alert("此“"+promo_tempname+"”类别可能已经能被添加或类别名称相同，请到“推广类别”修改名称方可重新添加至“推广展示”！");
      return;
    }
  });
}

//添加弹出框‘取消按钮’
function add_categorydisplay_cancel(){
  $("#cover").hide();
  $("#oncover").hide();
}

//首页推广产品显示个数
function select_onclick(){
  // get_new_Product($("#select_num").val());
  // console.log($("#select_num").val());
  // console.log('promo_id:'+promo_id);
  var post_data = new FormData();
  post_data.append('linkedid', promo_id);
  post_data.append('size', $("#select_num").val());
  http.postAjax_clean("/photo-album/product/set_index_product", post_data,function(data) {
     if(data.state == true){
      //  alert("添加首页推广展示成功！");
      // pro_img_click_list(promo_id);
      location.reload();
     }else{
       alert("添加首页推广展示失败！");
     }
  });
  // location.reload();
  $("#cover").hide();
  $("#oncover").hide();
}

//改变新款产品图片JS
function edit_newpro_index(elem){
  // console.log(pro_disp_num);
  pro_disp_num = elem;
  // console.log(promo_id);

  newpro_html(1,promo_id,elem);
}

//删除已经添加产品纺码的方法
function removeByValue(jsonlist, val) {
  for(var i=0; i<jsonlist.length; i++) {
    if(jsonlist[i].number == val) {
      jsonlist.splice(i, 1);
      break;
    }
  }
}

//新款产品调用产品库产品
function newpro_html(elem,promo_id,proid){
  // console.log("elem:"+elem);
  // console.log("promo_id:"+promo_id);
  // console.log("proid:"+proid);
  // promo_onload(promo_id);
    // console.log(temp_sumdata);
    // console.log("aaa");
    //读取类别名称
    var themename = '';
    http.getAjax_clean("/photo-album/index/main_model", function(data) {
      // console.log(data);
      $(data).each(function(k,kelem){
        if(kelem.id == promo_id){
          // console.log(kelem.name);
          themename =kelem.name
        }
      })
    });

    $("#myModal").html('');

    var post_data = new FormData();
    post_data.append('groupid', promo_id);
    http.postAjax_clean("/photo-album/manger/getProductListByGroupidFull", post_data,function(data) {
      // console.log(data);
      if(data.code == 0){
        var sumdata_newjson = [];
        $(data.data).each(function(k,kelem){
          // console.log(kelem);
          sumdata_newjson.push(kelem);
        });
        temp_sumdata = sumdata_newjson;
        console.log(sumdata_newjson);
        console.log(sumdata_newjson.length);
        // display_pro_js(sumdata_newjson);
        setTimeout(function () {
            //渲染弹出层
            // console.log(sumdata_newjson);
            //删除已经添加产品编码
            $('#promotion_display_list').find('.pro_number').each(function(p,pelem){
              removeByValue(sumdata_newjson,pelem.innerText);
            });
            display_pro_js(sumdata_newjson);
                // clearInterval(iCount);
        },2000);
      }else{
        alert(data.msg);
      }
    });




  function display_pro_js(temp_sumdata){
    // console.log(temp_sumdata);
      // console.log(temp_sumdata.length);
        var edit_newpro_html='';
        edit_newpro_html  +='\
                    <div class="modal-dialog" style="width:1050px;">\
                        <div class="modal-content" style="background-color:#eee;padding-left:20px;padding-right:20px;">\
                              <div class="modal-header active">\
                                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$(\'#cover\').hide()">&times;</button>\
                                  <h4 class="modal-title" id="myModalLable"><b>首页推广展示产品更换-'+themename+'</b></h4><input id="search_pro_wininput" type="text" placeholder="填写需要查找的产品或者编号" style="font-size:18px;width:300px;height:37px;"> <button type="button" class="btn btn-primary" onclick="search_pro_input(\''+promo_id+'\')">搜索产品</button></input>\
                              </div>\
                              <div class="modal-footer"  style="border-top:0;"><div id="newpro_img_list_div">';
        for(var u=((elem-1)*12);u<((elem)*12);u++){
          // console.log(u);
          if(u < temp_sumdata.length){
            edit_newpro_html  +='       <div class="promotion_img_list"><div class="promotion_img_list_uth"><img src="/photo-album/image/'+temp_sumdata[u].image+'" style="width:100%;max-height:155px;"/></div>'+temp_sumdata[u].name+'<br/><input name="newPro_submit" type="radio" value="'+temp_sumdata[u].number+'" style="margin:0;"/>选中'+temp_sumdata[u].number+'</div>   '
          }
        }
        //分页页码(每页显示12条产品)
        var subpages = Math.ceil(temp_sumdata.length/12);
        // console.log("分页页码："+subpages);
        // console.log("当前页码："+elem);
        edit_newpro_html  +='</div><div id="newpro_submit_button_subdiv"><div>';
        if(subpages != 1 && subpages != 0){
          //首页、上一页
          edit_newpro_html  +=    '<div><button class="btn btn-info" onclick="newpro_html(1,\''+promo_id+'\',\''+proid+'\')">首 页</button>';
          if(elem != 1){
            var elemlaseone = elem-1;
            edit_newpro_html  +='<button class="btn btn-default" onclick="newpro_html('+elemlaseone+',\''+promo_id+'\',\''+proid+'\')">上一页</button>';
          }
          //下一页、尾页
          if(elem != subpages){
            var elemone = elem + 1;
            edit_newpro_html  +='<button class="btn btn-warning" onclick="newpro_html(' + elemone + ',\''+promo_id+'\',\''+proid+'\')">下一页</button>';
          }
          edit_newpro_html  +='<button class="btn btn-info" onclick="newpro_html(' + subpages + ',\''+promo_id+'\',\''+proid+'\')">末 页</button>';
        }
        edit_newpro_html  +='  \
                                  总共有<span class="pagecss">'+temp_sumdata.length+'</span>款产品，目前是第<span class="pagecss" style="color:red">'+elem+'</span>页\
                                \
                                <div style="float:right;width:30%">\
                                  <button type="button" class="btn btn-default" data-dismiss="modal" onclick="$(\'#cover\').hide()">关闭</button>\
                                  <button type="button" class="btn btn-primary" onclick="newpro_submit(\''+proid+'\',\''+promo_id+'\')" data-dismiss="modal">提交更改新款产品</button>\
                                </div>\
                          </div>\
                      </div>';
          $("#myModal").html(edit_newpro_html);
          $(".modal-content").show();
          $("#cover").show();
  }

}



//弹出框更换产品按钮
function newpro_submit(elem,pro_id){
  // console.log("elem:"+elem);
  // console.log(elem);
  // console.log("pro_id:"+pro_id);
  // console.log($("input[name='newPro_submit']:checked"));
  if($("input[name='newPro_submit']:checked").length == 1){
    $("input[name='newPro_submit']:checked").each(function () {
      // console.log($(this).context.value);
      var post_data = new FormData();
      post_data.append('linkedid', pro_id);
      post_data.append('size', $("#select_num").val());
      post_data.append('number', elem);
      post_data.append('changenumber', $(this).context.value);
      http.postAjax_clean("/photo-album/product/set_index_product", post_data,function(data) {
         if(data.state == true){
           pro_img_click_list(pro_id);
           location.reload();
         }else{
           alert("添加首页推广展示失败！");
         }
      });
    });
  }else{
    location.reload();
  }
  // console.log(elem);
  // $(".modal-content").hide();
  // $('#cover').hide();
}

//新建首页推广弹出层
function add_category_btn(){
  $('#cover').show();
  $('#oncover').show();
}
//新建首页推广提交按钮
function add_category_submit(){
  $('#cover').show();
  $('#oncover').show();
}


//产品与编号搜索
function search_pro_input(proid){
  var data_display_display = [];
  // console.log(temp_sumdata);
  var search_pro_txt = $("#search_pro_wininput")[0].value;
  // console.log(search_pro_txt);
  search_pro_txt=search_pro_txt.replace(/\s+/g,"");
  $(temp_sumdata).each(function(i,ielem){
    if(search_pro_txt != ""){
      if(ielem.name.indexOf(search_pro_txt)>=0){
        data_display_display.push(ielem);
      }
      if((ielem.number.toUpperCase()).indexOf(search_pro_txt.toUpperCase())>=0){
        data_display_display.push(ielem);
      }
    }else{
      data_display_display.push(ielem);
    }
  });
  var lStorage=window.localStorage;
  lStorage.data_pro_display = JSON.stringify(data_display_display);
  // console.log(proid);
  fengpage_btn(1);
}

function fengpage_btn(x){
  var lStorage=window.localStorage;
  // console.log(lStorage);
  // console.log(JSON.parse(lStorage.data_pro_display));
  var prolsit = JSON.parse(lStorage.data_pro_display);
  // console.log(prolsit.length);
  var page_num = parseInt(prolsit.length/12)+1;
  // console.log(prolsit.length);
  // console.log(page_num);
  //内容显示
  var onepro_div_htmltext='<div class="modal-body" style="max-height:580px;min-height:200px;padding:0px;" id="newpro_img_list_div">';
    // console.log(data_display_display);
    // console.log(prolsit);
   $(prolsit).each(function(i,elem){
     if(i<(x*12)&&i>=((x-1)*12)){
      //  console.log(i);
       onepro_div_htmltext += '<div class="promotion_img_list">\
         <div class="promotion_img_list_uth">\
          \
           <img src="/photo-album/image/'+prolsit[i].image+'" style="width:100%;max-height:155px;"/>\
         </div>\
        '+prolsit[i].name+'<br/>\
         <input name="newPro_submit" type="radio" value="'+prolsit[i].number+'" style="margin:0;"/>选中 - '+prolsit[i].number+'\
       </div>\
       ';
     }
   });
   onepro_div_htmltext += '</div>';
  //  console.log(onepro_div_htmltext);
  $('#newpro_img_list_div').html(onepro_div_htmltext);

  //分页
  var fengpage_div_htmltext ='';

  if(x == 1){
    if(page_num != 1){
      fengpage_div_htmltext +=' <button type="button" class="btn btn-warning btn-lg" onclick="fengpage_btn('+(x+1)+')">下一页</button> ';
    }
  }else{
    if(x == page_num){
      fengpage_div_htmltext +='<button type="button" class="btn btn-default btn-lg" onclick="fengpage_btn('+(x-1)+')">上一页</button>';
    }else{
      fengpage_div_htmltext +='<button type="button" class="btn btn-default btn-lg" onclick="fengpage_btn('+(x-1)+')">上一页</button> <button type="button" class="btn btn-warning btn-lg" onclick="fengpage_btn('+(x+1)+')">下一页</button> ';
    }
  }

  fengpage_div_htmltext += '共有<span class="pagecss">'+(prolsit.length)+'</span>个产品,现在第<span class="pagecss" style="color:red;">'+x+'</span>页,共<span class="pagecss">'+page_num+'</span>页!';
  fengpage_div_htmltext += '\
  <div style="float:right;width:30%">\
    <button type="button" class="btn btn-default" data-dismiss="modal" onclick="$(\'#cover\').hide()">关闭</button>\
    <button type="button" class="btn btn-primary" onclick="newpro_submit(\''+pro_disp_num+'\',\''+promo_id+'\')" data-dismiss="modal">提交更改新款产品</button>\
  </div>\
  ';
  $("#newpro_submit_button_subdiv").html(fengpage_div_htmltext);
  // console.log(pro_disp_num);
  // console.log(promo_id);
  // console.log(promo_name);
}
