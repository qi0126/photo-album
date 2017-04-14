var websocket = null;
var localurl=document.location.href.split("/")[2];
//console.log(localurl);

reconnect();
//websocket连接和自动连接
function reconnect(){

	if ('WebSocket' in window) {
		websocket = new WebSocket("ws://"+localurl+"/photo-album/ordermessage");
	}
	else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket("ws://"+localurl+"/photo-album/ordermessage");
	}
	else {
		websocket = new SockJS("ws://"+localurl+"/photo-album/ordermessage");
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

function onMessage(evt) {
	// console.log(evt.data);
	t= json_parse(evt.data);
	// console.log("t.length:"+t.length);
	console.log(t);
	// $(t).each(function(j,sselem){
	// 	console.log(sselem);
	// });


	http.getAjax_clean("/photo-album/order/order_size", function(data){
		//分页个数
		if(data.size == 0){
			 var pagenum = 1;
		}else{
			var pagenum=parseInt([data.size-1]/8)+1;
		}
		// console.log("总页码pagenum:"+pagenum);
		$("#accordion").html("");
		$("#fengpages").html("");
		for(var i=0;i<t.length;i++){
			// console.log(t[i].orderid);
			var socket_tab_html = "";
			socket_tab_html +='<div class="panel panel-info" style="">'
					+'<div class="panel-heading" style="padding:5px;background-color:#2b6aa2;">'
							+'<h4 class="panel-title">'
											+'<table class="order_table">'
												+'<tr>'
													+'<td width="3%"><input name="all-select" type="checkbox" value="'+t[i].orderid+'"/></td>'
													+'<td width="30%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\''+t[i].orderid+'\',\''+i+'\')" href="#collapse'+i+'">订单号：'+t[i].orderid+'</a></td>'
													+'<td width="28%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\''+t[i].orderid+'\',\''+i+'\')" href="#collapse'+i+'">下单时间：'+t[i].createtime+'</a></td>'
													+'<td width="17%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\''+t[i].orderid+'\',\''+i+'\')" href="#collapse'+i+'">客户编号：'+t[i].customerid+'</a></td>'
													+'<td width="25%"><a data-toggle="collapse" data-parent="#accordion" onclick="openmenu(\''+t[i].orderid+'\',\''+i+'\')" href="#collapse'+i+'">状态：<span id="state_text_'+i+'"></span> <span> <button class="btn btn-primary" data-toggle="modal" data-target="#myModal-'+i+'" style="display:none;">需求明细上传</button> </span><span id="icon-'+i+'" class="menu_icon" style="float:right;">▼</span></a></td>'
												+'</tr>'
											+'</table>'
							+'</h4>'
					+'</div>'

					socket_tab_html+='<div id="collapse'+i+'" class="panel-collapse collapse">'
							+'<div class="panel-body" style="padding:5px; overflow:auto; ">'
							+'<div id="orderlist_div" style="float:left;width:100%;">'
								+'\
								<div class="tabletop">需求明细 <span style="float:right;width:270px;text-align:center;"><button type="button" class="btn btn-warning" onclick="Requ_btn(\''+t[i].orderid+'\',this)">折叠需求明细 ▲</button></span></div>\
									<table id="tab_'+t[i].orderid+'" style="width: 100%" cellspacing="0" cellpadding="0" class="table-bordered">\
												<tr>\
													<td rowspan="2" width="30%" valign="top" style="min-width:280px;">\
														<div border="1" id="order_table_c'+i+'" class="order_table_c">\
														</div>\
													</td>\
													<td width="30%" class="tdclass" style="min-width:160px;">备注信息</td>\
													<td width="40%" class="tdclass">出货产品明细</td>\
												</tr>\
												<tr>\
													<td valign="top"><div id="backup'+i+'" class="backup_sub_css"></div></td>\
													<td valign="top"><div id="shipment_list_div_'+i+'" class="backup_sub_css"></div></td>\
												</tr>\
												</table>\
												<div>\
												<div class="tabletop">出货明细 - '+t[i].orderid+' <span style="width:270px;float:right;"><a id="excel_btn'+i+'" class="btn btn-default" type="button" href="/photo-album/order_manger/get_excel?orderid='+t[i].orderid+'">导出excel</a>  <button class="btn btn-warning" onclick="collapse_btn(\''+t[i].orderid+'\',this)">折叠出货明细 ▲</button></span></div>\
												<table id="tb-'+t[i].orderid+'" class="orderlist_table table table-striped table-bordered table-hover">\
														<thead>\
															<tr>\
																<th style="height: 25px">序</th>\
																<th style="height: 25px">种 类</th>\
																<th style="height: 25px">品 名</th>\
																<th style="height: 25px">编 号</th>\
																<th style="height: 25px">产品克重</th>\
																<th style="height: 25px">出货重量</th>\
																<th style="height: 25px">出货数量</th>\
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
														<tbody id="shipment_tbody_'+i+'">\
														</tbody>\
													</table>\
									<div id="btn-'+t[i].orderid+'" style="text-align:center;"><button id="shipment_sub_btn_'+i+'" type="button" class="btn btn-primary" onclick="shipment_sub_btn('+i+')">处理完成并发送</button></div>'
							+'</div>'
					+'</div>';
					$("#accordion").append(socket_tab_html);

					// console.log(t[i]);
					readdata(i);
					var shipment_list_div_htmltext='';
					shipment_list_div_htmltext+=''
																+'<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																	<thead>\
																		<tr>\
																			<th></th>\
																			<th>产品克重</th>\
																			<th>出货重量</th>\
																			<th>出货数量</th>\
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
																	<tbody id = "shipment_list_tbody_'+i+'">\
																		<tr class="shipment_list_tr_'+i+'">\
																		<td><input type="checkbox" value="shipment_list_'+i+'" class="shipment_list_checkout_'+i+'" style="height:20px;"/></td>\
																		<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_pro_weight_'+i+'"></td>\
																		<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_weight_'+i+'"></td>\
																		<td><input type="number" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_number_'+i+'"></td>\
																		<td><input type="text" value=""/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:60px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		</tr>\
																	</tbody>\
																	'
																+'</table>'
																+'<div style="text-align:center"><button type="button" class="btn btn-primary" onclick="shipment_add_btn('+i+',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" class="btn btn-default" onclick="shipment_delete_btn('+i+',0)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="'+i+',0" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn('+i+',0)">提交明细数据</button></div>'
															+'</div>';
					$("#shipment_list_div_"+i).html(shipment_list_div_htmltext);



					var order_table_html = "";
					for(var j=0;j<t[i].products.length;j++){
						//console.log(j);
						if(j==0){
							order_table_html += '\
							<div style="border:2px solid #2b6aa2;" id="div_'+i+'_'+j+'" class="div_'+i+'">\
							<a href="javascript:backup('+i+','+j+')">\
									<table>\
										<tr>\
											<td style="border-right:1px #ccc solid; width:30px;text-align: center;">'+(j+1)+'<td>\
											<td>\
												<img src="/photo-album/image/'+t[i].products[j].image+';width=240;height=240;equalratio=1" height="120px"/>\
											</td>\
											<td>\
													<span id="span_'+i+'_'+j+'" style="color:red;">'+t[i].products[j].name+'<br/>'+t[i].products[j].number+'</span>\
											</td>\
										</tr>\
									</table>\
								</a>\
						</div>';
						}else{
							order_table_html += '\
							<div style="border:1px solid #ddd;" id="div_'+i+'_'+j+'" class="div_'+i+'">\
								<a href="javascript:backup('+i+','+j+')">\
										<table>\
											<tr>\
												<td style="border-right:1px #ccc solid; width:30px;text-align: center;">'+(j+1)+'<td>\
												<td>\
													<img src="/photo-album/image/'+t[i].products[j].image+';width=240;height=240;equalratio=1" height="120px"/>\
												</td>\
												<td>\
														<span id="span_'+i+'_'+j+'" style="color:red;">'+t[i].products[j].name+'<br/>'+t[i].products[j].number+'</span>\
												</td>\
											</tr>\
										</table>\
									</a>\
							</div>';
						}
					}
					var order_table_number ="#order_table_c"+i;
					$(order_table_number).html(order_table_html);
					$("#collapse0").addClass('in');
					var backup_num1 = "#backup"+i;
					var backup_htmlcode = '';
					if(t[i].products[0].note){
						var backup_note = json_parse(t[i].products[0].note);
						// console.log(backup_note);
						for(var k = 0 ;k<backup_note.length;k++){
							if ((backup_note[k].txt).indexOf('.wav')>=0){
								// console.log(backup_note[i].txt);
								backup_htmlcode +='<audio src="/photo-album/order/voice/'+backup_note[k].txt+'" controls="controls">'
																+'你的浏览不支持音频播放！'
																+'</audio><br/>';
							}else{
								backup_htmlcode +='<div class="backup_note_class">'+backup_note[k].txt+'</div>';
							}
						}
					}else{
						var backup_htmlcode = "空";
						var backup_note = "空";
					}
					// console.log(backup_note);

					$(backup_num1).html(backup_htmlcode);
					switch (t[i].state) {
						case 0:
							$("#state_text_"+i).html("出货明细待处理");
							$("#shipment_sub_btn_"+i).show();
							$("#excel_btn"+i).hide();
							break;
						case 1:
							$("#state_text_"+i).html("待客户确认订单");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).show();
							break;
						case 2:
							$("#state_text_"+i).html("客户已确认订单");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).show();
							break;
						case -2:
							$("#state_text_"+i).html("全部订单");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).hide();
							break;
						case 10:
							$("#state_text_"+i).html("已取消订单(待明细)");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).hide();
							break;
						case 11:
							$("#state_text_"+i).html("已取消订单(待确认)");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).hide();
							break;
						case 12:
							$("#state_text_"+i).html("已取消订单(已确认)");
							$("#shipment_sub_btn_"+i).hide();
							$("#excel_btn"+i).hide();
							break;
					}
					// console.log($("#tb-"+t[i].orderid));
					// console.log($("#tb-"+t[i].orderid).find("tbody")[0].children);
					// $($("#tb-"+t[i].orderid).find("tbody")[0].rows).each(function(m,melem){
					// 	console.log(melem);
						// $(t[x].products).each(function(d,delem){
						// 	// console.log(delem.number);
						// 	if(delem.number == ($(melem)[0].children[3].innerText)){
						// 		console.log(delem.number);
						// 		console.log(d);
						// 		console.log(x);
						// 		$("#span_"+x+"_"+d).css("color","#000000");
						// 	}
						// });
					// });
		}
		var lStorage = window.localStorage;
		// console.log(lStorage.openid);
		$(t).each(function(k,kelem){
			if(kelem.orderid ==lStorage.openid){
				$('#collapse0').collapse('hide');
				$('#collapse'+k).collapse('show');
				$("#icon-"+k).html("▲");
			}else{
				$("#icon-"+k).html("▼");
			}

		});
		//console.log(pagenum);
		//首页
		var fengpages_html =' <button class="btn btn-primary" onclick="doSend(1)">首 页</button> ';
		var p=page_num+1;

		//上一页
		if(p != 1){
			var m = page_num-1;
			fengpages_html +=' <button class="btn btn-default" onclick="doSend('+ (p-1) +')">上一页</button> ';
		}
		//console.log(p);

		// console.log("当前页码(p):"+p);
		if(pagenum){
			for(var k=1;k<=pagenum;k++){
				if(k == p){
					fengpages_html +=' <button class="btn btn-warning" onclick="doSend('+ k +')">'+k+'</button> ';
				}else{
					fengpages_html +=' <button class="btn btn-default" onclick="doSend('+ k +')">'+k+'</button> ';
				}
			}

		}
		//下一页
		if(p != pagenum && pagenum > 1){
			fengpages_html +=' <button class="btn btn-default" onclick="doSend('+ (p+1) +')">下一页</button> ';
		}
		//末页
		fengpages_html +=' <button class="btn btn-primary" onclick="doSend('+ pagenum +')">末 页</button> ';
		$("#fengpages").html(fengpages_html);
	});



}

