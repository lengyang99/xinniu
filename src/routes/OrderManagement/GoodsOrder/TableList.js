import React from 'react';
import { Table, Button} from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const TableList = (props) => {
    const { dataSource, tableConfig, handleAction, batchAudit} = props;
    const rendAction = (record) =>{
      let btnTexts = [];
      const status = record.status;
      if([200].includes(status)){
        btnTexts = ['查看详情','自动审核']; 
      }else if([210].includes(status)){
        btnTexts = ['查看详情','回调审核结果'];
      }else if([240].includes(status)){
        btnTexts = ['查看详情','人工审核'];
      }else if([400,410,420,430,440].includes(status)){
        btnTexts = ['查看详情','下载合同'];
      }else {
        btnTexts = ['查看详情'];
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
      dataIndex: 'userName',
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '第三方订单号',
      dataIndex: 'thirdOrderNo',
    },
    {
      title: '身份证',
      dataIndex: 'idCard',
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
      title: '状态',
      dataIndex: 'statusStr',
    },
    {
      title: '是否复贷',
      dataIndex: 'isReloan',
      render: (text) => (<span>{text ===1? '是' : text ===0? '否' : ''}</span>)
    },
    {
      title: '操作',
      dataIndex: 'actions',
      render: (_, record) => (rendAction(record))
    },
    ];
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><label>货款订单信息</label><Button type="primary" onClick={batchAudit}>批量审核</Button></div>
        <Table
        {...tableConfig}
        className={styles.table}
        columns={columns}
        bordered
        dataSource={dataSource}
        scroll={{x:1600}}
      />
      </div>
    );
}
TableList.defaultProps = {
  tableConfig: {},
  dataSource: [],
  handleAction: (f) => f,
  batchAudit: (f) => f,
};
TableList.propTypes = {
  tableConfig: PropTypes.object,
  dataSource: PropTypes.array,
  handleAction: PropTypes.func,
  batchAudit: PropTypes.func,
};
export default TableList;