var setting = {
  check: {
    enable: true
  },
  data: {
    simpleData: {
      enable: true
    }
  }
};

function menu(){
    var lStorage=window.localStorage;
    var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
    // console.log(NoAuthMenu_data);
    $(NoAuthMenu_data).each(function(o,oelem){
      if(oelem.type == 1){
        // console.log(oelem.menuname);
        switch (oelem.menuname) {
          // 新增组织架构
          case '新增组织架构':
            // console.log(oelem);
            $('#orga_add_big_btn').hide();
            break;
          // 修改组织架构
          case '修改组织架构':
            // console.log(oelem);
            $('div[name=orga_rename_btn]').each(function(i,ielem){
              // console.log($(ielem)[0].innerText);
              var temp_orga_rename =$(ielem)[0].innerText;
              $(ielem).replaceWith('<button type="button" class="btn btn-info btn-lg">'+temp_orga_rename+'</button>');
            });
            $('button[name=orga_del_btn]').each(function(i,ielem){
              $(ielem).hide();
            });
            break;
          // 新增职位
          case '新增职位':
            $('button[name=job_add_btn]').each(function(i,ielem){
              $(ielem).hide();
            });
            // $('#isurl').hide();
            break;
          // 修改职位
          case '修改职位':
            $('div[name=job_Auth_display_btn]').each(function(i,ielem){
              // console.log($(ielem)[0].ondblclick==0);
              $(ielem).replaceWith($(ielem)[0].outerHTML);
            });
            // $('#isurl').hide();
            break;
          // 删除职位
          case '删除职位':
            // console.log(oelem);
            $('div[name=job_del_btn]').each(function(i,ielem){
              $(ielem).hide();
            });

            // $('#isurl').hide();
            break;
          // 设置职位权限
          case '设置职位权限':
            // console.log(oelem);
            $('button[name=menu_save]').each(function(i,ielem){
              $(ielem).hide();
            });
            $('button[name=menu_cancel]').each(function(i,ielem){
              $(ielem).hide();
            });
            // $('#isurl').hide();
            break;

        }
      }
    });
  }


var code;

function setCheck() {
  var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
  py = $("#py").attr("checked")? "p":"",
  sy = $("#sy").attr("checked")? "s":"",
  pn = $("#pn").attr("checked")? "p":"",
  sn = $("#sn").attr("checked")? "s":"",
  type = { "Y":py + sy, "N":pn + sn};
  zTree.setting.check.chkboxType = type;
  showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
}
function showCode(str) {
  if (!code) code = $("#code");
  code.empty();
  code.append("<li>"+str+"</li>");
}

