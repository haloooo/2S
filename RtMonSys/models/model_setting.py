# * coding:utf-8 *
# Author    : Administrator
# Createtime: 10/8/2018
import sqlite3, os

def getSettingData():
    createTable()
    # insertProcess('kk08','AE-30 type A', 'AE-30', 'CAGE-FAI-2-1,CAGE-FAI-2-2', 'M_MG_PLATE_STATION', 'NG COUNT', '4,8', 'Yield', '95,90', '5000')
    result = selectProcess()
    return result

def createTable():
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    c.execute('''CREATE TABLE IF NOT EXISTS PROCESS
           (
           ID INTEGER PRIMARY KEY AUTOINCREMENT,
           MODEL varchar(40),
           NAME varchar(40), 
           PROCESS_NAME varchar(40),
           INSPECT varchar(40),
           DATA_TYPE varchar(40),
           JIG_TYPE varchar(40),
           JIG_S INTEGER(10),
           JIG_E INTEGER(10),
           PROCESS_TYPE varchar(40),
           PROCESS_S INTEGER(10),
           PROCESS_E INTEGER(10),
           LIMIT_COUNT  varchar(40));''')
    conn.commit()
    conn.close()

def createUserTable():
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    c.execute('''CREATE TABLE IF NOT EXISTS USER
               (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_name varchar(40),
               user_password varchar(40), 
               is_admin varchar(40),
               true_name varchar(40),
               see_setting BOOLEAN);''')
    # print("User Table created successfully")
    conn.commit()
    conn.close()

def get_all_users():
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    rows = c.execute("SELECT id, user_name, user_password, is_admin,true_name, see_setting from USER WHERE is_admin = 'f'")
    for row in rows:
        result.append({'id': row[0], 'user_name': row[1], 'user_password': row[2], 'is_admin': row[3], 'true_name': row[4],
                       'see_setting': row[5]})
    # print("Operation done successfully")
    conn.close()
    return result

def add_new_user(item):
    try:
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        c.execute("INSERT INTO USER VALUES (NULL,?,?,? ,?,?)",(item['username'], item['password'],'f', item['true_name'], item['see_setting']))
        conn.commit()
        # print("Records created successfully")
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def updateUser(item):
    try:
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        c.execute(
            "UPDATE USER set user_name=?, user_password=?, true_name=?,see_setting=? where id = ?",
            (item['user_name'], item['user_password'], item['true_name'], item['see_setting'], item['id']))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def deleteUser(ID):
    try:
        # 加载配置文件
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        c.execute("DELETE from USER where ID=?;", (ID,))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def insertProcess(item):
    try:
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        c.execute("INSERT INTO PROCESS VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?)",(item['MODEL'], item['NAME'], item['PROCESS_NAME'], item['INSPECT'], item['DATA_TYPE'], item['JIG_TYPE'], item['JIG_S'], item['JIG_E'], item['PROCESS_TYPE'], item['PROCESS_S'], item['PROCESS_E'], item['LIMIT']))
        conn.commit()
        # print("Records created successfully")
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def selectProcess():
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    rows = c.execute("SELECT ID, MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG_S, JIG_E, PROCESS_TYPE, PROCESS_S, PROCESS_E, LIMIT_COUNT from PROCESS")
    for row in rows:
        result.append({'ID':row[0],'MODEL':row[1], 'NAME':row[2], 'PROCESS_NAME':row[3],'INSPECT':row[4], 'DATA_TYPE':row[5], 'JIG_TYPE':row[6], 'JIG_S':row[7], 'JIG_E':row[8],'PROCESS_TYPE':row[9], 'PROCESS_S':row[10], 'PROCESS_E':row[11], 'LIMIT':row[12]})
    # print("Operation done successfully")
    conn.close()
    return result

def getProcess(model,name):
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    c.execute(
        "SELECT ID, MODEL, NAME, PROCESS_NAME,INSPECT, DATA_TYPE, JIG_TYPE, JIG_S, JIG_E, PROCESS_TYPE,  PROCESS_S, PROCESS_E, LIMIT_COUNT from PROCESS where MODEL=? AND NAME=?",(model,name))
    row = c.fetchone()
    result.append({'ID': row[0], 'MODEL': row[1], 'NAME': row[2], 'PROCESS_NAME': row[3], 'INSPECT': row[4],
                                      'DATA_TYPE': row[5], 'JIG_TYPE': row[6], 'JIG_S': row[7], 'JIG_E': row[8], 'PROCESS_TYPE': row[9],
                                      'PROCESS_S': row[10], 'PROCESS_E': row[11], 'LIMIT': row[12]})
    conn.close()
    return result

