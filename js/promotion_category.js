
//全局变量分类主题ID
var product_id = '';
//分类类别json格式
var get_products_json;
var get_products_bigjson;
//类别和主题产品列表json格式
var get_products_prolist_json=[];

$(function(){


  model = {};
  winload();
  document.getElementById('create_category').addEventListener('click', function(e){
    $('#cover').css('display', 'block');
    $('#oncover').css('display', 'block');
  }, false);

  document.getElementById('btn_add_category_cancel').addEventListener('click', function(e){
    $('#oncover').css('display', 'none');
    $('#cover').css('display', 'none');
  }, false);

  //添加分类
  document.getElementById('btn_add_category_submit').addEventListener('click', function(e){
    var post_data = new FormData();
    var name = document.forms.create_promotion_category.category_name.value;
    name = name.replace(/\s/g,"");
    if(name.length != 0){
      post_data.append('productsname', name);
      http.postAjax(e, "/photo-album/manger/add_products", post_data, function(data){
        location.reload();
      });
    }else{
      alert('名称一栏不能为空');
    }
  }, false);
});

function winload(){

  http.getAjax_clean("/photo-album/manger/get_products", function(data){
    //拼装“类别”和"主题"json开始
    get_products_bigjson = data;
    $(get_products_bigjson).each(function(i,elem){
      var post_data = new FormData();
      post_data.append('id',elem.id);
      post_data.append('page',1);
      post_data.append('size',100);
      http.postAjax_synchro_clean("/photo-album/manger/get_product_id", post_data, function(data){
        get_products_bigjson[i].productlist = data.page;
      });
      $(elem.products).each(function(j,subelem){
        var post_data = new FormData();
        post_data.append('id',subelem.productId);
        post_data.append('page',1);
        post_data.append('size',100);
        http.postAjax_synchro_clean("/photo-album/product/get_series_product", post_data, function(data){
          get_products_bigjson[i].products[j].productlist =data.page
        });
      });
    });

    //拼装“类别”和"主题"json结果为get_products_bigjson

    // console.log(get_products_prolist_json);
    // get_products_json = data;
    if(data.length != 0){
      product_id = data[0].id;
      $("#category_edit_span").html(" -类别："+data[0].productsname);
      $("#multiDel_div").html('<button class="btn btn-danger" id="multi_delete" onclick="multiDel_promo(this,\''+data[0].id+'\')">批量删除</button>');
      var dataid=data[0].id;
      var leftmenu_winload_list =get_products_bigjson[0].productlist;
      var temp_text=[];
      for(var i=0;i<leftmenu_winload_list.length;i++){
        if(i<5){
          temp_text.push(leftmenu_winload_list[i])
        }
      }
      // console.log(temp_text);
      // console.log(get_products_bigjson);
      $(get_products_bigjson).each(function(i,elem){
        // console.log(elem);
        get_products_prolist_json[i] = {};
        var j_num = 0;
        //类别产品
        $(elem.productlist).each(function(j,subelem){
          // console.log(JSON.stringify(subelem));
          get_products_prolist_json[i][j] = {};
          get_products_prolist_json[i][j].category = subelem.category;//产品分类
          get_products_prolist_json[i][j].number = subelem.number;//产品编码
          get_products_prolist_json[i][j].image = subelem.image;//图片路径
          get_products_prolist_json[i][j].name = subelem.name;//产品名称
          get_products_prolist_json[i][j].online = subelem.online;//当前状态上下架
          get_products_prolist_json[i][j].time = subelem.time;//产品创建时间
          get_products_prolist_json[i][j].cate_name = elem.productsname;//分类名称
          get_products_prolist_json[i][j].cate_id = elem.id;//分类名称
          get_products_prolist_json[i][j].cate_tf = 1;//分类名称
          j_num++;
        });
        // console.log("j_num:"+j_num);
        $(elem.products).each(function(k,sub_subelem){
          // console.log(JSON.stringify(sub_subelem));
          // console.log(sub_subelem.productlist.length);
          $(sub_subelem.productlist).each(function(p,sub_sub_subelem){
            // console.log(JSON.stringify(sub_sub_subelem));
            get_products_prolist_json[i][j_num] = {};//产品分类
            get_products_prolist_json[i][j_num].category = sub_sub_subelem.category;//产品分类
            get_products_prolist_json[i][j_num].number = sub_sub_subelem.number;//产品编码
            get_products_prolist_json[i][j_num].image = sub_sub_subelem.image;//图片路径
            get_products_prolist_json[i][j_num].name = sub_sub_subelem.name;//产品名称
            get_products_prolist_json[i][j_num].online = sub_sub_subelem.online;//当前状态上下架
            get_products_prolist_json[i][j_num].time = sub_sub_subelem.time;//产品创建时间
            get_products_prolist_json[i][j_num].cate_name = sub_subelem.name;//分类名称
            get_products_prolist_json[i][j_num].cate_id = sub_subelem.productId;//分类名称
            get_products_prolist_json[i][j_num].cate_tf = 2;//分类名称
            j_num++;
          });
        });
      });
      //产品输出结果get_products_prolist_json很重要
      // console.log(get_products_prolist_json);

      createAndInsertHtml_promo(get_products_prolist_json[0],dataid);
      var count = 0;
      for(var key in get_products_prolist_json[0]){
          count++;
      }
      createPage(1, 5, count);
      leftmenu_load(data);

      $("a[name='bottom-div']").each(function(index, item){
         if((data[index].products).length==0){
           $(this).hide();
         }
      });
    }else{
      $("#accordion").html("暂无推广类别，请在上边新建推广别类别！")
    }
  });
}


