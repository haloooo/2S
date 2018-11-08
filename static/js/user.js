angular.module("AppUser", [])
    .run(
        function($rootScope, $http, $interval, $location) {
            $rootScope.user = '';
            $rootScope.userid = localStorage.getItem('two_userid');
            $rootScope.user_name = localStorage.getItem('two_user_name');
            $rootScope.user_password = localStorage.getItem('two_user_password');
            $rootScope.is_admin = localStorage.getItem('two_is_admin');
            $rootScope.true_name = localStorage.getItem('two_true_name');
            $rootScope.see_setting = localStorage.getItem('two_see_setting');
            $rootScope.initUser = function(){
                var url = 'get_all_user';
                $http.get(url).success(function(result)
                {
                    $rootScope.userList = result;
                }).error(function () {

                });
            };
            $rootScope.showAdd = function () {
                $('#add').modal('show');
            };
            $rootScope.add = function () {
                if($("#add_username").val() === ''){
                    toastr.error('用户名不能为空');
                    return
                }
                if($("#add_password").val() === ''){
                    toastr.error('密码不能为空');
                    return
                }
                if($("#add_true_name").val() === ''){
                    toastr.error('姓名不能为空');
                    return
                }
                var url = 'add_new_user';
                if($('#add_see_setting').is(':checked')){
                    $rootScope.user.see_setting = true;
                }else{
                    $rootScope.user.see_setting = false;
                }
                $http.get(url,{params:{
                        'user':$rootScope.user
                    }}).success(function(result)
                {
                    if(result[0].status === 'ok'){
                        location.reload();
                        toastr.info('add success');
                    }else{
                        toastr.info('add failed');
                    }
                    $("#add").modal('hide');
                }).error(function () {
                    toastr.info('add failed');
                    $("#add").modal('hide');
                });
            };
            $rootScope.update = function(){
                var url = 'update_user';
                $http.get(url,{params:{
                        'user':$rootScope.selectedLine
                    }}).success(function(result)
                {
                    if(result[0].status === 'ok'){
                        location.reload();
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
            $rootScope.close = function(){
                location.reload();
            };
            $rootScope.showUpdate = function(item){
                if(item.see_setting == 0){
                    item.see_setting = false;
                }else{
                    item.see_setting = true;
                }
                $rootScope.selectedLine = item;
                $("#update").modal('show');
            };
            $rootScope.showDelete = function(id){
                var url = 'delete_user';
                $http.get(url,{params:{
                        'ID':id
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

            $rootScope.initUser();
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