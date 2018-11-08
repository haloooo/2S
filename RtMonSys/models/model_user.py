# * coding:utf-8 *
# Author    : Administrator
# Createtime: 10/8/2018
from moc import sqliteHelper
import sqlite3

def getSettingData():
    # createTable()
    # insertProcess('kk08','AE-30 type A', 'AE-30', 'CAGE-FAI-2-1,CAGE-FAI-2-2', 'M_MG_PLATE_STATION', 'NG COUNT', '4,8', 'Yield', '95,90', '5000')
    result = selectProcess()
    return result

def createTable():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    print("Opened database successfully")
    c.execute('''CREATE TABLE PROCESS
           (
           ID INTEGER PRIMARY KEY AUTOINCREMENT,
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

def insertProcess(item):
    try:
        conn = sqlite3.connect('data.db')
        c = conn.cursor()
        print("Opened database successfully")
        c.execute("INSERT INTO PROCESS VALUES (NULL,?,?,?,?,?,?,?,?,?,?)",(item['MODEL'], item['NAME'], item['PROCESS_NAME'], item['INSPECT'], item['DATA_TYPE'], item['JIG_TYPE'], item['JIG'], item['PROCESS_TYPE'], item['PROCESS'], item['LIMIT']))
        conn.commit()
        print("Records created successfully")
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def selectProcess():
    result = []
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    print("Opened database successfully")
    rows = c.execute("SELECT ID, MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG, PROCESS_TYPE, PROCESS, LIMIT_COUNT from PROCESS")
    for row in rows:
        result.append({'ID':row[0],'MODEL':row[1], 'NAME':row[2], 'PROCESS_NAME':row[3],'INSPECT':row[4], 'DATA_TYPE':row[5], 'JIG_TYPE':row[6], 'JIG':row[7], 'PROCESS_TYPE':row[8], 'PROCESS':row[9], 'LIMIT':row[10]})
    print("Operation done successfully")
    conn.close()
    return result

def updateProcess(item):
    try:
        conn = sqlite3.connect('data.db')
        c = conn.cursor()
        print("Opened database successfully")
        c.execute(
            "UPDATE PROCESS set MODEL=?, NAME=?, PROCESS_NAME=?,INSPECT=?, DATA_TYPE=?, JIG_TYPE=?, JIG=?, PROCESS_TYPE=?, PROCESS=?, LIMIT_COUNT=? where ID = ?",
            (item['MODEL'], item['NAME'], item['PROCESS_NAME'], item['INSPECT'], item['DATA_TYPE'], item['JIG_TYPE'], item['JIG'],
             item['PROCESS_TYPE'], item['PROCESS'], item['LIMIT'], item['ID']))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def deleteProcess(ID):
    try:
        conn = sqlite3.connect('data.db')
        c = conn.cursor()
        print("Opened database successfully")
        c.execute("DELETE from PROCESS where ID=?;", (ID,))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

# if __name__ == '__main__':
#     createTable()
#     insertProcess('kk07', 'AE-30 type A', 'AE-30', 'CAGE-FAI-2-1,CAGE-FAI-2-2', 'M_MG_PLATE_STATION', 'NG COUNT', '4,8',
#                   'Yield', '95,90', '5000')