//读取据
function readdata(j){
	//t为websocket的值
	// console.log(t);
	// console.log(t[j]);
	var shipment_tbody_divtext ='';
	var post_data1 = new FormData();
	post_data1.append('orderid', t[j].orderid);
	post_data1.append('page', 0);
	post_data1.append('size', 1000);
	http.postAjax_clean("/photo-album/order_manger/get_details", post_data1,function(data1) {
		$(data1.products).each(function(i,elem){
			if(elem.details[0] !=undefined){
				$(t[j].products).each(function(w,welem){
					if(welem.number == elem.number){
						$("#span_"+j+"_"+w).css("color","#000000");
					}
				});
				$(elem.details).each(function(k,subelem){
					// console.log(subelem);
					shipment_tbody_divtext +='\
						<tr id="shipment_tbody_tr_'+i+'" class="shipment_tbody_tr_class_'+i+'_">\
							<td class="num_display">'+(i+1)+'</td>\
							<td>足金999</td>\
							<td>'+elem.name+'</td>\
							<td>'+elem.number+'</td>\
							<td>'+subelem.shipment_pro_weight+'</td>\
							<td>'+subelem.shipment_weight+'</td>\
							<td>'+subelem.shipment_number+'</td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
							<td> </td>\
						</tr>';
				});
			}
		});
		$("#shipment_tbody_"+j).html(shipment_tbody_divtext);
		//tabletr序号排序
		trnum_display(j);
		//为每个订单的首个产品添加购买单位和克重开始
		var prolist_arr=[];
		// console.log(t[j].products[0].number);
		$($("#shipment_tbody_"+j)[0].rows).each(function(k,trelem){
			// console.log(data1.products[0].number);
			// console.log($(trelem)[0].children[3].innerText);
			// console.log(j);
			if(t[j].products[0].number == $(trelem)[0].children[3].innerText){
				// console.log($(trelem)[0].children[3].innerText);
				var sub_prolist =[];
				// console.log(k);
				// console.log($(trelem)[0].children[3]);
				sub_prolist.push($(trelem)[0].children[3].innerText);
				sub_prolist.push($(trelem)[0].children[4].innerText);
				sub_prolist.push($(trelem)[0].children[5].innerText);
				sub_prolist.push($(trelem)[0].children[6].innerText);
				// console.log(sub_prolist);
				prolist_arr.push(sub_prolist);
			}
		});
		if(prolist_arr.length != 0){
			var shipment_list_htmltext = '';
					shipment_list_htmltext+='\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th></th>\
																		<th>产品克重</th>\
																		<th>出货重量</th>\
																		<th>出货数量</th>\
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
																	<tbody id = "shipment_list_tbody_'+j+'">';
				$(prolist_arr).each(function(i,elem){
					// console.log(elem);
					shipment_list_htmltext+='\
																		<tr class="shipment_list_tr_'+j+'">\
																			<td><input type="checkbox" value="shipment_list_'+j+'" class="shipment_list_checkout_'+j+'" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[1]+'" id="shipment_pro_weight_'+j+'"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[2]+'" id="shipment_weight_'+j+'"></td>\
																			<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[3]+'" id="shipment_number_'+j+'"></td>\
																			<td><input type="text" value=""/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:60px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																		</tr>';
				});
				 shipment_list_htmltext+='\
																	</tbody>\
																	'
																+'</table>'
																+'<div id="add_btn_line_div'+j+'" style="text-align:center"><button type="button" class="btn btn-primary" onclick="shipment_add_btn('+j+',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" class="btn btn-default" onclick="shipment_delete_btn('+j+',1)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="'+j+',1" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn('+j+',0)">提交明细数据</button></div>'
															+'</div>';
			$("#shipment_list_div_"+j).html(shipment_list_htmltext);

		}else{
			var shipment_list_htmltext = '';
					shipment_list_htmltext+='\
																<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
																<thead>\
																	<tr>\
																		<th></th>\
																		<th>产品克重</th>\
																		<th>出货重量</th>\
																		<th>出货数量</th>\
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
																	<tbody id = "shipment_list_tbody_'+j+'">\
																		<tr class="shipment_list_tr_'+j+'">\
																			<td><input type="checkbox" value="shipment_list_'+j+'" class="shipment_list_checkout_'+j+'" style="height:20px;"/></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_pro_weight_'+j+'"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_weight_'+j+'"></td>\
																			<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_number_'+j+'"></td>\
																			<td><input type="text" value=""/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:60px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																			<td><input type="text" value="" style="width:40px"/></td>\
																		</tr>\
																	</tbody>\
																	'
																+'</table>'
																+'<div id="add_btn_line_div'+j+'" style="text-align:center"><button type="button" class="btn btn-primary" onclick="shipment_add_btn('+j+',0)"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" class="btn btn-default" onclick="shipment_delete_btn('+j+',1)"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="'+j+',1" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn('+j+',0)">提交明细数据</button></div>'
															+'</div>';
			$("#shipment_list_div_"+j).html(shipment_list_htmltext);

		}

							//创建一个本地数据库保存出货产品明细开始
							var lStorage=window.localStorage;
							// console.log("j:"+j);
							// console.log(t);
							$(t).each(function(m,melem){
								// console.log(m);
							//
							// 	// console.log(i);
								if(j == m){
									// console.log(t[m].orderid);
									if(lStorage[t[m].orderid] != undefined){
										var temp_lStorage_json =JSON.parse(lStorage[t[m].orderid]);
										// console.log(temp_lStorage_json);
										for(var q in temp_lStorage_json){
											// console.log(q);
											if(q == 'pro_0'){
												var shipment_list_tbody_htmlcode ='';
												$(temp_lStorage_json[q]).each(function(k,kelem){
													shipment_list_tbody_htmlcode +='\
														<tr class="shipment_list_tr_'+j+'">\
															<td><input type="checkbox" value="shipment_list_'+j+'" class="shipment_list_checkout_'+j+'" style="height:20px;"/></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+kelem.code+'" id="shipment_pro_weight_'+j+'"></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+kelem.weight+'" id="shipment_weight_'+j+'"></td>\
															<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+kelem.number+'" id="shipment_number_'+j+'"></td>\
															<td><input type="text" value=""/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
															<td><input type="text" value="" style="width:60px"/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
															<td><input type="text" value="" style="width:40px"/></td>\
														</tr>\
													';
												});
												// console.log(shipment_list_tbody_htmlcode);
												$("#shipment_list_tbody_"+j).html(shipment_list_tbody_htmlcode);
											}
										}

									}
								}
							});
							// $("#shipment_list_tbody_"+j).html("shipment_list_tbody_htmlcode");
							//创建一个本地数据库保存出货产品明细结束
							// console.log(t[j]);
							// console.log(t[j].state);
							if(t[j].state ==0){
								$("#add_btn_line_div"+j).show();
							}else{
								$("#add_btn_line_div"+j).hide();
							}
							//tabletr序号排序
							trnum_display(j);
	});

}

