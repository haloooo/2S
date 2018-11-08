angular.module("AppSerialDetail", [])
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
            $rootScope.initData = function () {
                $('#loading').show();
                var model_name = $rootScope.getQueryString('model_name');
                var process_cd = $rootScope.getQueryString('process_cd');
                var datatype_id = $rootScope.getQueryString('datatype_id');
                var line_cd = $rootScope.getQueryString('line_cd');
                var station_slot = $rootScope.getQueryString('station_slot');
                var start_time = $rootScope.getQueryString('start_time');
                var end_time = $rootScope.getQueryString('end_time');

                $rootScope.model_name = model_name;
                $rootScope.line_cd = line_cd;
                $rootScope.process_cd = process_cd;
                $rootScope.datatype_id = datatype_id;
                $rootScope.station_slot = station_slot;

                var url = 'get_SerialList';
                $http.get(url,{
                    params:{
                        'model_name':model_name,
                        'process_cd':process_cd,
                        'datatype_id':datatype_id,
                        'line_cd':line_cd,
                        'station_slot':station_slot,
                        'start_time':start_time,
                        'end_time':end_time
                    }
                }).success(function (result) {
                    $('#loading').hide();
                    if(parseInt(result) === 101)
                    {
                        toastr.error('Connect to database failed');
                        return;
                    }
                    else if(parseInt(result) === 102)
                    {
                        toastr.error('Operate database failed');
                        return;
                    }
                    $rootScope.serialList = result[0]['statistics_result'];
                    $rootScope.ng_count = result[0]['ng_count'];
                    $rootScope.in_count = result[0]['in_count'];
                    $rootScope.yield_ = result[0]['Yield'];
                }).error(function () {
                    $('#loading').hide();
                    toastr.error('Operate database failed');
                });
            };
            $rootScope.inspectData = function (serial_code) {
                $('#loading').show();
                $rootScope.serial_code = serial_code;
                var model_name = $rootScope.getQueryString('model_name');
                var process_cd = $rootScope.getQueryString('process_cd');
                var datatype_id = $rootScope.getQueryString('datatype_id');
                var line_cd = $rootScope.getQueryString('line_cd');
                var station_slot = $rootScope.getQueryString('station_slot');
                var start_time = $rootScope.getQueryString('start_time');
                var end_time = $rootScope.getQueryString('end_time');
                var url = 'get_InspectList';
                $http.get(url,{params:{
                       'model_name':model_name,
                        'process_cd':process_cd,
                        'datatype_id':datatype_id,
                        'line_cd':line_cd,
                        'station_slot':station_slot,
                        'start_time':start_time,
                        'end_time':end_time,
                        'serial_cd':serial_code
                    }
                }).success(function (result) {
                    $rootScope.inspect = result;
                    console.log(result);
                    if(parseInt(result) === 101)
                    {
                        toastr.error('Connect to database failed');
                        $('#loading').hide();
                        return;
                    }
                    else if(parseInt(result) === 102)
                    {
                        toastr.error('Operate database failed');
                        $('#loading').hide();
                        return;
                    }
                    $("#InspectModal").modal();
                    $('#loading').hide();
                }).error(function () {
                    $('#loading').hide();
                });
            };
            $rootScope.showInspect = function (serial_code) {
                $rootScope.inspectData(serial_code);
            };

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

            $rootScope.initData();
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
