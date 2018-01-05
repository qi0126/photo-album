// 推广类别

const ERR_OK = 0;

/***************************************************
 * 初始化                                          *
****************************************************/
$(function () {

  // 获取所有类别信息
  getAllKind();

})

/***************************************************
 * 事件                                            *
****************************************************/

// 类别伸缩动画
$('.left-wrapper .kind-list').on('click', '.parentLi', function () {
  $(this).find('ul').stop().toggle(200);
  $(this).siblings().find('ul').hide();
  var kindName = $(this).find('.kind-name:first').text();
  $('.right-wrapper .kind').text(`【${kindName}】`);

  getDetail($(this)); // 加载详情内容
});

// 点击子类别
$('.left-wrapper .kind-list').on('click', 'li li', function (e) {
  var kindName = $(this).find('.kind-name').text();
  $('.right-wrapper .kind').text(`【${kindName}】`);

  getDetail($(this)); // 加载详情内容
  e.stopPropagation();
});

// 编辑类名
$('.left-wrapper .kind-list').on('click', '.edit', function (e) {
  var kindName = $(this).prev().prev().text();
  var id = $(this).data('id');
  var pruductid = $(this).data('productid');
  var isParentEdit = $(this).closest('li').hasClass('parentLi');

  $('#editKindName #kindName').val(kindName);
  $('#editKindName #kindName').data('id', id);
  $('#editKindName #kindName').data('pruductid', pruductid);
  $('#editKindName #kindName').data('isParentEdit', isParentEdit);

  $('#editKindName').modal();
  e.stopPropagation();
})

// 保存编辑后的类名
$('#editKindName #saveKindName').on('click', function () {
  var id = $('#editKindName #kindName').data('id');
  var productid = $('#editKindName #kindName').data('pruductid');
  var kindName = $('#editKindName #kindName').val();
  var isParentEdit = $('#editKindName #kindName').data('isParentEdit');
  var obj = {};

  if (kindName.length > 0) {
    if (isParentEdit) {
      obj = {
        'id': id,
        'name': kindName
      }
      editKind(obj); // 编辑种类
    } else {
      obj = {
        'id': id,
        'productid': productid,
        'name': kindName
      }
      editTheme(obj); // 编辑主题
    }

  } else {
    alert('类别名不能为空');
  }
});

// +、-阻止冒泡
$('.left-wrapper .kind-list').on('click', 'li .icon-my', function (e) {
  e.stopPropagation();
});

// "+" 添加主题
$('.left-wrapper .kind-list').on('click', 'li .icon-add', function (e) {
  $('#addTheme').modal();
  $('#addTheme').find('#themeName').val('');
  var liId = $(this).parent().data('groupid');
  $("#saveTheme").data('products_id', liId);
});
// 保存添加主题
$("#saveTheme").on('click', function () {
  var $this = $(this);
  var products_id = $this.data('products_id');
  var inputVal = $('#addTheme').find('#themeName').val();
  var $selected = $('.left-wrapper .kind-list li.' + products_id + '').find('ul');

  if (inputVal != '') {
    var post_data = new FormData();
    post_data.append('products_id', products_id);
    post_data.append('name', inputVal);
    post_data.append('link_id', '');
    http.postAjax_clean("/photo-album/manger/add_product", post_data, function (res) {
      var errno = res.code;
      if (errno == ERR_OK) {
        $('.right-wrapper .kind-detail tbody').html('暂无数据');
        getAllKind();
        $('#addTheme').modal('hide');
        alert('主题添加成功')
      } else {
        alert(res.msg);
      }
    })
  } else {
    alert('请输入主题名称');
    $('#addTheme').modal('hide');
  }
});

// "x" 删除左侧推广类别
$('.left-wrapper .kind-list').on('click', 'li .icon-close', function (e) {
  var $this = $(this);
  var post_data = new FormData();
  post_data.append('id', $this.parent().data('groupid'));

  var isConfirm = confirm('是否删除此类别？');
  if (isConfirm) {
    http.postAjax_clean("/photo-album/manger/del_products", post_data, function (res) {
      if (res.state) {
        $this.parent().remove();
        if ($('.left-wrapper .kind-list ul').html() == '') {
          $('.left-wrapper .kind-list ul').html('暂无数据');
        }
        $('.right-wrapper .kind-detail tbody').html('暂无数据');
      } else {
        alert('删除失败');
      }
    })
  }
});

