/**
 * 用户管理菜单目录 -  所有请求接口
 */
import request from '../utils/request';

//用户管理 - 获取所有注册列表
export async function queryAllChannel(){
  return request('/modules/manage/common/channelList.htm');
}

//用户管理 -导出excel表格
export async function queryExport(params){
	let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href = '/modules/manage/user/export.htm?'+paramsStr.join("&");
}

//用户管理 - 用户信息管理列表
export async function queryUserInfoList(params){
  var { pageSize, currentPage, searchParams} = params;
  var paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/user/list.htm',{
    method:'POST',
    body:paramsStr
  })
}

//用户管理 - 单个用户详细信息
export async function queryUserInfoDetail(params){
  return request(`/modules/manage/user/detail.htm?userId=${params}`);
}

//查询用户记录列表
export async function logList(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/user/logList.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
}
//查询用户反馈列表
export async function opinionList(params){
	let paramsStr = [];
	for(let p in params){
		paramsStr.push(p+`=`+params[p]);
	}
	return request('/modules/manage/opinion/opinionList.htm',
			{method:'POST',
		body:paramsStr.join("&")
			});
}
//查询反馈信息
export async function queryOpinion(params){
	const { userId } = params;
	  const paramsStr = `userId=${userId}`;
	return request('/modules/manage/opinion/opinion.htm',
			{method:'POST',
		body:paramsStr
			});
}
//添加反馈信息
export async function addFeedBack(params){
	const { opinionInfo } = params;
	  const paramsStr = `opinionInfo=${opinionInfo}`;
	return request('/modules/manage/opinion/addOpinion.htm',
			{method:'POST',
		body:paramsStr
			});
}
//更新反馈信息
export async function updateFeedBack(params){
	const { opinionInfo } = params;
	  const paramsStr = `opinionInfo=${opinionInfo}`;
	return request('/modules/manage/opinion/updateOpinion.htm',
			{method:'POST',
		body:paramsStr
			});
}

//查询用户银行卡列表
export async function bankList(params){
  return request('/modules/manage/biz/bank/list.htm?userId='+params);
}

//查询用户银行卡列表
export async function unBindCard(params){
  return request('/modules/manage/biz/bank/unBind.htm?cardId='+params);
}

//查询用户银行卡列表
export async function invalidCard(params){
  return request('/modules/manage/biz/bank/invalid.htm?cardId='+params);
}