//订单备注支持文字、语音
function backup(a,b){
	//选择框框变色
	var div_backup = $('.div_'+a);
	// console.log(div_backup);
	$(div_backup).each(function(i,elem){
		// console.log(elem);
		if(elem.id == 'div_'+a+"_"+b){
			// $(elem).css('border-color','#2b6aa2');
			$(elem).css({ 'border-color': "#2b6aa2", 'border-width': "2px" });
		}else{
			$(elem).css({ 'border-color': "#ddd", 'border-width': "1px" });
		}
	});

	var backup_num="#backup"+a;
	var note_code =t[a].products[b].note;
	// console.log(note_code);
	// console.log(t[a].products[b]);
	// console.log(t[a].products[b].number);
	var prolist_arr=[];
	// console.log($('#shipment_tbody_'+a));
	// console.log($('#shipment_tbody_'+a)[0].children);
	$($('#shipment_tbody_'+a)[0].children).each(function(k,trelem){
		if(t[a].products[b].number == $(trelem)[0].children[3].innerText){
			var sub_prolist =[];
			// console.log(k);
			// console.log($(trelem)[0].children[3]);
			sub_prolist.push($(trelem)[0].children[3].innerText);
			sub_prolist.push($(trelem)[0].children[4].innerText);
			sub_prolist.push($(trelem)[0].children[5].innerText);
			sub_prolist.push($(trelem)[0].children[6].innerText);
			// console.log(sub_prolist);
			prolist_arr.push(sub_prolist);
		}
	});

	// console.log(JSON.stringify(prolist_arr));
	// console.log(prolist_arr.length);
	if(prolist_arr.length != 0){
		var shipment_list_htmltext = '';
				shipment_list_htmltext+='\
															<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
															<thead>\
																<tr>\
																	<th></th>\
																	<th>产品克重</th>\
																	<th>出货重量</th>\
																	<th>出货数量</th>\
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
																<tbody id = "shipment_list_tbody_'+a+'">';
			$(prolist_arr).each(function(i,elem){
				// console.log(elem);
				shipment_list_htmltext+='\
																	<tr class="shipment_list_tr_'+a+'">\
																		<td><input type="checkbox" value="shipment_list_'+a+'" class="shipment_list_checkout_'+a+'" style="height:20px;"/></td>\
																		<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[1]+'" id="shipment_pro_weight_'+a+'"></td>\
																		<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[2]+'" id="shipment_weight_'+a+'"></td>\
																		<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+elem[3]+'" id="shipment_number_'+a+'"></td>\
																		<td><input type="text" value=""/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:60px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																	</tr>';
			});
			 shipment_list_htmltext+='\
																</tbody>\
																'
															+'</table>'
															+'<div id="add_btn_line_div'+a+'" style="text-align:center"><button type="button" class="btn btn-primary" onclick="shipment_add_btn('+a+','+b+')"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" class="btn btn-default" onclick="shipment_delete_btn('+a+','+b+')"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="'+a+','+b+'" type="button" class="btn btn-success"\ onclick="shipment_weight_submit_btn('+a+','+b+')">提交明细数据</button></div>'
														+'</div>';
		$("#shipment_list_div_"+a).html(shipment_list_htmltext);
	}else{
		var shipment_list_htmltext = '';
				shipment_list_htmltext+='\
															<table class="shipment_list_table table table-striped table-bordered table-hover" style="font-size:12px;">\
															<thead>\
																<tr>\
																	<th></th>\
																	<th>产品克重</th>\
																	<th>出货重量</th>\
																	<th>出货数量</th>\
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
																<tbody id = "shipment_list_tbody_'+a+'">\
																	<tr class="shipment_list_tr_'+a+'">\
																		<td><input type="checkbox" value="shipment_list_'+a+'" class="shipment_list_checkout_'+a+'" style="height:20px;"/></td>\
																		<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_pro_weight_'+a+'"></td>\
																		<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_weight_'+a+'"></td>\
																		<td><input type="number" min="0.0" value="0" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_number_'+a+'"></td>\
																		<td><input type="text" value=""/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:60px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																		<td><input type="text" value="" style="width:40px"/></td>\
																	</tr>\
																</tbody>\
																'
															+'</table>'
															+'<div  id="add_btn_line_div'+a+'" style="text-align:center"><button type="button" class="btn btn-primary" onclick="shipment_add_btn('+a+','+b+')"> <img src="/photo-album/img/addpng.png"/> 添加明细行</button> <button type="button" class="btn btn-default" onclick="shipment_delete_btn('+a+','+b+')"> <img src="/photo-album/img/delectpng.png"/> 删除明细行</button> <button id="'+a+','+b+'" type="button" class="btn btn-success" onclick="shipment_weight_submit_btn('+a+','+b+')">提交明细数据</button></div>'
														+'</div>';
		$("#shipment_list_div_"+a).html(shipment_list_htmltext);
	}
	//突然加单将已填数据保存
	  var lStorage=window.localStorage;
	  // console.log(lStorage);
		// console.log(t);
		for(var e in lStorage){
			$(t).each(function(p,pelem){
				if(pelem.orderid == e){
					if(p == a){
						// console.log("p:"+p);
						var lStorage_pro_list = JSON.parse(lStorage[(pelem.orderid)]);
						// console.log(lStorage_pro_list);
						for(var w in lStorage_pro_list){
							if(('pro_'+b) == w ){
								// console.log('length:'+lStorage_pro_list[w].length);
								var lStorage_pro_list_htmlcode = '';
								$(lStorage_pro_list[w]).each(function(t,telem){
									// console.log(telem);
									lStorage_pro_list_htmlcode += '<tr class="shipment_list_tr_'+a+'">\
										<td><input type="checkbox" value="shipment_list_'+a+'" class="shipment_list_checkout_'+a+'" style="height:20px;"/></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+telem.code+'" id="shipment_pro_weight_'+a+'"></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+telem.weight+'" id="shipment_weight_'+a+'"></td>\
										<td><input type="number" min="0.0" oninput="if(value.length>14)value=value.slice(0,14)" value="'+telem.number+'" id="shipment_number_'+a+'"></td>\
										<td><input type="text" value=""/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
										<td><input type="text" value="" style="width:60px"/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
										<td><input type="text" value="" style="width:40px"/></td>\
									</tr>';
								});
								$("#shipment_list_tbody_"+p).html(lStorage_pro_list_htmlcode);
							}
						}
					}
				}
			});
		}

		// console.log(a);
		// console.log(t[a]);
		if(t[a].state ==0){
			$("#add_btn_line_div"+a).show();
		}else{
			$("#add_btn_line_div"+a).hide();
		}
	if(!note_code){
		$(backup_num).html("空");
	}
	var note_json_code =json_parse(note_code);
	// console.log(note_json_code);

	var note_htmlcode ='';
	for(var k = 0 ;k<note_json_code.length;k++){
		// console.log(note_json_code[k].txt);
		if ((note_json_code[k].txt).indexOf('.wav')>=0){
			// console.log(note_json_code[k].txt);
			note_htmlcode +='<audio src="/photo-album/order/voice/'+note_json_code[k].txt+'" controls="controls">'
								+'你的浏览不支持音频播放！'
								+'</audio> <br/>';
		}else{
			// console.log(note_json_code[k].txt);
			note_htmlcode +=note_json_code[k].txt+'<br/>';
		}
	}

	$(backup_num).html('');
	$(backup_num).html(note_htmlcode);




}


