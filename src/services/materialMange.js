import requset from '../utils/request'
import {stringify} from 'qs'
//请求所有banner接口
export const allBanner = async function (params){
    return requset(`/modules/manage/banner/bannerList.htm?${stringify(params)}`)
}

//修改banner接口
export const changeBanner = async function (params) {
    let param = JSON.stringify(params)
    return requset(`/modules/manage/banner/saveOrUpdate.htm`,{
        method:'POST',
        body:`param=${param}`
    })
}
//修改状态
export const requestChangeStatus = async function (params){
    let paramsStr = [];
    for(let p in params){
      paramsStr.push(p+`=`+params[p]);
    }
    return requset(`/modules/manage/banner/updateBannerStatus.htm`,{
        method: 'POST',
        body: paramsStr.join("&")
    })
}

export const requestBannerInfo = async (param) => {
    return requset(`/modules/manage/banner/bannerInfo.htm?${stringify(param)}`)
}