$(function(){
  //读取组织架构中的职位
  http.getAjax_clean("/photo-album/job/getListFull", function(data) {
    // console.log(data);

    // console.log(zNodes);
    if(data.code == 0){
      // console.log(data.data);
      var Operation_center_html = '';
      $(data.data.orgaList).each(function(i,ielem){
        // console.log(ielem);
        Operation_center_html +='<div class="createposition" style="padding:20px;">\
					<table style="width: 100%" cellspacing="0" cellpadding="0" id="Operationcenter-table">\
						<tr>\
							<td colspan="2" style="border-bottom:#ccc 1px solid;padding-bottom:20px;">\
								<div class="btn btn-info btn-lg" name="orga_rename_btn" ondblclick="orga_rename(this)" id="orgaid_'+ielem.id+'">'+ielem.organame+'-职位和权限设置</div>\
								<span style="width:300px;float:right; text-align:right;">\
									<button id="menusave_'+ielem.id+'" class="btn btn-primary btn-lg" style="display:none;">保存</button>\
									<button id="menucancel_'+ielem.id+'"class="btn btn-warning btn-lg" style="display:none;">取消</button>\
									<button class="btn btn-danger btn-lg" name="orga_del_btn" onclick="orga_del(\''+ielem.id+'\')">删除架构</button>\
								</span>\
							</td>\
						</tr>\
						<tr>\
							<td style="border-right:1px solid #ccc;padding:10px;width:30%;" valign="top">\
								<div class="tabtopfont" style="margin-bottom:20px;">组织架构的职位</div>\
								<div id="Operation-center" style="vertical-align:top">\
								  <div align="center">';
        // console.log(data.data.jobList);
        $(data.data.jobList).each(function(k,kelem){
          // console.log(kelem);
          if(kelem.orgaid == ielem.id){
          Operation_center_html +='\
                      <div class="btn btn-default btn-lg" name="job_Auth_display_btn" style="width:88%" id="job_select_'+kelem.id+'" onclick="job_Auth_display(\''+kelem.id+'\',\''+ielem.id+'\')" ondblclick="job_rename(this,\''+kelem.id+'\',\''+ielem.id+'\')">'+kelem.jobname+'</div>\
                      <div class="btn btn-default btn-lg" name="job_del_btn" style="width:10%" onclick="job_del(\''+kelem.id+'\')">X</div>';
          }
        });
        Operation_center_html +='</div> \
								</div>\
								<div><button name="job_add_btn" class="btn btn-primary btn-lg" style="width:99%;font-size:18px;" data-toggle="modal" data-target="#job_add_'+i+'">+创建新职位</button></div>\
								<!--模态框（Modal）-->\
								<div class="modal fade" id="job_add_'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabe" aria-hidden="true">\
									<div class="modal-dialog">\
											<div class="modal-content">\
														<div class="modal-header active" style="background-color:#428bca;color:#fff;">\
																<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">&times;</button>\
																<h4 class="modal-title" id="myModalLable" style="color:#fff;">请输入新的职位名称</h4>\
														</div>\
														<div class="modal-body">\
															<input id="Job_add_input_'+i+'" type="text" style="width:96%;margin:0 auto;height:40px;" placeholder="请输入新的职位名称"/>\
														</div>\
														<div class="modal-footer">\
																<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>\
																<button type="button" class="btn btn-primary" onclick="Job_add_input_btn(\''+ielem.id+'\','+i+')">提交职位</button>\
														</div>\
												</div>\
										</div>\
								</div>\
							</td>\
							<td style="padding:10px;width:70%;padding-left:30px;">\
                <div class="text_div">提示：点击左边职位展示权限管理树状图，切换职位没按“保存”按钮将会数据丢失！</div>\
								<div class="content_wrap">\
									<div class="zTreeDemoBackground left">\
										<ul id="treeDemo" class="ztree" name="'+ielem.id+'" style="display:none;"></ul>\
									</div>\
									<div style="display:none;">\
											<input type="checkbox" id="py" class="checkbox first" checked /><span></span>\
											<input type="checkbox" id="sy" class="checkbox first" checked /><span>关联子</span><br/>\
											<input type="checkbox" id="pn" class="checkbox first" checked /><span></span>\
											<input type="checkbox" id="sn" class="checkbox first" checked /><span>关联子</span><br/>\
									</div>\
							</td>\
						</tr>\
					</table>\
				</div>';
      });
      $('#Orga_list_div').html(Operation_center_html);
      var zNodes =[];
      // console.log(data.data.menuList);
      $(data.data.menuList).each(function(o,oelem){
        // console.log(oelem);
        var oelemlist = {};
        oelemlist.id = oelem.id;
        oelemlist.pId = oelem.parentid;
        oelemlist.name = oelem.menuname;
        oelemlist.open = true;
        // console.log(oelemlist);
        zNodes.push(oelemlist);
      });
      // console.log(zNodes);

      //加载树状JS要用jquery1.4.4
      jQuery_1_4_4(
        function(){
          // $.fn.zTree.init($("#treeDemo"), setting, zNodes);
          $.fn.zTree.init($(".ztree"), setting, zNodes);
          setCheck();
          $("#py").bind("change", setCheck);
          $("#sy").bind("change", setCheck);
          $("#pn").bind("change", setCheck);
          $("#sn").bind("change", setCheck);
        }
      );
    }else{
      alert(data.msg);
    }
  });

  //权限管理适配开始
  setTimeout('menu()',200);
  //权限管理适配结束
});

//添加组织架构按钮
function Orga_add_input_btn(){
  // console.log($('input[name=Orga_add_input]')[0].value);
  var post_data = new FormData();
  post_data.append('organame', $('input[name=Orga_add_input]')[0].value);
  http.postAjax_clean("/photo-album/job/addOrga", post_data,function(data) {
    // console.log(data);
    if(data.code == 0){
      $('input[name=Orga_add_input]')[0].value = '';
      location.reload();
    }else{
      alert(data.msg);
    }
  });
}

//更换组织架构名称双击按钮
function orga_rename(thiselem){
  // console.log(thiselem);
  var thiselem_id = ($(thiselem)[0].id).split('orgaid_')[1];
  var thiselem_text = ($(thiselem)[0].innerText).split('-')[0];
  // console.log(thiselem_text);
  $(thiselem).replaceWith('<input class="btn btn-warning btn-lg" id="input_'+thiselem_id+'" name="Text1" type="text" value="'+thiselem_text+'" onblur="orga_rename_onblur(\''+thiselem_id+'\',this)"/>');
  $('#input_'+thiselem_id).focus();
}

//更换组织架构名称事件
function orga_rename_onblur(elem,thiselem){
  var post_data = new FormData();
  post_data.append('id', elem);
  post_data.append('organame', $(thiselem)[0].value);
  http.postAjax_clean("/photo-album/job/updateOrga", post_data,function(data) {
    if(data.code == 0){
      location.reload();
    }else{
      alert(data.msg);
    }
  });
}

