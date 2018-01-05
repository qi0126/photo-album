$(function(){
  http.getAjax_clean("/photo-album/company_manage/company_view", function(data) {
  	// console.log(data);
    var company_manage_table_tbody_html='';
    $(data.data).each(function (i,ielem){
      // console.log(ielem);
      company_manage_table_tbody_html+='<tr id="tr_'+ielem.id+'" name="company_onload">\
        <td><input name="companyname" type="text" value="'+ielem.companyName+'"  placeholder="填写公司名称"/> <span style="color:red;">*</span></td>\
        <td><input name="url" type="text" value="'+ielem.url+'"  placeholder="填写公司服务地址"/>\
        :\
        <input name="port" type="text" style="width:60px" value="'+ielem.port+'"  placeholder="端口号"/> <span style="color:red;">*</span></td>\
        <td>';
      if(ielem.logourl != ""){
        company_manage_table_tbody_html+='<img id="img_'+(i+1)+'" src="/photo-album/company_manage/image/'+ielem.logourl+'" width="160px" onclick="$(\'#file_input_'+ielem.id+'\').click()" style="cursor: pointer;"/>\
          <input type="file" id="file_input_'+ielem.id+'" name="file_input" onchange="upload_btn(\''+ielem.id+'\')" style="display:none">';
      }else{
        company_manage_table_tbody_html+='<div id="click_to_upload_area" onclick="$(\'#file_input_'+ielem.id+'\').click()">+上传公司LOGO<br/>建议像素260 x 80</div>\
            <input type="file" id="file_input_'+ielem.id+'" name="file_input" onchange="upload_btn(\''+ielem.id+'\')" style="display:none">';
      }
        company_manage_table_tbody_html+='</td>\
        <td>';
        if(ielem.state==1){
          company_manage_table_tbody_html+='<select id="selected_id_'+ielem.id+'" name="state">\
              <option value="1" selected>有效</option>\
              <option value="0">无效</option>\
            </select>';
        }else{
          company_manage_table_tbody_html+='<select id="selected_id_'+ielem.id+'" name="state">\
              <option value="1">有效</option>\
              <option value="0" selected>无效</option>';
        }
        company_manage_table_tbody_html+='</select>\
        </td>\
        <td style="line-height:40px; width:250px">\
          <span class="company_modify_div">\
            <button type="button" name="company_updata_button" class="btn btn-primary" onclick="company_updata_fun(\''+ielem.id+'\','+(i+1)+')" style="width:80px">保存</button> \
            <button type="button" name="company_del_button" class="btn btn-default" onclick="company_del_btn(\''+ielem.id+'\','+(i+1)+')"  style="width:80px">删除</button>\
            </span>\
        </td>\
      </tr>';
    });
    $('#company_manage_table_tbody').html(company_manage_table_tbody_html);
  });
  // console.log($("#company_manage_table"));

  //权限管理适配开始
	setTimeout(function(){
		http.getAjax_clean("/photo-album/job/getNoAuthMenuCurrUser", function(data) {
			$(data.data).each(function(o,oelem){
				if(oelem.type == 1){
					switch (oelem.btnmark) {
						// 添加公司信息
						case 'company_add_btn':
							$('#company_add_btn').hide();
							break;
						//修改公司信息
						case 'company_onload_fun':
							$('button[name=company_updata_button]').each(function(i,ielem){
								$(ielem).hide();
							});
							break;
						//删除公司信息
						case 'company_del_btn':
              $('button[name=company_del_button]').each(function(i,ielem){
                $(ielem).hide();
              });
							break;
					}
				}
			});
		});
	},200);
	//权限管理适配结束

});

