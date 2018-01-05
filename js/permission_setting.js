$(function () {
    //权限json数据
    var power_json =
          [{
              "name": "客户管理权限",
              "code":"ZKCH",
              "icon": "icon-th",
              "child": [
                  {
                      "name": "客户资料查看",
                      "icon": "icon-minus-sign",
                      "code":"GZZKCH",
                      "parentCode": "ZKCH",
                      "child": [
                        {
                            "name": "全部客户资料查看",
                            "code":"GZZKCHTQFH",
                            "icon": "",
                            "parentCode": "GZZKCH",
                            "child": []
                        },
                        {
                            "name": "大区客户资料查看",
                            "code":"GZZKCHTQFH",
                            "icon": "",
                            "parentCode": "GZZKCH",
                            "child": []
                        },
                        {
                            "name": "区域客户资料查看",
                            "code":"GZZKCHTQFH",
                            "icon": "",
                            "parentCode": "GZZKCH",
                            "child": []
                        }
                      ]
                  },
                  {
                      "name": "客户资料添加",
                      "icon": "",
                      "code":"BJZKCH",
                      "parentCode": "ZKCH",
                      "child": [
                        {
                            "name": "全部客户资料添加",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "BJZKCH",
                            "child": []
                        },
                        {
                            "name": "大区客户资料添加",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "BJZKCH",
                            "child": []
                        },
                        {
                            "name": "区域客户资料添加",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "BJZKCH",
                            "child": []
                        }
                      ]
                  },
                  {
                      "name": "客户资料修改",
                      "icon": "",
                      "code":"modifyman",
                      "parentCode": "ZKCH",
                      "child": [
                        {
                            "name": "全部客户资料修改",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "modifyman",
                            "child": []
                        },
                        {
                            "name": "大区客户资料修改",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "modifyman",
                            "child": []
                        },
                        {
                            "name": "区域客户资料修改",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "modifyman",
                            "child": []
                        }
                      ]
                  },
                  {
                      "name": "客户资料删除",
                      "icon": "",
                      "code":"delman",
                      "parentCode": "ZKCH",
                      "child": [
                        {
                            "name": "全部客户资料删除",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "delman",
                            "child": []
                        },
                        {
                            "name": "大区客户资料删除",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "delman",
                            "child": []
                        },
                        {
                            "name": "区域客户资料删除",
                            "code":"BJZKCHZCFH",
                            "icon": "",
                            "parentCode": "delman",
                            "child": []
                        }
                      ]
                  }
              ]
          }];
    //功能json数据
    var function_json =
        [{
            "name": "菜单管理选择项",
            "code":"ZKCH",
            "icon": "icon-th",
            "child": [
                {
                    "name": "产品管理",
                    "icon": "icon-minus-sign",
                    "code":"productmange",
                    "parentCode": "ZKCH",
                    "child": [
                        {
                            "name": "产品库",
                            "code":"GZZKCHTQFH",
                            "icon": "",
                            "parentCode": "productmange",
                            "child": []
                        },
                        {
                            "name": "产品编辑",
                            "code":"GZZKCHTQFH",
                            "icon": "",
                            "parentCode": "productmange",
                            "child": []
                        }
                    ]
                },
                {
                    "name": "推广类别",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                },
                {
                    "name": "图片中心",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                },
                {
                    "name": "首页定制",
                    "icon": "icon-minus-sign",
                    "code":"firstpage_setting",
                    "parentCode": "ZKCH",
                    "child": [
                      {
                          "name": "快捷推广",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "firstpage_setting",
                          "child": []
                      },
                      {
                          "name": "推广展示",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "firstpage_setting",
                          "child": []
                      },
                      {
                          "name": "首页轮播",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "firstpage_setting",
                          "child": []
                      },
                      {
                          "name": "联系我们",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "firstpage_setting",
                          "child": []
                      },
                      {
                          "name": "启动推广设置",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "firstpage_setting",
                          "child": []
                      },
                    ]
                },
                {
                    "name": "权限设置",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                },
                {
                    "name": "销售管理",
                    "icon": "icon-minus-sign",
                    "code":"sale_manage",
                    "parentCode": "ZKCH",
                    "child": [
                      {
                          "name": "职位设置",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "sale_manage",
                          "child": []
                      },
                      {
                          "name": "销售人员管理",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "sale_manage",
                          "child": []
                      },
                      {
                          "name": "销售团队管理",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "sale_manage",
                          "child": []
                      },
                      {
                          "name": "销售区域设置",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "sale_manage",
                          "child": []
                      }
                    ]
                },
                {
                    "name": "客户管理",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                },
                {
                    "name": "订单管理",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                },
                {
                    "name": "数据统计",
                    "icon": "icon-minus-sign",
                    "code":"data_display",
                    "parentCode": "ZKCH",
                    "child": [
                      {
                          "name": "产品维度",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "data_display",
                          "child": []
                      },
                      {
                          "name": "客户维度",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "data_display",
                          "child": []
                      },
                      {
                          "name": "汇总报表",
                          "code":"GZZKCHTQFH",
                          "icon": "",
                          "parentCode": "data_display",
                          "child": []
                      }
                    ]
                },
                {
                    "name": "用户反馈",
                    "icon": "",
                    "code":"BJZKCH",
                    "parentCode": "ZKCH",
                    "child": []
                }
            ]
        }, {
            "name": "功能按钮选项",
            "code":"ZKKJ",
            "icon": "icon-th",
            "child": [
                {
                    "name": "客户管理",
                    "code":"GZZKKJ",
                    "icon": "icon-minus-sign",
                    "parentCode": "ZKKJ",
                    "child": [
                      {
                          "name": "查看客户功能",
                          "code":"GZTHZKKJ",
                          "icon": "",
                          "parentCode": "GZZKKJ",
                          "child": []
                      },
                      {
                          "name": "添加客户功能",
                          "code":"GZTHZKKJ",
                          "icon": "",
                          "parentCode": "GZZKKJ",
                          "child": []
                      },
                      {
                          "name": "修改客户功能",
                          "code":"GZTHZKKJ",
                          "icon": "",
                          "parentCode": "GZZKKJ",
                          "child": []
                      },
                      {
                          "name": "删除客户功能",
                          "code":"GZTHZKKJ",
                          "icon": "",
                          "parentCode": "GZZKKJ",
                          "child": []
                      },
                    ]
                }
            ]
        }];


        function tree(data) {
          // console.log(data);
            for (var i = 0; i < data.length; i++) {
                var data2 = data[i];
                if (data[i].icon == "icon-th") {
                  // $("#rootUL").append("<li data-name='" + data[i].code + "'><span><i class='" + data[i].icon + "'></i> " + data[i].name + "<button type='button' class='btn btn-success'>X</button></span></li>");
                  $("#rootUL").append("<li data-name='" + data[i].code + "'><span><i class='" + data[i].icon + "'></i> " + data[i].name + "<button type='button' class='btn btn-default' style='border-radius:50%;'>X</button></span></li>");
                } else {
                    var children = $("li[data-name='" + data[i].parentCode + "']").children("ul");
                    if (children.length == 0) {
                        $("li[data-name='" + data[i].parentCode + "']").append("<ul></ul>")
                    }
                    $("li[data-name='" + data[i].parentCode + "'] > ul").append(
                        "<li data-name='" + data[i].code + "'>" +
                        "<span>" +
                        "<i class='" + data[i].icon + "'></i> " +
                        data[i].name +
                        "<button type='button' class='btn btn-default' style='border-radius:50%;'>X</button></span>" +
                        "</li>")
                }
                for (var j = 0; j < data[i].child.length; j++) {
                    var child = data[i].child[j];
                    var children = $("li[data-name='" + child.parentCode + "']").children("ul");
                    if (children.length == 0) {
                        $("li[data-name='" + child.parentCode + "']").append("<ul></ul>")
                    }
                    $("li[data-name='" + child.parentCode + "'] > ul").append(
                        "<li data-name='" + child.code + "'>" +
                        "<span>" +
                        "<i class='" + child.icon + "'></i>" +
                        child.name +
                        "<button type='button' class='btn btn-default' style='border-radius:50%;'>X</button></span>" +
                        "</li>")
                    var child2 = data[i].child[j].child;
                    tree(child2)
                }
                tree(data[i]);
            }

        }

        function righttree(data) {
          // console.log(data);
            for (var i = 0; i < data.length; i++) {
                var data2 = data[i];
                if (data[i].icon == "icon-th") {
                  // $("#rootUL").append("<li data-name='" + data[i].code + "'><span><i class='" + data[i].icon + "'></i> " + data[i].name + "<button type='button' class='btn btn-success'>X</button></span></li>");
                  $("#rootUL1").append("<li data-name='" + data[i].code + "tt'><span><i class='" + data[i].icon + "'></i> " + data[i].name + "<button type='button' class='btn btn-default' style='border-radius:50%;margin:0 5px 0 5px'>X</button></span></li>");
                } else {
                    var children = $("li[data-name='" + data[i].parentCode + "tt']").children("ul");
                    if (children.length == 0) {
                        $("li[data-name='" + data[i].parentCode + "tt']").append("<ul></ul>")
                    }
                    $("li[data-name='" + data[i].parentCode + "tt'] > ul").append(
                        "<li data-name='" + data[i].code + "tt'>" +
                        "<span>" +
                        "<i class='" + data[i].icon + "tt'></i>  <input name='Checkbox1' type='checkbox' style='margin:0px 10px 0px 10px;'/> " +
                        data[i].name +
                        "<button type='button' class='btn btn-default' style='border-radius:50%;'>X</button></span>" +
                        "</li>")
                }
                for (var j = 0; j < data[i].child.length; j++) {
                    var child = data[i].child[j];
                    var children = $("li[data-name='" + child.parentCode + "tt']").children("ul");
                    if (children.length == 0) {
                        $("li[data-name='" + child.parentCode + "tt']").append("<ul></ul>")
                    }
                    $("li[data-name='" + child.parentCode + "tt'] > ul").append(
                        "<li data-name='" + child.code + "tt'>" +
                        "<span>" +
                        "<i class='" + child.icon + "tt'></i>  <input name='Checkbox1' type='checkbox' style='margin:0px 10px 0px 10px;'/>" +
                        child.name +
                        "<button type='button' class='btn btn-default' style='border-radius:50%;'>X</button></span>" +
                        "</li>")
                    var child2 = data[i].child[j].child;
                    righttree(child2)
                }
                righttree(data[i]);
            }

        }

    //权限json数据渲染
    tree(power_json);
    //功能json数据渲染
    righttree(function_json);

    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', '关闭');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', '展开').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', '关闭').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });

    $('.tree1 li:has(ul)').addClass('parent_li').find(' > span').attr('title', '关闭');
    $('.tree1 li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', '展开').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', '关闭').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });
});
