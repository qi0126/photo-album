window.onload = function() {
	winonload();
}

function winonload(){
	//团队列表开始
	// var post_data = new FormData();
	// post_data.append('teamname',$('#team_search_input').val());
	var search_input_text = "/photo-album/teammanger/teamonload?teamname="+$('#team_search_input').val();
	http.getAjax_clean(search_input_text, function(data) {
		if(data.code == 0){
			// console.log(data.data);
			if(data.data != null){
				var customer_manage_html="";
				$(data.data).each(function(i,ielem){
					// console.log(ielem);
					customer_manage_html+='<li id="id-'+ielem.saleTeamId+'" class="id-class"><button class="select_userid_btn" onclick="selectsaleteamid(\''+ielem.saleTeamId+'\',\''+ielem.saleTeamName+'\')">'+ielem.saleTeamName+'</button></li>';
				});
				$("#customer_list").html(customer_manage_html);
				//如果没有网页缓存选择团队，就默认为第一条。
				var lStorage=window.localStorage;
				console.log(lStorage.saleman_id);
				if(lStorage.saleman_id ==	undefined){
					selectsaleteamid(data.data[0].id,data.data[0].teamName);
				}else{
					selectsaleteamid(lStorage.saleteam_selectid,lStorage.saleteam_selectname);
				}
			}else{
				$("#customer_list").html('<li>没有搜到团队，请重新输入!</li>');
			}
		}else{
			alert(data.msg);
		}
	});
	//团队列表结束

	//权限管理适配开始
	setTimeout('menu()',200);
	//权限管理适配结束

}



//权限管理事件
function menu(){
	// http.getAjax_clean("/photo-album/job/getNoAuthMenuCurrUser", function(data) {
	var lStorage=window.localStorage;
  var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
	//管理所有销售团队权限true为有权限，false为没有权限
	var manage_allsaleteam_menu_tf = true;
		$(NoAuthMenu_data).each(function(o,oelem){
				if(oelem.menuname == '管理所有销售团队'){
					manage_allsaleteam_menu_tf = false;
				}
		});
		// console.log(manage_allsaleteam_menu_tf);
		////管理所有销售团队权限true为有权限，false为没有权限
		if(manage_allsaleteam_menu_tf == false){
			$(NoAuthMenu_data).each(function(o,oelem){
				switch (oelem.menuname) {
					// 搜索销售团队
					case '搜索销售团队':
						// console.log(oelem);
						$('#team_search_div').hide();
						break;
					// 添加销售团队
					case '添加销售团队':
						// console.log(oelem);
						// $('#del_saleman_btn').hide();
						break;
					// 修改销售团队
					case '修改销售团队':
						// console.log(oelem);
						// $('#saleman_save_div').hide();
						break;
					// 删除销售团队
					case '删除销售团队':
						// console.log(oelem);
						// $('#password').attr('disabled','false');
						break;
						// 添加团队成员
						case '添加团队成员':
							// console.log(oelem);
							$('#teamman_addman_btn').hide();
							break;
						// 删除团队成员
						case '删除团队成员':
							// console.log(oelem);
							$('#teamman_delman_btn').hide();
							break;
						// 设置团队负责人
						case '设置团队负责人':
							// console.log(oelem);
							$('button[name=teamleader_setting_btn]').each(function(i,ielem){
								$(ielem).remove();
							});
							break;
				}
			});
		}
}

