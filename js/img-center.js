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

  });
});



//文件夹产品生成JS
function prolist(elem){
  $("#allselect_checkout").removeAttr("checked");
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
    		strHtml += "      <input name='allselect_btn' class='checkbox-btn' type='checkbox' value= '" + field.key + "'style='margin:0;'  onchange='all_select_tf()' /> 选择   <button id='" + elem +"' value= '" + field.key + "' target='hide_window' onclick='deljs(this)' class='btn btn-default btn-sm' style='margin-left:85px;border-radius:50%;'> X </button>" + "";
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
    var pro_search_num = $(".pro_search").val();


	//判断输入值在列表中是否存在
    var pro_search_bold = false;
    for (var i = 0; i < pro_datalist.length; i++) {
        if (pro_search_num == pro_datalist[i]) {
            pro_search_bold = true;
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
      switch(data['state']){
        case 0:
          // alert("删除产品成功！");
          location.reload();
          break;
        case 1:
          var json_message = JSON.parse(data.message);
          alert(json_message[0].number+"产品已经在"+json_message[0].note+"中，此产品不能被删除！");
          break;
        default:
          alert("产品删除失败！");
          break;
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
    // console.log(delfilename);
    var delimg_list = [delimgname];
    var post_data = new FormData();
    post_data.append('dir', delfilename);
    post_data.append('filename',JSON.stringify(delimg_list));
    http.postAjax_clean("/photo-album/image/del", post_data, function(data) {
      // console.log(data);
        if (data['state'] == true) {
            // alert('图片删除成功！');
            prolist(pro_id_num);
        } else {
            alert('产品不能全部删除！');
        }
    });
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
      var delimg_list = [];
      $(boxes).each(function(i,elem){
        if($(elem).is(':checked')){
          delimg_list.push(elem.value);
        }
      });
      var post_data = new FormData();
      post_data.append('dir', pro_id_num);
      post_data.append('filename',JSON.stringify(delimg_list));
      http.postAjax_clean("/photo-album/image/del", post_data, function(data) {
          if (data['state'] == false) {
            alert('图片批量删除失败！');
            return;
          }else{
            prolist(pro_id_num);
          }
      });
      $("#allselect_checkout").attr("checked",false);
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

//上传按钮
function upload_btn(elem){
  // console.log($(elem)[0].value);
  // console.log(pro_id_num);
  var post_data = new FormData();
  post_data.append('file', $(elem)[0].value);
  post_data.append('param', pro_id_num);
  http.postAjax_clean("/photo-album/image/upload", post_data,function(data) {
    console.log(data);
  });
}

//产品输入框搜索过滤
function search_input(elem){
  // console.log(elem);
  if(elem != ""){
    var temp_bigname = elem.toUpperCase();
    var temp_smallname = elem.toLowerCase();
    $($("#listdiv")[0].children).each(function(k,bigelem){
      $(bigelem).hide();
    });
    $("#listdiv").find("div[id*='"+temp_bigname+"']").each(function(i,subelem){
      $(subelem).show();
    });
    $("#listdiv").find("div[id*='"+temp_smallname+"']").each(function(i,subelem){
      $(subelem).show();
    });
  }else{
    $($("#listdiv")[0].children).each(function(k,bigelem){
      $(bigelem).show();
    });
  }
}
