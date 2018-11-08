var app = angular.module("AppHomePage", []).run(
    function($rootScope, $http, $interval, $location) {
        $rootScope.dataList = [];
        $rootScope.show_menu = false;
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

        // 1. 获取当前所有model
        $rootScope.get_models = function () {
            var url = "/get_models";
            $http.get(url).success(function(result)
            {
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
                $rootScope.models = result;
                $rootScope.selectedModel = result[0];
            }).error(function () {
                toastr.error("DATABASE ERROR")
            });
        };

        // 2. 根据$rootScope.selectedModel获取所有process
        $rootScope.modelChange = function(){
            var url = 'get_process?model=' + $rootScope.selectedModel;
            $http.get(url).success(function (result) {
                $rootScope.process = result;
                $rootScope.selectedProcess = result[0];
                $rootScope.processChange();
            }).error(function () {
                toastr.error("DATABASE ERROR")
            })
        };

        // 3. 根据$rootScope.selectedModel和$rootScope.selectedProcess获取对应的data_type
        $rootScope.processChange = function(){
            var url = 'get_dataType?model='+ $rootScope.selectedModel + '&process=' + $rootScope.selectedProcess;
            $http.get(url).success(function (result) {
                $rootScope.dataType = result;
                $rootScope.selectedDataType = result[0];
            }).error(function () {
                toastr.error("DATABASE ERROR")
            })
        };

        // 4.初始化Config
        $rootScope.initConfig = function(){
            var url = 'initConfig';
            $http.get(url).success(function (result) {
                if(result[0]['status'] == 'fail'){
                    toastr.info(result[0]['msg']);
                    return
                }
                $rootScope.selectedModel = result[0]["model"];
                $rootScope.selectedProcess = result[1]["process"];
                $rootScope.selectedDataType = result[2]["dataType"][0];
                $rootScope.get_models();
                $rootScope.modelChange();
                $rootScope.processChange();
                // 3.1 初始化主页数据
                if(localStorage.process_cd == undefined){
                    var model = $rootScope.selectedModel;
                    var process = $rootScope.selectedProcess;
                    var datatype = $rootScope.selectedDataType;
                }else{
                    var model = localStorage.model_name;
                    var process = localStorage.process_cd;
                    var datatype = localStorage.datatype_id;
                }

                $rootScope.get_line(model,process,datatype);
            }).error(function () {
                toastr.error("DATABASE ERROR")
            });
        };

        // 5. 获取所有Line
        $rootScope.get_line = function(model,process,datatypeId){
            $('#loading').show();
            var url = 'get_line?model=' + model + "&process=" + process + "&datatypeId=" + datatypeId;
            $http.get(url).success(function (result) {
                $rootScope.line = result[0].line;
                $rootScope.JIG_COUNT = result[0].JIG_COUNT;
                $rootScope.IN_COUNT = result[0].IN_COUNT;
                $rootScope.JIG_type = result[0].JIG_type;
                $rootScope.PROCESS_type = result[0].PROCESS_type;
                $rootScope.YIELD = result[0].YIELD;
                $rootScope.PROCESS_YIELD = result[0].PROCESS_YIELD;
                $rootScope.INTERVAL = result[0].INTERVAL;
                $rootScope.JIG = result[0].JIG;
                $rootScope.GREEN = result[0].GREEN;
                $rootScope.YELLOW = result[0].YELLOW;
                $rootScope.RED = result[0].RED;
                $rootScope.dataList = result[0].DATALIST;
                $rootScope.start_time = result[0].start_time;
                $rootScope.end_time = result[0].end_time;
                if($rootScope.dataList.length == 0){
                    $("#table").hide();
                }else{
                    $("#table").show();
                }

                // //排序
                // $rootScope.col = 'yield';//默认按Detractor列降序+Cum列升序排序
                // if($rootScope.JIG_type == 'NG COUNT'){
                //     $rootScope.desc = 0; //降序
                // }else{
                //     $rootScope.desc = 1; //升序
                // }
                if (localStorage.process_cd == undefined){
                    $rootScope.showDataType = $rootScope.selectedDataType;
                    $rootScope.showProcess = $rootScope.selectedProcess;
                }else{
                    $rootScope.showDataType = localStorage.datatype_id;
                    $rootScope.showProcess = localStorage.process_cd;
                }

                // $rootScope.initTable($rootScope.selectedModel, $rootScope.selectedProcess, $rootScope.selectedDataType);
                $('#loading').hide();
            }).error(function () {
                toastr.error("DATABASE ERROR")
            })
        };

        // 6. 加载主页数据
        $rootScope.do_homePage = function () {
            var model_name, process_cd, datatype_id = '';
            if(window.location.search !== '') {
                model_name = $rootScope.getQueryString('model_name');
                process_cd = $rootScope.getQueryString('process_cd');
                datatype_id = $rootScope.getQueryString('datatype_id');
                if (model_name !== $rootScope.selectedModel || process_cd !== $rootScope.selectedProcess || datatype_id !== $rootScope.selectedDataType) {
                    model_name = $rootScope.selectedModel;
                    process_cd = $rootScope.selectedProcess;
                    datatype_id = $rootScope.selectedDataType;
                }
            }else{
                model_name = $rootScope.selectedModel;
                process_cd = $rootScope.selectedProcess;
                datatype_id = $rootScope.selectedDataType;
            }
            localStorage.model_name = model_name;
            localStorage.process_cd = process_cd;
            localStorage.datatype_id = datatype_id;
            $rootScope.get_line(model_name,process_cd,datatype_id);
            $('#myModal').modal('hide');
        };

        $rootScope.get_process = function (selectedModel,result) {
            var process = [];
            for ( var i = 0; i <result.length; i++){
                if(result[i].model === selectedModel){
                    process = result[i].process;
                    break;
                }
            }
            $rootScope.process = process;
            $rootScope.selectedProcess = process[0];
        };
        $rootScope.get_data_type = function (selectedModel,result) {
            var data_type = [];
            for ( var i = 0; i <result.length; i++){
                if(result[i].model === selectedModel){
                    data_type = result[i].data_type;
                    break;
                }
            }
            $rootScope.dataType = data_type;
            $rootScope.selectedDataType = data_type[0];
        };
        $rootScope.initTable = function (model_name,process_cd,datatype_id) {
            var url = 'get_dataList';
            $http.get(url,{params:{'model_name':model_name,'process_cd':process_cd,'datatype_id':datatype_id}}).success(function (result) {
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
                $rootScope.dataList = result;
                if(result.length == 0){
                    $("#table").hide();
                }else{
                    $("#table").show();
                }

            });
        };
        $rootScope.go_WarningDetail = function (val,count_ng, count_in, ng_yield) {
            var model_name = $rootScope.selectedModel;
            var process_cd = $rootScope.selectedProcess;
            var datatype_id = $rootScope.selectedDataType;
            var ng_rgb = $rootScope.PROCESS_YIELD;
            var line_cd = val;
            var start_time = $rootScope.start_time;
            var end_time = $rootScope.end_time;
            if(count_in > 0)
            {
                window.open('go_warningDetail?model_name='+model_name+'&process_cd='+process_cd+'&datatype_id='+datatype_id+'&line_cd='+line_cd+
                    '&ng='+count_ng+'&in='+count_in+'&yield='+ng_yield+"&yellow="+ng_rgb[0]+"&red="+ng_rgb[1]+"&start_time="+start_time+"&end_time="+end_time);
            }
        };

        //计算各个产线（Line）的颜色
        $rootScope.linesColor = function (line,jig_count,in_count,yield_count) {
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

        $rootScope.lineColor_  = function(in_count){
            if(in_count != 0){
                return {"cursor": "pointer"};
            }
        };

        //计算产线对应JIG的颜色
        $rootScope.JIGColor = function(count,yield_){
            var JIG = $rootScope.JIG;
            var JIG_Type = $rootScope.JIG_type;
            if(JIG_Type == 'NG COUNT'){
                if(parseInt(count) < parseInt(JIG[0])){
                    return {"color" : "#3C8DBC"};
                }
                if(parseInt(count) >= parseInt(JIG[0]) && parseInt(count) < parseInt(JIG[1])){
                    return {"color" : "#FF8C00"};
                }
                if(parseInt(count) >= parseInt(JIG[1])){
                    return {"color" : "#FF0000"};
                }
            }else if(JIG_Type == 'Yield'){
                if(parseInt(yield_) < parseInt(JIG[1])){
                    // return {"color" : "#3C8DBC"};
                    return {"color" : "#FF0000"};
                }
                if(parseInt(yield_) < parseInt(JIG[0]) && parseInt(yield_) >= parseInt(JIG[1])){
                    return {"color" : "#FF8C00"};
                }
                if(parseInt(yield_) >= parseInt(JIG[0])){
                    // return {"color" : "#FF0000"};
                    return {"color" : "#3C8DBC"};
                }
            }

        };

        //自动更新
        $rootScope.auto_updating = function () {
            var url = 'auto_updating';
            $http.get(url).success(function (result) {
                var res = ['---'];
                for(var i = 0;i < result.length;i ++){
                    res.push(result[i]);
                }
                $rootScope.auto_update = res;
                $rootScope.selectedAutoUpdate = res[0];
            });
        };
        $rootScope.changeUpdate = function () {
            if($rootScope.selectedAutoUpdate === '---'){
                window.location.reload();
            }else{
                var time = $rootScope.selectedAutoUpdate * 1000;
                setInterval(function () {
                    var model_name = $rootScope.selectedModel;
                    var process_cd = $rootScope.selectedProcess;
                    var datatype_id = $rootScope.selectedDataType;
                    $rootScope.do_homePage();
                    // $rootScope.initTable(model_name,process_cd,datatype_id);
                    $rootScope.$apply();
                },time);
            }
        };
        $rootScope.initPic = function () {
            $('#Line2').hide();
            $('#JIG2').hide();
            $('#NG_count2').hide();
            $('#In2').hide();
            $('#Yield2').hide();
            $('#Line1').show();
            $('#JIG1').show();
            $('#NG_count1').show();
            $('#In1').show();
            $('#Yield1').show();
        };

        $rootScope.show_line = function () {
            if($('#Line1').is(':hidden')){
                $rootScope.initPic();
                $('#Line1').show();
                $('#Line2').hide();
            }
            else
            {
                $rootScope.initPic();
                $('#Line1').hide();
                $('#Line2').show();
            }
        };

        $rootScope.show_jig = function () {
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
        $rootScope.show_ng_count = function () {
            if($('#NG_count1').is(':hidden')){
                $rootScope.initPic();
                $('#NG_count1').show();
                $('#NG_count2').hide();
            }
            else
            {
                $rootScope.initPic();
                $('#NG_count1').hide();
                $('#NG_count2').show();
            }
        };
        $rootScope.show_in = function () {
            if($('#In1').is(':hidden')){
                $rootScope.initPic();
                $('#In1').show();
                $('#In2').hide();
            }
            else
            {
                $rootScope.initPic();
                $('#In1').hide();
                $('#In2').show();
            }
        };
        $rootScope.show_yield = function () {
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

        $rootScope.go_serialDetail = function(model,process,dataType ,line_cd,station_slot){
            var url = 'go_serialDetail?model_name='+model+"&process_cd="+process+"&datatype_id="+dataType+"&line_cd="+line_cd+"&station_slot="+ station_slot+"&start_time="+$rootScope.start_time+"&end_time="+$rootScope.end_time;
            window.open(url)
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

        $rootScope.auto_updating();
        $rootScope.initConfig();
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

