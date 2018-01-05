//公司资料读取
company_allselected_onload();
//今年为toyear_num
var toyear_num = new Date().getFullYear();
//按月开始时间
var month_startday_list = showTime().split('-');
var month_startday = showTime().split('-')[0] + '-' + showTime().split('-')[1] + '-' + '01';
// console.log(month_startday);
//按月结束时间
var month_startday = showTime().split('-')[0] + '-' + showTime().split('-')[1] + '-' + getDaysInOneMonth(showTime().split('-')[0],showTime().split('-')[1]);
// console.log(month_startday);

//按季查询开始时间
var startTime_quarter;
//按季查询结束时间
var endTime_quarter;
//当前全部区域的数组
var area_selected_array = [];

$(function(){
  //当天的js
  console.log(showTime());
  //数据加载
  // example1_datadisplay();
  //dataTable使用，可能不使用
  // $('#example1').dataTable();

  //下拉加载
  fengpage_datalist(showTime(),showTime());
  $('.some_class').datetimepicker({
    timepicker:false,
    lang:"ch",
    format:"Y-m-d"
  });
  //当天数据查询
  $('#showtime').html(showTime());
  $('#time_day_input_submit').val(showTime());
  //当天数据查询
});

//全部公司资料读取
function company_allselected_onload(){
  http.postAjax_clean("/photo-album/teammanger/get_team",'',function(data) {
  	// console.log(data);
    if(data.code == 0){
      var team_list_html = '';
      $(data.data).each(function(i,ielem){
        area_selected_array.push(ielem.id);
        team_list_html +='<li id="li-'+ielem.id+'" onclick="selected_li(this)" class="list-group-item active">'+ielem.name+'</li>';
      });
      $('.list-group').html(team_list_html);
      // console.log(area_selected_array);
    }else{
      alert(data.msg);
    }
  });
}

//单个公司资料读取
function company_oneselected_onload(){
  http.postAjax_clean("/photo-album/teammanger/get_team",'',function(data) {
  	// console.log(data);
    if(data.code == 0){
      var team_list_html = '';
      $(data.data).each(function(i,ielem){
        if(i == 0){
          team_list_html +='<li id="li-'+ielem.id+'" onclick="selected_one_li(this)" class="list-group-item active">'+ielem.name+'</li>';
        }else{
          team_list_html +='<li id="li-'+ielem.id+'" onclick="selected_one_li(this)" class="list-group-item">'+ielem.name+'</li>';
        }

      });
      $('.list-group').html(team_list_html);
    }else{
      alert(data.msg);
    }
  });
}

//"按日查看"按钮
function datadisplay_day_btn(thiselem){
  // var today_data = new Date();
  // console.log(today_data);
  fengpage_datalist(showTime(),showTime());
  $("#showtime").html(showTime());
  $('.modal-body').html('<input type="text" class="some_class" value="" id="time_day_input_submit" value="'+showTime()+'"/>');
  $('.modal-title').html('按日查看');
  $('#time_select_submit').replaceWith('<button id="time_select_submit" type="button" class="btn btn-primary" onclick="time_day_select_submit()" data-dismiss="modal">按日时间提交</button>');
  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');
  $('.some_class').datetimepicker({
    timepicker:false,
    lang:"ch",
    format:"Y-m-d"
  });
}