function AccordionMenu(options){
  this.config = {
    containerCls: '.wrap-menu',
    menuArrs: '',
    type: 'click',
    renderCallBack: null,
    clickItemCallBack: null
  };
  this.cache = {};
  this.init(options);
}

AccordionMenu.prototype = {
  constructor: AccordionMenu,
  init: function(options){
    this.config = $.extend(this.config, options || {});
    var self = this;
    var _config = self.config;
    var _cache = self.cache;
    $(_config.containerCls).each(function(index, item){
      self._renderHTML(item);
      self._bindEnv(item);
    });
  },
  _renderHTML: function(container){
    var self = this;
    var _config = self.config;
    var _cache = self.cache;
    var ulhtml = $('<ul></ul>');
    $(_config.menuArrs).each(function(index, item){
      // console.log(item.size);
      var promotion_number = item.size ;
      for(var i=0;i<item.products.length;i++){
        promotion_number +=item.products[i].total;
      }
      // console.log("promotion_number:"+promotion_number);
      var lihtml = $('<li id="'+item.id+'"><h2 ondblclick="h2Dblclick(this)" style="width:80%;float:left;border-bottom:1px solid #fff;"><span class="promotion_menu_over add_topic" id="'+item.id+'">+</span><button class="promotion_btn" onclick="promotion_btn_fun(\''+item.id+'\')">'+item.productsname+'</button></h2><div class="del_promotion_div"><span>('+promotion_number+')</span><button class="promotion_menu_over del_promotion" id="'+item.id+'">x</button></div></li>');
      if(item.products && item.products.length > 0){
        self._createSubMenu(item.products, lihtml);
      }
      $(ulhtml).append(lihtml);
    });
    $(container).append(ulhtml);
    _config.renderCallBack && $.isFunction(_config.renderCallBack) && _config.renderCallBack();
    self._levelIndent(ulhtml);
  },
  _createSubMenu: function(products, lihtml){
    var self = this;
    var _config = self.config;
    var _cache = self.cache;
    var subUl = $('<ul></ul>');
    /*var callee = arguments.callee;*/
    var subLi;
    $(products).each(function(index, item){
      var url = item.url || 'javascript:void(0)';
      subLi = $('<li id="'+item.productId+'" style="background-color:#2e363f;"><a href="'+url+'" onclick="theme_click(\''+item.productId+'\')" ondblclick="aDblclick(this)" >'+item.name+'</a>'+'<font style="color:#fff;margin-right:10px;">('+item.total+')</font>'+' <span class="del_topic" id="'+item.productId+'">x</span></li>');
      if(item.products && item.products.length > 0){
        $(subLi).children('a').prepend('<img src="../images/blank.gif"/>');
        /*callee(item.products, subLi);*/
      }
      $(subUl).append(subLi);
    });
    $(lihtml).append(subUl);
  },
  _levelIndent: function(ulList){
    var self = this;
    var _config = self.config;
    var _cache = self.cache;
    var initTextIndent = 2;
    var lev = 1;
    var $oUl = $(ulList);
    while($oUl.find('ul').length > 0){
      initTextIndent = parseInt(initTextIndent, 10) + 2 + 'em';
      $oUl.children().children('ul').addClass('lev-' + lev);
      $oUl = $oUl.children().children('ul');
      lev++;
    }
    $(ulList).find('ul').hide();
    $(ulList).find('ul:first').show();
  },
  _bindEnv: function(container){
    var self = this;
    var _config = self.config;
    $('h2,a', container).unbind(_config.type);
    $('h2,a', container).bind(_config.type, function(e){
      if($(this).siblings('ul').length > 0){
        $(this).siblings('ul').slideToggle('fast').end().children('img').toggleClass('unfold');
        $(this).siblings('ul').find('a:first').click();
      }
      $(this).parent('li').siblings().find('ul').hide().end().find('img.unfold').removeClass('unfold');
      _config.clickItemCallBack && $.isFunction(_config.clickItemCallBack) && _config.clickItemCallBack($(this));
    });
    $('.add_topic', container).bind(_config.type, showAddTopicView);
    $('.del_promotion', container).bind(_config.type, delPromotion);
    $('.del_topic', container).bind(_config.type, delTopic);
    $(container).find('a:first').click();
  }
};
//双击改变类别
var h2Dblclick = function(elem){
  if($(elem).parent().parent().has('input')){
    $(elem).parent().parent().find('input').replaceWith(model.op_h2);
  }
  // model.op_h2 = $(elem).clone();
  $(elem).replaceWith('<input id="categoryid" type="text" maxlength="8" value="'+$(elem).text().replace('+','').replace('x','')+'" onblur="renameCategory(this)" onkeyup="renameCategory_keyup(event,this)" style="color:#32CD32;font-weight:bold;text-align:center;width:50%;height:27px;"/>');

}

//双击改变类别主题
var aDblclick = function(elem,pro_id){
  // console.log(pro_id);
  // console.log($(elem)[0].className);
  // var theme_id =($(elem).context.attributes[0].value).split("'")[1];
  var theme_id =$(elem)[0].className;
  if($('.wrap-menu').has('input')){
    $('.wrap-menu').find('input').replaceWith(model.op_a);
  }
  model.op_a = $(elem).clone();
  $(elem).replaceWith('<input type="text" maxlength="8" value="'+$(elem).text()+'" onblur="renameTopic(this,\''+pro_id+'\',\''+theme_id+'\')" onkeyup="renameTopic_keyup(event,this,\''+pro_id+'\',\''+theme_id+'\')" style="width:70%;padding:0;font-size:1.15em;color:#32CD32;font-weight:bold;text-align:center;margin-top:-10px;height:27px;"/>');
  $('.wrap-menu').find('input').focus();
  var t = $('.wrap-menu').find('input').val();
  // console.log(t);
  $('.wrap-menu').find('input').val(t);
};



