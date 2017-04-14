

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
    $("#isurl").hide();
    $("#istel").hide();
    $("#isaddress").hide();
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

http.getAjax_clean("/photo-album/index/get_botton_bar", function(data){
  //console.log(data.isurl);
  if(data.isurl==true){
    document.getElementById("isurl").checked=true;
  }else{
    document.getElementById("isurl").checked=false;
  }
  if(data.istel==true){
    document.getElementById("istel").checked=true;
  }else{
    document.getElementById("istel").checked=false;
  }
  if(data.isaddress==true){
    document.getElementById("isaddress").checked=true;
  }else{
    document.getElementById("isaddress").checked=false;
  }
});

$(function(){
	logolist();
});

function logolist(){
	var logolist_html='';
	http.getAjax_clean("/photo-album/index/get_botton_bar", function(data){
    // console.log(data.isopen);
		// console.log(data.isopen);
    if (data.isopen) {
      document.getElementById("foot_checkbox").checked=true;
      // $("#display_logo").show();
      $("#pageurl").removeAttr("disabled");
      $("#telnumber").removeAttr("disabled");
      $("#address").removeAttr("disabled");
      $("#isurl").show();
      $("#istel").show();
      $("#isaddress").show();
    }else{
      document.getElementById("foot_checkbox").checked=false;
      // $("#display_logo").hide();
      $("#pageurl").attr("disabled","disabled");
      $("#telnumber").attr("disabled","disabled");
      $("#address").attr("disabled","disabled");
      $("#isurl").hide();
      $("#istel").hide();
      $("#isaddress").hide();
    }
		logolist_html='<img src="/photo-album/index/image_logo/'+data.image+'" width="720px" height="125px"/>';
		$("#logoimg").html(logolist_html);
		$("#pageurl").val(data.url);
		$("#telnumber").val(data.tel);
		$("#address").val(data.address);
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

function isurl(elem){
  if(elem.checked){
    var post_data = new FormData();
    post_data.append("isurl",1);
    http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
      if(data["state"]==true){
        $("#datasavesuccess_btn").show();
        setTimeout("$('#datasavesuccess_btn').hide();location.reload();",2000);
      }
    });
  }else{
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
function isurl(elem){
  if((!$("#isurl")[0].checked)&&(!$("#istel")[0].checked)&&(!$("#isaddress")[0].checked)){
    foot_display(!$("#foot_checkbox")[0]);
    document.getElementById("isurl").checked=true;
    document.getElementById("foot_checkbox").checked=false;
  }else{
    if(elem.checked){
      var post_data = new FormData();
      post_data.append("isurl",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
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
    foot_display(!$("#foot_checkbox")[0]);
    document.getElementById("istel").checked=true;
    document.getElementById("foot_checkbox").checked=false;
  }else{
    if(elem.checked){
      var post_data = new FormData();
      post_data.append("istel",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
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
    foot_display(!$("#foot_checkbox")[0]);
    document.getElementById("isaddress").checked=true;
    document.getElementById("foot_checkbox").checked=false;
    // location.reload();
  }else{
    if(elem.checked){
      var post_data = new FormData();
      post_data.append("isaddress",1);
      http.postAjax_clean("/photo-album/index/set_botton_flag", post_data,function(data){
        if(data["state"]==true){
          $("#datasavesuccess_btn").show();
          setTimeout("$('#datasavesuccess_btn').hide()",2000);
        }
      });
    }else{
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
