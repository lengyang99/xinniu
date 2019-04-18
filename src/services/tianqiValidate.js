import request from '../utils/request';

//导入excel
export async function importValidateData(){
  return request('/modules/manage/validateData/import.htm')
}
//导出验证通过数据
export async function exportValidateData(){
  window.location.href = '/modules/manage/validateData/export.htm';
}
// 获取验证通过列表列表
export async function successList(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+params[p]);
  }
	  return request('/modules/manage/validateData/successList.htm',
      {method:'POST',
        body:paramsStr.join("&")
      });
}

// 获取验证未通过列表列表
export async function failList(){
	  return request('/modules/manage/validateData/failList.htm');
}

//忽略验证未通过数据
export async function toIgnore(){
  return request('/modules/manage/validateData/ignore.htm');
}

//重新编辑
export async function reEdit() {
  return request('/modules/manage/validateData/reEdit.htm');
}
