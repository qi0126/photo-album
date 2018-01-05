//首页读取推广类别数据
$(function(){
  //推广类别目录输入
  winonload();
  //单个产品库显示
  startup_onepro_display(1);
  //读取推广类别接口连接
  http.getAjax_clean("/photo-album/startup/get_startup", function(data) {
	  //  console.log(data.actiontype);
     if(data.image){
       $('#startsetting-img').attr("src","/photo-album/startup/image/"+data.image);
     }
    //  console.log(data.isopen);
     if(data.isopen){
       $("#startup_istf_checkout").prop('checked', true);
       $("#second_imglist").show();
     }else{
       $("#startup_istf_checkout").prop('checked', false);
       $("#second_imglist").hide();
     }
     //设置启动页时间
     $('#promo_select').val(data.showtime);
    //  console.log(data.actiontype);
    //设置推广途径
     $('#promo_settingselect').val(data.actiontype);
     switch (data.actiontype) {
       case 1:
         $("#promo_settingselect_1_div").show();
         $("#promo_settingselect_2_div").hide();
         $("#promo_settingselect_3_div").hide();
         $("#selected_promotion").html(data.name);
         break;
       case 2:
         $("#promo_settingselect_1_div").hide();
         $("#promo_settingselect_2_div").show();
         $("#promo_settingselect_3_div").hide();
         //单个产品图片显示
         var action_id = data.action;
         var post_data = new FormData();
         post_data.append('type', 0);
         post_data.append('isonline', '*');
         post_data.append('page', 1);
         post_data.append('size', 10000);
        //  console.log(data.action);
         http.postAjax_clean("/photo-album/product/get_all_product", post_data,function(data) {
          //  console.log(data);
           if(action_id){
             $(data.page).each(function(j,proelem){
              //  console.log(proelem);
               if(proelem.number == action_id){
                //  console.log(proelem);
                 $('#startsetting-smimg').attr('src','/photo-album/image/'+proelem.image)
                 $('#selected_product').html(proelem.name+':'+action_id);
               }
             });
           }
         });
         //单个产品库显示调用
         startup_onepro_display(1);
         break;
       case 3:
         $("#promo_settingselect_1_div").hide();
         $("#promo_settingselect_2_div").hide();
         $("#promo_settingselect_3_div").show();
         $('#input_setting_url').val(data.action);
         break;
       default:
     }
  });

    //权限管理适配开始
    setTimeout(function(){
      var lStorage=window.localStorage;
      var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
      // console.log(NoAuthMenu_data);
      $(NoAuthMenu_data).each(function(o,oelem){
        if(oelem.type == 1){
          // console.log(oelem.menuname);
          switch (oelem.menuname) {
            // 开启/关闭推广
            case '开启/关闭推广':
              $('#startup_istf_span').hide();
              break;
            //更换推广图片
            case '更换推广图片':
              $('input[name=img_upload]').hide();
              // $('#istel').hide();
              break;
            //编辑导航地址
            case '设置推广倒计时':
              $('#second_select_div').hide();
              break;
            //设置推广途径
            case '设置推广途径':
              $('#promo_settingselect_div').hide();
              // $('#isaddress').hide();
              break;
          }
        }
      });
    },200);
    //权限管理适配结束
});

function winonload(){
  //推广类别目录输入
  http.getAjax_clean("/photo-album/manger/get_products", function(data) {
    if(data.length !=0){
      var html = '';
      for(var k=0;k<data.length;k++){
        // console.log(data[k]);
        html += '  <input type="radio" id="'+data[k].id+'" style="margin:0 10px 0 10px;" name="selected_promo" value="'+data[k].productsname+'"/>'+data[k].productsname+'<span style="width:50px;"></span>';
        // console.log(data[k].products);
        if(data[k].products.length !=0){
          html += ':[';
          for (var i = 0; i < data[k].products.length; i++) {
            html += '  <input type="radio" id="'+data[k].products[i].productId+'" style="margin:0 10px 0 10px;" name="selected_promo" value="'+data[k].products[i].name+'"/><span style="color:#2b6aa2">'+data[k].products[i].name+'</span><span style="width:50px;"></span>';
          }
          html +=']<br/>';
        }else{
          html +='<br/>';
        }
      }
      $("#selected_promotion_body").html(html);
    }else{
      $("#selected_promotion_body").html("推广类别暂无数据，请到“推广类别”添加产品！");
    }
  });

}

