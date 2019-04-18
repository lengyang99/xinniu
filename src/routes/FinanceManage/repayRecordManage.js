/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：用户信息列表
 * 功能：列表的查询，
 * model: limitlist
 * api: api
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row,Table,Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import Detail from '../../components/UserInfoList/Detail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {  auditorList } from '../../services/commonManage';
import styles from './UserInfoList.less';

import {

	queryExport,repayRecordAmount


} from '../../services/repayRecordmanage.js';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const dateFormat ='YYYY-MM-DD';
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  userlist: state.userlists,
}))
@Form.create()
export default class TableList extends PureComponent {1
  state = {
	repayRecordAmount:0,
	auditorData:[],
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
    LogValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      },
      
    startTime:'',
    endTime:'',
    type:0,
    fyTableList:[],
    fyTablePg:{},
    fyTableLoading:false,

    fyModalVisible:false,
    userId:'',
  };



  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'userlists/fetch',    //TODO:组件加载完成后，获取表格数据
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
    
    repayRecordAmount({searchParams:this.state.formValues.searchParams}).then(res => {
    	if(res.resultCode == 1000){
    		this.setState({
    			repayRecordAmount:res.resultData
    		});
    	}
    });
    auditorList().then(res => {
    	if(res.resultCode == 1000){
    		this.setState({
    			auditorData:res.resultData
    		});
    	}
    })
  }

  exportData = (e) => {
	    e.preventDefault();
	    const { dispatch, form } = this.props;
	    form.validateFields((err, fieldsValue) => {
	      if (err) return;
	      const values = {
	        ...fieldsValue
	      };
	      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
	    	            name:values.name?values.name.trim():undefined,
                    orderNo:values.orderNo||undefined, 
                    cardNo:values.cardNo||undefined,
	    	        		auditChannel:values.checkChannel||undefined,
	    	        		};
	    	      if(values.createTime && values.createTime.length != 0){
	    	    	  jsonParams.loanStartTime = values.createTime[0].format('YYYY-MM-DD 00:00:00').toString();
	    	          jsonParams.loanEndTime = values.createTime[1].format('YYYY-MM-DD 23:59:59').toString()
	    	      }
	      
	      this.setState({
	        formValues:{
	          currentPage: 1,
	          pageSize: 10,
	          searchParams:JSON.stringify(jsonParams)
	        },
	      });
	      queryExport({
	    	  
	          searchParams:JSON.stringify(jsonParams)
	        	      });
	    });
	  }
  
  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues:{
        ...params
      }
    });
    dispatch({
      type: 'userlists/fetch',
      payload: params,
    });
  }

  getFyTableData(page){
	  page = page||{current:1,pageSize:10};
	  logList({currentPage:page.current||1,pageSize:page.pageSize||10,searchParams:JSON.stringify({

		  
		  userId:this.state.userId
        })}).then(res => {
        if (res.resultCode === 1000) {
	        this.setState({
	          fyTableList: res.resultData,
	          fyTablePg:res.page,
	          fyTableLoading: false
	        })
	      } else {
	        Message.error('网络错误，请重试')
	      }
     })
  }
  
  showFyModal(record) {
	    this.setState({
	      fyModalVisible: true,
	      startTime:'',
	      endTime:'',
	      type:0,
	      userId: record.userId,
	      logValues: {
	          pageSize: 10,
	          currentPage: 1,
	          searchParams: ''
	        }
	    },() =>{
	    	this.getFyTableData();
	    })
	    
  }

  handleFyModalCancel() {
	    this.setState({
	    	fyModalVisible: false
	    })
	  }
  
  /*TODO: 弹框的显示与隐藏 - 查看用户详情 - 传递数据[userId]*/
  handleModalVisible = (flag = false,record={}) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible:flag
    });
    if(flag&&record.userId){
      //显示用户信息 - 弹框
      dispatch({
        type: 'userlists/userDetailfetch',
        payload: record.userId
      })
    }else{
      //关闭弹框
      dispatch({
        type: 'userlists/changeModal',
        payload: flag
      })
    }
  }
  /*TODO: 弹框的显示与隐藏 - 查看用户详情 - 传递数据[userId]*/
  handleUserModalVisible = (flag = false,record={}) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible:flag
    });
    if(flag&&record.userId){
      //显示用户信息 - 弹框
      dispatch({
        type: 'userlists/userDetailfetch',
        payload: record.userId
      })
    }else{
      //关闭弹框
      dispatch({
        type: 'userlists/changeModal',
        payload: flag
      })
    }
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
      var jsonParams = { 
                  phone:values.phone?values.phone.trim():undefined,
    	            name:values.name?values.name.trim():undefined,
                  orderNo:values.orderNo||undefined,
                  cardNo:values.cardNo||undefined,
    	        		auditChannel:values.checkChannel||undefined,};
    	      if(values.createTime && values.createTime.length != 0){
    	    	  jsonParams.loanStartTime = values.createTime[0].format('YYYY-MM-DD 00:00:00').toString();
    	          jsonParams.loanEndTime = values.createTime[1].format('YYYY-MM-DD 23:59:59').toString()
    	      }
      
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      },() => {
    	  repayRecordAmount({searchParams:this.state.formValues.searchParams}).then(res => {
    	      	if(res.resultCode == 1000){
    	      		this.setState({
    	      			repayRecordAmount:res.resultData
    	      		});
    	      	}
    	      });
      });
      dispatch({
        type: 'userlists/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
    });
  }

  
  logSearch = (e) => {
	    e.preventDefault();
	    const { dispatch, form } = this.props;
	    form.validateFields((err, fieldsValue) => {
	      if (err) return;
	      const values = {
	        ...fieldsValue
	      };
	      var jsonParams = { 
	    	userId:this.state.userId,
	        type:values.type?values.type.trim():undefined
	
	      };
	      if(values.logTime && values.logTime.length != 0){
	          jsonParams.startTime = values.logTime[0].format('YYYY-MM-DD').toString();
	          this.setState({
	        	startTime:values.createTime[0].format('YYYY-MM-DD').toString(),
		        endTime:values.createTime[1].format('YYYY-MM-DD').toString()
	          });
	         	          jsonParams.endTime = values.createTime[1].format('YYYY-MM-DD').toString()
	      }
	      
	      this.setState({
	        logValues:{
	          currentPage: 1,
	          pageSize: 10,
	          searchParams:JSON.stringify(jsonParams)
	        },
	        type:jsonParams.type
	      });
	 
	      logList({
	    	  
	    	  currentPage: 1,
	          pageSize: 10,
	          searchParams:JSON.stringify(jsonParams)
	        	      }).then(res => {
	        	          if (res.resultCode === 1000) {
	        	  	        this.setState({
	        	  	          fyTableList: res.resultData,
	        	  	          fyTablePg:res.page,
	        	  	          fyTableLoading: false
	        	  	        })
	        	  	      } else {
	        	  	        Message.error('网络错误，请重试')
	        	  	      }
	        	       })
	    });
	  }
  
  
  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
  }
  
  logFormReset = () => {
	    const { form, dispatch } = this.props;
	    form.resetFields();
	    this.setState({
	      logValues: {
	        pageSize: 10,
	        currentPage: 1,
	        searchParams: ''
	      }
	    });
	  }


  /*TODO: 生成条件查询表单 ,参数是：渠道枚举数据 select的下拉选项 */
  renderAdvancedForm(params) {
    const { getFieldDecorator } = this.props.form;
    const optionparams = params.length!=0?params.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>):[];
    return (
    		<Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={7} sm={24}>
                <FormItem label="手机号">
                  {getFieldDecorator('phone',{
                    rules:[
                      { pattern:/^1[3|4|5|6|7|8|9]\d{9}$/,
                        len:11,
                        message:'请输入有效的手机号'}
                    ],
                    validateTrigger:'onBlur'
                  })(
                    <Input placeholder="请输入"  maxLength="11" style={{ width: '80%' }} />
                  )}
                </FormItem>
              </Col>
             
              <Col md={7} sm={24}>
              <FormItem label="第三方订单号">
	              {getFieldDecorator('orderNo',{                
	              })(
	                <Input placeholder="请输入"  maxLength="35" style={{ width: '80%' }} />
	              )}
              </FormItem>
            </Col>
              <Col md={10} sm={24}>
                <FormItem label="还款时间">
                  {getFieldDecorator('createTime')(
                    <RangePicker style={{ width: '80%' }} format={dateFormat}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
    	      <Col md={7} sm={24}>
    	        <FormItem label="银行卡">
    	          {getFieldDecorator('cardNo')(
    	            <Input placeholder="请输入" style={{ width: '80%' }} />
    	          )}
    	        </FormItem>
    	      </Col>
    	      <Col md={7} sm={24}>
    	          <FormItem label="姓名">
    	            {getFieldDecorator('name')(
    	              <Input placeholder="请输入" style={{ width: '80%' }} />
    	            )}
    	          </FormItem>
              </Col>
              <Col md={7} sm={24}>
                <FormItem label="审核渠道">
                  {getFieldDecorator('checkChannel')(
                    <Select placeholder="请选择" style={{ width: '80%'}}>
                      {
                    	  this.state.auditorData.map(v => {
                    		  return (<Option key={v.id} key={v.code}>{v.name}</Option>);
                    	  })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col> 
       
              <Col md={10} sm={24}>
                 <span style={{ float: 'center', marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                    <Button  onClick={this.handleFormReset}>重置</Button>
                    <Button style={{marginLeft:16}} type={'primary '} onClick={this.exportData} >导出为EXCEL</Button>
                  </span>
              </Col>
            </Row>
          </Form>
    );
  }

  /*TODO:UI组件渲染*/
  render() {

    const { userlist: { loading , data , userinfo, channellist} ,  dispatch } = this.props;
    const { modalVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
    	{
            title: '姓名',
            dataIndex: 'name',
          },
    	{
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '银行卡',
        dataIndex: 'cardNo',
      },
      {
    	  title: '银行名称',
    	  dataIndex: 'bank',
      },
      {
        title: '还款金额',
        dataIndex: 'principal',
      },
      {
        title: '还款时间',
        dataIndex: 'createTime',
      },
      {
          title: '审核渠道',
          dataIndex: 'auditChannel',
      },
      {
          title: '订单号',
          dataIndex: 'orderNo',
      },     
    ];

    const columnFyTable = [
        {title:'时间',dataIndex:'times',key:'result'},
        {title:'申请操作',dataIndex:'type',key:'result'},
        {title:'结果',dataIndex:'result',key:'result'},
        
    ];
    
    return (
      <PageHeaderLayout title="用户信息">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm(channellist)}
            </div>
            <StandardTable
              columns = { columns }
              loading={ loading }
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
            
          <div> 
      	    <span>累计交租金额：{this.state.repayRecordAmount||0}元</span>
      	  </div>
        </Card>
        <Modal
          title="用户详情"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
          width={1200}
          bodyStyle={{ height:'640px',overflowY:'auto'}}
          footer ={[
            <Button key="btn" type="primary" onClick={() => this.handleModalVisible()}>返回</Button>
          ]}
        >
          {
            userinfo.manageUserDetailModel|| userinfo.clUserAuth || userinfo.userEmerContacts ? <Detail {...userinfo} />:<Spin size="small" style={{ marginLeft: 8 }} />
          }
        </Modal>
        <Modal
        title="用户操作记录"
        visible={this.state.fyModalVisible}
        onCancel={this.handleFyModalCancel.bind(this)}
        width={1200}
        bodyStyle={{ height:'640px',overflowY:'auto'}}
        footer ={[
          <Button key="btn" type="primary" onClick={this.handleFyModalCancel.bind(this)}>返回</Button>
        ]}>
        <Form onSubmit={this.logSearch} layout="inline">

          
     
            <FormItem label="时间">
              {getFieldDecorator('logTime')(
                <RangePicker style={{ width: '80%' }} format={dateFormat}/>
              )}
            </FormItem>


    
          <FormItem  style={{ width: '200px' }} label="操作">
          {getFieldDecorator('type')(
            <Select style={{ width: '150px' }} placeholder="请选择" >
              <Option value="1">登录</Option>
              <Option value="2">认证</Option>
              <Option value="3">绑卡</Option>
              <Option value="4">租赁</Option>
              <Option value="5">放款</Option>
              <Option value="6">交租</Option>
            </Select>
          )}
        </FormItem>
   
     
             <span style={{ float: 'center', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                <Button  onClick={this.logFormReset}>重置</Button>
              
              </span>
   

      </Form>
      <Table
      dataSource={this.state.fyTableList}
      columns={columnFyTable}
      pagination={this.state.fyTablePg}
      bordered rowKey={record => record.id}
      loading={this.state.fyTableLoading}
      onChange={this.getFyTableData.bind(this)}
    />
      </Modal>
        
      </PageHeaderLayout>
    );
  
  }
}
