//
function selectChange(){
  var selectText = $('select[name=category]').find('option:selected').text();
  model.category = selectText;
  addRows(null);
}
var addRows = function(elem){
  var szTheadHtml = '<tr>\
                      <td >长度</td><td>宽度</td><td>高度</td><td>长宽高</td><td>圈口</td><td>内径</td><td>面宽</td><td><button type="button" onclick="addRows(this)" class="btn btn-primary">点击添加新的产品规格</button></td>\
                    </tr>';
  var szTbodyHtml = '<tr>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><input type="text" style="width:90%;"/></td>\
                      <td><button onclick="delThisRows(this)" class="btn btn-default">删除此规格</button></td>\
                    </tr>';

  if(elem == null){
      $('#addrowtable thead').html(szTheadHtml);
      $('#addrowtable tbody').html(szTbodyHtml);
  }else{
      $('#addrowtable tbody').append(szTbodyHtml);
  }
};

var delThisRows = function(elem){
  $(elem).parent().parent().remove();
};

$(function(){
  model = {};
  var _data_ = JSON.parse(localStorage.getItem('current_edit_product')) || {};
  model.category = _data_.category || null;

  http.getAjax_clean('/photo-album/product/getcategory', function(data){
    for(var i=0;i<data.length;i++){
      if(i==0){
        model.category = model.category || data[i];
      }
      $('select[name=category]').append('<option value="'+(i+1)+'">'+data[i]+'</option>');
    }
    $('select[name=category]').find('option').each(function(){
      if($(this).text() == model.category){
        $(this).attr('selected', true);
      }
    });
  });

  //获取推广类别数据填充页尾select表单:
  http.getAjax_clean('/photo-album/manger/get_products', function(data){
    var node = $('form[name=edit_product]').find('fieldset').eq(3);
    for(var i=0; i<data.length; i++){
      node.append('<div class="editproductseo"><input type="checkbox" name="'+data[i].id+'" style="margin:0"> '+data[i].productsname+'</div>');
    }
  });

  setTimeout(addRows(null), 200);

  new Vue({
    el: '#edit_product',
    data: _data_
  });

  $('select[name=category]').change(function(){
    selectChange();
  });

  document.getElementById('btn_submit').addEventListener('click', function(e){
    alert('ing..');
    /*var post_data = new FormData();
    var category = $("select[name=category]").find('option:selected').val();
    var name = $("input[name=name]").val();
    var detil = $("textarea[name=detil]").val();
    var material = $("select[name=material]").find('option:selected').val();
    var condition = $("select[name=condition]").find('option:selected').val();
    var kuanshi = $("input[name=kuanshi]").val();
    var craft = $("input[name=craft]").val();
    var crowd = $("select[name=crowd]").find('option:selected').val();
    var obj = {};
    obj.category = category;
    obj.name = name;
    obj.detil = detil;
    obj.material = material;
    obj.condition = condition;
    obj.kuanshi = kuanshi;
    obj.craft = craft;
    obj.crowd = crowd;
    post_data.append("category", category);
    post_data.append("name", name);
    post_data.append("detil", detil);
    post_data.append("material", material);
    post_data.append("condition", condition);
    post_data.append("kuanshi", kuanshi);
    post_data.append("craft", craft);
    post_data.append("crowd", crowd);
    var spec = $("tbody").find('input');
    var number = null;
    var internal_diameter_width = null;
    var internal_diameter_height = null;
    var weight = null;
    switch(spec.length){
      case 3:
        number = $(spec[0]).val();
        internal_diameter_width = $(spec[1]).val();
        weight = $(spec[2]).val();
        break;
      case 4:
        number = $(spec[0]).val();
        internal_diameter_width = $(spec[1]).val();
        internal_diameter_height = $(spec[2]).val();
        weight = $(spec[3]).val();
        break;
      case 2:
        number = $(spec[0]).val();
        weight = $(spec[1]).val();
        break;
      default:
        console.log('nice meeting u');
    }
    if(number!=null)obj.number=number;
    if(internal_diameter_width!=null)obj.width=internal_diameter_width;
    if(internal_diameter_height!=null)obj.height=internal_diameter_height;
    if(weight!=null)obj.weight=weight;
    var promotion = $('form[name=edit_product]').find('fieldset').eq(3).find('input:checked');
    promotion.each(function(){
      if($(this).is(":checked"))obj[$(this).attr("name")]=true;
    });
    var jsonObj = JSON.stringify(obj);
    post_data.append('product_cell', jsonObj);
    http.postAjax(e, "/photo-album/notes/add_product_cell", post_data, function(data){
      if(data['state']==true){
        alert('编辑提交成功');
      }else{
        alert('编辑提交失败');
      }
    });*/
  }, false);
});
