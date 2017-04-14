var error_display_html = '';
var error_display_number = 0;
var localurl=document.location.href.split("/")[2];
var proIdlist = [];
//导入产品个数
var pro_num = 0 ;

//开始时间starttime_data
var starttime_data = "";
//结束时间
var endtime_data = "";

var websocket = null;

reconnect();
//websocket连接和自动连接
function reconnect(){

	if ('WebSocket' in window) {
		websocket = new WebSocket("ws://"+localurl+"/photo-album/input_message");
	}
	else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket("ws://"+localurl+"/photo-album/input_message");
	}
	else {
		websocket = new SockJS("ws://"+localurl+"/photo-album/input_message");
	}
	websocket.onopen = onOpen;
	websocket.onmessage = onMessage;
	websocket.onerror = onError;
	websocket.onclose = onClose;
}



function onOpen(openEvt) {
	//alert(openEvt.Data);
}

function onMessage(evt) {
	if(evt.data){
		$("#addwindow").show();
	}
	console.log(evt.data);
	if(JSON.parse(evt.data).type == true){
		pro_num++;
		// console.log(pro_num);
	}
	// if(JSON.parse(evt.data).total != -2){
		if(JSON.parse(evt.data).total != -2){
	  	var percent = parseInt((JSON.parse(evt.data).done+1)/(JSON.parse(evt.data).total)*100);
			var pro_number = JSON.parse(evt.data).total;
		}else{
			var percent = 0;
			var pro_number = 0;
		}
		if((JSON.parse(evt.data).done) !=JSON.parse(evt.data).total){
			// console.log(percent+'%');
			$("#loader").html('\
				<div class="progress progress-striped active">\
					<div class="progress-bar progress-bar-success" role="progressbar"\
						 aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"\
						 style="width: '+percent+'%;">\
						<span class="sr-only">'+percent+'% 完成</span>\
					</div>\
				</div>\
				<div><h1>'+percent+'% 完成</h1></div>\
				<div id="percentId" >\
					<h3>共有'+pro_number+'个产品，已经处理了'+pro_num+'个产品,导入异常有<span style="color:red">'+error_display_number+'</span>个。</h3><br/>\
				</div>\
				<div id="error-display" style="overFlow:auto;max-height:300px;width:96%;"></div><br/>\
			');
		}else{
			$("#loader").html('\
			<div style="text-align:right;padding-right:30px;padding-top:30px;">\
				<button type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
			</div>\
			<img src="../images/succes.png" height="80px"/>\
			<h3 style="margin:0 auto;display:none;">'+pro_num+'款产品已导入,导入异常有<span style="color:red">'+error_display_number+'</span>个！</h3><br/>\
			<h3 style="margin:0 auto;color:#de7a0e;">'+JSON.parse(evt.data).message+'</h3><br/>\
			<div>\
				<div id="error-display" style="overFlow:auto;max-height:300px;width:96%;">\
			</div><br/>\
			');
		}



 // 	console.log(JSON.parse(evt.data).message);
	if(JSON.parse(evt.data).type == false){
		// console.log(JSON.parse(evt.data).message);
		if(JSON.parse(evt.data).total == -2 || JSON.parse(evt.data).total == -1){
			error_display_html += '<div style="text-align:left;padding-left:40px;color:blue;">'+JSON.parse(evt.data).message+'</div>';
		}else{
			error_display_number++;
			error_display_html += '<div style="text-align:left;padding-left:40px;color:red;">'+JSON.parse(evt.data).message+'</div>';
		}
	}
	if(JSON.parse(evt.data).message == "ftp路径错误"){
		error_display_html += '<div style="padding-right:30px;padding-top:30px;">\
			<button type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
		</div>';
		$('#percentId').html('<h4 style="color:red;">ftp路径错误,产品没有导入成功，请点击下方“关闭”按钮！</h4>');
	}
	if(JSON.parse(evt.data).message == "ftp中未发现execl文件，请上传产品！"){
		error_display_html += '<div style="padding-right:30px;padding-top:30px;">\
			<button type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
		</div>';
		$('#percentId').html('<h4 style="color:red;">ftp中未发现execl文件,产品没有导入成功，请点击下方“关闭”按钮！</h4>');
	}
	$('#error-display').html(error_display_html);
	var div = document.getElementById('error-display');
	div.scrollTop = div.scrollHeight;

	// console.log(JSON.parse(evt.data).total+':'+JSON.parse(evt.data).done);
}
function onError() {}
function onClose() {
	setTimeout(function(){
		 reconnect()
	 },1000);
}

	var p_num = 0;
	//全局变量search_page_num分页页码，初始化为1
	var search_page_num = 1;
	//产品分类选择
function selectCategory(elem){
	$("#all-select-btn").removeAttr("checked");
	if($("#search_input").val()!=0){
		// bfe_model.apis.products.get_products = "/photo-album/product/_product_search?";
		bfe_model.find.prev_category_type = bfe_model.find.category_type;  //保存上一个分类，为是否重新创建分页栏做判断用
		bfe_model.page.current_page = 1; //重新设置当前页为1，为是否重新创建分页栏做判断用
		var selectValue = $(elem).find('option:selected').val();
		bfe_model.find.category_type = selectValue;
		var url_text = "/photo-album/product/_product_search?key="+$("#search_input").val()+"&type="+selectValue+"&size="+$("#page_selected").val()+"&page=1";
		// console.log(url_text);
		request_data(url_text);
	}else{
		bfe_model.find.prev_category_type = bfe_model.find.category_type;  //保存上一个分类，为是否重新创建分页栏做判断用
		bfe_model.page.current_page = 1; //重新设置当前页为1，为是否重新创建分页栏做判断用
		var selectValue = $(elem).find('option:selected').val();
		bfe_model.find.category_type = selectValue;
		request_data();
		$("#fenpage_div").show();
	}
}
function createPaginationBar(){
	$('.pagination').jBootstrapPage({
		pageSize: bfe_model.page.page_size,
		maxPageButton: bfe_model.page.maxPageButton,
		total: bfe_model.page.total,
		onPageClicked: function(obj, pageIndex){
			bfe_model.page.current_page = pageIndex+1;
			request_data();
		}
	});
}
function createHtmlInsertTbody(data){
	localStorage.setItem('edit_products', JSON.stringify(data));
	// console.log(data.length);
	var html = '';
	var data_length = data.length;
	// if(data.length>30){
	// 	data_length = 30;
	// }
	for(var i=0; i<data_length; i++){
		html += '<tr id="'+data[i].number+'" height="118px;">\
							<td><input value="'+data[i].number+'" class="checkbox-btn" type="checkbox" name="select" onchange="select_pro_tf(this)"></td>\
							<td><img src="../image/'+data[i].image+';width=240;height=240;equalratio=1" width="120px"></td>\
							<td style="text-align:left;">产品名称:<span>'+decodeURIComponent(data[i].name)+'</span><br>产品分类:<span>'+data[i].category+'</span></td>\
							<td>'+data[i].number+'</td>\
							<td>'+data[i].time+'</td>\
							<td>'+(data[i].online ? '已上架': '未上架')+'</td>\
							<td>'+(data[i].online ? '<button onclick="toOffLine(this)" class="btn btn-default">下架</button>' : '<button onclick="toOnLine(this)" class="btn btn-primary">上架</button>')+' <button style="display:none" data-index="'+i+'" onclick="toEdit(this)" class="btn btn-default">编辑</button> <button onclick="toDel(this)" class="btn btn-default">删除</button></td>\
						</tr>';
	}
	$('tbody').html(html);

	//获得多页产品选择数组
	console.log(proIdlist);
	//翻页时将已选产品编号的选择框添加选中
	$('.checkbox-btn').each(function(k,ielem){
		$(proIdlist).each(function(p,kelem){
			if(kelem == ielem.value){
				$(ielem).attr("checked", true);
			}
		});
	});
}

//产品库首页加载
function request_data(url){

	url = url || bfe_model.apis.products.get_products+'type='+bfe_model.find.category_type+'&isonline='+bfe_model.find.isonline+'&size='+($("#page_selected").val())+'&page='+bfe_model.page.current_page;
	console.log();
	console.log(url);

	http.getAjax_clean(url, function(data){
		//一共有多少页
		$("#pro_page").html(Math.ceil(data.totlesize/$("#page_selected").val()));
		//一共有多少个产品
		$("#pro_num").html(data.totlesize);
		bfe_model.page.total = data.totlesize;
		bfe_model.data.pagination_products = data.page;
		var page_number =parseInt(data.totlesize/$("#page_selected").val())+1;
		// console.log("每页显示多少条记录："+bfe_model.page.page_size);
		// console.log("总记录多少条："+data.totlesize);
		// console.log("总页数："+page_number);
		//console.log(bfe_model.data.pagination_products.length);
		createHtmlInsertTbody(bfe_model.data.pagination_products);


		var fenpage_html ='';
		fenpage_html  +='<button class="btn btn-info" onclick="modindex(1)">首 页</button> ';
		if(page_number<=5){
			for(var i=1;i<=page_number;i++){
				if(i==1){
					fenpage_html  +='<button class="btn btn-warning" onclick="modindex('+i+')">'+i+'</button> ';
				}else{
					fenpage_html  +='<button class="btn btn-default" onclick="modindex('+i+')">'+i+'</button> ';
				}
			}
		}else{
			for(var i=1;i<=5;i++){
				if(i==1){
					fenpage_html  +='<button class="btn btn-warning" onclick="modindex('+i+')">'+i+'</button> ';
				}else{
					fenpage_html  +='<button class="btn btn-default" onclick="modindex('+i+')">'+i+'</button> ';
				}
			}
			fenpage_html  +='...';
		}

		//var numadd = num+1;
		fenpage_html  +='<button class="btn btn-default" onclick="modindex(2)">下一页</button> ';
		fenpage_html  +='<button class="btn btn-info" onclick="modindex('+page_number+')">末 页</button> ';
		$("#fenpage").html(fenpage_html);
		if(bfe_model.page.current_page==1 && bfe_model.find.prev_category_type!=bfe_model.find.category_type){
			createPaginationBar();
		}

	});
};
//调整每页显示多少个产品
function pro_sub_num(num){
	//console.log(data.totlesize);
	console.log($("#category_select").val());
	bfe_model.page.page_size=num;
	var url = bfe_model.apis.products.get_products+'type='+$("#category_select").val()+'&isonline='+bfe_model.find.isonline+'&size='+bfe_model.page.page_size+'&page='+bfe_model.page.current_page;
	//console.log(url);
	// console.log(bfe_model.page.page_size);
	http.getAjax_clean(url, function(data){
		//console.log(data.totlesize);
		//一共有多少页
		$("#pro_page").html(Math.ceil(data.totlesize/bfe_model.page.page_size));
		//一共有多少个产品
		$("#pro_num").html(data.totlesize);
		modindex(1);
	});
}

//重构每页显示多少个产品
function modindex(num){
	$("#all-select-btn").removeAttr("checked");
	var fengpage_num = $("#page_selected").val();
	var category_select_num=$("#category_select").val();
	// console.log("当前页码："+num)
	var fenpage_html = "";
	var post_data = new FormData();
	post_data.append('type',category_select_num);
	post_data.append('isonline', '*');
	post_data.append('size',fengpage_num);
	post_data.append('page',num);
	http.postAjax_clean("/photo-album/product/get_all_product", post_data,
		function(data){
			if(data.totlesize !=0){
				var page_number = parseInt([data.totlesize-1]/fengpage_num)+1;
			}else{
				var page_number = 1;
			}
			// console.log("总页码："+page_number);
			// console.log("当前页码："+num);
			//产品总数量
			// console.log("产品总数据:"+data.totlesize);
			//产品内容
			// console.log(data.page);
			var fenpage_html ='';
			fenpage_html  +='<button class="btn btn-info" onclick="modindex(1)">首 页</button> ';
			if(num !=1){
				var numjian = num-1;
				fenpage_html  +='<button class="btn btn-default" onclick="modindex('+numjian+')">上一页</button> ';
			}

			//当总页码<5
	    if(page_number<5){
	      for(var i=1;i<=page_number;i++){
	        if(i==num){
	          fenpage_html  +='<button class="btn btn-warning" onclick="modindex('+i+')">'+i+'</button> ';
	        }else{
	          fenpage_html  +='<button class="btn btn-default" onclick="modindex('+i+')">'+i+'</button> ';
	        }
	      }
	    }else{
	      //页码1-3的
	      if(num < 3){
	        for(var k=1;k<=5;k++){
	          if(k == num){
	            fenpage_html +=' <button class="btn btn-warning" onclick="modindex('+ k +')">'+k+'</button> ';
	          }else{
	            fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ k +')">'+k+'</button> ';
	          }
	        }
	        fenpage_html +=' ... ';
	      }
	      //页码是3-(max-2)
	      if(num>=3&& num<= page_number-2){
	        fenpage_html +=' ... ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-2) +')">'+(num-2)+'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-1) +')">'+(num-1)+'</button> ';
	        fenpage_html +=' <button class="btn btn-warning" onclick="modindex('+ num +')">'+ num +'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num+1)  +')">'+(num+1)+'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num+2) +')">'+(num+2)+'</button> ';
	        fenpage_html +=' ... ';
	      }
	      //页码为max-1
	      if(num == page_number-1){
	        fenpage_html +=' ... ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-2) +')">'+(num-2)+'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-1) +')">'+(num-1)+'</button> ';
	        fenpage_html +=' <button class="btn btn-warning" onclick="modindex('+ num +')">'+num +'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num+1) +')">'+(num+1)+'</button> ';
	      }
	      //页码为max
	      if(num == page_number){
	        fenpage_html +=' ... ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-2) +')">'+(num-2)+'</button> ';
	        fenpage_html +=' <button class="btn btn-default" onclick="modindex('+ (num-1) +')">'+(num-1)+'</button> ';
	        fenpage_html +=' <button class="btn btn-warning" onclick="modindex('+ num +')">'+num +'</button> ';
	      }
	    }

			if(num != page_number){
				var numadd = num+1;
				fenpage_html  +='<button class="btn btn-default" onclick="modindex('+numadd+')">下一页</button> ';
			}
			fenpage_html  +='<button class="btn btn-info" onclick="modindex('+page_number+')">末 页</button> ';
			$("#fenpage").html(fenpage_html);
			createHtmlInsertTbody(data.page);
	});
}
//产品全选和反选事件
function allSelectOs(elem){
	if($(elem).is(':checked')){
		$('tbody').find('input[type=checkbox]').prop('checked', true);
		$('.checkbox-btn').each(function(i,subelem){
			$(proIdlist).each(function(k,selem){
				if(subelem.value == selem){
					proIdlist.splice(k,1);
				}
			});
			proIdlist.push(subelem.value);
		});
		// console.log(proIdlist);
	}else{
		$('tbody').find('input[type=checkbox]').prop('checked', false);
		$('.checkbox-btn').each(function(i,subelem){
			$(proIdlist).each(function(k,selem){
				if(subelem.value == selem){
					proIdlist.splice(k,1);
				}
			});
		});
		// console.log(proIdlist);
	}
}
//产品搜索JS
function searchProduct(elem){

	$("#all-select-btn").removeAttr("checked");
	$("#fenpage").hide();

 	// console.log($("#category_select").val());
	var category_select_num=$("#category_select").val();
	// $("#category_select")[0].options[0].selected = true;
	var keyWord = $('input[name=search]').val();
	var fengpage_num = $("#page_selected").val();
	keyWord = keyWord || null;
	if(keyWord==null||keyWord==undefined||keyWord.length>20){
		/*alert('输入为空或检测到的产品编号不合规,请修改重试..');*/
		// keyWord = '*';
		$("#fenpage_div").hide();
		$("#fenpage_inputtext").hide();
		$("#select_page_div").show();
		$("#fenpage").show();
		$("#select_search_page_div").hide();
		var post_data = new FormData();
		post_data.append('type', category_select_num);
		post_data.append('isonline', '*');
		post_data.append('size', fengpage_num);
		post_data.append('page', 1);
		http.postAjax_clean("/photo-album/product/get_all_product", post_data,
		function(data) {
			var fenpage_html = "";
			if(data.totlesize !=0){
				var page_number = parseInt([data.totlesize-1]/fengpage_num)+1;
			}else{
				var page_number = 1;
			}
			console.log(page_number);
			var fenpage_html ='';
			fenpage_html  +='<button class="btn btn-info" onclick="modindex(1)">首 页</button> ';
			//当总页码<5
			if(page_number<5){
				for(var i=1;i<=page_number;i++){
					if(i==1){
						fenpage_html  +='<button class="btn btn-warning" onclick="modindex('+i+')">'+i+'</button> ';
					}else{
						fenpage_html  +='<button class="btn btn-default" onclick="modindex('+i+')">'+i+'</button> ';
					}
				}
			}else{
				for(var i=1;i<=5;i++){
					if(i==1){
						fenpage_html  +='<button class="btn btn-warning" onclick="modindex('+i+')">'+i+'</button> ';
					}else{
						fenpage_html  +='<button class="btn btn-default" onclick="modindex('+i+')">'+i+'</button> ';
					}
				}
				fenpage_html  +='...';
			}
			fenpage_html  +='<button class="btn btn-info" onclick="modindex('+page_number+')">末页</button> ';
			$("#fenpage").html(fenpage_html);
			$("#pro_num").text(data.totlesize);
			$("#pro_page").text(page_number);
			createHtmlInsertTbody(data.page);
			$("#fenpage_div").show();
		});
	}else{
			// console.log(data);
			// console.log(data.page.length);
			search_pageclick_html(1);
			var lStorage=window.localStorage;
			proIdlist = [];
			$("#fenpage_inputtext").show();
			$("#select_page_div").hide();
	}
};

