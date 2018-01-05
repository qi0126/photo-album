

function foot_display(elem){
  if(elem.checked){
      // $("#display_logo").show();
      $("#isurl").show();
      $("#istel").show();
      $("#isaddress").show();
      $("#pageurl").removeAttr("disabled");
      $("#telnumber").removeAttr("disabled");
      $("#address").removeAttr("disabled");
      var post_data = new FormData();
      post_data.append("isopen",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        // console.log(data);
      });
  }
  else{
    // $("#isurl").hide();
    // $("#istel").hide();
    // $("#isaddress").hide();
      // $("#display_logo").hide();
      $("#pageurl").attr("disabled","disabled");
      $("#telnumber").attr("disabled","disabled");
      $("#address").attr("disabled","disabled");
      var post_data = new FormData();
      post_data.append("isopen",0);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        // console.log(data);
      });
  }
}
$(function(){
	logolist();

  //权限管理适配开始
  setTimeout(function(){
   var lStorage=window.localStorage;
  var NoAuthMenu_data = JSON.parse(lStorage.NoAuthMenu_data);
  // console.log(NoAuthMenu_data);
    $(NoAuthMenu_data).each(function(o,oelem){
      if(oelem.type == 1){
        // console.log(oelem.menuname);
        switch (oelem.menuname) {
          // 编辑跳转主页
          case '开启联系我们':
            // console.log(oelem);
            $('#contactus_tf_div').hide();
            // $('#isurl').hide();
            // $('#pageurl').attr("disabled","false");
            break;
          // 编辑跳转主页
          case '编辑跳转主页':
            // console.log(oelem);
            $('#isurl').hide();
            $('#pageurl').attr("disabled","false");
            break;
          //编辑拨打电话
          case '编辑拨打电话':
            $('#istel').hide();
            $('#telnumber').attr("disabled","false");
            break;
          //编辑导航地址
          case '编辑导航地址':
            $('#isaddress').hide();
            $('#address').attr("disabled","false");
            break;
        }
      }
    });
  },200);
  //权限管理适配结束

});

function logolist(){
	var logolist_html='';
	http.getAjax_clean("/photo-album/index/get_botton_bar", function(data){
    // console.log(data);
    // console.log(data.isopen);
		// console.log(data.isopen);
    if (data.isopen) {
      // document.getElementById("foot_checkbox").checked=true;
      // $("#display_logo").show();
      $("#pageurl").removeAttr("disabled");
      $("#telnumber").removeAttr("disabled");
      $("#address").removeAttr("disabled");
      // $("#isurl").show();
      // $("#istel").show();
      // $("#isaddress").show();
    }else{
      // document.getElementById("foot_checkbox").checked=false;
      // $("#display_logo").hide();
      $("#pageurl").attr("disabled","disabled");
      $("#telnumber").attr("disabled","disabled");
      $("#address").attr("disabled","disabled");
      // $("#isurl").hide();
      // $("#istel").hide();
      // $("#isaddress").hide();
    }
		// logolist_html='<img src="/photo-album/index/image_logo/'+data.image+'" width="720px" height="125px"/>';
		// $("#logoimg").html(logolist_html);
    // console.log(data.isurl);
    if(data.isurl==true){
      document.getElementById("isurl").checked=true;
      $("#pageurl").removeAttr("disabled");
    }else{
      document.getElementById("isurl").checked=false;
      $("#pageurl").attr("disabled","disabled");
    }
    if(data.istel==true){
      document.getElementById("istel").checked=true;
      $("#telnumber").removeAttr("disabled");
    }else{
      document.getElementById("istel").checked=false;
      $("#telnumber").attr("disabled","disabled");
    }
    if(data.isaddress==true){
      document.getElementById("isaddress").checked=true;
      $("#address").removeAttr("disabled");
    }else{
      document.getElementById("isaddress").checked=false;
      $("#address").attr("disabled","disabled");
    }
		$("#pageurl").val(data.url);
		$("#telnumber").val(data.tel);
		$("#address").val(data.address);

		if(data.isSale == '1'){
			document.getElementById("isCallSaller").checked=true;
		}else{
			document.getElementById("isCallSaller").checked=false ;
		}

	});
}
//上传图片
function uploadFile(){
	var upload_file =document.getElementById("upload").files[0];
	// console.log(upload_file);
  if(upload_file){
  	var post_data = new FormData();
  	post_data.append("file",upload_file);
  	http.postAjax_clean("/photo-album/index/update_logo_image", post_data,function(data){
  		if(data["state"]==true){
  			alert("图片上传成功！");
  			location.reload();
  		}else{
  			alert("图片上传失败！");
  		}
  	});
  }else{
    alert("未选择图片文件,请重新选择！");
  }
}
//修改地址
function changeadd(elem){
	var post_data = new FormData();
	post_data.append("address",elem.value);
	http.postAjax_clean("/photo-album/index/set_botton_bar", post_data,function(data){
		if(data["state"]==true){
			//alert("地址导航修改成功！");
      $("#datasavesuccess_btn").show();
      setTimeout("$('#datasavesuccess_btn').hide();location.reload();",2000);
		}else{
			alert("地址导航修改成功！");
		}
	});
}
//修改联系电话
function changetel(elem){
	var post_data = new FormData();
	post_data.append("tel",elem.value);
	http.postAjax_clean("/photo-album/index/set_botton_bar", post_data,function(data){
		if(data["state"]==true){
			//alert("修改联系电话成功！");
      $("#datasavesuccess_btn").show();
      setTimeout("$('#datasavesuccess_btn').hide();location.reload();",2000);
		}else{
			alert("修改联系电话成功！");
		}
	});
}
//修改主页地址
function changeurl(elem){
	var post_data = new FormData();
	post_data.append("url",elem.value);
	http.postAjax_clean("/photo-album/index/set_botton_bar", post_data,function(data){
		if(data["state"]==true){
      $("#datasavesuccess_btn").show();
      setTimeout("$('#datasavesuccess_btn').hide();location.reload();",2000);
		}else{
			// alert("修改主页URL成功！");
		}
	});
}

