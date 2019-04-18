/**
 * 订单管理菜单目录 -- 所有接口请求
 */
import request from '../utils/request';


//订单管理 - 还款订单
export async function queryManageHandle(params){
  let { pageSize, currentPage, searchParams} = params;
  let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
  return request('/modules/manage/manageHandle/list.htm',{
    method: 'POST',
    body: paramsStr
  })
}
