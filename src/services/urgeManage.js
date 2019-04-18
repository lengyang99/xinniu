import request from '../utils/request';

//今日还款订单详情
export async function todayRepayInfo(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/urge/todayRepayInfo.htm?'+paramsStr.join("&"));
}

//今日还款订单详情导出
export async function todayRepayInfoExport(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
  }
  window.location.href = '/modules/manage/urge/todayRepayInfoExport.htm?'+paramsStr.join("&");
}

//逾期一天信息
export async function overdueOneDayOrderInfo(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/urge/overdueOneDayOrderInfo.htm?'+paramsStr.join("&"));
}

//逾期一天信息导出
export async function overdueOneDayOrderInfoExport(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
  }
  window.location.href = '/modules/manage/urge/overdueOneDayOrderInfoExport.htm?'+paramsStr.join("&");
}

//逾期二天信息
export async function overdueTwoDayOrderInfo(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/urge/overdueTwoDayOrderInfo.htm?'+paramsStr.join("&"));
}

//逾期二天信息导出
export async function overdueTwoDayOrderInfoExport(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
  }
  window.location.href = '/modules/manage/urge/overdueTwoDayOrderInfoExport.htm?'+paramsStr.join("&");
}