function onError(messages) {
}


function onClose() {
	setTimeout(function(){
		 reconnect()
	 },1000);
}

//stock连接
function doSend(num) {
	var numjian = num -1
	if (websocket.readyState == websocket.OPEN) {
				var msg = "list#"+numjian+"#8";
				page_num=numjian;
				websocket.send(msg);//调用后台handleTextMessage方法
				//alert("连接websocket成功!");
			} else {
				alert("连接websocket失败!");
			}
}

//删除订单delorder_btn
function delorder_btn(elem){
	// console.log(elem);
	if(confirm("确定要删除此订单记录！")){
		var elem_list = [];
		elem_list.push(elem);
		elem_list=JSON.stringify(elem_list);
		// console.log(elem_list);
		var post_data = new FormData();
		post_data.append('orderlist', elem_list);
		http.postAjax_clean("/photo-album/order/order_delete", post_data, function(data) {
			// console.log(data);
		});
	}
}

//“提交明细数据”按钮事件
function shipment_add_btn(x,y){
	// console.log(x);
	// console.log(y);
	var shipment_list_tbody_addtext='\
		<tr class="shipment_list_tr_'+x+'">\
			<td><input type="checkbox" value="shipment_list_'+x+'" class="shipment_list_checkout_'+x+'" style="height:20px;"/></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_pro_weight_'+x+'"></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_weight_'+x+'"></td>\
			<td><input type="number" value="0" min="0.00" oninput="if(value.length>14)value=value.slice(0,14)" id="shipment_number_'+x+'"></td>\
			<td><input type="text" value=""/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
			<td><input type="text" value="" style="width:60px"/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
			<td><input type="text" value="" style="width:40px"/></td>\
		</tr>';
	$("#shipment_list_tbody_"+x).append(shipment_list_tbody_addtext);

	// console.log(t);
	var temp_proid;
	$(t).each(function(k,selem){
		if(k == x){
			temp_proid = selem.orderid;
		}
	});
	// console.log(x,y);
	var Shipment_pro_list = [];
	$(".shipment_list_tr_" + x).each(function(j,jelem){
		//console.log($(jelem)[0].children[1].firstChild.value);
		Shipment_pro_list.push({"code":$(jelem)[0].children[1].firstChild.value,"weight":$(jelem)[0].children[2].firstChild.value,"number":$(jelem)[0].children[3].firstChild.value});
	});
	// console.log(JSON.stringify(Shipment_pro_list));
	var lStorage=window.localStorage;
	// console.log(lStorage[temp_proid]);
	if(lStorage[temp_proid] == undefined){
		var jsontemp = '{"pro_'+y+'":['+JSON.stringify(Shipment_pro_list)+']}';
		lStorage[temp_proid] = jsontemp;
	}else{
		var jsontemp = JSON.parse(lStorage[temp_proid]);
		jsontemp['pro_'+y] = Shipment_pro_list;
		//下方变量为保存字典变量数组
		// console.log(jsontemp);
		lStorage[temp_proid] = JSON.stringify(jsontemp);
		console.log(lStorage);
	}

}

