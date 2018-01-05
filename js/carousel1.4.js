// 云端图片被选中数组
var picCheckedArr = [];

window.onload = function() {
	//读取网页
    function createHtml(data) {
      // console.log(data);

        for (var i = 0; i < data.length; i++) {
            var html = '';
            html += '<table class="firstpage_img_table_display" cellspacing="0" cellpadding="0" id="'+data[i].id+'">';
			html += '<div id="edit-' + data[i].id + '">';
            html += '  <tr>';
            html += '    <td style="width:90px;"><div class="carousel_title">标题</div></td>';
			html += '    <td class="moduleTitle">' + data[i].title + '</td>';
			html += '    <td style="width:194px;"><button name="Carousel_edit_btn" class="btn btn-lg btn-success" id="'+data[i].id+'"	onclick="moduleEdit(this)" data-status="edit" style="margin-right: 10px;" >编辑</button><button name="Carousel_del_btn" class="btn btn-default btn-lg" style="" id="' + data[i].id + '" onclick="delCarousel(this)">删除</button> </td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td><div class="carousel_title">轮播时间</div></td>';
            html += '    <td>开始时间:<span class="startDate">' + data[i].time.start + '</span>~结束时间:<span class="endDate">' + data[i].time.end + '</span></td>';
            html += '    <td></td>';
            html += '  </tr>';
			html += '</div>';
            html += '  <tr>';
            html += '    <td valign="top"><div class="carousel_title">轮播图片</div></td>';
            html += '    <td colspan="2">';
            html += '       <ul id="list'+i+'" class="list_drag">';
            for (var j = 0; j < data[i].image.length; j++) {
              // html +='<li><div>'+j+'<br/><input type="text" value="'+j+'" name="input_index"></input></div></li>';
                if (data[i].image[j] != null) {
                    html += '   <li>';
                    html += '     <div class="firstpage_img_list">';
                    html += '       <div style="text-align:right;padding:4px;" width="200px"><span id="' + data[i].id + '@' + data[i].image[j].name + '" onclick="delImg(this)"><img src="../images/delimg.png" width="30px"></img</span></div>';
                    html += '       <img src="../index/image_tab/' + data[i].image[j].name + '" width="220px" height="170px" onclick="showCover(this)"/><br/>';
                    html += '       设置顺序:<input type="text" name="' + data[i].id + '@' + data[i].image[j].name + '" value="' + data[i].image[j].index + '" class="setup_input" onchange="setImgIndex(this)"/><br/>';
                    html += '       \
                                    <div id="img_select_div_'+i+'_'+j+'">\
                                      <select id="img" id="select_'+i+'_'+j+'" onchange="imgselect('+i+','+j+',this)">\
                                       <option value="imgselect_subspan_'+i+'_'+j+'_1">推广类别</option>\
                                       <option value="imgselect_subspan_'+i+'_'+j+'_2">单个产品</option>\
                                       <option value="imgselect_subspan_'+i+'_'+j+'_3">网址</option>\
                                     </select>\
                                     <!--按钮触发模态框-->\
                                     <span id="imgselect_subspan_'+i+'_'+j+'_1" class="imgselect_subspan" style="display:none;">\
                                       <button class="btn btn-primary btn-lg" onclick="showDiv('+i+','+j+')">推广类别</button>\
                                       <div id="imgselect_subdiv_'+i+'_'+j+'_1" class="imgselect_subdiv" style="height:100px;">aaaaaaaaaaa</div>\
                                     </span>\
                                     <span id="imgselect_subspan_'+i+'_'+j+'_2" class="imgselect_subspan" style="display:none;">\
                                       <button class="btn btn-primary btn-lg" onclick="showDiv('+i+','+j+')">单个产品</button>\
                                       <div id="imgselect_subdiv_'+i+'_'+j+'_2" class="imgselect_subdiv" style="height:100px;">bbbbbbbbbbb</div>\
                                     </span>\
                                    <span id="imgselect_subspan_'+i+'_'+j+'_3" class="imgselect_subspan" style="display:none;" >\
                                      <div id="imgselect_subdiv_'+i+'_'+j+'_3" class="imgselect_subdiv" style="height:100px;">ccccccccccc</div>\
                                    </span>\
                                      <!--弹出层开始-->\
                                      <div id="Idiv_'+i+'_'+j+'" style="display:none; position:absolute; z-index:1000; background:#fff;width:400px;height:300px;">\
                                          <div id="mou_head" style="width="100px; height=10px;z-index:1001; position:absolute;">显示('+(i+1)+','+(j+1)+')</div>\
                                          <input type="button" value="关闭" onclick="closeDiv('+i+','+j+');" />\
                                      </div>\
                                      <!--结束-->\
                                     \
                                   </div>\
                    ';
                    html += '     </div>';
                    html += '   </li>';
                }
            }
            html += '       </ul>';
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
			      html += '    <td colspan="3" align="center">';
            html += '        <input type="file" id="add_file_input" name="add_file_input" multiple style="visibility:hidden;">';
            html += '        <button class="btn btn-default btn-lg" name="Carousel_pcadd_btn" id="' + data[i].id + '" onclick="addToCarouselFromLocal(this)">+选择电脑图片上传</button>';
            html += '        <button class="btn btn-primary btn-lg" name="Carousel_imgadd_btn" id="' + data[i].id + '" onclick="addToCarouselFromOnLive(this)">+选择已上传图片</button>';
			      html += '   </td>';
            html += '  </tr>';
            html += '</table>';
            $('#carousel_preview').append(html);
            $("#list"+i).dragsort({ dragSelector: "div", dragSelectorExclude:"select,input,button", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div></div></li>" });
        }
    }
    function get_cb(data) {
        createHtml(data);
    }


    http.getAjax_clean("/photo-album/manger/miantab", get_cb);

    document.getElementById('click_to_upload_area').addEventListener('click',
    function(e) {
        var title = document.getElementById('title_input').value;
        var start = document.getElementById('title_interval_input_start').value;
        var end = document.getElementById('title_interval_input_end').value;
        if (title == '' || start == '' || end == '') {
            alert('标题与轮播时间字段均不能为空!');
            return;
        }
        $('#file_input').click();
    }, false);

    document.getElementById('file_input').addEventListener('change', function(e) {
        $('#loading').css('display', 'block');
        var post_data = new FormData();
        var input_files = document.getElementById('file_input').files;
        var length = input_files.length;
        if(length <=8){
          var arrar=[];
          // var obj = {
          //     "dir": "batar",
          //     "imgs": []
          // }
          for (var i = 0; i < length; i++) {
              post_data.append('file', input_files[i]);
              var obj=new Object();
              obj.name = input_files[i].name;
              obj.index = i;
              arrar.push(obj)
              // obj.imgs.push({
              //     "img": input_files[i].name,
              //     "index": i
              // });
          }
        }else{
          alert("轮播照片不能超过8张！");
          $("#loading").hide();
        }
        var jsonObj = JSON.stringify(arrar);
        post_data.append('param', jsonObj);
        http.postAjax_clean("/photo-album/index/update_main_tab", post_data,
        function(data) {
			// console.log("data:"+data);
            var list = data;
			// console.log("list:"+list);
            // data['message'] = list;
            if (list.length!=0) {
                var post_data = new FormData();
                var title = document.getElementById('title_input').value;
                var start = document.getElementById('title_interval_input_start').value;
                var end = document.getElementById('title_interval_input_end').value;
                if (title == null || title == undefined || start == null || start == undefined || end == null || end == undefined) {
                    alert('确保标题与时间字段填写正确!');
                    return;
                }else{
                    if(start > end){
                        alert("开始时间不应大于结束时间,请重新输入时间！");
                        $("#loading").hide();
                        return;
                    }
                }
                var obj = {
                    "title": title,
                    "time": {
                        "start": start,
                        "end": end
                    },
                    "image": []
                };
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    obj['image'].push({
                        "name": list[i],
                        "index": i,
                        "imagelink": "http://batar.cn"
                    });
                }
                var jsonObj = JSON.stringify(obj);
				            //console.log(jsonObj);
                post_data.append('pram', jsonObj);
				            //console.log(post_data);
                http.postAjax_clean("/photo-album/manger/setmiantab", post_data, function(data) {
                    if (data['state'] == true) {
                        // alert('创建轮播成功');
                        location.reload();
                    } else {
                        alert('创建轮播时发生异常');
                    }
                });
            } else {
                alert("图片上传过程中发生异常.");
                $('#upload_res_info').html(data);
            }
        });
    }, false);

    //权限管理适配开始
    setTimeout(function(){
      // http.getAjax_clean("/photo-album/job/getNoAuthMenuCurrUser", function(data) {

      var lStorage=window.localStorage;
      var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
      // console.log(NoAuthMenu_data);
      $(NoAuthMenu_data).each(function(o,oelem){
        if(oelem.type == 1){
          // console.log(oelem.btnmark);
          switch (oelem.btnmark) {
            // 新增轮播
            case 'btn-open':
              // console.log(oelem);
              $('#btn-open').hide();
              break;
            // 修改轮播
            case 'Carousel_edit_btn':
              // console.log(oelem);
              // console.log($('.setup_input'));
              $('button[name=Carousel_edit_btn]').each(function(i,ielem){
                $(ielem).hide();
              });
              $('button[name=Carousel_pcadd_btn]').each(function(i,ielem){
                $(ielem).hide();
              });
              $('button[name=Carousel_imgadd_btn]').each(function(i,ielem){
                $(ielem).hide();
              });
              break;
            //删除轮播
            case 'Carousel_del_btn':
              $('button[name=Carousel_del_btn]').each(function(i,ielem){
                $(ielem).hide();
              });
              break;
          }
        }
      });
    },200);
    //权限管理适配结束

};



/**
* 轮播模板编辑
*/
function moduleEdit(elem){

	var status = $(elem).data('status');
	if(status == 'edit'){
		goEdit(elem);
	}else if(status == 'save'){
		goSave(elem);
	}

}

// 编辑
function goEdit(elem){
	$(elem).data('status','save');
	$(elem).text('保存');
	$(elem).addClass('btn-danger');
	// 标题编辑
	var moduleTitle = $(elem).parent().siblings('.moduleTitle');
	var TitleText = moduleTitle.text();
	var moduleTitleHtml = '<input type="text" value="'+ TitleText  +'"/>';
	moduleTitle.html(moduleTitleHtml);
	moduleTitle.children('input').focus().select();

	// 日期编辑
	var moduleDate = $(elem).parent().parent().next().find('td').eq(1);
	var startDate = moduleDate.find('.startDate').text();
	var endDate = moduleDate.find('.endDate').text();
	var moduleDateHtml = '开始时间:<input type="text" class="some_class startDate" value="'+ startDate +'"/>~结束时间:<input type="text" class="some_class endDate" value="'+endDate+'"/>';
	moduleDate.html(moduleDateHtml);

	moduleDate.find('.startDate').datetimepicker();
	moduleDate.find('.endDate').datetimepicker();

}
// 保存
function goSave(elem){


	var moduleTitle = $(elem).parent().siblings('.moduleTitle');
	var TitleText = moduleTitle.find('input').val();
	moduleTitle.html(TitleText);

	var moduleDate = $(elem).parent().parent().next().find('td').eq(1);
	var startDate = moduleDate.find('.startDate').val();
	var endDate = moduleDate.find('.endDate').val();
    //开始时间不能大于结束时间判断
    if(startDate > endDate){
        alert("开始时间不能大于结束时间,请重新选择时间！");
        return;
    }else{
        $(elem).data('status','edit');
        $(elem).text('编辑');
        $(elem).removeClass('btn-danger');
        var moduleDateHtml = '开始时间:<span class="startDate">' + startDate + '</span>~结束时间:<span class="endDate">' + endDate + '</span>';
        moduleDate.html(moduleDateHtml);

        // 保存编辑
        var myObj = {};
        myObj.id = $(elem).attr('id');
        myObj.title = TitleText;
        myObj.time = {'start': startDate,'end' : endDate};
        myObj.image = [];
        myObj = JSON.stringify(myObj);
        // console.log(myObj);
        var post_data = new FormData();
        post_data.append('pram', myObj);

        http.postAjax_clean('/photo-album/manger/setmiantab',post_data, function(data) {
            if (data['state'] == true) {
                alert('保存成功');
            } else {
                alert('保存失败');
            }
        });

    }

}

model = {};
function addCarousel() {
    $("#btn-open").css("display", "none");
    $("#btn-close").css("visibility", "visible");
    $("#table_upload").css("display", "block");
}
function closeView() {
    $("#btn-open").css("display", "block");
    $("#btn-close").css("visibility", "hidden");
    $("#table_upload").css("display", "none");
}
var showCover = function(elem) {
    $('body').css('overflow', 'hidden');
    $('#cover').show();
    var file_path = elem.src;
    $('#oncover img').attr('src', file_path);
    $('#oncover').show();
};
var closeCover = function(elem) {
    $('body').css('overflow', 'visible');
    $('#cover').hide();
    $('#oncover').hide();
};
//删除图片JS
function delImg(elem) {
    if (confirm("确定要删除该图片?")) {
        var list_info = elem.id.split('@');
        var id = list_info[0];
        var filename = list_info[1];
        var cb = function(data) {
            if (data['state'] == true) {
                // alert("删除图片成功");
                location.reload();
            } else {
                alert("尚未删除图片");
            }
        };
        var post_data = new FormData();
        post_data.append("id", id);
        post_data.append("imagename", filename);
        http.postAjax_clean("/photo-album/manger/deletemaintab_producte", post_data, cb);
    }
}
//添加轮播JS
function addToCarouselFromLocal(elem) {

    var self = this;
    var id = elem.id;
    self.id = id;
    $('#add_file_input').click();
    document.getElementById('add_file_input').addEventListener('change', function(e) {
        var post_data = new FormData();
        var add_files = document.getElementById('add_file_input').files;
        var length = add_files.length;
        // console.log('length:'+length);
        $.getJSON("/photo-album/manger/miantab",function(data){
          var elem_length;
          // console.log(data);
          $(data).each(function(o,oelem){
            if(elem.id == oelem.id){
              // console.log(oelem.id);
              // console.log(oelem.image.length);
              var elem_length =oelem.image.length;
              // console.log(elem_length);
              // console.log("总个数："+(elem_length+length));
              if((elem_length+length) >8){
                alert("轮播图片不能超过8张，请重新选择！");
                return;
              }else{
                var list = [];
                for (var i = 0; i < length; i++) {
                    post_data.append('file', add_files[i]);
                    var obj=new Object()
                    obj.name = add_files[i].name;
                    obj.index = i;
                    list.push(obj);
                }
                var jsonObj = JSON.stringify(list);
                post_data.append('param', jsonObj);
                http.postAjax_clean("/photo-album/index/update_main_tab", post_data, function(data) {
                    // var list = data['message'].split(',');
                    // data['message'] = list;
                    // if (data['result'] == 4) {
                        var post_data = new FormData();
                        post_data.append('id', self.id);
                        var obj = [];
                        var length = data.length;
                        for (var i = 0; i < length; i++) {
                            obj.push({
                                "name": data[i],
                                "index": i,
                                "imagelink": "http://batar.cn"
                            });
                        }
                        var jsonObj = JSON.stringify(obj);
                        post_data.append("imags", jsonObj);
                        http.postAjax_clean("/photo-album/manger/add_producte", post_data,
                        function(data) {
                            if (data['state'] == true) {
                                // alert("添加图片成功");
                                location.reload();
                            } else {
                                alert("添加图片失败");
                            }
                        });
                    // } else {
                    //     alert("图片上传过程中发生异常");
                    // }
                });
              }
            }
          });
        });

    },
    false);
}

function addOrSubImg(elem) {

	var picName = $(elem).attr('name');
	if($(elem).is(':checked')){
		picCheckedArr.push(picName);
	}else{
		picCheckedArr.splice($.inArray(picName,picCheckedArr),1);
	}

    model = model || {};
    model.add_list = model.add_list || [];
    var filename = elem.name;
    for (var i = 0; i < model.add_list.length; i++) {
        if (filename == model.add_list[i]) {
            model.add_list.splice(i, 1);
        } else {
            model.add_list.push(filename);
        }
    }
}
//服务器图片选择上传
function addUploadLive(elem) {
    var id = elem.id;
    var checkboxs = document.getElementsByClassName('select_to_add');
    var length = checkboxs.length;
    var filename_list = [];
    for (var i = 0; i < length; i++) {
        if (checkboxs[i].checked) {
            filename_list.push(checkboxs[i].name);
        }
    }
    var post_data = new FormData();
    post_data.append('id', id);
    var obj = [];
    $.getJSON("/photo-album/manger/miantab",function(data){
      var elem_length;
      // console.log(data);
      $(data).each(function(o,oelem){
        if(elem.id == oelem.id){
          // console.log(elem.id);
          // console.log(oelem.image.length);
          // console.log("filelenght:"+filename_list.length);
          if((filename_list.length+oelem.image.length) >8){
            alert("轮播图片不能超过8张，请重新选择！");
            return;
          }else{
            if(filename_list.length != 0){
              for (var i = 0; i < filename_list.length; i++) {
                obj.push({
                  "name": filename_list[i],
                  "index": i,
                  "imagelink": "batar.cn"
                });
              }
              var jsonObj = JSON.stringify(obj);
              post_data.append("imags", jsonObj);
              http.postAjax_clean("/photo-album/manger/add_producte", post_data, function(data) {
                if (data['state'] == true) {
                  // alert('添加图片成功');
                  location.reload();
                } else {
                  alert('添加图片失败');
                }
              });
            }
            else{
              alert("请重新选择图片！");
              return;
            }
          }
        }
      });
    });

}
function cancel() {
    $('body').css('overflow', 'visible');
    $('#selectcover').hide();
    $('#onselectcover').hide();
}
//添加轮播JS
function addToCarouselFromOnLive(elem) {
  $.getJSON("/photo-album/manger/miantab",function(data){
    var elem_length;
    $(data).each(function(o,oelem){
      if(elem.id == oelem.id){
        // console.log(elem.id);
        // console.log(oelem.image.length);
        // console.log("filelenght:"+filename_list.length);
        if(oelem.image.length >8){
          alert("轮播图片不能超过8张，请重新选择！");
          return;
        }else{
          var self = this;
          var id = elem.id;
          self.id = id;
          http.getAjax_clean("/photo-album/index/get_main_tab", function(data) {
              $('body').css('overflow', 'hidden');
              $('#selectcover').show();
              var html = '<div id="oncoverselectimg" class="oncoverselectimg">';
              for (var i = 0; i < data.length; i++) {
                  html += '  <div class="uploaded_img">';
      			  html += '    <img src="../index/image_tab/' + data[i] + '" width="170px" height="150px"/><br/>';
                  html += '    <input type="checkbox" class="select_to_add" name="' + data[i] + '" onchange="addOrSubImg(this)"/> 选择';
                  html += '  </div>';
              }
              html += '  <hr style="clear:both;"/>';
              html += '  <button class="btn btn-primary btn-lg" id="' + self.id + '" onclick="addUploadLive(this)">轮播图片添加</button>';
			  html += '  <button class="btn btn-danger btn-lg" id="cancelSelect" onclick="deleteCloudPic(this);">删除云端图片</button>';
              html += '  <button class="btn btn-warning btn-lg" id="cancelSelect" onclick="cancel();">取消</button>';
              html += '  <div style="height:4em;"></div>';
              html += '</div>';
              $('#onselectcover').html(html);
              $('#onselectcover').show();
          });
        }
      }
    });
  });
}

//“选择已上传图片”按钮
function select_uploaded_img(){
  http.getAjax_clean("/photo-album/index/get_main_tab", function(data) {
    console.log(data);
      $('body').css('overflow', 'hidden');
      $('#selectcover').show();
      var html = '<div id="oncoverselectimg" class="oncoverselectimg">';
      for (var i = 0; i < data.length; i++) {
          html += '  <div class="uploaded_img">';
      html += '    <img src="../index/image_tab/' + data[i] + '" width="170px" height="150px"/><br/>';
          html += '    <input type="checkbox" class="select_to_add" name="' + data[i] + '" onchange="addOrSubImg(this)"/> 选择';
          html += '  </div>';
      }
      html += '  <hr style="clear:both;"/>';
      html += '  <button class="btn btn-primary btn-lg" id="' + self.id + '" onclick="addUploadLive(this)">轮播图片添加</button>';
html += '  <button class="btn btn-danger btn-lg" id="cancelSelect" onclick="deleteCloudPic(this);">删除云端图片</button>';
      html += '  <button class="btn btn-warning btn-lg" id="cancelSelect" onclick="cancel();">取消</button>';
      html += '  <div style="height:4em;"></div>';
      html += '</div>';
      $('#onselectcover').html(html);
      $('#onselectcover').show();
  });

}


/**
* 删除云端图片
*/
function deleteCloudPic(elem){
	if(picCheckedArr.length > 0){

		http.getAjax_clean('/photo-album/index/del_main_tab?pics='+JSON.stringify(picCheckedArr), function(data) {
			console.log(JSON.stringify(data));
			if (data['state'] == true) {
				alert('删除成功');
				location.reload();
			} else {
				alert('删除失败');
			}
		});

	}

}

//设置顺序JS
function setImgIndex(elem) {
    var list_info = elem.name.split('@');
    var carousel_id = list_info[0];
    var name = list_info[1];
    var index = elem.value;
    var post_data = new FormData();
    post_data.append('id', carousel_id);
    post_data.append('img', name);
    post_data.append('index', index);
    http.postAjax_clean("/photo-album/manger/setindex", post_data, function(data) {
        if (data['state'] == true) {
            // alert('设置顺序成功');
            location.reload();
        } else {
            alert('设置顺序失败');
        }
    });

}
//设置链接JS
function setImgLink(elem) {
    var list_info = elem.name.split('@');
    var carousel_id = list_info[0];
    var name = list_info[1];
    var link = elem.value;
    var post_data = new FormData();

    post_data.append('id', carousel_id);
    post_data.append('img', name);
    post_data.append('link', link);
    http.postAjax_clean("/photo-album/manger/setlink", post_data, function(data) {
        if (data['state'] == true) {
            // alert('设置链接成功');
            location.reload();
        } else {
            alert("设置链接失败");
        }
    });
}

function editCarousel(e){
	var editTab=$(e).context.parentNode.parentNode.offsetParent;
	//$(editTab).html("aaaa");
	//$('#' + e.id).html("aaaa");
}

function imgselect(i,j,thiselem){
  // console.log(i,j);
  console.log($(thiselem));
  console.log((thiselem.value).split('_'));
  $('.imgselect_subspan').each(function(k,kelem){
    $(kelem).hide();
  });
  $('#'+thiselem.value).show();
}


function showDiv(x,y){
  var Idiv     = document.getElementById("Idiv_"+x+"_"+y);
  var mou_head = document.getElementById('mou_head');
  Idiv.style.display = "block";
  //以下部分要将弹出层居中显示
  Idiv.style.left=(document.documentElement.clientWidth-Idiv.clientWidth)/2+document.documentElement.scrollLeft+"px";
  Idiv.style.top =(document.documentElement.clientHeight-Idiv.clientHeight)/2+document.documentElement.scrollTop-50+"px";

  //以下部分使整个页面至灰不可点击
  var procbg = document.createElement("div"); //首先创建一个div
  procbg.setAttribute("id","mybg"); //定义该div的id
  procbg.style.background = "#000000";
  procbg.style.width = "100%";
  procbg.style.height = "100%";
  procbg.style.position = "fixed";
  procbg.style.top = "0";
  procbg.style.left = "0";
  procbg.style.zIndex = "500";
  procbg.style.opacity = "0.6";
  procbg.style.filter = "Alpha(opacity=70)s";
  //背景层加入页面
  document.body.appendChild(procbg);
  document.body.style.overflow = "hidden"; //取消滚动条
}

function closeDiv(x,y) //关闭弹出层
{
  var Idiv=document.getElementById("Idiv_"+x+"_"+y);
  Idiv.style.display="none";
  document.body.style.overflow = "auto"; //恢复页面滚动条
  var body = document.getElementsByTagName("body");
  var mybg = document.getElementById("mybg");
  body[0].removeChild(mybg);
}
