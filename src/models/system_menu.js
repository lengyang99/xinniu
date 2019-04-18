/**
 * Created by Administrator on 2017/12/26 0026.
 */
import { queryAllNav, addSystemNav, updateSystemNav} from '../services/systemmanage';
import { routerRedux } from 'dva/router';

export default {
  namespace : 'systemmenu',
  state:{
    menulist: [],
    loading: false,
  },
  effects:{
    *fetch({},{call,put}){
      yield put({
        type:'changeLoading',
        payload:true
      });
      let result = yield call(queryAllNav);
      if(result.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type:'setSystemmenuData',
        payload: result.resultData
      })
    },
    *addmenufetch({payload,callback},{call,put}){
      let result = yield call(addSystemNav, payload);
      if(callback) callback(result);
    },
    *updatemenufetch({payload,callback},{call,put}){
      let result = yield call(updateSystemNav, payload);
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
    setSystemmenuData(state,action){
      return {
        ...state,
        menulist: action.payload
      }
    }
  }

}

