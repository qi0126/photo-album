var city_submit_big_list ={};
var selected_proId;
var selected_proName;

//如果点过区域保存之前所选区域ID和名称
var lStorage=window.localStorage;
// console.log(lStorage);
if(lStorage.areasetting_proId){
  selected_proId = lStorage.areasetting_proId;
}else{
  selected_proId = '';
}
if(lStorage.areasetting_proName){
  selected_proName = lStorage.areasetting_proName;
}else{
  selected_proName = '';
}

// console.log(selected_proId);
// console.log(selected_proName);

//未选择新区域（未添加为true,已经添加新区域输入框为false，false不让添加）
var newarea_tf = true;

$(function(){
  //权限管理适配开始
  setTimeout('menu()',200);
  //权限管理适配结束

  //左边区域读取
  area_leftmenu('',1);

  //默认全部城市json读取
  // city_onload();
});

//左边区域读取
function area_leftmenu(elem,number){
  var temp_proId;
  var post_data = new FormData();
  post_data.append('name', elem);
  http.postAjax_clean("/photo-album/areamanager/findSaleArea", post_data,function(data) {
    if(data.code == 0){
      if(data.data != false){
        var area_leftmenu_list_div ='';
        $(data.data).each(function(i,ielem){
          // console.log(ielem);
          // console.log(ielem.sAreas);
          if(ielem.sAreas == null){
            //没有子区域
            area_leftmenu_list_div+='\
                <div class="panel panel-default">\
                  <button id="area_btn_' + ielem.areaId + '" class="area_btn_class"  data-toggle="collapse" data-parent="#accordion" href="#collapse_'+ielem.areaId+'" onclick="bigarea_click(\''+ ielem.areaId +'\',\''+ielem.areaName+'\')">'+ielem.areaName+'</button>\
                  <div class="area_del_class" onclick="bigarea_del_click(\''+ielem.areaId+'\')">删除</div>\
                  <div class="area_del_class" onclick="bigarea_addsmall_click(\''+ielem.areaId+'\')">+</div>\
                  <div id="collapse_'+ielem.areaId+'" class="panel-collapse collapse">\
                    <ul class="list-group" id="collapse_subul_'+ielem.areaId+'" >\
                    </ul>\
                  </div>\
                </div>\
            ';
          }else{
            area_leftmenu_list_div+='\
                <div class="panel panel-default">\
                    <button id="area_btn_' + ielem.areaId + '" class="area_btn_class" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+ielem.areaId+'" onclick="bigarea_click(\''+ielem.areaId+'\',\''+ielem.areaName+'\')">\
                        '+ielem.areaName+'\
                        <span id="span1" class="spanclass">▼</span>\
                    </button>\
                    <div class="area_del_class" onclick="bigarea_del_click(\''+ielem.areaId+'\')">删除</div>\
                    <div class="area_del_class" onclick="bigarea_addsmall_click(\''+ielem.areaId+'\')">+</div>\
                    <div id="collapse_'+ielem.areaId+'" class="panel-collapse collapse">\
                      <ul class="list-group" id="collapse_subul_'+ielem.areaId+'" >\
                      ';
            $(ielem.sAreas).each(function(k,kelem){
              // console.log(kelem);
              area_leftmenu_list_div+='<li id="area_sub_'+kelem.areaId+'" class="list-group-item">\
                  <button onclick="subarea_click(\''+kelem.areaId+'\',\''+kelem.areaName+'\',\''+ielem.areaId+'\')" class="subarea_click_class">'+kelem.areaName+'</button>\
                  <div class="area_del_class" onclick="smallarea_del_click(\''+kelem.areaId+'\')">删除</div>\
                </li>';
            });
            area_leftmenu_list_div+='\
                      </ul>\
                    </div>\
                </div>\
            ';
          }
        });
        $('#area_leftmenu_list').html(area_leftmenu_list_div);
        var lStorage=window.localStorage;
        // console.log(lStorage.areasetting_parentId);
        if(lStorage.areasetting_parentId == ''){
          if(selected_proId != ''){
            //已经选择过区域
            bigarea_click(selected_proId,selected_proName);
          }else{
            //第一次进系统或没缓存时
            bigarea_click(data.data[0].areaId,data.data[0].areaName);
          }
        }else{
          //已经选择过区域
          var lStorage=window.localStorage;
          // console.log(lStorage);
          // console.log($('#collapse_'+lStorage.areasetting_parentId));
          $('#collapse_'+lStorage.areasetting_parentId).addClass("in");
          subarea_click(selected_proId,selected_proName,lStorage.areasetting_parentId);
        }
        // console.log(number);
        if(number == 2){
          var lStorage=window.localStorage;
          lStorage.areasetting_proId = data.data[0].areaId;
          lStorage.areasetting_proName = data.data[0].areaName;
          // console.log(lStorage);
        }
      }else{
        $('#area_leftmenu_list').html('<div>没有合适的区域！</div>')
      }
    }else{
      alert(data.msg);
    }

  });
  // setTimeout('console.log('+temp_proId+')',100);
}

//区域搜索按钮
function area_search_btn(){
  area_leftmenu($('#area_search_input')[0].value,2);
  newarea_tf = true;

  //搜索定位是第一个区域
  var lStorage=window.localStorage;
  // console.log(lStorage);
  setTimeout(function(){
    bigarea_click(lStorage.areasetting_proId,lStorage.areasetting_proName)
  },200);


}

//一级区域选择
function bigarea_click(elem,name){
  //未选择区域显示
  $('#noselect_area_bigdiv').show();

  // console.log(elem);
  // console.log(name);
  selected_proId = elem;
  selected_proName = name;
  var lStorage=window.localStorage;
  lStorage.areasetting_proId = selected_proId;
  lStorage.areasetting_proName = selected_proName;
  lStorage.areasetting_parentId = '';
  // console.log(lStorage);

  $('#areaName_display_span').html(name);
  var post_data = new FormData();
  post_data.append('areaId', elem);
  http.postAjax_clean("/photo-album/areamanager/findByChoseProAndCity", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      if(data.data != null){
        area_click_cityonload(data.data);
      }else{
        $('#accordion').html('<div class="accordion_display_class">此区域还没有选择地区！</div>');
      }
    }else{
      alert(data.msg);
    }
  });
  http.postAjax_clean("/photo-album/areamanager/findByNotProvinAndCity", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      if(data.data != null){
        area_Noclick_cityonload(data.data);
      }else{
        $('#noselect_area_div').html('<div class="accordion_display_class">此区域还没有选择地区！</div>');
      }
    }else{
      alert(data.msg);
    }
  });
}

