# -*-coding:utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from RtMonSys.models import model_setting
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def go_user(request):
    Logger.write_log("进入user数据")
    return render(request, 'User.html')

def get_all_users(request):
    Logger.write_log("获取所有user数据")
    model_setting.createUserTable()
    result = model_setting.get_all_users()
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def add_new_user(request):
    Logger.write_log("添加user数据")
    user = json.loads(request.GET.get('user'))

    # model_setting.createUserTable()

    result = model_setting.add_new_user(user)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def update_user(request):
    Logger.write_log("修改user数据")
    user = json.loads(request.GET.get('user'))
    result = model_setting.updateUser(user)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def delete_user(request):
    Logger.write_log("删除user数据")
    ID = request.GET.get('ID')
    result = model_setting.deleteUser(ID)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)