//双击改变主题名称JS
function renameTopic(elem,pro_id,theme_id){
  var lStorage=window.localStorage;
  var topic_id = lStorage.productId;
  var category_id = lStorage.proId;
  var new_name = $(elem).val();
  new_name = new_name.replace(/\s/g,"");
  if(new_name.length == 0){
    alert("推广主题名称不能为空！");
      location.reload();
  }else{
    var post_data = new FormData();
    post_data.append('id', category_id);
    post_data.append('productid', topic_id);
    post_data.append('name', new_name);
    http.postAjax_clean("/photo-album/product/renametheme", post_data, function(data){
      // console.log(data);
      if(data['state']==true){
        location.reload();
      }
    });
  }
}

//双击改变类别名称JS
var renameCategory = function(elem){
  // console.log($(elem));
  var post_data = new FormData();
  //获取id
  // console.log($(elem).context.previousElementSibling.id);
  var id =$(elem).context.previousElementSibling.id;
  //获取修改字段
  var new_name = elem.value;
  new_name = new_name.replace(/\s/g,"");
  // console.log(new_name.length);
  if(new_name.length == 0){
    location.reload();
    alert("推广类别名称不能为空！");
  }else{
    // console.log(new_name);
    post_data.append('id', id);
    if(name.length<16){
      post_data.append('name', new_name);
    }else{
      alert('名称取值过长,确保不超过16个字符.');
      return;
    }
    http.postAjax_clean("/photo-album/product/renameseries", post_data, function(data){
      // console.log(data);
      if(data.state==true){
        location.reload();
      }else{
        alert('修改类别名称异常');
      }
    });
  }
};


//按回车改变主题
var renameTopic_keyup = function(event,elem,theme_id){
  // console.log(theme_id);
  switch(event.keyCode){
    case 27:
      location.reload();
      break;
    case 13:
      renameTopic(elem,theme_id);
      location.reload();
      break;
    default:
      break;
  }
};

//按回车改变类别
var renameCategory_keyup = function(event,elem){
  switch(event.keyCode){
    case 27:
      location.reload();
      break;
    case 13:
      renameCategory(elem);
      location.reload();
      break;
    default:
      break;
  }
};


var topicLinksRequest = function(elem){
  $(elem).parent().parent().find('a').each(function(){
    //$(this).css('background-color', '#fff');
  });
  //$(elem).css('background-color', '#ccc');
  var self = this;
  var topic_id = $(elem).parent().attr('id');
  model.current_topic_id = topic_id;
  // console.log(topic_id);
  var req_url = '/photo-album/product/get_series_product?id='+topic_id;
  self.req_url = req_url;
  http.getAjax_clean(req_url+'&size=5&page=1', function(data){
    // console.log(data.page);
    createAndInsertHtml(data.page,topic_id);
  });

};

//推广类别分页
function createPage(buttons,pageSize,total){
  // console.log(total);
  //总页数
  var pages_num =parseInt((total-1)/pageSize)+1;

  // console.log(buttons);
  // console.log(pages_num);
  var pages_div_htmlcode ='';
  pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click(1)">首 页</button> ';
    if(pages_num<=5){
      for(var i=1;i<=pages_num;i++){
        if(i==buttons){
          pages_div_htmlcode  +='<button class="btn btn-warning" onclick="pages_click('+i+')">'+i+'</button> ';
        }else{
          pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click('+i+')">'+i+'</button> ';
        }
      }
    }else{
      //页码1-3的
      if(buttons < 3){
        for(var k=1;k<=3;k++){
          if(k == buttons){
            pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click('+ k +')">'+k+'</button> ';
          }else{
            pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ k +')">'+k+'</button> ';
          }
        }
        pages_div_htmlcode +=' ... ';
      }

    }

    if(pages_num !=1){
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click(2)">下一页</button> ';
    }
    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click('+pages_num+')">末 页</button> ';
    $("#pages_div").html(pages_div_htmlcode);
}


//类别分页按钮(num当前第几页)
function pages_click(pagenum){
  var lStorage=window.localStorage;
  // console.log(lStorage.proId);
  // console.log('product_id:'+product_id);
  var page_number = (pagenum-1)*5;
  // console.log(page_number);
  // console.log(get_products_bigjson);
  for(var i in get_products_bigjson){
    if(get_products_bigjson[i].id==lStorage.proId){
      var count = 0;
      for(var j in get_products_prolist_json[i]){
        count++;
      }
      // console.log(count);
      var pages_click_prolist = [];
      //只显示5个
      for(var w=0; w<5 ;w++){
        var temp_num = page_number+w;
        if(temp_num<count){
          pages_click_prolist.push(get_products_prolist_json[i][temp_num]);
        }
      }
      createAndInsertHtml_promo(pages_click_prolist,lStorage.proId);
    }
  }
  //   //分页JS开始
    var pages_div_htmlcode ='';
    var pages_num =parseInt((count-1)/5)+1;
  //
    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click(1)">首 页</button> ';
    if(pagenum !=1){
      var numjian = pagenum-1;
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click('+numjian+')">上一页</button> ';
    }

    // console.log("页码:"+pagenum);
    // console.log("总页数:"+pages_num);

    //当总页码<5
    if(pages_num<5){
      for(var i=1;i<=pages_num;i++){
        if(i==pagenum){
          pages_div_htmlcode  +='<button class="btn btn-warning" onclick="pages_click('+i+')">'+i+'</button> ';
        }else{
          pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click('+i+')">'+i+'</button> ';
        }
      }
    }else{
      //页码1-3的
      if(pagenum < 3){
        for(var k=1;k<=3;k++){
          if(k == pagenum){
            pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click('+ k +')">'+k+'</button> ';
          }else{
            pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ k +')">'+k+'</button> ';
          }
        }
        pages_div_htmlcode +=' ... ';
      }
      //页码是3-(max-2)
      if(pagenum>=3&& pagenum<= pages_num-2){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click('+ pagenum +')">'+ pagenum +'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum+1)  +')">'+(pagenum+1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum+2) +')">'+(pagenum+2)+'</button> ';
        pages_div_htmlcode +=' ... ';
      }
      //页码为max-1
      if(pagenum == pages_num-1){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click('+ pagenum +')">'+pagenum +'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum+1) +')">'+(pagenum+1)+'</button> ';
      }
      //页码为max
      if(pagenum == pages_num){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click('+ pagenum +')">'+pagenum +'</button> ';
      }
    }
    if(pagenum != pages_num){
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click('+(pagenum+1)+')">下一页</button> ';
    }
    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click('+pages_num+')">末 页</button> ';
    $("#pages_div").html(pages_div_htmlcode);
    //分页JS结束
}


