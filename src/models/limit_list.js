/**
 * Created by Administrator on 2017/12/13 0013.
 */
import {queryLimitAuditStatusList, queryLimitStatusInfoList, queryLimitTypeList, queryLimitList, actionUserLimit, queryUserLimitDetail} from '../services/limitmanage';
import { routerRedux } from 'dva/router';

export  default  {
  namespace:'limitlist',
  state:{
     data:{
       list:[],
       pagination:{}
     },
    limitstatus:[],
    limittype:[],
    limitaudittype:[],
    loading:false,
  },
  effects:{
     *fetch({payload,callback},{call,put}){
        yield put({
          type:'changeLoading',
          payload: true,
        })
       let result = yield call(queryLimitList, payload);
       if(result.resultCode === 800){
         yield put(routerRedux.push('/user/login'));
         window.location.reload();
         return false
       }
        yield put({
          type:'getLimitListData',
          payload:result
        })
       yield put({
         type:'changeLoading',
         payload:false,
       })
       if(callback) callback(result);
     },
     *limitstatusfetch({_}, { call,put }){
        let result =  yield call(queryLimitStatusInfoList);
        yield put({
          type:'getLimitStatusData',
          payload: result.resultData
        })
     },
    *limitauditstatusfetch({}, { call, put }){
      let result =  yield call(queryLimitAuditStatusList);    //额度审核状态请求
      yield put({
        type:'getLimitAuditStatusData',
        payload: result.resultData
      })
    },
    *limittypefetch({}, { call, put }){
      let result =  yield call(queryLimitTypeList);    //额度产品类型请求
      yield put({
        type:'getLimitTypeData',
        payload: result.resultData
      })
    },
    *actionUserLimitfetch({payload,callback}, { call, put }){
      yield put({
        type:'changeLoading',
        payload:true,
      })
      let result =  yield call(actionUserLimit, payload); // 额度释放与占用
      yield put({
        type:'changeLoading',
        payload:false,
      })
      if(callback) callback(result);
    },
    *userLimitDetailfetch({payload, callback}, { call }){
      let result =  yield call(queryUserLimitDetail, payload);   // 单个用户的额度查询明细
      if(callback) callback(result);
    },
  },
  reducers:{
    changeLoading(state, action){
      return {
        ...state,
        loading: action.payload
      }
    },
    getLimitListData(state, action){
      return {
        ...state,
        data:{
          list:action.payload.resultData,
          pagination :action.payload.page
        }
      }
    },
    getLimitStatusData(state, action){
      return {
        ...state,
        limitstatus:action.payload,
      }
    },
    getLimitAuditStatusData(state, action){
      return {
        ...state,
        limitaudittype:action.payload
      }
    },
    getLimitTypeData(state, action){
      return {
        ...state,
        limittype:action.payload
      }
    },
  }
}