//删除明细行按钮
function shipment_delete_btn(x,y){
	// console.log($(".shipment_list_checkout_"+x+":checked"));
	$(".shipment_list_checkout_"+x+":checked").each(function(i,elem){
		// console.log($(elem));
		$(elem)[0].parentElement.parentElement.remove();
	});
}


//页面全选选项JS
function allSelectOs(elem){
  if($(elem).is(':checked')){
    $('tbody').find('input[type=checkbox]').prop('checked', true);
  }else{
    $('tbody').find('input[type=checkbox]').prop('checked', false);
  }
}

//批量“删除”按钮
function multiDel(){
	var multiDel_list=[];
	var multiDel_num =$("input[name=all-select]");
	$(multiDel_num).each(function(i,elem){
		if ($(elem).is(':checked')) {
			multiDel_list.push(elem.value);
		}
	});
	if(multiDel_list !=0){
		multiDel_list=JSON.stringify(multiDel_list);
		var post_data = new FormData();
		post_data.append('orderlist', multiDel_list);
		http.postAjax_clean("/photo-album/order/order_delete", post_data, function(data) {
			location.reload();
		});
	}else{
		alert("订单未选择，请重新选择！");
	}
}

//“提交数据按钮”添加JS
function shipment_weight_submit_btn(x,y){
	$('.shipment_tbody_tr_class_'+x+'_'+y).each(function(j,classelem){
		$(classelem).remove();
	});
	var shipment_tbody_tr_text = $(".shipment_list_tr_"+x);
	var pro_tr_array = [];
	$(shipment_tbody_tr_text).each(function(i,elem){
		//出货产品克重(g)
		var a = $(elem)[0].firstElementChild.nextElementSibling.firstChild.value;
		//出货重量(g)
		var b = $(elem)[0].firstElementChild.nextElementSibling.nextElementSibling.firstChild.value;
		//出货数量(个)
		var c = $(elem)[0].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstChild.value;
		//
		// console.log(a,b,c);
		a = parseFloat(a);
		b = parseFloat(b);
		c = parseInt(c);
		var shipment_list_tf =false;
		if(a>0 && (b>0 || c>0)){
			shipment_list_tf = true;
		}
		if(shipment_list_tf){
			pro_tr_array.push({"code":a,"weight":b,"number":c});
		}
	});
	var shipment_tbody_tr_temptext =$('#shipment_tbody_'+x+' tr');
	$(shipment_tbody_tr_temptext).each(function(i,elem){
		$(elem)[0].firstChild.innerText = i+1;
	});
	//提交克重、数量、重量数据
	// console.log(pro_tr_array);
	//克重重复做数量和重量的叠加开始
	var selem_code = {};
	for (var i=0;i<pro_tr_array.length;i++){
		// console.log(pro_tr_array[i]);
		var code = pro_tr_array[i]["code"];
		var weight = pro_tr_array[i]["weight"];
		var number = pro_tr_array[i]["number"];
		if (selem_code[code] == undefined){
			selem_code[code] ={"code":code,"weight":weight,"number":number}
		}else{
			selem_code[code].weight += weight;
			selem_code[code].number += number;
		}
	}
	// console.log(selem_code);

	//克重重复做数量和重量的叠加结束
	$.each(selem_code, function(celem){
		// console.log(this);
			if(this.weight == "" || this.weight == 0 || this.weight == " "){
				this.weight = "-";
			}
			if(this.number == "" || this.number == 0 || this.number == " " ){
				this.number = "-";
			}

			var shipment_tbody_divtext = '\
				<tr id="shipment_tbody_tr_'+x+'" class="shipment_tbody_tr_class_'+x+'_'+y+'">\
					<td class="num_display">-</td>\
					<td>足金999</td>\
					<td>'+t[x].products[y].name+'</td>\
					<td>'+t[x].products[y].number+'</td>\
					<td>'+this.code+'</td>\
					<td>'+this.weight+'</td>\
					<td>'+this.number+'</td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
					<td> </td>\
				</tr>\
			';
			$("#shipment_tbody_"+x).append(shipment_tbody_divtext);
	});

	//tabletr序号排序
	// trnum_display();
	// console.log(t[x].orderid);
	// console.log(t[x].products);
	// console.log($($("#tb-"+t[x].orderid).find("tbody")[0].rows));
	var pro_name_id = [];
	$($("#tb-"+t[x].orderid).find("tbody")[0].rows).each(function(m,melem){
		if(pro_name_id.length !=0){
			var pro_name_number_tf =true;
			for(var i=0;i<pro_name_id.length;i++){
				if($(melem)[0].children[3].innerText == pro_name_id[i]){
					pro_name_number_tf =false;
				}
			}
			// console.log(pro_name_number_tf);
			if(pro_name_number_tf){
				pro_name_id.push($(melem)[0].children[3].innerText);
			}
		}else{
			pro_name_id.push($(melem)[0].children[3].innerText);
		}
		// console.log($(melem)[0].children[3].innerText);
		$(t[x].products).each(function(d,delem){
		// 	// console.log(delem.number);
			if(delem.number == ($(melem)[0].children[3].innerText)){
		// 		pro_name_id.push(delem.number);
		// 		console.log(delem.number);
		// 		console.log(d);
		// 		console.log(x);
				$("#span_"+x+"_"+d).css("color","#000000");
			}
		});
	});
	// console.log(pro_name_id);
	pro_name_id.sort();
	public_proname_id = pro_name_id;
	// console.log($("#shipment_tbody_"+x));
	// console.log($("#shipment_tbody_"+x+"  .num_display"));
	$("#shipment_tbody_"+x+"  .num_display").each(function(p,pelem){
		// console.log(pelem);
		$(pelem).html((p+1));
	});
}
//公司
var public_proname_id = [];

