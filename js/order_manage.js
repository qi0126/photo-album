var websocket = null;
var localurl = document.location.href.split("/")[2];
//console.log(localurl);

reconnect();
//websocket连接和自动连接
function reconnect() {
	if ('WebSocket' in window) {
		websocket = new WebSocket("ws://" + localurl + "/photo-album/ordermessage");
	}
	else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket("ws://" + localurl + "/photo-album/ordermessage");
	}
	else {
		websocket = new SockJS("ws://" + localurl + "/photo-album/ordermessage");
	}
	websocket.onopen = onOpen;
	websocket.onmessage = onMessage;
	websocket.onerror = onError;
	websocket.onclose = onClose;
}


function onOpen(openEvt) {
	doSend(1);
	// console.log(openEvt.Data);
}



var t;
var page_num;
var tempy;
//选择订单产品
var backup_data;

function onMessage(evt) {
	t = json_parse(evt.data);
	// console.log(t);
	if(t.code != 0){
		alert(t.msg);
	}

	//分页个数
	if (t.data && t.data.total == 0) {
		var pagenum = 1;
	} else {
		var pagenum = parseInt([t.data.total - 1] / 8) + 1;
	}
	$("#accordion").html("");
	$("#fengpages").html("");
	for (var i = 0; i < t.data.list.length; i++) {
		// console.log(t.data.list[i]);
		var operatorUserNumber_text;
		if (t.data.list[i].operatorUserNumber) {
			operatorUserNumber_text = t.data.list[i].operatorUserNumber;
		} else {
			operatorUserNumber_text = '';
		}
		var socket_tab_html = "";
		socket_tab_html += '<div class="panel panel-info" style="">'
			+ '<div id="divtop-' + t.data.list[i].orderid + '" class="panel-heading" style="padding:5px;background-color:#2b6aa2;">'
			+ '<h4 class="panel-title">'
			+ '<table class="order_table">'
			+ '<tr>'
			+ '<td width="16%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">订单号：' + t.data.list[i].orderid + '</a></td>'
			+ '<td width="17%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">下单时间：' + t.data.list[i].createtime + '</a></td>'
			+ '<td width="17%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">客户名：' + t.data.list[i].customerName + '</a></td>'
			+ '<td width="17%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">客户编号：' + t.data.list[i].customerid + '</a></td>'
			+ '<td width="13%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">处理人：<span id="operatorUserNumber_span_' + i + '">' + operatorUserNumber_text + '</span></a></td>'
			+ '<td width="20%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\'' + t.data.list[i].orderid + '\',\'' + i + '\')" href="#collapse' + i + '">状态：<span id="state_text_' + i + '"></span> <span> <button class="btn btn-primary" data-toggle="modal" data-target="#myModal-' + i + '" style="display:none;">需求明细上传</button> </span><span id="icon-' + i + '" class="menu_icon" style="float:right;">▼</span></a></td>'
			+ '</tr>'
			+ '</table>'
			+ '</h4>'
			+ '</div>'

		socket_tab_html += '<div id="collapse' + i + '" class="panel-collapse collapse">'
			+ '<div class="panel-body" style="padding:5px; overflow:auto; ">'
			+ '<div id="orderlist_div" style="float:left;width:100%;">'
			+ '\
								<div class="tabletop">需求明细 <span style="float:right;width:270px;text-align:center;"><button type="button" class="btn btn-default" onclick="Requ_btn(\''+ t.data.list[i].orderid + '\',this)">折叠需求明细 ▲</button></span></div>\
									<table id="tab_'+ t.data.list[i].orderid + '" style="width: 100%" cellspacing="0" cellpadding="0" class="table-bordered">\
												<tr>\
													<td rowspan="2" width="30%" valign="top" style="min-width:280px;">\
														<div border="1" id="order_table_c'+ i + '" class="order_table_c">\
														</div>\
													</td>\
													<td width="30%" class="tdclass" style="min-width:160px;">备注信息</td>\
													<td width="40%" class="tdclass">出货产品明细</td>\
												</tr>\
												<tr>\
													<td valign="top"><div id="backup'+ i + '" class="backup_sub_css"></div></td>\
													<td valign="top"><div id="shipment_list_div_'+ i + '" class="backup_sub_css"></div></td>\
												</tr>\
												</table>\
												<div>\
												<div class="tabletop">出货明细 - '+ t.data.list[i].orderid + ' <span style="width:270px;float:right;">\
													<a id="excel_btn' + i + '" class="btn btn-default" target="_parent" name="excel_btn" type="button" href="/photo-album/excel/exportOrder?orderid=' + t.data.list[i].orderid + '">导出excel</a>\
												  <button class="btn btn-default" onclick="collapse_btn(\'' + t.data.list[i].orderid + '\',this)">折叠出货明细 ▲</button></span></div>\
												<table id="tb-'+ t.data.list[i].orderid + '" class="orderlist_table table table-striped table-bordered table-hover">\
														<thead id="shipment_thead_'+ i +'">\
															<tr>\
																<th style="height: 25px">序</th>\
																<th style="height: 25px">产品品名</th>\
																<th style="height: 25px">产品编号</th>\
																<th style="height: 25px">材质</th>\
																<th style="height: 25px">成色</th>\
																<th style="height: 25px">外观形态</th>\
																<th style="height: 25px">表面工艺</th>\
																<th style="height: 25px">产品克重</th>\
																<th style="height: 25px">出货数量</th>\
																<th style="height: 25px">出货重量</th>\
																<th style="height: 25px">字印</th>\
																<th style="height: 25px">长度</th>\
																<th style="height: 25px">宽度</th>\
																<th style="height: 25px">高度</th>\
																<th style="height: 25px">长宽高</th>\
																<th style="height: 25px">圈口</th>\
																<th style="height: 25px">内径</th>\
																<th style="height: 25px">面宽</th>\
															</tr>\
														</thead>\
														<tbody id="shipment_tbody_'+ i + '">\
														</tbody>\
													</table>\
									<div id="btn-'+ t.data.list[i].orderid + '" style="text-align:center;"><button id="shipment_sub_btn_' + i + '" type="button" class="btn btn-primary" onclick="shipment_sub_btn(' + i + ')" name="manage_submit_btn">处理完成并发送</button></div>'
			+ '</div>'
			+ '</div>';
		$("#accordion").append(socket_tab_html);

		// console.log(t[i]);

		readdata(i);


		//订单产品详细
		var order_table_html = "";
		for (var j = 0; j < t.data.list[i].products.length; j++) {
			// console.log(t.data.list[i].products[j].weight);
			// console.log(t.data.list[i].products[j].isFixedWeight);
			if (j == 0) {
				order_table_html += '\
							<div style="border:2px solid #2b6aa2;" id="div_'+ i + '_' + j + '" class="div_' + i + '">\
							<a href="javascript:backup('+ i + ',' + j + ')">\
									<table>\
										<tr>\
											<td style="border-right:1px #ccc solid; width:30px;text-align: center;">'+ (j + 1) + '<td>\
											<td>\
												<img src="/photo-album/image/'+ t.data.list[i].products[j].image + ';width=240;height=240;equalratio=1" height="120px"/>\
											</td>\
											<td>\
													<span id="span_'+ i + '_' + j + '" style="color:red;">' + t.data.list[i].products[j].name + '<br/>' + t.data.list[i].products[j].number + '<br/>克重：' + t.data.list[i].products[j].weight + '</span>\
											</td>\
										</tr>\
									</table>\
								</a>\
						</div>';
			} else {
				order_table_html += '\
							<div style="border:1px solid #ddd;" id="div_'+ i + '_' + j + '" class="div_' + i + '">\
								<a href="javascript:backup('+ i + ',' + j + ')">\
										<table>\
											<tr>\
												<td style="border-right:1px #ccc solid; width:30px;text-align: center;">'+ (j + 1) + '<td>\
												<td>\
													<img src="/photo-album/image/'+ t.data.list[i].products[j].image + ';width=240;height=240;equalratio=1" height="120px"/>\
												</td>\
												<td>\
														<span id="span_'+ i + '_' + j + '" style="color:red;">' + t.data.list[i].products[j].name + '<br/>' + t.data.list[i].products[j].number + '<br/>克重：' + t.data.list[i].products[j].weight + '</span>\
												</td>\
											</tr>\
										</table>\
									</a>\
							</div>';
			}
		}
		var order_table_number = "#order_table_c" + i;
		$(order_table_number).html(order_table_html);
		$("#collapse0").addClass('in');
		var backup_num1 = "#backup" + i;
		var backup_htmlcode = '';

		if (t.data.list[i].products.length > 0 && t.data.list[i].products[0].note) {
			var backup_note = json_parse(t.data.list[i].products[0].note);
			// console.log(backup_note);
			for (var k = 0; k < backup_note.length; k++) {
				if ((backup_note[k].txt).indexOf('.wav') >= 0) {
					// console.log(backup_note[i].txt);
					backup_htmlcode += '<audio src="/photo-album/order/voice/' + backup_note[k].txt + '" controls="controls" class="audio_class" onplay="audio_click(this)">'
						+ '你的浏览不支持音频播放！'
						+ '</audio><br/>';
				} else {
					// backup_note_class
					backup_htmlcode += '<div class="">' + backup_note[k].txt + '</div>';
				}
			}
		} else {
			var backup_htmlcode = "空";
			var backup_note = "空";
		}
		// console.log(backup_note);

		$(backup_num1).html(backup_htmlcode);
		// console.log(t[i].state);
		switch (t.data.list[i].state) {
			case 0:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#428bca')
				$("#state_text_" + i).html("出货明细待处理");
				$("#shipment_sub_btn_" + i).show();
				$("#add_btn_line_div" + i).show();
				$("#excel_btn" + i).hide();
				$("#operatorUserNumber_span_" + i).html("未处理");
				break;
			case 1:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#428bca');
				$("#state_text_" + i).html("待客户确认订单");
				$("#shipment_sub_btn_" + i).hide();
				$("#add_btn_line_div" + i).hide();
				$("#excel_btn" + i).show();
				break;
			case 2:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#5e6874');
				$("#state_text_" + i).html("客户已确认订单");
				$("#shipment_sub_btn_" + i).hide();
				$("#add_btn_line_div" + i).hide();
				$("#excel_btn" + i).show();
				break;
			case -2:
				$("#state_text_" + i).html("全部订单");
				$("#shipment_sub_btn_" + i).hide();
				$("#excel_btn" + i).hide();
				break;
			case 10:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#c3ced9');
				$("#state_text_" + i).html("已取消订单(待明细)");
				$("#shipment_sub_btn_" + i).hide();
				$("#add_btn_line_div" + i).hide();
				$("#excel_btn" + i).hide();
				break;
			case 11:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#c3ced9');
				$("#state_text_" + i).html("已取消订单(待确认)");
				$("#shipment_sub_btn_" + i).hide();
				$("#add_btn_line_div" + i).hide();
				$("#excel_btn" + i).hide();
				break;
			case 12:
				$("#divtop-" + t.data.list[i].orderid).css('background-color', '#c3ced9');
				$("#state_text_" + i).html("已取消订单(已确认)");
				$("#shipment_sub_btn_" + i).hide();
				$("#add_btn_line_div" + i).hide();
				$("#excel_btn" + i).hide();
				break;
		}
	}
	var lStorage = window.localStorage;
	$(t.data.list).each(function (k, kelem) {
		if (kelem.orderid == lStorage.openid) {
			$('#collapse0').collapse('hide');
			$('#collapse' + k).collapse('show');
			$("#icon-" + k).html("▲");
		} else {
			$("#icon-" + k).html("▼");
		}

	});
	//首页
	var fengpages_html = ' <button class="btn btn-primary" onclick="doSend(1)">首 页</button> ';
	var p = page_num + 1;

	//上一页
	if (p != 1) {
		var m = page_num - 1;
		fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + (p - 1) + ')">上一页</button> ';
	}

	// console.log("当前页码(p):"+p);
	// console.log("总页数(pagenum):"+pagenum);
	// fengpages_html +="当前页码(p):"+p+"总页数(pagenum):"+pagenum;
	if (pagenum) {
		//当总页数小于5，全部按据显示
		if (pagenum <= 5) {
			for (var k = 1; k <= pagenum; k++) {
				if (k == p) {
					fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
				} else {
					fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
				}
			}
		} else {
			//页码为1
			if (p == 1) {
				for (var k = 1; k <= 3; k++) {
					if (k == p) {
						fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
					} else {
						fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
					}
				}
				fengpages_html += '...';
			}
			//页码为2
			if (p == 2) {
				for (var k = 1; k <= 4; k++) {
					if (k == p) {
						fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
					} else {
						fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
					}
				}
				fengpages_html += '...';
			}
			//页码在3和总数页-2之间，只显示前后两个按钮
			if (p >= 3 && p <= pagenum - 2) {
				fengpages_html += '...';
				for (var k = p - 2; k <= p + 2; k++) {
					if (k == p) {
						fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
					} else {
						fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
					}
				}
				fengpages_html += '...';
			}
			//页码是数页数-1，后边只显示一个按钮
			if (p == pagenum - 1) {
				fengpages_html += '...';
				for (var k = p - 2; k <= p + 1; k++) {
					if (k == p) {
						fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
					} else {
						fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
					}
				}
			}
			//页码是末页，后边不显示按钮
			if (p == pagenum) {
				fengpages_html += '...';
				for (var k = p - 2; k <= p; k++) {
					if (k == p) {
						fengpages_html += ' <button class="btn btn-warning" onclick="doSend(' + k + ')">' + k + '</button> ';
					} else {
						fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + k + ')">' + k + '</button> ';
					}
				}
			}
		}
	}
	//下一页
	if (p != pagenum && pagenum > 1) {
		fengpages_html += ' <button class="btn btn-default" onclick="doSend(' + (p + 1) + ')">下一页</button> ';
	}
	//末页
	fengpages_html += ' <button class="btn btn-primary" onclick="doSend(' + pagenum + ')">末 页</button> ';
	$("#fengpages").html(fengpages_html);
	// });

	//权限管理适配开始
	setTimeout('menu()', 200);
	//权限管理适配结束

}


