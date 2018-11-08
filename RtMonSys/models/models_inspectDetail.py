# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import connections
from RtMonSys.models import models_common

def getInspectList(model_name,name,datatype_id,limit,start_time, end_time, line_cd, serial_cd, process_cd, station_slot):
    inspectList = []
    inspect_cd_List = []
    try:
        allJson = models_common.getDetailList_update3(model_name, name, line_cd, process_cd, datatype_id, limit,
                                                      station_slot, start_time, end_time)
        for item in allJson:
            if item['line_cd'] == line_cd and item['serial_cd'] == serial_cd:
                if item['inspect_cd'] not in inspect_cd_List:
                    inspect_cd_List.append(item['inspect_cd'])
                    inspectList.append({'inspect_code': item['inspect_cd'], 'inspect': item['inspect_text'], 'judge_text':item['judge_text']})
    except BaseException as exp:
        inspectList = models_common.databaseException(exp)
    connections[model_name].close()
    return inspectList

def getInspectFromConf(model_name, process_cd):
    INSPECT = []
    database_list = models_common.get_config("database")
    for item in database_list:
        if item["MODEL"] == model_name:
            for dataItem in item["DATA"]:
                if dataItem["PROCESS"] == process_cd:
                    INSPECT = dataItem["INSPECT"]
                    break
    return INSPECT