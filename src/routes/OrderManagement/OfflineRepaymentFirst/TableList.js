import React from 'react';
import { Table} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const TableList = (props) => {
    const { dataSource, tableConfig, handleAction} = props;
    const rendAction = (record) =>{
      let btnTexts = [];
      if ([30].includes(record.status)) {
        btnTexts = ['审核'];
      }else {
        btnTexts = ['查看'];
      }
      return btnTexts.map(item => (<a key={record.id} onClick={() => { handleAction({ ...record,action:item}); }}>{item}&nbsp;&nbsp;&nbsp;</a>));
    }
    const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '产品系列名称',
      dataIndex: 'prodLineName',
    },
    {
      title: '期数',
      dataIndex: 'peroidValue',
    },
    {
      title: '还款期数',
      dataIndex: 'scheduleNoStr',
    },
    {
      title: '入账类型',
      dataIndex: 'typeStr',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '提交人员',
      dataIndex: 'operator',
    },
    {
      title: '审核状态',
      dataIndex: 'statusStr',
    },
    {
      title: '提交审核时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (rendAction(record))
    }
    ];
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><label>线下还款初审信息</label></div>
        <Table
        {...tableConfig}
        className={styles.table}
        columns={columns}
        bordered
        dataSource={dataSource}
      />
      </div>
    );
}
TableList.defaultProps = {
  tableConfig: {},
  dataSource: [],
  handleAction: (f) => f,
};
TableList.propTypes = {
  tableConfig: PropTypes.object,
  dataSource: PropTypes.array,
  handleAction: PropTypes.func,
};
export default TableList;