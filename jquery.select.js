;(function($){
    //默认参数
    var defaluts = {
        select: "hw-select",
        select_text: "select_text",
        select_ul: "select_ul",
        multiple: true,//是否实现多选
        width: "",//select宽度重定义
        select_val: ""//存储值元素

    };
    $.fn.extend({
        "select": function(options){
            var opts = $.extend({}, defaluts, options);
            return this.each(function(){
                var $this = $(this);
                //元素多次初始化时，移除之前初始化select模板
                $this.siblings("div." + opts.select).remove();
                //如果绑定数据元素存在，把数据源元素值付给select
                if ($this.attr("relateElement") && opts.multiple) {
                    if ($.trim($("#" + $this.attr("relateElement")).val()).length > 0) {
                        var selectedArr = $("#" + $this.attr("relateElement")).val().split(",");
                        $this.val(selectedArr);
                    };

                }
                //创建select风格模板
                 var _dropDownHtml = [];
                _dropDownHtml.push("<div class=\"" + $this.attr('class') + "\">");
                _dropDownHtml.push("<div class=\"" + opts.select_text + "\">" + $this.find(":selected").text() + "</div>");
                _dropDownHtml.push("<ul class=\"" + opts.select_ul + "\">");
                var selectText = [];
                var selectVal = [];
                $this.children("option").each(function () {
                    var option = $(this);
                    if (opts.multiple) {
                        if (option.is(":selected")) {
                            _dropDownHtml.push("<li class=\"selected\" data-value=\"" + option.val() + "\">" + "<input type=\"checkbox\" class=\"checkbox\" checked=\"checked\"/><span class=\"t\">" + option.text() + "</span></li>");
                            selectText.push($.trim(option.text()));
                            selectVal.push($.trim(option.val()));
                        } else {
                            _dropDownHtml.push("<li data-value=\"" + option.val() + "\">" + "<input type=\"checkbox\" class=\"checkbox\"/><span class=\"t\">" + option.text() + "</span></li>");
                        }
                    }
                    else {
                        if (option.is(":selected")) {
                            _dropDownHtml.push("<li class=\"selected\" data-value=\"" + option.val() + "\">" + "<span class=\"t\">" + option.text() + "</span></li>");
                            selectText.push($.trim(option.text()));
                            selectVal.push($.trim(option.val()));
                        } else {
                            _dropDownHtml.push("<li data-value=\"" + option.val() + "\">" + "<span class=\"t\">" + option.text() + "</span></li>");
                        }
                    }
                });
                _dropDownHtml.push("</ul>");
                _dropDownHtml.push("</div>");
                //关联select选中状态
                $this.attr("data-value", selectVal.join(","));
                $this.val(selectVal);
                var select = $(_dropDownHtml.join(""));
                var select_text = select.find("." + opts.select_text).text(selectText.join("，"));//中文逗号，增加间隔
                var select_ul = select.find("." + opts.select_ul);
                $this.after(select);
                $this.hide();
                //如果为单选宽度不限制
                if (!opts.multiple) {
                    select.css("width", $this.width()-3);
                    select_text.width(select.width() - 10);
                    select_ul.css("width", "100%");
                }
                //如果属性中定义width属性
                if ($this.attr("width")) {
                    var select_width = $this.attr("width").indexOf("%") > 0 ? $this.attr("width") : parseInt($this.attr("width")) + "px";
                    select.css("width", select_width);
                    select_text.width(select.width() - 10);
                    select_ul.css("width", "100%");
                }
                //自定义宽度
                if (opts.width.length > 0) {
                    select.css("width",opts.width);
                    select_text.width(select.width() - 10);
                    select_ul.css("width", opts.width);
                }
                //下拉列表操作
                select.click(function (event) {
                    $(this).find("." + opts.select_ul).slideToggle();
                    $("div." + opts.select).not(this).find("." + opts.select_ul).slideUp();
                    event.stopPropagation();
                });
                //点击空白列表收起
                $("body").click(function () {
                    select_ul.slideUp();
                });
                 //列表项点击操作
                select_ul.on("click", "li", function (event) {
                    var _li = $(this);
                    var li_Text = _li.find(".t").text();
                    var li_Value = _li.attr("data-value");
                    var tag = 0;
                    var tag1 = 0;
                    if ($.trim(select_text.text()).length == 0) {
                        var selectedName = [];
                        var selectedVal = [];
                    } else {
                        var selectedName = select_text.text().split("，");//中文逗号，增加间隔
                        var selectedVal = $this.attr("data-value").split(",");
                    }
                    if (_li.find(".checkbox").is(':checked') && opts.multiple) {
                        _li.removeClass("selected").find(".checkbox").prop("checked", false);
                        for (var i = 0; i < selectedName.length; i++) {
                            if (selectedName[i] == li_Text) {
                                selectedName.splice(i, 1);
                                break;
                            }
                        }
                        for (var i = 0; i < selectedVal.length; i++) {
                            if (selectedVal[i] == li_Value) {
                                selectedVal.splice(i, 1);
                                break;
                            }
                        }
                    } else if (!(_li.find(".checkbox").is(':checked')) && opts.multiple) {
                        _li.addClass("selected").find(".checkbox").prop("checked", true);
                        for (var i = 0; i < selectedName.length; i++) {
                            if (selectedName[i] == li_Text) {
                                break;
                            } else {
                                tag++;
                            }
                        }
                        for (var i = 0; i < selectedVal.length; i++) {
                            if (selectedVal[i] == li_Value) {
                                break;
                            } else {
                                tag1++;
                            }
                        }
                        if (tag == selectedName.length) {
                            selectedName.push(li_Text);
                        }
                        if (tag1 == selectedVal.length) {
                            selectedVal.push(li_Value);
                        }
                    } else if (!opts.multiple) {
                        _li.addClass("selected").siblings("li").removeClass("selected");
                        if (li_Value !== $this.val()) {
                            select_text.text(li_Text);
                            $this.val(li_Value);
                            $this.attr("data-value", li_Value);
                        }
                        setTimeout(function () { select_ul.slideUp(); }, 100);
                    };
                    if (opts.multiple) {
                        //动态改变选中文本和value
                        select_text.text(selectedName.join("，"));//中文逗号，增加间隔
                        $this.attr("data-value", selectedVal.join(","));
                        //选中value赋值给select
                        $this.val(selectedVal);
                        $this.children("option").each(function () {
                            var $option = $(this);
                            if (selectedVal.length == 0) {
                                $option.removeAttr("selected");
                            } else {
                                for (var x in selectedVal) {
                                    if ($option.val() == selectedVal[x]) {
                                        $option.attr("selected", "selected");
                                        break;
                                    } else {
                                        $option.removeAttr("selected");
                                    }
                                }
                            }
                        });
                    }
                    //赋值给其他元素
                    if (opts.select_val.length>0) {
                        $(opts.select_val).val(selectedVal.join(","));
                    }
                    if ($this.attr("relateElement")) {
                        $("#" + $this.attr("relateElement")).val(selectedVal.join(","));
                    }
                    //点击回调
                    if (opts.select_callBack) {
                        opts.select_callBack(li_Value);
                    }
                    //阻止冒泡
                    event.stopPropagation();
                });

            });
        }
    });
})(jQuery);
//页面加载完进行调用
$(function () {
    $("select.hw-select").each(function () {
        _this = $(this);
        if (typeof _this.attr("customize") == "undefined" && _this.attr("multiple")) {
            _this.select({
                multiple: true
            });
        } else if (typeof _this.attr("customize") == "undefined" && typeof _this.attr("multiple")=="undefined") {
           _this.select({
               multiple: false
            });
        } 
    });
});