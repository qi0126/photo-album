window.onload = function() {
	//安卓APP上传列表
    function createHtml(data) {
        var html = '';
		var tem="";
        for (var i = 0; i < data.length; i++) {
			data[i].note=data[i].note.replace(/\n/g,"<br/>");
            html += '<tr>'
                 + ' <td>'+ data[i].version +'</td>'
                 + '   <td>' + data[i].thispackagemd5 +'</td>'
                 + '   <td>' +'<a href="/photo-album/app/download/' + data[i].package_name + '">' + data[i].package_name + '</a></td>'
                 + '   <td>' + data[i].time + '</td>'
				 + '   <td align="left">' + data[i].note + '</td>'
                 + '   <td>' + '<button class="btn btn-warning" onclick="delapplist(this)" id="' + data[i].thispackagemd5 + '">删 除</button>' + '</td>'
                 + '</tr>';

        }
        $('#applist').append(html);
    }
	//JSON调用列表JS
    function get_cb(data) {
        createHtml(data);
    }
	//调用app上传
    http.getAjax_clean("/photo-album/app/info", get_cb);
	
    document.getElementById('click_to_upload_area').addEventListener('click',
    function(e) {
        $('#file_input').click();
    }, false);
    document.getElementById('file_input').addEventListener('change', function(e) {
        $('#loading').css('display', 'block');
        var post_data = new FormData();
        var input_files = document.getElementById('file_input').files;
       	post_data.append('file', input_files[0]);
		var versionnum = $("input[type='text']").val();
		var note = document.getElementById("note").value;
		if(!versionnum){
			alert("请先输入版本号!");
			$('#loading').css('display', 'none');
			document.getElementById("version").focus();
			return;
		}else{
			if(!note){
				alert("备注内容不能为空!");
				$('#loading').css('display', 'none');
				document.getElementById("note").focus();
				return;
			}else{
				post_data.append('version', versionnum);
				post_data.append('note', note);
				http.postAjax_clean("/photo-album/app/upload", post_data,
				function(data) {
					if (data['state'] == true) {
						document.getElementById("note").value="";
						document.getElementById("version").value="";
						alert('安卓APP上传成功');
						$('#loading').css('display', 'block');
						location.reload();
					} else {
						alert('安卓APP上传异常');
						$('#loading').css('display', 'block');
					}
				});
			}
		}
    }, false);
	

	//JSON调用生成二维码
	//获取本地IP地址和端口号
	var localurl=document.location.href.split("/")[2];
	var local="http://"+localurl+"/photo-album/app/download/newversion";
	$('#code').qrcode(local);
	$('#code1').html("<a href='"+local+"'>安卓版最新APP二维码下载</a>");
};

//删除APP版本
function delapplist(elem){
	//JSON调用列表JS

	var post_data = new FormData();
	post_data.append("md5",elem.id);
    http.postAjax_clean("/photo-album/app/delete", post_data,
	function(data) {
		if(data["state"]==true){
			alert("删除安卓APP成功!");
			location.reload();
		}else{
			alert("删除安卓APP失败！");
			return;
		}
	});
}

//版本号只能输入数字
function keyPress() {    
     var keyCode = event.keyCode;    
     if ((keyCode >= 48 && keyCode <= 57)||(keyCode = 110))    
    {    
         event.returnValue = true;    
     } else {    
           event.returnValue = false;    
    }    
 }    
 
 
