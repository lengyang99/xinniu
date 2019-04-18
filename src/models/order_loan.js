/**
 * 放款订单的状态管理
 */

import { queryLoanOrder, queryLoanDetail, actionLoanOrder, actionLoan, actionLoanOrderList } from '../services/ordermanage';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'loanorder',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: false,
    modal: false,
    loanorderdetail: [],
    againresult:0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryLoanOrder, payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type: 'getListData',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *detailfetch({ payload }, { call, put }){
      yield put({
        type:'changeModal',
        payload:true,
      })
      let response = yield call(queryLoanDetail, payload);
      yield put({
        type:'getLoanOrderDetail',
        payload:response.resultData
      })
    },
    *againfetch({ payload, callback }, { call, put }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let response = yield call(actionLoanOrder, payload);
      if (callback) callback(response);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *loan({ payload, callback }, { call, put }){
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        let response = yield call(actionLoan, payload);
        if (callback) callback(response);
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }

  },
  reducers: {
    changeLoading(state, action){
      return {
        ...state,
        loading:action.payload
      }
    },
    getListData(state, action){
      return {
        ...state,
        data:{
          list: action.payload.resultData,
          pagination: action.payload.page,
        }
      }
    },
    changeModal(state, action ){
      return {
        ...state,
        modal:action.payload
      }
    },
    getLoanOrderDetail(state, action){
      return {
        ...state,
        loanorderdetail:action.payload
      }
    },
    againResult(state,action){
      return {
        ...state,
        againresult:action.payload.resultCode
      }
    }
  }
};
