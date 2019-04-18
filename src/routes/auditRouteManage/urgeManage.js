import React, {PureComponent} from 'react';
import {Tooltip, Icon, Row, Col, Table, Card, Switch, Form, Modal, DatePicker, Select, Input, InputNumber, Button, message } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../OrderManage/LeaseList.less';

import {
	todayRepayInfo,
	todayRepayInfoExport,
	overdueOneDayOrderInfo,
	overdueOneDayOrderInfoExport,
	overdueTwoDayOrderInfo,
	overdueTwoDayOrderInfoExport,
	useContactExport
} from '../../services/urgeManage';


const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;

@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      todayRepayInfoTableLoading: false,
      overdueOneDayOrderInfoTableLoading: false,
      overdueTwoDayOrderInfoTableLoading: false,
      todayRepayInfoList: [],
      overdueOneDayOrderInfoList:[],
      overdueTwoDayOrderInfoList:[],
      selectUserIds:[],
      overdueTwoDayOrderInfoPg:{
    	  currentPage:1,
    	  pageSize:10
      },
      searchParams:JSON.stringify({startTime:moment().format("YYYY-MM-DD 00:00:00"),endTime:moment().format("YYYY-MM-DD 00:00:00")})
    }
  }

  loadTodayRepayInfo(){
	  this.setState({
		  todayRepayInfoTableLoading:true
	  });
	  todayRepayInfo().then(res => {
		  if(res.resultCode === 1000){
			  this.setState({
				  todayRepayInfoTableLoading:false,
				  todayRepayInfoList:res.resultData
			  });
		  }
	  });
  }
  
  loadOverdueOneDayOrderInfo(){
	  this.setState({
		  overdueOneDayOrderInfoTableLoading:true
	  });
	  overdueOneDayOrderInfo().then(res => {
		  if(res.resultCode === 1000){
			  this.setState({
				  overdueOneDayOrderInfoTableLoading:false,
				  overdueOneDayOrderInfoList:res.resultData
			  });
		  }
	  });
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
	  if(type === 'contact'){
		  if(id){
			  useContactExport({uids:id});
		  }else{
			  if(this.state.selectUserIds.length==0){
				  message.info("请选中欲下载通许录的记录");
				  return;
			  }
			  useContactExport({uids:this.state.selectUserIds.join(",")});
		  }
	  }
  }
  
  /**生命周期**/
  componentDidMount() {
	  this.loadTodayRepayInfo();
	  this.loadOverdueOneDayOrderInfo();
	  this.loadOverdueTwoDayOrderInfo();
  }
  
  render() {
    const todayRepayInfoColumn = [{
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    }, {
      title: '客户名称',
      dataIndex: 'realName',
      key: 'realName',
    }, {
      title: '证件号码',
      dataIndex: 'idNo',
      key: 'idNo',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '放款日期',
      dataIndex: 'loanTime',
      key: 'loanTime'
    }, {
	  title: '到期日期',
	  dataIndex: 'rentEndTime',
	  key: 'rentEndTime',
    },{
	  title: '产品期限',
	  dataIndex: 'peroidValue',
	  key: 'peroidValue',
    },{
        title: '租赁金额',
        dataIndex: 'principal',
        key: 'principal'
    },{
        title: '实际到账金额',
        dataIndex: 'loanAmount',
        key: 'loanAmount'
    },{
        title: '信息认证费',
        dataIndex: 'auditFee',
        key: 'auditFee'
    },
   /* {
        title: '渠道名称',
        dataIndex: 'channelName',
        key: 'channelName'
    },*/
    {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex'
    },{
        title: '借款次数',
        dataIndex: 'time',
        key: 'time'
    },
    {
        title: '注册渠道',
        dataIndex: 'registerChannel',
        key: 'registerChannel'
    },
    {
        title: '审核渠道',
        dataIndex: 'checkChannel',
        key: 'checkChannel'
    },
    {
        title: '注册客户端',
        dataIndex: 'registerClient',
        key: 'registerClient'
    },{
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone'
    }];
    
    
    const overdueOneDayOrderInfoColumn = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo'
      }, {
        title: '客户名称',
        dataIndex: 'realName',
        key: 'realName',
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
	  	  dataIndex: 'peroidValue',
	  	  key: 'peroidValue',
      },{
          title: '租赁金额',
          dataIndex: 'principal',
          key: 'principal'
      },{
          title: '租赁余额',
          dataIndex: 'principalAmount',
          key: 'principalAmount'
      },{
          title: '实际到账金额',
          dataIndex: 'loanAmount',
          key: 'loanAmount'
      },{
          title: '信息认证费',
          dataIndex: 'auditFee',
          key: 'auditFee'
      },{
          title: '逾期本金',
          dataIndex: 'overduePrincipal',
          key: 'overduePrincipal'
      },{
          title: '逾期租金',
          dataIndex: 'overdueInterest',
          key: 'overdueInterest'
      },{
          title: '逾期服务费',
          dataIndex: 'overdueServiceFee',
          key: 'overdueServiceFee'
      },{
          title: '逾期管理费',
          dataIndex: 'overdueManageFee',
          key: 'overdueManageFee'
      },{
          title: '折旧费',
          dataIndex: 'depreciationFee',
          key: 'depreciationFee'
      },{
          title: '逾期总额',
          dataIndex: 'overdueAllFee',
          key: 'overdueAllFee'
      },{
          title: '逾期天数',
          dataIndex: 'overdueDays',
          key: 'overdueDays'
      },
      /*{
          title: '渠道名称',
          dataIndex: 'channelName',
          key: 'channelName'
      },*/
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
          dataIndex: 'bankName',
          key: 'bankName'
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
          dataIndex: 'time',
          key: 'time'
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
          dataIndex: 'cname1',
          key: 'cname1'
      },{
          title: '紧急联系人电话',
          dataIndex: 'cphone1',
          key: 'cphone1'
      },{
          title: '紧急联系人关系',
          dataIndex: 'crelation1',
          key: 'crelation1'
      },{
          title: '亲属联系人姓名',
          dataIndex: 'cname2',
          key: 'cname2'
      },
      {
          title: '注册渠道',
          dataIndex: 'registerChannel',
          key: 'registerChannel'
      },
      {
          title: '审核渠道',
          dataIndex: 'checkChannel',
          key: 'checkChannel'
      },
      {
          title: '亲属联系人电话',
          dataIndex: 'cphone2',
          key: 'cphone2'
      },{
          title: '亲属联系人关系',
          dataIndex: 'crelation2',
          key: 'crelation2'
      },{
    	  title: '通讯录',
    	  dataIndex:"userId",
    	  render:(v) => {
    		  return (<div><a onClick={()=>{this.exportData('contact',v)}}>下载</a></div>);
    	  }
      }];
    
    const overdueTwoDayOrderInfoColumn = [{
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
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
	  	  dataIndex: 'peroidValue',
	  	  key: 'peroidValue',
      },{
          title: '逾期本金',
          dataIndex: 'principal',
          key: 'principal'
      },{
          title: '信审费',
          dataIndex: 'auditFee',
          key: 'auditFee'
      },{
          title: '逾期租金',
          dataIndex: 'rentFee',
          key: 'rentFee'
      },{
          title: '逾期服务费',
          dataIndex: 'overdueServiceFee',
          key: 'overdueServiceFee'
      },{
          title: '逾期管理费',
          dataIndex: 'overdueManageFee',
          key: 'overdueManageFee'
      },{
          title: '折旧费',
          dataIndex: 'depreciationFee',
          key: 'depreciationFee'
      },{
          title: '逾期总额',
          dataIndex: 'allAmount',
          key: 'allAmount'
      }, {
        title: '借款日期',
        dataIndex: 'createTime',
        render:(v) => {
        	return moment(v).format('YYYY-MM-DD');
        }
      },{
	  	  title: '到期日期',
	  	  dataIndex: 'rentEndTime',
		  render:(v) => {
	        return moment(v).format('YYYY-MM-DD');
	      }
      },
      {
          title: '注册渠道',
          dataIndex: 'registerChannel',
          key: 'registerChannel'
      },
      {
          title: '审核渠道',
          dataIndex: 'checkChannel',
          key: 'checkChannel'
      },
      {
          title: '逾期天数',
          dataIndex: 'penaltyDays',
          key: 'penaltyDays'
      },{
	  	  title: '更新日期',
	  	  dataIndex: 'updateTime',
	  	  render:(v) => {
	        return moment(v).format('YYYY-MM-DD');
	      }
      }];
    
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
     <PageHeaderLayout title="入催数据表">
        <Card>
        <div className={styles.tableList}>
	        <h4>当日到期	<Button style={{marginLeft:100}} onClick={()=>{this.exportData(1)}}>导出为EXCEL</Button></h4>
	        <Table
	            dataSource={this.state.todayRepayInfoList}
	            columns={todayRepayInfoColumn}
	            pagination={false}
	            bordered rowKey={record => record.orderNo}
	            loading={this.state.todayRepayInfoTableLoading}/>
	      </div>
	      <br/><br/><br/>  
	     <div className={styles.tableList} style={{overflow:"auto"}}>
	     	<h4>逾期一天  <Button style={{marginLeft:100}} onClick={()=>{this.exportData(2)}} >导出为EXCEL</Button>
	     		<Button style={{marginLeft:100}} onClick={()=>{this.exportData('contact')}} >批量下载通讯录</Button>
	     	</h4>
	        <Table style={{width:4000}}
	            dataSource={this.state.overdueOneDayOrderInfoList}	
	            columns={overdueOneDayOrderInfoColumn}
	            pagination={false}
	            bordered rowKey={record => record.orderNo}
	            loading={this.state.overdueOneDayOrderInfoTableLoading}
	        	rowSelection={rowSelection}
	        	/>
	      </div>
	      <br/><br/><br/>   
	      <div className={styles.tableList}>
	     	<h4>逾期两天及以上    <Button style={{marginLeft:100}} onClick={()=>{this.exportData(3)}}>导出为EXCEL</Button></h4>
	        <Table
	            dataSource={this.state.overdueTwoDayOrderInfoList}	
	            columns={overdueTwoDayOrderInfoColumn}
	            pagination={this.state.overdueTwoDayOrderInfoPg}
	            bordered rowKey={record => record.orderNo}
	            loading={this.state.overdueTwoDayOrderInfoTableLoading}
	        	onChange={this.loadOverdueTwoDayOrderInfo.bind(this)}/>
	      </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