//权限管理事件
function menu() {
	var lStorage = window.localStorage;
	var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
	$(NoAuthMenu_data).each(function (o, oelem) {
		if (oelem.type == 1) {
			// console.log(oelem.menuname);
			switch (oelem.menuname) {
				// 添加产品明细
				case '添加产品明细':
					// console.log(oelem);
					$('button[name=shipment_add_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					$('button[name=submit_deidata_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					$('button[name=manage_submit_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					break;
				//删除产品明细
				case '删除产品明细':
					// console.log(oelem);
					$('button[name=shipment_delete_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					$('button[name=submit_deidata_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					$('button[name=manage_submit_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					break;
				case '导出excel':
					$('a[name=excel_btn]').each(function (i, ielem) {
						$(ielem).hide();
					});
					break;
			}
		}
	});
}
//读取据
function readdata(j) {
	//t为websocket的值
	//
	// console.log(t.data.list[j].products);
  //
	var shipment_tbody_divtext = '';
	var post_data1 = new FormData();
	post_data1.append('orderid', t.data.list[j].orderid);
	post_data1.append('page', 0);
	post_data1.append('size', 1000);
	http.postAjax_clean("/photo-album/order_manger/get_details", post_data1, function (data1) {
		// console.log(data1);
		if(t.data.list[j].products.length != 0){
			// if(t.data.list[j].products[0].isFixedWeight == 1 && t.data.list[j].state != 0){
			if(t.data.list[j].state != 0){
				//非详细资料产品显示
				prodata_display(j);
			}else{
				//详细资料产品显示
				NO_prodata_display(j);
			}
		}

		//详细资料产品
		function prodata_display(j){
			// console.log(t.data.list[j].products[0].virtualNumber);
			// console.log(data1.products);
			var shipment_list_div_htmltext = '';
			shipment_list_div_htmltext += ''
				+ '<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																		<thead>\
																			<tr>\
																				<th>序</th>\
																				<th>产品克重</th>\
																				<th>出货数量</th>\
																				<th>出货重量</th>\
																				<th>字印</th>\
																				<th>长度</th>\
																				<th>宽度</th>\
																				<th>高度</th>\
																				<th>长宽高</th>\
																				<th>圈口</th>\
																				<th>内径</th>\
																				<th>面宽</th>\
																			</tr>\
																		</thead>\
																		<tbody id = "shipment_list_tbody_'+ j + '">';
																		// console.log(data1.products[0]);
																		// console.log(data1.products.length);
																		var mainkelem = data1.products[0];
																		// console.log(mainkelem);
																		// console.log(mainkelem.details);
																		if(mainkelem.details != null){
																			$(mainkelem.details).each(function(k,kelem){
																				// console.log(kelem);
																				// console.log(data1.products[0]);
																				shipment_list_div_htmltext += '\
																					<tr class="shipment_list_tr_'+ j + '">\
																					<td>'+ (k+1)+'</td>\
																					<td>'+selecttxt(kelem.shipment_pro_weight)+'</td>\
																					<td>'+selecttxt(kelem.shipment_number)+'</td>\
																					<td>'+selecttxt(kelem.shipment_weight)+'</td>\
																					<td>'+selecttxt(kelem.shipment_printfont)+'</td>\
																					<td>'+selecttxt(kelem.shipment_long)+'</td>\
																					<td>'+selecttxt(kelem.shipment_breadth)+'</td>\
																					<td>'+selecttxt(kelem.shipment_height)+'</td>\
																					<td>'+selecttxt(kelem.shipment_lwh)+'</td>\
																					<td>'+selecttxt(kelem.shipment_Ring)+'</td>\
																					<td>'+selecttxt(kelem.shipment_boresize)+'</td>\
																					<td>'+selecttxt(kelem.shipment_facewidth)+'</td>\
																					<td style="display:none;">'+ t.data.list[j].products[0].virtualNumber +'</td>\
																					</tr>';
																			});
																		}else{
																			shipment_list_div_htmltext += '\
																				<tr class="shipment_list_tr_'+ j + '">\
																					<td colspan="12">暂无数据!</td>\
																				</tr>';
																		}
																			shipment_list_div_htmltext += '\
																		</tbody>\
																		';
				+ '</table>'
				+ '<div  id="add_btn_line_div' + j + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + j + ',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + j + ',0)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + j + ',0" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + j + ',0)" name="submit_deidata_btn">提交明细数据</button></div>'
				+ '</div>';
			$("#shipment_list_div_" + j).html(shipment_list_div_htmltext);
		}


		// console.log(data1.products);
		$(data1.products).each(function (i,elem) {
			// console.log(elem);
			// console.log(elem.virtualNumber);
			if (elem.details != null) {
				$(t.data.list[j].products).each(function (w, welem) {
					if (welem.number == elem.number) {
						$("#span_" + j + "_" + w).css("color", "#000000");
					}
				});
				if(elem.details != 0){
					$(elem.details).each(function (k, subelem) {
						// console.log(subelem);
						shipment_tbody_divtext += '\
							<tr id="shipment_tbody_tr_'+ i + '" class="shipment_tbody_tr_class_' + i + '_">\
								<td class="num_display">'+ (i + 1) + '</td>\
								<td>'+ elem.name + '</td>\
								<td>'+ elem.number + '</td>\
								<td>'+ selecttxt(subelem.material) +'</td>\
								<td>'+ selecttxt(subelem.colour) +'</td>\
								<td>'+ selecttxt(subelem.shapes) +'</td>\
								<td>'+ selecttxt(subelem.craft) +'</td>\
								<td>'+ selecttxt(subelem.shipment_pro_weight) + '</td>\
								<td>'+ selecttxt(subelem.shipment_number) + '</td>\
								<td>'+ selecttxt(subelem.shipment_weight) + '</td>\
								<td>'+ selecttxt(subelem.shipment_printfont) + '</td>\
								<td>'+ selecttxt(subelem.shipment_long) + '</td>\
								<td>'+ selecttxt(subelem.shipment_breadth) + '</td>\
								<td>'+ selecttxt(subelem.shipment_height) + '</td>\
								<td>'+ selecttxt(subelem.shipment_lwh) + '</td>\
								<td>'+ selecttxt(subelem.shipment_Ring) + '</td>\
								<td>'+ selecttxt(subelem.shipment_boresize) + '</td>\
								<td>'+ selecttxt(subelem.shipment_facewidth) + '</td>\
								<td style="display:none;">'+ elem.virtualNumber + '</td>\
							</tr>';
					});
				}
			}
		});
		var k;
		$("#shipment_tbody_" + j).html(shipment_tbody_divtext);

		// shipment_tbody_tr_display(j);

		//tabletr序号排序
		trnum_display(j);
		//为每个订单的首个产品添加购买单位和克重开始
		var prolist_arr = [];
		// console.log(t[j].products[0].number);
		$($("#shipment_tbody_" + j)[0].rows).each(function (k, trelem) {
			// console.log(data1.products[0].number);
			// console.log($(trelem)[0].children[3].innerText);
			// console.log(k);
			// console.log(t.data.list[j]);
			if (t.data.list[j].products.length > 0 && t.data.list[j].products[0].number == $(trelem)[0].children[3].innerText) {
				var sub_prolist = [];
				sub_prolist.push($(trelem)[0].children[3].innerText);
				sub_prolist.push($(trelem)[0].children[4].innerText);
				sub_prolist.push($(trelem)[0].children[5].innerText);
				sub_prolist.push($(trelem)[0].children[6].innerText);
				prolist_arr.push(sub_prolist);
			}
		});
		if (prolist_arr.length != 0) {
			var shipment_list_htmltext = '';
			shipment_list_htmltext += '\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th>序</th>\
																		<th>产品克重</th>\
																		<th>出货数量</th>\
																		<th>出货重量</th>\
																		<th>字印</th>\
																		<th>长度</th>\
																		<th>宽度</th>\
																		<th>高度</th>\
																		<th>长宽高</th>\
																		<th>圈口</th>\
																		<th>内径</th>\
																		<th>面宽</th>\
																	</tr>\
																</thead>\
																	<tbody id = "shipment_list_tbody_'+ j + '">';
			$(prolist_arr).each(function (i, elem) {
				// console.log(elem);
				shipment_list_htmltext += '\
																		<tr class="shipment_list_tr_'+ j + '">\
																			<td><input type="checkbox" value="shipment_list_'+ j + '" class="shipment_list_checkout_' + j + '" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[1] + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + j + '"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[3] + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_number" id="shipment_number_' + j + '"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[2] + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_weight" id="shipment_weight_' + j + '"></td>\
																			<td><input type="text" value="" name="shipment_printfont"/></td>\
																			<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
																			<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
																		</tr>';
			});
			shipment_list_htmltext += '\
																	</tbody>\
																	'
				+ '</table>'
				+ '<div id="add_btn_line_div' + j + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + j + ',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + j + ',1)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + j + ',1" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + j + ',0)" name="submit_deidata_btn">提交明细数据</button></div>'
				+ '</div>';
			// $("#shipment_list_div_" + j).html(shipment_list_htmltext);

		} else {
			var shipment_list_htmltext = '';
			shipment_list_htmltext += '\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th>序序</th>\
																		<th>产品克重</th>\
																		<th>出货数量</th>\
																		<th>出货重量</th>\
																		<th>字印</th>\
																		<th>长度</th>\
																		<th>宽度</th>\
																		<th>高度</th>\
																		<th>长宽高</th>\
																		<th>圈口</th>\
																		<th>内径</th>\
																		<th>面宽</th>\
																	</tr>\
																</thead>\
																	<tbody id = "shipment_list_tbody_'+ j + '">\
																		<tr class="shipment_list_tr_'+ j + '">\
																			<td><input type="checkbox" value="shipment_list_'+ j + '" class="shipment_list_checkout_' + j + '" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_pro_weight" id="shipment_pro_weight_' + j + '"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_number" id="shipment_number_' + j + '"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_weight" id="shipment_weight_' + j + '"></td>\
																			<td><input type="text" value="" name="shipment_printfont"/></td>\
																			<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
																			<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
																		</tr>\
																	</tbody>\
																	'
				+ '</table>'
				+ '<div id="add_btn_line_div' + j + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + j + ',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + j + ',1)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + j + ',1" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + j + ',0)" name="submit_deidata_btn">提交明细数据</button></div>'
				+ '</div>';
			// $("#shipment_list_div_" + j).html(shipment_list_htmltext);

		}

		//创建一个本地数据库保存出货产品明细开始
		var lStorage = window.localStorage;
		// console.log(lStorage);
		// console.log("j:"+j);
		// console.log(t);
		$(t).each(function (m, melem) {
			// console.log(m);
			// console.log(i);
			if (j == m) {
				// console.log(t[m].orderid);
				if (lStorage[t.data.list[m].orderid] != undefined) {
					var temp_lStorage_json = JSON.parse(lStorage[t[m].orderid]);
					// console.log(temp_lStorage_json);
					for (var q in temp_lStorage_json) {
						// console.log(q);
						if (q == 'pro_0') {
							var shipment_list_tbody_htmlcode = '';
							$(temp_lStorage_json[q]).each(function (k, kelem) {

								shipment_list_tbody_htmlcode += '\
														<tr class="shipment_list_tr_'+ j + '">\
															<td><input type="checkbox" value="shipment_list_'+ j + '" class="shipment_list_checkout_' + j + '" style="height:20px;"/></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ kelem.code + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + j + '"></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ kelem.number + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_number" id="shipment_number_' + j + '"></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ kelem.weight + '" onchange="numberchange(' + j + ',' + k + ',this)" onkeyup="numberchange(' + j + ',' + k + ',this)" name="shipment_weight" id="shipment_weight_' + j + '"></td>\
															<td><input type="text" value="" name="shipment_printfont"/></td>\
															<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
															<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
															<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
															<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
															<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
															<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
															<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
														</tr>\
													';
							});
							// console.log(shipment_list_tbody_htmlcode);
							$("#shipment_list_tbody_" + j).html(shipment_list_tbody_htmlcode);
						}
					}

				}

			}
		});

		// $("#shipment_list_tbody_"+j).html("shipment_list_tbody_htmlcode");
		//创建一个本地数据库保存出货产品明细结束
		// console.log(t[j]);
		// console.log(t[j].state);
		if (t.data.list[j].state == 0) {
			$("#add_btn_line_div" + j).show();
		} else {
			$("#add_btn_line_div" + j).hide();

		}
		//tabletr序号排序
		trnum_display(j);

	});



}

