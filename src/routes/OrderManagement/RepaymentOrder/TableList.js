import React from 'react';
import { Table, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const TableList = (props) => {
    const { dataSource, tableConfig, handleAction, handleBatch} = props;
    const rendAction = (record) =>{
      let btnTexts = [];
      if([40,50,60].includes(record.status)){
        btnTexts.push('息费减免');
      }
      if([20,30,40,50,60].includes(record.status)){
        btnTexts.push('手动代扣');
        btnTexts.push('线下还款');
      }
      if(['30','40'].includes(record.offlineAuditStatus)){
          btnTexts=['取消线下入账'];
      }
      return btnTexts.map(item => (<a key={item} onClick={() => { handleAction({ ...record,action:item}); }}>{item}&nbsp;&nbsp;&nbsp;</a>));
    }
    const columns = [
    {
      title: '产品系列',
      dataIndex: 'prodLineName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '用户姓名',
      dataIndex: 'realName',
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '身份证',
      dataIndex: 'idNo',
    },
    {
      title: '订单金额(元)',
      dataIndex: 'principal',
    },
    {
      title: '期数',
      dataIndex: 'scheduleNo',
    },
    {
      title: '放款时间',
      dataIndex: 'loanTime',
    },
    {
      title: '到期时间',
      dataIndex: 'dueTime',
    },
    {
      title: '还款状态',
      dataIndex: 'statusStr',
    },
    {
      title: '审核状态',
      dataIndex: 'offlineAuditStatusStr',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '还款记录',
      dataIndex: 'repayDetail',
      render: (_, record) =>{
        const flag = [30,70].includes(record.status) || record.offlineAuditStatus === '50'; ;
        return flag ? <a onClick={() => { handleAction({ ...record, action: '查看详情' })}}>
          <span>查看详情</span>
        </a> : <span style={{color:'rgb(153,153,153)'}}>查看详情</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (rendAction(record))
    }
    ];
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <label>还款订单信息</label>
        <div>
        <Button style={{marginRight: 10}} type="primary" onClick={()=>handleBatch(1)}>批量线下还款</Button>
        <Button type="primary" onClick={()=>{handleBatch(2)}}>批量息费减免</Button>
        </div>
        </div>
        <Table
        {...tableConfig}
        className={styles.table}
        columns={columns}
        bordered
        dataSource={dataSource}
        scroll={{x:1800}}
      />
      </div>
    );
}
TableList.defaultProps = {
  tableConfig: {},
  dataSource: [],
  handleBatch: (f) => f,
  handleAction: (f) => f,
};
TableList.propTypes = {
  tableConfig: PropTypes.object,
  dataSource: PropTypes.array,
  handleBatch: PropTypes.func,
  handleAction: PropTypes.func,
};
export default TableList;