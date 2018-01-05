// 产品库

// var isSearchSuccess = true;

var ERR_OK = 0;
var websocket = null;
var localurl = document.location.href.split("/")[2];
//导入产品个数
var pro_num = 0;
var error_display_html = '';
var error_display_number = 0;

/**
 * 初始化函数
 */
$(function () {
	$('.myDate').datetimepicker(); // 绑定日期控件绑定日期控件
	getAllKind(); // 加载所有分类信息
	getProByIndex(); // 默认加载第一页
	custLikely(); // 用户偏好设置
	reconnect();
})

/**
 * 事件绑定
 */
// 编辑
$('.detail').on('click', '.edit', function () {
	sessionStorage.setItem('pronumber', $(this).closest('tr').data('pronumber'));
	$('#editDetail').show();
	$('#editDetail iframe').attr('src', 'edit_product.html');
	$('html, body').animate({ scrollTop: 0 }, 100);
	setTimeout(function(){
		var iframe = $('#iframepage')[0];
		var bHeight = iframe.contentWindow.document.body.scrollHeight;
		// console.log(bHeight);
		$(iframe).height(bHeight);

	},400);


});

// 全选
$('.detail table').on('click','.selectAll', function () {
	var isChecked = $(this).is(":checked");
	var $childCheckboxs = $('.detail tbody .select');
	if (isChecked) {
		$childCheckboxs.prop('checked', true);
	} else {
		$childCheckboxs.removeAttr("checked");
	}
});

// 单个产品删除
$('.detail').on('click', '.delete', function () {
	var isComfirm = confirm('是否删除？');
	if (isComfirm) {
		var pronumber = $(this).closest('tr').data('pronumber');
		var numbers = [pronumber];
		batchDelete(numbers);
	}
});

// 批量删除
$('.batchDelete').on('click', function () {
	var $checked = $('.detail tbody .select:checked');
	if ($checked.length > 0) {
		var isComfirm = confirm('是否删除？');
		if (isComfirm) {
			var numbers = [];
			$.each($checked, function (key, item) {
				var pronumber = $(item).closest('tr').data('pronumber');
				numbers.push(pronumber);
			});
			batchDelete(numbers);
		}
	} else {
		alert('您还未选中删除产品');
	}
});

// 搜索
$('.search .searchBtn').on('click', function () {
	searchResult();
});

// 状态切换搜索
$('.state select').on('change', function () {
	searchResult();
});

// 开始日期，结束日期失焦搜索
$('.date .start').on('blur', function () {
	searchResult();
});
$('.date .end').on('blur', function () {
	searchResult();
});

// 页面显示数量
$('.pageDesc select').on('change', function () {
	var count = $(this).find('option:selected').val();
	localStorage.setItem('countByPager', count);
	searchResult();
});

// 上下架切换
$('.detail').on('click', '.isSxj', function () {
	var $this = $(this);

	var number = $this.data('number');
	var isonline = $this.hasClass('active') ? true : false;

	var post_data = new FormData();
	post_data.append('number', number);
	post_data.append('isonline', isonline);
	http.postAjax_clean("/photo-album/product/set_offline_and_online", post_data, function (res) {
		var errno = res.code;
		if (errno == ERR_OK) {
			if ($this.hasClass('active')) {
				$this.removeClass('active');
				$this.text('下架');
				$this.parent().prev().text('已上架');
			} else {
				$this.addClass('active');
				$this.text('上架');
				$this.parent().prev().text('已下架');
			}
		} else {
			alert(res.msg);
		}
	})
});

// 批量上/下架
$('.tab .left').on('click', '.plsxj', function () {
	var $checked = $('.detail tbody .select:checked');
	if ($checked.length > 0) {
		$('#mysjx').modal();
	} else {
		alert('您还未选中产品');
	}
});

// 批量上/下架保存
$('#mysjx #save').on('click', function () {
	var $checked = $('.detail tbody .select:checked');
	var numbers = [];
	$.each($checked, function (key, item) {
		var pronumber = $(item).closest('tr').data('pronumber');
		numbers.push(pronumber);
	});
	numbers = JSON.stringify(numbers);
	var isonline = $(this).closest('#mysjx').find('input[name=sx]:checked').data('issxj');

	var post_data = new FormData();
	post_data.append("list", numbers);
	post_data.append("isonline", isonline);
	http.postAjax_clean("/photo-album/product/set_offline_and_online_with_list", post_data, function (res) {
		var errno = res.code;
		if (errno == ERR_OK) {
			searchResult();
			$('#mysjx').modal('hide');
		} else {
			alert(res.msg);
		}
	});
});

