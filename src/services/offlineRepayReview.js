import request from '../utils/request'
import {stringify} from 'qs'

//复审枚举
export async function queryAuditEnum() {
    return request(`/modules/manage/repay/offlineAuditStatus.htm?type=3`)
}
//入账类型吗枚举
export async function queryTypeEnum() {
    return request(`/modules/manage/repay/offlineRepyaTypeEnum.htm`)
}
//获取复审列表
export async function queryAuditList(params) {
    return request(`/modules/manage/repay/offlineAudit.htm?${stringify(params)}`)
}
//获取复审详情
export async function queryAuditAmount(params) {
    return request(`/modules/manage/repay/offlineAuditDetail.htm?${stringify(params)}`)
}
//审核
export async function submitAudit(params) {
    return request(`/modules/manage/repay/updateOfflineAuditStatus.htm?${stringify(params)}`)
}