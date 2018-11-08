# -*-coding:utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

from RtMonSys.models import model_homePage, model_setting
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def go_homePage(request):
    Logger.write_log("初始化Home Page数据")
    return render(request, 'HomePage.html')

def get_models(request):
    Logger.write_log("获取所有models数据")
    result = model_homePage.get_models()
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def get_process(request):
    model = request.GET.get("model")
    result = model_homePage.get_process(model)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def get_dataType(request):
    model = request.GET.get("model")
    process = request.GET.get("process")
    result = model_homePage.get_datatype(model, process)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def initConfig(request):
    result = model_homePage.initConfig()
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def get_line(request):
    model = request.GET.get("model")
    process = request.GET.get("process")
    datatype_Id = request.GET.get("datatypeId")
    row = model_setting.getProcess(model, process)
    name = row[0]['NAME']
    process_name = row[0]['PROCESS_NAME']
    JIG = str(row[0]['JIG_S']) + ',' + str(row[0]['JIG_E'])
    PROCESS = str(row[0]['PROCESS_S'] )+ ',' + str(row[0]['PROCESS_E'])
    limit = int(row[0]['LIMIT'])
    JIG_type = row[0]['JIG_TYPE']
    PROCESS_type = row[0]['PROCESS_TYPE']
    result = model_homePage.getLine(model,name,process_name,datatype_Id,JIG,PROCESS,JIG_type,PROCESS_type,limit)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def go_serialDetail(request):
    Logger.write_log("初始化Serial Detail数据")
    return render(request, 'SerialDetail.html')

def go_warningDetail(request):
    Logger.write_log("初始化Warning Detail数据")
    return render(request, 'WarningDetail.html')

def get_dataList(request):
    Logger.write_log("Home Page数据")
    model_name = request.GET.get('model_name')
    process_cd = request.GET.get('process_cd')
    datatype_id = request.GET.get('datatype_id')
    result = model_homePage.getDataList(model_name, process_cd, datatype_id)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)

def auto_updating(request):
    Logger.write_log("auto updating数据")
    result = model_homePage.auto_updating()
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)


