import React from 'react';
import { Table, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const data = [{status:20},{status:30},{status:40},{status:50},{status:0}]
const TableList = (props) => {
    const { dataSource, tableConfig, handleAction, bulkLoan} = props;
    const rendAction = (record) =>{
      let btnTexts = [];
      switch(record.status){
        case 290 : btnTexts = ['手动放款','关闭']; break;
        case 320 : btnTexts = ['再次放款','确认失败']; break;
        default : btnTexts = []; break;
      }
      return btnTexts.map(item => (<a key={item} onClick={() => { handleAction({ ...record,action:item}); }}>{item}&nbsp;&nbsp;&nbsp;</a>));
    }
    const columns = [{
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
      title: '下单时间',
      dataIndex: 'createTime',
    },
    {
      title: '放款时间',
      dataIndex: 'loanTime',
    },
    {
      title: '贷款本金',
      dataIndex: 'principal',
    },
    {
      title: '贷款期限(天/期)',
      dataIndex: 'peroidValue',
    },
    {
      title: '放款状态',
      dataIndex: 'statusStr',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '放款详情',
      dataIndex: 'loanDetail',
      render: (_, record) => {
        const flag = record.status >= 300 ;
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
        <div style={{display: 'flex', justifyContent: 'space-between'}}><label>放款订单信息</label><Button type="primary" onClick={bulkLoan}>批量放款</Button></div>
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
  bulkLoan: (f) => f,
};
TableList.propTypes = {
  tableConfig: PropTypes.object,
  dataSource: PropTypes.array,
  handleAction: PropTypes.func,
  bulkLoan:PropTypes.func,
};
export default TableList;
