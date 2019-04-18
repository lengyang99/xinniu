/**
 * 订单管理菜单目录 -- 所有接口请求
 */
import request from '../utils/request';


//订单管理 - 还款订单
export async function queryRepayOrder(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/repay/orderList.htm?' + paramsStr,{
    method: 'GET',
  })
}

//订单管理 - 还款订单导出
export async function repayOrderExport(params){
  let { searchParams } = params;
  let paramsStr = `searchParams=${encodeURIComponent(searchParams)}`;
  window.location.href =  `/modules/manage/repay/orderListExport.htm?${paramsStr}`;
}


//订单管理 -  放款订单 - 放款记录详情
export async function queryRepayDetail(params){
  return request(`/modules/manage/repay/serial.htm?orderId=${params}`)
}

//订单管理 -  放款订单 - 放款
export async function actionOfflineRepay(params){
  let {orderId,amount} = params;
  let  paramsStr = `orderId=${orderId}&amount=${amount}`;
  return request('/modules/manage/repay/offlineRepay.htm',{
    method:'POST',
    body: paramsStr
  })
}

//订单管理 -  交租订单 - 部分还款
export async function actionPartRepay(params){
  let {orderId,amount} = params;
  let  paramsStr = `orderId=${orderId}&amount=${amount}`;
  return request('/modules/manage/repay/partRepay.htm',{
    method:'POST',
    body: paramsStr
  })
}
//订单管理 -  交租订单 - 部分还款
export async function queryRepayPlayByOrderId(params){
  let {orderId} = params;
  let  paramsStr = `orderId=${orderId}`;
  return request('/modules/manage/repay/getRepayPlayByOrderId.htm',{
    method:'POST',
    body: paramsStr
  })
}

//订单管理 -  交租订单 - 息费减免
export async function actionDerateRepay(params){
  let {orderId,amount} = params;
  let  paramsStr = `orderId=${orderId}&amount=${amount}`;
  return request('/modules/manage/repay/derateRepay.htm',{
    method:'POST',
    body: paramsStr
  })
}
//订单管理 -  交租订单 - 手动代扣
export async function actionOptRepay(params){
  let {orderId,amount} = params;
  let  paramsStr = `orderId=${orderId}&amount=${amount}`;
  return request('/modules/manage/repay/optRepay.htm',{
    method:'POST',
    body: paramsStr
  })
}