// 批量添加到推广类别
$('.addProToKind').on('click', function () {
	var $checked = $('.detail tbody .select:checked');
	if ($checked.length > 0) {
		http.getAjax_clean('/photo-album/manger/get_products', function (res) {
			var html = '';
			if (res.length > 0) {
				$.each(res, function (key, obj) {
					html += `<tr>
                    <td style="width:130px;text-align:right;" valign="top">
                      <input type="radio" name="changeKind${obj.id}" class="${obj.id}">${obj.productsname}：
                    </td>
                    <td>【`;
					var products = obj.products;
					$.each(products, function (key, item) {
						html += `<input type="radio" name="changeKind${obj.id}" class=${item.productId}>${item.name}`;
					});
					html += `】</td>
                  </tr>`;
				});
				$('#changeKind .kind table').html(html);
			}
		})
		$('#changeKind').modal();
	} else {
		alert('请先选择产品');
	}
});

// 批量添加到推广类别保存
$('#changeKind #save').on('click', function () {
	var $checked = $('.detail tbody .select:checked');
	var numbers = []; // 被选的产品数组
	$.each($checked, function (key, item) {
		var pronumber = $(item).closest('tr').data('pronumber');
		numbers.push(pronumber);
	});

	var $kindChecked = $('#changeKind .kind input[type=radio]:checked'); // 被选的类别
	if ($kindChecked.length > 0) {
		var kinds = []; // 被选的类别数组
		$.each($kindChecked, function (key, item) {
			var id = $(item).attr('class');
			kinds.push(id);
		});

		var param = {
			'linkids': kinds,
			'products': numbers
		}
		param = JSON.stringify(param);
		var post_data = new FormData();
		post_data.append('param', param);
		http.postAjax_clean("/photo-album/product/save_poduct_classify", post_data, function (res) {
			alert(res.msg);
			$('#changeKind').modal('hide');
		})
	}else{
		alert('您还未选择推广类别');
	}

});

// 刷新产品库
$('.tab .left .refresh').on('click', function () {
	var $this = $(this);
	var msg = "list#";
	if (websocket.readyState == websocket.OPEN) {
		websocket.send(msg);//调用后台handleTextMessage方法
	} else {
		if (websocket.readyState == 0) {
			alert("websocket已断开，请稍等会再试！");
		}
		reconnect();
	}
});


/**
 * 函数定义
 */
function batchDelete(numbers) {
	var list = JSON.stringify(numbers);
	var post_data = new FormData();
	post_data.append("list", list);
	http.postAjax_clean("/photo-album/product/product_delete_with_list", post_data, function (res) {
		var errno = res.code;
		if (errno == ERR_OK) {
			searchResult();
		} else {
			alert(res.msg);
		}
	});
}

