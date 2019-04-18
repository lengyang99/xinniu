import request from '../utils/request'
import { stringify } from "qs";
//还款渠道查询
export async function queryRepayChannelEnum() {
    return request(`/modules/manage/pay/getFundsChannelNameEunm.htm`)
}
//还款列表查询
export async function queryRepayRecord(params) {
    return request(`/modules/manage/repay/repayRecordList.htm?${stringify(params)}`)
}
//还款类型枚举
export async function queryRepayTypeEnum() {
    return request(`/modules/manage/repayRecord/repayRecordTypeEnum.htm`)
}
//还款总额
export async function queryRepayAmount() {
    return request(`/modules/manage/repayRecordAmount.htm`)
}
//查询产品系列枚举
export async function queryProductEnum() {
    return request(`/modules/manage/biz/getProdLine.htm`)
}