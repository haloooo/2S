angular.module("AppWarningDetail", [])
    .run(
        function($rootScope, $http, $interval, $location) {
            $rootScope.userid = localStorage.getItem('two_userid');
            $rootScope.user_name = localStorage.getItem('two_user_name');
            $rootScope.user_password = localStorage.getItem('two_user_password');
            $rootScope.is_admin = localStorage.getItem('two_is_admin');
            $rootScope.true_name = localStorage.getItem('two_true_name');
            $rootScope.see_setting = localStorage.getItem('two_see_setting');
            $rootScope.getQueryString = function (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r !== null) {
                    return unescape(r[2]);
                }
                return null;
            };
            $rootScope.initChart = function () {
                $("#loading").show();
                //获取页面URL参数
                var model_name = $rootScope.getQueryString('model_name');
                var process_cd = $rootScope.getQueryString('process_cd');
                var datatype_id = $rootScope.getQueryString('datatype_id');
                var line_cd = $rootScope.getQueryString('line_cd');
                var start_time = $rootScope.getQueryString('start_time');
                var end_time = $rootScope.getQueryString('end_time');
                var url = 'get_DetailList';
                $rootScope.model_name = model_name;
                $rootScope.process_cd = process_cd;
                $rootScope.datatype_id = datatype_id;
                $rootScope.line_cd = line_cd;
                $rootScope.line_ng = $rootScope.getQueryString('ng');
                $rootScope.line_in = $rootScope.getQueryString('in');
                $rootScope.line_yield = $rootScope.getQueryString('yield');
                $rootScope.start_time = start_time;
                $rootScope.end_time = end_time;
                $http.get(url,{
                    params:{
                        'model_name':model_name,
                        'process_cd':process_cd,
                        'datatype_id':datatype_id,
                        'line_cd':line_cd,
                        'start_time':start_time,
                        'end_time':end_time
                    }
                }).success(function(val){
                    $("#loading").hide();
                    if(val.length > 0){
                        $rootScope.JIG = val[0].JIG;
                        $rootScope.ng_info = val;
                        $rootScope.PROCESS_YIELD = val[0].PROCESS_YIELD;
                        $rootScope.PROCESS_type = val[0].PROCESS_type;
                        $rootScope.JIG_type = val[0].JIG_type;
                        $rootScope.col = ['in','-Cum'];//默认按Detractor列降序+Cum列升序排序
                        $rootScope.desc = 1;//默认排序条件升序
                    }
                })
            };
            $rootScope.do_homePage = function () {
                var model_name = $rootScope.selectedModel;
                var process_cd = $rootScope.selectedProcess;
                var datatype_id = $rootScope.selectedDataType;
                window.location.href = 'go_homePage?model_name='+model_name+'&process_cd='+process_cd+'&datatype_id='+datatype_id;
            };

            //计算各个产线（Line）的颜色
            $rootScope.linesColor = function (line,in_count,yield_count) {
                // if(parseInt(in_count) == 0){
                //     return {"background-image": "url(../static/sources/images/gray.png)"};
                // }else{
                //     if(parseInt(yield_count)>=0 && parseInt(yield_count) < parseInt(red)){
                //         return {"background-image": "url(../static/sources/images/red.png)"};
                //     }
                //     if(parseInt(yield_count) >= parseInt(red) && parseInt(yield_count) < parseInt(yellow)){
                //         return {"background-image": "url(../static/sources/images/yellow.png)"};
                //     }
                //     if(parseInt(yield_count) >= parseInt(yellow)){
                //         return {"background-image": "url(../static/sources/images/green.png)"};
                //     }
                // }
                var ng_rgb = $rootScope.PROCESS_YIELD;
                var process_type = $rootScope.PROCESS_type;
                if(in_count == 0){
                    return {"background-image": "url(../static/sources/images/gray.png)"};
                }else{
                    if(process_type == 'Yield'){
                        if(parseInt(yield_count)>=0 && parseInt(yield_count) < parseInt(ng_rgb[1])){
                            return {"background-image": "url(../static/sources/images/red.png)","cursor": "pointer","animation": "twinkling 1s alternate infinite"};
                        }
                        if(parseInt(yield_count) >= ng_rgb[1] && parseInt(yield_count) < ng_rgb[0]){
                            return {"background-image": "url(../static/sources/images/yellow.png)","cursor": "pointer","animation": "twinkling 1s alternate infinite"};
                        }
                        if(parseInt(yield_count) >= parseInt(ng_rgb[0])){
                            return {"background-image": "url(../static/sources/images/green.png)","cursor": "pointer"};
                        }
                    }else if(process_type == 'NG COUNT'){
                        if(parseInt(jig_count) >= parseInt(ng_rgb[1])){
                            return {"background-image": "url(../static/sources/images/red.png)","cursor": "pointer","animation": "twinkling 1s alternate infinite"};
                        }
                        if(parseInt(jig_count) >= ng_rgb[0] && parseInt(jig_count) < ng_rgb[1]){
                            return {"background-image": "url(../static/sources/images/yellow.png)","cursor": "pointer","animation": "twinkling 1s alternate infinite"};
                        }
                        if(parseInt(jig_count)>=0 && parseInt(jig_count) < parseInt(ng_rgb[0])){
                            return {"background-image": "url(../static/sources/images/green.png)","cursor": "pointer"};
                        }
                    }
                }


            };

            $rootScope.JIGColor = function (count,yield_) {
                var JIG = $rootScope.JIG;
                // if(count < JIG[0]){
                //     // return {"background-color" : "#3C8DBC"};
                //     return {"background-color" : "#7FFFAA"};
                // }
                // if(count >= JIG[0] && count < JIG[1]){
                //     return {"background-color" : "#FF8C00"};
                // }
                // if(count >= JIG[1]){
                //     return {"background-color" : "#FF0000"};
                // }
                var JIG = $rootScope.JIG;
                var JIG_Type = $rootScope.JIG_type;
                if(JIG_Type == 'NG COUNT'){
                    if(parseInt(count) < parseInt(JIG[0])){
                        return {"background-color" : "#7FFFAA"};
                    }
                    if(parseInt(count) >= parseInt(JIG[0]) && parseInt(count) < parseInt(JIG[1])){
                        return {"background-color" : "#FF8C00"};
                    }
                    if(parseInt(count) >= parseInt(JIG[1])){
                        return {"background-color" : "#FF0000"};
                    }
                }else if(JIG_Type == 'Yield'){
                    if(parseInt(yield_) < parseInt(JIG[1])){
                        // return {"background-color" : "#7FFFAA"};

                        return {"background-color" : "#FF0000"};
                    }
                    if(parseInt(yield_) < parseInt(JIG[0]) && parseInt(yield_) >= parseInt(JIG[1])){
                        return {"background-color" : "#FF8C00"};
                    }
                    if(parseInt(yield_) >= parseInt(JIG[0])){
                        // return {"color" : "#FF0000"};
                        return {"background-color" : "#7FFFAA"};
                    }
                }
            };

            $rootScope.initPic = function () {
                $('#JIG2').hide();
                $('#NG_Count2').hide();
                $('#IN2').hide();
                $('#Yield2').hide();
                $('#JIG1').show();
                $('#NG_Count1').show();
                $('#IN1').show();
                $('#Yield1').show();
            };

            $rootScope.show_JIG = function () {
                if($('#JIG1').is(':hidden')){
                    $rootScope.initPic();
                    $('#JIG1').show();
                    $('#JIG2').hide();
                }
                else
                {
                    $rootScope.initPic();
                    $('#JIG1').hide();
                    $('#JIG2').show();
                }
            };

            $rootScope.show_NG_Count = function () {
                if($('#NG_Count1').is(':hidden')){
                    $rootScope.initPic();
                    $('#NG_Count1').show();
                    $('#NG_Count2').hide();
                }
                else
                {
                    $rootScope.initPic();
                    $('#NG_Count1').hide();
                    $('#NG_Count2').show();
                }
            };

            $rootScope.show_IN = function () {
                if($('#IN1').is(':hidden')){
                    $rootScope.initPic();
                    $('#IN1').show();
                    $('#IN2').hide();
                }
                else
                {
                    $rootScope.initPic();
                    $('#IN1').hide();
                    $('#IN2').show();
                }
            };

            $rootScope.show_Yield = function () {
                if($('#Yield1').is(':hidden')){
                    $rootScope.initPic();
                    $('#Yield1').show();
                    $('#Yield2').hide();
                }
                else
                {
                    $rootScope.initPic();
                    $('#Yield1').hide();
                    $('#Yield2').show();
                }
            };
            var yellow = $rootScope.getQueryString('yellow');
            var red = $rootScope.getQueryString('red');

            // 弹出修改密码和注销
            $rootScope.showMenu = function () {
                if (!$rootScope.show_menu) {
                    $("#show_menu").show();
                    $rootScope.show_menu = true;
                } else {
                    $("#show_menu").hide();
                    $rootScope.show_menu = false;
                }
            };

            //注销
            $rootScope.logout = function () {
                // 清空 LocalSotrge
                localStorage.removeItem('two_userid');
                localStorage.removeItem('two_user_name');
                localStorage.removeItem('two_user_password');
                localStorage.removeItem('two_is_admin');
                localStorage.removeItem('two_true_name');
                localStorage.removeItem('two_see_setting');
                window.open('go_login', '_self')
            };

            //打开修改密码弹出框
            $rootScope.showPassword = function () {
                $("#show_menu").hide();
                $rootScope.show_menu = false;
                $('#passwordModel').modal();
                $("#oldpassword").val("");
                $("#newpassword").val("");
                $("#r_newpassword").val("");
            };

            //生成csrftoken
            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return decodeURI(arr[2]);
                else
                    return null;
            }

            //修改密码
            $rootScope.savePassword = function() {
                if (!$("#oldpassword").val() || $("#oldpassword").val() == "") {
                    toastr.warning("原密码不能为空");
                    return;
                }
                if (!$("#newpassword").val() || $("#newpassword").val() == "") {
                    toastr.warning("新密码不能为空");
                    return;
                }
                if (!$("#r_newpassword").val() || $("#r_newpassword").val() == "") {
                    toastr.warning("请再次输入新密码");
                    return;
                }
                if ($("#newpassword").val() != $("#r_newpassword").val()) {
                    toastr.warning("新密码两次不一致");
                    return;
                }
                if ($("#oldpassword").val() == $("#newpassword").val()) {
                    toastr.warning("新密码不能与旧密码一致");
                    return;
                }
                $.ajax({
                    headers: {"X-CSRFToken": getCookie("csrftoken")},
                    url: "updatePassword",
                    type: 'POST', //GET、PUT、DELETE
                    async: false,    //是否异步
                    timeout: 10000,    //超时时间
                    data: {
                        "user_id": $rootScope.userid,
                        "oldpassword": $("#oldpassword").val(),
                        "newpassword": $("#newpassword").val(),
                    },
                    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
                    beforeSend: function (xhr) {
                        // 发送前处理
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data[0]['code'] == "0") {
                            toastr.success("修改成功");
                            $('#passwordModel').modal('hide');
                        } else {
                            toastr.error(data[0]['msg']);
                        }
                    },
                    error: function (xhr, textStatus) {
                        // 调用时，发生错误
                        toastr.warning(textStatus);
                    },
                    complete: function () {
                        // 交互后处理
                    }
                })
            };


            $rootScope.initChart();
            $rootScope.initPic();
        });

$(function () {
    if(localStorage.getItem('two_userid') == null){
        window.open('go_login', '_self'); //没找到apptoken就返回登陆界面
    }else{
        if(localStorage.getItem('two_is_admin') == 't'){
            $('#go_setting').show();
            $('#go_user').show();
        }else{
            if(localStorage.getItem('two_see_setting') == '0'){
                $('#go_setting').hide();
                $('#go_user').hide();
            }else{
                $('#go_setting').show();
                $('#go_user').hide();
            }
        }
    }
});