//删除组织架构事件
function orga_del(elem){
  if(confirm('确认删除此架构？')){
    var post_data = new FormData();
    post_data.append('id', elem);
    http.postAjax_clean("/photo-album/job/deleteOrga", post_data,function(data) {
      if(data.code == 0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}

//添加职位事件
function Job_add_input_btn(elem,tempi){
  var jobname = $('#Job_add_input_'+tempi)[0].value;
  var post_data = new FormData();
  post_data.append('jobname', jobname);
  post_data.append('orgaid', elem);
  http.postAjax_clean("/photo-album/job/addJob", post_data,function(data) {
    if(data.code == 0){
      location.reload();
    }else{
      alert(data.msg);
    }
  });
}

//删除职位事件
function job_del(elem){
  if(confirm('确认删除此职位？')){
    var post_data = new FormData();
    post_data.append('id', elem);
    http.postAjax_clean("/photo-album/job/deleteJob", post_data,function(data) {
      if(data.code == 0){
        location.reload();
      }else{
        alert(data.msg);
      }
    });
  }
}

//修改职位名称双击更换输入框事件
function job_rename(thiselem,elem,orgaid){
  var thiselem_id = ($(thiselem)[0].id).split('job_select_')[1];
  var thiselem_text = $(thiselem)[0].innerText;
  $(thiselem).replaceWith('<input class="btn btn-warning btn-lg" id="input_'+thiselem_id+'" name="Text1" type="text" value="'+thiselem_text+'" onblur="job_rename_onblur(\''+thiselem_id+'\',this,\''+orgaid+'\')"/>');
  $('#input_'+thiselem_id).focus();
}

//修改职位名称事件
function job_rename_onblur(idelem,thiselem,orgaid){
  // console.log(idelem);
  // console.log(thiselem);
  var post_data = new FormData();
  post_data.append('id', idelem);
  post_data.append('jobname', $(thiselem)[0].value);
  post_data.append('orgaid', orgaid);
  http.postAjax_clean("/photo-album/job/updateJob", post_data,function(data) {
    if(data.code == 0){
      location.reload();
    }else{
      alert(data.msg);
    }
  });
}

//显示职位相对应权限
function job_Auth_display(elem,prid){
  // console.log($('#job_select_'+elem));
  $('div[name=job_Auth_display_btn]').each(function(i,ielem){
    // console.log(ielem.id);
    if(ielem.id == 'job_select_'+elem){
      // console.log($(ielem));
      ielem.className = 'btn btn-info btn-lg';
    }else{
      // console.log($(ielem));
      ielem.className = 'btn btn-default btn-lg';
    }
  })

  $('button').each(function(p,pelem){
    if($(pelem)[0].innerText == "保存" || $(pelem)[0].innerText == "取消"){
      $(pelem).hide();
    }
  });
  $('.ztree').each(function(o,oelem){
    $(oelem).hide();
  });
  $('ul[name='+prid+']').show();
  $('#menusave_'+prid).replaceWith('<button id="menusave_'+prid+'" name="menu_save" class="btn btn-primary btn-lg" onclick="menu_save(\''+elem+'\',\''+prid+'\')">保存</button>');
  $('#menucancel_'+prid).replaceWith('<button id="menucancel_'+prid+'" name="menu_cancel" class="btn btn-warning btn-lg" onclick="menu_cancel(\''+elem+'\',\''+prid+'\')">取消</button>');
  $('#menusave_'+prid).show();
  $('#menucancel_'+prid).show();
  var post_data = new FormData();
  post_data.append('jobid', elem);
  http.postAjax_clean("/photo-album/job/getAuthMenu", post_data,function(data) {
    var zNodes =[];
    http.getAjax_clean("/photo-album/job/getListFull", function(fulldata) {
      $(fulldata.data.menuList).each(function(o,oelem){
        var oelemlist = {};
        oelemlist.id = oelem.id;
        oelemlist.pId = oelem.parentid;
        oelemlist.name = oelem.menuname;
        oelemlist.open = true;
        oelemlist.checked = false;
        $(data.data).each(function(k,kelem){
          if(kelem.id == oelem.id){
            oelemlist.checked = true;
          }
        });
        zNodes.push(oelemlist);
      });
      jQuery_1_4_4(
        function(){
          $.fn.zTree.init($("ul[name="+prid+"]"), setting, zNodes);
          setCheck();
          $("#py").bind("change", setCheck);
          $("#sy").bind("change", setCheck);
          $("#pn").bind("change", setCheck);
          $("#sn").bind("change", setCheck);
          }
      );
    });

  });

    //权限管理适配开始
    setTimeout('menu()',200);
    //权限管理适配结束
}

//菜单根据职位ID保存项
function menu_save(elem,prid){
  // console.log(elem);
  // console.log($('ul[name='+elem+']'));
  // console.log($('ul[name='+elem+']').find('.chk'));
  var post_data = new FormData();
  post_data.append('jobid', elem);
  $($('ul[name='+prid+']').find('.chk')).each(function(i,ielem){
    // console.log($(ielem));
    if($(ielem)[0].className == 'button chk checkbox_true_part' || $(ielem)[0].className == 'button chk checkbox_true_full' || $(ielem)[0].className == 'button chk checkbox_false_part'){
      var promid = ($(ielem)[0].outerHTML).split('"')[1];
      // console.log(promid);
      post_data.append('menuids', promid);
    }
  })
  http.postAjax_clean("/photo-album/job/saveAuthMenu", post_data,function(data) {
    if(data.code == 0){
      // location.reload();
      alert("权限保存成功！")
    }else{
      alert(data.msg);
    }
  });
}

//职位权限“取消按钮”
function menu_cancel(elem,prid){
  job_Auth_display(elem,prid);
}
