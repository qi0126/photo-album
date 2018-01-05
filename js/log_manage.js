$(function(){
 log_load();
});

//日志读取
function log_load(){

  // console.log($("#company_manage_table"));
  http.getAjax_clean("/photo-album/log/find?currentPage="+$('#data_list').val(), function(data) {
    // console.log(data.data);
    // $('#logmanage_table_tbody').html('');
    if(data.code == 0){
      var logmanage_table_tbody_html = '';
      $(data.data).each(function(i,ielem){
        // console.log(ielem.time);
        var log_time = ielem.time;
        var log_time_list = [];
        log_time_list.push(log_time.substr(0,4));
        log_time_list.push(log_time.substr(4,2));
        log_time_list.push(log_time.substr(6,2));
        log_time_list.push(log_time.substr(8,2));
        log_time_list.push(log_time.substr(10,2));
        // console.log(log_time_list);
        log_time = log_time_list[0] + '-' + log_time_list[1] + '-' +log_time_list[2] + ' ' + log_time_list[3] + ':' + log_time_list[4];
        var type_text ='';
        switch (ielem.type) {
          case 0:
            type_text = "业务操作";
            break;
          case 1:
            type_text = "应用内异常";
            break;
          case 2:
            type_text = "崩溃";
            break;
          default:
            type_text = "未定义类别";
            break;
        }
        var operation_text ='';
        switch (ielem.operation) {
          case 0:
            operation_text = "启动";
            break;
          case 1:
            operation_text = "登录";
            break;
          case 2:
            operation_text = "订单操作";
            break;
          case 3:
            operation_text = "退出";
            break;
          default:
            operation_text = "未定义操作";
            break;
        }
        var appType_text ='';
        switch (ielem.appType) {
          case 0:
            appType_text = "安卓客户端";
            break;
          case 1:
            appType_text = "iOS客户端";
            break;
          case 2:
            appType_text = "安卓销售端";
            break;
          case 3:
            appType_text = "iOS销售端";
            break;
          default:
            appType_text = "未定义终端";
            break;
        }
        logmanage_table_tbody_html +='\
            <tr>\
              <td>'+(i+1)+'</td>\
              <td>'+ielem.userName+'</td>\
              <td>'+appType_text+'</td>\
              <td>'+ielem.imei+'</td>\
              <td>'+operation_text+'</td>\
              <td>'+type_text+'</td>\
              <td>'+ielem.info+'</td>\
              <td>'+log_time+'</td>\
            </tr>\
        ';
      });
      $('#logmanage_table_tbody').html(logmanage_table_tbody_html);
      // console.log($('#table_div')[0].outerHTML);
      var table_div_html = $('#logmanage_table')[0].outerHTML;
      $('#table_div').html(table_div_html);
      $('#logmanage_table').DataTable({
          dom: 'Bfrtip',
          lengthMenu: [
              [ 30 ],
              [ '30条']
          ],
          buttons: [
              'pageLength'
          ]
      });
    }else{
      alert(data.msg);
    }

  });


}
