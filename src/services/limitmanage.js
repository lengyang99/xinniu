/**
 * 额度管理菜单目录 -- 所有接口请求
 */

import request from '../utils/request';

//额度管理  -- 获取所有额度审核状态
export async function queryLimitAuditStatusList(){
  return request('/modules/manage/credit/getCreditInfoAuthStatus.htm')
}

//额度管理  -- 获取所有额度状态信息
export async function queryLimitStatusInfoList(){
  return request('/modules/manage/credit/getCreditInfoCreditStatus.htm')
}

//额度管理  -- 获取所有额度产品列表
export async function queryLimitTypeList(){
  return request('/modules/manage/credit/getCreditInfoTypes.htm')
}

//额度管理 -- 列表查询
export async function queryLimitList(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/credit/creditList.htm',{
    method:'POST',
    body: paramsStr
  })
}

//额度管理 -- 额度的释放与冻结
export async function actionUserLimit(params){
  let { creditInfoId, creditStatus } = params;
  let paramsStr = `creditInfoId=${creditInfoId}&creditStatus=${creditStatus}`;
  return request('/modules/manage/credit/updateCreditStatus.htm',{
    method:'POST',
    body: paramsStr
  })
}

//额度管理 -- 获取单个用户的额度详情
export async function queryUserLimitDetail(params){
  let { creditInfoId,  pageSize, currentPage } = params;
  let paramsStr = `creditInfoId=${creditInfoId}&pageSize=${pageSize}&currentPage=${currentPage}`;
  return request(' /modules/manage/credit/getCreditInfoDetail.htm',{
    method:'POST',
    body: paramsStr
  })
}


