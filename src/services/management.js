/**
 * 机型管理 
 */
import request from '../utils/request';
import {message} from 'antd';

// 机型管理 -- 机型管理 - 枚举列表
export async function queryRoleAllList() {
  return request('/modules/manage/system/sysdict/getDictBytypes.htm');
}

// 机型管理 - 机型管理  -  机型列表
export async function queryUserList(params) {
  const { pageSize, currentPage, searchParams } = params;
  const paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${searchParams || ''}`;
  return request('/modules/manage/phone/list.htm', {
    method: 'POST',
    body: paramsStr,
  });
}

// 机型管理 - 机型管理  - 表格编辑/查询
export async function findPhoneModel(params) {
  const paramsStr = `phId=${params}`;
  return request('/modules/manage/phone/findPhoneModel.htm', {
    method: 'POST',
    body: paramsStr,
  });
}


// 机型管理 - 机型管理  - 添加机型
export async function addUserList(params) {
  const xhr = new XMLHttpRequest()
        
        xhr.open("POST", "/modules/manage/phone/addPhone.htm", true)
         
        xhr.withCredentials = true
        xhr.send(params)

        xhr.onreadystatechange = (result) =>{
         {  
          if(xhr.status == 200&& xhr.readyState == 4){                  
                console.log(result)
	      	        	var obj = result.srcElement.response; 
						var lang = "";
						var langs = "";
						console.log(obj)
						lang = lang + obj[14] + obj[15] + obj[16] + obj[17];
						langs = langs + obj[36] + obj[37] + obj[38] + obj[39];
						if(lang == 2000){
							message.error(lang,4,function(){
								window.location.reload();
							});
						}
						if(lang == 1000){
							message.success("添加成功",4,function(){
								window.location.reload();
							});
			            }     
             }
         }
              
        } 
  
  return ""
}

// 机型管理 - 机型管理  - 修改用户
export async function updatePhone(params) {
   const xhr = new XMLHttpRequest()
        
        xhr.open("POST", "/modules/manage/phone/updatePhone.htm", true)
         
        xhr.withCredentials = true
        xhr.send(params)

        xhr.onreadystatechange = (result) =>{
	        {  
	            if(xhr.status == 200 && xhr.readyState == 4){
	            	console.log(result)
	      	        	var obj = result.srcElement.response; 
						var lang = "";
						var langs = "";
						lang = lang + obj[14] + obj[15] + obj[16] + obj[17];
						langs = langs + obj[36] + obj[37] + obj[38] + obj[39];
						if(lang == 2000){
							message.error(langs,4,function(){
								window.location.reload();
							})
						}
						if(lang == 1000){
							message.success("更新成功",4,function(){
								window.location.reload();
							});
			            }      	              	        
	            }
	          
	        }
              
        } 
  
  return ""
  
}

// 机型管理 - 机型管理  - 删除
export async function deletePhoneModel(params) {
  const { id } = params;
  const paramsStr = `id=${id}`;
  return request('/modules/manage/phone/deletePhoneModel.htm', {
    method: 'POST',
    body: paramsStr,
  });
}









//机型管理 - 机型管理 - 获取菜单目录
export async function queryAllNav(){
  return request('/modules/manage/sys/menuList.htm')
}

//机型管理 - 机型管理 - 添加菜单目录
export async function addSystemNav(params){
  let { menuInfo } = params;
  let paramsStr = `menuInfo=${encodeURIComponent(menuInfo)}`;
  return request('/modules/manage/sys/menu/addMenu.htm',{
    method: 'POST',
    body: paramsStr
  })
}

//机型管理 - 机型管理 - 修改菜单目录
export async function updateSystemNav(params){
  let { menuInfo } = params;
  let paramsStr = `menuInfo=${menuInfo}`;
  return request('/modules/manage/sys/menu/updateMenu.htm',{
    method: 'POST',
    body: paramsStr
  })
}

//机型管理 - 机型管理 - 角色分配权限
export async function actionRoleRight(params){
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
