/**
 * Created by Administrator on 2017/12/16 0016.
 */
import { querySystemDictParentList, updateSystemDictParent, addSystemDictParent, delectSystemDictParent, refreshCacheSystemDict,
  querySystemDictChildList, updateSystemDictChild, addSystemDictChild, delectSystemDictChild } from '../services/systemmanage';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'systemdict',
  state: {
    loading: false,
    menulist: [],
    navlist: [],
    data: {
      list: [],
      pagination: {},
    },
    modal: false,
    singleData: {},
  },
  effects: {
    // 获取数据库父级菜单列表
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querySystemDictParentList, payload);
      if (response.resultCode === 800) {
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false;
      }
      yield put({
        type: 'getDataList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取单个父级的子菜单列表
    *childfetch({ payload, callback }, { call, put }) {
      const result = yield call(querySystemDictChildList, payload);
      if (callback) callback(result);
    },
    // 修改单个父级参数
    *updateparent({ payload, callback }, { call, put }) {
      const result = yield call(updateSystemDictParent, payload);
      if (callback) callback(result);
    },
    // 删除单个父级
    *deleteparent({ payload, callback }, { call, put }) {
      const result = yield call(delectSystemDictParent, payload);
      if (callback) callback(result);
    },
    // 修改单个父级的子菜单列表
    *updatechild({ payload, callback }, { call, put }) {
      const result = yield call(updateSystemDictChild, payload);
      if (callback) callback(result);
    },
    // 删除单个父级的子菜单列表
    *deletechild({ payload, callback }, { call, put }) {
      const result = yield call(delectSystemDictChild, payload);
      if (callback) callback(result);
    },
    // 新增单个父级
    *addparent({ payload, callback }, { call, put }) {
      const result = yield call(addSystemDictParent, payload);
      if (callback) callback(result);
    },
    // 新增单个父级的子菜单
    *addchild({ payload, callback }, { call, put }) {
      const result = yield call(addSystemDictChild, payload);
      if (callback) callback(result);
    },
    *refreshcookie({callback},{ call }){
      const result = yield call(refreshCacheSystemDict);
      if (result.resultCode === 800) {
        yield put(routerRedux.push('/user/login'));
        window.location.reload();
        return false;
      }
      if (callback) callback(result);
    }
  },
  reducers: {
    changeModal(state, action) {
      return {
        ...state,
        modal: action.payload,
      };
    },
    getDataList(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.resultData,
          pagination: action.payload.page,
        },
      };
    },
    getMenuDataList(state, action) {
      return {
        ...state,
        menulist: action.payload.resultData,
      };
    },
    getNavDataList(state, action) {
      return {
        ...state,
        navlist: action.payload.resultData,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getSingleData(state, action) {
      return {
        ...state,
        singleData: action.payload.resultData,
      };
    },
  },
};
