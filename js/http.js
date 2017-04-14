var http = {
	//Ajax的get请求方法
	getAjax_clean: function(url, cb){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: function(data, status, xhr){
				cb(data);
			},
			error: function(data){
				// alert('与服务器通信发生异常');
			}
		});
	},
	//Ajax的post请求方法
	postAjax_clean: function(url, post_data, cb){
		$.ajax({
			url: url,
			type: 'POST',
			data: post_data,
			async: true,
			cache: false,
			contentType: false, //告诉jQuery不要去设置Content-Type请求头
			processData: false, //告诉jQuery不要去处理发送的数据
			success: function(data, status, xhr){
				cb(data);
			},
			error: function(data){
				// alert('与服务器通信发生异常');
			}
		});
	},
	//Ajax的post同步请求方法
	postAjax_synchro_clean: function(url, post_data, cb){
		$.ajax({
			url: url,
			type: 'POST',
			data: post_data,
			async: false,
			cache: false,
			contentType: false, //告诉jQuery不要去设置Content-Type请求头
			processData: false, //告诉jQuery不要去处理发送的数据
			success: function(data, status, xhr){
				cb(data);
			},
			error: function(data){
				// alert('与服务器通信发生异常');
			}
		});
	},
	//Ajax的get请求方法传送e的元素
	getAjax: function(e, url, cb){
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			beforeSend: function(xhr, settings){
				$(e.target).attr('disabled', 'disabled');
			},
			success: function(data, status, xhr){
				$(e.target).removeAttr('disabled');
				cb(data);
			},
			error: function(data){
				$(e.target).removeAttr('disabled');
				// alert('与服务器通信发生异常');
			}
		});
	},
	//Ajax的get请求方法传送e的元素
	postAjax: function(e, url, post_data, cb){
		$.ajax({
			url: url,
			type: 'POST',
			data: post_data,
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(xhr, settings){
				$(e.target).attr('disabled', 'disabled');
			},
			success: function(data, status, xhr){
				$(e.target).removeAttr('disabled');
				cb(data);
			},
			error: function(data){
				$(e.target).removeAttr('disabled');
				// alert('与服务器通信发生异常');
			}
		});
	}
};
