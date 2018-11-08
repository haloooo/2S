var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    //配置
    $scope.username = "";
    $scope.password = "";
    $scope.userid = "";
    $scope.submit = function () {
        if ($scope.username == "") {
            toastr.warning("用户名不能为空");
            return;
        }
        if ($scope.password == "") {
            toastr.warning("密码不能为空");
            return;
        }
        // POST请求
        $.ajax({
            url: "user_Login",
            type: 'POST', //GET、PUT、DELETE
            async: true,    //是否异步
            data: {
                username: $scope.username,
                password: $scope.password
            },
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            timeout: 5000,    //超时时间
            dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
            beforeSend: function (xhr) {
                // 发送前处理
            },
            success: function (data, textStatus, jqXHR) {
                // 调用成功，解析response中的data到自定义的data中
                if (data[0]['code'] == 0) {
                    localStorage.setItem('two_userid', data[0]['data']["id"]);
                    localStorage.setItem('two_user_name', data[0]['data']["user_name"]);
                    localStorage.setItem('two_user_password', data[0]['data']["user_password"]);
                    localStorage.setItem('two_is_admin', data[0]['data']["is_admin"]);
                    localStorage.setItem('two_true_name', data[0]['data']["true_name"]);
                    localStorage.setItem('two_see_setting', data[0]['data']["see_setting"]);
                    window.location.href = "go_homePage";
                } else {
                    toastr.error(data[0]['msg']);
                }
            },
            error: function (xhr, textStatus) {
                // 调用时，发生错误
                toastr.error("请求失败");
            },
            complete: function () {
                // 交互后处理
            }
        })
    }
});

//生成csrftoken
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}