//搜索框的JS
function search_pageclick_html(num){
	// console.log($("#all-select-btn"));
	$("#all-select-btn").removeAttr("checked");
	$("#select_search_page_div").show();
	// console.log(num);
	// console.log(elem);
	// num=5;
	search_page_num = num;
	// console.log("当前页码:"+search_page_num);
	var category_select_num=$("#category_select").val();
	// $("#category_select")[0].options[0].selected = true;
	var keyWord = $('input[name=search]').val();
	var fengpage_num = $("#page_search_selected").val();
	// console.log(fengpage_num);
	// console.log('keyWord:'+keyWord);
	var search_pro_list =[];
	var post_data = new FormData();
	post_data.append('type', category_select_num);
	post_data.append('key', keyWord);
	post_data.append('page', 0);
	post_data.append('size', fengpage_num);
	http.postAjax_clean("/photo-album/product/_product_search", post_data,function(data) {
		if(data.page.length>fengpage_num){
			// console.log(parseInt(data.page.length/5)+1);
			// console.log("总页数:"+(parseInt(9/5)+1));
			if(data.page.length != 0){
				var display_pagenum_text ="当前页码：<span class='pagecss' style='color:black;'>"+num+"</span> <span>共有<span class='pagecss'>"+(parseInt((data.page.length-1)/fengpage_num)+1)+"</span>页 </span> 共有<span class='pagecss' style='color:red;'>"+data.page.length+"</span>款产品";

			}
			if(num ==1){
				$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num+1)+")' class='btn btn-warning'>下一页</button> <button onclick='search_pageclick_html("+(parseInt((data.page.length-1)/fengpage_num)+1)+")' class='btn btn-info'>末 页</button>"+display_pagenum_text);
			}else{
				if(num == parseInt((data.page.length-1)/fengpage_num)+1){
					$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num-1)+")' class='btn btn-default'>上一页</button> <button onclick='search_pageclick_html("+(parseInt((data.page.length-1)/fengpage_num)+1)+")' class='btn btn-info'>末 页</button>"+display_pagenum_text);
				}else{
					$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num-1)+")' class='btn btn-default'>上一页</button>  <button onclick='search_pageclick_html("+(num+1)+")' class='btn btn-warning'>下一页</button>  <button onclick='search_pageclick_html("+(parseInt((data.page.length-1)/fengpage_num)+1)+")' class='btn btn-info'>末 页</button> "+display_pagenum_text);
				}
			}

		}else{
			$("#fenpage_inputtext").html("  当前页码：1 <span> </span> 共有"+data.page.length+"款产品");
		}
		// if(data.page.length)

		// var fivenum_start =(num-1)*5+1;
		// console.log('fengpage_num:'+fengpage_num);
		var fivenum_start =(num-1)*fengpage_num+1;
		// console.log('fivenum_start:'+fivenum_start);
		var fivenum_end = fivenum_start+(fengpage_num-1);
		if(data.page.length<fivenum_end){
			fivenum_end = data.page.length;
		}
		for(var i=fivenum_start-1;i<fivenum_end;i++){
			// console.log(i);
			search_pro_list.push(data.page[i]);
		}
		// console.log(search_pro_list);
		createHtmlInsertTbody(search_pro_list);
	});

}

