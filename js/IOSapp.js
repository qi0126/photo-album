window.onload = function() {
	//读取网页
    function createHtml(data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<table class="firstpage_img_table_display" cellspacing="0" cellpadding="0">';
            html += '  <tr>';
            html += '    <td style="width:90px;"><div class="carousel_title">标 题</div></td>';
            html += '    <td>' + data[i].title + '<div style="text-align:right;float:right;width:150px;font-size:22px;cursor: pointer;" id="' + data[i].id + '" onclick="delCarousel(this)">删除轮播 <img src="../images/close.png"/></div></td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td><div class="carousel_title">轮播时间</div></td>';
            html += '    <td>开始时间:' + data[i].time.start + '~结束时间:' + data[i].time.end + '</td>';
            html += '  </tr>';
            html += '  <tr>';
            html += '    <td valign="top"><div class="carousel_title">轮播图片</div></td>';
            html += '    <td>';
            for (var j = 0; j < data[i].image.length; j++) {
                if (data[i].image[j] != null) {
                    html += '  <div class="firstpage_img_list">';
                    html += '    <div style="text-align:right;padding:4px;" width="200px"><span id="' + data[i].id + '@' + data[i].image[j].name + '" onclick="delImg(this)"><img src="../images/delimg.png" width="30px"></img</span></div>';
                    html += '    <img src="../image/' + data[i].image[j].name + '" width="220px" height="170px" onclick="showCover(this)"/><br/>';
                    html += '    设置顺序:<input type="text" name="' + data[i].id + '@' + data[i].image[j].name + '" value="' + data[i].image[j].index + '" class="setup_input" onchange="setImgIndex(this)"/><br/>';
                    html += '    设置链接:<input type="text" name="' + data[i].id + '@' + data[i].image[j].name + '" value="' + data[i].image[j].imagelink + '"  class="setup_input" onchange="setImgLink(this)"/>';
                    html += '  </div>';
                }
            }
            html += '    </td>';
            html += '  </tr>';
            html += '  <tr>';
			html += '    <td colspan="2" align="center">';
            html += '        <input type="file" id="add_file_input" name="add_file_input" multiple style="visibility:hidden;">';
            html += '        <button class="btn btn-success btn-lg" id="' + data[i].id + '" onclick="addToCarouselFromLocal(this)">+选择电脑图片上传</button>';
            html += '        <button class="btn btn-info btn-lg" id="' + data[i].id + '" onclick="addToCarouselFromOnLive(this)">+选择已上传图片</button>';
			html += '    </td>';
            html += '  </tr>';
            html += '</table>';
        }
        $('#carousel_preview').append(html);
    }

    function get_cb(data) {
        createHtml(data);
    }
	

    http.getAjax_clean("/photo-album/manger/miantab", get_cb);

    document.getElementById('click_to_upload_area').addEventListener('click',
    function(e) {
        $('#file_input').click();
    }, false);
	
    document.getElementById('file_input').addEventListener('change', function(e) {
        $('#loading').css('display', 'block');
        var post_data = new FormData();
        var input_files = document.getElementById('file_input').files;
		console.log(input_files);
        //var length = input_files.length;
		//console.log(length);
       	post_data.append('file', input_files[0]);
		var versionnum = $("input[type='text']").val();
		console.log(versionnum);
		if(versionnum == "" || versionnum == null){
			alert("请先输入版本号!");
			$('#loading').css('display', 'block');
			document.getElementById("version").focus();
			return;
		}else{
			post_data.append('version', versionnum);
			http.postAjax_clean("/photo-album/app/upload", post_data,
			function(data) {
				if (data['state'] == true) {
					alert('安卓APP上传成功');
					$('#loading').css('display', 'block');
					location.reload();
				} else {
					alert('安卓APP上传异常');
					$('#loading').css('display', 'block');
				}
			});
		}
    }, false);
};

model = {};
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
	if(filename_list.length != 0){
		for (var i = 0; i < filename_list.length; i++) {
			obj.push({
				"name": filename_list[i],
			});
		}
		var jsonObj = JSON.stringify(obj);
		post_data.append("imags", jsonObj);
		http.postAjax_clean("/photo-album/manger/add_producte", post_data, function(data) {
			if (data['state'] == true) {
				alert('添加图片成功');
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
