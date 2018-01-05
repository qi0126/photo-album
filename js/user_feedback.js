$(function () {


	userfeed_list(1);



	//权限管理适配开始
	var lStorage=window.localStorage;
	var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
	// console.log(NoAuthMenu_data);
	setTimeout(function(){
		$(NoAuthMenu_data).each(function(o,oelem){
			if(oelem.type == 1){
				// console.log(oelem.menuname);
				switch (oelem.menuname) {
					// 查看用户反馈
					case '查看用户反馈':
						break;
					//处理用户反馈
					case '处理用户反馈':
						// console.log(oelem);
						$('button[name=userfeed_submit_btn]').hide();
						$('select[name=id_select]').hide();
						$('textarea[name=id_textarea]').hide();
						// $('#isurl').hide();
						break;
				}
			}
		});
	},200);
	//权限管理适配结束

	//下拉弹出层三解形变换
	a_onclick();
});

//折弹出层三解形变换
function a_onclick(){
	// console.log("aaaa");
	setTimeout(function(){
		$(".panel-collapse").each(function(i,ielem){
			// console.log(ielem);
			// console.log($(ielem)[0].attributes[2].value);
//			if($(ielem)[0].attributes[2].value == 'false'){
//				$("#span"+i).html("▼");
//			}else{
//				$("#span"+i).html("▲");
//			}
		});
	},0);
}


