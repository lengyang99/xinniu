import request from '../utils/request';

// 获取所有渠道列表
export async function bizStatusEnum(params){
	  let tp = params?`type=${params}`:'';
	  return request('/modules/manage/common/bizStatusEnum.htm?'+tp);
}

//获取所有用户状态
export async function userStatusEnum(){
	  return request('/modules/manage/common/userStatusEnum.htm');
}

//获取所有风控审核列表
export async function auditorList(params){
	  let tp = params?`onStatus=${params}`:'';
	  return request('/modules/manage/common/auditorList.htm?'+tp);
}

//查询导出任务进度
export async function taskInfo(type){
	  return request('/modules/manage/export/taskInfo.htm?type='+type);
}

export async function taskExport(type){
	  window.location.href = '/modules/manage/export/export.htm?type='+type;
}

export function analysisTaskInfo(info){
	if(!info){
		return [0,"无任务"];
	}
	if(info.status === -1 ){
		return [0,"导出出错，请重新导出，或联系程序员"];
	}
	if(info.status === 1 ){
		return [1,"等待开始"];
	}
	if(info.status === 2 ){
		return [1,(info.progress*100).toFixed(0)+"%"];
	}
	if(info.status === 3 ){
		return [2,"等待下载"];
	}
	if(info.status === 4 ){
		return [2,"下载完成"];
	}
}


