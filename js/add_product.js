// var pronumber = sessionStorage.getItem('pronumber'); // 产品编号
var pronumber = null;
//产品编辑IDpro_tmpid_id
// var pro_tmpid =window.location.search;
// var pro_tmpid_id = pro_tmpid.split('=')[1];
//新建图片
var imginfo_json = [];

function selectChange() {
  var selectText = $('select[name=category]').find('option:selected').text();
  model.category = selectText;
  // addRows(null);
}

//产品规格获取JS
var addRows = function (elem) {
  var szTheadHtml = '<tr>\
                      <td>产品克重</td><td>长度</td><td>宽度</td><td>高度</td><td>长宽高</td><td>圈口</td><td>内径</td><td>面宽</td><td><button type="button" onclick="addRows(null)" class="btn btn-primary">点击添加新的产品规格</button></td>\
                    </tr>';

  var szTbodynullHtml = '<tr>\
                      <td><input name="weight" type="text" style="width:90%;"/></td>\
                      <td><input name="length" type="text" style="width:90%;"/></td>\
                      <td><input name="breadth" type="text" style="width:90%;"/></td>\
                      <td><input name="altitude" type="text" style="width:90%;"/></td>\
                      <td><input name="lba" type="text" style="width:90%;"/></td>\
                      <td><input name="circlemouth" type="text" style="width:90%;"/></td>\
                      <td><input name="boresize" type="text" style="width:90%;"/></td>\
                      <td><input name="facewidth" type="text" style="width:90%;"/></td>\
                      <td><button onclick="delThisRows(this)" class="btn btn-default">删除此规格</button></td>\
                    </tr>';
  if (elem == null) {
    // console.log(elem);
    $('#addrowtable thead').html(szTheadHtml);
    $('#addrowtable tbody').append(szTbodynullHtml);
  } else {
    // console.log(elem);
    // console.log(elem.sizeInfo);
    if (elem.sizeInfo == null) {
      $('#addrowtable thead').html(szTheadHtml);
      $('#addrowtable tbody').append(szTbodynullHtml);
    } else {
      // console.log(elem.sizeInfo);
      var szTbodyHtml = '';
      $(elem.sizeInfo).each(function (k, kelem) {
        // console.log(kelem);
        // console.log(kelem.length);
        var klength = (kelem.length == 'null' || kelem.length == null) ? '' : kelem.length;
        var kbreadth = (kelem.breadth == 'null' || kelem.breadth == null) ? '' : kelem.breadth;
        var kaltitude = (kelem.altitude == 'null' || kelem.altitude == null) ? '' : kelem.altitude;
        var klba = (kelem.lba == 'null' || kelem.lba == null) ? '' : kelem.lba;
        var kcirclemouth = (kelem.circlemouth == 'null' || kelem.circlemouth == null) ? '' : kelem.circlemouth;
        var kboresize = (kelem.boresize == 'null' || kelem.boresize == null) ? '' : kelem.boresize;
        var kfacewidth = (kelem.facewidth == 'null' || kelem.facewidth == null) ? '' : kelem.facewidth;
        // console.log(klength);
        szTbodyHtml += '<tr>\
                            <td><input name="length" type="text" style="width:90%;" value="'+ klength + '"/></td>\
                            <td><input name="breadth" type="text" style="width:90%;" value="'+ kbreadth + '"/></td>\
                            <td><input name="altitude" type="text" style="width:90%;" value="'+ kaltitude + '"/></td>\
                            <td><input name="lba" type="text" style="width:90%;" value="'+ klba + '"/></td>\
                            <td><input name="circlemouth" type="text" style="width:90%;" value="'+ kcirclemouth + '"/></td>\
                            <td><input name="boresize" type="text" style="width:90%;" value="'+ kboresize + '"/></td>\
                            <td><input name="facewidth" type="text" style="width:90%;" value="'+ kfacewidth + '"/></td>\
                            <td><button onclick="delThisRows(this)" class="btn btn-default">删除此规格</button></td>\
                          </tr>';
      });
      $('#addrowtable thead').html(szTheadHtml);
      $('#addrowtable tbody').html(szTbodyHtml);
    }
  }
};
//删除一行产品规格
var delThisRows = function (elem) {
  if($('#addrowtable>tbody>tr').length >1){
    $(elem).parent().parent().remove();
    return false;
  }else{
    alert("产品不能没有产品规格！");
    return false;
  }
};
//产品图片显示和调整顺序
function img_display(elem) {
  var post_data = new FormData();
  post_data.append('proid', elem);
  http.postAjax_clean("/photo-album/product/get_pro_detail", post_data, function (data) {
    // console.log(data.imageInfo);
    var strHtml = "";
    var number = 0;
    $(data.imageInfo).each(function (i, ielem) {
      // console.log(ielem);
      number++;
      strHtml += "		<li>";
      strHtml += '      <div class="img_listimg_div" id="img_' + i + '">';
      strHtml += "      <input id='select_" + ielem.image + "' name='allselect_btn' class='checkbox-btn' type='checkbox' value= '" + ielem.image + "'style='margin:0;'/> 选择   <a type='button' id='selectimg_" + ielem.image + "' target='hide_window' onclick='delimg(this)' class='btn btn-default btn-sm' style='margin-left:85px;border-radius:50%;'> X </a>" + "";
      strHtml += '      <div style="height:153px;vertical-align: middle;"><img src="/photo-album/image/' + ielem.image + ';width=240;height=240;equalratio=1" class="img_listimg" ondblclick="showCover(this);"></img></div>\
                        <span></span><input id="' + ielem.image + '" type="text" value="' + (i + 1) + '" name="input_index" class="input_area" disabled="true"></input></div>';
      strHtml += "		</li>";
    });
    //console.log(strHtml);
    $("#img_list").html(strHtml);
    $("#img_list").dragsort({ dragSelector: "div", dragSelectorExclude: "select,input,button", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div></div></li>" });
  });
}

//拖动图片顺序执行事件
function saveOrder() {
  // console.log("aaaaaa");
  var input_area_list = [];
  $(".img_listimg_div").each(function (i, ielem) {
    var img_name = $(ielem)[0].firstElementChild.defaultValue;
    input_area_list.push({ pic: img_name, order: (i + 1) });
  });
  // var lStorage=window.localStorage;
  // var editpro_id = pro_tmpid_id;
  // var post_data = new FormData();
  // post_data.append('number',editpro_id);
  // post_data.append('param',JSON.stringify(input_area_list));
  // http.postAjax_clean("/photo-album/product/set_image_order", post_data,function(data) {
  //   if(data.state=true){
  //     location.reload();
  //   }else{
  //     alert("图片排序失败！");
  //   }
  // });
}

//批量删除按钮事件
function batchdel() {
  //选择图片个数
  var select_num = 0;
  $(".checkbox-btn").each(function (i, ielem) {
    if ($(ielem).is(':checked')) {
      select_num++;
    }
  });
  //批量删除接口
  if (select_num != 0) {
    // if ((($(".checkbox-btn").length) - select_num) >= 1) {
      //相减后大于3个图片就可删除
      $(".checkbox-btn").each(function (i, ielem) {
        if ($(ielem).is(':checked')) {
          $($(ielem)[0].parentElement.parentNode).remove();
        }
      });
    // } else {
    //   // alert("图片不能少于3张，请重新选择！");
    //   alert("不能没有图片，请重新选择！");
    // }

  } else {
    alert("没有选择图片，请重新选择！");
  }
}

//单个图片删除
function delimg(elem) {
  if (confirm("确定要删除该图片?")) {
    var pro_del_id = (elem.id).split("selectimg_")[1];
    // console.log($(elem));
    // console.log($('#img_list').find('li').length);
    //图片个数少于3张提未，图片不能少于3张
    // if ($('#img_list').find('li').length > 1) {
      $($(elem)[0].parentElement.parentNode).remove();
    // } else {
    //   // alert("图片不能少于3张，请重新选择！");
    //   alert("不能没有图片，请重新选择！");
    // }
    // $($(elem)[0].parentElement.parentNode).remove();

    // // var lStorage=window.localStorage;
    // var delimg_list = [];
    // delimg_list.push(elem.id.split("selectimg_")[1]);
    // var post_data = new FormData();
    // post_data.append('dir',pro_tmpid_id);
    // post_data.append('filename',JSON.stringify(delimg_list));
    // http.postAjax_clean("/photo-album/image/del", post_data, function(data) {
    //   if(data.state == 1){
    //     location.reload();
    //   }else{
    //     if(data.state == 2){
    //       alert("产品不能全部删除！");
    //       location.reload();
    //     }else{
    //       alert("批量删除不成功！");
    //       location.reload();
    //     }
    //   }
    // });
  }
}

$(function () {

  // 取消并返回产品库
  $('#return_url_a').on('click', function () {
    hideParent();
  });



  model = {};
  // var _data_ = JSON.parse(localStorage.getItem('current_edit_product')) || {};
  // model.category = _data_.category || null;

  //产品图片读取
  if (pronumber) {
    img_display(pronumber);
  }

  http.getAjax_clean('/photo-album/product/getcategory', function (data) {
    for (var i = 0; i < data.length; i++) {
      // if(i==0){
      //   model.category = model.category || data[i];
      // }
      $('select[name=category]').append('<option value="' + data[i] + '">' + data[i] + '</option>');
    }
  });

  //获取推广类别数据填充页尾select表单:
  http.getAjax_clean("/photo-album/manger/get_products", function (data) {
    if (data.length != 0) {
      var html = '';
      for (var k = 0; k < data.length; k++) {
        // console.log(data[k]);
        html += '  <input type="checkbox" id="' + data[k].id + '" style="margin:0 10px 0 10px;" name="selected_promo" value="' + data[k].productsname + '" class="class_' + data[k].id + '" onchange="select_promo_input(\'' + data[k].id + '\',this)"/>' + data[k].productsname + '<span style="width:50px;"></span>';
        // console.log(data[k].products);
        if (data[k].products.length != 0) {
          html += ':[';
          for (var i = 0; i < data[k].products.length; i++) {
            html += '  <input type="checkbox" id="' + data[k].products[i].productId + '" style="margin:0 10px 0 10px;" name="selected_promo" value="' + data[k].products[i].name + '" class="class_' + data[k].id + '" onchange="select_promo_input(\'' + data[k].id + '\',this)"/><span style="color:#2b6aa2">' + data[k].products[i].name + '</span><span style="width:50px;"></span>';
          }
          html += ']<br/>';
        } else {
          html += '<br/>';
        }
      }
      $("#selected_promotion_div").html(html);
    } else {
      $("#selected_promotion_div").html("推广类别暂无数据，请到“推广类别”添加产品！");
    }
    // console.log(_data_.number);
    var post_data = new FormData();
    post_data.append('proid', pronumber);
    http.postAjax_clean("/photo-album/product/get_pro_detail", post_data, function (data) {
      // console.log(data);
      var proid_detail = data;
      //日期
      var datetext = new Date(proid_detail.date);
      // console.log(datatext);
      $('select[name=category]').val(proid_detail.category);
      $('input[name=name]').val(proid_detail.name);
      $('input[name=number]').val(proid_detail.number);
      $('input[name=weight]').val(proid_detail.weight);
      $('input[name=suppliernumber]').val(proid_detail.suppliernumber);
      $('textarea[name=detil]').val(proid_detail.detil);
      $('input[name=material]').val(proid_detail.material);
      $('input[name=crowd]').val(proid_detail.crowd);
      $('input[name=shapes]').val(proid_detail.shapes);
      $('input[name=craft]').val(proid_detail.craft);
      //推广类别获取
      $(data.generalize).each(function (l, lelem) {
        $('#' + lelem).attr("checked", 'true')
      });
      // console.log(data);
      $('#suppliernumber_div').html(data.date);
      $('#pro_id').html(data.id);
      addRows(proid_detail);
    });
  });



  // new Vue({
  //   el: '#edit_product',
  //   data: _data_
  // });

  $('select[name=category]').change(function () {
    selectChange();
  });

  //“确认修改"按钮字段
  document.getElementById('btn_submit').addEventListener('click', function (e) {
    var numer_input_text = ($('input[name=number]')[0].value).replace(/\s\s*$/, '');
    // console.log(numer_input_text);
    // console.log($('#img_list').find('img[class=img_listimg]').length);
    if (numer_input_text != '' && ($('#img_list').find('img[class=img_listimg]').length) != '0') {
      //产品图片
      var pro_submit_json = {
        "id": $('#pro_id')[0].innerHTML,
        "number": $('input[name=number]')[0].value,
        "category": $('#category')[0].value,
        "name": $('input[name=name]')[0].value,
        "detil": $('textarea[name=detil]')[0].value,
        "material": $('input[name=material]')[0].value,
        "shapes": $('input[name=shapes]')[0].value,
        "crowd": $('input[name=crowd]')[0].value,
        "craft": $('input[name=craft]')[0].value,
        "weight": $('input[name=weight]')[0].value,
        "suppliernumber": $('input[name=suppliernumber]')[0].value,
        "date": $('#suppliernumber_div')[0].innerHTML,
      };
      //产品规格数组列表sizeInfo_list
      var sizeInfo_list = [];
      // console.log($("#addrowtable tbody tr"));
      $("#addrowtable tbody tr").each(function (t, telem) {
        // console.log($(telem)[0].children);
        var selem_json = {};
        $($(telem)[0].children).each(function (s, selem) {
          // console.log($($(selem)[0].firstChild));
          // console.log($($(selem)[0].firstChild)[0].name);
          if ($($(selem)[0].firstChild)[0].name == 'length') {
            selem_json.length = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'breadth') {
            selem_json.breadth = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'altitude') {
            selem_json.altitude = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'lba') {
            selem_json.lba = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'circlemouth') {
            selem_json.circlemouth = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'boresize') {
            selem_json.boresize = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'facewidth') {
            selem_json.facewidth = $($(selem)[0].firstChild)[0].value;
          }
        });
        sizeInfo_list.push(selem_json);
      });
      // console.log();


      //产品推广ID数组列表generalize_list

      var generalize_list = [];
      // console.log($('#selected_promotion_div input'));
      $('#selected_promotion_div input').each(function (o, oelem) {
        if ($(oelem)[0].checked) {
          generalize_list.push($(oelem)[0].id);
        }
      });
      // console.log(generalize_list);
      var k_number = 0;
      var imageInfo_list = [];
      // console.log($('#img_list').find('img[class=img_listimg]').length);
      $('#img_list').find('img[class=img_listimg]').each(function (r, relem) {
        k_number++;
        var img_rname = (($(relem)[0].src).split(';width=240;height=240;equalratio=1')[0]).split('/photo-album/image/')[1];
        // console.log(img_rname);
        imageInfo_list.push({
          "image": img_rname,
          "index": k_number,
          "origname": ''
        });
      });
      //图片数组pro_submit_json.imageInfo
      //判断产品规格是否有重复
      var sizeInfo_TF = true;
      $(sizeInfo_list).each(function(q,qelem){
        for(var w=(q+1) ; w<sizeInfo_list.length ; w++){
          if(JSON.stringify(sizeInfo_list[q]) == JSON.stringify(sizeInfo_list[w])){
            sizeInfo_TF = false;
            return false;
          }
        }
      })
      if(sizeInfo_TF){
        pro_submit_json.imageInfo = imageInfo_list;
        pro_submit_json.sizeInfo = sizeInfo_list;
        pro_submit_json.generalize = generalize_list;
        console.log(pro_submit_json);
        $.ajax({
          type: 'POST',
          url: '/photo-album/product/update_pro',
          contentType: "application/json",
          data: JSON.stringify(pro_submit_json),
          success: function (data) {
            if (data.code == 0) {
              hideParent();
              parent.isRefresh(false); // 调用iframe父级的方法
            } else {
              alert(data.msg);
            }
          }
        });
      }else{
        alert('产品规格有重复，请修改后再提交！');
      }
    } else {
      alert("产品编号或产品图片不能为空！");
    }

  }, false);

  document.onkeypress = function(event){
    // console.log(event);
    if(event.code == 'Enter' || event.code == 'NumpadEnter' ||event.code == 'Space') {
      return false;
    }
  }
});

// 隐藏蒙层
function hideParent() {
  $('#editDetail', window.parent.document).hide();
}

//新产品添加JS
function newpro_btn_submit() {
  var imgLength = $('#img_list img').length;
  if(imgLength == 0){
    alert("产品不能没有图片，请先添加图片！");
    img_upload_btn.click();
    return false;
  }
  if($('input[name=name]')[0].value == ''){
    alert("产品名称不能为空！");
    $('input[name=name]')[0].focus();
    return false;
  }
  if($('input[name=number]')[0].value == ''){
    alert("产品编号不能为空！");
    $('input[name=number]')[0].focus();
    return false;
  }
  if($('select[name=category]')[0].value == ''){
    alert("产品分类不能为空！");
    $('select[name=category]')[0].focus();
    return false;
  }
  // console.log($('span[name=material]').find('.tag'));
  if($('span[name=material]').find('.tag').length == 0){
    alert("产品材质不能为空！");
    $('span[name=material]')[0].nextElementSibling.focus();
    return false;
  }
  if($('span[name=shapes]').find('.tag').length == 0){
    alert("外观形态不能为空！");
    $('span[name=shapes]')[0].nextElementSibling.focus();
    return false;
  }
  if($('span[name=colour]').find('.tag').length == 0){
    alert("产品成色不能为空！");
    $('span[name=colour]')[0].nextElementSibling.focus();
    return false;
  }
  if($('span[name=craft]').find('.tag').length == 0){
    alert("表面工艺不能为空！");
    $('span[name=craft]')[0].nextElementSibling.focus();
    return false;
  }
  if($('span[name=makeCraft]').find('.tag').length == 0){
    alert("制造工艺不能为空！");
    $('span[name=makeCraft]')[0].nextElementSibling.focus();
    return false;
  }
  var weight_TF = true;
  var weight_num;
  $('input[name=weight]').each(function(k,kelem){
    if(kelem.value == ''){
      weight_num = k;
      weight_TF = false;
    }
  })
  if(!weight_TF){
    $('input[name=weight]')[weight_num].focus();
    alert("第 "+(weight_num+1)+" 行产品克重不能为空！");
    return false;
  }


    //产品图片
    //产品材质数组
    var material_list =''
    $('span[name=material]').find('.tag').each(function(k,kelem){
      var text = kelem.innerText.substring(0,kelem.innerText.length - 1);
      material_list += text + ',';
    })
    material_list = material_list.substring(0,material_list.length - 1);

    //外观形态数组
    var shapes_list =''
    $('span[name=shapes]').find('.tag').each(function(k,kelem){
      var text = kelem.innerText.substring(0,kelem.innerText.length - 1);
      shapes_list += text + ',';
    })
    shapes_list = shapes_list.substring(0,shapes_list.length - 1);

    //表面工艺数组
    var craft_list =''
    $('span[name=craft]').find('.tag').each(function(k,kelem){
      var text = kelem.innerText.substring(0,kelem.innerText.length - 1);
      craft_list += text + ',';
    })
    craft_list = craft_list.substring(0,craft_list.length - 1);

    //成色数组
    var colour_list =''
    $('span[name=colour]').find('.tag').each(function(k,kelem){
      var text = kelem.innerText.substring(0,kelem.innerText.length - 1);
      colour_list += text + ',';
    })
    colour_list = colour_list.substring(0,colour_list.length - 1);

    //制造工艺数组
    var makeCraft_list =''
    $('span[name=makeCraft]').find('.tag').each(function(k,kelem){
      var text = kelem.innerText.substring(0,kelem.innerText.length - 1);
      makeCraft_list += text + ',';
    })
    makeCraft_list = makeCraft_list.substring(0,makeCraft_list.length - 1);
    var pro_submit_json={
        "id": $('#pro_id')[0].innerHTML,
        "number":$('input[name=number]')[0].value,
        "category": $('#category')[0].value,
        "name": $('input[name=name]')[0].value,
        "detil": $('textarea[name=detil]')[0].value,
        "crowd": $('input[name=crowd]')[0].value,
        "material": material_list,
        "shapes": shapes_list,
        "craft": craft_list,
        "colour": colour_list,
        "makeCraft": makeCraft_list,
        "suppliernumber":$('input[name=suppliernumber]')[0].value,
        "date": $('#suppliernumber_div')[0].innerHTML,
    };
    //产品规格数组列表sizeInfo_list
    var sizeInfo_list = [];
    // console.log($("#addrowtable tbody tr"));
    $("#addrowtable tbody tr").each(function(t,telem){
      var selem_json = {};
      selem_json.length = $(telem).find('input[name=length]')[0].value;
      selem_json.breadth = $(telem).find('input[name=breadth]')[0].value;
      selem_json.altitude = $(telem).find('input[name=altitude]')[0].value;
      selem_json.lba = $(telem).find('input[name=lba]')[0].value;
      selem_json.circlemouth = $(telem).find('input[name=circlemouth]')[0].value;
      selem_json.boresize = $(telem).find('input[name=boresize]')[0].value;
      selem_json.facewidth = $(telem).find('input[name=facewidth]')[0].value;
      selem_json.weight = $(telem).find('input[name=weight]')[0].value;
      sizeInfo_list.push(selem_json);
    });

    //产品推广ID数组列表generalize_list
    var generalize_list = [];
    $('#selected_promotion_div input').each(function (o, oelem) {
      if ($(oelem)[0].checked) {
        generalize_list.push($(oelem)[0].id);
      }
    });


    var imageInfo_list = [];
    var k_number = 0;
    // console.log($('#img_list').find('img[class=img_listimg]').length);
    $('#img_list').find('img[class=img_listimg]').each(function (r, relem) {
      k_number++;
      var img_rname = (($(relem)[0].src).split(';width=240;height=240;equalratio=1')[0]).split('/photo-album/image/')[1];
      // console.log(img_rname);
      imageInfo_list.push({
        "image": img_rname,
        "index": k_number,
        "origname": ''
      });
    });
    //判断产品规格是否有重复
    var sizeInfo_TF = true;
    var temp_w_num;
    $(sizeInfo_list).each(function(q,qelem){
      for(var w=(q+1) ; w<sizeInfo_list.length ; w++){
        if(JSON.stringify(sizeInfo_list[q]) == JSON.stringify(sizeInfo_list[w])){
          sizeInfo_TF = false;
          temp_w_num = w;
          return false;
        }
      }
    })
    if(sizeInfo_TF){
      pro_submit_json.imageInfo = imageInfo_list;
      pro_submit_json.sizeInfo = sizeInfo_list;
      pro_submit_json.generalize = generalize_list;
      // console.log(pro_submit_json);
      $.ajax({
        type: 'POST',
        url: '/photo-album/product/save_pro',
        contentType: "application/json",
        data: JSON.stringify(pro_submit_json),
        success: function (data) {
          // console.log(data);
          if (data.code == 0) {
            alert('产品添加成功！');
            location.reload();
            // hideParent();
            location.href = "/photo-album/web/products.html";
          } else {
            alert(data.msg);
          }
        }
      });
    }else{
      // alert(temp_w_num)
      $('input[name=weight]')[temp_w_num].focus();
      alert('产品规格第 '+(temp_w_num+1)+' 行有重复，请修改后再提交！');
    }

}

function uploadFile() {
  // var upload_file =document.getElementById("img_upload_btn").files;
  // console.log(pro_tmpid_id);
  //新建pro_tmpid_id为空，产品编辑pro_tmpid_id为产品id
  if (pronumber != 'null') {
    // console.log(upload_file);
    var upload_file = document.getElementById("img_upload_btn").files;
    var post_data = new FormData();
    var length = upload_file.length;
    // console.log(length);
    var obj = {
      "dir": pronumber,
      "imgs": []
    }
    for (var i = 0; i < length; i++) {
      post_data.append('file', upload_file[i]);
      obj.imgs.push({
        "img": upload_file[i].name,
        "index": i
      });
    }
    var jsonObj = JSON.stringify(obj);
    post_data.append('param', jsonObj);
    http.postAjax_clean("/photo-album/image/uploadImage", post_data, function (data) {
      // alert("图片上传成功！");
      // console.log(data);
      // console.log(obj);
      //产品信息保存
      var pro_submit_json = {
        "id": $('#pro_id')[0].innerHTML,
        "number": $('input[name=number]')[0].value,
        "category": $('#category')[0].value,
        "name": $('input[name=name]')[0].value,
        "detil": $('textarea[name=detil]')[0].value,
        // "material": $('input[name=material]')[0].value,
        // "shapes": $('input[name=shapes]')[0].value,
        "crowd": $('input[name=crowd]')[0].value,
        // "craft": $('input[name=craft]')[0].value,
        // "weight": $('input[name=weight]')[0].value,
        "suppliernumber": $('input[name=suppliernumber]')[0].value,
        "date": $('#suppliernumber_div')[0].innerHTML,

      };
      //产品图片
      var imageInfo_list = [];
      // console.log(data.data.length);
      // console.log(data.data);
      // console.log($('#img_list').find('div[class=img_listimg_div]'));
      var k_number = 0;
      $('#img_list').find('img[class=img_listimg]').each(function (r, relem) {
        k_number++;
        var img_rname = (($(relem)[0].src).split(';width=240;height=240;equalratio=1')[0]).split('/photo-album/image/')[1];
        // console.log(img_rname);
        imageInfo_list.push({
          "image": img_rname,
          "index": k_number,
          "origname": ''
        });
      });
      $(data.data).each(function (k, kelem) {
        k_number++;
        // console.log(kelem);
        imageInfo_list.push({
          "image": kelem.image,
          "index": k_number,
          "origname": kelem.origname
        });
      });
      //产品图片json
      // console.log(imageInfo_list);
      // imageInfo_list.push({
      //         "image": "170324110818737_825fac9cd2ccccb0b9b81333cb17eeb8.jpg",
      //         "index": 0,
      //         "origname": "1.jpg"
      //     });
      //产品规格数组列表sizeInfo_list

      var strHtml = '';
      // $(data.data).each(function(i,ielem){
      //   // console.log(ielem);
      //   imginfo_json.push(data.data[i]);
      //   imginfo_json[i].index = i;
      // });
      // console.log(imginfo_json);
      $(imageInfo_list).each(function (j, jelem) {
        // console.log(jelem);
        strHtml += "		<li>";
        strHtml += '      <div class="img_listimg_div" id="img_' + i + '">\
                            <input id="select_' + jelem.key + '" name="allselect_btn" class="checkbox-btn" value="' + jelem.key + '" style="margin:0;" type="checkbox">选择\
                            <a type="button" id="selectimg_' + jelem.key + '" target="hide_window" onclick="delimg(this)" class="btn btn-default btn-sm" style="margin-left:85px;border-radius:50%;">X</a>\
                  ';
        strHtml += '        <div style="height:153px;"><img src="/photo-album/image/' + jelem.image + ';width=240;height=240;equalratio=1" class="img_listimg" style="vertical-align: middle;" ondblclick="showCover(this);"></img></div>\
                              <input id="' + jelem.key + '" type="text" value="' + (j + 1) + '" name="input_index" class="input_area" disabled="true"></input>\
                          </div>';
        strHtml += "		</li>";
      });
      $("#img_list").html(strHtml);


      var sizeInfo_list = [];
      // console.log($("#addrowtable tbody tr"));
      $("#addrowtable tbody tr").each(function (t, telem) {
        // console.log($(telem)[0].children);
        var selem_json = {};
        $($(telem)[0].children).each(function (s, selem) {
          // console.log($($(selem)[0].firstChild));
          // console.log($($(selem)[0].firstChild)[0].name);
          if ($($(selem)[0].firstChild)[0].name == 'length') {
            selem_json.length = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'breadth') {
            selem_json.breadth = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'altitude') {
            selem_json.altitude = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'lba') {
            selem_json.lba = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'circlemouth') {
            selem_json.circlemouth = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'boresize') {
            selem_json.boresize = $($(selem)[0].firstChild)[0].value;
          }
          if ($($(selem)[0].firstChild)[0].name == 'facewidth') {
            selem_json.facewidth = $($(selem)[0].firstChild)[0].value;
          }
        });
        sizeInfo_list.push(selem_json);
      });
      // sizeInfo_list.push({
      //         "length": "长度",
      //         "breadth": "宽度",
      //         "altitude": "高度",
      //         "lba": "长宽高",
      //         "circlemouth": "圈口",
      //         "boresize": "内径",
      //         "facewidth": "面宽"
      //     });

      //产品推广ID数组列表generalize_list
      var generalize_list = [];
      $('#selected_promotion_div input').each(function (o, oelem) {
        if ($(oelem)[0].checked) {
          generalize_list.push($(oelem)[0].id);
        }
      });
      pro_submit_json.imageInfo = imageInfo_list;
      pro_submit_json.sizeInfo = sizeInfo_list;
      pro_submit_json.generalize = generalize_list;

      // pro_submit_json.push("imageInfo":imageInfo_list);
      // console.log(pro_submit_json);
      // console.log(JSON.stringify(pro_submit_json));
      // $.ajax({
      //     type : 'POST',
      //     url : '/photo-album/product/update_pro',
      //     contentType : "application/json",
      //     data: JSON.stringify(pro_submit_json),
      //     success : function(data) {
      //         // console.log(data);
      //         if(data.code == 0){
      //           // self.location=document.referrer;
      //           location.reload();
      //         }
      //     }
      // });
      // location.reload();
    });
  } else {

    $("#img_list_null").show();
    $("#img_list").hide();
    var upload_file = document.getElementById("img_upload_btn").files;
    var post_data = new FormData();
    var files = [];
    for (var i = 0; i < upload_file.length; i++) {
      post_data.append('file', upload_file[i]);
      // files.push(upload_file[i]);
    }

    http.postAjax_clean("/photo-album/image/uploadImage", post_data, function (data) {
      // console.log(data);
      if (data.msg == "图片上传成功") {
        var strHtml = '';
        $(data.data).each(function (i, ielem) {
          // console.log(ielem);
          imginfo_json.push(data.data[i]);
          imginfo_json[i].index = i;
        });
        // console.log(imginfo_json);
        $(imginfo_json).each(function (j, jelem) {
          // console.log(jelem);
          strHtml += "		<li>";
          strHtml += '      <div class="img_listimg_div" id="img_' + i + '">';
          strHtml += '        <div style="height:180px;"><img src="/photo-album/image/' + jelem.image + ';width=240;height=240;equalratio=1" class="img_listimg" style="vertical-align: middle;" ondblclick="showCover(this);"></img></div>\
                                <input id="' + jelem.key + '" type="text" value="' + (j + 1) + '" name="input_index" class="input_area" disabled="true"></input>\
                            </div>';
          strHtml += "		</li>";
        });
        $("#img_list_null").html(strHtml);
      } else {
        alert(data.msg);
      }
      // console.log(imginfo_json);
    });
  }
}

//'一个系列只能选择一个选项'判断事件
function select_promo_input(elem, thiselem) {
  if ($('.class_' + elem + ':checked').length > 1) {
    $('.class_' + elem + ':checked').each(function (i, ielem) {
      $(ielem).attr('checked', false);
    });
    setTimeout(function () {
      document.getElementById(thiselem.id).checked = true;
    }, 100);
  }
}




//添加克重参数开始
function addTag(obj) {
	var tag = obj.val();
	if (tag != '') {
		var i = 0;
		$(".tag").each(function() {
			if ($(this).text() == tag + "×") {
				$(this).addClass("tag-warning");
				setTimeout("removeWarning()", 400);
				i++;
			}
		})
		obj.val('');
		if (i > 0) { //说明有重复
			return false;
		}
		$(obj[0].previousElementSibling).before("<span class='tag'>" + tag + "<button class='close' onclick='deltag(this)'>×</button></span>"); //添加标签
	}
}

function addTag_data(data) {
	var data_list = data.split(',');
	for(var j=0;j<data_list.length;j++){
		var tag = data_list[j];
		if (tag != '') {
			var i = 0;
			$(".tag").each(function() {
				if ($(this).text() == tag + "×") {
					$(this).addClass("tag-warning");
					setTimeout("removeWarning()", 400);
					i++;
				}
			})
			// obj.val('');
			if (i > 0) { //说明有重复
				return false;
			}
			$("#form-field-tags").before("<span class='tag'>" + tag + "<button class='close' type='button' onclick='deltag(this)'>×</button></span>"); //添加标签
		}
	}
}

function removeWarning() {
	$(".tag-warning").removeClass("tag-warning");
}
//删除标签
function deltag(thiselem){
  thiselem.parentNode.remove();
}
//光标移开克重输入框时输入
function input_blur(thiselem){
  var txtvalue=$(thiselem).val().replace(/\s+/g, "");
  txtvalue = txtvalue.replace(',','');
  if(txtvalue.length > 8){
    $(thiselem).val('');
    alert('产品属性最多允许8位字符长度！');
    return false;
  }
  var tags_data = $(thiselem.previousElementSibling).find('.tag');
  var tags_TF = true;
  if(txtvalue !=""){
    $(tags_data).each(function(i,ielem){
      var str_txt = ielem.textContent.substring(0,(ielem.textContent.length-1));
      if(str_txt == txtvalue){
        $(thiselem).val('');
        tags_TF = false;
        return false;
      }
    });
    if(tags_TF){
      $(thiselem.parentNode.children[0]).append("<span class='tag'>" + txtvalue + "<button class='close' type='button' onclick='deltag(this)'>×</button></span>");
      $(thiselem).val('');
    }else{
      alert('"'+txtvalue + '"克重已经添加，无需重复添加！');
    }
  }
}

function keydown_fun(thiselem,event){
  if(event.code == 'Enter' || event.code == 'NumpadEnter' || event.key == ','){
    setTimeout(function(){
      input_blur(thiselem);
    },20)
  }
}

//添加克重参数结束


//产品详情备注输入框添加回车和空格
function getKey(elem)
{
  //添加回车事件
  if(event.keyCode==13){
   elem.value += '\r\n';
  }
  //添加空格事件
  if(event.keyCode==32){
   elem.value += ' ';
  }
}
