
function init() {
    $("body").height($(window).height() - 80);
    $("#iframe-main").height($(window).height() - 90);
    $("#sidebar").height($(window).height() - 50);
}

$(function() {
    init();
    $(window).resize(function() {
        init();
    });
});
// JavaScript Document
var urlimg = "/photo-album/image/";
var urlimglist = urlimg + "listfiles?dir=";
var urlimgdel = urlimg + "del?dir=batar&filename=";

var urllistdir = urlimg + "getdir_number";
var urldeldir = urlimg + "rmdir?dir=";

//url里的id值
var a = window.location.hash;
var t = a.split("#")[1] || "";

function getjson(product_id){
	var jsonurl = urlimglist + product_id;
	$.getJSON(jsonurl,function(result){
	var $jsontip = $("#list1");
	var strHtml = "";//存储数据的变量
	$jsontip.empty();//清空内容
	var iadd = 0;
	  $.each(result, function(i, field){
		  	iadd = i+1;
			strHtml += "		<li>";
			strHtml += '<div class="img_listimg_div"><img src=' + urlimg +　field.key + ' class="img_listimg" onclick="showCover(this);"></img><span></span><input type="text" value="'+iadd+'" name="input_index" class="input_area"></input></div>';
			strHtml += "<div style='padding-left:20px'><input name='checkbox' type='checkbox' value= '" + field.key + "'style='margin:0;' /> 选择   <a href='" + field.key + "' target='hide_window' onclick='deljs()'> <img src='/photo-album/images/delimg.png' class='delimg'/></a></div>" + "";
			strHtml += "		</li>";
	  });
	  $("#list1").html(strHtml);
	});
};
getjson(t);
//产品列表数组
var pro_datalist = [];

var getlistdiv = function() {
	var $jsontip = $("#listdiv");
	var strHtml = ""; //存储数据的变量
	var str_Datalist = "";
	$jsontip.empty(); //清空内容
	http.getAjax_clean(urllistdir, function(data) {
		//console.log(data);
		$.each(data,function(infoIndex, info) {
			                //产品列表
                strHtml += "<div>" + "· <a href='#" + info + "'>" + infoIndex + "</a><a href='" + urldeldir + info + "' target='del-product' class='label label-danger' style='float:right;font-size:10px;margin-top:6px' onclick='winreload();'>X</a></div>";

                //搜索栏数组
                str_Datalist += "<option value='" + infoIndex + "'>";
                //数组变量pro_datalist加入
                pro_datalist.push(infoIndex);

		});
		$("#listdiv").html(strHtml); //显示处理后的数据
		$("#pro_search").html(str_Datalist);
	});

}
getlistdiv();

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
		$.getJSON("/photo-album/image/getdir_number",function(result){
			$.each(result, function(i, field){
				if(pro_search_num == i){
					pro_search_num_submit = field;
					var img_dir = "/photo-album/web/img-center.html#" + pro_search_num_submit;
					window.location.href=img_dir;
				}else{
					return;
				}
			})
		})
    } else {
        alert("产品不存在");
    }
}

//输入框按回车事件
function setTrack(tt, event) {
    var e = event ? event: window.event
    if (e.keyCode == 13) {
        product_search();
    }
}
function winreload(){
	setTimeout("location.reload();",3000);
	}

//产品列表文件删除
function winreload(){
	if(confirm("确认删除此产品吗？")){
		setTimeout("document.getElementById('iframe_win').innerHTML='';alert('删除产品成功！');location.reload();", 3000);
	}
}


var numtt = 0;
var num = 0;

//产品图片显示JS
	window.onhashchange = function()
	{
		var product_id=window.location.hash.split("#")[1];
		var product_id_code = "";
		var product_id_decode = decodeURI(product_id);
		$.getJSON("/photo-album/image/getdir_number",function(result){
			$.each(result, function(i, field){
				if(product_id_decode == field){
					product_id_code = i;
					$("#dir").html(product_id_code);
					document.getElementById('file_input').addEventListener('change', function(e){
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
						http.postAjax_clean("/photo-album/image/upload", post_data, function(data){
							alert("图片上传成功！");
							var img_dir = "/photo-album/web/img-center.jsp#" + pro_search_num_submit;
							window.location.href=img_dir;
						});
					}, false);

				}
			})
		})
		//显示产品图片
		  function getjson(product_id){
				var jsonurl = urlimglist + product_id;
				var iadd = 0;
				$.getJSON(jsonurl,function(result){
				var $jsontip = $("#list1");
				var strHtml = "";//存储数据的变量
				$jsontip.empty();//清空内容
				  $.each(result, function(i, field){
					  iadd= i+1;
					strHtml += "		<li>";
					strHtml += '<div class="img_listimg_div"><img src=' + urlimg +　field.key+ ' class="img_listimg" onclick="showCover(this);"></img><span></span><input type="text" value="'+iadd+'" name="input_index" class="input_area"></input></div>';
					strHtml += "<div style='padding-left:20px'><input name='checkbox' type='checkbox' value= '" + field.key + "'style='margin:0;' /> 选择   <a href='/photo-album/image/del?dir="+ t +"&filename="  + field.key + "' target='hide_window' onclick='deljs()'> <img src='/photo-album/images/delimg.png' class='delimg'/></a></div>" + "";
					strHtml += "		</li>";
				  });
				  $("#list1").append(strHtml);
				});
		  };
			getjson(product_id);
			function fget_product_name(){
				var jsonurl = urlimglist + product_id;
				//console.log(jsonurl);
				$.getJSON("/photo-album/image/getdir_number",function(result){
					//console.log(product_id);
					product_id = decodeURI(product_id);
					$.each(result, function(i, field){
						if(product_id == field){
							$("#listdd").html(i);
						}else{
							return;
						}
					});
				});
			}
			fget_product_name();
	}

	//单个图片文件的删除
	function deljs(url) {
		if(confirm("确认删除吗？")){
			setTimeout("document.getElementById('iframe_win').innerHTML='';alert('删除图片成功！');location.reload();", 5000);
		}
	}

	//批量删除JS
	function fun() {
		if (confirm("确定要进行批量删除吗？")) {
			var boxes = document.getElementsByTagName("input");
			//var val = [];
			var iframe_html = "";
			for (i = 0; i < boxes.length; i++) {
				if (boxes[i].name == "checkbox" && boxes[i].checked == true) {
				   //console.log(boxes[i].value);'/photo-album/image/del?dir="+ t +"&filename="  + field.key + "'
				   iframe_html += "<iframe src='/photo-album/image/del?dir="+ t +"&filename=" + boxes[i].value + "' style='display:none;'></iframe>"
				}
			}
			document.getElementById("iframe_win").innerHTML = iframe_html;
			setTimeout("document.getElementById('iframe_win').innerHTML='';alert('批量删除图片成功！');location.reload();", 5000);
		} else {
			return;
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


var showCover = function(elem) {
	$('body').css('overflow', 'hidden');
	$('#cover').show();
	//console.log(elem);
	var file_path = elem.src;
	$('#oncover img').attr('src', file_path);
	$('#oncover').show();
};
var closeCover = function(elem) {
	$('body').css('overflow', 'visible');
	$('#cover').hide();
	$('#oncover').hide();
};