def updateProcess(item):
    try:
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        c.execute(
            "UPDATE PROCESS set MODEL=?, NAME=?, PROCESS_NAME=?,INSPECT=?, DATA_TYPE=?, JIG_TYPE=?, JIG_S=?, JIG_E=?, PROCESS_TYPE=?, PROCESS_S=?, PROCESS_E=?, LIMIT_COUNT=? where ID = ?",
            (item['MODEL'], item['NAME'], item['PROCESS_NAME'], item['INSPECT'], item['DATA_TYPE'], item['JIG_TYPE'], item['JIG_S'], item['JIG_E'],
             item['PROCESS_TYPE'], item['PROCESS_S'],  item['PROCESS_E'], item['LIMIT'], item['ID']))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def deleteProcess(ID):
    try:
        # 加载配置文件
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        c.execute("DELETE FROM PROCESS WHERE ID=?;", (ID,))
        conn.commit()
        result = [{'status': 'ok'}]
    except BaseException as exp:
        # print(exp)
        result = [{'status': 'fail'}]
    conn.close()
    return result

def checkLogin(username,password):
    try:
        # 加载配置文件
        result = []
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        rows = c.execute("SELECT id, user_name, user_password, is_admin, true_name, see_setting FROM USER WHERE user_name=? and user_password=?;", (username,password,))
        count = 0
        for item in rows:
            count = count + 1
            show_result = {}
            show_result["id"] = item[0]
            show_result["user_name"] = item[1]
            show_result["user_password"] = item[2]
            show_result["is_admin"] = item[3]
            show_result["true_name"] = item[4]
            show_result["see_setting"] = item[5]
        if count > 0:
             result.append({"code":"0", "data":show_result})
        else:
            result.append({"code":"1", "msg":"用户名或密码不正确"})
    except BaseException as exp:
        print(exp)
        result.append({"code":"1", "msg":"用户名或密码不正确"})
    conn.close()
    return result

def updatePassword(user_id,oldpassword,newpassword):
    try:
        # 加载配置文件
        result = []
        file_path = os.getcwd() + '/data.db'
        conn = sqlite3.connect(file_path)
        c = conn.cursor()
        # print("Opened database successfully")
        rows = c.execute("SELECT id, user_name, user_password, is_admin, true_name, see_setting FROM USER WHERE id=? and user_password=?;", (user_id, oldpassword,))
        count = 0
        for item in rows:
            count = count + 1
        if count == 0:
             result.append({"code": "1", "msg": "密码不正确"})
        else:
            sql = '''
                UPDATE USER SET user_password = ? WHERE id = ?
            '''
            c.execute(sql,(newpassword, user_id))
            conn.commit()
            result.append({"code":"0"})
    except BaseException as exp:
        print(exp)
        result.append({"code":"1", "msg":"密码不正确"})
    conn.close()
    return result

def get_models():
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    rows = c.execute(
        "select DISTINCT MODEL from PROCESS;")
    for row in rows:
        result.append(row[0])
    # print("Operation done successfully")
    conn.close()
    return result

def get_process(model):
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    rows = c.execute(
        "select NAME from PROCESS where MODEL=?;",(model,))
    for row in rows:
        result.append(row[0])
    # print("Operation done successfully")
    conn.close()
    return result

def get_process_name(model):
    result = []
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    rows = c.execute(
        "select PROCESS_NAME from PROCESS where MODEL=?;",(model,))
    for row in rows:
        result.append(row[0])
    # print("Operation done successfully")
    conn.close()
    return result

def get_datatype(model,process):
    file_path = os.getcwd() + '/data.db'
    conn = sqlite3.connect(file_path)
    c = conn.cursor()
    # print("Opened database successfully")
    c.execute(
        "SELECT DATA_TYPE FROM PROCESS WHERE MODEL=? AND NAME=?;", (model,process,))
    row = c.fetchone()
    result = (row[0]).split(',')
    # print("Operation done successfully")
    conn.close()
    return result



