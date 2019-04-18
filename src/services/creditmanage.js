/**
 * Created by Administrator on 2018/1/3 0003.
 * 信审管理
 */
import request from '../utils/request';

//信审管理 -- 审核状态枚举 1为全部 2为部分
export async function queryCreditLimitStatus(params){
  return request(`/modules/manage/credit/getCreditAuthStates.htm?type=${params}`)
}

//信审管理 -- 额度审核列表查询
export async function queryCreditLimitList(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/credit/creditAuthList.htm',{
    method:'POST',
    body: paramsStr
  })
}

//信审管理 -- 人工审核列表查询
export  async function queryManualReviewList(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/credit/creditPersonAuthList.htm',{
    method:'POST',
    body: paramsStr
  })
}

//信审管理 -- 提交人工审核结果
export  async function actionManualReview(params){
  let { creditId, remark, authState} = params;
  let paramsStr = `creditId=${creditId}&authState=${authState}&remark=${encodeURIComponent(remark)}`;
  return request('/modules/manage/credit/changeAuthState.htm',{
    method:'POST',
    body: paramsStr
  })
}

//信审管理 -- 手机运营商
export async function queryCreditPhone(params){
  return request(`/modules/manage/shanyinOptRisk/reportDetail.htm?userId=${params}`)
}


//信审管理 -- 规则报告
export async function queryCreditRules(params){
  return request(`/modules/manage/credit/ruleList.htm?userId=${params}`)
}

//信审管理 -- 淘宝信息 -- 基本信息
export async function queryCreditTaoBaoInfo(params){
  return request(`/modules/manage/shanyintaobao/taobaoInfo.htm?userId=${params}`)
}

//信审管理 -- 淘宝信息 -- 收货地址
export async function queryCreditTaoBaoList(params){
  let { pageSize, currentPage, userId} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&userId=${userId}`;
  return request('/modules/manage/shanyintaobao/taobaoadressList.htm',{
    method:'POST',
    body: paramsStr
  })
}

//信审管理 -- 信用卡信息 -- 基本信息
export async function queryCreditCardInfo(params){
  return request(`/modules/manage/creditCard/reportDetail.htm?userId=${params}`)
}

//信审管理 -- 信用卡信息 -- 收货地址
export async function queryCreditCardList(params){
  let { pageSize, currentPage, userId} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&userId=${userId}`;
  return request('/modules/manage/creditCard/billList.htm',{
    method:'POST',
    body: paramsStr
  })
}