//保存公司管理数据信息
function company_updata_fun(company_id,trnum){
  // console.log(trnum);
  // console.log(company_id);
  // console.log($("#tr_"+company_id));
  // console.log($("#tr_"+company_id).find('select[name=state]')[0].value);
  var companyname_text = $("#tr_"+company_id).find('input[name=companyname]').val().replace(/(^\s*)|(\s*$)/g,'');
  var url_text = $("#tr_"+company_id).find('input[name=url]').val().replace(/(^\s*)|(\s*$)/g,'');
  var port_text = $("#tr_"+company_id).find('input[name=port]').val().replace(/(^\s*)|(\s*$)/g,'');
  // console.log(checkURL(url_text));

  if(companyname_text == "" || url_text == "" || port_text == "" || !checkURL(url_text)){
    if(!checkURL(url_text)){
      alert("服务地址不是合法的url(注：需加http://)!");
      $("#tr_"+company_id).find('input[name=url]').focus();
    }else{
      if(companyname_text == ""){
        alert("公司名称为非空必填项！");
        $("#tr_"+company_id).find('input[name=companyname]').focus();
      }else{
        if(url_text == ""){
          alert("服务地址为非空必填项！");
          $("#tr_"+company_id).find('input[name=url]').focus();
        }else{
          if(port_text == ""){
            alert("端口为非空必填项！");
            $("#tr_"+company_id).find('input[name=port]').focus();
          }
        }
      }
    }
  }else{
    var post_data = new FormData();
    post_data.append('id', company_id);
    post_data.append('companyName',companyname_text);
    post_data.append('url', url_text);
    post_data.append('port',port_text);
    post_data.append('state',$("#tr_"+company_id).find('select[name=state]')[0].value);
    http.postAjax_clean("/photo-album/company_manage/company_modify", post_data,function(data) {
      // console.log(data);
      if(data.code == 0){
        alert("“"+companyname_text+"”公司保存成功！");
      }else{
        alert(data.msg);
      }
    });
  }
}

//新建公司记录事件
function company_add_btn(){
  // console.log($("#company_manage_table_tbody").find("tr"));
  // console.log($("#company_manage_table_tbody").find("tr").length);
  var tr_length =$("#company_manage_table_tbody").find("tr").length + 1;
  // console.log($("#company_manage_table"));
  var company_manage_table_htmltext = '';
  company_manage_table_htmltext +='\
  <tr id="tr_'+ tr_length +'" name="new_line">\
    <td><input id="companyname_'+tr_length+'" name="companyname" type="text" placeholder="填写公司名称"/> <span style="color:red;">*</span></td>\
    <td><input id="url_'+tr_length+'"name="url" type="text" placeholder="填写公司服务地址"/>:<input id="port_'+tr_length+'" name="port" type="text" style="width:60px" placeholder="端口号"/> <span style="color:red;">*</span></td>\
    <td id="newimg_td_'+tr_length+'">\
      <div id="click_to_upload_area" onclick="$(\'#file_input_'+tr_length+'\').click()">+上传公司LOGO<br/>建议像素260 x 80</div>\
      <input type="file" id="file_input_'+tr_length+'" name="img_upload" onchange="upload_newcompany_btn('+tr_length+')" multiple style="visibility:hidden;display:none;">\
    </td>\
    <td>\
      <select id="state_'+tr_length+'" name="state">\
        <option value="1" selected>有效</option>\
        <option value="0">无效</option>\
      </select>\
    </td>\
    <td style="line-height:40px;">\
      <span class="company_modify_div">\
        <button type="button" class="btn btn-primary" onclick="company_save_btn('+tr_length+')" style="width:80px">保存</button> \
        <button type="button" class="btn btn-default" onclick="company_newdel_btn('+tr_length+')" style="width:80px" >删除</button>\
      </span>\
    </td>\
  </tr>\
  \
  ';
  $("#company_manage_table_tbody").append(company_manage_table_htmltext);
}

//新建公司logo上传
function upload_newcompany_btn(num){
  // console.log("#file_input_"+num);
  var input_files = document.getElementById('file_input_'+num).files[0];
  var post_data = new FormData();
  post_data.append('file', input_files);
  http.postAjax_clean("/photo-album/company_manage/logoupdate", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      // console.log(data.filename);
      var newimg_td_html = '';
      newimg_td_html +='\
        <img id="img_'+num+'" src="/photo-album/company_manage/image/'+data.data.filename+'" width="160px" onclick="$(\'#file_input_'+num+'\').click()" style="cursor: pointer;"/>\
        <input type="file" id="file_input_'+num+'" name="file_input" onchange="upload_newcompany_btn(\''+num+'\')" style="display:none">\
      ';
      $("#newimg_td_"+num).html(newimg_td_html);

    }else{
      alert("图片上传失败！");
    }
  });
}

