var a=window.location.hash; 
var t = a.split("#")[1];

function uploadimg(){
	$("#uploadiv").css('display','block');
	if(num%2 == 0){
		$("#uploadiv").css('display','block');
		$("#uploadimg").text("上传插件收缩");
		num++;
	}
	else{
		$("#uploadiv").css('display','none');
		$("#uploadimg").text("上传图片");
		num++
	}
};

window.onload = function(){
	var url="/image/upload";

	var indexnum= 0;
	function get_cb(data){
		//createHtml(data);
	}

	http.getAjax_clean("/photo-album/manger/miantab", get_cb);

	document.getElementById('click_to_upload_area').addEventListener('click', function(e){$('#file_input').click();}, false);
	
	var product_upload="batar";
	var a=window.location.hash; 
	var product_upload=a.split("#")[1];;//url里的id值
	console.log(product_upload);
	document.getElementById('dir').value=product_upload;
	document.getElementById('file_input').addEventListener('change', function(e){
		var post_data = new FormData();
		var input_files = document.getElementById('file_input').files;
		var length = input_files.length;
		//console.log(product_upload);
		//console.log(length);
		var obj = {
			"dir": product_upload,
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
		//console.log(jsonObj);
		post_data.append('param', jsonObj);
		//console.log(post_data);
		http.postAjax_clean("/photo-album/image/upload", post_data, function(data){
			//console.log(data);
			alert("图片上传成功！");
			location.reload();
		});
	}, false);
};


