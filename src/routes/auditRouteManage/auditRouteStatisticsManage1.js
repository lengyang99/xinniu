import React, {PureComponent} from 'react';
import {Tooltip, Icon, Row, Col, Table, Card, Switch, Form, Modal, DatePicker, Select, Input, InputNumber, Button, message } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../OrderManage/LeaseList.less';

import {
  queryStatistics,
  exportStatistics
} from '../../services/auditRouteManage';
import { auditorList } from '../../services/commonManage';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;

@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateTableLoading: false,
      allTableLoading: false,
      auditStatisticsList: [],
      allAuditStatisticsList:[],
      auditorEnum:[],
      pg:{
    	  currentPage:1,
    	  pageSize:10
      },
      searchParams:JSON.stringify({startTime:moment().format("YYYY-MM-DD 00:00:00"),endTime:moment().format("YYYY-MM-DD 23:59:59")})
    }
  }

  /**获取数据**/
  getDateData(pg) {
	pg = pg || {};
    this.setState({
    	dateTableLoading: true,
    	pg:{
    		...this.state.pg,
    		currentPage:pg.current||1,
    		pageSize:pg.pageSize||10
    	}
    },() => {
    	queryStatistics({
    		searchParams:this.state.searchParams,
    		currentPage:this.state.pg.currentPage,
    		pageSize:this.state.pg.pageSize
    	}).then(res => {
	      if (res.resultCode === 1000) {
	        this.setState({
	          auditStatisticsList :  res.resultData,
	          pg:res.page,
	          dateTableLoading: false
	        })
	      } else {
	        message.error('网络错误，请重试')
	      }
	    })
    });
    
  }
  
  getAllData(){
	  this.setState({
		  allTableLoading: true
	    });
	    queryStatistics({searchParams:JSON.stringify({isAll:true})}).then(res => {
	      if (res.resultCode === 1000) {
	        this.setState({
	          allAuditStatisticsList :  res.resultData,
	          allTableLoading: false
	        })
	      } else {
	        message.error('网络错误，请重试')
	      }
	    })
  }
  
  
  getAuditorEnum(){
	  auditorList().then(res => {
		  this.setState({
			  auditorEnum:res.resultData
		  });
	  });
  }
  
  exportData(){
	  let obj = JSON.parse(this.state.searchParams);
	  obj.isExport = true;
	  exportStatistics({searchParams:JSON.stringify(obj)});
  }
  
  exportAllData(){
	  let obj = {
		isExport:true,
	  	isAll:true 
	  };
	  exportStatistics({searchParams:JSON.stringify(obj)});
  }
  
  /**生命周期**/
  componentDidMount() {
	this.getAuditorEnum();
    this.getDateData();
    this.getAllData();
  }
  
  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = {auditor:values.auditor||undefined};
      if(values.searchTime && values.searchTime.length != 0){
        jsonParams.startTime = values.searchTime[0].format('YYYY-MM-DD 00:00:00').toString();
        jsonParams.endTime = values.searchTime[1].format('YYYY-MM-DD 23:59:59').toString()
      }
      this.setState({
          searchParams:JSON.stringify(jsonParams)
      },()=>{
    	  this.getDateData({current:1,pageSize:10});
      });
      
    });
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
  }
  
  /*TODO: 生成条件查询表单 ,参数是：无 */
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
	      <Col md={8} sm={12}>
	        <FormItem label="时间">
	          {getFieldDecorator('searchTime',{
	        	  initialValue:[moment(),moment()]
	          })(
	            <RangePicker  style={{ width: '80%' }}/>
	          )}
	        </FormItem>
	      </Col>
	      <Col md={8} sm={12}>
	          <FormItem label="审核渠道">
	            {getFieldDecorator('auditor')(
	              <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
	              	{
	            		this.state.auditorEnum.map(v => {
	            			return <Option key={v.id} value={v.code}>{v.name}</Option>
	            		})
	            	}
	              </Select>
	            )}
	          </FormItem>
	        </Col>
	        <Col md={8} sm={12}>
	            <span style={{ float: 'center', marginBottom: 24 }}>
	               <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
	               <Button  onClick={this.handleFormReset} style={{ marginRight: 16 }}>重置</Button>
	               <Button  onClick={this.exportData.bind(this)}>导出</Button>
	             </span>
	         </Col>
        </Row>
      </Form>
    );
  }
  
  render() {
    const columnsForRouteTable = [{
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render:(text) => {
    	  return moment(text).format("YYYY-MM-DD");
      }
    }, {
      title: '风控机构',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '审核订单数',
      dataIndex: 'audit_count',
      key: 'audit_count',
    }, {
      title: '通过订单数',
      dataIndex: 'pass_count',
      key: 'pass_count',
    }, {
      title: '通过比例',
      dataIndex: 'pass_rate',
      key: 'pass_rate',
      render:(text)=>{
    	  return (text*100).toFixed(2)+"%";
      }
    }, {
	  title: '放款金额',
	  dataIndex: 'loan_amount',
	  key: 'loan_amount',
    },{
	  title: '逾期订单数',
	  dataIndex: 'overdue_count',
	  key: 'overdue_count',
    }, {
        title: '逾期订单占比',
        dataIndex: 'overdue_rate',
        key: 'overdue_rate',
        render:(text)=>{
      	  return (text*100).toFixed(2)+"%";
        }
    }];
    
    const columnsForAllRouteTable = columnsForRouteTable.slice(1);
    
    return (
     <PageHeaderLayout title="交租订单">
        <Card>
        <div className={styles.tableList}>
	        <div className={styles.tableListForm}>
	          {this.renderAdvancedForm()}
	        </div>
	        <h4>审核详情</h4>
	        <Table
	            dataSource={this.state.auditStatisticsList}
	            columns={columnsForRouteTable}
	            pagination={this.state.pg}
	            bordered rowKey={record => record.date+record.name}
	            loading={this.state.dateTableLoading}
	        	onChange={this.getDateData.bind(this)}/>
	      </div>
	      <br/><br/><br/>  
	     <div className={styles.tableList}>
	     	<h4>历史数据&nbsp;<Tooltip placement="topLeft" title={"历史数据指到昨日的风控统计数据"}><Icon type="info-circle-o" /></Tooltip><Button style={{marginLeft:100}} onClick={this.exportAllData.bind(this)}>导出</Button></h4>
	     	
	        <Table
	            dataSource={this.state.allAuditStatisticsList}	
	            columns={columnsForAllRouteTable}
	            pagination={false}
	            bordered rowKey={record => record.name}
	            loading={this.state.allTableLoading}/>
	      </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
