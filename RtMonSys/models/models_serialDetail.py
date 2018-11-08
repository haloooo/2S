# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import connections
from RtMonSys.models import models_common, model_setting
import json


def getSerialDetail(model_name,name,limit, process_cd, datatype_id, line_cd, station_slot, start_time, end_time):
    result = []
    statistics_result = []
    in_count = 0
    ng_count = 0
    try:
        allJson = models_common.getDetailList_update3(model_name,name,line_cd, process_cd, datatype_id, limit, station_slot, start_time, end_time)

        serial_cd_list = []
        serial_cd_list_1 = []
        process = ''
        for item in allJson:
            if line_cd == item['line_cd'] and item['judge_text'] == '1':
                if not item['serial_cd'] in serial_cd_list:
                    serial_cd_list.append(item['serial_cd'])
                    ng_count = ng_count + 1
            if line_cd == item['line_cd']:
                if not item['serial_cd'] in serial_cd_list_1:
                    serial_cd_list_1.append(item['serial_cd'])
                    in_count = in_count + 1
        for serial_cd in serial_cd_list:
            count = 0
            for item in allJson:
                if item['serial_cd'] == serial_cd and item['judge_text'] == '1':
                    process = item['process_at']
                    count = count + 1
            statistics_result.append({"serial_cd": serial_cd, "ng_count": count, "process_at": process})
        if in_count == 0:
            Yield = 0
        else:
            Yield = '%.2f' % (100 * ((in_count - ng_count) / in_count))
        result.append({'statistics_result':statistics_result, 'in_count':in_count, 'ng_count':ng_count, 'Yield':Yield})
    except BaseException as exp:
        result = models_common.databaseException(exp)
    connections[model_name].close()
    return result