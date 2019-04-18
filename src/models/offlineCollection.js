/**
 * 线下收款申请列表
 */

import { queryDataList, updateOfflineAuditStatus, getOfflineAuditStatus } from '../services/offlineCollection';
import {message} from 'antd';

export default {
    namespace: 'offlineCollection',
    state: {
        loading: false,
        // 搜索条件
        searchParams: {
            phone: null,
            name: null,
            status: null,
            startTime: null,
            endTime: null,
        },
        //分页信息
        pg:{
            currentPage: 1,
            pageSize: 10,
            total: null,
        },
        statusData: {}, //审核状态
        // 数据列表
        dataList: [],
    },
    effects: {
        // 查询线下收款列表
        *queryDataList({param}, { call, put, select }) {
            let {searchParams, pg:{currentPage,pageSize}} = yield select(state => state.offlineCollection);
            currentPage = param === 1 ? 1 : currentPage;
            // 空字符串转null
            Object.keys(searchParams).forEach(item =>{
                if(searchParams[item] === ''){
                    searchParams[item] = null;
                }
            });
            const payload = {currentPage,pageSize,searchParams: JSON.stringify(searchParams)};
            yield put({type: 'loadingChange',payload:true});
            const res = yield call(queryDataList, payload);
            if (res.resultCode === 1000) {
                yield put({ type: 'saveDataList', payload: res.resultData || [] });
                const {page: {total,current,pageSize}} = res || {};
                const pg = {total,currentPage:current,pageSize};
                yield put({ type: 'pgSave', payload: pg});
            } else {
                message.warn(res.resultMsg);
            }
            yield put({type: 'loadingChange',payload:false});
        },
        *getOfflineAuditStatus(_,{call,put}) {
            const res = yield call(getOfflineAuditStatus);
            if (res.resultCode === 1000) {
                yield put({ type: 'saveStatusData', payload: res.resultData || {} });
            } else {
                message.warn(res.resultMsg);
            }
        },
        *updateOfflineAuditStatus({payload,callback},{call}) {
            const res = yield call(updateOfflineAuditStatus,payload);
            if(res.resultCode === 1000){
                callback && callback();
            }else{
                message.warn(res.resultMsg);
            }
        }
    },
    reducers: {
        saveDataList(state, action) {
            return {
                ...state,
                dataList: action.payload
            }
        },
        searchParamsSave(state, action) {
            return {
                ...state,
                searchParams: action.payload
            }
        },
        saveStatusData(state, action) {
            return {
                ...state,
                statusData: action.payload
            }
        },
        loadingChange(state, action) {
            return {
                ...state,
                loading: action.payload
            }
        },
        pgSave(state, action) {
            return {
                ...state,
                pg: action.payload
            }
        },
    },
};
