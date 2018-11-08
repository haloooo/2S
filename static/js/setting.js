angular.module("AppSetting", [])
    .run(
        function($rootScope, $http, $interval, $location) {
            $rootScope.types = ['Yield','NG COUNT'];
            $rootScope.selectedLine = '';
            $rootScope.userid = localStorage.getItem('two_userid');
            $rootScope.user_name = localStorage.getItem('two_user_name');
            $rootScope.user_password = localStorage.getItem('two_user_password');
            $rootScope.is_admin = localStorage.getItem('two_is_admin');
            $rootScope.true_name = localStorage.getItem('two_true_name');
            $rootScope.see_setting = localStorage.getItem('two_see_setting');
            $rootScope.initSetting = function () {
                var url = 'init_setting';
                $http.get(url).success(function(result)
                {
                    $rootScope.dataList = result;
                    console.log(result);
                }).error(function () {

                });
            };
            $rootScope.showUpdate = function(item){
                $rootScope.selectedLine = item;
                $("#update").modal('show');
            };
            $rootScope.showDelete = function(ID){
                var url = 'delete_process';
                $http.get(url,{params:{
                        'ID':ID
                    }}).success(function(result)
                {
                    if(result[0].status === 'ok'){
                        location.reload();
                        toastr.info('删除成功');
                    }else{
                        toastr.info('删除失败');
                    }
                }).error(function () {
                    toastr.info('删除失败');
                });
            };
            $rootScope.showAdd = function(){
                $rootScope.selectedLine = '';
                $("#add").modal('show');
            };
            $rootScope.commit = function(){
                var url = 'update_process';
                var data = $rootScope.selectedLine;
                if(data["MODEL"] === ''){
                    toastr.error('MODEL NAME不能为空');
                    return
                }
                if(data["NAME"] === ''){
                    toastr.error('CONFIG NAME不能为空');
                    return
                }
                if(data["PROCESS_NAME"] === ''){
                    toastr.error('PROCESS NAME不能为空');
                    return
                }
                if(data["INSPECT"] === ''){
                    toastr.error('INSPECT ITEM不能为空');
                    return
                }
                if(data["DATA_TYPE"] === ''){
                    toastr.error('JIG ID不能为空');
                    return
                }
                if( data["JIG_TYPE"] === ''){
                    toastr.error('JIG JUDGE RULE不能为空');
                    return
                }
                if(data["JIG_S"] === ''){
                    toastr.error('JIG BORDER上限不能为空');
                    return
                }
                if(data["JIG_E"] === ''){
                    toastr.error('JIG BORDER下限不能为空');
                    return
                }
                if(data["PROCESS_TYPE"] === ''){
                    toastr.error('PROCESS JUDGE RULE不能为空');
                    return
                }
                if(data["PROCESS_S"] === ''){
                    toastr.error('PROCESS BORDER上限不能为空');
                    return
                }
                if(data["PROCESS_E"] === ''){
                    toastr.error('PROCESS BORDER下限不能为空');
                    return
                }
                if(data["LIMIT"] === ''){
                    toastr.error('TOTAL INPUT LIMIT不能为空');
                    return
                }

                $http.get(url,{params:{
                        'process':data
                    }}).success(function(result)
                {
                    if(result[0].status === 'ok'){
                        toastr.info('修改成功');
                    }else{
                        toastr.info('修改失败');
                    }
                    $("#update").modal('hide');
                }).error(function () {
                    toastr.info('修改失败');
                    $("#update").modal('hide');
                });
            };
            $rootScope.add = function(){
                if($("#add_MODEL").val() === ''){
                    toastr.error('MODEL NAME不能为空');
                    return
                }
                if($("#add_NAME").val() === ''){
                    toastr.error('CONFIG NAME不能为空');
                    return
                }
                if($("#add_PROCESS_NAME").val() === ''){
                    toastr.error('PROCESS NAME不能为空');
                    return
                }
                if($("#add_INSPECT").val() === ''){
                    toastr.error('INSPECT ITEM不能为空');
                    return
                }
                if($("#add_DATA_TYPE").val() === ''){
                    toastr.error('JIG ID不能为空');
                    return
                }
                // if($("#add_JIG_TYPE").val() === ''){
                //     toastr.error('JIG TYPE不能为空');
                //     return
                // }
                if( $("#add_JIG_TYPE option:selected").text()=== ''){
                    toastr.error('JIG JUDGE RULE不能为空');
                    return
                }
                if($("#add_JIG_S").val() === ''){
                    toastr.error('JIG BORDER上限不能为空');
                    return
                }
                if($("#add_JIG_E").val() === ''){
                    toastr.error('JIG BORDER下限不能为空');
                    return
                }
                if($("#add_PROCESS_TYPE option:selected").text() === ''){
                    toastr.error('PROCESS JUDGE RULE不能为空');
                    return
                }
                if($("#add_PROCESS_S").val() === ''){
                    toastr.error('PROCESS BORDER上限不能为空');
                    return
                }
                if($("#add_PROCESS_E").val() === ''){
                    toastr.error('PROCESS BORDER下限不能为空');
                    return
                }
                if($("#add_LIMIT").val() === ''){
                    toastr.error('TOTAL INPUT LIMIT不能为空');
                    return
                }
                var url = 'add_process';
                $http.get(url,{params:{
                        'process':$rootScope.selectedLine
                    }}).success(function(result)
                {
                    if(result[0].status === 'ok'){
                        location.reload();
                        toastr.info('添加成功');
                    }else{
                        toastr.info('添加失败');
                    }
                    $("#add").modal('hide');
                }).error(function () {
                    toastr.info('添加失败');
                    $("#add").modal('hide');
                });
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
            $rootScope.close_update = function(){
                $("#update").modal('hide');
                location.reload();
            };
            $rootScope.initSetting();
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