//搜索后下拉选择数量框JS
function pro_subsearch_num(elem){
	// console.log(elem);
	var search_pro_list =[];
	var post_data = new FormData();
	var fengpage_num = $("#page_search_selected").val();
	post_data.append('type', $("#category_select").val());
	post_data.append('key', $("#search_input").val());
	post_data.append('page', 0);
	post_data.append('size', elem);
	http.postAjax_clean("/photo-album/product/_product_search", post_data,function(data) {
		for(var i=0;i<fengpage_num-1;i++){
			// console.log(fengpage_num);
			// console.log(i);
			if(data.page[i] != null){
				search_pro_list.push(data.page[i]);
			}
		}
		createHtmlInsertTbody(search_pro_list);
		search_pageclick_html(1);
	});

}
//批量产品上下架JS
function multiOnOffLine(elem){
	var will_update_category_products = $('#tbody_tem').find('input:checked');
	// console.log(will_update_category_products);
	var list = [];
	will_update_category_products.each(function(e,se){
		 list.push(se.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
	});
	var createAndInsertOnOffLineHtml = function(){
		var html = '';
		html += '<div class="pop_window">'
		html += '  <div class="pop_window_top">批量上/下架</div>'
		html += '  <div id="radio" class="pop_window_center">';
		html += '    <input name="onoff" type="radio" value="on" checked/>上架&nbsp;&nbsp;<input  name="onoff" type="radio" value="off" />下架';
		html += '  </div>';
		html += '  <div class="pop_window_bottom"><button onclick="updateOnOffLine(this)">确定</button><button onclick="closeCover(this)">取消</button></div>';
		html += '  <div style="clear:both;"></div>';
		html += '</div>';
		$('.oncover').html(html);
	};
	if(proIdlist.length>0){
		createAndInsertOnOffLineHtml();
		showCover();
	}else{
		alert('请选择要操作的产品');
	}
}
//更新上下架JS
function updateOnOffLine(elem){
	var op = null;
	$('.oncover').find('input[type=radio]').each(function(){
		if($(this).is(':checked')){
			op = $(this).val();
		}
	});
	var isonline = (op=='on') ? true : false;
	var will_update_category_products = $('#tbody_tem').find('input:checked');
	// console.log(will_update_category_products);
	var list = [];
	will_update_category_products.each(function(e,se){
		 list.push(se.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
	});
	// console.log(list);
	//产品选择列表
	// console.log(proIdlist);
	var post_data = new FormData();
	// post_data.append('list', JSON.stringify(list));
	post_data.append('list', JSON.stringify(proIdlist));
	post_data.append('isonline', isonline);
	http.postAjax_clean("/photo-album/product/set_offline_and_online_with_list", post_data, function(data){
		// console.log(data);
		switch (data.state) {
			case 0:
				alert("产品批量上/下架操作成功！");
				location.reload();
				break;
			case 1:
				var json_message = JSON.parse(data.message);
				var json_message_pro = '';
				for(var i=0;i<json_message.length;i++){
					json_message_pro += json_message[i].number+"产品已经在"+json_message[i].note+'中.\n';
				}
				json_message_pro += '\n批量上/下架失败，请先移除相关连的产品！';
				alert(json_message_pro);
				break;
			default:
				alert("产品批量上/下架操作失败！");
				break;
		}
		// var onoff_line_display = "";
	});
}
//上架JS
function toOnLine(elem){
	var number = $(elem).parent().parent().attr('id');
	var isonline = true;
	var post_data = new FormData();
	post_data.append('number', number);
	post_data.append('isonline', isonline);
	http.postAjax_clean('/photo-album/product/set_offline_and_online', post_data, function(data){
		if(data['state']==true){
			$(elem).parent().prev().text('已上架');
			$(elem).replaceWith('<button onclick="toOffLine(this)" class="btn btn-default">下架</button>');
		}else{
			alert('设置产品上架异常.');
		}
	});
}
//下架JS
function toOffLine(elem){
	var number = $(elem).parent().parent().attr('id');
	var isonline = false;
	var post_data = new FormData();
	post_data.append('number', number);
	post_data.append('isonline', isonline);
	http.postAjax_clean('/photo-album/product/set_offline_and_online', post_data, function(data){
		switch(data['state']){
			case 1:
				$(elem).parent().prev().text('未上架');
				$(elem).replaceWith('<button onclick="toOnLine(this)" class="btn btn-primary">上架</button>');
				break;
			case 2:
				alert(number+'产品已经在“'+data['message']+'”中，删除此产品后，方可下架此产品！');
				break;
			default:
				alert('设置产品下架异常.');
				break;
		}

	});
}
//批量删除JS
function multiDel(elem){
	var number = $(elem).parent().parent().attr('id');
	var will_update_category_products = $('#tbody_tem').find('input:checked');
	// console.log(will_update_category_products);
	var list = [];
	will_update_category_products.each(function(e,se){
		 list.push(se.parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
	});
	// console.log(list);

	var post_data = new FormData();
	// post_data.append("list", JSON.stringify(list));
	post_data.append("list", JSON.stringify(proIdlist));
	if(proIdlist.length > 0){
		if(confirm("确定要删除选中的产品?")){
			$(elem).attr('disabled', 'disabled');
			http.postAjax_clean("/photo-album/product/product_delete_with_list", post_data, function(data){
				switch(data['state']){
					case 0:
						$(elem).removeAttr('disabled');
						// alert('成功删除批量选择的产品');
						// location.reload();
						break;
					case 1:
						$(".cover").hide();
						$(".oncover").hide();
						$(elem).removeAttr('disabled');
						var json_message = JSON.parse(data.message);
						var json_message_pro = '';
						for(var i=0;i<json_message.length;i++){
							json_message_pro += json_message[i].number+"产品已经在"+json_message[i].note+'中.\n';
						}
						json_message_pro += '\n批量删除产品失败！';
						alert(json_message_pro);
						break;
					default:
						$(elem).removeAttr('disabled');
						alert('批量删除产品失败！');
						break;
				}
			});
		}
	}else{
		alert('请选择要操作的产品');
	}
}
//加入推广类别JS
function addToCategory(elem){
	// console.log(proIdlist);
	// console.log(proIdlist.length);
	var will_update_category_products = $('tbody').find('input:checked');
	if(proIdlist.length>0){
		http.getAjax_clean("/photo-album/manger/get_products", function(data){
				if(data.length !=0){
					showCover(elem);
					var html = '<div class="pop_window">';
					html += '  <div class="pop_window_top">添加到推广类别<button onclick="closeCover(this)" class="closewin">X</button></div>'
					html += '  <div class="pop_window_center">';
					for(var k=0;k<data.length;k++){
						html += '  <input type="checkbox" id="'+data[k].id+'" style="margin:0;"/>&nbsp;'+data[k].productsname+'<span style="width:50px;"></span>';
						// console.log(data[k].products);
						if(data[k].products.length !=0){
							html += ':[';
							for (var i = 0; i < data[k].products.length; i++) {
								html += '  <input type="checkbox" id="'+data[k].products[i].productId+'" style="margin:0;"/>&nbsp;<span style="color:#2b6aa2"> '+data[k].products[i].name+'</span><span style="width:50px;"></span>';
							}
							html +=']<br/>';
						}else{
							html +='<br/>';
						}
					}
					html += '  </div>';
					html += '  <div class="pop_window_bottom"><button onclick="updateCategory(this)" class="btn btn-primary">确定</button> <button onclick="closeCover(this)" class="btn btn-default">取消</button></div>';
					html += '  <div style="clear:both;"></div>';
					html += '</div>';
					$('.oncover').html(html);
				}else{
					alert("推广类别暂无分类，请到推广类别添加分类！");
				}
		});
	}else{
		alert('请选择要操作的产品');
	}
}
//更新推广类别
function updateCategory(elem){
	var to_category_list = $('.oncover').find('input:checked');
	var will_update_category_products = $('#tbody_tem').find('input:checked');
	// console.log(will_update_category_products);
	var post_data = new FormData();
	var obj = {
		"linkids": [],
		"products": proIdlist
	};
	to_category_list.each(function(){
		obj.linkids.push($(this).attr('id'));
	});
	// will_update_category_products.each(function(){
	// 	// console.log($(this).parent().parent().attr('id'));
	// 	obj.products.push($(this).parent().parent().attr('id'));
	// });
	$(".cover").hide();
	$(".oncover").hide();
	var jsonObj = JSON.stringify(obj);
	post_data.append('param',jsonObj);
	http.postAjax_clean("/photo-album/product/save_toic", post_data, function(data){
		// console.log(data);
		if(data.state=="ok"){
			alert('添加到推广类别成功.');
			$("body").css("overflow","auto");
			// location.reload();
		}else{
			// console.log(data.state);
			alert('添加到推广类别失败!'+data.state+"正在下架中！");
		}
	});
}

//编辑产品
function toEdit(elem){
	var index = $(elem).attr('data-index');
	var jsonObj = localStorage.getItem('edit_products');
	var will_edit_product_list = JSON.parse(jsonObj);
	// console.log(localStorage);
	localStorage.setItem('current_edit_product', JSON.stringify(will_edit_product_list[index]));
	// console.log('localStorage');
	// console.log(localStorage);
	location.href = '/photo-album/web/edit_product.html';
}

//单个产品删除
function toDel(elem){
	if(confirm("确定删除此产品？")){
		var number = $(elem).parent().parent().attr('id');
		var list = [];
		list.push(number);
		var post_data = new FormData();
		post_data.append("list", JSON.stringify(list));
		http.postAjax_clean("/photo-album/product/product_delete_with_list", post_data, function(data){
			switch(data['state']){
				case 0:
					// alert("删除产品成功！");
					location.reload();
					break;
				case 1:
					var json_message = JSON.parse(data.message);
					alert(json_message[0].number+"产品已经在"+json_message[0].note+"中，此产品不能被删除！");
					break;
				default:
					alert("产品删除失败！");
					break;
			}

		});
	}
}

function searchAboutOnOffLine(elem){
	// alert("aaaa");
	// console.log(elem);
	bfe_model.page.current_page = 1;
	var selectValue = $(elem).find('option:selected').val();
	// console.log(selectValue);
	bfe_model.find.isonline = selectValue;
	request_data();
}

function multiUpdateCategory(elem){
	alert('ing..');
}
function scanstate(){
	alert("aaa");
}
//刷新产品库按钮
function updateProducts(elem){
	// console.log(websocket.OPEN);
	var msg = "list#";
	if (websocket.readyState == websocket.OPEN) {
		websocket.send(msg);//调用后台handleTextMessage方法
	} else {
		// console.log(websocket.readyState);
		if(websocket.readyState == 0){
			alert("websocket已断开，请稍等会再试一下！");
		}
		reconnect();
	}
}

$(function(){
	createCover();
	http.getAjax_clean('/photo-album/product/getcategory', function(data){
		for(var i=0;i<data.length;i++){
			$('select[name=category]').append('<option value="'+(i+1)+'">'+data[i]+'</option>');
		}
	});
	request_data();
	//打开窗口
	$('.cd-popup-trigger2').on('click', function(event){
		event.preventDefault();
		$('.cd-popup2').addClass('is-visible2');
	});
	$('.some_class').datetimepicker();


});


//时间段弹框JS
function ontime_btn(){
	// console.log(Math.ceil(p_num%2));
	if(p_num%2 == 0){
		$("#starttime_div").show();
	}else{
		$("#starttime_div").hide();
	}
	p_num++;
}

//时间段弹框“确认”按钮事件
function ontime_sub(){
	$("#all-select-btn").removeAttr("checked");
	var search_input_text =$("#search_input").val();
	var category_select_num=$("#category_select").val();
	var starttime_text = $("#title_interval_input_start").val();
	var endtime_text =$("#title_interval_input_end").val();
	// console.log("开始时间："+starttime_text);
	// console.log("结整时间："+endtime_text);
	// var temp_time_text =starttime_text+'~'+endtime_text+'<a type="button" class="btn btn-default btn-xs" style="border-radius:50%;border:0;" onclick="time_cancel_click()">X</a>';
	// $("#updatatime").html(temp_time_text)
	if(starttime_text.length != 0 && endtime_text.length != 0){
		if(starttime_text>endtime_text){
			alert("开始时间不能大于结束时间,请重新选择！");
			return;
		}
	}
	if(search_input_text.length == 0){
		var post_data = new FormData();
		post_data.append('type', category_select_num);
		post_data.append('isonline', '*');
		post_data.append('size',12);
		post_data.append('page',1);
		if(starttime_text.length != 0){
			post_data.append('starttime',starttime_text);
		}
		if(endtime_text.length != 0){
			post_data.append('endtime',endtime_text);
		}
		http.postAjax_clean("/photo-album/product/get_all_product", post_data,
			function(data){
				// console.log(data);
				createHtmlInsertTbody(data.page);
		});
		$("#fenpage_div").hide();
	}else{

		$("#fenpage_div").show();

		var num = 1;
		var category_select_num=$("#category_select").val();
		// $("#category_select")[0].options[0].selected = true;
		var keyWord = $('input[name=search]').val();
		var fengpage_num = $("#page_selected").val();
		var search_pro_list =[];
		var post_data = new FormData();
		post_data.append('type', category_select_num);
		post_data.append('key', keyWord);
		post_data.append('page', 0);
		post_data.append('size', fengpage_num);
		if(starttime_text.length != 0){
			post_data.append('starttime',starttime_text);
		}
		if(endtime_text.length != 0){
			post_data.append('endtime',endtime_text);
		}
		http.postAjax_clean("/photo-album/product/_product_search", post_data,function(data) {
			if(data.page.length>5){
				var display_pagenum_text ="当前页码：<span class='pagecss' style='color:black;'>"+num+"</span> <span>共有<span class='pagecss'>"+(parseInt(data.page.length/5)+1)+"</span>页 </span> 共有<span class='pagecss' style='color:red;'>"+data.page.length+"</span>款产品";
				if(num ==1){
					$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num+1)+")' class='btn btn-warning'>下一页</button> <button onclick='search_pageclick_html("+(parseInt(data.page.length/5)+1)+")' class='btn btn-info'>末 页</button>"+display_pagenum_text);
				}else{
					if(num == parseInt((data.page.length-1)/5)+1){
						$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num-1)+")' class='btn btn-default'>上一页</button> <button onclick='search_pageclick_html("+(parseInt(data.page.length/5)+1)+")' class='btn btn-info'>末 页</button>"+display_pagenum_text);
					}else{
						$("#fenpage_inputtext").html("<button onclick='search_pageclick_html(1)' class='btn btn-info'>首 页</button> <button onclick='search_pageclick_html("+(num-1)+")' class='btn btn-default'>上一页</button>  <button onclick='search_pageclick_html("+(num+1)+")' class='btn btn-warning'>下一页</button>  <button onclick='search_pageclick_html("+(parseInt(data.page.length/5)+1)+")' class='btn btn-info'>末 页</button> "+display_pagenum_text);
					}
				}

			}else{
				$("#fenpage_inputtext").html("  当前页码：1 <span> </span> 共有"+data.page.length+"款产品");
			}
			// if(data.page.length)
			var fivenum_start =(num-1)*5+1;
			var fivenum_end = fivenum_start+4;
			if(data.page.length<fivenum_end){
				fivenum_end = data.page.length;
			}
			for(var i=fivenum_start-1;i<fivenum_end;i++){
				// console.log(i);
				search_pro_list.push(data.page[i]);
			}
			// console.log(search_pro_list);
			createHtmlInsertTbody(search_pro_list);
		});
	}
	$("#title_interval_input_start").val('');
	$("#title_interval_input_end").val('');
	$("#starttime_div").hide();
	p_num = 0;
}

//时间段弹框“取消”按钮事件
function ontime_cancel(){
	$("#title_interval_input_start").val('');
	$("#title_interval_input_end").val('');
	$("#starttime_div").hide();
	p_num = 0;
}

//选择框选择产品
function select_pro_tf(elem){
	//记住多页多个产品的选择
	if($(elem).is(':checked')){
		proIdlist.push(elem.value);
	}else{
		$(proIdlist).each(function(i,subelem){
			if(elem.value == subelem){
				proIdlist.splice(i,1)
			}
		});
	}

	//产品选择列表
	// console.log(proIdlist);

	//将产品选择的添加列表中
  if($('.checkbox-btn').length != $('.checkbox-btn:checked').length){
    $("#all-select-btn").removeAttr("checked");
  }else{
    // console.log("true");
    $("#all-select-btn").prop("checked",true);
  }
}

function time_cancel_click(){
	starttime_data = "";
	endtime_data = "";
	$("#updatatime").html("");
}
