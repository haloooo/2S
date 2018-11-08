# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import connections
from RtMonSys.models import models_common

def getDetailList(model_name, name, process_cd, datatype_id, line_cd,JIG,PROCESS_YIELD,start_time, end_time, limit, JIG_type, PROCESS_type):
    result = []
    try:
        # cur = connections[model_name].cursor()
        # sql = "SELECT line_cd,partsserial_cd AS station_slot,serial_cd,judge_text FROM ( \
        # 		       SELECT f.serial_cd, i.line_cd,f.process_at,f.partsserial_cd,i.judge_text,ROW_NUMBER () OVER ( \
        # 				PARTITION BY f.serial_cd ORDER BY f.process_at) FROM t_faci_kk07 f,(SELECT serial_cd,process_at, \
        # 				judge_text,line_cd,process_cd FROM(SELECT A .serial_cd,A .process_at,A .judge_text,b.line_cd,b.process_cd,\
        # 				ROW_NUMBER () OVER (PARTITION BY A .serial_cd ORDER BY A .process_at DESC) FROM t_insp_kk07 A,m_process b \
        # 				WHERE A .proc_uuid = b.proc_uuid AND b.process_cd = '(process_cd)' AND b.line_cd = '(line_cd)' AND A.process_at >= '(start_time)' \
        # 				AND A.process_at <= '(end_time)') AS n WHERE ROW_NUMBER = '1') AS I WHERE f.serial_cd = i.serial_cd \
        # 		        AND f.datatype_id = '(datatype_id)') AS M WHERE M . ROW_NUMBER = '1' LIMIT  '(limit)'"
        # sql = sql.replace("(process_cd)", process_cd).replace("(line_cd)", line_cd).replace("(start_time)", start_time)\
        #     .replace("(end_time)",end_time).replace("(datatype_id)", datatype_id).replace("(limit)", limit)
        # cur.execute(sql)
        # rows = cur.fetchall()

        rows = models_common.getDetailList_update4(model_name, name,line_cd, process_cd, datatype_id, limit, start_time, end_time)
        serial_cd_list1 = []
        serial_cd_list2 = []
        station_slot = []
        for row in rows:
            if not row['station_slot'] in station_slot:
                station_slot.append(row['station_slot'])

        for item in station_slot:
            in_ = 0
            ng_ = 0
            for row in rows:
                if item == row['station_slot'] and int(row['judge_text']) == 1:
                    if not row['serial_cd'] in serial_cd_list1:
                        serial_cd_list1.append(row['serial_cd'])
                        ng_ = ng_ + 1
                if item == row['station_slot']:
                    if not row['serial_cd'] in serial_cd_list2:
                        serial_cd_list2.append(row['serial_cd'])
                        in_ = in_ + 1
            Yield = '%.2f' % (100 * ((in_ - ng_) / in_))
            result.append(
                {"station_slot": item, "ng_count": ng_, "in": in_, "yield": Yield,
                 "PROCESS_YIELD": PROCESS_YIELD.split(','), "JIG": JIG.split(','), 'JIG_type':JIG_type, 'PROCESS_type':PROCESS_type})
    except BaseException as exp:
        print(exp)
        result = models_common.databaseException(exp)
    connections[model_name].close()
    return result