//团队选择
function selectsaleteamid(elemid,elemname){
	// console.log(elemid);
	// console.log(elemname);
	$('#teamname_search_input').val('');
	var lStorage=window.localStorage;
	lStorage.saleteam_selectid = elemid;
	lStorage.saleteam_selectname = elemname;
  // console.log(lStorage);
	//销售团队都背景变白
	$('.id-class').each(function(i,ielem){
		$(ielem).css({
		  "color":"#000",
		  "background-color":"#fff"
	  })
	});
	//所选定团队背景变蓝，字变白
	$('#id-'+lStorage.saleteam_selectid).css({
	  "color":"#fff",
	  "background-color":"#428bca"
  });
	//更换输入框
	$('#teamname_search_input').show();
	$('#team_name_display').html(elemname);
	var teamname_search_input_text = "/photo-album/sale/saleLoad?name="+$('#teamname_search_input').val()+"&saleTeamId="+elemid;
	http.getAjax_clean(teamname_search_input_text, function(data) {
		// console.log(data);
		if(data.code == 0){
			if(data.data != null){
				var customer_list_ul_html = '';
				$(data.data.sBeans).each(function(k,kelem){
					// console.log(kelem);
					if(kelem.leadTyepe=='1'){
						customer_list_ul_html +='\
											<li>\
												<input id="saleman_id_'+kelem.id+'" class="saleman_class" name="Fruit" type="checkbox" style="float:left;margin:18px 0 0 30px;"/>\
												<span class="sale_team_people">\
													团队负责人\
												</span>\
												<span class="customer_right_list">\
													'+kelem.saleName+'\
													<button class="btn btn-default leader_btn" name="teamleader_setting_btn" onclick="teamleader_setting(\''+kelem.id+'\')">设为负责人</button>\
												</span>\
											</li>\
						';
					}else{
						customer_list_ul_html +='\
											<li>\
												<input id="saleman_id_'+kelem.id+'" class="saleman_class" name="Fruit" type="checkbox" style="float:left;margin:18px 0 0 30px;"/>\
												<span class="customer_right_list">\
													'+kelem.saleName+'\
													<button class="btn btn-default leader_btn" name="teamleader_setting_btn" onclick="teamleader_setting(\''+kelem.id+'\')">设为负责人</button>\
												</span>\
											</li>';
					}
				});
				$('#customer_list1').html(customer_list_ul_html);
				//设为团队负责人按钮出现开始
				$($("#customer_list1")[0].children).each(function(i,ielem){
					// console.log(ielem);
					$(ielem).hover(function(){
						//鼠标经过的操作
						$(".leader_btn").each(function(k,kelem){
							$(kelem).hide();
						});
						$($(this)[0].lastElementChild.firstElementChild).show();
					});
				});
			//设为团队负责人按钮出现结束
    	}else{
				$('#customer_list1').html("<li>没有团队成员！</li>");
				// console.log("没有团队成员！");
			}
		}else{
			$('#customer_list1').html("<li>没有团队成员！</li>");
			// console.log("没有团队成员！");
		}
	});
}

//团队创建样式
function team_add_btn(){
	var team_add_html ='';
	team_add_html += '<li><input class="team_add_input" placeholder="请输入团队名称"></input></li>';
	$("#customer_list").append(team_add_html);
}

//新建团队保存
function team_save_btn(){
	var teamname_input_text =($('.team_add_input')[0].value).replace(/\s\s*$/, '');
// console.log(numer_input_text);
	if(teamname_input_text != ''){
		$('.team_add_input').each(function(i,ielem){
			// console.log($(ielem)[0].value);
			var post_data = new FormData();
			post_data.append('number', "002");
			post_data.append('name', $(ielem)[0].value);
			http.postAjax_clean("/photo-album/teammanger/addteam", post_data,function(data) {
				// console.log(data);
				if(data.code == 0){
					// console.log(data);
					var lStorage=window.localStorage;
					lStorage.saleteam_selectid = data.data.id;
					lStorage.saleteam_selectname = data.data.name;
					location.reload();
				}else{
					alert(data.msg);
				}
			});
		});
	}else{
		alert("团队名称不能为空或空格！");
	}
}


//团队成员搜索
function teamname_search(){
	// console.log($('#teamname_search_input').val());
	var lStorage=window.localStorage;
	// console.log(lStorage.saleteam_selectid);
	var teamname_search_input_text = "/photo-album/sale/saleLoad?name="+$('#teamname_search_input').val()+"&saleTeamId="+lStorage.saleteam_selectid;
	http.getAjax_clean(teamname_search_input_text, function(data) {
		if(data.code == 0){
			if(data.data != null){
				var customer_list_ul_html = '';
				$(data.data.sBeans).each(function(k,kelem){
					// console.log(kelem);
					if(kelem.leadTyepe=='1'){
						customer_list_ul_html +='\
											<li>\
												<input id="saleman_id_'+kelem.id+'" class="saleman_class" name="Fruit" type="checkbox" style="float:left;margin:18px 0 0 30px;"/>\
												<span class="sale_team_people">\
													团队负责人\
												</span>\
												<span class="customer_right_list">\
													'+kelem.saleName+'\
													<button class="btn btn-default leader_btn" onclick="teamleader_setting(\''+kelem.id+'\')">设为负责人</button>\
												</span>\
											</li>\
						';
					}else{
						customer_list_ul_html +='\
											<li>\
												<input id="saleman_id_'+kelem.id+'" class="saleman_class" name="Fruit" type="checkbox" style="float:left;margin:18px 0 0 30px;"/>\
												<span class="customer_right_list">\
													'+kelem.saleName+'\
													<button class="btn btn-default leader_btn" onclick="teamleader_setting(\''+kelem.id+'\')">设为负责人</button>\
												</span>\
											</li>';
					}
				});
				$('#customer_list1').html(customer_list_ul_html);
			}else{
				$('#customer_list1').html('<li>没有合适的成员，请重新输入！</li>');
			}

			//设为团队负责人按钮出现开始
			$($("#customer_list1")[0].children).each(function(i,ielem){
				// console.log(ielem);
				$(ielem).hover(function(){
					//鼠标经过的操作
					$(".leader_btn").each(function(k,kelem){
						$(kelem).hide();
					});
					$($(this)[0].lastElementChild.firstElementChild).show();
				});
			});
			//设为团队负责人按钮出现结束

		}
	});
}

