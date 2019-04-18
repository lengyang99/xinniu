import { allBanner, changeBanner,requestChangeStatus, requestBannerInfo } from '../services/materialMange'

export default {
    namespace: 'materialmange',
    state:{
        banners:[],
        loading: true,
        bannerInfo:{},
        page:{}
    },
    effects:{
        *getAllBanner({payload,callback},{put,call}){
            let result = yield call(allBanner,payload)
            if(result.resultCode === 1000){
                yield put({type:'setAllBanner',payload:result})
            }
        },
        *submitBanner({payload,callback},{put,call}){
            yield put({type:'changeLoading',payload:true})
            let result = yield call(changeBanner,payload)
            if(result.resultCode === 1000){
                let param = {
                    currentPage:1,
                    pageSize:10
                }
                yield put({type:'getAllBanner',payload:{...param}})
                yield put({type:'changeBannerInfo',payload:{}})
                yield call(callback)
            }
            yield put({type:'changeLoading',payload:false})
        },
        *changeStatus({payload},{call, put}){
            yield put ({type:'changeLoading',payload:true})
            let result = yield call(requestChangeStatus,{...payload})
            if(result.resultCode === 1000){
                let param = {
                    currentPage:1,
                    pageSize:10
                }
                yield put({type:'getAllBanner',payload:{...param}})
            }
        },
        *getBannerInfo({payload,callback}, {put, call}){
            let result = yield call(requestBannerInfo,payload)
            if(result.resultCode === 1000){
                yield put({type: 'changeBannerInfo', payload:{...result.resultData}})
                yield call(callback,{...result.resultData})
            }
        }
    },
    reducers:{
        setAllBanner(state,action){
            let result = action.payload
            return {
                ...state,
                banners: result.resultData,
                page: result.page
            }
        },
        changeLoading(state, action) {
            return {
              ...state,
              loading: action.payload,
            };
          },
          changeBannerInfo(state,action){
            return {
                ...state,
                bannerInfo: action.payload
            }
          }
    }
}