//主题分页
function createPage_theme(buttons,pageSize,total){
  //总页数
  var pages_num =parseInt((total-1)/pageSize)+1;
  // console.log(buttons);

  // console.log(pages_num);
  var pages_div_htmlcode ='';
  pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click__theme(1)">首 页</button> ';
    if(pages_num<=5){
      for(var i=1;i<=pages_num;i++){
        if(i==buttons){
          pages_div_htmlcode  +='<button class="btn btn-warning" onclick="pages_click_theme('+i+')">'+i+'</button> ';
        }else{
          pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click_theme('+i+')">'+i+'</button> ';
        }
      }
    }else{
      //页码1-3的
      if(buttons < 3){
        for(var k=1;k<=3;k++){
          if(k == buttons){
            pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click_theme('+ k +')">'+k+'</button> ';
          }else{
            pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ k +')">'+k+'</button> ';
          }
        }
        pages_div_htmlcode +=' ... ';
      }

    }

    if(pages_num!=1){
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click_theme(2)">下一页</button> ';
    }
    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click_theme('+pages_num+')">末 页</button> ';
    $("#pages_div").html(pages_div_htmlcode);
}


//主题分页按钮(num当前第几页)
function pages_click_theme(pagenum){
  var lStorage=window.localStorage;
  // console.log(lStorage.productId);
  // console.log(product_id);
  var page_number = pagenum;
  var post_data = new FormData();
  post_data.append('id', lStorage.productId);
  post_data.append('page', page_number);
  post_data.append('size', 5);
  http.postAjax_clean('/photo-album/product/get_series_product', post_data, function(data){
    createAndInsertHtml(data.page,product_id);
    //分页JS开始
    var pages_div_htmlcode ='';
    var pages_num =parseInt((data.totlesize-1)/5)+1;

    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click_theme(1)">首 页</button> ';
    if(pagenum !=1){
      var numjian = pagenum-1;
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click_theme('+numjian+')">上一页</button> ';
    }

    // console.log("页码:"+pagenum);
    // console.log("总页数:"+pages_num);

    //当总页码<5
    if(pages_num<5){
      for(var i=1;i<=pages_num;i++){
        if(i==pagenum){
          pages_div_htmlcode  +='<button class="btn btn-warning" onclick="pages_click_theme('+i+')">'+i+'</button> ';
        }else{
          pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click_theme('+i+')">'+i+'</button> ';
        }
      }
    }else{
      //页码1-3的
      if(pagenum < 3){
        for(var k=1;k<=3;k++){
          if(k == pagenum){
            pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click_theme('+ k +')">'+k+'</button> ';
          }else{
            pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ k +')">'+k+'</button> ';
          }
        }
        pages_div_htmlcode +=' ... ';
      }
      //页码是3-(max-2)
      if(pagenum>=3&& pagenum<= pages_num-2){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click_theme('+ pagenum +')">'+ pagenum +'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum+1)  +')">'+(pagenum+1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum+2) +')">'+(pagenum+2)+'</button> ';
        pages_div_htmlcode +=' ... ';
      }
      //页码为max-1
      if(pagenum == pages_num-1){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click_theme('+ pagenum +')">'+pagenum +'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum+1) +')">'+(pagenum+1)+'</button> ';
      }
      //页码为max
      if(pagenum == pages_num){
        pages_div_htmlcode +=' ... ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-2) +')">'+(pagenum-2)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-default" onclick="pages_click_theme('+ (pagenum-1) +')">'+(pagenum-1)+'</button> ';
        pages_div_htmlcode +=' <button class="btn btn-warning" onclick="pages_click_theme('+ pagenum +')">'+pagenum +'</button> ';
      }
    }
    if(pagenum != pages_num){
      pages_div_htmlcode  +='<button class="btn btn-default" onclick="pages_click_theme('+(pagenum+1)+')">下一页</button> ';
    }
    pages_div_htmlcode  +='<button class="btn btn-info" onclick="pages_click_theme('+pages_num+')">末 页</button> ';
    $("#pages_div").html(pages_div_htmlcode);
    //分页JS结束
  });


}

//类别删除产品
var delFromCategory = function(elem,topid){
  // console.log($(elem)[0].id);
  // console.log(topid);
  if(confirm("确定从类别中移除该产品?")){
    var topic_id = topid;
    var product_number = $(elem)[0].id;
    var product_number_list = [];
    // console.log('topic_id:'+topic_id);
    // console.log('product_number:'+product_number);
    product_number_list.push(product_number);
    // console.log(product_number_list);
    var post_data = new FormData();
    post_data.append('gropid', topic_id);
    post_data.append('numberlist', JSON.stringify(product_number_list));
    http.postAjax_clean('/photo-album/manger/del_product', post_data, function(data){
      if(data['state'] == true){
        // winload();
        // theme_click(product_id);
        location.reload();
      }else{
        alert('系统开了点小差，尚未将该产品从类别里移除.');
      }
    });
  }
};