//保存新增公司管理信息事件
function company_save_btn(elem){
  // console.log(elem);
  // console.log($('#companyname_'+elem).val());
  // console.log($('#url_'+elem).val());
  // console.log($('#port_'+elem).val());
  // console.log($("#newimg_td_"+elem).find('img').length);
  // console.log($('#img_'+elem));
  var companyname_text = $('#companyname_'+elem).val().replace(/(^\s*)|(\s*$)/g,'');
  var url_text = $('#url_'+elem).val().replace(/(^\s*)|(\s*$)/g,'');
  var port_text = $('#port_'+elem).val().replace(/(^\s*)|(\s*$)/g,'');

  if(companyname_text == "" || url_text == "" || port_text == "" || !checkURL(url_text)){
    if(!checkURL(url_text)){
        alert("服务地址不是合法的url(注：需加http://)!");
        $('#url_'+elem).focus();
      }else{
      if(companyname_text == ""){
        alert("公司名称为非空必填项！");
        $('#companyname_'+elem).focus();
      }else{
        if(url_text == ""){
          alert("服务地址为非空必填项！");
          $('#url_'+elem).focus();
        }else{
          if(port_text == ""){
            alert("端口为非空必填项！");
            $('#port_'+elem).focus();
          }
        }
      }
    }
  }else{
    // console.log($('#img_'+elem) == null);
    if($("#newimg_td_"+elem).find('img').length == 1){
      // console.log($(ielem).find('img')[0].src.split("/photo-album/company_manage/image/")[1]);
      var post_data = new FormData();
      post_data.append('companyName', companyname_text);
      post_data.append('url', url_text);
      post_data.append('port',port_text);
      post_data.append('state',$('#state_'+elem).val());
      post_data.append('logourl',$('#img_'+elem)[0].src.split("/photo-album/company_manage/image/")[1]);
      http.postAjax_clean("/photo-album/company_manage/company_add", post_data,function(data) {
        if(data.code == 1){
          alert(data.msg);
        }
        if(data.code == 0){
          alert("\“"+companyname_text+"\”公司添加成功！");
        }
      });
    }else{
      var post_data = new FormData();
      post_data.append('companyName', companyname_text);
      post_data.append('url', url_text);
      post_data.append('port',port_text);
      post_data.append('state',$('#state_'+elem).val());
      post_data.append('logourl','');
      http.postAjax_clean("/photo-album/company_manage/company_add", post_data,function(data) {
        if(data.code == 1){
          alert(data.msg);
        }
        if(data.code == 0){
          alert("\“"+companyname_text+"\”公司添加成功！");
        }
      });
    }
  }
}

//删除公司管理事件
function company_del_btn(id,elem){
  if(confirm('确定要删除公司？')){
    var post_data = new FormData();
    post_data.append('id', id);
    http.postAjax_clean("/photo-album/company_manage/company_del", post_data,function(data) {
      if(data.state == true){
        $("#tr_"+id).remove();
      }
    });
  }
}

//删除新增公司事件
function company_newdel_btn(elem){
  // console.log(elem);
  if(confirm('确定要删除公司？')){
    $("#tr_"+elem).remove();
  }
}

//图片上传upload_btn
function upload_btn(company_id){
  if($("#tr_"+company_id).find('input[name=companyname]').val() == "" || $("#tr_"+company_id).find('input[name=url]').val() == "" || $("#tr_"+company_id).find('input[name=port]').val() == ""){
    alert('公司名、公司服务器地址和端口号不能为空，否则无法创建公司！');
  }else{
    // console.log(company_id);
    var input_files = document.getElementById('file_input_'+company_id).files[0];
    // console.log(input_files);
    var post_data = new FormData();
    post_data.append('file', input_files);
    http.postAjax_clean("/photo-album/company_manage/logoupdate", post_data,function(data) {
      // console.log(data);
      // console.log($(ielem).find('select[name=state]'));
      var post_data = new FormData();
      post_data.append('id',company_id);
      post_data.append('companyName',$("#tr_"+company_id).find('input[name=companyname]').val());
      post_data.append('url',$("#tr_"+company_id).find('input[name=url]').val());
      post_data.append('port',$("#tr_"+company_id).find('input[name=port]').val());
      post_data.append('state',$("#tr_"+company_id).find('select[name=state]')[0].value);
      post_data.append('logourl',data.data.filename);
      http.postAjax_clean("/photo-album/company_manage/company_modify", post_data,function(data) {
        // console.log(data);
        location.reload();
      });
    });
  }
}

//查询是否为合法的url
function checkURL(URL){
  var str=URL;
  //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
  //下面的代码中应用了转义字符"\"输出一个字符"/"
  var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  var objExp=new RegExp(Expression);
  if(objExp.test(str)==true){
    return true;
  }else{
    return false;
  }
}
