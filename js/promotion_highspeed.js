var imgdata;
http.getAjax_clean("/photo-album/index/image_list", function(data){
	imgdata = data;
});


//首页读取推广类别数据
$(function(){
	http.getAjax_clean("/photo-album/index/generalization", function(data){
		if(data.length!=0){
			var num =data.length - 4;
			document.getElementById("promo_checkbox").checked=true;
			var text="#valueid"+data.length;
			$(text).attr("selected",true)
			$("#promo_select").show();
			promotion_highspeed_imglist(data.length);
			promotion_highspeed_list(data.length);
			promotion_myimg_list(data.length);
		}else{
			document.getElementById("promo_checkbox").checked=false;
			$("#promo_select").hide();
		}
	});


});
//图标读取数组
var myimg_list=[];
http.getAjax_clean("/photo-album/index/generalization", function(datanumber){
	console.log(datanumber);
	for(var i=0;i<datanumber.length;i++){
		myimg_list.push(datanumber[i].img);
	}
});
var myimbig_list=[];
http.getAjax_clean("/photo-album/index/image_list", function(data){
	//console.log(data);
	for(var i=0;i<data.length;i++){
		//console.log(datanumber[i].img);
		myimbig_list.push(data[i]);
	}
});


function promo_select_num(elem){
	var post_data = new FormData();
	post_data.append('size',elem.value);
	http.postAjax_clean("/photo-album/index/set_size", post_data,
		function(data) {
			//console.log(data["state"]);
			if(data["state"]==true){
				//location.reload();
			}else{
				alert("快捷推广修改别名失败！");
			}
		});
	promotion_highspeed_imglist(elem.value);
	promotion_highspeed_list(elem.value);
	promotion_myimg_list(elem.value);
}
//推广类别HTML
function promotion_highspeed_imglist(num){
		var promotion_imglist_html = "";
		var openwindow_div_html ="";
		var myimages_div_html ="";
		// console.log(num);

		for(var i=0;i<num;i++){
			//快捷推广页面读取系列产品
			promotion_imglist_html +='            <div id="new_Product">'
              +'<div class="firstpage_img_list" style="padding-top:10px; padding-bottom:10px;" id="firstpage_img_list'+i+'">'
                 +'<input id="'+i+'" class="setup_input" style="width:220px;" value="空" onfocus="console.log(this);" onkeydown="if(event.keyCode==13){changename(this);}" ></input>'
                 +'<button data-toggle="modal" data-target="#myImage'+i+'">'
                   +'<img src="/photo-album/index/image/'+i+'" width="200px" height="200px"/>'
                 +'</button>'
                 +'<br>'
                 +'<div align="center">未定义</div>'
                 +'<button class="btn btn-primary"  data-toggle="modal" data-target="#myModal'+i+'">设置推广类别</button>'
               +'</div>'
             +'</div>';
			 //设置推广类别
			 openwindow_div_html +='        <div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabe" aria-hidden="true">'
				  +'<div class="modal-dialog">'
					  +'<div class="modal-content">'
							+'<div class="modal-header active modal-header-class">'
								+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
								+'<h4 class="modal-title" id="myModalLable">设置推广类别--'+i+'</h4>'
							+'</div>'
							+'<div class="modal-body modal-body-class" id="promotion_highspeed_list'+i+'" style="max-height:500px;overFlow:auto;">'
							+'</div>'
							+'<div class="modal-footer">'
								+'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
								+'<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="promotion_highspeed_submit('+i+')">提交更改</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>';
			 //图片修改
			 //console.log(i);

				 myimages_div_html +='        <div class="modal fade" id="myImage'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabe" aria-hidden="true">'
					  +'<div class="modal-dialog" style="width:1170px;">'
						  +'<div class="modal-content">'
								+'<div class="modal-header active">'
									+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
									+'<h4 class="modal-title" id="myModalLable">图标修改--'+i+'</h4>'
								+'</div>'
								+'<div style="height:660px;">'
								+'	<div class="modal-body" id="myimg_pre'+i+'" style="width:30%;float:left;border-right:#ccc solid 1px;height:676px; text-align:center;line-height:50px;">'
								+'		<div id="img-display'+i+'"><img src="/photo-album/index/image/'+myimg_list[i]+'" width="247px" height="247px"></img></div>'
								+'		<div style="font-size:18px;">图标建议尺寸247×247</div>'
								+'		<div><button type="button" class="btn btn-info btn-lg" onclick="upload'+i+'.click()">点击上传自定义图标</button><input type="file" name="txt_file" id="upload'+i+'" class="file-loading" onchange="uploadFile('+i+')" style="display:none;"/></div>'
								+'		<div class="container" style="margin-top:-200px;display:none;">'
								+'        <div class="imageBox">'
								+'            <div class="thumbBox"></div>'
								+'            <div class="spinner" style="display: none">Loading...</div>'
								+'        </div>'
								+'        <div class="action">'
								+'            <input type="file" id="file" style="float:left; width: 250px">'
								+'            <input type="button" id="btnCrop" value="Crop" style="float: right">'
								+'            <input type="button" id="btnZoomIn" value="+" style="float: right">'
								+'            <input type="button" id="btnZoomOut" value="-" style="float: right">'
								+'        </div>'
								+'        <div class="cropped"></div>'
								+'    </div>'
								+'	</div>'
								+'	<div class="modal-body" id="myimg'+i+'" style="width:70%;float:right;height:450px;">'
								+'	</div>'
								+'</div>'
								+'<div class="modal-footer" style="width:100%;">'
									+'<div id="fpage_div_'+i+'" class="fpage_div">'+i+'</div>'
									+'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
									+'<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="myimg_submit('+i+')">提交图片修改</button>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>';
		}

		$("#promotion_imglist").html(promotion_imglist_html);
		$("#openwindow_div").html(openwindow_div_html);
		$("#myimages_div").html(myimages_div_html);

		$(myimg_list).each(function(h,helem){
			// console.log(helem);
			if(helem == ""){
				// console.log(h);
				$("#img-display"+h).html('<img src="/photo-album/img/default.png" width="247px" height="247px"></img>')
			}
		});


			//图片上传预览开始
			var options =
			{
				thumbBox: '.thumbBox',
				spinner: '.spinner',
				imgSrc: 'imgdownload/images/avatar.png'
			}
			var cropper = $('.imageBox').cropbox(options);
			$('#file').on('change', function(){
				var reader = new FileReader();
				reader.onload = function(e) {
					options.imgSrc = e.target.result;
					cropper = $('.imageBox').cropbox(options);
				}
				reader.readAsDataURL(this.files[0]);
				this.files = [];
			})
			$('#btnCrop').on('click', function(){
				var img = cropper.getDataURL();
				$('.cropped').append('<img src="'+img+'">');
			})
			$('#btnZoomIn').on('click', function(){
				cropper.zoomIn();
			})
			$('#btnZoomOut').on('click', function(){
				cropper.zoomOut();
			})
			//图片上传预览结束

		http.getAjax_clean("/photo-album/index/generalization", function(data){
			http.getAjax_clean("/photo-album/manger/get_products_view", function(datanumber){
				// console.log(data);
				var datanumber_list = [];
				for(var k=0;k<datanumber.length;k++){
					datanumber_list.push(datanumber[k].name);
				}
				//console.log(datanumber_list);
				for(var j=0;j<data.length;j++){
					//console.log(data[j].img);
					var img_list;
					if(data[j].img != ""){
						img_list = "/photo-album/index/image/"+data[j].img;
					}else{
						img_list = "/photo-album/img/default.png";
					}
					var promotion_imglist_html ="";
					var action_number = parseInt(data[j].actionname)-1;
					//console.log(data[j].index,j);
					if(data[j].index !=""){
						//var jnum =parseInt(data[j].index);
						// console.log(data[j].index);
						promotion_imglist_html =''
							 +'<input id="'+j+'" class="setup_input" style="width:205px;" value="'+data[j].aliasname+'" onkeydown="if(event.keyCode==13){changename(this);}" onBlur="changename(this);" maxlength="6" ></input>'
							 +'<button data-toggle="modal" data-target="#myImage'+j+'">'
							   +'<img src="'+img_list+'" width="200px" height="200px"/>'
							 +'</button>'
							 +'<br>'
							 +'<div id="datanumber_display_'+j+'" align="center">'+datanumber_list[action_number]+'</div>'
							 +'<button class="btn btn-primary"  data-toggle="modal" data-target="#myModal'+j+'">设置推广类别</button>';
						var firstpage_img_list_number="#firstpage_img_list"+j;
						$(firstpage_img_list_number).html(promotion_imglist_html);
					}
					// console.log(data[j].actionaliasname);
					if(data[j].actionaliasname){
						$("#datanumber_display_"+j).html(data[j].actionaliasname);
					}
				}
			});

		});

}

