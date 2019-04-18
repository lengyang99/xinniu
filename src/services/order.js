/**
 * 订单管理菜单目录 -- 所有接口请求
 */
import request from '../utils/request';
import { stringify } from 'qs';

export async function queryStatusNav(){
  return request('/modules/manage/biz/orderEnum.htm')
}

//货代订单- 货代订单 
export async function queryBorrowOrder(params){
  return request(`/modules/manage/biz/orderList.htm?${stringify(params)}`)
}

//货代订单- 导出列表 
export async function orderListExport(params){
  window.location.href = `/modules/manage/biz/orderListExport.htm?${stringify(params)}`;
}

//货代订单-  货代订单 - 放款记录详情 
export async function queryLoanDetail(params){
  return request(`/modules/manage/biz/order/loanDetail.htm?${stringify(params)}`)
}

//货代订单-  货代订单 - 还款详情 
export async function queryRepayDetail(params){
  return request(`/modules/manage/repay/serial.htm?${stringify(params)}`)
}

//货代订单-  货代订单 - 还款计划 
export async function queryRepayPlan(params){
  return request(`/modules/manage/repay/getRepaymentPlan.htm?${stringify(params)}`)
}

//货代订单  获取产品系列
export async function getProdLine(params){
  return request(`/modules/manage/biz/getAllProdLine.htm?${stringify(params)}`)
}

//货代订单  获取渠道
export async function auditorList(){
  return request(`/modules/manage/common/auditorList.htm?`)
}

//货代订单- 用户详情 
export async function queryUserDetail(params){
  return request(`/modules/manage/user/detail.htm?${stringify(params)}`)
}

//货代订单- 回调审核结果 
export async function auditQuery(params){
  return request(`/modules/manage/biz/order/auditQuery.htm?${stringify(params)}`)
}

//货代订单- 自动审核 
export async function againAudit(params){
  return request(`/modules/manage/auditRoute/route/againAudit.htm?${stringify(params)}`)
}

//货代订单- 人工审核  
export async function manualReview(params){
  return request(`/modules/manage/biz/manualReview.htm?${stringify(params)}`)
}

//货代订单- 下载合同
export async function tongrongContract(params){
  return request(`/modules/manage/biz/tongrongContract.htm?${stringify(params)}`)
}

// 货代订单批量审核 
export async function bathAgainAudit(params){
  return request(`/modules/manage/auditRoute/batch/againAudit.htm?${stringify(params)}`)
}

// 放款订单 订单列表 
export async function queryLoanOrderList(params){
  return request(`/modules/manage/biz/loanOrderList.htm?${stringify(params)}`)
}

// 放款订单 导出列表 
export async function exportLoan(params){
  window.location.href =`/modules/manage/biz/loanOrder/export.htm?${stringify(params)}`;
}

// 放款订单 批量放款 
export async function batchLoanAgain(params){
  return request(`/modules/manage/biz/order/batchLoanAgain.htm?${stringify(params)}`)
}

//放款订单 放款总额
export async function loanDataAmount(params){
  return request(`/modules/manage/loanDataAmount.htm?${stringify(params)}`)
}

// 放款订单 手动放款
export async function loan(params){
  return request(`/modules/manage/biz/order/loan.htm?${stringify(params)}`)
}

// 放款订单 再次放款
export async function loanAgain(params){
  return request(`/modules/manage/biz/order/loanAgain.htm?${stringify(params)}`)
}

// 放款订单 关闭订单 
export async function closedOrder(params){
  return request(`/modules/manage/biz/order/closedOrder.htm?${stringify(params)}`)
}

// 放款订单 确认放款失败 
export async function confirmPayFail(params){
  return request(`/modules/manage/biz/order/confirmPayFail.htm?${stringify(params)}`)
}

// 放款订单 查询放款状态  
export async function loanEnum(params){
  return request(`/modules/manage/biz/order/loanEnum.htm?${stringify(params)}`);
}

// 还款订单/线下还款审核 订单列表 
export async function queryRepayList(params){
  return request(`/modules/manage/repay/orderList.htm?${stringify(params)}`);
}

// 还款订单 审核状态
export async function offlineAuditStatus(params){
  return request(`/modules/manage/repay/offlineAuditStatus.htm?${stringify(params)}`);
}

// 还款订单 导出 
export async function exportRepay(params){
  window.location.href = `/modules/manage/repay/orderListExport.htm?${stringify(params)}`;
}

// 还款订单 获取还款总额 
export async function repayRecordAmount(params){
  return request(`/modules/manage/repayRecordAmount.htm?${stringify(params)}`);
}

// 还款订单 查询还款状态/订单状态
export async function bizStatusEnum(params){
  return request(`/modules/manage/common/bizStatusEnum.htm?${stringify(params)}`);
}

//还款订单 线下还款方式
export async function offlineAuditTypeEnum(params){
  return request(`/modules/manage/repay/offlineAuditTypeEnum.htm?${stringify(params)}`);
}

//还款订单 获取还款计划
export async function getRepayPlayByOrderId(params){
  return request(`/modules/manage/repay/offlineAuditDetail.htm?${stringify(params)}`);
}

// 还款订单 批量息费减免
export async function batchDerateRepay(params){
  return request(`/modules/manage/repay/batchDerateRepay.htm?${stringify(params)}`);
}

// 还款订单 息费减免
export async function derateRepay(params){
  return request(`/modules/manage/repay/derateRepay.htm?${stringify(params)}`);
}

// 还款订单 取消线下入账
export async function cancelOfflineAudit(params){
  return request(`/modules/manage/repay/cancelOfflineAudit.htm?${stringify(params)}`);
}

// 还款订单 批量线下还款
export async function batchOfflineRepay(params){
  return request(`/modules/manage/repay/batchOfflineRepay.htm?${stringify(params)}`);
}

// 还款订单 线下还款
export async function offlineRepay(params){
  return request(`/modules/manage/repay/offlineRepay.htm?${stringify(params)}`);
}

//还款订单 手动代扣
export async function optRepay(params){
  return request(`/modules/manage/repay/optRepay.htm?${stringify(params)}`);
}

// 线下还款初审列表
export async function offlineAudit(params){
  return request(`/modules/manage/repay/offlineAudit.htm?${stringify(params)}`);
}

// 线下还款初审审核
export async function updateOfflineAuditStatus(params){
  return request(`/modules/manage/repay/updateOfflineAuditStatus.htm?${stringify(params)}`);
}

//线下还款初审导出
export async function offlineAuditExport(params){
  window.location.href = `/modules/manage/repay/offlineAuditExport.htm?${stringify(params)}`;
}

// 线下还款初审 线下入账类型
export async function offlineRepyaTypeEnum(params){
  return request(`/modules/manage/repay/offlineRepyaTypeEnum.htm?${stringify(params)}`);
}
