/**
 * Created by Administrator on 2017/12/18 0018.
 */

import React from 'react';
import { Table } from 'antd';

const limitListDetail = (props) => {
  const columns = [{
    title: '时间',
    dataIndex: 'createTime',
  }, {
    title: '类型',
    dataIndex: 'bizTypeStr',
  }, {
    title: '进出',
    dataIndex: 'amount',
    render: (value, record) => {
      switch (record.bizType) {
        case 1: return `-${value}`;
        default: return `+${value}`;
      }
    },
  }, {
    title: '授信额度',
    dataIndex: 'total',
  }, {
    title: '已用额度',
    dataIndex: 'used',
  }, {
    title: '备注',
    dataIndex: 'remark',
  }];
  const { data } = props;
  return (<Table
    columns={columns}
    dataSource={data}
  />);
};

export default limitListDetail;
