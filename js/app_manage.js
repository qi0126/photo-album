$(function(){
  // console.log($("#company_manage_table"));
  http.getAjax_clean("/photo-album/appversion/getversionlist", function(data) {
    if(data.msg=="获取成功"){
      var app_manage_list_table_tbody_html ='<tr><td>序号</td><td>平台</td><td>版本号</td><td>地址</td><td>强制升级</td><td>发布时间</td><td>发布说明</td><td>删除</td></tr>';
      $(data.data).each(function(i,ielem){
        // console.log(ielem);
        var temptype = 'IOS客户端';
        switch (ielem.type) {
          case 0:
            temptype = 'IOS客户端';
            break;
          case 1:
            temptype = 'Android客户端';
            break;
          case 2:
            temptype = 'IOS销售端';
            break;
          case 3:
            temptype = 'Android销售端';
            break;
        }
        var tempisMandUpdate = '否';
        if(ielem.isMandUpdate == 1){
          tempisMandUpdate = '是';
        }else{
          tempisMandUpdate = '否';
        }
        app_manage_list_table_tbody_html +='\
          <tr>\
            <td>'+(i+1)+'</td>\
            <td>'+temptype+'</td>\
            <td>'+ielem.newVersion+'</td>';
        if(checkURL(ielem.url)){
          app_manage_list_table_tbody_html +='<td style="max-width: 324px;word-break: break-all;"><a href="'+ielem.url+'">'+ielem.url+'</a></td>';
        }else{
          app_manage_list_table_tbody_html +='<td style="max-width: 324px;word-break: break-all;">'+ielem.url+'</td>';
        }
        app_manage_list_table_tbody_html +='\
            <td>'+tempisMandUpdate+'</td>\
            <td>'+ielem.date+'</td>\
            <td style="text-align: left;padding-left:20px;max-width: 324px;word-break: break-all;">'+ielem.context+'</td>\
            <td><button type="button" class="btn btn-danger" onclick="delVersion(\''+ielem.id+'\')">删 除</button></td>\
          </tr>\
        ';
      });
      $('#app_manage_list_table_tbody').html(app_manage_list_table_tbody_html);
    }
  });
  //权限管理适配开始
  setTimeout(function(){
    http.getAjax_clean("/photo-album/job/getNoAuthMenuCurrUser", function(data) {
      $(data.data).each(function(o,oelem){
        if(oelem.type == 1){
          // console.log(oelem.menuname);
          switch (oelem.menuname) {
            // 添加版本信息
            case '添加版本信息':
              $('#app_manage_table').hide();
              break;
            //查看APP版本
            case '查看APP版本':
              break;
          }
        }
      });
    });
  },200);
  //权限管理适配结束
});

//查一个URL是否为合法的url
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

//APP版本升级版本添加
function appmanage_add_btn(){
  if($('select[name=type]')[0].value != '' && $('input[name=newVersion]').val() != '' && $('input[name=url]').val() != '' && $('select[name=isMandUpdate]')[0].value != ''){
    //判断url是否为合法的url
    if(checkURL($('input[name=url]').val())){
      // console.log("条件成立！");
      var post_data = new FormData();
      post_data.append('appName','珠宝图鉴');
      post_data.append('type', $('select[name=type]').val());
      post_data.append('newVersion',$('input[name=newVersion]').val());
      post_data.append('url', $('input[name=url]').val());
      post_data.append('isMandUpdate', $('select[name=isMandUpdate]').val());
      post_data.append('context', $('textarea[name=context]').val());
      http.postAjax_clean("/photo-album/appversion/saveversion", post_data,function(data) {
        // console.log(data);
        if(data.msg=="保存成功"){
          // alert(data.msg);
          $('select[name=type]').val(0);
          $('input[name=newVersion]').val('');
          $('input[name=url]').val('');
          $('select[name=isMandUpdate]').val('否');
          $('select[name=isMandUpdate]').val();
          $('textarea[name=context]').val('');
          location.reload();
        }else{
          alert(data.msg);
        }
      });
    }else{
      alert("地址为不合法的url,请重新输入!")
    }
  }else{
    alert("请填写完整新版本信息！");
  }
}
//取消按钮
function appmanage_cancel_btn(){
  $('select[name=type]').val(0);
  $('input[name=newVersion]').val('');
  $('input[name=url]').val('');
  $('select[name=isMandUpdate]').val('否');
  $('select[name=isMandUpdate]').val();
  $('textarea[name=context]').val('');
  location.reload();
}

//删除app版本
function delVersion(elem){
  if(confirm("请确认删除此版本！")){
    // console.log(elem);
    var post_data = new FormData();
    post_data.append('id', elem);
    http.postAjax_clean("/photo-album/appversion/deleteVersion", post_data,function(data) {
      // console.log(data);
      if(data.code ==0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}
