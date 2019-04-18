/**
 * 系统管理 - 用户管理
 */
import request from '../utils/request';

//系统管理  -  角色权限管理 - table数据列表
export async function getRoleFetch(params){
  let {  pageSize, currentPage} = params;
  let paramsStr = `currentPage=${currentPage}&pageSize=${pageSize}`;
  return request('/modules/manage/sys/roleList.htm',{
    method: 'POST',
    body: paramsStr,
  });
}

// 系统管理 -- 用户管理 - 请求角色下拉列表
export async function queryRoleAllList() {
  return request('/modules/manage/sys/userRoleEnum.htm');
}

// 系统管理 - 用户管理  -  用户列表
export async function queryUserList(params) {
  const { pageSize, currentPage } = params;
  const paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}`;
  return request('/modules/manage/sys/userList.htm', {
    method: 'POST',
    body: paramsStr,
  });
}


// 系统管理 - 用户管理  -  定时任务列表
export async function queryTimed() {
  return request('/task/quartz/listAll.htm');
}

// 系统管理 - 用户管理  -  启动定时任务
export async function execute(id){
	return request('/task/quartz/execute.htm?id='+id);
}

//系统管理 - 用户管理  -  暂停定时任务
export async function suspend(id){
	return request('/task/quartz/delete.htm?id='+id);
}

//系统管理 - 用户管理  -  执行定时任务
export async function runJobNow(id){
	return request('/task/quartz/runJobNow.htm?id='+id);
}

//系统管理 - 用户管理  -  修改定时任务
export async function updateTask(param){
	let {id,name,cycle} = param;
	return request(`/task/quartz/update.htm?id=${id}&name=${name}&cycle=${cycle}`);
}

// 系统管理 - 用户管理  - 获取单个用户的信息
export async function queryUserRoleInfo(params) {
  const paramsStr = `userId=${params}`;
  return request('/modules/manage/sys/userInfo.htm', {
    method: 'POST',
    body: paramsStr,
  });
}


// 系统管理 - 用户管理  - 添加用户
export async function addUserList(params) {
  const { userInfo } = params;
  const paramsStr = `userInfo=${encodeURIComponent(userInfo)}`;
  return request('/modules/manage/sys/addUser.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 系统管理 - 用户管理  - 修改用户
export async function updateUserList(params) {
  const { userInfo } = params;
  const paramsStr = `userInfo=${encodeURIComponent(userInfo)}`;
  return request('/modules/manage/sys/updateUserInfo.htm', {
    method: 'POST',
    body: paramsStr
  })
}

//系统管理 - 用户管理 - 获取菜单目录
export async function queryAllNav(){
  return request('/modules/manage/sys/menuList.htm')
}

//获取觉得的菜单
export async function queryRoleMenu(params){
  let p = params?`?roleId=${params}`:'';
  return request('/modules/manage/sys/menu/allMenu.htm'+p)
}

//系统管理 - 菜单管理 - 添加菜单目录
export async function addSystemNav(params){
  let { menuInfo } = params;
  let paramsStr = `menuInfo=${encodeURIComponent(menuInfo)}`;
  return request('/modules/manage/sys/menu/addMenu.htm',{
    method: 'POST',
    body: paramsStr
  })
}

//系统管理 - 菜单管理 - 修改菜单目录
export async function updateSystemNav(params){
  let { menuInfo } = params;
  let paramsStr = `menuInfo=${menuInfo}`;
  return request('/modules/manage/sys/menu/updateMenu.htm',{
    method: 'POST',
    body: paramsStr
  })
}

//系统管理 - 用户管理 - 角色分配权限
export async function addRoleRight(params){
  let { role, menuRole} = params;
  let paramsStr = `role=${role}&menuRole=${menuRole}`;
  return request('/modules/manage/sys/setMenuRole.htm',{
    method: 'POST',
    body: paramsStr,
  });
}


/** 李秋奇* */

// 添加系统参数
export async function addSystemParams(params) {
  const { sysconfig } = params;
  const paramsStr = `sysconfig=${sysconfig}`;
  return request('/modules/manage/system/sysconfig/insert.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 删除系统参数
export async function deleteSystemParams(params) {
  const { id } = params;
  const paramsStr = `id=${id}`;
  return request('/modules/manage/system/sysconfig/delete.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 更新系统参数
export async function updateSystemParams(params) {
  const { sysconfig } = params;
  const paramsStr = `sysconfig=${sysconfig}`;
  return request('/modules/manage/system/sysconfig/update.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 列表查询
export async function querySystemList(params) {
  const { pageSize, currentPage, searchParams } = params;
  const paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${searchParams}`;
  return request('/modules/manage/system/sysconfig/list.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 刷新缓存
export async function refreshCache() {
  return request('/modules/manage/system/sysconfig/refreshCache.htm');
}

/**数据库参数**/
//系统管理 - 系统参数管理 - 父级参数列表
export async function querySystemDictParentList(params) {
  const { pageSize, currentPage, searchParams } = params;
  const paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${searchParams || ''}`;
  return request('/modules/manage/system/sysdict/list.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 父对应子级参数列表
export async function querySystemDictChildList(params) {
  const { pageSize, currentPage, searchParams } = params;
  const paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${searchParams || ''}`;
  return request('/modules/manage/system/sysdict/listDetail.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 更新父级参数更新
export async function updateSystemDictParent(params) {
  const { sysDict } = params;
  const paramsStr = `sysDict=${encodeURIComponent(sysDict)}`;
  return request('/modules/manage/system/sysdict/update.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 新增父级参数更新
export async function addSystemDictParent(params) {
  const { sysDict } = params;
  const paramsStr = `sysDict=${sysDict}`;
  return request('/modules/manage/system/sysdict/insert.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 删除父级参数更新
export async function delectSystemDictParent(params) {
  const { Id } = params;
  const paramsStr = `id=${Id}`;
  return request('/modules/manage/system/sysdict/delete.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 更新子级参数更新
export async function updateSystemDictChild(params) {
  const { sysdictDetail } = params;
  const paramsStr = `sysdictDetail=${encodeURIComponent(sysdictDetail)}`;
  return request('/modules/manage/system/sysdict/updateDetail.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 新增子级参数
export async function addSystemDictChild(params) {
  const { sysdictDetail } = params;
  const paramsStr = `sysdictDetail=${sysdictDetail}`;
  return request('/modules/manage/system/sysdict/insertDetail.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

//系统管理 - 系统参数管理 - 删除子级参数
export async function delectSystemDictChild(params) {
  const { Id } = params;
  const paramsStr = `id=${Id}`;
  return request('/modules/manage/system/sysdict/deleteDetail.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 刷新缓存
export async function refreshCacheSystemDict() {
  return request('/modules/manage/system/sysdict/refreshCache.htm');
}


export async function addRole(params) {
  let paramsStr = [];
  for(let p in params){
	  paramsStr.push(p+'='+window.encodeURIComponent(params[p]));
  }
  return request('/modules/manage/sys/saveRole.htm', {
    method:'POST',
    body: paramsStr.join(`&`)
  })
}


export async function editRole(params) {
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+'='+window.encodeURIComponent(params[p]));
	  }
	  return request('/modules/manage/sys/updateRole.htm', {
	    method:'POST',
	    body: paramsStr.join(`&`)
	  })
	}

//获取所有用户姓名id
export async function queryUserAllList() {
  return request('/modules/manage/sys/allUserList.htm');
}


