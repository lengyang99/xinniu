/**
 * 运营管理 - 通知管理 接口
 */
import { stringify } from 'qs';
import request from '../utils/request';
import {message} from 'antd';

// 查询通知列表
export async function queryNotificationList(params) {
    return request(`/modules/manage/message/getMessageList.htm?${stringify(params)}`);
}
// 编辑通知
export async function editNotification(params) {
    return request('/modules/manage/message/editMessage.htm', {
      method: 'POST',
      body: stringify(params),
    });
}
// 新增通知
export async function addNotification(params) {
    return request('/modules/manage/message/addMessage.htm', {
      method: 'POST',
      body: stringify(params),
    });
}
// 修改通知状态
export async function upDataNotificationStatus(params) {
    return request('/modules/manage/message/updateMessage.htm', {
      method: 'POST',
      body: stringify(params),
    });
}