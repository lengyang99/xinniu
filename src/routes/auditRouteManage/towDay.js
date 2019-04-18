import React, {PureComponent} from 'react';
import {Tooltip, Icon, Row, Col, Table, Card, Switch, Form, Modal, DatePicker, Select, Input, InputNumber, Button, message } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../OrderManage/LeaseList.less';

import {
	overdueTwoDayOrderInfo,
	overdueTwoDayOrderInfoExport,

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
const two_call_type = 4;
const two_contact_type = 3;

@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectUserIds: [],
      checked: true,
      taskInfo:[],
      contactTaskInfo:[],
      overdueTwoDayOrderInfoTableLoading: false,
      overdueTwoDayOrderInfoList:[],
      overdueTwoDayOrderInfoPg:{
    	  currentPage:1,
    	  pageSize:10
      }
    }
  }


  loadOverdueTwoDayOrderInfo(pg){
	  pg = pg||{};
	  this.setState({
		  overdueTwoDayOrderInfoTableLoading:true
	  });
	  overdueTwoDayOrderInfo({
		  currentPage:pg.current||1
	  }).then(res => {
		  if(res.resultCode === 1000){
			  this.setState({
				  overdueTwoDayOrderInfoTableLoading:false,
				  overdueTwoDayOrderInfoList:res.resultData,
				  overdueTwoDayOrderInfoPg:res.page
			  });
		  }
	  });
  }

  exportData(type,id){
	  if(type === 1){
		  todayRepayInfoExport();
	  }
	  if(type === 2){
		  overdueOneDayOrderInfoExport();
	  }
	  if(type === 3){
		  overdueTwoDayOrderInfoExport();
	  }

  }

  /**生命周期**/
  componentDidMount() {
	  this.loadOverdueTwoDayOrderInfo();
  }


  onSelectChange(sks, srs){
    let users = [];
    srs.map(e => {
      users.push(e.userId);
    });
    this.state.selectUserIds = users;
  }


  render() {
    const rowSelection = {
      onChange: this.onSelectChange.bind(this),
    };
    const overdueTwoDayOrderInfoColumn = [{
        title: '真实姓名',
        dataIndex: 'name',
        key: 'name',
      },{
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
      },{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo'
      },{
	  	  title: '期限',
	  	  dataIndex: 'peroidDay',
	  	  key: 'peroidDay',
      },{
          title: '逾期本金',
          dataIndex: 'overduePrincipal',
          key: 'overduePrincipal'
      },{
          title: '商品费',
          dataIndex: 'goodsPrice',
          key: 'goodsPrice'
      },{
          title: '逾期利息',
          dataIndex: 'overdueInterest',
          key: 'overdueInterest'
      },{
          title: '逾期一次性费用',
          dataIndex: 'overdueDisposableFee',
          key: 'overdueDisposableFee'
      },{
          title: '贷款利息',
          dataIndex: 'loanInterest',
          key: 'loanInterest'
      },{
          title: '逾期总额',
          dataIndex: 'dueAmount',
          key: 'dueAmount'
      }, {
        title: '借款日期',
        dataIndex: 'createTime',
        render:(v) => {
        	return moment(v).format('YYYY-MM-DD');
        }
      },{
	  	  title: '预计还款时间',
	  	  dataIndex: 'rentEndTime',
		  render:(v) => {
	        return moment(v).format('YYYY-MM-DD');
	      }
      },
      {
          title: '审核渠道',
          dataIndex: 'checkChannel',
          key: 'checkChannel'
      },
      {
          title: '逾期天数',
          dataIndex: 'overdueDays',
          key: 'overdueDays'
      },{
	  	  title: '更新日期',
	  	  dataIndex: 'updateTime',
	  	  render:(v) => {
	        return moment(v).format('YYYY-MM-DD');
	      }
      }
      ];

    return (
     <PageHeaderLayout title="逾期两天及以上">
        <Card>
	      <div className={styles.tableList}>
	     	<h4>逾期两天及以上
          <Button style={{marginLeft:100}} onClick={()=>{this.exportData(3)}}>导出为EXCEL</Button>
	     	</h4>
        <Table
            dataSource={this.state.overdueTwoDayOrderInfoList}
            columns={overdueTwoDayOrderInfoColumn}
            pagination={this.state.overdueTwoDayOrderInfoPg}
            bordered rowKey={record => record.orderNo}
            loading={this.state.overdueTwoDayOrderInfoTableLoading}
        	  onChange={this.loadOverdueTwoDayOrderInfo.bind(this)}
            rowSelection={rowSelection}
        />
	      </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
