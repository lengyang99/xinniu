/**
 * 用户管理菜单目录 -  所有请求接口
 */
import request from '../utils/request';


//用户管理 -导出excel表格
export async function queryExport(params){
	let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href = '/modules/manage/repayRecord/export.htm?'+paramsStr.join("&");
}

//用户管理 - 用户信息管理列表
export async function queryUserInfoList(params){
	
	 let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/repay/rentRecordList.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	
}
//今日交租记录订单
export async function repayRecordAmount(params){
	
	let paramsStr = [];
	for(let p in params){
		paramsStr.push(p+`=`+params[p]);
	}
	return request('/modules/manage/repayRecordAmount.htm',
			{method:'POST',
		body:paramsStr.join("&")
			});
	
}

//今日交租订单
export async function repayDataAmount(params){
	let paramsStr = [];
	for(let p in params){
		paramsStr.push(p+`=`+params[p]);
	}
	return request('/modules/manage/repayDataAmount.htm',
			{method:'POST',
		body:paramsStr.join("&")
			});
}
