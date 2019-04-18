import request from '../utils/request'
import {stringify} from 'qs'

//获取渠道列表信息
export async function queryChannelEnum() {
    return request(`/modules/manage/pay/getFundsChannelNameEunm.htm`)
}
//获取渠道管理列表
export async function queryChannel(params) {
    return request(`/modules/manage/funds/getFundsChannel.htm?${stringify(params)}`)
}
//代扣方支持银行枚举
export async function querySupportBankEnum() {
    return request(`/modules/manage/pay/getRepayMent.htm`)
}
//修改渠道状态
export async function channelStatus(params) {
    return request(`/modules/manage/pay/updateFundsChannelStatus.htm?${stringify(params)}`)
}
//还款计算方式枚举
export async function queryRepayCountStyleEnum() {
    return request(`/modules/manage/pay/getFundsRepayWayEnum.htm`)
}
//获取资金计划配置
export async function queryFundConfig(params) {
    return request(`/modules/manage/funds/getFundsPlan.htm?${stringify(params)}`)
}
//获取产品系列
export async function queryProductSeries() {
    return request(`/modules/manage/pay/getProdLineEunm.htm`)
}
//获取合作方式枚举
export async function queryCooperationStyle() {
    return request(`/modules/manage/pay/getCooperationWayEnum.htm`)
}
//添加资金渠道
export async function saveFundsChannel(params) {
    return request(`/modules/manage/funds/saveFundsChannel.htm`,{
        method:"POST",
        body:stringify(params)
    })
}
//编辑资金渠道
export async function changeFundsChannel(params) {
    return request(`/modules/manage/pay/updateBizFundsChannel.htm`,{
        method:"POST",
        body:stringify(params)
    })
}
//配置资金计划
export async function saveFundsPlan(params) {
    return request(`/modules/manage/funds/saveFundsPlan.htm?${stringify(params)}`)
}
//资金配置计划总额
export async function queryPlanAmount(params) {
    return request(`/modules/manage/funds/getFundToday.htm`)
}
//获取银行设置
export async function queryBankConfig (params){
    return request(`/modules/manage/pay/payChannelBank.htm?${stringify(params)}`)
}
//获取代付代扣方
export async function queryAgentEnum(params) {
    return request(`/modules/manage/pay/getRepayMent.htm?${stringify(params)}`)
}

//获取编辑时的代扣方 代付方
export async function queryPayOrWithhold(params) {
    return request(`/modules/manage/pay/getRepayMent.htm?${stringify(params)}`)
}