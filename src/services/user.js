import request from '../utils/request';

//获取当前用户的信息
export async function queryCurrent() {
  return request('/modules/manage/sys/sysUserInfo.htm');
}

//获取当前用户的菜单列表
export async function queryCurrentUserNav() {
  return request('/modules/manage/sys/menuList.htm')
}