//订单备注支持文字、语音
function backup(a, b) {

	//选择框框变色
	var div_backup = $('.div_' + a);
	$(div_backup).each(function (i, elem) {
		if (elem.id == 'div_' + a + "_" + b) {
			$(elem).css({ 'border-color': "#2b6aa2", 'border-width': "2px" });
		} else {
			$(elem).css({ 'border-color': "#ddd", 'border-width': "1px" });
		}
	});

	var backup_num = "#backup" + a;
	var note_code;
	var note_json_code;

	if(t.data.list[a].products[b].note != undefined){
		 note_code = t.data.list[a].products[b].note;
		 note_json_code = json_parse(note_code);
	}else{
		 note_code = "空";
		 note_json_code = "空";
	}
	//非详细资料产品
	if(t.data.list[a].products[b].isFixedWeight == 1){
		$("#shipment_list_div_" + a).html("shipment_list_div_html");
		var post_data1 = new FormData();
		post_data1.append('orderid', t.data.list[a].orderid);
		post_data1.append('page', 0);
		post_data1.append('size', 1000);
		http.postAjax_clean("/photo-album/order_manger/get_details", post_data1, function (data) {
			var shipment_list_div_html ='<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
				<thead>\
					<tr>\
						<th>序</th>\
						<th>产品克重</th>\
						<th>出货数量</th>\
						<th>出货重量</th>\
						<th>字印</th>\
						<th>长度</th>\
						<th>宽度</th>\
						<th>高度</th>\
						<th>长宽高</th>\
						<th>圈口</th>\
						<th>内径</th>\
						<th>面宽</th>\
					</tr>\
				</thead>\
				<tbody id = "shipment_list_tbody_'+ a + '">';
					$(data.products).each(function(j,jelem){
						$(jelem.details).each(function(p,pelem){
							shipment_list_div_html +='\
								<tr>\
								<td>'+(p+1)+'</td>\
								<td>'+selecttxt(pelem.shipment_pro_weight)+'</td>\
								<td>'+selecttxt(pelem.shipment_number)+'</td>\
								<td>'+selecttxt(pelem.shipment_weight)+'</td>\
								<td>'+selecttxt(pelem.shipment_printfont)+'</td>\
								<td>'+selecttxt(pelem.shipment_long)+'</td>\
								<td>'+selecttxt(pelem.shipment_breadth)+'</td>\
								<td>'+selecttxt(pelem.shipment_height)+'</td>\
								<td>'+selecttxt(pelem.shipment_lwh)+'</td>\
								<td>'+selecttxt(pelem.shipment_Ring)+'</td>\
								<td>'+selecttxt(pelem.shipment_boresize)+'</td>\
								<td>'+selecttxt(pelem.shipment_facewidth)+'</td>\
								</tr>';
						});
					})
					shipment_list_div_html +='\
				</tbody>\
			</table>';
			$("#shipment_list_div_" + a).html(shipment_list_div_html);
		});
		// return false;
	}
	//订单为非“出货明细待处理”
	if(t.data.list[a].state != 0){
		var post_data1 = new FormData();
		post_data1.append('orderid', t.data.list[a].orderid);
		post_data1.append('page', 0);
		post_data1.append('size', 1000);
		http.postAjax_clean("/photo-album/order_manger/get_details", post_data1, function (data) {
			var shipment_list_div_html ='<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
				<thead>\
					<tr>\
						<th>序</th>\
						<th>产品克重</th>\
						<th>出货数量</th>\
						<th>出货重量</th>\
						<th>字印</th>\
						<th>长度</th>\
						<th>宽度</th>\
						<th>高度</th>\
						<th>长宽高</th>\
						<th>圈口</th>\
						<th>内径</th>\
						<th>面宽</th>\
					</tr>\
				</thead>\
				<tbody id = "shipment_list_tbody_'+ a + '">';
					// console.log(data.products[b].details);
					if(data.products[b].details != null){
						$(data.products[b].details).each(function(p,pelem){
							// console.log(pelem);
							shipment_list_div_html +='\
								<tr>\
								<td>'+(p+1)+'</td>\
								<td>'+selecttxt(pelem.shipment_pro_weight)+'</td>\
								<td>'+selecttxt(pelem.shipment_number)+'</td>\
								<td>'+selecttxt(pelem.shipment_weight)+'</td>\
								<td>'+selecttxt(pelem.shipment_printfont)+'</td>\
								<td>'+selecttxt(pelem.shipment_long)+'</td>\
								<td>'+selecttxt(pelem.shipment_breadth)+'</td>\
								<td>'+selecttxt(pelem.shipment_height)+'</td>\
								<td>'+selecttxt(pelem.shipment_lwh)+'</td>\
								<td>'+selecttxt(pelem.shipment_Ring)+'</td>\
								<td>'+selecttxt(pelem.shipment_boresize)+'</td>\
								<td>'+selecttxt(pelem.shipment_facewidth)+'</td>\
								</tr>';
						});
					}else{
						shipment_list_div_html +='<tr><td colspan="12">暂无数据!</td></tr>';
					}
					shipment_list_div_html +='\
				</tbody>\
			</table>';
			$("#shipment_list_div_" + a).html(shipment_list_div_html);
		});
	}else{
		var prolist_arr = [];
		// console.log($('#shipment_tbody_'+a));
		// console.log($('#shipment_tbody_'+a)[0].children);
		// console.log(t.data.list[a].products[b]);
		$($('#shipment_tbody_' + a)[0].children).each(function (k, trelem) {
			// console.log(trelem.children[18].innerText);
			if (t.data.list[a].products[b].virtualNumber == trelem.children[18].innerText) {
				var sub_prolist = [];
				// console.log(k);
				// console.log($(trelem)[0].children[3]);
				sub_prolist.push($(trelem)[0].children[18].innerText);
				sub_prolist.push($(trelem)[0].children[7].innerText);
				sub_prolist.push($(trelem)[0].children[8].innerText);
				sub_prolist.push($(trelem)[0].children[9].innerText);
				sub_prolist.push($(trelem)[0].children[10].innerText);
				sub_prolist.push($(trelem)[0].children[11].innerText);
				sub_prolist.push($(trelem)[0].children[12].innerText);
				sub_prolist.push($(trelem)[0].children[13].innerText);
				sub_prolist.push($(trelem)[0].children[14].innerText);
				sub_prolist.push($(trelem)[0].children[15].innerText);
				sub_prolist.push($(trelem)[0].children[16].innerText);
				sub_prolist.push($(trelem)[0].children[17].innerText);

				// console.log(sub_prolist);
				prolist_arr.push(sub_prolist);
			}
		});

		// alert(JSON.stringify(prolist_arr));
		// console.log(prolist_arr.length);
		if (prolist_arr.length != 0) {
			var shipment_list_htmltext = '';
			shipment_list_htmltext += '\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th>序</th>\
																		<th>产品克重</th>\
																		<th>出货数量</th>\
																		<th>出货重量</th>\
																		<th>字印</th>\
																		<th>长度</th>\
																		<th>宽度</th>\
																		<th>高度</th>\
																		<th>长宽高</th>\
																		<th>圈口</th>\
																		<th>内径</th>\
																		<th>面宽</th>\
																	</tr>\
																</thead>\
																	<tbody id = "shipment_list_tbody_'+ a + '">';
			$(prolist_arr).each(function (i, elem) {
				// console.log(elem);
				shipment_list_htmltext += '\
																		<tr class="shipment_list_tr_'+ a + '">\
																			<td><input type="checkbox" value="shipment_list_'+ a + '" class="shipment_list_checkout_' + a + '" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[1] + '" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange(' + a + ',' + b + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + a + '"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[2] + '" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange(' + a + ',' + b + ',this)" name="shipment_number" id="shipment_number_' + a + '"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ elem[3] + '" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange(' + a + ',' + b + ',this)" name="shipment_weight" id="shipment_weight_' + a + '"></td>\
																			<td><input type="text" value="'+ elem[4] + '" name="shipment_printfont"/></td>\
																			<td><input type="text" value="'+ elem[5] + '" name="shipment_long" style="width:40px"/></td>\
																			<td><input type="text" value="'+ elem[6] + '" name="shipment_breadth" style="width:40px"/></td>\
																			<td><input type="text" value="'+ elem[7] + '" name="shipment_height" style="width:40px"/></td>\
																			<td><input type="text" value="'+ elem[8] + '" name="shipment_lwh" style="width:60px"/></td>\
																			<td><input type="text" value="'+ elem[9] + '" name="shipment_Ring" style="width:40px"/></td>\
																			<td><input type="text" value="'+ elem[10] + '" name="shipment_boresize" style="width:40px"/></td>\
																			<td><input type="text" value="'+ elem[11] + '" name="shipment_facewidth" style="width:40px"/></td>\
																		</tr>';
			});
			shipment_list_htmltext += '\
																	</tbody>\
																	'
				+ '</table>'
				+ '<div id="add_btn_line_div' + a + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + a + ',' + b + ')"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + a + ',' + b + ')"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + a + ',' + b + '" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + a + ',' + b + ')" name="submit_deidata_btn">提交明细数据</button></div>'
				+ '</div>';
			$("#shipment_list_div_" + a).html(shipment_list_htmltext);
		} else {
			// console.log(t.data.list[a].products[b].virtualNumber);
			var shipment_list_htmltext = '';
			shipment_list_htmltext += '\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th>序</th>\
																		<th>产品克重</th>\
																		<th>出货数量</th>\
																		<th>出货重量</th>\
																		<th>字印</th>\
																		<th>长度</th>\
																		<th>宽度</th>\
																		<th>高度</th>\
																		<th>长宽高</th>\
																		<th>圈口</th>\
																		<th>内径</th>\
																		<th>面宽</th>\
																	</tr>\
																</thead>\
																	<tbody id = "shipment_list_tbody_'+ a + '">\
																		<tr class="shipment_list_tr_'+ a + '">\
																			<td><input type="checkbox" value="shipment_list_'+ a + '" class="shipment_list_checkout_' + a + '" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange('+ a + ',' + b + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + a + '"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange('+ a + ',' + b + ',this)" name="shipment_number" id="shipment_number_' + a + '"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + a + ',' + b + ',this)" onkeyup="numberchange('+ a + ',' + b + ',this)" name="shipment_weight" id="shipment_weight_' + a + '"></td>\
																			<td><input type="text" value="" name="shipment_printfont"/></td>\
																			<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
																			<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
																			<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
																			<td style="display:none;">'+t.data.list[a].products[b].virtualNumber+'</td>\
																		</tr>\
																	</tbody>\
																	'
				+ '</table>'
				+ '<div  id="add_btn_line_div' + a + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + a + ',' + b + ')"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + a + ',' + b + ')"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + a + ',' + b + '" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + a + ',' + b + ')" name="submit_deidata_btn">提交明细数据</button></div>'
				+ '</div>';
			$("#shipment_list_div_" + a).html(shipment_list_htmltext);
		}


	}

	//权限管理适配开始
	menu();
	//权限管理适配结束

	//突然加单将已填数据保存
	var lStorage=window.localStorage;
	for (var e in lStorage) {
		$(t).each(function (p, pelem) {
			if (pelem.orderid == e) {
				if (p == a) {
					var lStorage_pro_list = JSON.parse(lStorage[(pelem.orderid)]);
					for (var w in lStorage_pro_list) {
						if (('pro_' + b) == w) {
							// console.log('length:'+lStorage_pro_list[w].length);
							var lStorage_pro_list_htmlcode = '';
							$(lStorage_pro_list[w]).each(function (t, telem) {
								// console.log(telem);
								lStorage_pro_list_htmlcode += '<tr class="shipment_list_tr_' + a + '">\
										<td><input type="checkbox" value="shipment_list_'+ a + '" class="shipment_list_checkout_' + a + '" style="height:20px;"/></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ telem.code + '" onchange="numberchange(' + a + ',' + t + ',this)" onkeyup="numberchange(' + a + ',' + t + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + a + '"></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ telem.number + '" onchange="numberchange(' + a + ',' + t + ',this)" onkeyup="numberchange(' + a + ',' + t + ',this)" name="shipment_number" id="shipment_number_' + a + '"></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+ telem.weight + '" onchange="numberchange(' + a + ',' + t + ',this)" onkeyup="numberchange(' + a + ',' + t + ',this)" name="shipment_weight" id="shipment_weight_' + a + '"></td>\
										<td><input type="text" value="" name="shipment_printfont"/></td>\
										<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
										<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
										<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
										<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
										<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
										<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
										<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
									</tr>';
							});
							$("#shipment_list_tbody_" + p).html(lStorage_pro_list_htmlcode);
						}
					}
				}
			}
		});
	}
	if (t.data.list[a].state == 0) {
		$("#add_btn_line_div" + a).show();
	} else {
		$("#add_btn_line_div" + a).hide();
	}
	if (note_json_code != "空") {
		var note_htmlcode = '';
		for (var k = 0; k < note_json_code.length; k++) {
			if ((note_json_code[k].txt).indexOf('.wav') >= 0) {
				note_htmlcode += '<audio src="/photo-album/order/voice/' + note_json_code[k].txt + '" controls="controls">'
					+ '你的浏览不支持音频播放！'
					+ '</audio> <br/>';
			} else {
				note_htmlcode += note_json_code[k].txt + '<br/>';
			}
		}
		$(backup_num).html('');
		$(backup_num).html(note_htmlcode);
	}else{
		$(backup_num).html("空");
	}


}
function onError(messages) {
}


