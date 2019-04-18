/**
 * Created by Administrator on 2017/12/13 0013.
 */
import { routerRedux } from 'dva/router';
import { queryCreditLimitStatus, queryManualReviewList, actionManualReview ,
          queryCreditTaoBaoInfo, queryCreditTaoBaoList, queryCreditPhone,
          queryCreditCardInfo, queryCreditCardList, queryCreditRules } from '../services/creditmanage';


export default {
  namespace:'creditmanual',
  state:{
    data:{
      list:[],
      pagination:{}
    },
    manuallimitstatus:[],
    loading:false,
  },
  effects:{
    *fetch({payload,callback},{call,put}){
      yield put({
        type:'changeLoading',
        payload: true,
      })
      let result = yield call(queryManualReviewList, payload);
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
    *manualstatusfetch({_}, { call,put }){
      //额度审核状态
      let result = yield call(queryCreditLimitStatus,2);
      yield put({
        type:'getLimitStatusData',
        payload: result.resultData
      })
    },
    *taobaoInfofetch({payload, callback}, { call }){
      let result = yield call(queryCreditTaoBaoInfo,payload);
      if(callback) callback(result);
    },
    *taobaolistfetch({payload, callback}, { call }){
      let result = yield call(queryCreditTaoBaoList,payload);
      if(callback) callback(result);
    },
    *mobileInfofetch({payload, callback}, { call }){
      let result = yield call(queryCreditPhone,payload);
      if(callback) callback(result);
    },
    *ruleInfofetch({payload, callback}, { call }){
      let result = yield call(queryCreditRules,payload);
      if(callback) callback(result);
    },
    *cardInfofetch({ payload, callback}, { call }){
      let result = yield call(queryCreditCardInfo, payload);
      console.log(result);
      if(callback) callback(result);
    },
    *cardlistfetch({payload, callback}, { call }){
      let result = yield call(queryCreditCardList,payload);
      if(callback) callback(result);
    },
    *changeUserCreditStatus({payload, callback},{ call }){
      let result = yield call(actionManualReview,payload);
      if(callback) callback(result);
    }
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
        manuallimitstatus:action.payload,
      }
    },
  }
}
