/**
 * model  借款订单状态管理
 */
import { queryStatusNav, queryBorrowOrder, queryBorrowOrderDetail, youMiQueryBorrowOrderDetail, youMiLeaseholdBorrowOrderDetail, orderAuthPass, orderAuthUnPass, queryBorrowOrderRepaymentplan, limitAmountInfo} from '../services/ordermanage';
import { routerRedux } from 'dva/router';
import {message} from 'antd';

export default {
    namespace:'borroworder',
    state:{
      statusnav:[],
      data:{
        list:[],
        pagination:{}
      },
      loading:false,
      modal:false,
      modalrecord:{},
	  modaldetail:{},
      modallist:[],
      limitData:{}
    },
    effects:{
      *navfetch({ payload },{call, put}){
        let navlist = yield call(queryStatusNav);
        yield  put({
          type:'setStatusNav',
          payload: navlist
        })
      },
      *fetch({payload},{call, put}){
          yield put({
            type: 'changeLoading',
            payload: true,
          });
          const result = yield call(queryBorrowOrder,payload);
          const limitResult = yield call(limitAmountInfo);          
          if(result.resultCode === 800){
            yield put(routerRedux.push('/user/login'));
            window.location.reload();
            return false
          }
          yield put({
             type: 'setListdata',
              payload: result
          });
          yield put({
        	  type: 'setLimitdata',
              payload: limitResult.resultData
          });
          yield  put({
            type:'changeLoading',
            payload: false
          })
      },
      *modalrecordfetch({payload},{call,put}){
          yield put({
            type:'changeModal',
            payload:true,
          })
         const resultmodalrecord = yield  call(queryBorrowOrderDetail,payload);
          yield  put({
             type: 'setModalRecord',
             payload: resultmodalrecord.resultData
          })
      },
      *youmimodalrecordfetch({payload},{call,put}){
          yield put({
            type:'changeModal',
            payload:true,
          })
        //  const resultmodalrecord = yield  call(youMiQueryBorrowOrderDetail,payload);
        //  console.log('查看详情',JSON.stringify(resultmodalrecord.resultData));
        //   yield  put({
        //      type: 'setModalRecord',
        //      payload: resultmodalrecord.resultData
        //   })
      },
      // *youmileasemodalrecordfetch({payload},{call,put}){
      //    const resultmodalrecord = yield  call(youMiLeaseholdBorrowOrderDetail,payload);
      //     yield  put({
      //        type: 'setModaldetail',
      //        payload: resultmodalrecord.resultData
      //     })
      // },
      *modallistfetch({payload},{call,put}){
         const resultmodallist = yield  call(queryBorrowOrderRepaymentplan,payload);
        //  console.log('还款计划',JSON.stringify(resultmodallist));
         yield  put({
           type: 'setModalList',
           payload: resultmodallist
         })
      },
	  *authPass({payload},{call,put}){
		  const data=yield call(orderAuthPass,payload.orderId);
		  if(data.resultCode==1000){
			  message.success('操作成功！');
			  payload.tz.handleSearch();
		  }else{
			  message.error('操作失败！');
		  }
	  },
	  *authUnPass({payload},{call,put}){
		  const data=yield call(orderAuthUnPass,payload.orderId);
		  if(data.resultCode==1000){
			  message.success('操作成功！');
			  payload.tz.handleSearch();
		  }else{
			  message.error('操作失败！');
		  }
	  }
     },
     reducers:{
       setStatusNav(state,action){
         return {
           ...state,
           statusnav:action.payload.resultData
         }
       },
        changeLoading(state, action){
           return {
             ...state,
             loading:action.payload
           }
        },
       setListdata(state, action){
          return {
            ...state,
            data:{
              list:action.payload.resultData,
              pagination:action.payload.page
            }
          }
       },
       setLimitdata(state, action){
           return {
             ...state,
             limitData:action.payload
           }
        },
       changeModal(state,action) {
          return {
            ...state,
            modal:action.payload
          }
       },
       setModalRecord(state, action){
         return {
           ...state,
           modalrecord:action.payload
         }
       },
	   setModaldetail(state, action){
         return {
           ...state,
           modaldetail:action.payload
         }
       },
       setModalList(state, action){
         return {
           ...state,
           modallist:action.payload.resultData
         }
       },
     }
}
