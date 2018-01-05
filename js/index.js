$(function(){
  //登录用户名
  var lStorage=window.localStorage;
  // console.log(lStorage);
  if(lStorage.loginman){
    $("#loginman_text").html("欢迎你,"+lStorage.loginman);
  }

  var iframe_tf = true;
  http.getAjax_clean("/photo-album/job/getAuthMenuCurrUser", function(data) {
    var menu_ul_html ='<div class="panel-group" id="accordion">';
    $(data.data).each(function(i,ielem){
      if(ielem.menuurl != null && iframe_tf){
        $('#iframe-main').attr("src", "/photo-album"+ielem.menuurl)
        iframe_tf = false;
      }

      if(ielem.parentid == 0){
        if(ielem.menuurl == null){
          menu_ul_html +='\
          <div class="panel panel-default">\
              <a data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'" onclick="a_onclick('+i+')">\
                <div class="panel-heading">\
                    <h4 class="panel-title">\
                          '+ielem.menuname+'\
                          <span style="float:right;" id="icon_span_'+i+'"><img src="../images/xia@2x.png" /></span>\
                    </h4>\
                </div>\
              </a>\
              <div id="collapse'+i+'" class="panel-collapse collapse urlmenu">\
                <ul class="list-group" id="list_group_'+i+'">';
                // console.log(data.data);
                  $(data.data).each(function(j,jelem){
                    if(jelem.parentid==ielem.id){
                      // console.log(jelem.menuurl);
                      if(jelem.menuurl != null){
                        if(jelem.menuurl == "/web/edit_product.html"){
                          menu_ul_html +='<a href="/photo-album'+jelem.menuurl+'?pro_tmpid=null" target="iframe-main" onclick="urlmenu(this)"><li class="list-group-item"> <img src="../images/line@2x.png"/> '+jelem.menuname+'</li></a>';
                        }else{
                          menu_ul_html +='<a href="/photo-album'+jelem.menuurl+'" target="iframe-main" onclick="urlmenu(this)"><li class="list-group-item" onclick="urlmenu(this)"> <img src="../images/line@2x.png"/> '+jelem.menuname+'</li></a>';
                        }
                      }else{
                        // menu_ul_html +='<li class="list-group-item">'+jelem.menuname+'</li>';
                      }
                    }
                  });
          menu_ul_html +='\
                </ul>\
              </div>\
          </div>\
          ';
        }else{
          menu_ul_html +='<div class="panel panel-default nourlmenu" >\
            <a href="/photo-album'+ielem.menuurl+'" target="iframe-main" onclick="nourlmenu(this)">\
              <div class="panel-heading">\
                  <h4 class="panel-title">\
                        '+ielem.menuname+'\
                  </h4>\
              </div>\
            </a>\
          </div>';
        }
      }
    });
    menu_ul_html +='</div>';
    $('#newmenu').html(menu_ul_html);
  });
  //添加没有权限数据
  http.getAjax_clean("/photo-album/job/getNoAuthMenuCurrUser", function(data) {
    lStorage.NoAuthMenu_data = JSON.stringify(data.data);
  });
});

//点击一级菜单出现蓝色
function nourlmenu(thiselem){
  $('.nourlmenu').each(function(i,ielem){
    $(ielem).css("backgroundColor","#2e363f");
  });
  $('.list-group-item').each(function(i,ielem){
    $(ielem).css("backgroundColor","#1e242b");
  });
  $($(thiselem)[0].parentElement).css("backgroundColor","#27a9e3");
}

//点击二级菜单变绿色
function urlmenu(thiselem){
  $('.nourlmenu').each(function(i,ielem){
    $(ielem).css("backgroundColor","#2e363f");
  });
  $('.list-group-item').each(function(i,ielem){
    $(ielem).css("backgroundColor","#1e242b");
  });
  $($(thiselem)[0].firstElementChild).css("backgroundColor","#28b779");
}


//折叠菜单更换icon
function a_onclick(elem){
  setTimeout(function(){
    $(".panel-collapse").each(function(i,ielem){
      var tempid = (ielem.id).split('collapse')[1];
      if($(ielem)[0].attributes[2].value == 'false'){
        $("#icon_span_"+tempid).html('<img src="../images/xia@2x.png" />');
      }else{
        $("#icon_span_"+tempid).html('<img src="../images/shang@2x.png" />');
      }
    });
  },0);
}
