var pro_datalist =[];
var num = 0;
//产品ID
var pro_id_num = 0;
$(document).ready(function(){

  //首次读取图片文件夹
  var strHtml = "";
  var str_Datalist ="";
  $("#listdiv").html="";//清空内容
  $("#pro_search").html = "";

  http.getAjax_clean("/photo-album/image/listdir", function(data) {
    // console.log(data[0]);
    prolist(data[0]);
  });

  http.getAjax_clean("/photo-album/image/getdir_number", function(data) {
    $.each(data,function(i,field){
      strHtml +='<div id="div_'+field+'"><button name="prolist_btnname" id="'+field+'" href="#'+field+'" onclick="prolist(this.id)" class="list-group-item" style="border-right:0;">'+i+'<button id="'+field+'" target="del-product" class="btn btn-default" style="border:1px solid #ccc;color:#ccc;border-radius: 0px;width:10%;float:left;height:35px;border-left:0;" onclick="prodel(this)">X</button></button></div>';
      //搜索栏数组
      str_Datalist += "<option value='" + i + "'>";
      pro_datalist.push(i);
    });
    $("#listdiv").html(strHtml);
    $("#pro_search").html(str_Datalist);
    //console.log(pro_datalist);
    //权限管理适配开始
    setTimeout('menu()',200);
    //权限管理适配结束
  });

});

//权限管理适配开始
function menu(){
  var lStorage=window.localStorage;
  var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
  // console.log(NoAuthMenu_data);
  $(NoAuthMenu_data).each(function(o,oelem){
    if(oelem.type == 1){
      // console.log(oelem.btnmark);
      switch (oelem.btnmark) {
        // 搜索产品图片
        case 'pro_search':
          $('#pro_search_div').hide();
          break;
        //上传产品图片
        case 'uploadimg':
          // console.log(oelem);
          // console.log($('#uploadimg'));
          $('#uploadimg').hide();
          break;
        //删除产品图片
        case 'imgdel_btn':
          // console.log(oelem);
          // console.log($('button[name=imgdel_btn]'));
          $('button[name=imgdel_btn]').each(function(i,ielem){
            $(ielem).hide();
          });
          break;
        //批量移除
        case 'batchDel_btn':

          $('.checkbox-btn').each(function(i,ielem){
            $(ielem).hide();
          });
          $('.select_text').each(function(i,ielem){
            $(ielem).hide();
          });
          $('#allselect_span').hide();
          $('#batchDel_btn').hide();
          break;
      }
    }
  });
}
//权限管理适配结束

//文件夹产品生成JS
function prolist(elem){
  $("#allselect_checkout").removeAttr("checked");
  // var lStorage=window.localStorage;
  // lStorage.pro_id_num = elem;
  // console.log(lStorage);
  pro_id_num =elem;
  var prolist_url="/photo-album/image/listfiles?dir=" + elem;
  // console.log(elem);
  $("#listdd").text(elem);
  $("#dir").text(elem);
  http.getAjax_clean(prolist_url, function(data) {
    //console.log(data);
    $("#list1").html="";//清空内容
    var strHtml = "";//存储数据的变量
    var number=0
      $.each(data, function(i, field){
        number++;
        strHtml += "		<li>";
    		strHtml += '      <div class="img_listimg_div">';
    		strHtml += "      <input name='allselect_btn' class='checkbox-btn' type='checkbox' value= '" + field.key + "'style='margin:0;'  onchange='all_select_tf()' /> <span class='select_text' style='height:auto;overflow:auto;width:auto;'>选择</span>   <button id='" + elem +"' value= '" + field.key + "' target='hide_window' onclick='deljs(this)' class='btn btn-default btn-sm' name='imgdel_btn' style='margin-left:85px;border-radius:50%;'> X </button>" + "";
        strHtml += '      <img src="/photo-album/image/' +　field.key + ';width=240;height=240;equalratio=1" class="img_listimg" ondblclick="showCover(this);"></img><span></span><input id="' + field.key + '" type="text" value="'+number+'" name="input_index" class="input_area" disabled="true"></input></div>';
        strHtml += "		</li>";
      });
      //console.log(strHtml)
    $("#list1").html(strHtml);
    // console.log(pro_id_num);
    var prolist_btnname_list = $("button[name=prolist_btnname]");
    prolist_btnname_list.each(function(i,elem){
      if(elem.id==pro_id_num){
        // console.log(elem);
        $(elem).css({"background-color":"#2b6aa2","color":"#fff"});
      }else{
        $(elem).css({"background-color":"#fff","color":"#000"});
      }
    });
  });

}

