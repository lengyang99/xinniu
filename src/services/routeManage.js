import request from '../utils/request';
// 查找路由配置信息
export async function queryRouteInfo() {
  return request('/modules/manage/route/findRouteInfo.htm')
}
// 刷新缓存
export async function queryRefresh() {
  return request('/modules/manage/route/refresh.htm')
}
// 控制路由开关
export async function queryRouteSwitch(params) {
  let {switchID, switchKey} = params;
  let paramsStr = `switchID=${switchID}&switchKey=${switchKey}`;
  return request('/modules/manage/route/routeSwitch.htm', {
    method:'POST',
    body: paramsStr
  })
}
// 路由开启状态设置
export async function queryRouteAlive(params) {
  let {channelId, channelType, alive} = params;
  let paramsStr = `channelId=${channelId}&channelType=${channelType}&alive=${alive}`;
  return request('/modules/manage/route/routeAlive.htm', {
    method:'POST',
    body: paramsStr
  })
}
// 更新配置信息
export async function queryUpdateRouteConfig(params) {
  let {channelId, channelType, weight, ratio, startTime, endTime, quotaPerDay} = params;
  let paramsStr = `channelId=${channelId}&channelType=${channelType}&weight=${weight}&ratio=${ratio}&startTime=${startTime}&endTime=${endTime}&quotaPerDay=${quotaPerDay}`;
  return request('/modules/manage/route/updateRouteConfig.htm', {
    method:'POST',
    body: paramsStr
  })
}
// 银行配置list
export async function queryRouteBankPage(params) {
  let {currentPage, pageSize, channelId, channelType, bankName} = params;
  let paramsStr = `currentPage=${currentPage}&pageSize=${pageSize}&channelId=${channelId}&channelType=${channelType}&bankName=${bankName}`;
  return request('/modules/manage/route/findRouteBankPage.htm', {
    method:'POST',
    body: paramsStr
  })
}
// 银行开关
export async function queryRouteBankAlive(params) {
  let {id, alive} = params;
  let paramsStr = `id=${id}&alive=${alive}`;
  return request('/modules/manage/route/routeBankAlive.htm', {
    method:'POST',
    body: paramsStr
  })
}
// 银行更新
export async function querypdateRouteBank(params) {
  let {id, quotaPerOnce, quotaPerDay, quotaPerThirty} = params;
  let paramsStr = `id=${id}&quotaPerOnce=${quotaPerOnce}&quotaPerDay=${quotaPerDay}&quotaPerThirty=${quotaPerThirty}`;
  return request('/modules/manage/route/updateRouteBank.htm', {
    method:'POST',
    body: paramsStr
  })
}