function onOpen(openEvt) {
	//alert(openEvt.Data);
}
function onMessage(evt) {
	if (evt.data) {
		$("#addwindow").show();
	}
	// console.log(evt.data);
	if (JSON.parse(evt.data).type == true) {
		pro_num++;
	}
	if (JSON.parse(evt.data).total != -2) {
		var percent = parseInt((JSON.parse(evt.data).done + 1) / (JSON.parse(evt.data).total) * 100);
		var pro_number = JSON.parse(evt.data).total;
	} else {
		var percent = 0;
		var pro_number = 0;
	}
	// console.log(JSON.parse(evt.data).done);
	if ((JSON.parse(evt.data).done) != JSON.parse(evt.data).total) {
		// console.log(percent+'%');
		$("#loader").html('\
			<div style="text-align:right;padding-right:30px;padding-top:30px;">\
				<button type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
			</div>\
				<div class="progress progress-striped active">\
					<div class="progress-bar progress-bar-success" role="progressbar"\
						 aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"\
						 style="width: '+ percent + '%;">\
						<span class="sr-only">'+ percent + '% 完成</span>\
					</div>\
				</div>\
				<div><h1>'+ percent + '% 完成</h1></div>\
				<div id="percentId" >\
					<h3>共有'+ pro_number + '个产品，已经处理了' + pro_num + '个产品,导入异常有<span style="color:red">' + error_display_number + '</span>个。</h3><br/>\
				</div>\
				<div id="error-display" style="overFlow:auto;max-height:300px;width:96%;"></div><br/>\
			');
	} else {
		$("#loader").html('\
			<div style="text-align:right;padding-right:30px;padding-top:30px;">\
				<button type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
			</div>\
			<img src="../images/succes.png" height="80px"/>\
			<h3 style="margin:0 auto;display:none;">'+ pro_num + '款产品已导入,导入异常有<span style="color:red">' + error_display_number + '</span>个！</h3><br/>\
			<h3 style="margin:0 auto;color:#de7a0e;">'+ JSON.parse(evt.data).message + '</h3><br/>\
			<div>\
				<div id="error-display" style="overFlow:auto;max-height:300px;width:96%;">\
			</div><br/>\
			');
	}



	// 	console.log(JSON.parse(evt.data).message);
	if (JSON.parse(evt.data).type == false) {
		// console.log(JSON.parse(evt.data).message);
		if (JSON.parse(evt.data).total == -2 || JSON.parse(evt.data).total == -1) {
			error_display_html += '<div style="text-align:left;padding-left:40px;color:blue;">' + JSON.parse(evt.data).message + '</div>';
		} else {
			error_display_number++;
			error_display_html += '<div style="text-align:left;padding-left:40px;color:red;">' + JSON.parse(evt.data).message + '</div>';
		}
	}
	if (JSON.parse(evt.data).message == "ftp路径错误") {
		error_display_html += '<div style="padding-right:30px;padding-top:30px;">\
			<button id="ftp_error_closewin_btn" type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
		</div>';
		$('#percentId').html('<h4 style="color:red;">ftp路径错误,产品没有导入成功，请点击下方“关闭”按钮！</h4>');
	}
	if (JSON.parse(evt.data).message == "ftp中未发现excel文件，请上传产品！") {
		error_display_html += '<div style="padding-right:30px;padding-top:30px;">\
			<button id="ftp_nofindexcel_closewin_btn" type="button" class="btn btn-warning" onclick="location.reload();">关 闭</button>\
		</div>';
		$('#percentId').html('<h4 style="color:red;">ftp中未发现execl文件,产品没有导入成功，请点击下方“关闭”按钮！</h4>');
	}
	$('#error-display').html(error_display_html);
	var div = document.getElementById('error-display');
	div.scrollTop = div.scrollHeight;

	// console.log(JSON.parse(evt.data).total+':'+JSON.parse(evt.data).done);
}
function onError() { }
function onClose() {
	setTimeout(function () {
		reconnect()
	}, 1000);
}

function reconnect() {
	if ('WebSocket' in window) {
		websocket = new WebSocket("ws://" + localurl + "/photo-album/input_message");
	}
	else if ('MozWebSocket' in window) {
		websocket = new MozWebSocket("ws://" + localurl + "/photo-album/input_message");
	}
	else {
		websocket = new SockJS("ws://" + localurl + "/photo-album/input_message");
	}
	websocket.onopen = onOpen;
	websocket.onmessage = onMessage;
	websocket.onerror = onError;
	websocket.onclose = onClose;
}

// 搜索
function searchResult() {
	if (searchVerify()) {
		var searchParams = getSearchParams();
		var page = searchParams.page; // 缓存page
		searchParams.page = 1; // 默认加载第一页
		var getProUrls = $.param(searchParams);
		getPro(getProUrls).then(function (res) {
			if (res.page.length > 0) {
				showPager(res);  // 分页插件
			} else {
				searchParams.page = page;
			}
		});
	}
}

// 用户偏好缓存
function custLikely() {
	// 每页显示数量
	var pageCount = localStorage.getItem('countByPager')
	if (!pageCount) {
		localStorage.setItem('countByPager', 10);
	} else {
		$('.pageDesc select').val(pageCount);
		$(".pageDesc select").find("option[text='" + pageCount + "']").attr("selected", true);
	}
}

// 获取页面全部搜索条件
function getSearchParams() {

	var obj = {};

	var type = $('.search select option:selected').val(); // 分类
	if (type && type != '') {
		obj.type = type;
	}
	var isonline = $('.state option:selected').val(); // 是否上架
	if (isonline && isonline != '') {
		obj.isonline = isonline;
	}
	var starttime = $('.date .start').val(); // 开始时间
	if (starttime && starttime != '') {
		obj.starttime = starttime;
	}
	var endtime = $('.date .end').val(); // 结束时间
	if (endtime && endtime != '') {
		obj.endtime = endtime;
	}
	var key = $('.search .searchInp').val(); // 搜索关键字
	if (key && key != '') {
		obj.key = key;
	}
	var page = $('.pagination .page.active a').text(); // 当前所在页
	if (page && page != '') {
		obj.page = page;
	}
	var size = $('.pageDesc select option:selected').val();
	if (size && size != '') {
		obj.size = size;
	}
	return obj;
}

// 编辑后刷新产品库
function isRefresh() {
	var searchParams = getSearchParams();
	var getProUrls = $.param(searchParams);
	getPro(getProUrls)
}

// 搜索前非空校验、格式校验
function searchVerify() {
	var starttime = $('.date .start').val(); // 开始时间
	var endtime = $('.date .end').val(); // 结束时间

	var starttimeFormat = starttime.replace(/\/|:/g, '');
	starttimeFormat = starttimeFormat.replace(' ', ''); // 格式化后的开始日期
	var endtimeFormat = endtime.replace(/\/|:/g, '');
	endtimeFormat = endtimeFormat.replace(' ', '');	// 格式化后的结束日期
	if (starttime != '' && endtime != '') {
		if (starttimeFormat > endtimeFormat) {
			alert('开始日期不能大于结束日期');
			return false;
		}
	}
	return true;
}

function getAllKind() {
	http.getAjax_clean('/photo-album/product/getcategory', function (res) {
		var html = '';
		if (res.length > 0) {
			html += `<option value="0">全部大类</option>`;
			$.each(res, function (key, item) {
				html += `<option value="${key + 1}">${item}</option>`;
			})
		} else {
			html += `<option value="-1">暂无信息</option>`;
		}
		$('.search select').html(html);
	});
}

function getPro(getProUrls) {
	var promise = new Promise(function (resolve, reject) {
		http.getAjax_clean("/photo-album/product/get_all_product?" + getProUrls, function (res) {
			resolve(res);
			drawTable(res);
		});
	});
	return promise;
}

function drawTable(res) {
	var pros = res.page;
	var html = `<thead>
								<tr>
									<td><input type="checkbox" class="selectAll" /><span>全选</span></td>
									<td>匹配图</td>
									<td>产品</td>
									<td>产品编号</td>
									<td>更新时间</td>
									<td>当前状态</td>
									<td>操作</td>
								</tr>
							</thead>
							<tbody>
							`;
	if (pros.length > 0) {
		$.each(pros, function (key, pro) {
			var isOnline = pro.online ? '已上架' : '未上架';
			var isOnlineBtn = pro.online ? '下架' : '上架';
			var onlineHtml = ``;
			if (pro.online) {
				onlineHtml = `<button class="isSxj btn btn-default" data-number="${pro.number}">${isOnlineBtn}</button>`;
			} else {
				onlineHtml = `<button class="isSxj btn btn-default active" data-number="${pro.number}">${isOnlineBtn}</button>`;
			}

			html += `<tr data-pronumber="${pro.number}">
									<td><input type="checkbox" class="select"/></td>
									<td><img src="../image/${pro.image}" height="100%" alt="暂无图片"></td>
									<td>
										产品品名:<span class="name">${pro.name}</span><br>
										产品品类:<span class="kind">${pro.category}</span>
									</td>
									<td>${pro.number}</td>
									<td>${pro.time}</td>
									<td>${isOnline}</td>
									<td>
										`+ onlineHtml + `
										<button class="edit btn btn-default">编辑</button>
										<button class="delete btn btn-default">删除</button>
									</td>
								</tr>`;
		})
		html+=`</tbody>`;
		$('.pagerAndPageDesc').show();
		// isSearchSuccess = true;
	} else {
		// isSearchSuccess = false
		$('.pagerAndPageDesc').hide();
		html += '暂无数据';
		// alert('暂无此商品，请重新搜索！');
	}
	$('.detail table').html(html);
}

function showPager(res) {
	$('.pageDesc .proNumber').text(res.totlesize);  // 总产品数
	var pageSize = $('.pageDesc option:selected').text();
	var remainder = (res.totlesize) % pageSize == 0 ? 0 : 1; // 判断是否有余数
	var pages = Math.floor((res.totlesize) / pageSize) + remainder; // 总页数
	$('.pageDesc .totalPager').text(pages);  // 总页数
	pagerPlugin(pageSize, res.totlesize, 10); // 显示分页插件
}

function pagerPlugin(pageSize, total, maxPageButton) {

	var searchParams = getSearchParams();

	$(".pagination").jBootstrapPage({
		pageSize: pageSize,
		total: total,
		maxPageButton: maxPageButton,
		onPageClicked: function (obj, pageIndex) {
			var currentPage = pageIndex + 1;
			searchParams.page = currentPage;
			var getProUrls = $.param(searchParams);
			getPro(getProUrls);
		}
	});
}

function getProByIndex() {
	var searchParams = {
		type: 0,
		size: localStorage.getItem('countByPager'),
		page: 1,
		isonline: '*'
	};
	var getProUrls = $.param(searchParams);
	getPro(getProUrls).then(function (res) {
		showPager(res);  // 分页插件
	}); // 默认加载第一页
}

function keydown_search_fun(thiselem,event){
	if(event.key == 'Enter'){
		searchResult();
	}
}