//"按周查看"按钮
function datadisplay_week_btn(thiselem){
  $('.modal-title').html("按周查看");

  // console.log($('#time_select_submit'));
  $('#time_select_submit').replaceWith('<button id="time_select_submit" type="button" class="btn btn-primary" onclick="time_week_select_submit()" data-dismiss="modal">按周时间提交</button>');

  //判断今天是今年的第几开始
  var d1 = new Date();
  var d2 = new Date();
  d2.setMonth(0);
  d2.setDate(1);
  var rq = d1-d2;
  var s1 = Math.ceil(rq/(24*60*60*1000));
  var s2 = Math.ceil(s1/7);
  // console.log("今天是本年第"+s2+"周");//周日做为下周的开始计算
  // console.log(getDate(toyear_num,(s2-1),0));//获取当周星期一日期
  // console.log(getDate(toyear_num,(s2-1),6));//获取第当周周星期天日期

  //显示数据
  fengpage_datalist(getDate(toyear_num,(s2-1),0),getDate(toyear_num,(s2-1),6));
  //判断今天是今年的第几结束
  $("#showtime").html(toyear_num+"年第"+s2+"周（"+getDate(toyear_num,(s2-1),0)+"~"+getDate(toyear_num,(s2-1),6)+"）");

  //弹出时间选择层开始
  var datadisplay_week_window_html = '';
  datadisplay_week_window_html +='\
    <div class="select_week_div">\
      选择年份\
      <select id="showyear_week_select" name="showyear_week_select" onchange="changeyear(this)">\
      	<option selected="selected" value="2017">2017</option>\
        <option value="2016">2016</option>\
        <option value="2015">2015</option>\
    	</select>\
      选择周期\
      <select id="shownum_week_select" name="shownum_week_select" onchange="changeweek(this)">';
  for(var i = 1 ; i <=s2 ; i++){
    datadisplay_week_window_html +='\
          <option value="'+(s2-i)+'">第'+(s2-i)+'周:('+getDate(toyear_num,(s2-i),0)+'~'+getDate(toyear_num,(s2-i),6)+')</option>';
  }
  datadisplay_week_window_html +='\
      </select>\
    </div>\
    <div><span id="showyear_week_span" >'+toyear_num+'</span>年第<span id="shownum_week_span">'+s2+'</span>周，\
    开始时间：<span id="starttime_week_span">'+getDate(toyear_num,(s2-1),0)+'</span>~结束时间：<span id="endtime_week_span">'+getDate(toyear_num,(s2-1),6)+'</span></div>\
  ';
  $('.modal-body').html(datadisplay_week_window_html);
  //弹出时间选择层结束



  //选项卡样式
  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');
}


//"按月查看"按钮
function datadisplay_month_btn(thiselem){
  // console.log(showtime().);

  $('.modal-title').html("按月查看");
  $('#time_select_submit').replaceWith('<button id="time_select_submit" type="button" class="btn btn-primary" onclick="time_month_select_submit()" data-dismiss="modal">按月时间提交</button>');

  var datadisplay_month_html = '';
  datadisplay_month_html += '\
        <div>\
          选择年份\
          <select id="showyear_month_select" name="showyear_month_select" onchange="changeyear_month(this)">\
          	<option selected="selected" value="2017">2017</option>\
            <option value="2016">2016</option>\
            <option value="2015">2015</option>\
        	</select>\
        </div>';
  datadisplay_month_html += '\
    <table style="width: 100%;height: 146px" id="showyear_month_table" cellspacing="0" cellpadding="0">\
    	<tr>\
    		<td><button id="month-01" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">1</button></td>\
    		<td><button id="month-02" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">2</button></td>\
    		<td><button id="month-03" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">3</button></td>\
    		<td><button id="month-04" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">4</button></td>\
    	</tr>\
    	<tr>\
    		<td><button id="month-05" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">5</button></td>\
    		<td><button id="month-06" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">6</button></td>\
    		<td><button id="month-07" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">7</button></td>\
    		<td><button id="month-08" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">8</button></td>\
    	</tr>\
    	<tr>\
    		<td><button id="month-09" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">9</button></td>\
    		<td><button id="month-10" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">10</button></td>\
    		<td><button id="month-11" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">11</button></td>\
    		<td><button id="month-12" type="button" class="btn btn-default monthbtn" onclick="monthselect(this)">12</button></td>\
    	</tr>\
    </table>\
    <div id="datatime_month_div"></div>\
  ';
  $('.modal-body').html(datadisplay_month_html);
  //今天日期
  // console.log(showTime());
  //当前月份month_num
  var tomonth_num = showTime().split('-')[1];
  // console.log(month_num);
  // $(".monthbtn").each(function(i,ielem){
  //   $(ielem).attr('class','btn btn-default monthbtn');
  // });
  $(".monthbtn").each(function(i,ielem){
    // console.log(parseInt(month_num));
    var month_num =parseInt((ielem.id).split('-')[1]);
    // console.log(parseInt((ielem.id).split('-')[1]));
    if(month_num <= tomonth_num){
      $(ielem).attr('class','btn btn-default monthbtn');
      $(ielem).show();
    }else{
      $(ielem).hide();
    }
  });
  // console.log($('.monthbtn'));
  //显示数据
  fengpage_datalist((showTime().split('-')[0]+'-'+showTime().split('-')[1]+'-01'),showTime());
  $("#showtime").html(showTime().split('-')[0]+"年"+showTime().split('-')[1]+"月");
  $('#month-'+tomonth_num).attr('class','btn btn-primary monthbtn');
  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');
}