//主题删除产品
var delFromTheme = function(elem,topid){
  // console.log($(elem)[0].id);
  // console.log(topid);
  if(confirm("确定从主题中移除该产品?")){
    var topic_id = topid;
    var product_number = $(elem)[0].id;
    // console.log(topic_id);
    // console.log(product_number);
    var post_data = new FormData();
    post_data.append('topid', topic_id);
    post_data.append('number', product_number);
    http.postAjax_clean('/photo-album/product/remove_topic', post_data, function(data){
      if(data['state'] == true){
        // console.log(product_id);
        // theme_click(product_id);
        location.reload();
      }else{
        alert('系统开了点小差，尚未将该产品从类别里移除.');
      }
    });
  }
};

var closeCover = function(elem){
  $('#cover').css('display','none');
};

//删除类别
var delPromotion = function(e){
  if(confirm("确定删除该推广类别?")){
    var id = e.target.id;
    var post_data = new FormData();
    post_data.append('id', id);
    http.postAjax_clean('/photo-album/manger/del_products', post_data, function(data){
      if(data['state']==true){
        location.reload();
      }else{
        alert("删除该推广类别失败.");
      }
    });
  }
  return false;
};

//删除主题
var delTopic = function(e){
  if(confirm("确定删除该主题?")){
    var topic_id = e.target.id;
    var promotion_id = e.target.parentNode.parentNode.parentNode.id;
    var post_data = new FormData();
    post_data.append('products_id', promotion_id);
    post_data.append('productid', topic_id);
    http.postAjax_clean("/photo-album/manger/del_products_sub_one", post_data, function(data){
      if(data['state']==true){
        location.reload();
      }else{
        alert("删除该主题失败");
      }
    });
  }
};

var showAddTopicView = function(e){
  $('#cover').css('display', 'block');
  $('#oncover1').css('display', 'block');
  model = model || {};
  // model.current_category_id = e.target.id;
  model.current_category_id = e.id;
  return false;
}

var closeAddTopicView = function(elem){
  $('#oncover1').css('display', 'none');
  $('#cover').css('display', 'none');
};


//添加主题
var addTopic = function(e){
  var id = model.current_category_id;
  var name = document.forms.create_topic.topic_name.value;
  name = name.replace(/\s/g,"");
  if(name.length != 0){
    var post_data = new FormData();
    post_data.append('products_id', id);
    post_data.append('name', name);
    post_data.append('link_id', '');
    http.postAjax_clean('/photo-album/manger/add_product', post_data, function(data){
      if(data['state']==true){
        location.reload();
      }else{
        alert("添加主题失败");
      }
    });
  }else{
    alert('名称一栏不能为空');
  }
  return false;
};


//左边菜单读取
function leftmenu_load(elem){
  var leftmenu_newdiv_html ='';
  var leftmenu_newlist_html = '';
  $(elem).each(function(i,subelem){
    // console.log(subelem);
    var promotion_number = subelem.size ;
    $(subelem.products).each(function(k,elem_number){
      promotion_number += elem_number.total;
    });
    // leftmenu_newlist_html +='<li><div>9</div></li>';
    leftmenu_newlist_html +='<li>\
                                <div class="vtitle" id="'+subelem.id+'">\
                                  <a id="'+subelem.id+'" onclick="showAddTopicView(this)"> + </a>\
                                  <button style="width:50%;" class="buttonlist" onclick="promotion_btn_fun(\''+subelem.id+'\',this)" ondblclick="h2Dblclick(this)">'+subelem.productsname+'</button>\
                                  <span class="leftmenu_gg" >\
                                  ('+promotion_number+')\
                                  <button type="button" class="del_btn" style="color:#2a6aa3;cursor: pointer;" onclick="del_Promotion_fun(\''+subelem.id+'\')">X</button></div></span>\
                                </div>\
                                <div class="vcon" style="display: none;">\
                                  <div class="vconlist">';
                                  $(subelem.products).each(function(j,submenu_elem){
                                    leftmenu_newlist_html += '\
                                            <div id="sub-'+submenu_elem.productId+'" class="clearfix">\
                                              <button class="'+submenu_elem.productId+' buttonlist1" style="cursor: pointer;" onclick="theme_click(\''+submenu_elem.productId+'\',\''+subelem.id+'\')" ondblclick="aDblclick(this,\''+subelem.id+'\')">'+submenu_elem.name+'</button>\
                                              <span class="leftmenu_gsub">\
                                                ('+submenu_elem.total+') \
                                                <a type="button" class="del_sub_btn" style="color:#fff;cursor: pointer;" onclick="del_Topic_fun(\''+submenu_elem.productId+'\',\''+subelem.id+'\')">X</a>\
                                              </span>\
                                            </div>';
                                  });
    leftmenu_newlist_html +='        </div>\
                                  </div>\
                            </li>';

  });
  // console.log(leftmenu_newdiv_html);
  // $("#leftmenu_newdiv").html(leftmenu_newdiv_html);
  $("#leftmenu_newlist_sub").html(leftmenu_newlist_html);
  $("#leftmenu_newlist_sub").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div></div></li>" });
  leftmenu_loadJS();
}


