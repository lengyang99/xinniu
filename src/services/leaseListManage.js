/**
 * 订单管理菜单目录 -  所有请求接口
 */
import request from '../utils/request';


/*
export async function queryExport(params){
	let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href = '/modules/manage/loanRecord/export.htm?'+paramsStr.join("&");
}*/

//订单管理 - 重新审核
export async function orderListExport(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href =  `/modules/manage/biz/orderListExport.htm?${paramsStr.join('&')}`;
}

//订单管理 - 重新审核
export async function routeAgainAudit(params){
	
	/* let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/route/againAudit.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });*/
	  return request(`/modules/manage/auditRoute/route/againAudit.htm?orderId=${params}`)
}
//订单管理 - 批量重新审核
export async function batchAudit(params){
	let paramsStr = [];
	  for(let i=0;i<params.length;i++){
	    paramsStr.push('ids='+encodeURIComponent(params[i]));
	  }
	  return request('/modules/manage/auditRoute/batch/againAudit.htm?'+paramsStr.join("&"));
}
//订单管理 - 驳回审核
export async function routeRefuseAudit(params){
	
	/*let paramsStr = [];
	for(let p in params){
		paramsStr.push(p+`=`+params[p]);
	}
	return request('/route/refuseAudit.htm',
			{method:'POST',
		body:paramsStr.join("&")
			});*/
	 return request(`/modules/manage/auditRoute/route/refuseAudit.htm?orderId=${params}`)
	
}
//订单管理 - 批量驳回审核
export async function batchRefuseAudit(params){
	let paramsStr = [];
	  for(let i=0;i<params.length;i++){
	    paramsStr.push('ids='+encodeURIComponent(params[i]));
	  }
	  return request('/modules/manage/auditRoute/batch/refuseAudit.htm?'+paramsStr.join("&"));
}
