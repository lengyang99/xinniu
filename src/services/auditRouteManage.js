import request from '../utils/request';
// 查找路由配置信息
export async function queryRouteList() {
  return request('/modules/manage/auditRoute/list.htm')
}
// 刷新缓存
export async function queryRefresh() {
  return request('/modules/manage/auditRoute/refresh.htm')
}
// 控制路由开关
export async function querySwitchRoute() {
  return request('/modules/manage/auditRoute/routeSwitch.htm')
}
// 更新配置信息
export async function queryUpdateRouteConfig(params) {
	let paramsStr = [];
  for(let p in params){
	  paramsStr.push(p+`=`+params[p]); 
  }
  return request('/modules/manage/auditRoute/editConfig.htm', {
    method:'POST',
    body: paramsStr.join(`&`)
  })
}
// 统计数据
export async function queryStatistics(params) {
	let paramsStr = [];
  for(let p in params){
	  paramsStr.push(p+'='+window.encodeURIComponent(params[p])); 
  }
  return request('/modules/manage/auditRoute/statisticsList.htm', {
    method:'POST',
    body: paramsStr.join(`&`)
  })
}

//导出统计数据
export async function exportStatistics(params) {
  let paramsStr = [];
  for(let p in params){
	  paramsStr.push(p+'='+window.encodeURIComponent(params[p])); 
  }
  window.location.href = '/modules/manage/auditRoute/statisticsExport.htm?'+paramsStr.join('&');
}