// 新建推广类别
$('.left-wrapper .new-kind button').on('click', function () {
  $('#addKind').modal();
});
// 保存新建推广类别
$('#saveKind').on('click', function () {
  var inputVal = $('#addKind').find('#kindName').val();
  if (inputVal != '') {
    var post_data = new FormData();
    post_data.append('productsname', inputVal);
    http.postAjax_clean("/photo-album/manger/add_products", post_data, function (res) {
      var errno = res.code;
      if (errno == ERR_OK) {
        $('.right-wrapper .kind-detail tbody').html('暂无数据');
        getAllKind();
        $('#addKind').modal('hide');
      } else {
        alert(res.msg);
      }
    })
  } else {
    alert('推广类别名不能为空');
  }
});

// 点击全选按钮
$('.right-wrapper .kind-detail table').on('click','.select-all', function () {
  var isChecked = $(this).is(":checked");

  var $childCheckboxs = $('.right-wrapper .kind-detail tbody .select');

  if (isChecked) {
    $childCheckboxs.prop('checked', true);
  } else {
    $childCheckboxs.removeAttr("checked");
  }
});

// 单个移除产品
$('.right-wrapper .kind-detail').on('click', '#btn-remove', function () {
  var isConfirm = confirm('确定删除？');
  if (isConfirm) {
    var $tr = $(this).closest('tr');
    var obj = {
      $tr: $tr,
      topid: $tr.data('gropid'),
      number: $tr.data('number')
    }
    deletePro(obj);
  }
});

// 批量删除
$('.right-wrapper #delete-all').on('click', function () {
  var $checked = $('.right-wrapper .kind-detail tbody .select:checked');
  if ($checked.length > 0) {
    var isConfirm = confirm('确定批量删除？');
    if (isConfirm) {
      var $this = $(this);
      $($checked).each(function () {
        var $tr = $(this).closest('tr');
        var obj = {
          $tr: $tr,
          topid: $tr.data('gropid'),
          number: $tr.data('number')
        }
        deletePro(obj);
      })
    }
  } else {
    alert('您还未选中任何产品');
  }

});

// 调整推广类型
$('.right-wrapper #change-kind').on('click', function () {
  var $checked = $('.right-wrapper .kind-detail tbody .select:checked');
  if ($checked.length > 0) {
    http.getAjax_clean('/photo-album/manger/get_products', function (res) {
      var html = '';
      if (res.length > 0) {
        $.each(res, function (key, obj) {
          html += `<tr>
                    <td>
                      <input type="radio" name="kind" class="${obj.id}">${obj.productsname}
                    </td>
                    <td>【`;
          var products = obj.products;
          $.each(products, function (key, item) {
            html += `<input type="radio" name="kind" class=${item.productId}>${item.name}`;
          });
          html += `】</td>
                  </tr>`;
        });
        $('#changeKind .kind table').html(html);
      }
    })
    $('#changeKind').modal();
  } else {
    alert('您还未选中需要调整的产品');
  }
});

// 保存调整推广类型
$('#changeKind #save').on('click', function () {
  var $checked = $('.right-wrapper .kind-detail tbody .select:checked'); // 被选的产品
  var $kindChecked = $('#changeKind .kind input[type=radio]:checked'); // 被选的类别
  var products = []; // 被选的产品数组
  var oldId = []; // 被选的产品id
  var kinds = []; // 被选的类别数组

  $.each($checked, function (key, item) {
    var id = $(item).data('number');
    products.push(id);
  });

  $.each($checked, function (key, item) {
    var id = $(item).data('gropid');
    oldId.push(id);
  });

  $.each($kindChecked, function (key, item) {
    var id = $(item).attr('class');
    kinds.push(id);
  });

  var param = {
    'linkids': kinds,
    'products': products,
    'oldId': oldId
  }
  param = JSON.stringify(param);
  var post_data = new FormData();
  post_data.append('param', param);
  http.postAjax_clean("/photo-album/product/save_toic", post_data, function (res) {
    if (res.state) {
      $('.right-wrapper .kind-detail table').html('暂无数据');
      getAllKind();
    } else {
      alert('调整失败');
    }
    $('#changeKind').modal('hide');
  })
});