//弹出框推广类别输入
function promotion_highspeed_list(number){
	//console.log(number);

	var promotion_highspeed_list_html = "";
	http.getAjax_clean("/photo-album/manger/get_products", function(data){
		// console.log(data);
		for(var k=0;k<data.length;k++){
			promotion_highspeed_list_html += '<span style="padding-left:30px;"><input id="'+data[k].id+'" name="promotion_highspeed_check" type="radio" value="'+data[k].productsname+'" style="margin:0;"/> '+data[k].productsname+' </span>';
			if(data[k].products.length !=0){
				promotion_highspeed_list_html += ':[';
				for (var i = 0; i < data[k].products.length; i++) {
					// console.log(data[k].products[i]);
					promotion_highspeed_list_html += '  <input type="radio" value="'+data[k].products[i].name+'" id="'+data[k].products[i].productId+'" style="margin:0;" name="promotion_highspeed_check"/><span style="color:#2b6aa2">'+data[k].products[i].name+'</span><span style="width:50px;"></span>';
				}
				promotion_highspeed_list_html +=']<br/>';
			}else{
				promotion_highspeed_list_html +='<br/>';
			}
		}

	http.getAjax_clean("/photo-album/index/generalization", function(data){
		var promo_num="";
		for(var j=0;j<number;j++){
			promo_num="#promotion_highspeed_list"+j;
    		$(promo_num).append(promotion_highspeed_list_html);
		}
	});
  });
}
//弹出框图片输入
function promotion_myimg_list(num){
	fpage_fun(num,1);
}

