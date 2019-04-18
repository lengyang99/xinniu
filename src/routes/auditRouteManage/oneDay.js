import React, {PureComponent} from 'react';
import {Tooltip, Icon, Row, Col, Table, Card, Switch, Form, Modal, DatePicker, Select, Input, InputNumber, Button, message } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../OrderManage/LeaseList.less';

import {
  overdueOneDayOrderInfo,
  overdueOneDayOrderInfoExport,
} from '../../services/urgeManage';

import {
	taskInfo,
	analysisTaskInfo,
	taskExport
} from '../../services/commonManage';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const one_call_type = 2;
const one_contact_type = 1;

@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskInfo:[],
      contactTaskInfo:[],
      overdueOneDayOrderInfoTableLoading: false,
      overdueOneDayOrderInfoList:[],
      selectUserIds: [],
      checked: true,
      pg:{
        currentPage:1,
        pageSize:10
      }
    }
  }

  loadOverdueOneDayOrderInfo(pg){
    pg = pg||{};
    this.setState({
      overdueOneDayOrderInfoTableLoading:true
    });
    overdueOneDayOrderInfo({currentPage:pg.current||1,pageSize:pg.pageSize||10}).then(res => {
      if(res.resultCode === 1000){
        this.setState({
          overdueOneDayOrderInfoTableLoading:false,
          overdueOneDayOrderInfoList:res.resultData,
          pg:res.page
        });
      }
    });
  }

  exportData(type,id){
    if(type === 2){
      overdueOneDayOrderInfoExport();
    }

  }

  /**生命周期**/
  componentDidMount() {
    this.loadOverdueOneDayOrderInfo();
  }

  onSelectChange(sks, srs){
    let users = [];
    srs.map(e => {
      users.push(e.userId);
    });
    this.state.selectUserIds = users;
  }



  render() {
    const overdueOneDayOrderInfoColumn = [{
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    }, {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '证件号码',
      dataIndex: 'idNo',
      key: 'idNo',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '身份证地址',
      dataIndex: 'idAddr',
      key: 'idAddr',
    }, {
      title: '放款日期',
      dataIndex: 'loanTime',
      key: 'loanTime'
    }, {
      title: '到期日期',
      dataIndex: 'rentEndTime',
      key: 'rentEndTime',
    }, {
      title: '入催日期',
      dataIndex: 'currentTime',
      key: 'currentTime',
    },{
      title: '产品期限',
      dataIndex: 'peroidDay',
      key: 'peroidDay',
    },{
      title: '贷款金额',
      dataIndex: 'principal',
      key: 'principal'
    },{
      title: '贷款余额',
      dataIndex: 'loanBalance',
      key: 'loanBalance'
    },{
      title: '实际到账金额',
      dataIndex: 'loanAmount',
      key: 'loanAmount'
    },{
      title: '商品费用',
      dataIndex: 'goodsPrice',
      key: 'goodsPrice'
    },{
      title: '逾期本金',
      dataIndex: 'overduePrincipal',
      key: 'overduePrincipal'
    },{
      title: '逾期利息',
      dataIndex: 'overdueInterest',
      key: 'overdueInterest'
    },{
        title: '逾期一次性费用',
        dataIndex: 'duePenaltyManage',
        key: 'duePenaltyManage'
      },{
      title: '贷款利息',
      dataIndex: 'loanInterest',
      key: 'loanInterest'
    },{
      title: '逾期总额',
      dataIndex: 'dueAmount',
      key: 'dueAmount'
    },{
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays'
    },
      {
        title: '审核渠道',
        dataIndex: 'checkChannel',
        key: 'checkChannel'
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex'
      },{
        title: '银行卡号',
        dataIndex: 'cardNo',
        key: 'cardNo'
      },{
        title: '所属银行',
        dataIndex: 'bank',
        key: 'bank'
      },{
        title: '居住地址',
        dataIndex: 'liveAddr',
        key: 'liveAddr'
      },{
        title: '注册地址',
        dataIndex: 'registerAddr',
        key: 'registerAddr'
      },{
        title: '借款次数',
        dataIndex: 'orderCount',
        key: 'orderCount'
      },{
          title: '注册客户端',
          dataIndex: 'registerClient',
          key: 'registerClient'
      },{
        title: '学历',
        dataIndex: 'education',
        key: 'education'
      },{
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone'
      },{
        title: '紧急联系人姓名',
        dataIndex: 'contactsName1',
        key: 'contactsName1'
      },{
        title: '紧急联系人电话',
        dataIndex: 'contactsPhone1',
        key: 'contactsPhone1'
      },{
        title: '紧急联系人关系',
        dataIndex: 'contactsRelation1',
        key: 'contactsRelation1'
      },{
        title: '亲属联系人姓名',
        dataIndex: 'contactsName2',
        key: 'contactsName2'
      },
      {
        title: '亲属联系人电话',
        dataIndex: 'contactsPhone2',
        key: 'contactsPhone2'
      },{
        title: '亲属联系人关系',
        dataIndex: 'contactsRelation2',
        key: 'contactsRelation2'
      }
    ];

    const rowSelection = {
      fixed:true,
      onChange: (selectedRowKeys, selectedRows) => {
        let userId = [];
        selectedRows.map(e => {
          userId.push(e.userId);
        });
        this.setState({
          selectUserIds:userId
        });
      },
      getCheckboxProps: record => ({
        name: record.name
      })
    };

    return (
      <PageHeaderLayout title="逾期一天表">
        <Card>
          <div className={styles.tableList} style={{overflow:"auto"}}>
            <h4>逾期一天
              <Button style={{marginLeft:100}} onClick={()=>{this.exportData(2)}} >导出为EXCEL</Button>
            </h4>
            <Table style={{width:4000}}
                   dataSource={this.state.overdueOneDayOrderInfoList}
                   columns={overdueOneDayOrderInfoColumn}
                   pagination={this.state.pg}
                   bordered rowKey={record => record.orderNo}
                   loading={this.state.overdueOneDayOrderInfoTableLoading}
                   rowSelection={rowSelection}
                   onChange={this.loadOverdueOneDayOrderInfo.bind(this)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