//“按季度查看”按钮
function datadisplay_quarter_btn(thiselem){
  $('#time_select_submit').replaceWith('<button id="time_select_submit" type="button" class="btn btn-primary" onclick="time_quarter_select_submit()" data-dismiss="modal">按季时间提交</button>');

  var datadisplay_month_html = '';
  datadisplay_month_html += '\
        <div>\
          选择年份\
          <select id="showyear_quarter_select" name="showyear_quarter_select" onchange="changeyear_quarter(this)">\
            <option selected="selected" value="2017">2017</option>\
            <option value="2016">2016</option>\
            <option value="2015">2015</option>\
          </select>\
        </div>';
  datadisplay_month_html += '\
    <table style="width: 100%;height: 146px" id="showyear_quarter_table" cellspacing="0" cellpadding="0">\
    </table>\
    <div id="datatime_quarter_div"></div>\
  ';
  $('.modal-body').html(datadisplay_month_html);
  //今天日期
  // console.log(showTime());
  //当前月份month_num
  var tomonth_num = parseInt(showTime().split('-')[1]);
  // console.log(tomonth_num);
  switch (tomonth_num) {
    case 1:
      // console.log("第一季");
      $("#showtime").html(showTime().split('-')[0]+"年第一季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-01-01 ~ '+showTime().split('-')[0]+'-03-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-01-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-03-31';
      break;
    case 2:
      // console.log("第一季");
      $("#showtime").html(showTime().split('-')[0]+"年第一季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-01-01 ~ '+showTime().split('-')[0]+'-03-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-01-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-03-31';
      break;
    case 3:
      // console.log("第一季");
      $("#showtime").html(showTime().split('-')[0]+"年第一季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-01-01 ~ '+showTime().split('-')[0]+'-03-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-01-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-03-31';

      break;
    case 4:
      // console.log("第二季");
      $("#showtime").html(showTime().split('-')[0]+"年第二季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-04-01 ~ '+showTime().split('-')[0]+'-06-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-04-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-06-30';

      break;
    case 5:
      // console.log("第二季");
      $("#showtime").html(showTime().split('-')[0]+"年第二季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-04-01 ~ '+showTime().split('-')[0]+'-06-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-04-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-06-30';

      break;
    case 6:
      // console.log("第二季");
      $("#showtime").html(showTime().split('-')[0]+"年第二季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-04-01 ~ '+showTime().split('-')[0]+'-06-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-04-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-06-30';

      break;
    case 7:
      // console.log("第三季");
      $("#showtime").html(showTime().split('-')[0]+"年第三季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-07-01 ~ '+showTime().split('-')[0]+'-09-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-07-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-09-30';

      break;
    case 8:
      // console.log("第三季");
      $("#showtime").html(showTime().split('-')[0]+"年第三季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-07-01 ~ '+showTime().split('-')[0]+'-09-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-07-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-09-30';

      break;
    case 9:
      // console.log("第三季");
      $("#showtime").html(showTime().split('-')[0]+"年第三季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-07-01 ~ '+showTime().split('-')[0]+'-09-30');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-07-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-09-30';

      break;
    case 10:
      // console.log("第四季");
      $("#showtime").html(showTime().split('-')[0]+"年第四季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td><button id="quarter-04" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第四季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-10-01 ~ '+showTime().split('-')[0]+'-12-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-10-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-12-31';

      break;
    case 11:
      // console.log("第四季");
      $("#showtime").html(showTime().split('-')[0]+"年第四季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td><button id="quarter-04" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第四季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-10-01 ~ '+showTime().split('-')[0]+'-12-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-10-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-12-31';

      break;
    case 12:
      // console.log("第四季");
      $("#showtime").html(showTime().split('-')[0]+"年第四季");
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td><button id="quarter-04" type="button" class="btn btn-primary quarterbtn" onclick="quarterselect(this)">第四季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      $('#datatime_quarter_div').html(showTime().split('-')[0]+'-10-01 ~ '+showTime().split('-')[0]+'-12-31');
      //按季当天所在季开始时间
      startTime_quarter = showTime().split('-')[0]+'-10-01';
      //按季当天所在季结束时间
      endTime_quarter = showTime().split('-')[0]+'-12-31';
      break;
  }

  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');

  // $("#showtime").html("2017年第二季度");
  // $('.modal-body').html("按季度查看");
  $('.modal-title').html("按季度查看");
}

//“按年查看”按钮
function datadisplay_year_btn(thiselem){
  $("#showtime").html("2017年");
  $('.modal-body').html("按年查看");
  $('.modal-title').html("按季度查看");
  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');
}

//“自定义时间”按钮
function datadisplay_settime_btn(thiselem){
  fengpage_datalist(showTime(),showTime());
  $("#showtime").html('<span id="setting_startTime_span">'+showTime()+'</span>~<span id="setting_endTime_span">'+showTime()+'</span>');
  $('.modal-body').html('<input type="text" class="some_class" value="'+showTime()+'" id="setting_startTime_input"/>~<input type="text" class="some_class" value="'+showTime()+'" id="setting_endTime_input"/>');
  $('#time_select_submit').replaceWith('<button id="time_select_submit" type="button" class="btn btn-primary" onclick="time_settingtime_select_submit()" data-dismiss="modal">自定义时间提交</button>');
  $("#btn-group-timeselect button").each(function(i,ielem){
    $(ielem).attr('class','btn btn-default');
  });
  $(thiselem).attr('class','btn btn-primary');
  $('.some_class').datetimepicker({
    timepicker:false,
    lang:"ch",
    format:"Y-m-d"
  });
}

//自定义时间按钮提交
function time_settingtime_select_submit(){
  var setting_startTime = $('#setting_startTime_input')[0].value;
  var setting_endTime = $('#setting_endTime_input')[0].value;
  // console.log(setting_startTime,setting_endTime);
  $('#setting_startTime_span').val(setting_startTime);
  $('#setting_endTime_span').val(setting_endTime);
  fengpage_datalist(setting_startTime,setting_endTime);
}

//“全选区域”按钮事件
function area_allselected_btn(thiselem){
  // console.log(thiselem);
  $(thiselem).attr("class", "btn btn-primary");
  $('#area_oneselected_btn').attr('class','btn btn-default');
  company_allselected_onload();
}
//“单选区域”按钮事件
function area_oneselected_btn(thiselem){
  // console.log($(thiselem));
  $(thiselem).attr("class", "btn btn-primary");
  $('#area_allselected_btn').attr('class','btn btn-default');
  company_oneselected_onload();
}


//多选点击选择全部公司
function selected_li(thiselem){
  // console.log($(thiselem));
  // console.log($(thiselem)[0].className);
  if($(thiselem)[0].className == 'list-group-item active'){
    $(thiselem)[0].className = 'list-group-item';
  }else{
    $(thiselem)[0].className = 'list-group-item active';
  }
  // console.log($('#list-group').find('li'));
  var list_group_list = [];
  $('#list-group').find('li').each(function(i,ielem){
    if($(ielem)[0].className == 'list-group-item active'){
      // console.log(ielem.id);
      list_group_list.push((ielem.id).split('-')[1]);
    }
  });
  area_selected_array = list_group_list;
  console.log(area_selected_array);
}

//单选公司事件
function selected_one_li(thiselem){
  // console.log(thiselem);
  $('#list-group').find('li').each(function(i,ielem){
    $(ielem)[0].className = 'list-group-item';
  });
  $(thiselem)[0].className = 'list-group-item active';
  var list_group_list = [];
  list_group_list.push((thiselem.id).split('-')[1]);
  console.log(list_group_list);
}



//时间选择JS
function showTime(){
  var show_day=new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日');
  var time=new Date();
  var year=time.getFullYear();
  // console.log(year.substring(1));
  var month=time.getMonth();
  var date=time.getDate();
  var day=time.getDay();
  var hour=time.getHours();
  var minutes=time.getMinutes();
  var second=time.getSeconds();
  month=parseInt(month)+1;
  month<10?month='0'+month:month;
  hour<10?hour='0'+hour:hour;
  minutes<10?minutes='0'+minutes:minutes;
  second<10?second='0'+second:second;
  // var now_time=''+year+'年'+month+'月'+date+'日'+' '+show_day[day-1]+' '+hour+':'+minutes+':'+second;
  var now_time=''+year+'年'+month+'月'+date+'日';
  // $('#showtime').html(now_time);
  var now_time_data = year + '-' + month + '-' + date;
  return(now_time_data)
}


//下拉加载数据js
function fengpage_datalist(startTime,endTime){
  $('#example1-tbody').html('');
  // console.log(startTime);
  // console.log(endTime);
  var itemIndex = 0;
  var tab1LoadEnd = false;
  // tab
  $('.tab .item').on('click',function(){
      var $this = $(this);
      itemIndex = $this.index();
      $this.addClass('cur').siblings('.item').removeClass('cur');
      $('.lists').eq(itemIndex).show().siblings('.lists').hide();
      // 如果数据没有加载完
      if(!tab1LoadEnd){
          // 解锁
          dropload.unlock();
          dropload.noData(false);
      }else{
          // 锁定
          dropload.lock('down');
          dropload.noData();
      }
      // 重置
      dropload.resetload();
  });

  var counter = 0;
  var page_num = 1;
  // 每页展示10个
  var num = 10;
  var pageStart = 0,pageEnd = 0;

  // dropload
  var dropload = $('.content').dropload({
      scrollArea : window,
      loadDownFn : function(me){
        // 加载菜单一的数据
        // var url_text = '../json/more.json?page=' + counter;
        // var url_text = '/photo-album/OrderStat/productDimension?startTime=2017-06-10&endTime=2017-06-28';
        console.log(area_selected_array);
        // console.log(JSON.stringify(area_selected_array));
        var area_selected_array_txt = JSON.stringify(area_selected_array);area_selected_array_txt
        var url_text = '/photo-album/OrderStat/productDimension?startTime='+startTime+'&endTime='+endTime+'&State=1&areaId='+area_selected_array_txt+'?page=' + counter;
          $.ajax({
              type: 'GET',
              url: url_text,
              dataType: 'json',
              success: function(data){
                // console.log(url_text);
                console.log(data);
                // console.log(data.data.length);
                if(data.code == 0){
                  if(data.data.length != 0){
                    var result = '';
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;
                    if(pageStart <= data.data.length){
                      // console.log(pageStart);
                        for(var i = pageStart; i < pageEnd; i++){
                          // console.log(data.lists[i]);
                            result += '\
                            <tr>\
                              <td>'+(i+1)+'</td>\
                              <td><img src="/photo-album/image/'+data.data[i].image+';width=100;height=100;equalratio=1" alt=""></td>\
                              <td>'+data.data[i].productName+'</td>\
                              <td>'+data.data[i].productNumber+'</td>\
                              <td>'+data.data[i].category+'</td>\
                              <td>'+data.data[i].proWeight+'</td>\
                              <td>'+data.data[i].proCount+'</td>\
                            </tr>\
                            ';
                            if((i + 1) >= data.data.length){
                                // 数据加载完
                                tab1LoadEnd = true;
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                break;
                            }
                        }
                        // 为了测试，延迟1秒加载
                        setTimeout(function(){
                            $('#example1-tbody').eq(0).append(result);
                            // 每次数据加载完，必须重置
                            me.resetload();
                        },1000);
                    }
                  }else{
                    $('.dropload-load').html("此时间没订单！");
                  }
                }else{
                  alert(data.msg);
                }
              },
              error: function(xhr, type){
                  alert('数据读取出错!');
                  // 即使加载出错，也得重置
                  me.resetload();
              }
          });
      }
  });
}

//按日时间查询数据
function time_day_select_submit(){
  // console.log($('#time_day_input_submit')[0].value);
  var today_time =$('#time_day_input_submit')[0].value;
  fengpage_datalist(today_time,today_time);
}


//获得哪年，第几周的周几的日期开始
function getDate(year,period,week){
  // console.log(toyear_num);

    //period:第几周，week:星期几
    if(period != 50){
      if(/^([1-4]?\d|5[12])$/.test(period) && /^[0-6]$/.test(week)){
        // var ymd = new Date(toyear_num,0,1);
        var ymd = new Date(year,0,1);
        ymd.setDate(1 + period * 7 - ymd.getDay() + week);
        return ymd.getFullYear() +"-"+ (ymd.getMonth() + 1) +"-"+ ymd.getDate();
      }else{
        return "参数错误";
      }
    }else{
      var ymd = new Date(year,0,1);
      ymd.setDate(1 + period * 7 - ymd.getDay() + week);
      return ymd.getFullYear() +"-"+ (ymd.getMonth() + 1) +"-"+ ymd.getDate();
    }
}
  // console.log(getDate(2017,0,0));//获取第一周星期天日期
  // console.log(getDate(2016,3,3));//获取第四周星期三日期
  // console.log(getDate(2015,10,6));//获取第十一周星期六日期
//获得哪年，第几周的周几的日期结束

//判断年有几周js开始
function getNumOfWeeks(year){
 var d=new Date(year,0,1);
 var yt=( ( year%4==0 && year%100!=0) || year%400==0)? 366:365;
 return Math.ceil((yt-d.getDay())/7.0);
}
// console.log("2015年有"+getNumOfWeeks(2015)+"周");
// console.log("2016年有"+getNumOfWeeks(2016)+"周");
// console.log("2017年有"+getNumOfWeeks(2017)+"周");
// var a=[2012,2011,2000, 1900];
// for(var i in a){
//  console.log(a[i]+"年有"+getNumOfWeeks(a[i])+"周");
// }
//判断年有几周js结束

//改变年份下拉框开始
function changeyear(thiselem){
  // console.log(toyear_num);
  // console.log(thiselem.value+"年有"+getNumOfWeeks(thiselem.value)+"周");
  if(thiselem.value == toyear_num){
    //判断今天是今年的第几开始
    var d1 = new Date();
    var d2 = new Date();
    d2.setMonth(0);
    d2.setDate(1);
    var rq = d1-d2;
    var s1 = Math.ceil(rq/(24*60*60*1000));
    var s2 = Math.ceil(s1/7);
    // console.log("今天是本年第"+s2+"周");//周日做为下周的开始计算
    // console.log(getDate((s2-1),0));//获取当周星期一日期
    // console.log(getDate((s2-1),6));//获取第当周周星期天日期
    //判断今天是今年的第几结束
    var shownum_week_select_html ='';
    for(var i = 0; i < s2 ; i++){

      shownum_week_select_html +='<option value="'+(s2-i)+'">第 '+(s2-i)+' 周('+getDate(thiselem.value,(s2-i),0)+'~'+getDate(thiselem.value,(s2-i),6)+')</option>';
    }
    $('#shownum_week_select').html(shownum_week_select_html);
    // console.log($('#shownum_week_select'));
    //显示今年年份
    $("#showyear_week_span").html(thiselem.value);
    //显示今年第几周
    $("#shownum_week_span").html(s2);
    //显示今天第几周的开始时间周日
    $("#starttime_week_span").html(getDate(thiselem.value,s2,0));
    //显示今天第几周的开始时间周六
    $('#endtime_week_span').html(getDate(thiselem.value,s2,6));
  }else{
    var year_weeknum =getNumOfWeeks(thiselem.value);
    // console.log(year_weeknum);
    var shownum_week_select_html ='';
    for(var i = 0; i < year_weeknum ; i++){
      // console.log(year_weeknum-i);
      // console.log(getDate(thiselem.value,(year_weeknum-i),0));
      shownum_week_select_html +='<option value="'+(year_weeknum-i)+'">第 '+(year_weeknum-i)+' 周('+getDate(thiselem.value,(year_weeknum-i),0)+'~'+getDate(thiselem.value,(year_weeknum-i),6)+')</option>';
    }
    $('#shownum_week_select').html(shownum_week_select_html);

    //显示今年年份
    $("#showyear_week_span").html(thiselem.value);
    //显示今年第几周
    $("#shownum_week_span").html(year_weeknum);
    //显示今天第几周的开始时间周日
    $("#starttime_week_span").html(getDate(thiselem.value,year_weeknum,0));
    //显示今天第几周的开始时间周六
    $('#endtime_week_span').html(getDate(thiselem.value,year_weeknum,6));
  }
}

//选择年份后第几周数量
function changeweek(thiselem){
  //year_num选择年份
  var year_num =$('#showyear_week_select')[0].value;
  // console.log(year_num);
  // console.log(thiselem.value);

  //显示选择年份
  $("#showyear_week_span").html(year_num);
  //显示选择第几周
  $("#shownum_week_span").html(thiselem.value);
  //显示年份第几周的开始时间周日
  $("#starttime_week_span").html(getDate(year_num,thiselem.value,0));
  //显示年份第几周的开始时间周六
  $('#endtime_week_span').html(getDate(year_num,thiselem.value,6));
}
//“按周时间提交”按钮
function time_week_select_submit(){
  //开始时间
  // console.log('开始时间：'+$('#starttime_week_span')[0].innerText);
  //结束时间
  // console.log('结束时间：'+$('#endtime_week_span')[0].innerText);
  $('#showtime').html($('#showyear_week_span')[0].innerText+'年第'+$('#shownum_week_span')[0].innerText+'周（'+$('#starttime_week_span')[0].innerText+'~'+$('#endtime_week_span')[0].innerText+'）')
  fengpage_datalist($('#starttime_week_span')[0].innerText,$('#endtime_week_span')[0].innerText);
}
//按月选择年份JS
function changeyear_month(thiselem){
  // console.log(thiselem.value);
  // console.log(showTime().split('-')[0]);
  if(thiselem.value == showTime().split('-')[0]){
    $(".monthbtn").each(function(i,ielem){
      // console.log(parseInt(month_num));
      var month_num =parseInt((ielem.id).split('-')[1]);
      var tomonth_num = showTime().split('-')[1];
      if(month_num <= tomonth_num){
        $(ielem).attr('class','btn btn-default monthbtn');
        $(ielem).show();
      }else{
        $(ielem).hide();
      }
    });
  }else{
    $(".monthbtn").each(function(i,ielem){
      $(ielem).attr('class','btn btn-default monthbtn');
      $(ielem).show();
    });
  }
}
//按月选择月份JS
function monthselect(thiselem){
  var year_select_num =$('#showyear_month_select')[0].value;
  var month_select_num =(thiselem.id).split('-')[1];
  $("#datatime_month_div").html(year_select_num+'年'+'('+month_select_num+'月1日-'+month_select_num+'月'+ getDaysInOneMonth (year_select_num, month_select_num)+'日)');
  month_startday = year_select_num + '-' + month_select_num +'-'+'01';
  // console.log(month_startday);
  month_endday = year_select_num + '-' + month_select_num +'-'+getDaysInOneMonth (year_select_num, month_select_num);
  // console.log(month_endday);
  $('.monthbtn').each(function(i,ielem){
    $(ielem).attr('class','btn btn-default monthbtn');
  });
  $(thiselem).attr('class','btn btn-primary monthbtn');
}
//判断某年某月有几天
function getDaysInOneMonth (year, month) {
  month = parseInt(month,10);
  var d = new Date(year, month,0);
  return d.getDate();
}
//"按月时间提交"
function time_month_select_submit(){
  //显示月份标题
  $('#showtime').html(month_startday.split('-')[0]+'年'+month_startday.split('-')[1]+"月");
  //显示数据表格内容
  // console.log(month_startday);
  // console.log(month_endday);
  fengpage_datalist(month_startday,month_endday);
}

//按季度显示第几季按钮table
function quarter_num_display(num){
  // console.log(num);
  switch (parseInt(num)) {
    case 1:
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      break;
    case 2:
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      break;
    case 3:
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      break;
    case 4:
      var showyear_quarter_table_html = '\
      <tr>\
        <td><button id="quarter-01" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第一季</button></td>\
        <td><button id="quarter-02" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第二季</button></td>\
      </tr>\
      <tr>\
        <td><button id="quarter-03" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第三季</button></td>\
        <td><button id="quarter-04" type="button" class="btn btn-default quarterbtn" onclick="quarterselect(this)">第四季</button></td>\
      </tr>\
      ';
      $('#showyear_quarter_table').html(showyear_quarter_table_html);
      break;
  }
}
//按季度查询选择年份
function changeyear_quarter(thiselem){
  // console.log(thiselem.value);
  // console.log(thiselem.id);
  // console.log(toyear_num);
  // console.log(month_startday_list);
  if(thiselem.value != toyear_num){
    quarter_num_display(4);
  }else{
    switch (parseInt(month_startday_list[1])) {
      case 1:
        quarter_num_display(1);
        break;
      case 2:
        quarter_num_display(1);
        break;
      case 3:
        quarter_num_display(1);
        break;
      case 4:
        quarter_num_display(2);
        break;
      case 5:
        quarter_num_display(2);
        break;
      case 6:
        quarter_num_display(2);
        break;
      case 7:
        quarter_num_display(3);
        break;
      case 8:
        quarter_num_display(3);
        break;
      case 9:
        quarter_num_display(3);
        break;
      case 10:
        quarter_num_display(4);
        break;
      case 11:
        quarter_num_display(4);
        break;
      case 12:
        quarter_num_display(4);
        break;
    }
  }
}

//第几季度选择
function quarterselect(thiselem){
  // console.log(thiselem.id);

  //选择年份
  var year_select_num = $('#showyear_quarter_select')[0].value;
  //选择第几季度
  var quarter_select_num =parseInt((thiselem.id).split('-')[1]);
  switch (quarter_select_num) {
    case 1:
      startTime_quarter = year_select_num+'-01-01';
      endTime_quarter = year_select_num+'-03-31';
      $('#datatime_quarter_div').html(startTime_quarter+'~'+endTime_quarter);
      // fengpage_datalist(startTime_quarter,endTime_quarter);
      break;
    case 2:
      startTime_quarter = year_select_num+'-04-01';
      endTime_quarter = year_select_num+'-06-30';
      $('#datatime_quarter_div').html(startTime_quarter+'~'+endTime_quarter);
      // fengpage_datalist(startTime_quarter,endTime_quarter);
      break;
    case 3:
      startTime_quarter = year_select_num+'-07-01';
      endTime_quarter = year_select_num+'-09-30';
      $('#datatime_quarter_div').html(startTime_quarter+'~'+endTime_quarter);
      // fengpage_datalist(startTime_quarter,endTime_quarter);
      break;
    case 4:
      startTime_quarter = year_select_num+'-10-01';
      endTime_quarter = year_select_num+'-12-31';
      $('#datatime_quarter_div').html(startTime_quarter+'~'+endTime_quarter);
      // fengpage_datalist(startTime_quarter,endTime_quarter);
      break;
  }

  $('.quarterbtn').each(function(i,ielem){
    // console.log(ielem);
    $(ielem).attr('class','btn btn-default quarterbtn');
  });
  $(thiselem).attr('class','btn btn-primary quarterbtn');
}
//按季度时间提交
function time_quarter_select_submit(){
  //按季开始时间
  // console.log(startTime_quarter);
  //按季结束时间
  // console.log(endTime_quarter);
  fengpage_datalist(startTime_quarter,endTime_quarter);
}