//弹出框图片分页
function fpage_fun(num,page_num){
	// console.log(imgdata);
	// console.log(page_num);
	// console.log(imgdata.length);
  var sumpage_num =parseInt((imgdata.length-1)/12+1);
	// console.log("总页数："+sumpage_num);
	var fpage_div_test ='';
	//
	if((sumpage_num>1)&&(page_num!=sumpage_num)){
		if((page_num ==1)&&(page_num!=sumpage_num)){
			fpage_div_test += '<button type="button" class="btn btn-info" onclick="fpage_fun('+num+',1);">首 页</button> <button type="button" class="btn btn-warning" onclick="fpage_fun('+num+','+(page_num+1)+');">下一页</button> <button type="button" class="btn btn-info" onclick="fpage_fun('+num+','+sumpage_num+');">末 页</button> ';
		}else{
			fpage_div_test += '<button type="button" class="btn btn-info" onclick="fpage_fun('+num+',1);">首 页</button> <button type="button" class="btn btn-default" onclick="fpage_fun('+num+','+(page_num-1)+');">上一页</button> <button type="button" class="btn btn-warning" onclick="fpage_fun('+num+','+(page_num+1)+');">下一页</button> <button type="button" class="btn btn-info" onclick="fpage_fun('+num+','+sumpage_num+');">末 页</button> ';
		}
	}
	if((sumpage_num>1)&&(page_num==sumpage_num)){
		fpage_div_test += '<button type="button" class="btn btn-info" onclick="fpage_fun('+num+',1);">首 页</button> <button type="button" class="btn btn-default" onclick="fpage_fun('+num+','+(page_num-1)+');">上一页</button> <button type="button" class="btn btn-info" onclick="fpage_fun('+num+','+sumpage_num+');">末 页</button> ';
	}
	if(sumpage_num <= 1){
		fpage_div_test +="云端共有 <span style='color:red;font-weight:bold;'>"+imgdata.length+"</span> 个图标";
	}else{
		fpage_div_test +="云端共有 <span style='color:red;font-weight:bold;'>"+imgdata.length+"</span> 个图标，这是第 <span style='color:blue;font-weight:bold;'>"+page_num+"</span> 页";
	}
	$(".fpage_div").html(fpage_div_test);
	var display_pro_list = [];
	for(var k=((page_num-1)*12);k<((page_num)*12);k++){
		if(imgdata[k]){
			display_pro_list.push(imgdata[k]);
		}
	}
	// console.log(display_pro_list);
	var myimg_img ='';
	for(var j=0;j<display_pro_list.length;j++){
		myimg_img 	+='	<div class="firstpage_img_list" style="width:23%;padding:10px;">'
		  		+'		<div style="text-align:right;"><button id="delmyimg'+j+'" class="btn btn-warning btn-xs" onclick="delmyimg('+j+')">X</button></div>'
					+'		<img src="/photo-album/index/image/'+display_pro_list[j]+'" width="140px" height="140px;"></img><br/>'
					+'		<input type="radio" id = "'+display_pro_list[j]+'" name = "myimg" value="'+display_pro_list[j]+'"/>'
					+'	</div>';
	}
	//console.log(myimg_img);
	for(var i=0;i<num;i++){
		var myimg_num = "#myimg"+i;
		$(myimg_num).html(myimg_img);
	}
}