function onClose() {
	setTimeout(function () {
		reconnect()
	}, 1000);
}

//stock连接
function doSend(num) {
	var numjian = num - 1
	if (websocket.readyState == websocket.OPEN) {
		var lStorage = window.localStorage;
		var user_id = lStorage.loginmanId;
		var msg = JSON.stringify({ cmd: 'list', page: num, size: '8', saleid: user_id, searchType: 1 });
		page_num = numjian;
		websocket.send(msg);//调用后台handleTextMessage方法
		//alert("连接websocket成功!");
	} else {
		alert("连接websocket失败!");
	}
}

//删除订单delorder_btn
function delorder_btn(elem) {
	// console.log(elem);
	if (confirm("确定要删除此订单记录！")) {
		var elem_list = [];
		elem_list.push(elem);
		elem_list = JSON.stringify(elem_list);
		// console.log(elem_list);
		var post_data = new FormData();
		post_data.append('orderlist', elem_list);
		http.postAjax_clean("/photo-album/order/order_delete", post_data, function (data) {
			// console.log(data);
		});
	}
}

//“提交明细数据”按钮事件
function shipment_add_btn(x, y) {
	// console.log(x);
	// console.log(y);
	// console.log(t);
	// console.log(t.data.list[x].products[y].virtualNumber);
	var shipment_list_tbody_addtext = '\
		<tr class="shipment_list_tr_'+ x + '">\
			<td><input type="checkbox" value="shipment_list_'+ x + '" class="shipment_list_checkout_' + x + '" style="height:20px;"/></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + x + ',' + y + ',this)" onkeyup="numberchange('+ x + ',' + y + ',this)" name="shipment_pro_weight" id="shipment_pro_weight_' + x + '"></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + x + ',' + y + ',this)" onkeyup="numberchange('+ x + ',' + y + ',this)" name="shipment_number" id="shipment_number_' + x + '"></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange(' + x + ',' + y + ',this)" onkeyup="numberchange('+ x + ',' + y + ',this)" name="shipment_weight" id="shipment_weight_' + x + '"></td>\
			<td><input type="text" value="" name="shipment_printfont"/></td>\
			<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
			<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
			<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
			<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
			<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
			<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
			<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
			<td style="display:none;">'+t.data.list[x].products[y].virtualNumber+'</td>\
		</tr>';
	$("#shipment_list_tbody_" + x).append(shipment_list_tbody_addtext);

	numberchange(x,y,'');
}

