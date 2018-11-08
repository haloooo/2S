# -*-coding:utf-8 -*-
from __future__ import unicode_literals
from RtMonSys.models import models_inspectDetail, model_setting
from RtMonSys.models.models_logger import Logger
from django.http import HttpResponse
import json

def get_InspectList(request):
    Logger.write_log("Inspect Detail数据")
    model_name = request.GET.get('model_name')
    process_cd = request.GET.get('process_cd')
    datatype_id = request.GET.get('datatype_id')
    line_cd = request.GET.get('line_cd')
    start_time = request.GET.get('start_time')
    end_time = request.GET.get('end_time')
    serial_cd = request.GET.get('serial_cd')
    station_slot = request.GET.get('station_slot')
    row = model_setting.getProcess(model_name, process_cd)
    name = row[0]['NAME']
    limit = row[0]['LIMIT']
    process_name = row[0]['PROCESS_NAME']
    result = models_inspectDetail.getInspectList(model_name,name,datatype_id,limit,start_time, end_time, line_cd, serial_cd, process_name, station_slot)
    jsonstr = json.dumps(result)
    return HttpResponse(jsonstr)





