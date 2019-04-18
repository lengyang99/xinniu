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
    dataIndex:'serialNo'
  },{
    title:'交易渠道',
    dataIndex:'tradeChannel'
  },{
    title:'发送时间',
    dataIndex:'tradeStartTime'
  },{
    title:'接收时间',
    dataIndex:'updateTime'
  },{
    title:'还款金额',
    dataIndex:'tradeAmount'
  },{
    title:'交易状态',
    dataIndex:'tradeStatusStr'
  },{
    title:'交易详情',
    dataIndex:'result'
  }];
  return <Table columns={ cloumns }
                loading = {loading}
                bordered
                rowKey={record=>record.serialNo}
                pagination={ pagination }
                dataSource={ data }/>
};

export default TableDetail;
