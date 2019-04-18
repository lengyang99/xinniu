/**
 * Created by Administrator on 2017/12/16 0016.
 */
/**
 * 放款订单的状态管理
 */

import { queryTimed, queryRoleAllList, queryUserList, addUserList, queryUserRoleInfo, updateUserList, queryAllNav,execute,suspend,runJobNow,updateTask } from '../services/systemmanage';
import { routerRedux } from 'dva/router';
import {queryChannelList} from '../services/channelmanage.js';
export default {
  namespace: 'systemuser',
  state: {
    loading:false,
    menulist:[],
    channellist:[],
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

    //获取所有渠道
    *channelfetch( { },{ call , put}){
           let result = yield call(queryChannelList);
           yield put({
             type:'getChannelDataList',
             payload: result
           })
        },
    //获取所有的系统菜单目录
    *systemnav({ },{ call, put }){
      let result = yield call(queryAllNav);
      yield put({
        type:'getNavDataList',
        payload: result
      })
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
    //获取所有的定时任务
    *timefetch({ payload }, { call, put }){
      yield put({
        type:'changeLoading',
        payload:true,
      })
      let response = yield call(queryTimed,payload);
      if(response.resultCode === 800){
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false
      }
      yield put({
        type:'getTimeList',
        payload: response
      })
     yield put({
       type:'changeLoading',
       payload:false
     })
    },
    
    //获取
    *executeNowFetch({ payload,callback }, { call, put }){
       yield put({
          type:'changeLoading',
          payload:true,
       });
       let response = yield call(runJobNow,payload);
       yield put({
         type:'changeLoading',
         payload:false
       });
       callback && callback(response);
      },
      
  *executeFetch({ payload,callback }, { call, put }){
      yield put({
         type:'changeLoading',
         payload:true,
      });
      let response = yield call(execute,payload);
      yield put({
        type:'changeLoading',
        payload:false
      });
      callback && callback(response);
     },
     
   *suspendFetch({ payload,callback }, { call, put }){
         yield put({
            type:'changeLoading',
            payload:true,
         });
         let response = yield call(suspend,payload);
         yield put({
           type:'changeLoading',
           payload:false
         });
         callback && callback(response);
        },
    
    *updateTaskFetch({ payload,callback }, { call, put }){
        yield put({
            type:'changeLoading',
            payload:true,
         });
         let response = yield call(updateTask,payload);
         yield put({
           type:'changeLoading',
           payload:false
         });
         callback && callback(response);	
        },
    
    //获取单个用户的信息
    *singlefetch({ payload,callback }, { call, put }){
	  yield put({
	      type:'changeModal',
	      payload:true
	    })
      let result = yield call(queryUserRoleInfo,payload);
	  callback && callback(result.resultData.roleNidStr === "第三方合作方");
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
    getTimeList(state, action){
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
      getChannelDataList(state, action){
          return {
            ...state,
            channellist:action.payload.resultData,
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
        singleData:action.payload.resultData,
        showChannel:action.payload.resultData.roleNidStr === "第三方合作方"
      }
    }
  }
  };
