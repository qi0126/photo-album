//公司资料读取
company_onload();

$(function(){
  example1_datadisplay();

  $('#example1').dataTable();
  $('#example2').dataTable();
  $('#example3').dataTable();
  $('#example4').dataTable();
  $('#example5').dataTable();
  $('#example6').dataTable();


});

//公司资料读取
function company_onload(){
  http.postAjax_clean("/photo-album/teammanger/get_team",'',function(data) {
  	// console.log(data);
    if(data.code == 0){
      var team_list_html = '';
      $(data.data).each(function(i,ielem){
        team_list_html +='<li id="li-'+ielem.id+'" onclick="selected_li(this)" class="list-group-item active">'+ielem.name+'</li>';
      });
      $('.list-group').html(team_list_html);
    }else{
      alert(data.msg);
    }
  });
}

//全部公司多选或单选公司选择
function change_select(thiselem){
  // console.log($(thiselem)[0].checked);
  if($(thiselem)[0].checked == true){
    $('#change_select_span').html('全部公司');
    // location.reload();
  }else{
    $('#change_select_span').html('单选区域');
    // location.reload();
  }
}

//点击选择公司
function selected_li(thiselem){
  // console.log($(thiselem));
  // console.log($(thiselem)[0].className);
  if($(thiselem)[0].className == 'list-group-item active'){
    $(thiselem)[0].className = 'list-group-item'
  }else{
    $(thiselem)[0].className = 'list-group-item active'
  }
  // console.log($('#list-group').find('li'));
  var list_group_list = [];
  $('#list-group').find('li').each(function(i,ielem){
    if($(ielem)[0].className == 'list-group-item active'){
      list_group_list.push((ielem.id).split('-')[1]);
    }
  });
  console.log(list_group_list);
}

function example1_datadisplay(){
  var example1_tbody_html = '';
  for(var i=1;i<=55;i++){
    example1_tbody_html +='\
              <tr>\
                <td>'+i+'</td>\
                <td>System Architect</td>\
                <td>Edinburgh</td>\
                <td>61</td>\
                <td>2011/04/25</td>\
                <td>$320,800</td>\
              </tr>\
    ';
  }
  $('#example1-tbody').html(example1_tbody_html);
  // var table_div_html = $('#logmanage_table')[0].outerHTML;
  // $('#table_div').html(table_div_html);
  // $('#example1').DataTable();
}
