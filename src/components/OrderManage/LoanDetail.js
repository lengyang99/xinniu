/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Table } from 'antd';

const TableDetail = (props) =>{
  var {data,pagination } = props;
  const loading = data?false:true;
  let cloumns = [{
    title:'交易流水号',
    dataIndex:'tradeNum'
  },{
    title:'交易渠道',
    dataIndex:'tradeChannelStr'
  },{
    title:'发送时间',
    dataIndex:'createTime'
  },{
    title:'接收时间',
    dataIndex:'updateTime'
  },{
    title:'放款金额',
    dataIndex:'tradeAmount'
  },{
    title:'交易状态',
    dataIndex:'tradeStatusStr'
  },{
    title:'交易详情',
    dataIndex:'tradeResult'
  }];
  return <Table columns={ cloumns }
                loading = {loading}
                bordered
                rowKey={record=>record.id}
                pagination={ pagination }
                dataSource={ data }/>
};

export default TableDetail;