//菜单隐藏展开
function leftmenu_loadJS(){
  var tabs_i=0
  // $('.vtitle').click(function(){
    // var _self = $(this);
    // var j = $('.vtitle').index(_self);
    // if( tabs_i == j ) return false; tabs_i = j;
    // $('.vtitle em').each(function(e){
    //   if(e==tabs_i){
    //     $('em',_self).removeClass('v01').addClass('v02');
    //   }else{
    //     $(this).removeClass('v02').addClass('v01');
    //   }
    // });
    // $('.vcon').slideUp().eq(tabs_i).slideDown();
  // });

  // 读取localStorage的数据，将已选类别变蓝
  var lStorage=window.localStorage;
  $('.vtitle').each(function(k,divmenu){
    if($(divmenu)[0].id ==lStorage.proId){
      $($(divmenu)[0].nextElementSibling).show();
      $(divmenu).css('background-color','#2e363e');
    }else{
      $($(divmenu)[0].nextElementSibling).hide();
      $(divmenu).css('background-color','#2a6aa3');
    }
  });
  //如有选主题，已先主题的div变灰（如选类别，则不执行以下操作）
  if(lStorage.productId){
    var tempid ="sub-"+lStorage.productId;
    $('.clearfix').each(function(q,menusub){
      if($(menusub)[0].id==tempid){
         $("#category_edit_span").html(" -主题："+$(menusub)[0].firstElementChild.innerText);
        $(menusub).css('background-color','#e9e9e9');
      }else{
        $(menusub).css('background-color','#ffffff');
      }
    });
    // console.log("主题："+lStorage.productId);
    var post_data = new FormData();
    post_data.append('id',lStorage.productId);
    post_data.append('page',1);
    post_data.append('size',5);
    http.postAjax_clean("/photo-album/product/get_series_product", post_data, function(data){
      createAndInsertHtml(data.page,lStorage.productId);
      createPage_theme(1, 5, data.totlesize);
    });

  }else{

    // console.log("类别："+lStorage.proId);
    $(get_products_bigjson).each(function(m,elemc){
      if(elemc.id == lStorage.proId){
        $("#category_edit_span").html(" -类别："+elemc.productsname);
        // console.log(get_products_prolist_json[m]);
        createAndInsertHtml_promo(get_products_prolist_json[m],lStorage.proId);
        var count = 0;
        for(var key in get_products_prolist_json[m]){
            count++;
        }
        createPage(1, 5, count);
      }
    });
  }
}

//右产品库显示类别产品
function createAndInsertHtml_promo(data,topid){
  $("#all-select-btn").removeAttr("checked");
  var html = '';
  for(var i in data){
    // console.log(data[i]);
    if(i<5){
      if(data[i].cate_tf == 1){
        html += '<tr id="Category-'+data[i].cate_id+'-'+data[i].number+'">\
                  <td><input id="checkbox-'+data[i].cate_id+'" type="checkbox" onchange="all_select_tf()" class="checkbox-btn">&nbsp;&nbsp;</td>\
                  <td><img src="../image/'+data[i].image+';width=240;height=240;equalratio=1" width="120px"></td>\
                  <td class="category_td">产品名称:'+data[i].name+'<br/>产品分类:'+data[i].category+'</td>\
                  <td>'+data[i].number+'</td>\
                  <td>'+data[i].cate_name+'</td>\
                  <td><button class="btn btn-warning" onclick="delFromCategory(this,\''+data[i].cate_id+'\');" id="'+data[i].number+'">从类别移除</button></td>';
      }else{
        html += '<tr id="Theme-'+data[i].cate_id+'-'+data[i].number+'">\
                  <td><input id="checkbox-'+data[i].cate_id+'" type="checkbox" onchange="all_select_tf()" class="checkbox-btn">&nbsp;&nbsp;</td>\
                  <td><img src="../image/'+data[i].image+';width=240;height=240;equalratio=1" width="120px"></td>\
                  <td class="category_td">产品名称:'+data[i].name+'<br/>产品分类:'+data[i].category+'</td>\
                  <td>'+data[i].number+'</td>\
                  <td>'+data[i].cate_name+'</td>\
                  <td><button class="btn btn-warning" onclick="delFromTheme(this,\''+data[i].cate_id+'\');" id="'+data[i].number+'">从主题移除</button></td>';
      }
      html += '</tr>';
    }
  }
  if(html !=''){
    $('tbody').html(html);
    $("#pages_div").show();
  }else{
    $('tbody').html("<tr><td style='padding:20px;text-align:center'>此分类暂无产品，请到“产品管理”——>“产品库”添加！</td></tr>");
    $("#pages_div").hide();
  }
}

//右产品库显示主题产品
function createAndInsertHtml(data,topid){
  // console.log(data);
  // console.log(topid);
  $("#all-select-btn").removeAttr("checked");
  // console.log(data);
  var theme_name= ($("#category_edit_span")[0].innerText).split("：")[1];
  // console.log(theme_name);
  // console.log(topid);
  if(data.length !=0){
    var html = '';
    for(var i=0; i<data.length; i++){
      // console.log(data[i]);
      html += '<tr id="'+data[i].number+'">\
                <td><input type="checkbox" onchange="all_select_tf()" class="checkbox-btn">&nbsp;&nbsp;</td>\
                <td><img src="../image/'+data[i].image+';width=240;height=240;equalratio=1" width="120px"></td>\
                <td class="category_td">产品名称:'+data[i].name+'<br/>产品分类:'+data[i].category+'</td>\
                <td>'+data[i].number+'</td>\
                <td>'+theme_name+'</td>\
                <td><button class="btn btn-warning" onclick="delFromTheme(this,\''+topid+'\'); " id="'+data[i].number+'">从主题移除</button></td>\
              </tr>';
    }
    $('tbody').html(html);
    $("#pages_div").show();
  }else{
    $('tbody').html("<tr><td style='padding:20px;text-align:center'>此分类暂无产品，请到“产品管理”——>“产品库”添加！</td></tr>");
    $("#pages_div").hide();
  }
}