//“处理完成并发送”按钮
function shipment_sub_btn(i){
	// console.log(public_proname_id);

	var t_number_list = [];
	$(t[i].products).each(function(x,xelem){
		t_number_list.push(xelem.number)
	});

	t_number_list.sort();

	// $("#shipment_sub_btn_0").hide();
	if(JSON.stringify(public_proname_id) == JSON.stringify(t_number_list)){
		// console.log("yes");

		var shipment_sub_data =[];
		var shipment_tbody_list_data=$("#shipment_tbody_"+i+" tr");
		// console.log(shipment_tbody_list_data);
		$(shipment_tbody_list_data).each(function(i,elem){
			// console.log($(elem)[0].children[2].innerText);
			shipment_sub_data[i]={};
			//品 名
			shipment_sub_data[i].pro_name = $(elem)[0].children[2].innerText;
			//编 号
			shipment_sub_data[i].pro_id = $(elem)[0].children[3].innerText;
			//产品克重
			shipment_sub_data[i].shipment_pro_weight = $(elem)[0].children[4].innerText;
			//出货重量
			shipment_sub_data[i].shipment_weight = $(elem)[0].children[5].innerText;
			//出货数量
			shipment_sub_data[i].shipment_number = $(elem)[0].children[6].innerText;
			//字 印
			shipment_sub_data[i].shipment_printfont = $(elem)[0].children[7].innerText;
			//长 度
			shipment_sub_data[i].shipment_long = $(elem)[0].children[8].innerText;
			//宽 度
			shipment_sub_data[i].shipment_breadth = $(elem)[0].children[9].innerText;
			//高 度
			shipment_sub_data[i].shipment_height = $(elem)[0].children[10].innerText;
			//长宽高
			shipment_sub_data[i].shipment_lwh = $(elem)[0].children[11].innerText;
			//圈 口
			shipment_sub_data[i].shipment_Ring = $(elem)[0].children[12].innerText;
			//内 径
			shipment_sub_data[i].shipment_boresize = $(elem)[0].children[13].innerText;
			//面 宽
			shipment_sub_data[i].shipment_facewidth = $(elem)[0].children[14].innerText;
		});
		var shipment_sub_newdata = {};
		shipment_sub_newdata.orderid = t[i].orderid;
		shipment_sub_newdata.details = shipment_sub_data;
		//输出结果为这个
		var post_data = new FormData();
		post_data.append('details',JSON.stringify(shipment_sub_newdata));
		http.postAjax_clean("/photo-album/order_manger/detail_commit", post_data,function(data) {
			// console.log(data);
			location.reload();
		});

	}else{
		console.log("no");
		alert("还有未处理的订单，请全部处理完成再发送!");
	}

	// console.log(t[i].orderid);


}