//点击搜索按钮事情
function product_search() {
    //取得输入框的值
    var pro_search_num = $("#pro_search_input").val();
    // console.log(pro_search_num);
	//判断输入值在列表中是否存在
    var pro_search_bold = false;
    for (var i = 0; i < pro_datalist.length; i++) {
        if (pro_search_num == pro_datalist[i]) {
            pro_search_bold = true;
            // console.log(pro_datalist[i]);
        }
    }
	var pro_search_num_submit = "";
  if (pro_search_bold == true) {
		http.getAjax_clean("/photo-album/image/getdir_number", function(data) {
			$.each(data, function(i, field){
				if(pro_search_num == i){
          // $("#divframe").scrollTop = $('#'+pro_search_num).offsetTop;
          window.location.hash = "#"+pro_search_num;
          prolist(field);
				}
			})
		})
  } else {
      alert("产品不存在");
      return;
  }
  // console.log();
  // $("#listdiv").prepend($("#div_"+pro_search_num));

}

//删除文件夹JS
function prodel(elem){
  // console.log(elem.id);
  if(confirm("确定要删除编号为："+elem.id+"产品?")){
    var list = [];
    list.push(elem.id);
    var post_data = new FormData();
    post_data.append("list", JSON.stringify(list));
    http.postAjax_clean("/photo-album/product/product_delete_with_list", post_data, function(data){
      if(data.code == 0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}
//删除文件夹图片
function deljs(elem){
  // console.log(elem.value);
  if(confirm("确定要删除此图片?")){
    var delfilename=elem.id;
    var delimgname=elem.value;
    //提交参数json对象delimg_list
    var delimg_list = {
      "number": pro_id_num,
      "imageInfo": []
    };
    $("#list1").find('img[class=img_listimg]').each(function(u,uelem){
      var imglist_name = ((uelem.src).split('/photo-album/image/')[1]).split(';width=240;height=240;equalratio=1')[0];
      // console.log(imglist_name);
      delimg_list.imageInfo.push({
        "image":imglist_name,
        "index":u
      });
    });
    // console.log(delimg_list);
    $(delimg_list.imageInfo).each(function(i,ielem){
      // console.log(ielem);
      if(ielem.image == delimgname){
        // console.log(i);
        // console.log(ielem);
        var arr = delimg_list.imageInfo;
        var rmObj = arr[i];
        arr.splice($.inArray(rmObj,arr),1);
      }
    });
    // console.log(delimg_list);
    // console.log((delimg_list.imageInfo).length);
    if((delimg_list.imageInfo).length != 0){
      $.ajax({
          type : 'POST',
          url : '/photo-album/product/updateProductImage',
          contentType : "application/json",
          data: JSON.stringify(delimg_list),
          success : function(data) {
              if(data.code == 0){
                prolist(pro_id_num);
              }else{
                alert(data.msg);
              }
          }
      });
    }else{
      alert("图片不能少于1张，请重新提交")
    }

    // var delimg_list = [delimgname];
    // var post_data = new FormData();
    // post_data.append('dir', delfilename);
    // post_data.append('filename',JSON.stringify(delimg_list));
    // http.postAjax_clean("/photo-album/image/del", post_data, function(data) {
    //   // console.log(data);
    //     if (data['state'] == true) {
    //         // alert('图片删除成功！');
    //         prolist(pro_id_num);
    //     } else {
    //         alert('产品不能全部删除！');
    //     }
    // });
    $("#allselect_checkout").attr("checked",false);
  }
}

	//全选或反选
	function changeState(isChecked) {
		var chk_list = document.getElementsByTagName("input");
		for (var i = 0; i < chk_list.length; i++) {
			if (chk_list[i].type == "checkbox") {
				chk_list[i].checked = isChecked;
			}
		}
	}

  //批量删除JS
  function fun() {
    if (confirm("确定要进行批量删除吗？")) {
      var boxes = $("input[name=allselect_btn]");
      //提交参数json对象delimg_list
      var delimg_list = {
        "number": pro_id_num,
        "imageInfo": []
      };
      $("#list1").find('img[class=img_listimg]').each(function(u,uelem){
        var imglist_name = ((uelem.src).split('/photo-album/image/')[1]).split(';width=240;height=240;equalratio=1')[0];
        // console.log(imglist_name);
        delimg_list.imageInfo.push({
          "image":imglist_name,
          "index":u
        });
      });
      //做选择图片项delimg_list删除图片对象
      $(boxes).each(function(i,elem){
        if($(elem).is(':checked')){
          var arr = delimg_list.imageInfo;
          var rmObj = arr[i];
          arr.splice($.inArray(rmObj,arr),1);
        }
      });
      console.log(delimg_list);
      if(delimg_list.imageInfo.length != 0){
        $("#allselect_checkout").attr("checked",false);
        $.ajax({
            type : 'POST',
            url : '/photo-album/product/updateProductImage',
            contentType : "application/json",
            data: JSON.stringify(delimg_list),
            success : function(data) {
                if(data.code == 0){
                  prolist(pro_id_num);
                }else{
                  alert(data.msg);
                }
            }
        });
      }else{
        alert("产品图片不能少于1张，请重新选择！");
      }
    }
  }

  //上传插件展开和收起
	function uploadimg() {
		$("#uploadiv").css('display', 'block');
		if (num % 2 == 0) {
			$("#uploadiv").css('display', 'block');
			$("#uploadimg").text("上传插件收缩");
			num++;
		} else {
			$("#uploadiv").css('display', 'none');
			$("#uploadimg").text("上传图片");
			num++
		}
	}

//上传的CSS
var showCover = function(elem) {
	$('body').css('overflow', 'hidden');
	$('#cover').show();
  var file_path =elem.src;
  file_path=file_path.substr(0,file_path.length-34);
	$('#oncover img').attr('src', file_path);
	$('#oncover').show();
};
var closeCover = function(elem) {
	$('body').css('overflow', 'visible');
	$('#cover').hide();
	$('#oncover').hide();
};

//图片排序JS
function list_area(){
  var input_area = $("input[name=input_index]");
  // console.log(input_area);
  var input_area_list = [];
  input_area.each(function(i,elem){
    input_area_list.push({pic:elem.id,order:(i+1)});
  });
  // console.log(JSON.stringify(input_area_list));
  // console.log(pro_id_num);
  var post_data = new FormData();
  post_data.append('number',pro_id_num);
  post_data.append('param',JSON.stringify(input_area_list));
  http.postAjax_clean("/photo-album/product/set_image_order", post_data,function(data) {
    if(data.state=true){
      // console.log(data);
      $("#savesuccess_btn").show();
      setTimeout('$("#savesuccess_btn").hide()',2000);
      prolist(pro_id_num);
    }else{
      alert("图片排序失败！");
    }
  });
  $("#allselect_checkout").attr("checked",false);
};

//保存排序保存
function saveOrder() {
  var data = $("#list1 li").map(function() { return $(this).children().html(); }).get();
  $("input[name=list1SortOrder]").val(data.join("|"));
  list_area();
};

//全选或取消全选事件
function all_select_tf(){
  if($('.checkbox-btn').length != $('.checkbox-btn:checked').length){
    $("#allselect_checkout").removeAttr("checked");
  }else{
    // console.log("true");
    $("#allselect_checkout").prop("checked",true);
  }
}

//图片上传按钮
function upload_btn(elem){
    var product_id_decode = decodeURI(pro_id_num);
    var post_data = new FormData();
  	var input_files = document.getElementById('file_input').files;
  	var length = input_files.length;
  	var obj = {
  		"dir": product_id_decode,
  		"imgs": []
  	}
  	for(var i=0; i<length; i++){
  		post_data.append('file', input_files[i]);
  		obj.imgs.push({
  			"img": input_files[i].name,
  			"index": i
  		});
  	}
  	var jsonObj = JSON.stringify(obj);
  	post_data.append('param', jsonObj);
  	http.postAjax_clean("/photo-album/image/uploadImage", post_data, function(data){
      if(data.code == 0){
        var newimg_json = {
          "number": product_id_decode,
          "imageInfo": []
        }
        var imglist_length = $('img[class=img_listimg]').length - 1;
        $('img[class=img_listimg]').each(function(p,pelem){
          var imglist_name = ((pelem.src).split('/photo-album/image/')[1]).split(';width=240;height=240;equalratio=1')[0];
          newimg_json.imageInfo.push({
            "image" : imglist_name ,
            "index" : p
          });
        });
        $(data.data).each(function(k,kelem){
          // console.log(kelem);
          newimg_json.imageInfo.push({
            "image" : kelem.image ,
            "index" : (imglist_length+k) ,
            "origname" : kelem.origname
          });
        });
        // console.log(newimg_json);
        $.ajax({
            type : 'POST',
            url : '/photo-album/product/updateProductImage',
            contentType : "application/json",
            data: JSON.stringify(newimg_json),
            success : function(data) {
                if(data.code == 0){
                  prolist(pro_id_num);
                }
            }
        });
      }else{
        alert(data.msg);
      }
  	});
}

//产品输入框搜索过滤
function search_input(){
  // console.log(elem);
  var elem = $('#pro_search_input').val();
  if(elem != ""){
    var temp_bigname = elem.toUpperCase();
    var temp_smallname = elem.toLowerCase();
    $($("#listdiv")[0].children).each(function(k,bigelem){
      $(bigelem).hide();
    });
    var img_display_list = [];
    $("#listdiv").find("div[id*='"+temp_bigname+"']").each(function(i,subelem){
      // $(subelem).show();
      // console.log((subelem.id).split('_')[1]);
      img_display_list.push((subelem.id).split('_')[1]);
    });
    $("#listdiv").find("div[id*='"+temp_smallname+"']").each(function(i,subelem){
      // $(subelem).show();
      img_display_list.push((subelem.id).split('_')[1]);
    });
    // console.log(img_display_list);
    //搜索图片中心去重
    var img_list = update_imglist(img_display_list);
    // console.log(img_list);
    // console.log((img_display_list.unique3()).length);
    if(img_list.length != 0){
      for(var k in img_list){
        if(k == 0){
          $('#div_'+img_list[k]).show();
          prolist(img_list[k]);
        }else{
          $('#div_'+img_list[k]).show();
        }
      }
    }else{
      $('#divframe').html("没有搜索到合适的产品，请重新输入！")
    }
  }else{
    $($("#listdiv")[0].children).each(function(k,bigelem){
      $(bigelem).show();
    });
  }
}


//搜索图片中心去重
function update_imglist(datalist){
 var res = [];
 var json = {};
 for(var i = 0; i < datalist.length; i++){
  if(!json[datalist[i]]){
   res.push(datalist[i]);
   json[datalist[i]] = 1;
  }
 }
 return res;
}