/***************************************************
 * 函数                                            *
****************************************************/
function getAllKind() {
  http.getAjax_clean('/photo-album/manger/get_products', function (res) {
    var html = '';
    if (res.length > 0) {
      $.each(res, function (key, obj) {
        // 计算总数量
        var totalNumber = 0;
        totalNumber += obj.size;
        var childs = obj.products;
        $.each(childs, function (key, child) {
          totalNumber += child.total;
        });
        html += `<li data-groupid="${obj.id}" class="${obj.id} parentLi">
                    <i class="icon-add icon-my">+</i>
                    <span class="kind-name ${obj.id}">${obj.productsname}</span>
                    <span class="totalNumber">【${totalNumber}】</span>
                    <img class="edit" data-id="${obj.id}" src="../images/edit.png">
                    <i class="icon-close icon-my">×</i>
                  <ul>`;
        var childsHtml = '';
        $.each(childs, function (key, child) {
          childsHtml += `<li data-groupid="${child.productId}">
                          <span class="kind-name ${child.productId}">${child.name}</span>
                          <span>【${child.total}】</span>
                          <img class="edit" data-id="${obj.id}" data-productid="${child.productId}" src="../images/edit.png">
                        </li>`;
        });
        html += childsHtml + '</ul></li>';
      });
      $('.left-wrapper .kind-list ul').html(html);
    } else {
      $('.left-wrapper .kind-list ul').html('暂无数据');
    }
  })
}

function getDetail($this) {
  var post_data = new FormData();
  post_data.append('isDistinct', 0);
  post_data.append('groupid', $this.data('groupid'));

  http.postAjax_clean("/photo-album/manger/getProductListByGroupidFull", post_data, function (res) {
    var errno = res.code;
    if (errno == ERR_OK) {
      var result = res.data;
      var html = '';
      if (result.length > 0) {
        html+=`<thead>
                  <tr>
                    <td>
                      <input type="checkbox" class="select-all">全选
                    </td>
                    <td>匹配图</td>
                    <td>产品</td>
                    <td>产品编号</td>
                    <td>所属类别</td>
                    <td>操作</td>
                  </tr>
                </thead>
                <tbody>
                `;
        $.each(result, function (key, obj) {
          html += `<tr data-gropid="${obj.gropid}" data-number="${obj.number}">
                    <td><input type="checkbox" data-gropid="${obj.gropid}" data-number="${obj.number}" class="select"></td>
                    <td><img src="../image/${obj.image}" alt="暂无图片" class="pic"></td>
                    <td>
                     <span>产品品名：${obj.name}</span><br><span>产品品类：${obj.category}</span>
                    </td>
                    <td>${obj.number}</td>
                    <td>${obj.gropname}</td>
                    <td><button class="btn btn-danger" id="btn-remove">移除</button></td>
                   </tr>`;
        });
        html += `</tbody>`;
      } else {
        html += '暂无数据';
      }
      $('.right-wrapper .kind-detail table').html(html);
    } else {
      alert(res.msg);
    }
  });
}

function deletePro(obj) {
  var post_data = new FormData();
  post_data.append('topid', obj.topid);
  post_data.append('number', obj.number);

  http.postAjax_clean("/photo-album/product/remove_topic", post_data, function (res) {
    if (res.state) {
      obj.$tr.remove();
      getAllKind();
    } else {
      alert('删除失败');
    }
  })
}

function editKind(obj) {
  var post_data = new FormData();
  post_data.append('id', obj.id);
  post_data.append('name', obj.name);
  http.postAjax_clean("/photo-album/product/renameseries", post_data, function (res) {
    var errno = res.code;
    if (errno == ERR_OK) {
      $('.left-wrapper .kind-list li').find('.' + obj.id + '').text(obj.name);
    } else {
      alert(res.msg);
    }
    $('#editKindName').modal('hide');
  })
}

function editTheme(obj) {
  var post_data = new FormData();
  post_data.append('id', obj.id);
  post_data.append('productid', obj.productid);
  post_data.append('name', obj.name);
  http.postAjax_clean("/photo-album/product/renametheme", post_data, function (res) {
    var errno = res.code;
    if (errno == ERR_OK) {
      $('.left-wrapper .kind-list li').find('.' + obj.productid + '').text(obj.name);
    } else {
      alert(res.msg);
    }
    $('#editKindName').modal('hide');
  })
}