//浏览器缓存读取
function numberchange(x,y,thiselem) {
	//产品克重和出货数量相乘输出到出货重量
	//产品克重判断
	if(thiselem.name == 'shipment_pro_weight'){
		//产品克重为空出货重量为0
		if(thiselem.value == ''){
			$(thiselem.parentElement.nextElementSibling.nextElementSibling.childNodes)[0].value = '0';
			return false;
		}
		//产品克重
		var shipment_pro_weight_num = parseFloat(thiselem.value);
		//出货数量
		var shipment_number_num = parseFloat($(thiselem.parentElement.nextElementSibling.childNodes)[0].value);
		if(shipment_number_num != NaN){
			$(thiselem.parentElement.nextElementSibling.nextElementSibling.childNodes)[0].value = floatMul(shipment_number_num,shipment_pro_weight_num);
		}
	}

	//出货数量判断
	if(thiselem.name == 'shipment_number'){

		//出货数量为空出货重量为0
		if(thiselem.value == ''){
			$(thiselem.parentElement.nextElementSibling.childNodes)[0].value = '0';
			return false;
		}
		//出货数量
		var shipment_number_num = parseFloat(thiselem.value);
		//产品克重
		var shipment_pro_weight_num = parseFloat($(thiselem.parentElement.previousElementSibling.childNodes)[0].value);
		if(shipment_pro_weight_num != NaN){
			$(thiselem.parentElement.nextElementSibling.childNodes)[0].value = floatMul(shipment_number_num,shipment_pro_weight_num);
		}
	}
	//乘法精确计算
	function floatMul(arg1,arg2)   {
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
	}
	//产品克重和出货数量相乘输出到出货重量

	var temp_proid;
	$(t.data.list).each(function (k, selem) {
		if (k == x) {
			temp_proid = selem.orderid;
		}
	});
	var Shipment_pro_list = [];
	$(".shipment_list_tr_" + x).each(function (j, jelem) {
		if ($(jelem)[0].children[1].firstChild.value != 0 || $(jelem)[0].children[2].firstChild.value != 0 || $(jelem)[0].children[3].firstChild.value != 0) {
			// console.log($(jelem)[0].children[1].firstChild.value);
			Shipment_pro_list.push({ "code": $(jelem)[0].children[1].firstChild.value, "weight": $(jelem)[0].children[2].firstChild.value, "number": $(jelem)[0].children[3].firstChild.value });
		}
	});
	var lStorage = window.localStorage;
	if (lStorage[temp_proid] == undefined) {
		var jsontemp = '{"pro_' + y + '":[' + JSON.stringify(Shipment_pro_list) + ']}';
		lStorage[temp_proid] = jsontemp;
	} else {
		var jsontemp = JSON.parse(lStorage[temp_proid]);
		jsontemp['pro_' + y] = Shipment_pro_list;
		//下方变量为保存字典变量数组
		lStorage[temp_proid] = JSON.stringify(jsontemp);
	}
}

