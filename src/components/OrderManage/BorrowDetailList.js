/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Table } from 'antd';

const BorrowDetailList = (props) =>{
  let {data,pagination } = props;
  const loading =data?false:true;
  let cloumns = [{
    title:'期数',
    dataIndex:'sheduleNo'
  },{
    title:'还款日期',
    dataIndex:'dueTime'
  },{
    title:'月还本金',
    dataIndex:'principal'
  },{
    title:'月还利息',
    dataIndex:'interest'
  },{
    title:'月还本息',
    dataIndex:'principalInterest'
  },{
    title:'月还服务费',
    dataIndex:'serviceFee'
  },{
    title:'月还总额',
    dataIndex:'amount'
  },{
    title:'剩余未还本金',
    dataIndex:'remainPrincipal'
  },{
    title:'一次性结清金额',
    dataIndex:'totalAmount'
  }];
  return <Table columns={ cloumns }
                loading = {loading}
                rowKey={ record => record.sheduleNo}
                bordered
                pagination={ pagination }
                dataSource={ data }/>
};

export default BorrowDetailList;