//单个产品弹出框产品选择事件
function startup_onepro_display(x){
  $("#fengpage_div").html
  var post_data = new FormData();
  post_data.append('type', 0);
  post_data.append('isonline', '*');
  post_data.append('page', x);
  post_data.append('size', 12);
  http.postAjax_clean("/photo-album/product/get_all_product", post_data,function(data) {
    // console.log(x);
    // console.log(data);
    var page_num = parseInt((data.totlesize)/12)+1;
    // console.log(page_num);
    var fengpage_div_htmltext ='';

    if(x == 1){
      if(page_num != 1){
        fengpage_div_htmltext +=' <button type="button" class="btn btn-warning btn-lg" onclick="startup_onepro_display('+(x+1)+')">下一页</button> ';
      }
    }else{
      if(x == page_num){
        fengpage_div_htmltext +='<button type="button" class="btn btn-default btn-lg" onclick="startup_onepro_display('+(x-1)+')">上一页</button>';
      }else{
        fengpage_div_htmltext +='<button type="button" class="btn btn-default btn-lg" onclick="startup_onepro_display('+(x-1)+')">上一页</button> <button type="button" class="btn btn-warning btn-lg" onclick="startup_onepro_display('+(x+1)+')">下一页</button> ';
      }
    }

    fengpage_div_htmltext += '共有<span class="spanfont">'+(data.totlesize)+'</span>个产品,现在第<span class="spanfont">'+x+'</span>页';
    $("#fengpage_div").html(fengpage_div_htmltext);
    var onepro_div_htmltext='\
     <div class="modal-body" style="max-height:580px;min-height:200px;padding:0px;" id="newpro_img_list_div">';
     // console.log(data.page);
     $(data.page).each(function(i,elem){
       // console.log(elem);
       onepro_div_htmltext+='<div class="promotion_img_list">\
         <div class="promotion_img_list_uth">\
          \
           <img src="/photo-album/image/'+data.page[i].image+'" style="width:100%;max-height:155px;"/>\
         </div>\
        '+data.page[i].name+'<br/>\
         <input name="newPro_submit" type="radio" value="'+data.page[i].number+'" style="margin:0;"/>选中 - '+data.page[i].number+'\
       </div>\
       ';
     });
     onepro_div_htmltext+='</div>';
    $('#onepro-div').html(onepro_div_htmltext);
  });
}

//启动推广设置开启或关闭按钮
function startup_istf(elem){
  if(elem.checked){
    // $("#second_imglist").show();
    var post_data = new FormData();
    post_data.append('isopen', 1);
    http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
      console.log(data);
    });
  }else{
    // $("#second_imglist").hide();
    var post_data = new FormData();
    post_data.append('isopen', 0);
    http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
      console.log(data);
    });
  }
  // console.log($(elem).val);
}

//上传图片JS
function uploadFile(){
  var upload_file =document.getElementById("upload").files[0];
  // console.log(upload_file);
  if(upload_file){
    var post_data = new FormData();
    post_data.append('file', upload_file);
    http.postAjax_clean("/photo-album/startup/update_image", post_data,function(data) {
      // console.log(data);
      location.reload();
    });
  }else{
    alert("未选择图片文件,请重新选择！");
  }
}

//“倒计时时间”修改设置
function second_select_num(elem){
  // console.log($(elem)[0].value);
  var post_data = new FormData();
  post_data.append('showtime',$(elem)[0].value);
  http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
    console.log(data);
  });
}