//二级区域选择
function subarea_click(elem,name,parentId){
  //未选择区域显示
  $('#noselect_area_bigdiv').show();

  selected_proId = elem;
  selected_proName = name;
  var lStorage=window.localStorage;
  lStorage.areasetting_parentId = parentId;
  // console.log(lStorage);

  // console.log(elem);
  $('#areaName_display_span').html(name);
  var post_data = new FormData();
  post_data.append('areaId', elem);
  http.postAjax_clean("/photo-album/areamanager/findByChoseProAndCity", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      if(data.data != null){
        area_click_cityonload(data.data);
      }else{
        $('#accordion').html('<div class="accordion_display_class">此区域还没有选择地区！</div>');
      }
    }else{
      alert(data.msg);
    }
  });
  http.postAjax_clean("/photo-album/areamanager/findByNotProvinAndCity", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      if(data.data != null){
        area_Noclick_cityonload(data.data);
      }else{
        $('#noselect_area_div').html('<div class="accordion_display_class">此区域还没有选择地区！</div>');
      }
    }else{
      alert(data.msg);
    }
  });
}

//创建新一级区域按钮
function team_add_btn(){
  if(newarea_tf){
    var area_list_add_html = '\
        <div class="panel panel-default">\
          <input id="add_area_input" placeholder="请输入团队名称"></input>\
        </div>\
    ';
    $('#area_leftmenu_list').append(area_list_add_html);
    $('#add_area_input').focus();
    //默认全部城市json读取
    city_onload();
    $('#noselect_area_bigdiv').hide();
    newarea_tf = false;
    selected_proId = '';
    selected_proName = '';
    $('#areaName_display_span').html('');
  }else{
    alert('已经有一个新区域在添加，不能重复添加新区域，只能保存后才能添加新区域！');
  }
}