//删除明细行按钮
function shipment_delete_btn(x, y) {
	// console.log($(".shipment_list_checkout_"+x+":checked"));
	$(".shipment_list_checkout_" + x + ":checked").each(function (i, elem) {
		// console.log($(elem));
		$(elem)[0].parentElement.parentElement.remove();
	});
}


//页面全选选项JS
function allSelectOs(elem) {
	if ($(elem).is(':checked')) {
		$('tbody').find('input[type=checkbox]').prop('checked', true);
	} else {
		$('tbody').find('input[type=checkbox]').prop('checked', false);
	}
}

//批量“删除”按钮
function multiDel() {
	var multiDel_list = [];
	var multiDel_num = $("input[name=all-select]");
	$(multiDel_num).each(function (i, elem) {
		if ($(elem).is(':checked')) {
			multiDel_list.push(elem.value);
		}
	});
	if (multiDel_list != 0) {
		multiDel_list = JSON.stringify(multiDel_list);
		var post_data = new FormData();
		post_data.append('orderlist', multiDel_list);
		http.postAjax_clean("/photo-album/order/order_delete", post_data, function (data) {
			location.reload();
		});
	} else {
		alert("订单未选择，请重新选择！");
	}
}

//“提交数据按钮”添加JS
function shipment_weight_submit_btn(x, y) {
	// console.log(t);
	// console.log(t.data.list[x].products[y]);
	var pro_data_list = t.data.list[x].products[y].virtualNumber.split(',');

	$('.shipment_tbody_tr_class_' + x + '_' + y).each(function (j, classelem) {
		$(classelem).remove();
	});
	var shipment_tbody_tr_text = $(".shipment_list_tr_" + x);

	var pro_tr_array = [];
	$(shipment_tbody_tr_text).each(function (i, elem) {

		//出货产品克重(g)
		var a = $(elem)[0].firstElementChild.nextElementSibling.firstChild.value;
		//出货数量(个)
		var b = $(elem)[0].firstElementChild.nextElementSibling.nextElementSibling.firstChild.value;
		//出货重量(g)
		var c = $(elem)[0].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstChild.value;
		//字 印：shipment_printfont
		// console.log($(elem).find('input[name=shipment_printfont]')[0].value);
		var shipment_printfont_text = $(elem).find('input[name=shipment_printfont]')[0].value;
		//长 度：shipment_long
		var shipment_long_text = $(elem).find('input[name=shipment_long]')[0].value;
		//宽 度：shipment_breadth
		var shipment_breadth_text = $(elem).find('input[name=shipment_breadth]')[0].value;
		//高 度：shipment_height
		var shipment_height_text = $(elem).find('input[name=shipment_height]')[0].value;
		//长宽高：shipment_lwh
		var shipment_lwh_text = $(elem).find('input[name=shipment_lwh]')[0].value;
		//圈 口：shipment_Ring
		var shipment_Ring_text = $(elem).find('input[name=shipment_Ring]')[0].value;
		//内 径：shipment_boresize
		var shipment_boresize_text = $(elem).find('input[name=shipment_boresize]')[0].value;
		//面 宽：shipment_facewidth
		var shipment_facewidth_text = $(elem).find('input[name=shipment_facewidth]')[0].value;

		// console.log(a,b,c);
		a = parseFloat(a);
		// if(a)
		b = parseFloat(b);
		c = parseFloat(c);

		var shipment_list_tf = false;
		function list_TF(elem){
			var temp_data = (t.data.list[x].products[y].weight).split(',');
			var temp_list=[];
			var elem_TF = false;
			$(temp_data).each(function(k,kelem){
				var weight_s = parseFloat(kelem.split('-')[0]);
				var weight_b = parseFloat(kelem.split('-')[1]);
				if(kelem.split('-')[1] != undefined){
					if(a >= weight_s && a <= weight_b){
						elem_TF = true;
					}
				}else{
					if(a == weight_s){
						elem_TF = true;
					}
				}
			})
			return elem_TF;
		}
		if (list_TF(a)) {
			if(b > 0 || c > 0){
				shipment_list_tf = true;
			}else{
				$(elem).find('input[name=shipment_number]').focus();
				alert("出货数量和出货重量不能同时为0！");
			}
		}else{
			$(elem).find('input[name=shipment_pro_weight]').focus();
			alert("产品克重不在产品标准克重范围！");
		}

		if (shipment_list_tf) {
			pro_tr_array.push({
				"pro_name": t.data.list[x].products[y].name,
				"pro_id": t.data.list[x].products[y].number,
				"shipment_pro_weight": a,
				"shipment_number": b,
				"shipment_weight": c,
				"shipment_printfont": shipment_printfont_text,
				"shipment_long": shipment_long_text,
				"shipment_breadth": shipment_breadth_text,
				"shipment_height": shipment_height_text,
				"shipment_lwh": shipment_lwh_text,
				"shipment_Ring": shipment_Ring_text,
				"shipment_boresize": shipment_boresize_text,
				"shipment_facewidth": shipment_facewidth_text
			});
		}
	});
	var shipment_tbody_tr_temptext = $('#shipment_tbody_' + x + ' tr');
	$(shipment_tbody_tr_temptext).each(function (i, elem) {
		$(elem)[0].firstChild.innerText = i + 1;
	});
	//提交克重、数量、重量数据
	// console.log(pro_tr_array);
	//克重重复做数量和重量的叠加开始

	var json_tmp = {
		"orderid": t.data.list[x].orderid,
		"details": pro_tr_array
	};

	//输出结果为这个
	// console.log(json_tmp);
	var post_data = new FormData();
	post_data.append('details', JSON.stringify(json_tmp));
	http.postAjax_clean("/photo-album/order_manger/formatDetil", post_data, function (data) {
		// console.log(data);
		if (data.code == 0) {
			// console.log(data.data.details);
			$(data.data.details).each(function (celem) {
				var shipment_tbody_divtext = '\
					<tr id="shipment_tbody_tr_'+ x + '" class="shipment_tbody_tr_class_' + x + '_' + y + '">\
						<td class="num_display">-</td>\
						<td>'+ selecttxt(t.data.list[x].products[y].name) + '</td>\
						<td>'+ selecttxt(t.data.list[x].products[y].number) + '</td>\
						<td>'+ selecttxt(pro_data_list[1]) +'</td>\
						<td>'+ selecttxt(pro_data_list[3]) +'</td>\
						<td>'+ selecttxt(pro_data_list[4]) +'</td>\
						<td>'+ selecttxt(pro_data_list[2]) +'</td>\
						<td>'+ selecttxt(this.shipment_pro_weight) + '</td>\
						<td>'+ selecttxt(this.shipment_number) + '</td>\
						<td>'+ selecttxt(this.shipment_weight) + '</td>\
						<td>'+ selecttxt(this.shipment_printfont) + '</td>\
						<td>'+ selecttxt(this.shipment_long) + '</td>\
						<td>'+ selecttxt(this.shipment_breadth) + '</td>\
						<td>'+ selecttxt(this.shipment_height) + '</td>\
						<td>'+ selecttxt(this.shipment_lwh) + '</td>\
						<td>'+ selecttxt(this.shipment_Ring) + '</td>\
						<td>'+ selecttxt(this.shipment_boresize) + '</td>\
						<td>'+ selecttxt(this.shipment_facewidth) + '</td>\
						<td style="display:none;">'+ t.data.list[x].products[y].virtualNumber + '</td>\
					</tr>\
				';
				$("#shipment_tbody_" + x).append(shipment_tbody_divtext);
			});
			// console.log($("#shipment_tbody_" + x));

			// shipment_tbody_tr_display(x);

			//tabletr序号排序
			// console.log(t.data.list[x]);
			var pro_name_id = [];
			$($("#tb-" + t.data.list[x].orderid).find("tbody")[0].rows).each(function (m, melem) {
				if (pro_name_id.length != 0) {
					var pro_name_number_tf = true;
					for (var i = 0; i < pro_name_id.length; i++) {
						if ($(melem)[0].children[18].innerText == pro_name_id[i]) {
							pro_name_number_tf = false;
						}
					}
					// console.log(pro_name_number_tf);
					if (pro_name_number_tf) {
						pro_name_id.push($(melem)[0].children[18].innerText);
					}
				} else {
					pro_name_id.push($(melem)[0].children[18].innerText);
				}
				// console.log($(melem)[0].children[3].innerText);
				$(t.data.list[x].products).each(function (d, delem) {
						// console.log(delem);
					if (delem.virtualNumber == ($(melem)[0].children[18].innerText)) {
						$("#span_" + x + "_" + d).css("color", "#000000");
					}
				});
			});
			// console.log(pro_name_id);
			pro_name_id.sort();
			public_proname_id = pro_name_id;
			// alert(public_proname_id);
			// console.log($("#shipment_tbody_"+x));
			// console.log($("#shipment_tbody_"+x+"  .num_display"));
			$("#shipment_tbody_" + x + "  .num_display").each(function (p, pelem) {
				// console.log(pelem);
				$(pelem).html((p + 1));
			});

		} else {
			alert(data.msg);
		}
		// location.reload();
	});

	//克重重复做数量和重量的叠加结束

}

