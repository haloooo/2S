
# * coding:utf-8 *
# Author    : Administrator
# Createtime: 10/9/2018
from __future__ import unicode_literals
from django.shortcuts import render
from RtMonSys.models import model_login
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def go_login(request):
    Logger.write_log("进入登录界面")
    return render(request, 'login.html')

def user_Login(request):
    Logger.write_log("判断是否登录")
    username = str(request.POST.get("username"))
    password = str(request.POST.get("password"))
    result = model_login.checkLogin(username, password)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def updatePassword(request):
    Logger.write_log("修改密码")
    user_id = str(request.POST.get("user_id"))
    oldpassword = str(request.POST.get("oldpassword"))
    newpassword = str(request.POST.get("newpassword"))
    result = model_login.updatePassword(user_id,oldpassword,newpassword)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)