var data_list = [];
var data_userreg = [];
var data_useruse = [];

http.getAjax_clean("/photo-album/statistics/month_use", function(bigdata) {

    http.getAjax_clean("/photo-album/statistics/today", function(data) {
    	// console.log(data);
      $("#totle").text(data.totle);
      $("#todayreg").text(data.todayreg);
      $("#todaylogin").text(data.todaylogin);
    });
    $(bigdata.user_reg).each(function(i,elem){
      data_list.push(elem.time);
      data_userreg.push(elem.number);
    });
    $(bigdata.user_use).each(function(i,elem){
      data_useruse.push(elem.number);
    });
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: '访问系统后台统计平台'
        },
        subtitle: {
            text: '单位（位）'
        },
        xAxis: {
            categories: data_list
        },
        yAxis: {
            title: {
                text: '单位（位）'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '新用户注册数',
            data: data_userreg
        }, {
            name: '使用用户数',
            data: data_useruse
        }]
    });
});
