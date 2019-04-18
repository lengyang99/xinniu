/**
 * 订单管理菜单目录 -- 所有接口请求
 */
import request from '../utils/request';


export async function queryStatusNav(){
  return request('/modules/manage/biz/orderEnum.htm')
}

//订单管理 - 借款订单
export async function queryBorrowOrder(params){
  let { pageSize, currentPage, searchParams} = params;
  let  paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/biz/orderList.htm?' + paramsStr, {
    method:'GET',
  })
}

//订单管理 - 借款订单 - 订单详情 - 合同金额
export async function queryBorrowOrderDetail(params){
  return request(`/modules/manage/biz/order/contractInfo.htm?orderId=${params}`);
}

//有米订单管理 - 借款订单 - 订单详情 - 设备信息
export async function youMiQueryBorrowOrderDetail(params){
  return request(`/modules/manage/biz/order/modelInfo.htm?orderId=${params}`);
}

//有米订单审核-通过
export async function orderAuthPass(params){
  return request(`/modules/manage/biz/riskOrder.htm?orderId=${params.orderId}&isPass=${params.isPass}&pageSize=${10}&currentPage=${1}`);
}

//有米订单审核-不通过
export async function orderAuthUnPass(params){
  return request(`/modules/manage/biz/noPassOrder.htm?orderId=${params}`);
}

//有米订单管理 - 借款订单 - 订单详情 - 租赁信息
export async function youMiLeaseholdBorrowOrderDetail(params){
  return request(`/modules/manage/biz/order/orderInfo.htm?orderId=${params}`);
}


//订单管理 - 借款订单 - 订单的还款计划
export async function queryBorrowOrderRepaymentplan(params){
  return request(`/modules/manage/biz/order/scheduleInfo.htm?orderId=${params}`);
}

//订单管理 - 放款订单
export async function queryLoanOrder(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/biz/loanOrderList.htm?' + paramsStr,{
    method: 'GET',
  })
}

//订单管理 -  放款订单 - 放款记录详情
export async function queryLoanDetail(params){
  return request(`/modules/manage/biz/order/loanDetail.htm?orderId=${params}`)
}

//订单管理 -  放款订单 - 放款
export async function actionLoan(params){
  let  paramsStr = `orderId=${params}`;
  return request('/modules/manage/biz/order/loan.htm',{
    method:'POST',
    body: paramsStr
  })
}

//订单管理 -  放款订单 - 再次放款
export async function actionLoanOrder(params){
  let  paramsStr = `orderId=${params}`;
  return request('/modules/manage/biz/order/loanAgain.htm',{
    method:'POST',
    body: paramsStr
  })
}

//订单管理 -  放款订单 - 批量放款  - TODO: 请求报文待定
export async function actionLoanOrderList(params){
  return request('/modules/manage/biz/order/batchLoanAgain.htm',{
    method:'POST',
    body:params
  })
}


//订单管理 -  放款订单  -导出excel表格
export async function queryExport(params){
	let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href = '/modules/manage/biz/loanOrder/export.htm?'+paramsStr.join("&");
}

//今日放款订单
export async function loanDataAmount(params){

	 let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/loanDataAmount.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });

}

//订单管理 -  放款订单 - 风控查询
export async function auditQuery(params){
  let  paramsStr = `orderId=${params}`;
  return request('/modules/manage/biz/order/auditQuery.htm',{
    method:'POST',
    body: paramsStr
  })
}

//订单管理 - 租赁订单 - 额度信息
export async function limitAmountInfo(){
  return request('/modules/manage/biz/limitAmountInfo.htm')
}



