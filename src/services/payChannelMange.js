import request from '../utils/request'
import {stringify} from 'qs'
//获取场景枚举
export async function queryChannelEnum() {
    return request(`/modules/manage/pay/payChannelEnum.htm`)
}
//获取支付渠道列表
export async function getPayChannel(params) {
    return request(`/modules/manage/pay/payChannel.htm?${stringify(params)}`)
}
//修改状态
export async function ChannelStatus(params) {
    return request(`/modules/manage/pay/updatePayChannelStatus.htm?${stringify(params)}`)
}
//请求银行枚举
export async function queryBankEnum() {
    return request(`/modules/manage/pay/payChannelBankEnum.htm`)
}
//添加支付渠道
export async function savePayChannel(params) {
    return request(`/modules/manage/pay/savePayBank.htm`,{
        method:"POST",
        body:stringify(params)
    })
}
//获取银行设置
export async function queryBankConfig (params){
    return request(`/modules/manage/pay/payChannelBank.htm?${stringify(params)}`)
}
//编辑支付渠道
export async function changePayChannel(params) {
    return request(`/modules/manage/pay/updatePayChannel.htm`,{
        method:"POST",
        body:stringify(params)
    })
}
//删除银行配置
export async function delBankConfig(params) {
   return request(`/modules/manage/pay/deletePayChannelBank.htm?${stringify(params)}`)
}