//类别点击产品显示
function promotion_btn_fun(elem){
  $("#all-select-btn").removeAttr("checked");
  product_id = elem ;
  var lStorage=window.localStorage;//获取localStorage对象
  lStorage.proId = elem;
  window.localStorage.removeItem("productId");
  // console.log(lStorage);
  // 读取localStorage的数据，将已选类别变蓝
  $('.vtitle').each(function(k,divmenu){
    if($(divmenu)[0].id ==lStorage.proId){
      $($(divmenu)[0].nextElementSibling).show();
      $(divmenu).css('background-color','#2e363e');
    }else{
      $($(divmenu)[0].nextElementSibling).hide();
      $(divmenu).css('background-color','#2a6aa3');
    }
  });
  $('.clearfix').each(function(q,menusub){
    $(menusub).css('background-color','#fff');
  });




  // console.log(product_id);
  // console.log(get_products_bigjson);
  $(get_products_bigjson).each(function(i,elem){
      // console.log(elem.id);
      if(elem.id == product_id){
        // console.log(get_products_prolist_json[i]);
        $("#category_edit_span").html(" -类别："+elem.productsname);
        createAndInsertHtml_promo(get_products_prolist_json[i],product_id);
        var count = 0;
        for(var key in get_products_prolist_json[i]){
            count++;
        }
        createPage(1, 5, count);
      }
  });
  //批量删除按钮
  $("#multiDel_div").html('<button class="btn btn-danger" id="multi_delete" onclick="multiDel_promo(this,\''+elem+'\')">批量删除</button>');

}

//点击主题产品显示
function theme_click(elem,proidt){
  $("#all-select-btn").removeAttr("checked");
  var lStorage=window.localStorage;//获取localStorage对象
  lStorage.productId = elem;
  lStorage.proId = proidt;
  // console.log(lStorage);
  product_id = elem ;
  // console.log(get_products_bigjson);

  // 读取localStorage的数据，将已选类别变蓝
  var lStorage=window.localStorage;
  // console.log(lStorage);
  // console.log($('.vtitle'));
  $('.vtitle').each(function(k,divmenu){
    if($(divmenu)[0].id ==lStorage.proId){
      $($(divmenu)[0].nextElementSibling).show();
      $(divmenu).css('background-color','#2e363e');
    }else{
      $($(divmenu)[0].nextElementSibling).hide();
      $(divmenu).css('background-color','#2a6aa3');
    }
  });
  //如有选主题，已先主题的div变灰（如选类别，则不执行以下操作）
  if(lStorage.productId){
    var tempid ="sub-"+lStorage.productId;
    // console.log(tempid);
    $('.clearfix').each(function(q,menusub){
      if($(menusub)[0].id==tempid){
        // console.log($(menusub));
        $(menusub).css('background-color','#e9e9e9');
      }else{
        $(menusub).css('background-color','#ffffff');
      }
    });
  }


  $(get_products_bigjson).each(function(i,elem){
    // console.log(elem);
    $(elem.products).each(function(j,subelem){
      if(subelem.productId == product_id){
        $("#category_edit_span").html(" -主题："+subelem.name);
      }
    });
  });

  //批量删除按钮
  $("#multiDel_div").html('<button class="btn btn-danger" id="multi_delete" onclick="multiDel(this,\''+elem+'\')">批量删除</button>');
  var post_data = new FormData();
  post_data.append('id',elem);
  post_data.append('page',1);
  post_data.append('size',5);
  http.postAjax_clean("/photo-album/product/get_series_product", post_data, function(data){
    createAndInsertHtml(data.page,elem);
    createPage_theme(1, 5, data.totlesize);
  });

}

//删除推广类别JS
function del_Promotion_fun(elem){
  $("#all-select-btn").removeAttr("checked");
  if(confirm("确定删除该推广类别?")){
    var id = elem;
    var post_data = new FormData();
    post_data.append('id', id);
    http.postAjax_clean('/photo-album/manger/del_products', post_data, function(data){
      if(data['state']==true){
        location.reload();
      }else{
        alert("删除该推广类别失败.");
      }
    });
  }
}

//删除推广主题
function del_Topic_fun(elem,pro_id){
  $("#all-select-btn").removeAttr("checked");
  if(confirm("确定删除该主题?")){
    var topic_id = elem;
    var promotion_id = pro_id;
    var post_data = new FormData();
    post_data.append('products_id', promotion_id);
    post_data.append('productid', topic_id);
    http.postAjax_clean("/photo-album/manger/del_products_sub_one", post_data, function(data){
      if(data['state']==true){
        location.reload();
      }else{
        alert("删除该主题失败");
      }
    });
  }
}
//页面全选选项JS
function allSelectOs(elem){
  if($(elem).is(':checked')){
    $('tbody').find('input[type=checkbox]').prop('checked', true);
  }else{
    $('tbody').find('input[type=checkbox]').prop('checked', false);
  }
}
//调整推广类别的JS
function updateCategoryShowView(elem){
  alert("正在开发中...");
  // $("#all-select-btn").removeAttr("checked");
  // http.getAjax_clean("/photo-album/manger/get_products", function(data){
  //   showCover(elem);
  //   var classList = [];
  //   for(var i=0; i<data.length; i++){
  //     for(var j=0; j<data[i].products.length; j++){
  //       classList.push(data[i].products[j]);
  //     }
  //   }
  //
  // //调整推广类别JS
  //   var createAndInsertCategoryHtml = function(data_list){
  //
  // //console.log(data_list);//data_list推广类别列表
  //     var html = '<div class="pop_window" style="margin:0 auto;">';
  //     html += '  <div class="pop_window_top">调整推广类别<button onclick="closeCover(this)" class="closewin">X</button></div>';
  //     html += '  <div class="pop_window_center">';
  //     for(var k=0;k<data.length;k++){
  //       html += '  <input type="checkbox" id="'+data[k].id+'" style="margin:0;"/>'+data[k].productsname+'<span style="width:50px;"></span>';
  //       // console.log(data[k].products);
  //       if(data[k].products.length !=0){
  //         html += ':[';
  //         for (var i = 0; i < data[k].products.length; i++) {
  //           html += '  <input type="checkbox" id="'+data[k].products[i].productId+'" style="margin:0;"/><span style="color:#2b6aa2">'+data[k].products[i].name+'</span><span style="width:50px;"></span>';
  //         }
  //         html +=']<br/>';
  //       }else{
  //         html +='<br/>';
  //       }
  //     }
  //     html += '  </div>';
  //     html += '  <div class="pop_window_bottom"><button onclick="updateCategory(this)" class="btn btn-primary">确定</button> <button onclick="closeCover(this)" class="btn btn-default">取消</button></div>';
  //     html += '</div>';
  //     $('#oncover2').html(html);
  //   };
  // //console.log(classList);//classList推广类别列表
  //   createAndInsertCategoryHtml(classList);
  // });
}