//用户反馈读取事件state为0未查看，1为已查看，-1为所有反馈信息
function userfeed_list(num){
	// console.log();
	// console.log($('#input_html_keyword'));
	var post_data = new FormData();
	post_data.append('state', $('#select_html_state').val());
	post_data.append('type', $('#select_html_type').val());
	post_data.append('keyword', $('#input_html_keyword')[0].value);
	post_data.append('currentPage',num);
	var user_feed_json='/photo-album/suggest/getsuggestlist?state='+$('#select_html_state').val()+'&type='+$('#select_html_type').val()+'&keyword='+$('#input_html_keyword')[0].value+'&currentPage='+num;
	http.postAjax_clean(user_feed_json, '' , function(data) {
	// http.postAjax_clean("/photo-album/suggest/getsuggestlist", post_data,function(data) {
		if(data.code == 0){
			if(data.data != null){
				$('#fenpage_div').show();

				//分页JS开始
				var sum_num = Math.ceil(data.data.totalSize/15);
				// console.log(sum_num);
				if(sum_num == 1){
					$('#fenpage_div').html('<span style="float:left;">显示第1条至第' + data.data.totalSize + '条，共有'+data.data.totalSize+'条反馈记录.</span>');
				}else{
					var fenpage_div_html = '';
					switch (num) {
						case 1:
							fenpage_div_html = '<span id="text_span"></span><button type="button" class="btn btn-primary" onclick="userfeed_list(1)">首 页</button> <span id="button_span"> <button type="button" class="btn btn-default" onclick="userfeed_list('+(num+1)+')">下一页</button> </span> <button type="button" class="btn btn-primary" onclick="userfeed_list('+sum_num+')">末 页</button>';
							break;
						case sum_num:
							fenpage_div_html = '<span id="text_span"></span><button type="button" class="btn btn-primary" onclick="userfeed_list(1)">首 页</button> <span id="button_span"> <button type="button" class="btn btn-default" onclick="userfeed_list('+(num-1)+')">上一页</button> </span> <button type="button" class="btn btn-primary" onclick="userfeed_list('+sum_num+')">末 页</button>';
							break;
						default:
							fenpage_div_html = '<span id="text_span"></span><button type="button" class="btn btn-primary" onclick="userfeed_list(1)">首 页</button> <span id="button_span"> <button type="button" class="btn btn-default" onclick="userfeed_list('+(num-1)+')">上一页</button> <button type="button" class="btn btn-default" onclick="userfeed_list('+(num+1)+')">下一页</button> </span> <button type="button" class="btn btn-primary" onclick="userfeed_list('+sum_num+')">末 页</button>';
							break;
					}
					$('#fenpage_div').html(fenpage_div_html);
					var bestbig_num = num*15
					if(data.data.totalSize< bestbig_num){
						$('#text_span').html('显示第'+((num-1)*15+1)+'条至第' + data.data.totalSize + '条，共有'+data.data.totalSize+'条反馈记录.    ');
					}else{
						$('#text_span').html('显示第'+((num-1)*15+1)+'条至第' + bestbig_num + '条，共有'+data.data.totalSize+'条反馈记录.    ');
					}
				}
				//分页JS结束

				//总有多少条记录
				$('#user_feedback_number').html(data.data.totalSize);
				var accordion_html ='';
				$(data.data.list).each(function(k,kelem){
					// console.log(kelem.contact);
					var contact_text;
					if(kelem.contact == 'null'){
						contact_text = '';
					}else{
						contact_text = kelem.contact;
					}
					// console.log(contact_text);
					accordion_html+='<div class="panel panel-default">'
					if(kelem.state == 0){
						accordion_html += '<div class="panel-heading" style="background-color:#428bca;color:#fff;">\
																<h4 class="panel-title">\
																	<a id="onlyA-'+ kelem.feedNumber +'" data-toggle="collapse" data-parent="#accordion" href="#collapse'+k+'">\
																		<table id="oneId" style="width: 100%" cellspacing="0" cellpadding="0">\
																			<tr>\
																				<td width="15%">反馈号：'+kelem.feedNumber+'</td>\
																				<td width="15%">账号：'+kelem.userName+'</td>\
																				<td width="30%">编号：'+kelem.number+'</td>\
																				<td width="20%">时间：'+kelem.createTime+'</td>\
																				<td width="20%">状态：未查看</td>\
																				<td width="10%"><span id="span'+k+'" class="spanclass">▼</span></td>\
																			</tr>\
																		</table>\
																	</a>\
																</h4>\
														</div>\
														<div id="collapse'+k+'" class="panel-collapse collapse">\
																<div class="panel-body">\
																	<table id="twoId" class="userfeedback_detail_table_class" cellspacing="0" cellpadding="0">\
																		<tr>\
																			<td class="tab_tdleft" valign="top">联系方式：</td>\
																			<td colspan="2">'+contact_text+'</td>\
																		</tr>\
																		<tr>\
																			<td class="tab_tdleft" valign="top">问题和意见：</td>\
																			<td colspan="2">'+kelem.content+'</td>\
																		</tr>\
																		<tr>\
																			<td class="tab_tdleft" valign="top">问题分类：</td>\
																			<td colspan="2">\
																				<select id="select_'+kelem.id+'" name="id_select">\
																					<option value="" selected="selected"></option>\
																					<option value="1">苹果APP程序问题</option>\
																					<option value="2">安卓APP程序问题</option>\
																					<option value="3">产品问题</option>\
																					<option value="4">跳转问题（后台设置）</option>\
																					<option value="5">客户建议</option>\
																			</td>\
																		</tr>\
																		<tr>\
																			<td class="tab_tdleft" valign="top">处理意见：</td>\
																			<td colspan="2">\
																				<textarea id="textarea_'+kelem.id+'" name="id_textarea" style="width:100%; height: 100px"></textarea>\
																			</td>\
																		</tr>\
																		<tr>\
																			<td>&nbsp;</td>\
																			<td>&nbsp;</td>\
																			<td style="text-align:right;padding-right:20px;">\
																				<button type="button" name="userfeed_submit_btn" class="btn btn-primary" onclick="userfeed_submit(\''+kelem.id+'\')">提 交</button>\
																			</td>\
																		</tr>\
																	</table>\
																</div>\
														</div>\
												</div>';
					}else{
						var prog_name;
						switch (kelem.type) {
							case '1':
								prog_name = "苹果APP程序问题";
								break;
							case '2':
								prog_name = "安卓APP程序问题";
								break;
							case '3':
								prog_name = "产品问题";
								break;
							case '4':
								prog_name = "跳转问题（后台设置）";
								break;
							case '5':
								prog_name = "客户建议";
								break;
						}
						accordion_html += '<div class="panel-heading" style="background-color:#fff;color:#000;">\
																					<h4 class="panel-title">\
																							<a id="onlyA-'+ kelem.feedNumber +'" data-toggle="collapse" data-parent="#accordion" href="#collapse'+k+'" onclick="a_onclick()">\
																								<table id="oneId" style="width: 100%" cellspacing="0" cellpadding="0">\
																									<tr>\
																										<td width="15%">反馈号：'+kelem.feedNumber+'</td>\
																										<td width="15%">账号：'+kelem.userName+'</td>\
																										<td width="30%">编号：'+kelem.number+'</td>\
																										<td width="20%">时间：'+kelem.createTime+'</td>\
																										<td width="20%">状态：已查看</td>\
																										<td width="10%"><span id="span'+k+'" class="spanclass">▼</span></td>\
																									</tr>\
																								</table>\
																							</a>\
																					</h4>\
																			</div>\
																			<div id="collapse'+k+'" class="panel-collapse collapse">\
																					<div class="panel-body">\
																						<table id="twoId" style="width: 100%" cellspacing="0" cellpadding="0">\
																							<tr>\
																								<td class="tab_tdleft">联系方式：</td>\
																								<td>'+contact_text+'</td>\
																							</tr>\
																							<tr>\
																								<td class="tab_tdleft">问题和意见：</td>\
																								<td>'+kelem.content+'</td>\
																							</tr>\
																							<tr>\
																								<td class="tab_tdleft">问题分类：</td>\
																								<td>'+prog_name+'</td>\
																							</tr>\
																							<tr>\
																								<td class="tab_tdleft">处理意见：</td>\
																								<td>'+kelem.suggest+'</td>\
																							</tr>\
																						</table>\
																					</div>\
																			</div>\
																	</div>';
						}
					});
					$('#accordion').html(accordion_html);
			}else{
				$('#user_feedback_number').html('0');
				$('#accordion').html('<div class="null_text_div">没有合适的反馈数据，请重新查询！</div>');
				$('#fenpage_div').hide();
			}
		}else{
			$('#user_feedback_number').html('0');
			$('#accordion').html('<div class="null_text_div">没有合适的反馈数据，请重新查询！</div>');
			$('#fenpage_div').hide();
		}
	});
}

//用户反馈
function userfeed_submit(elemid){
	if($('#textarea_'+elemid).val() != "" && $('#select_'+elemid).val() != ""){
		var post_data = new FormData();
		post_data.append('id', elemid);
		post_data.append('suggest', $('#textarea_'+elemid).val());
		post_data.append('type',  $('#select_'+elemid).val());
		http.postAjax_clean("/photo-album/suggest/resusersuggest", post_data,function(data) {
			if(data.code == 0){
				location.reload();
			}else{
				alert(data.msg);
			}
		});
	}else{
		win.alert('请填写问题分类和处理意见再提交！');
	}
}
