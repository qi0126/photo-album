//用户登陆接口
function checkman_btn(){
	var post_data = new FormData();
	post_data.append('username', $("input[name=username]").val());
	post_data.append('password', $("input[name=password]").val());
	http.postAjax_clean("/photo-album/loginAjax", post_data,function(data) {
		if(data.code == 0){
			//保存登录用户名
			var lStorage=window.localStorage;
			lStorage.loginman = data.data.number;
			lStorage.loginmanId = data.data.sacuid;
			// console.log(data);
			// console.log(lStorage);
			//页面跳转
			top.location.href="/photo-album/web/index.html";
		}else{
			$('#login_error_text').show();
			$('#login_error_text').html('用户名或密码错误,请重新输入！');
		}
	});
}

//密码输入框回车执行
// document.onkeydown = function(e) {
// 		e = e || window.event;
// 		if(e.keyCode == 13) {
// 			checkman_btn();
// 		}
// }

//用户名按加车
function username_fun(event){
	var keyCode = event.keyCode?event.keyCode:event.which?event.which:event.charCode;
	// console.log(keyCode );
	if (keyCode ==13){
		// 此处处理回车动作
		// console.log($('input[name=password]'));
		$('input[name=password]').focus();
	}
}
//验证用户名和密码后台登陆
function password_fun(event){
	var keyCode = event.keyCode?event.keyCode:event.which?event.which:event.charCode;
	// console.log(keyCode );
	if (keyCode ==13){
		// 此处处理回车动作
		checkman_btn();
	}
}
