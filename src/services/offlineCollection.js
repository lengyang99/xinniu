import request from '../utils/request';
import {stringify} from 'qs';

//查询线下收款列表
export async function queryDataList(params) {
  return request(`/modules/manage/repay/offlineAudit.htm?${stringify(params)}`);
}

// 获取线下收款状态
export async function getOfflineAuditStatus() {
    return request('/modules/manage/repay/offlineAuditStatus.htm');
}


// 线下收款审核
export async function updateOfflineAuditStatus(params) {
    return request(`/modules/manage/repay/updateOfflineAuditStatus.htm?${stringify(params)}`);  
}