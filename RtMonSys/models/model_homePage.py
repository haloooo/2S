# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime
from RtMonSys.models import models_common, model_setting

def getStart_End_time():
    now = datetime.datetime.now()
    end_time = now.strftime("%Y-%m-%d %H:%M:%S")
    hour_interval = models_common.get_config("hour_interval")
    start_time = (now + datetime.timedelta(hours=-hour_interval)).strftime("%Y-%m-%d %H:%M:%S")
    return start_time,end_time

def getDataList(model_name, name, process_cd, datatype_id,limit,JIG_type):
    start_time, end_time = getStart_End_time()
    result, dataList = models_common.getDetailList_update2(model_name,name, process_cd, datatype_id,limit, start_time, end_time,JIG_type)
    return result, dataList

def get_models():
    # database = models_common.get_config("database")
    # model = []
    # for item in database:
    #     model.append(item["MODEL"])
    # return model
    model = model_setting.get_models()
    return model

def get_process(model):
    # database = models_common.get_config("database")
    # process = []
    # for item in database:
    #     if item["MODEL"] == model:
    #         for processItem in item["DATA"]:
    #             process.append(processItem["PROCESS"])
    # return process
    process = model_setting.get_process(model)
    return process

def get_datatype(model,process):
    # database = models_common.get_config("database")
    # datatype = []
    # for item in database:
    #     if item["MODEL"] == model:
    #         for processItem in item["DATA"]:
    #             if processItem["PROCESS"] == process:
    #                 datatype = processItem["DATA_TYPE"]
    # return datatype
    datatype = model_setting.get_datatype(model,process)
    return datatype

def initConfig():
    try:
        database = models_common.get_config("database")
        result = []
        model = database[0]["MODEL"]
        process = model_setting.get_process(model)[0]
        dataType = model_setting.get_datatype(model, process)
        result.append({"model": model})
        result.append({"process": process})
        result.append({"dataType": dataType})
        return result
    except BaseException as exp:
        result = [{'status': 'fail','msg':'Please config setting first'}]
        return result

def get_all_line_count(model_name, process_cd, datatype_id):
    database = models_common.get_config("database")
    counts = []
    for item in database:
        if item["MODEL"] == model_name:
            for dataItem in item["DATA"]:
                if dataItem["PROCESS"] == process_cd:
                    type = dataItem["TYPE"]
                    break
    for item in database:
        if item["MODEL"] == model_name:
            line_counts = getDataList(model_name, process_cd, datatype_id, True)
            for lineItem in item["LINE"]:
                num = 0
                for line_id in line_counts:
                    if line_id['line_cd'] == lineItem:
                        if type == "NG COUNT":
                            num = line_id['ng_count']
                counts.append(num)
    return counts

