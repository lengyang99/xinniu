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
    title:'贷款到期时间',
    dataIndex:'dueTime'
  },{
    title:'贷款金额',
    dataIndex:'principal'
  },{
    title:'利息',
    dataIndex:'interest'
  },{
    title:'商品费',
	dataIndex:'goodsPrice'
  },{
    title:'逾期利息',
    dataIndex:'penalty'
  },
  // {
  //   title:'折旧费',
  //   dataIndex:'remainPrincipal'
  // },
  {
    title:'总金额',
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
