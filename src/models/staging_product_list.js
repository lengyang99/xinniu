/**
 * Created by Administrator on 2017/12/19 0019.
 */
import { queryProductList, queryDetail, queryDetailFee } from '../services/stagingproduct'
import { routerRedux } from 'dva/router';

export default {
  namespace: 'productlist',
  state:{
    data:{
      list:[],
      pagination: {},
    },
    loading: false,
    recorddetail: '',
  },
  effects:{
    *fetch({ payload },{ call, put }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let result = yield call(queryProductList,payload);
      if(result.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type: 'getProductList',
        payload: result
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    //查看产品详情
    *productfetch( { payload, callback }, {call, put }){
      let result = yield call(queryDetail,payload);
      if(callback) callback(result);
    },
    //查看利率 或支付信审费或账户管理费
    *productfeefetch({ payload, callback }, { call, put }){
      let result = yield call(queryDetailFee,payload);
      if(callback) callback(result);
    }

  },
  reducers:{
    changeLoading(state,action){
      return {
        ...state,
        loading: action.payload
      }
    },
    getProductList(state,action){
      return {
        ...state,
        data:{
          list:action.payload.resultData,
          pagination: action.payload.page,
        }
      }
    },
    getProductDetail(state, action){
      return {
        ...state,
        recorddetail:action.payload.resultData,
      }
    }
  }
}
