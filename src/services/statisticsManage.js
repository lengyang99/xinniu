import request from '../utils/request';

// 流程转换率
export async function processTransformation(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/statistics/processTransformation.htm?'+paramsStr.join("&"));
}

//流程转换率导出
export async function processTransformationExport(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
  }
  window.location.href = '/modules/manage/statistics/processTransformationExport.htm?'+paramsStr.join("&");
}