//按+添加二级区域
function bigarea_addsmall_click(elem){
  if(newarea_tf){
    // console.log(elem);
    var addsmall_li_html = '<li class="list-group-item">\
      <input id="add_smallarea_input" placeholder="请输入团队名称" name="proId_'+elem+'"></input>\
    </li>';
    $('#collapse_subul_'+elem).append(addsmall_li_html);
    $('#collapse_'+elem).addClass("in");
    $('#add_smallarea_input').focus();
    //默认全部城市json读取
    city_onload();
    newarea_tf = false;
    selected_proId = '';
    selected_proName = '';
    $('#areaName_display_span').html('');
  }else{
    alert('已经有一个新区域在添加，不能重复添加新区域，只能保存后才能添加新区域！');
  }
}

//一级区域删除
function bigarea_del_click(elem){
  if(confirm('确定删除此区域')){
    // console.log(elem);
    var post_data = new FormData();
    post_data.append('areaId', elem);
    http.postAjax_clean("/photo-album/areamanager/deleteArea", post_data,function(data) {
      // console.log(data);
      if(data.code == 0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}
//二级区域删除
function smallarea_del_click(elem){
  // console.log(elem);
  if(confirm('确定删除此区域')){
    var post_data = new FormData();
    post_data.append('areaId', elem);
    http.postAjax_clean("/photo-album/areamanager/deleteArea", post_data,function(data) {
      // console.log(data);
      if(data.code == 0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}

//选择城市ID
function select_areaid(elem){
  $('#select_areaid_tr_'+elem).attr('css','selected_class');
}
//默认城市json读取
function city_onload(){
  var cityjson={};
  cityjson.citycode = [];
  http.getAjax_clean("/photo-album/areamanager/findByAllProviceAndCity", function(data) {
    // console.log(data);
    if(data.code == 0){
      $(data.data).each(function(i,ielem){
        var temp_citycode_list = {"province":ielem.proName,"proId":ielem.proId,"city":[]};
        $(ielem.cities).each(function(j,jelem){
          var temp_cityname_list = {"cityname":jelem.name,"cityId":jelem.id,"provId":jelem.provId};
          temp_citycode_list.city.push(temp_cityname_list);
        });

        cityjson.citycode.push(temp_citycode_list);
      });

      cityonload(cityjson.citycode);
    }else{
      alert(data.msg);
    }
  });
}


//城市json读取
function cityonload(data){
 // console.log(data);
   var cityselect_html='';
   $(data).each(function(i,ielem){
    //  console.log(ielem);
     cityselect_html +='\
     <div class="panel panel-default">\
         <div class="panel-heading">\
             <h4 class="panel-title">\
               <div class="col-md-1" style="font-size:18px;">\
                 <input name="Checkbox1" type="checkbox" id="province_'+ielem.proId+'" onchange="provinceselect(\'province_'+ielem.proId+'\')" class="provinceselect_class"/>\
               </div>\
               <a data-toggle="collapse" data-parent="#accordion" href="#collapse'+ielem.proId+'" style="color:#fff">\
                   <div style="text-align:center"><span>'+ielem.province+'</span></div>\
               </a>\
             </h4>\
         </div>\
         <div id="collapse'+ielem.proId+'" class="panel-collapse collapse">\
             <div class="panel-body" style="line-height:34px;">';
             // console.log($(ielem.city));
     $(ielem.city).each(function(k,kelem){
      //  console.log(kelm);
       cityselect_html +='\
               <div class="col-md-2" style="font-size:16px;text-align:left; padding-left:15px;">\
                 <input name="Checkbox1" class="cityclass_'+kelem.provId+'" type="checkbox" id="city_'+kelem.provId+'_'+kelem.cityId+'" onchange="cityselect(this)" value="'+kelem.cityname+'"/> <span>'+kelem.cityname+'</span>\
               </div>\
       ';
     });
     cityselect_html +='\
             </div>\
         </div>\
     </div>';
   });
   // console.log(cityselect_html);
   // console.log($("#accordion"));
   $("#accordion").html(cityselect_html);
}

//一二级区域选择城市读取
function area_click_cityonload(data){
 // console.log(data);
   var cityselect_html='';
   $(data).each(function(i,ielem){
    //  console.log(ielem);
     cityselect_html +='\
     <div class="panel panel-default">\
         <div class="panel-heading">\
             <h4 class="panel-title">\
               <div class="col-md-1" style="font-size:18px;">\
                 <input name="Checkbox1" type="checkbox" id="province_'+ielem.proId+'" onchange="provinceselect(\'province_'+ielem.proId+'\')" class="provinceselect_class" checked="checked"/>\
               </div>\
               <a data-toggle="collapse" data-parent="#accordion" href="#collapse'+ielem.proId+'" style="color:#fff">\
                   <div style="text-align:center"><span>'+ielem.proName+'</span></div>\
               </a>\
             </h4>\
         </div>\
         <div id="collapse'+ielem.proId+'" class="panel-collapse collapse">\
             <div class="panel-body" style="line-height:34px;">';
             // console.log($(ielem.city));
     $(ielem.cityDomins).each(function(k,kelem){
       if(kelem.ischose == 1){
         cityselect_html +='\
                 <div class="col-md-2" style="font-size:16px;text-align:left; padding-left:15px;">\
                   <input class="cityclass_'+ielem.proId+'" type="checkbox" id="city_'+ielem.proId+'_'+kelem.id+'" onchange="cityselect(this)" value="'+kelem.id+'" checked="checked"/>\
                   <span>'+kelem.name+'</span>\
                 </div>\
         ';
       }else if(kelem.ischose == 0){
           cityselect_html +='\
                   <div class="col-md-2" style="font-size:16px;text-align:left; padding-left:15px;">\
                     <input class="cityclass_'+ielem.proId+'" type="checkbox" id="city_'+ielem.proId+'_'+kelem.id+'" onchange="cityselect(this)" value="'+kelem.id+'"/>\
                     <span>'+kelem.name+'</span>\
                   </div>\
           ';
      }

     });
     cityselect_html +='\
             </div>\
         </div>\
     </div>';
   });
   // console.log(cityselect_html);
   // console.log($("#accordion"));
   $("#accordion").html(cityselect_html);
}

//一二级区域未选择城市读取
function area_Noclick_cityonload(data){
 // console.log(data);
   var cityselect_html='';
   $(data).each(function(i,ielem){
    //  console.log(ielem);
     cityselect_html +='\
     <div class="panel panel-default">\
         <div class="panel-heading">\
             <h4 class="panel-title">\
               <div class="col-md-1" style="font-size:18px;">\
                 <input name="Checkbox1" type="checkbox" id="province_'+ielem.proId+'" onchange="provinceselect(\'province_'+ielem.proId+'\')" class="provinceselect_class"/>\
               </div>\
               <a data-toggle="collapse" data-parent="#accordion" href="#collapse_'+ielem.proId+'" style="color:#fff">\
                   <div style="text-align:center"><span>'+ielem.proName+'</span></div>\
               </a>\
             </h4>\
         </div>\
         <div id="collapse_'+ielem.proId+'" class="panel-collapse collapse">\
             <div class="panel-body" style="line-height:34px;">';
             // console.log($(ielem.city));
     $(ielem.cities).each(function(k,kelem){
       cityselect_html +='\
               <div class="col-md-2" style="font-size:16px;text-align:left; padding-left:15px;">\
                 <input name="Checkbox1" class="cityclass_'+ielem.proId+'" type="checkbox" id="city_'+ielem.proId+'_'+kelem.id+'" onchange="cityselect(this)" value="'+kelem.id+'"/>\
                 <span>'+kelem.name+'</span>\
               </div>\
       ';
     });
     cityselect_html +='\
             </div>\
         </div>\
     </div>';
   });
   // console.log(cityselect_html);
   // console.log($("#accordion"));
   $("#noselect_area_div").html(cityselect_html);
}


//province份选择事件
function provinceselect(thiselem){
 var province_number = thiselem.split("province_")[1];
 if($('#'+thiselem)[0].checked == true){
   $('.cityclass_'+province_number).prop("checked", true);
 }else{
   $('.cityclass_'+province_number).prop("checked",false);
 }
 //选择城市显示js
 city_selected_display();
}

//城city选择事件
function cityselect(thiselem){
  // console.log(thiselem);
 var city_number_province = (thiselem.id).split("_")[1];
 // console.log(city_number_province);
 // console.log($('.cityclass_'+city_number_province+':checked'));
 if($('.cityclass_'+city_number_province+':checked').length == 0){
   $('#province_'+city_number_province).prop("checked", false);
 }else{
   $('#province_'+city_number_province).prop("checked", true);
 }

 //选择城市显示js
 // city_selected_display();
}

//选择城市显示js
function city_selected_display(){
  city_submit_big_list = {};
  var province_selected_span_html = '' ;
  $(".provinceselect_class:checked").each(function(i,ielem){
    // console.log($('.cityclass_'+i+':checked'));
    var city_temp_list = [];
    $('.cityclass_'+i+':checked').each(function(k,kelem){
      // console.log(kelem.value);
      city_temp_list.push(kelem.value)
    });
    city_submit_big_list[cityjson.citycode[i].province] = city_temp_list;


  });
  setTimeout('console.log(city_submit_big_list);',0);
  $("#province_selected_span").html(province_selected_span_html);
}
//城市提交
function city_submit_list(){
  setTimeout('console.log(city_submit_big_list);',0);
}

//区域“保存”事件
function area_save_btn(){
  // console.log($('#add_area_input'));
  if($('#add_area_input').length == 1){
    //创建一级区域事件开始
    // console.log($('#add_area_input')[0].value);
    if(($('#add_area_input')[0].value).length != 0){
      //省份的变量形式cityCode_json
      var cityCode_json = [];
      $('input:checked').each(function(i,ielem){
        // console.log(ielem);
        // console.log(ielem.id);
        if((ielem.id).indexOf("city") == 0){
          var temp_city_list = {};
          temp_city_list.proId = (ielem.id).split('_')[1];
          temp_city_list.cityId=(ielem.id).split('_')[2];
          cityCode_json.push(temp_city_list);
        }
      });
      // console.log(cityCode_json);
      var arr = cityCode_json;
      var map = {},dest = [];
      for(var i = 0; i < arr.length; i++){
          var ai = arr[i];
          if(!map[ai.proId]){
              dest.push({
                  proId: ai.proId,
                  cityId: [ai.cityId]
              });
              map[ai.proId] = ai;
          }else{
              for(var j = 0; j < dest.length; j++){
                  var dj = dest[j];
                  if(dj.proId == ai.proId){
                      dj.cityId.push(ai.cityId);
                      break;
                  }
              }
          }
      }
      cityCode_json = dest;
      // console.log(cityCode_json);
      // console.log(JSON.stringify(cityCode_json));

      var post_data = {};
      post_data.name = $('#add_area_input')[0].value;
      post_data.parentId = '';
      post_data.cityCode = cityCode_json;
      // console.log(JSON.stringify(post_data));
      http.postAjax_json_clean("/photo-album/areamanager/addAndUpdataAreaManager",JSON.stringify(post_data),function(data){
        if(data.code ==0){
          // console.log(data);
          // console.log(data.data.id);
          // console.log(data.data.name);
          var lStorage=window.localStorage;
          lStorage.areasetting_proId = data.data.id;
          lStorage.areasetting_proName = data.data.name;
          location.reload();
        }else{
          alert(data.msg);
        }
      });
    }else{
      alert("区域名称不能为空！");
      $('#add_area_input').focus();
    }
    //创建一级区域保存结束
  }else{
    if($('#add_smallarea_input').length == 1){
      //创建二级区域保存开始
      // console.log($('#add_smallarea_input'));
      // console.log(($('#add_smallarea_input')[0].name).split('_')[1]);
      // console.log($('#add_area_input')[0].value);
      if(($('#add_smallarea_input')[0].value).length != 0){
        //省份的变量形式cityCode_json
        var cityCode_json = [];
        $('input:checked').each(function(i,ielem){
          // console.log(ielem);
          // console.log(ielem.id);
          if((ielem.id).indexOf("city") == 0){
            var temp_city_list = {};
            temp_city_list.proId = (ielem.id).split('_')[1];
            temp_city_list.cityId=(ielem.id).split('_')[2];
            cityCode_json.push(temp_city_list);
          }
        });
        // console.log(cityCode_json);
        var arr = cityCode_json;
        var map = {},dest = [];
        for(var i = 0; i < arr.length; i++){
            var ai = arr[i];
            if(!map[ai.proId]){
                dest.push({
                    proId: ai.proId,
                    cityId: [ai.cityId]
                });
                map[ai.proId] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.proId == ai.proId){
                        dj.cityId.push(ai.cityId);
                        break;
                    }
                }
            }
        }
        cityCode_json = dest;
        // console.log(cityCode_json);
        // console.log(JSON.stringify(cityCode_json));
        //创新二级区域在上级一级区域的ID（temp_parentId）
        var temp_parentId= ($('#add_smallarea_input')[0].name).split('_')[1];
        var post_data = {};
        post_data.name = $('#add_smallarea_input')[0].value;
        post_data.parentId = temp_parentId;
        post_data.cityCode = cityCode_json;
        // console.log(JSON.stringify(post_data));
        http.postAjax_json_clean("/photo-album/areamanager/addAndUpdataAreaManager",JSON.stringify(post_data),function(data){
          if(data.code ==0){
            var lStorage=window.localStorage;
            lStorage.areasetting_proId = data.data.id;
            lStorage.areasetting_proName = data.data.name;
            lStorage.areasetting_parentId = data.data.parentId;
            // console.log(data.data.parentId);
            location.reload();
          }else{
            alert(data.msg);
          }
        });
      }else{
        alert("区域名称不能为空！");
        $('#add_smallarea_input').focus();
      }
      //创建二级区域保存结束

    }else{
      //已有区域保存开始
      //省份的变量形式cityCode_json
      var cityCode_json = [];
      $('input:checked').each(function(i,ielem){
        // console.log(ielem);
        // console.log(ielem.id);
        if((ielem.id).indexOf("city") == 0){
          var temp_city_list = {};
          temp_city_list.proId = (ielem.id).split('_')[1];
          temp_city_list.cityId=(ielem.id).split('_')[2];
          cityCode_json.push(temp_city_list);
        }
      });
      // console.log(cityCode_json);
      var arr = cityCode_json;
      var map = {},dest = [];
      for(var i = 0; i < arr.length; i++){
          var ai = arr[i];
          if(!map[ai.proId]){
              dest.push({
                  proId: ai.proId,
                  cityId: [ai.cityId]
              });
              map[ai.proId] = ai;
          }else{
              for(var j = 0; j < dest.length; j++){
                  var dj = dest[j];
                  if(dj.proId == ai.proId){
                      dj.cityId.push(ai.cityId);
                      break;
                  }
              }
          }
      }
      cityCode_json = dest;
      // console.log(cityCode_json);
      // console.log(JSON.stringify(cityCode_json));

      var post_data = {};
      post_data.id = selected_proId;
      post_data.name = selected_proName;
      post_data.cityCode = cityCode_json;
      // console.log(JSON.stringify(post_data));
      http.postAjax_json_clean("/photo-album/areamanager/addAndUpdataAreaManager",JSON.stringify(post_data),function(data){
        if(data.code ==0){
          location.reload();
        }else{
          alert(data.msg);
        }
      });
      //已有区域保存结束
    }
  }


}
//区域“取消”事件
function area_cancel_btn(){
  bigarea_click(selected_proId,selected_proName);
}

//权限管理事件
function menu(){
  var lStorage=window.localStorage;
  var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
  // console.log(NoAuthMenu_data);
	$(NoAuthMenu_data).each(function(o,oelem){
		if(oelem.type == 1){
		}
	});
}
