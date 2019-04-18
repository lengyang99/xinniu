/**
 * Created by Administrator on 2017/12/16 0016.
 */
/**
 * 放款订单的状态管理
 */

import { queryRoleAllList, queryUserList, addUserList, queryUserRoleInfo, updateUserList, queryAllNav, getRoleFetch, queryRoleMenu, addRole ,editRole } from '../services/systemmanage';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'systemrole',
  state: {
    loading:false,
    menulist:[],
    navlist:[],
    data:{
      list:[],
      pagination:{}
    },
    modal:false,
    singleData:{},
  },
  effects: {
    //获取所有的角色
    *menufetch( { },{ call , put}){
       let result = yield call(queryRoleAllList);
       yield put({
         type:'getMenuDataList',
         payload: result
       })
    },
    //获取所有的系统菜单目录
    *systemnav({ payload },{ call, put }){
      let result = yield call(queryRoleMenu,payload);
      yield put({
        type:'getNavDataList',
        payload: result
      })
      yield put({
          type:'changeModal',
          payload:true
    });
    },
    //获取所有的用户列表
    *fetch({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:true,
      })
      let response = yield call(queryUserList,payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type:'getDataList',
        payload: response
      })
     yield put({
       type:'changeLoading',
       payload:false
     })
    },
    
    //获取所有的角色
    *userRolefetch({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:true,
      })
      let response = yield call(getRoleFetch,payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type:'getDataList',
        payload: response
      })
     yield put({
       type:'changeLoading',
       payload:false
     })
    },
    
    //获取单个用户的信息
    *singlefetch({ payload }, { call, put }){
      yield put({
        type:'changeModal',
        payload:true
      })
      let result = yield call(queryUserRoleInfo,payload);
      yield put({
        type: 'getSingleData',
        payload: result
      })
    },
    //新增用户信息
    *addUserInfo({ payload, callback}, { call, put }){
      let result = yield call(addUserList,payload)
      yield put({
        type:'changeModal',
        payload: false,
      })
      if(callback) callback(result);
    },
    //修改用户信息
    *updateUserInfo({ payload, callback }, { call, put }){
      yield put({
        type:'changeLoading',
        payload: true
      })
      let result = yield call(updateUserList, payload);
      yield put({
        type:'changeLoading',
        payload: false
      })
      yield put({
        type:'changeModal',
        payload: false,
      })
      if(callback) callback(result);
    },
    
    *addRolefetch({ payload,callback}, { call, put }){
    	yield put({
            type:'changeLoading',
            payload: true
          })
    	let result = yield call(addRole, payload);
    	yield put({
            type:'changeModal',
            payload: false,
          })
    	yield put({
            type:'changeLoading',
            payload: false
          })
    	callback&&callback(result);
    },
    *editRolefetch({ payload,callback}, { call, put }){
    	yield put({
            type:'changeLoading',
            payload: true
          })
    	let result = yield call(editRole, payload);
    	yield put({
            type:'changeModal',
            payload: false,
          })
    	yield put({
            type:'changeLoading',
            payload: false
          })
    	callback&&callback(result);
    }
  },
  reducers: {
     changeModal(state, action) {
        return {
          ...state,
          modal:action.payload
        }
     },
    getDataList(state, action){
       return {
         ...state,
         data:{
           list: action.payload.resultData,
           pagination: action.payload.page
         }
       }
    },
    getMenuDataList(state, action){
      return {
        ...state,
        menulist:action.payload.resultData,
      }
    },
    getNavDataList(state, action){
      return {
        ...state,
        navlist: action.payload.resultData,
      }
    },
    changeLoading(state , action){
      return {
        ...state,
        loading:action.payload
      }
    },
    getSingleData(state, action) {
      return {
        ...state,
        singleData:action.payload.resultData
      }
    }
  }
};