//公司
var public_proname_id = [];

//“处理完成并发送”按钮
function shipment_sub_btn(i) {

	var t_number_list = [];
	$(t.data.list[i].products).each(function (x, xelem) {
		// console.log(xelem);
		t_number_list.push(xelem.virtualNumber)
	});

	t_number_list.sort();

	// alert(JSON.stringify(t_number_list));
	// alert(JSON.stringify(public_proname_id));

	if (JSON.stringify(public_proname_id) == JSON.stringify(t_number_list)) {
		var shipment_sub_data = [];
		var shipment_tbody_list_data = $("#shipment_tbody_" + i + " tr");
		// console.log(shipment_tbody_list_data);
		$(shipment_tbody_list_data).each(function (i, elem) {
			// console.log(elem.children);
			shipment_sub_data[i] = {};
			//品 名
			shipment_sub_data[i].pro_name = $(elem)[0].children[1].innerText;
			//编 号
			shipment_sub_data[i].pro_id = $(elem)[0].children[2].innerText;
			//
			//产品克重
			shipment_sub_data[i].shipment_pro_weight = $(elem)[0].children[7].innerText;
			//出货数量
			shipment_sub_data[i].shipment_number = $(elem)[0].children[8].innerText;
			//出货重量
			shipment_sub_data[i].shipment_weight = $(elem)[0].children[9].innerText;
			//字 印
			shipment_sub_data[i].shipment_printfont = $(elem)[0].children[10].innerText;
			//材质
			shipment_sub_data[i].material = $(elem)[0].children[3].innerText;
			//成色
			shipment_sub_data[i].colour = $(elem)[0].children[4].innerText;
			//外观形态
			shipment_sub_data[i].shapes = $(elem)[0].children[5].innerText;
			//表面工艺
			shipment_sub_data[i].craft = $(elem)[0].children[6].innerText;
			//长 度
			shipment_sub_data[i].shipment_long = $(elem)[0].children[11].innerText;
			//宽 度
			shipment_sub_data[i].shipment_breadth = $(elem)[0].children[12].innerText;
			//高 度
			shipment_sub_data[i].shipment_height = $(elem)[0].children[13].innerText;
			//长宽高
			shipment_sub_data[i].shipment_lwh = $(elem)[0].children[14].innerText;
			//圈 口
			shipment_sub_data[i].shipment_Ring = $(elem)[0].children[15].innerText;
			//内 径
			shipment_sub_data[i].shipment_boresize = $(elem)[0].children[16].innerText;
			//面 宽
			shipment_sub_data[i].shipment_facewidth = $(elem)[0].children[17].innerText;
			//虚拟编号
			shipment_sub_data[i].virtualNumber = $(elem)[0].children[18].innerText;
		});
		var shipment_sub_newdata = {};
		shipment_sub_newdata.orderid = t.data.list[i].orderid;
		shipment_sub_newdata.details = shipment_sub_data;

		var shipment_sub_newdata_text = JSON.stringify(shipment_sub_newdata);
		// console.log(shipment_sub_newdata_text);
		//输出结果为这个

		var post_data = new FormData();
		post_data.append('details', shipment_sub_newdata_text);
		http.postAjax_clean("/photo-album/order_manger/detail_commit", post_data, function (data) {
			// console.log(data);
			location.reload();
		});

	} else {
		// console.log("no");
		alert("还有未处理的订单，请全部处理完成再发送!");
	}

	// console.log(t[i].orderid);


}