//设为团队负责人
function teamleader_setting(elemid){
	var lStorage=window.localStorage;
  // console.log(lStorage.saleteam_selectid);
	// console.log(elemid);
	var post_data = new FormData();
	post_data.append('teamId', lStorage.saleteam_selectid);
	post_data.append('saleId', elemid);
	post_data.append('leadTyepe', "1");
	http.postAjax_clean("/photo-album/teammanger/setTeam", post_data,function(data) {
		// console.log(data);
		if(data.code == 0){
			alert('设置团队负责人成功！');
			location.reload();
		}else{
			alert(data.msg);
		}
	});
}

//删除团队按钮
function team_del_btn(){
	var lStorage=window.localStorage;
	var post_data = new FormData();
	post_data.append('id', lStorage.saleteam_selectid);
	http.postAjax_clean("/photo-album/teammanger/deleteSaleTeam", post_data,function(data) {
		// console.log(data);
		if(data.code == 0){
			var lStorage=window.localStorage;
			lStorage.saleteam_selectname = '';
			// console.log(lStorage);
			$('#team_name_display').html('');
			alert('删除团队成功！');
			location.reload();
		}else{
			alert(data.msg);
		}
	});
}

//团队成员列表
function teamman_add_list(){
	var lStorage=window.localStorage;
  // console.log(lStorage);
	if(lStorage.saleteam_selectid != "undefined"){
		var post_data = new FormData();
		post_data.append('saleTeamId', lStorage.saleteam_selectid);
		post_data.append('name', $('#sale_man_search').val());
		http.postAjax_clean("/photo-album/sale/byNotSale", post_data,function(data) {
			// console.log(data);
			if(data.code == 0){
				// console.log(data.data.sBeans);
				var sale_man_list_html ='';
				$(data.data.sBeans).each(function(i,ielem){
					// console.log(ielem);
					sale_man_list_html +='\
									<div style="text-align:center;border-bottom:1px solid #f0f0f0;padding:10px;">\
										<span style="float:left;width:20px;">\
											<input id="input-'+ielem.id+'" class="input-salename" name="salename_list_input" type="checkbox" />\
										</span>\
											'+ielem.saleName+'\
										\
									</div>'
				});
				$('#sale_man_list').html(sale_man_list_html);
			}else{
				// alert(data.msg);
			}
		});
	}else{
		alert("请选择团队才能添加成员！");

	}
}

//团队成员提交
function saleman_add_sub(){
	var lStorage=window.localStorage;
	// console.log(lStorage.saleteam_selectid);
	// console.log($('.input-salename'));
	var saleman_list =[];
	$('.input-salename').each(function(i,ielem){
		// console.log(ielem);
		if($(ielem).is(':checked')){
			// console.log(ielem.id);
			var saleman_id = (ielem.id).split('input-')[1];
			saleman_list.push(saleman_id);
		}


	});
	// console.log(saleman_list);
	var post_data = new FormData();
	post_data.append('saleTeamId', lStorage.saleteam_selectid);
	post_data.append('saleId', saleman_list);
	http.postAjax_clean("/photo-album/sale/teamIdToSale", post_data,function(data) {
		// console.log(data);
		if(data.code == 0){
			location.reload();
		}
	});
}

//团队成员删除
function saleman_del_sub(){
	var lStorage=window.localStorage;
	// console.log(lStorage.saleteam_selectid);
	// console.log($('.input-salename'));
	var saleman_del_list =[];
	$('.saleman_class').each(function(i,ielem){
		// console.log(ielem);
		if($(ielem).is(':checked')){
			// console.log(ielem.id);
			var saleman_id = (ielem.id).split('saleman_id_')[1];
			saleman_del_list.push(saleman_id);
		}
	});
	// console.log(saleman_list);
	var post_data = new FormData();
	post_data.append('saleTeamId', lStorage.saleteam_selectid);
	post_data.append('saleId', saleman_del_list);
	http.postAjax_clean("/photo-album/sale/deleteSale", post_data,function(data) {
		// console.log(data);
		if(data.code == 0){
			location.reload();
		}
	});
}

//全选选择项
function saleman_allselect_checkbox(thiselem){
	//全选和全否选
	$("input[name='salename_list_input']").each(function(i,ielem){
		$(ielem).prop("checked",$(thiselem)[0].checked);
	});

}