function isCallSaller(elem){
		var isChecked = $(elem)[0].checked ? 1 : 0;
		var post_data = new FormData();
		post_data.append("isSale",isChecked);
		http.postAjax_clean("/photo-album/index/set_botton_bar", post_data ,function(data){
	//		if(data["state"]==true){
	//    $("#datasavesuccess_btn").show();
	//    setTimeout("$('#datasavesuccess_btn').hide();location.reload();",2000);
	//		}else{
	//			// alert("修改主页URL成功！");
	//		}
		});
}

//
function isurl(elem){
  if((!$("#isurl")[0].checked)&&(!$("#istel")[0].checked)&&(!$("#isaddress")[0].checked)){
    $("#pageurl").attr("disabled","disabled");
    $("#telnumber").attr("disabled","disabled");
    $("#address").attr("disabled","disabled");
    var post_data = new FormData();
    post_data.append("isurl",0);
    post_data.append("isopen",0);
    http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
      if(data["state"]==true){
        $("#datasavesuccess_btn").show();
        setTimeout("$('#datasavesuccess_btn').hide()",2000);
      }
    });
  }else{
    if(elem.checked){
      $("#pageurl").removeAttr("disabled");
      // document.getElementById("telnumber").disabled=true;
      var post_data = new FormData();
      post_data.append("isurl",1);
      post_data.append("isopen",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
      $("#pageurl").attr("disabled","disabled");
      var post_data = new FormData();
      post_data.append("isurl",0);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }
  }
}
function istel(elem){
  if((!$("#isurl")[0].checked)&&(!$("#istel")[0].checked)&&(!$("#isaddress")[0].checked)){
    $("#pageurl").attr("disabled","disabled");
    $("#telnumber").attr("disabled","disabled");
    $("#address").attr("disabled","disabled");
    var post_data = new FormData();
    post_data.append("istel",0);
    post_data.append("isopen",0);
    http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
      if(data["state"]==true){
        $("#datasavesuccess_btn").show();
        setTimeout("$('#datasavesuccess_btn').hide()",2000);
      }
    });
  }else{
    if(elem.checked){
      // console.log("aaaaa");
      $("#telnumber").removeAttr("disabled");
      var post_data = new FormData();
      post_data.append("istel",1);
      post_data.append("isopen",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
      $("#telnumber").attr("disabled","disabled");
      var post_data = new FormData();
      post_data.append("istel",0);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }
  }
}
function isaddress(elem){
  if((!$("#isurl")[0].checked)&&(!$("#istel")[0].checked)&&(!$("#isaddress")[0].checked)){
    $("#pageurl").attr("disabled","disabled");
    $("#telnumber").attr("disabled","disabled");
    $("#address").attr("disabled","disabled");
    var post_data = new FormData();
    post_data.append("isaddress",0);
    post_data.append("isopen",0);
    http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
      if(data["state"]==true){
        $("#datasavesuccess_btn").show();
        setTimeout("$('#datasavesuccess_btn').hide()",2000);
      }
    });
  }else{
    if(elem.checked){
      $("#address").removeAttr("disabled");
      var post_data = new FormData();
      post_data.append("isaddress",1);
      post_data.append("isopen",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
      $("#address").attr("disabled","disabled");
      var post_data = new FormData();
      post_data.append("isaddress",0);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }
  }
}