//html出货导出excel
function toexcel_btn(elem) {
	console.log(elem);
	$.getJSON("/photo-album/excel/exportOrder?orderid=" + elem, function (data) {
		console.log(data);
	});

}

//tabletr序号排序
function trnum_display(elem) {
	$("#shipment_tbody_" + elem + " .num_display").each(function (i, elem) {
		// $(elem).html((i+1));
		$(elem).html((i + 1));
	})
}

//点击保存打开展开折叠层
function openmenu(elem, tempi) {
	setTimeout(function () {
		$(".panel-collapse").each(function (k, kelem) {
			$("#icon-" + k).html("▼");
			// console.log($(kelem));
			if ($(kelem)[0].attributes[2].value == 'true') {
				$("#icon-" + k).html("▲");
			}
		});
	}, 0);
	var lStorage = window.localStorage;
	lStorage.openid = elem;
}

//出货明细折叠
function collapse_btn(elem, thiselem) {
	$("#tb-" + elem)[0].hidden = !$("#tb-" + elem)[0].hidden;
	$("#btn-" + elem)[0].hidden = !$("#btn-" + elem)[0].hidden;
	if ($("#tb-" + elem)[0].hidden) {
		$(thiselem)[0].innerText = "展开出货明细 ▼";
	} else {
		$(thiselem)[0].innerText = "折叠出货明细 ▲";
	}
}

//折叠需求明细
function Requ_btn(elem, thiselem) {
	// console.log(elem);
	// console.log($("#tab_"+elem));

	$("#tab_" + elem)[0].hidden = !$("#tab_" + elem)[0].hidden;
	if ($("#tab_" + elem)[0].hidden) {
		$(thiselem)[0].innerText = "展开需求明细 ▼";
	} else {
		$(thiselem)[0].innerText = "折叠需求明细 ▲";
	}
}

//语单单个播放事件
function audio_click(thiselem) {
	// console.log($('.audio_class'));

	$('.audio_class').each(function (i, ielem) {
		// console.log(ielem);
		if (ielem != thiselem) {
			ielem.pause();
		} else {
			ielem.play();
		}
	});

}
//判断为非空事件
function selecttxt(elem){
	// console.log(elem);
	if(elem != null && elem != ''){
		return elem;
	}else{
		return '-';
	}
}
//
function shipment_tbody_tr_display(elem){
	//长度
	var td11_TF = false;
	//宽度
	var td12_TF = false;
	//高度
	var td13_TF = false;
	//长宽高
	var td14_TF = false;
	//圈口
	var td15_TF = false;
	//内径
	var td16_TF = false;
	//内径
	var td17_TF = false;

	$("#shipment_tbody_" + elem).find('tr').each(function(i,ielem){
		if(ielem.cells[11].innerText != '-'){
			td11_TF = true;
		}
		if(ielem.cells[12].innerText != '-'){
			td12_TF = true;
		}
		if(ielem.cells[13].innerText != '-'){
			td13_TF = true;
		}
		if(ielem.cells[14].innerText != '-'){
			td14_TF = true;
		}
		if(ielem.cells[15].innerText != '-'){
			td15_TF = true;
		}
		if(ielem.cells[16].innerText != '-'){
			td16_TF = true;
		}
		if(ielem.cells[17].innerText != '-'){
			td17_TF = true;
		}
	})

	$("#shipment_tbody_" + elem).find('tr').each(function(i,ielem){
		if(!td11_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[11]).hide();
			$(ielem.cells[11]).hide();
		}
		if(!td12_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[12]).hide();
			$(ielem.cells[12]).hide();
		}
		if(!td13_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[13]).hide();
			$(ielem.cells[13]).hide();
		}
		if(!td14_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[14]).hide();
			$(ielem.cells[14]).hide();
		}
		if(!td15_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[15]).hide();
			$(ielem.cells[15]).hide();
		}
		if(!td16_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[16]).hide();
			$(ielem.cells[16]).hide();
		}
		if(!td17_TF){
			$($('#shipment_thead_' +elem).find('tr')[0].cells[17]).hide();
			$(ielem.cells[17]).hide();
		}
	})
}


//非详细资料产品显示
function NO_prodata_display(j){
	// console.log(t.data.list[j].products);
	var shipment_list_div_htmltext = '';
	shipment_list_div_htmltext += ''
		+ '<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th>序</th>\
																		<th>产品克重</th>\
																		<th>出货数量</th>\
																		<th>出货重量</th>\
																		<th>字印</th>\
																		<th>长度</th>\
																		<th>宽度</th>\
																		<th>高度</th>\
																		<th>长宽高</th>\
																		<th>圈口</th>\
																		<th>内径</th>\
																		<th>面宽</th>\
																	</tr>\
																</thead>\
																<tbody id = "shipment_list_tbody_'+ j + '">\
																	<tr class="shipment_list_tr_'+ j + '">\
																	<td><input type="checkbox" value="shipment_list_'+ j + '" class="shipment_list_checkout_' + j + '" style="height:20px;"/></td>\
																	<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_pro_weight" id="shipment_pro_weight_' + j + '"></td>\
																	<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_number" id="shipment_number_' + j + '"></td>\
																	<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" onchange="numberchange('+ j + ',0,this)" onkeyup="numberchange('+ j + ',0,this)" name="shipment_weight" id="shipment_weight_' + j + '"></td>\
																	<td><input type="text" value="" name="shipment_printfont"/></td>\
																	<td><input type="text" value="" name="shipment_long" style="width:40px"/></td>\
																	<td><input type="text" value="" name="shipment_breadth" style="width:40px"/></td>\
																	<td><input type="text" value="" name="shipment_height" style="width:40px"/></td>\
																	<td><input type="text" value="" name="shipment_lwh" style="width:60px"/></td>\
																	<td><input type="text" value="" name="shipment_Ring" style="width:40px"/></td>\
																	<td><input type="text" value="" name="shipment_boresize" style="width:40px"/></td>\
																	<td><input type="text" value="" name="shipment_facewidth" style="width:40px"/></td>\
																	<td style="display:none;">'+ t.data.list[j].products[0].virtualNumber +'</td>\
																	</tr>\
																</tbody>\
																'
		+ '</table>'
		+ '<div  id="add_btn_line_div' + j + '" style="text-align:center"><button type="button" name="shipment_add_btn" class="btn btn-primary" onclick="shipment_add_btn(' + j + ',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" name="shipment_delete_btn" class="btn btn-default" onclick="shipment_delete_btn(' + j + ',0)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="' + j + ',0" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn(' + j + ',0)" name="submit_deidata_btn">提交明细数据</button></div>'
		+ '</div>';
	$("#shipment_list_div_" + j).html(shipment_list_div_htmltext);
}