//设置推广类别JS
function promotion_highspeed_submit(elemid){
	// console.log(elemid);
  var promo_id;
	var promo_value;
  //jquery获取复选框值
  $('input[name="promotion_highspeed_check"]:checked').each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
		// console.log(this.value);
		// promo_value=parseInt(this.value) + 1;//将选中的值添加到数组chk_value中
		promo_id = this.id;
		promo_value = this.value;
  });
	// console.log(promo_value);
  var elem_id = parseInt(elemid);
  var post_data = new FormData();
  post_data.append('index',elem_id);
  post_data.append('action',promo_id);
	post_data.append('actionaliasname',promo_value);
  http.postAjax_clean("/photo-album/index/set_generalization", post_data,
	function(data) {
		if(data["state"]==true){
			//alert("设置推广类别成功！");
			location.reload();
		}else{
			alert("设置推广类别失败！");
		}
  });

}

//快捷推广修改别名js
function changename(elem){
	// console.log(elem);
	//console.log(elem.value);
	var post_data = new FormData();
	post_data.append('index',elem.id);
	post_data.append('name',elem.value);
	// post_data.append('actionaliasname',elem.value);
	http.postAjax_clean("/photo-album/index/set_generalization", post_data,
		function(data) {
			//console.log(data["state"]);
			if(data["state"]==true){
				// alert("快捷推广修改别名成功！");
				location.reload();
			}else{
				alert("快捷推广修改别名失败！");
			}
		});
}
//图片修改JS
function myimg_submit(num){
	//console.log(num);
	var newPro_id = $('input[name="myimg"]:checked').val();
	//console.log(newPro_id);
	if(newPro_id!=undefined){
		var post_data = new FormData();
		post_data.append('imagename',newPro_id);
		post_data.append('index',num);
		http.postAjax_clean("/photo-album/index/set_image", post_data,
		function(data) {
			if(data["state"]==true){
				// alert("图片更改成功！");
				location.reload();
			}else{
				alert("图片更改失败！");
			}
		});
	}else{
		alert("图片更改失败，请重新选择图片！");
	}

}

//快捷推广开启
function promo_checkbox(elem){
	if(elem.checked){
		var post_data = new FormData();
		post_data.append('isopen',true);

        http.postAjax_clean("/photo-album/index/set_is_open", post_data,
		function(data) {
			//console.log(data);
			if(data["state"]==true) {
                http.getAjax_clean("/photo-album/index/generalization", function(data){
                    console.log(data.length);
										var text="#valueid"+data.length;
										$(text).attr("selected",true)
										promotion_highspeed_imglist(data.length);
										promotion_highspeed_list(data.length);
										promotion_myimg_list(data.length);
                 });
            }
		});
		$("#promotion_imglist").show();
		$("#promo_select").show();
	}else{
		var post_data = new FormData();
		post_data.append('isopen',false);
		http.postAjax_clean("/photo-album/index/set_is_open", post_data,
		function(data) {
			//console.log(data);
		});
		$("#promotion_imglist").hide();
		$("#promo_select").hide();
	}
}

//文件上传
function uploadFile(num){
	console.log(num);
	//console.log(document.getElementById(upload_name).files[0]);
	var upload_name = "upload" + num;
	var upload_file =document.getElementById(upload_name).files[0];
	//console.log(upload_file);
	if(upload_file != undefined){
		var post_data = new FormData();
		post_data.append("file",upload_file);
		post_data.append("index",num);
		http.postAjax_clean("/photo-album/index/update_image", post_data,
			function(data) {
				if(data["state"]==true){
					// alert("图片上传成功！");
					location.reload();
				}else{
					alert("图片上传失败！");
				}
			}
		);
	}else{
		alert("图片上传失败，请重新选择图片！");
	}

}

//图标删除
function delmyimg(num){
	var myimbig_name = myimbig_list[num];
	var post_data = new FormData();
	post_data.append("imgname",myimbig_name);
	if(confirm('确定要执行删除此图标吗?')) {
		http.postAjax_clean("/photo-album/index/image_del", post_data,
				function(data) {
				if(data["state"]==true){
					// alert("图标删除成功！");
					location.reload();
				}else{
					alert("图标删除失败！");
				}
			}
		);
	}
}
