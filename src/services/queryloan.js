import  request  from "../utils/request";
import { stringify } from "querystring";

//放款查询渠道枚举
export async function queryLoanChannelEnum (){
    return request(`/modules/manage/pay/getFundsChannelNameEunm.htm`)
}
//放款记录查询
export async function queryLoanRecord(params) {
    return request(`/modules/manage/biz/loanRecordList.htm?${stringify(params)}`)
}
//放款总额
export async function queryLoanAmount() {
    return request(`/modules/manage/loanDataAmount.htm`)
}
//查询产品系列枚举
export async function queryProductEnum() {
    return request(`/modules/manage/biz/getProdLine.htm`)
}