//html出货导出excel
function toexcel_btn(elem){
	// console.log(elem);
	$.getJSON("/photo-album/order_manger/get_excel?orderid="+elem,function(data){
		console.log(data);
	});

}

//tabletr序号排序
function trnum_display(elem){
	$("#shipment_tbody_"+elem+" .num_display").each(function(i,elem){
		// $(elem).html((i+1));
		$(elem).html((i+1));
	})
}

//点击保存打开展开折叠层
function openmenu(elem,tempi){

	$(".panel-collapse").each(function(k,kelem){
		$("#icon-"+k).html("▼");
		console.log($(kelem)[0].className);
		// if($(kelem)[0].className == 'panel-collapse collapse in'){
		// 	$("#icon-"+k).html("▲");
		// }
	});
	var lStorage = window.localStorage;
	lStorage.openid = elem;
}

//出货明细折叠
function collapse_btn(elem,thiselem){
	$("#tb-"+elem)[0].hidden = !$("#tb-"+elem)[0].hidden;
	$("#btn-"+elem)[0].hidden = !$("#btn-"+elem)[0].hidden;
	if($("#tb-"+elem)[0].hidden){
		$(thiselem)[0].innerText = "展开出货明细 ▼";
	}else{
		$(thiselem)[0].innerText = "折叠出货明细 ▲";
	}
}

//折叠需求明细
function Requ_btn(elem,thiselem){
	// console.log(elem);
	// console.log($("#tab_"+elem));

	$("#tab_"+elem)[0].hidden = !$("#tab_"+elem)[0].hidden;
	if($("#tab_"+elem)[0].hidden){
		$(thiselem)[0].innerText = "展开需求明细 ▼";
	}else{
		$(thiselem)[0].innerText = "折叠需求明细 ▲";
	}
}
