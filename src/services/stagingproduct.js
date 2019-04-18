/**
 * 金融产品分期列表菜单 -- 所有接口请求
 */

import request from '../utils/request';

//获取产品列表
export async function queryProductList(params){
  //let { pageSize, currentPage, searchParams} = params;
  params =JSON.stringify(params)
  // console.log('params');
  // console.log(name);
  // console.log('encodeURIComponent_params');
  // console.log(encodeURIComponent(name));
  // console.log('encodeURI_params');
  // console.log(encodeURI(name));
  // console.log('escape_params');
  // console.log(escape(name));
  let paramsStr = `searchParams=${encodeURIComponent(params)}`;
  return request('/modules/manage/prod/list.htm?' + paramsStr,{
    method:'GET',
  })
}

//查看产品详情
export async function queryDetail(params){
  let paramsStr = `id=${params}`;
  return request('/modules/manage/product/baseDetail.htm?' + paramsStr,{
    method:'GET',
  })
}

//查看利率 或支付信审费或账户管理费
export async function queryDetailFee(params){
  let { id, rateVersion, type } = params;
  let paramsStr = `id=${id}&rateVersion=${rateVersion}&type=${type}`;
  return request('/modules/manage/product/feeItemDetail.htm',{
    method: 'POST',
    body: paramsStr
  })
}

//修改产品
export async function queryUpdateProd(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+encodeURIComponent(params[p]));
    }
    paramsStr = paramsStr.join("&")

	  return request('/modules/manage/product/updateProduct.htm?' + paramsStr,
			  {method:'GET'}
			  );
}

//添加产品
export async function querySaveProd(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+encodeURIComponent(params[p]));
    }
  paramsStr = paramsStr.join("&")
	  return request('/modules/manage/product/addProduct.htm?' +  paramsStr,
			  {method:'GET',
	  });
}
//获取期限列表
export async function queryPeriodValueList(){
	  return request('/modules/manage/product/getProdTypePeriodValue.htm');
}

//更新产品状态
export async function queryUpdateState(params) {
	let paramsStr = [];
  for(let p in params){
	  paramsStr.push(p+`=`+params[p]);
  }
  return request('/modules/manage/product/updateState.htm', {
    method:'POST',
    body: paramsStr.join(`&`)
  })
}
