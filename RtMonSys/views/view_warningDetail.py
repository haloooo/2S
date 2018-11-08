# -*-coding:utf-8 -*-
from __future__ import unicode_literals
from RtMonSys.models import models_warningDetail, model_setting
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def get_DetailList(request):
    Logger.write_log("获取Warning Detail数据")
    model_name = request.GET.get('model_name')
    process_cd = request.GET.get('process_cd')
    datatype_id = request.GET.get('datatype_id')
    line_cd = request.GET.get('line_cd')
    start_time = request.GET.get('start_time')
    end_time = request.GET.get('end_time')
    row = model_setting.getProcess(model_name, process_cd)
    name = row[0]['NAME']
    process_name = row[0]['PROCESS_NAME']
    JIG = str(row[0]['JIG_S']) + ',' + str(row[0]['JIG_E'])
    PROCESS = str(row[0]['PROCESS_S']) + ',' + str(row[0]['PROCESS_E'])
    limit = row[0]['LIMIT']
    JIG_type = row[0]['JIG_TYPE']
    PROCESS_type = row[0]['PROCESS_TYPE']
    result = models_warningDetail.getDetailList(model_name,name, process_name, datatype_id, line_cd,JIG,PROCESS, start_time, end_time, limit, JIG_type, PROCESS_type)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)





