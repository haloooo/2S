# * coding:utf-8 *
# Author    : Administrator
# Createtime: 10/1/2018
import sqlite3

def createTable():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    print("Opened database successfully")
    c.execute('''CREATE TABLE PROCESS
           (
           MODEL varchar(40),
           NAME varchar(40), 
           PROCESS_NAME varchar(40),
           INSPECT varchar(40),
           DATA_TYPE varchar(40),
           JIG_TYPE varchar(40),
           JIG varchar(40),
           PROCESS_TYPE varchar(40),
           PROCESS varchar(40),
           LIMIT_COUNT  varchar(40));''')
    print("Table created successfully")
    conn.commit()
    conn.close()

def insertProcess(MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG, PROCESS_TYPE, PROCESS, LIMIT):
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    print("Opened database successfully")
    c.execute("INSERT INTO PROCESS (MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG, PROCESS_TYPE, PROCESS, LIMIT_COUNT) VALUES (?,?,?,?,?,?,?,?,?,?)",(MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG, PROCESS_TYPE, PROCESS, LIMIT))
    conn.commit()
    print("Records created successfully")
    conn.close()

def selectProcess():
    result = []
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    print("Opened database successfully")
    rows = c.execute("SELECT MODEL, NAME, PROCESS_NAME,INSPECT DATA_TYPE, JIG_TYPE, JIG, PROCESS_TYPE, PROCESS, LIMIT_COUNT from PROCESS")
    for row in rows:
        result.append({'MODEL':row[0], 'NAME':row[1], 'PROCESS_NAME':row[2],'INSPECT':row[3], 'DATA_TYPE':row[4], 'JIG_TYPE':row[5], 'JIG':row[6], 'PROCESS_TYPE':row[7], 'PROCESS':row[8], 'LINIT':row[9]})
    print("Operation done successfully")
    conn.close()
    return result


if __name__ == '__main__':
    createTable()
    insertProcess('kk07', 'AE-30 type A', 'AE-30', 'CAGE-FAI-2-1,CAGE-FAI-2-2', 'M_MG_PLATE_STATION', 'NG-COUNT', '4,8', 'Yield', '95,90', '5000')
    # selectProcess()