# def getLine(model, process,datatype_Id):
#     start_time, end_time = getStart_End_time()
#     database = models_common.get_config("database")
#     result = []
#     dataListResult = getDataList(model, process,datatype_Id)
#     for item in database:
#         if item["MODEL"] == model:
#             line = item["LINE"]
#             for datatypeItem in item["DATA"]:
#                 if datatypeItem["PROCESS"] == process:
#                     JIG = datatypeItem["JIG"]
#                     JIG_COUNT = []
#                     IN_COUNT = []
#                     YIELD = []
#                     green = []
#                     yellow = []
#                     red = []
#                     JIG_Result, IN_Result = models_common.getJIG_NGByLine(model, process, start_time, end_time)
#                     num = 0
#                     for i in line:
#                         sum_green = 0
#                         sum_yellow = 0
#                         sum_red = 0
#                         flag = True
#                         count_jig = JIG_Result[num]
#                         count_in = IN_Result[num]
#                         for j in dataListResult:
#                             if i == j["line_cd"]:
#                                 if j["ng_count"] < JIG[0]:
#                                     # sum_green = sum_green + j["ng_count"]
#                                     sum_green = sum_green + 1
#                                 if j["ng_count"] >= JIG[0] and j["ng_count"] < JIG[1]:
#                                     # sum_yellow = sum_yellow + j["ng_count"]
#                                     sum_yellow = sum_yellow + 1
#                                 if j["ng_count"] >= JIG[1]:
#                                     # sum_red = sum_red + j["ng_count"]
#                                     sum_red = sum_red + 1
#                                 flag = False
#                         if flag:
#                             sum_green = 0
#                             sum_yellow = 0
#                             sum_red = 0
#                         green.append(sum_green)
#                         yellow.append(sum_yellow)
#                         red.append(sum_red)
#                         if count_in == 0:
#                             Yield = 0
#                         else:
#                             Yield = int((count_in - count_jig)/count_in * 100)
#                         JIG_COUNT.append(count_jig)
#                         IN_COUNT.append(count_in)
#                         YIELD.append(Yield)
#                         num = num + 1
#                     result.append({"line": line,"JIG_COUNT":JIG_COUNT,"IN_COUNT":IN_COUNT,"YIELD":YIELD,"JIG":datatypeItem["JIG"],"PROCESS_YIELD":datatypeItem["PROCESS_YIELD"],"INTERVAL":models_common.get_config("hour_interval"),"GREEN":green,"YELLOW":yellow,"RED":red,"DATALIST":dataListResult,"start_time":start_time,"end_time":end_time})
#                     break
#     return result


def getLine(model, name, process, datatype_Id, str_JIG, str_PROCESS, JIG_type, PROCESS_type, limit):
    start_time, end_time = getStart_End_time()
    database = models_common.get_config("database")
    result = []
    dataListResult, dataList = getDataList(model, name, process,datatype_Id,limit,JIG_type)
    for item in database:
        if item["MODEL"] == model:
            line = item["LINE"]
            JIG = str_JIG.split(',')
            PROCESS = str_PROCESS.split(',')
            JIG_COUNT = []
            IN_COUNT = []
            YIELD = []
            green = []
            yellow = []
            red = []
            JIG_Result, IN_Result = models_common.getJIG_NGByLine(model, process, limit, start_time, end_time)
            num = 0
            for i in line:
                sum_green = 0
                sum_yellow = 0
                sum_red = 0
                flag = True
                count_jig = JIG_Result[num]
                count_in = IN_Result[num]
                for j in dataListResult:
                    if i == j["line_cd"]:
                        if j["ng_count"] < int(JIG[0]):
                            # sum_green = sum_green + j["ng_count"]
                            sum_green = sum_green + 1
                        if j["ng_count"] >= int(JIG[0]) and j["ng_count"] < int(JIG[1]):
                            # sum_yellow = sum_yellow + j["ng_count"]
                            sum_yellow = sum_yellow + 1
                        if j["ng_count"] >= int(JIG[1]):
                            # sum_red = sum_red + j["ng_count"]
                            sum_red = sum_red + 1
                        flag = False
                if flag:
                    sum_green = 0
                    sum_yellow = 0
                    sum_red = 0
                green.append(sum_green)
                yellow.append(sum_yellow)
                red.append(sum_red)
                if count_in == 0:
                    Yield = 0
                else:
                    Yield = int((count_in - count_jig) / count_in * 100)
                JIG_COUNT.append(count_jig)
                IN_COUNT.append(count_in)
                YIELD.append(Yield)
                num = num + 1
            result.append(
                {"line": line, "JIG_COUNT": JIG_COUNT, "IN_COUNT": IN_COUNT, "YIELD": YIELD, "JIG": JIG,
                 "PROCESS_YIELD": PROCESS, "INTERVAL": models_common.get_config("hour_interval"),
                 "GREEN": green, "YELLOW": yellow, "RED": red, "DATALIST": dataListResult,"DATALIST_all":dataList, "start_time": start_time,
                 "end_time": end_time,'JIG_type':JIG_type,'PROCESS_type':PROCESS_type})
    return result

def auto_updating():
    auto_update = models_common.get_config("auto_updating")
    return auto_update
