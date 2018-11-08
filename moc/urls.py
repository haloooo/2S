"""sf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.views.generic.base import RedirectView
from RtMonSys.views import view_homePage, view_warningDetail, view_serialDetail, view_inspectDetail, view_setting, \
    view_user, view_login

urlpatterns = [
    url(r'^$', view_homePage.go_homePage),
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
    url(r'^go_homePage', view_homePage.go_homePage),
    url(r'^get_models', view_homePage.get_models),
    url(r'^get_dataList', view_homePage.get_dataList),
    url(r'^go_serialDetail', view_homePage.go_serialDetail),
    url(r'^go_warningDetail', view_homePage.go_warningDetail),
    url(r'^get_DetailList', view_warningDetail.get_DetailList),
    url(r'^get_SerialList', view_serialDetail.get_SerialList),
    url(r'^get_InspectList', view_inspectDetail.get_InspectList),
    url(r'^auto_updating', view_homePage.auto_updating),
    url(r'^get_process', view_homePage.get_process),
    url(r'^get_dataType', view_homePage.get_dataType),
    url(r'^initConfig',view_homePage.initConfig),
    url(r'^get_line',view_homePage.get_line),

    # 修改Process
    url(r'^go_setting',view_setting.go_setting),
    url(r'^init_setting',view_setting.init_setting),
    url(r'^update_process',view_setting.update_process),
    url(r'^delete_process',view_setting.delete_process),
    url(r'^add_process',view_setting.add_process),

    # 修改user
    url(r'^go_user',view_user.go_user),
    url(r'^add_new_user',view_user.add_new_user),
    url(r'^get_all_user',view_user.get_all_users),
    url(r'^update_user',view_user.update_user),
    url(r'^delete_user',view_user.delete_user),

    # 登录
    url(r'^go_login',view_login.go_login),
    url(r'^user_Login',view_login.user_Login),
    url(r'^updatePassword',view_login.updatePassword)
]
