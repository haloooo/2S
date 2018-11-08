# -*-coding:utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

from RtMonSys.models import model_setting
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def go_setting(request):
    Logger.write_log("进入setting数据")
    return render(request, 'Setting.html')

def init_setting(request):
    Logger.write_log("初始化setting数据")
    result = model_setting.getSettingData()
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def update_process(request):
    Logger.write_log("更新Process数据")
    # index = request.GET.get('index')
    process = json.loads(request.GET.get('process'))
    result = model_setting.updateProcess(process)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def delete_process(request):
    Logger.write_log("删除Process数据")
    ID = request.GET.get('ID')
    result = model_setting.deleteProcess(ID)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def add_process(request):
    Logger.write_log("添加Process数据")
    process = json.loads(request.GET.get('process'))
    result = model_setting.insertProcess(process)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)
