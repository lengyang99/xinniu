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
	  window.location.href = '/modules/manage/loanRecord/export.htm?'+paramsStr.join("&");
}

//用户管理 - 用户信息管理列表
export async function queryUserInfoList(params){
	
	 let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/biz/loanRecordList.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	
}
export async function loanRecordAmount(params){
	
	 let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/loanRecordAmount.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	
}