//设置推广途径下拉框
function promo_settingselect_fun(elem){
  // console.log(elem.value);
  var post_data = new FormData();
  post_data.append('actiontype',elem.value);
  http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
    // console.log(data);
  });
  switch (elem.value) {
    case "1":
      $("#promo_settingselect_1_div").show();
      $("#promo_settingselect_2_div").hide();
      $("#promo_settingselect_3_div").hide();
      break;
    case "2":
      $("#promo_settingselect_1_div").hide();
      $("#promo_settingselect_2_div").show();
      $("#promo_settingselect_3_div").hide();
      break;
    case "3":
      $("#promo_settingselect_1_div").hide();
      $("#promo_settingselect_2_div").hide();
      $("#promo_settingselect_3_div").show();
      break;
    default:
  }
}
//3保存URL地址
function input_setting_url_fun(x){
  // console.log(x);
  // console.log($('#input_setting_url').val());
  var post_data = new FormData();
  post_data.append('actiontype',x);
  post_data.append('action',$('#input_setting_url').val());
  http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
    // console.log(data);
  });
}
//2保存单个产品“提交更改产品”按钮
function startup_onepro_fun(x){
  // console.log($('#onepro-div input[type="radio"]:checked').length);
  if($('#onepro-div input[type="radio"]:checked').length == 1){
    var onepro_checkbox = $('#onepro-div input[type="radio"]:checked');
    // console.log(onepro_checkbox);
    var post_data = new FormData();
    post_data.append('actiontype',x);
    post_data.append('action',onepro_checkbox[0].value);
    http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
      // console.log(data);
      location.reload();
    });
  }else{
    alert("还没有选择产品，请重新选择！");
  }
}

//1“提交更改推广类别”按钮事件
function selected_promotion_submit(x){
  // console.log(x);
  var selected_promotion_radio = $("#selected_promotion_body input[type='radio']:checked");
  // console.log(selected_promotion_radio[0]);
  if(selected_promotion_radio.length != 0){
    // console.log(selected_promotion_radio[0].value);
    var selected_promotion_action_text =selected_promotion_radio[0].value+'-'+selected_promotion_radio[0].id;
    var post_data = new FormData();
    post_data.append('actiontype',x);
    post_data.append('action',selected_promotion_radio[0].id);
    post_data.append('name',selected_promotion_radio[0].value);
    http.postAjax_clean("/photo-album/startup/set_startup", post_data,function(data) {
      // console.log(data);
      location.reload();
    });
  }
}

function search_pro_input(elem){
  // console.log($(elem)[0].value);
  var data_display_display = [];

  var post_data = new FormData();
  post_data.append('type', 0);
  post_data.append('isonline', '*');
  post_data.append('page', 1);
  post_data.append('size', 10000);
 //  console.log(data.action);
  http.postAjax_clean("/photo-album/product/get_all_product", post_data,function(data) {
    // console.log(data.page);
    $(data.page).each(function(i,ielem){
      // console.log(ielem.name.indexOf($(elem)[0].value));
      if($(elem)[0].value != ""){
        if(ielem.name.indexOf($(elem)[0].value)>=0){
          // console.log(data.page[i]);
          data_display_display.push(data.page[i]);
        }
        if((ielem.number.toUpperCase()).indexOf($(elem)[0].value.toUpperCase())>=0){
          // console.log(data.page[i]);
          data_display_display.push(data.page[i]);
        }
      }else{
        data_display_display.push(data.page[i]);
      }
    });

    // console.log(data_display_display);
    var lStorage=window.localStorage;
    lStorage.data_display = JSON.stringify(data_display_display);
    // console.log(lStorage);
    fengpage_btn(1);
  });

}

function fengpage_btn(x){
  var lStorage=window.localStorage;
  // console.log(JSON.parse(lStorage.data_display));
  var prolsit = JSON.parse(lStorage.data_display)
  var page_num = parseInt(prolsit.length/12)+1;
  // console.log(prolsit.length);
  // console.log(page_num);
  //内容显示
  var onepro_div_htmltext='<div class="modal-body" style="max-height:580px;min-height:200px;padding:0px;" id="newpro_img_list_div">';
    // console.log(data_display_display);
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
  $('#onepro-div').html(onepro_div_htmltext);

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

  fengpage_div_htmltext += '共有<span class="spanfont">'+(prolsit.length)+'</span>个产品,现在第<span class="spanfont">'+x+'</span>页,共'+page_num+'页!';
  $("#fengpage_div").html(fengpage_div_htmltext);




}