//调整推广类别的确认按钮事件
function updateCategory(elem){
  $("#all-select-btn").removeAttr("checked");
  var to_category_list = $('#oncover2').find('input:checked');
  var will_update_category_products = $('tbody').find('input:checked');
  var post_data = new FormData();
  var obj = {
    "linkids": [],
    "products": []
  };
  to_category_list.each(function(){
    obj.linkids.push($(this).attr('id'));
  });
  will_update_category_products.each(function(){
    obj.products.push($(this).parent().parent().attr('id'));
  });

  var jsonObj = JSON.stringify(obj);
  post_data.append('param', jsonObj);
  http.postAjax_clean("/photo-album/product/save_toic", post_data, function(data){
    if(data['state']==true){
      // alert('调整推广类别成功.');
      location.reload();
    }else{
      alert('调整推广类别成功!');
    }
  });
}

//批量删除类别JS
function multiDel_promo(elem,promo_id){
  // alert("正在开发中...");
  var will_delete_category_products = $('tbody').find('input:checked');
  if(will_delete_category_products.length != 0){
    if(confirm("确认批量删除类别产品?")){
      var id_list = [];
      will_delete_category_products.each(function(){
        id_list.push($(this).parent().parent().attr('id'));
      });
      // console.log(id_list);


      for(var i in id_list){
        // console.log(id_list[i].split("-"));
        // console.log(id_list[i].split("-")[0]);

        //批量删除类别产品
        if(id_list[i].split("-")[0] == "Category"){
          var Category_list = [];
          Category_list.push(id_list[i].split("-")[2]);
          var post_data = new FormData();
          post_data.append('gropid',id_list[i].split("-")[1]);
          post_data.append('numberlist',JSON.stringify(Category_list));
          http.postAjax_clean("/photo-album/manger/del_product", post_data, function(data){
            if(data['state'] != true){
              alert('批量删除异常!');
            }
          });
          setTimeout(" ",300);
        }
        //批量删除主题产品
        if(id_list[i].split("-")[0] == "Theme"){
          var post_data = new FormData();
          post_data.append('topid',id_list[i].split("-")[1]);
          post_data.append('number',id_list[i].split("-")[2]);
          http.postAjax_clean("/photo-album/product/remove_topic", post_data, function(data){
            if(data['state'] != true){
              alert('批量删除异常!');
            }
          });
          setTimeout(" ",300);
        }
      }
      //刷新页面
      setTimeout("location.reload();",1000);
    }
  }else{
    alert("还没选择产品，请重新选择！");
  }
}
//批量删除主题JS
function multiDel(elem,them_id){
  alert("正在开发中...");
  // var will_delete_category_products = $('tbody').find('input:checked');
  // if(will_delete_category_products.length != 0){
  //   if(confirm("确认批量删除主题产品?")){
  //     var id_list = [];
  //     will_delete_category_products.each(function(){
  //       id_list.push($(this).parent().parent().attr('id'));
  //     });
  //     // console.log(id_list);
  //     // console.log(them_id);
  //     var post_data = new FormData();
  //     post_data.append('topid', them_id);
  //     post_data.append('lists', JSON.stringify(id_list));
  //     http.postAjax_clean("/photo-album/product/remove_all_topic", post_data, function(data){
  //       if(data['state']==true){
  //         location.reload();
  //       }else{
  //         alert('批量删除异常.');
  //       }
  //     });
  //   }
  // }else{
  //   alert("还没选择产品，请重新选择！");
  // }
}
var showCover = function(elem) {
  $('body').css('overflow', 'hidden');
  $('#cover').show();
  $('#oncover2').show();
};
var closeCover = function(elem) {
  $('body').css('overflow', 'visible');
  $('#cover').hide();
  $('#oncover2').hide();
};

//全选或取消全选事件
function all_select_tf(){
  if($('.checkbox-btn').length != $('.checkbox-btn:checked').length){
    $("#all-select-btn").removeAttr("checked");
  }else{
    // console.log("true");
    $("#all-select-btn").prop("checked",true);
  }
}

//排序JS
function saveOrder() {
  // var data = $("#leftmenu_newlist_sub li").map(function() { return $(this).children().html(); }).get();
  // console.log($("#leftmenu_newlist_sub").children());
  $("#leftmenu_newlist_sub").children().each(function(k,kelem){
    console.log($(kelem)[0].firstElementChild.id);
  });
  // $("input[name=list1SortOrder]").val(data.join("|"));
};
