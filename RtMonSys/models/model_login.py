# * coding:utf-8 *
# Author    : Administrator
# Createtime: 10/9/2018
from RtMonSys.models import model_setting

def checkLogin(username,password):
    return model_setting.checkLogin(username,password)

def updatePassword(user_id,oldpassword,newpassword):
    return model_setting.updatePassword(user_id,oldpassword,newpassword)