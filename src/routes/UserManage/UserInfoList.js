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

import styles from './UserInfoList.less';

import {
	opinionList,
	addFeedBack,
	updateFeedBack,
	queryExport,
	queryOpinion,
	logList,
	bankList,
	unBindCard,
	invalidCard
} from '../../services/usermanage.js';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;
const dateFormat ='YYYY-MM-DD';
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  userlist: state.userlist,
}))
@Form.create()
export default class TableList extends PureComponent {1
  state = {
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

    bkTableList:[],
    bkTableLoading:false,
    bkModalVisible:false,

    opinion:'',
    opinonState:'',
    opinonType:'',
    fkTableList:[],
    fkTablePg:{},
    fkTableLoading:false,
    fkModalVisible:false,
    opinionId:'',


    modalAddVisible: false,
    modalAddTime: '',
    modalAddStatus: '10',
    modalAddOpinion: '',


  };

  componentWillMount() {
  }

  componentDidMount() {
	    this.handleSearch({preventDefault:()=>{}});
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
	        realName:values.realName?values.realName.trim():undefined,
	        registerClient:values.registerClient||undefined, channelId:values.registerChannel||undefined,
	        state:values.state||undefined,
	        userId:values.userId||undefined};
	      if(values.registerTime && values.registerTime.length != 0){
	          jsonParams.registerStartTime = values.registerTime[0].format('YYYY-MM-DD').toString();
	          jsonParams.registerEndTime = values.registerTime[1].format('YYYY-MM-DD').toString()
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
      type: 'userlist/fetch',
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

  getFkTableData(page){
	  page = page||{current:1,pageSize:10};
	  opinionList({currentPage:page.current||1,pageSize:page.pageSize||10,searchParams:JSON.stringify({
		 /* id:this.state.id,	*/
		  userId:this.state.opinionId
        })}).then(res => {
        if (res.resultCode === 1000) {
	        this.setState({
	          fkTableList: res.resultData,
	          fkTablePg:res.page,
	          fkTableLoading: false
	        })
	      } else {
	        Message.error('网络错误，请重试')
	      }
     })
  }

  StandardTableChange = (page) => {
	    const { dispatch } = this.props;
	    const { logValues } = this.state;
	    const params = {
	      ...logValues,
	      currentPage: page.current,
	      pageSize: page.pageSize,
	    };
	    this.setState({
	      logValues:{
	        ...params
	      }
	    });
	    var jsonParams={userId:this.state.userId,type:this.state.type}
	    if(this.state.startTime!==''){
	    	jsonParams.startTime=this.state.startTim
	    }
	    if(this.state.endTime!==''){
	    	jsonParams.endTime=this.state.endTime
	    }
	    logList({
	    	 currentPage: page.current,
	         pageSize: page.pageSize,
	         searchParams:JSON.stringify(jsonParams
	        	    )

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
	  }

  StandardTableChanges = (page) => {
	    const { dispatch } = this.props;
	    const { logValues } = this.state;
	    const params = {
	      ...logValues,
	      currentPage: page.current,
	      pageSize: page.pageSize,
	    };
	    this.setState({
	      logValues:{
	        ...params
	      }
	    });
	    /*var jsonParams={userId:this.state.userId,opinonType:this.state.opinonType,opinion:this.state.opinion,opinonState:this.state.opinonState}*/
	    var jsonParams={
	  		  userId:this.state.opinionId}
	    if(this.state.startTime!==''){
	    	jsonParams.startTime=this.state.startTim
	    }
	    if(this.state.endTime!==''){
	    	jsonParams.endTime=this.state.endTime
	    }
	    opinionList({
	    	 currentPage: page.current,
	         pageSize: page.pageSize,
	         searchParams:JSON.stringify(jsonParams
	        	    )

	      	      }).then(res => {
	      	          if (res.resultCode === 1000) {
	      	  	        this.setState({
	      	  	          fkTableList: res.resultData,
	      	  	          fkTablePg:res.page,
	      	  	          fkTableLoading: false
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

  showFkModal(record) {
	    this.setState({
	      fkModalVisible: true,
	   /*   id:record.id,*/
	      opinionId: record.userId,
	      logValues: {
	          pageSize: 10,
	          currentPage: 1,
	          searchParams:''
	        }
	    },() =>{
	    	this.getFkTableData();
	    })

  }

  getBkData(){
	  bankList(this.state.userId).then(res =>{
		  if(res.resultCode == 1000){
			  this.setState({
				  bkTableList:res.resultData,
				  bkTableLoading:false
			  });
		  }else{
			  Message.error(res.resultMessage)
		  }
	  })
  }

  showBkModal(record){
	  this.setState({
	      bkModalVisible: true,
	      userId: record.userId,
	      bkTableLoading:true
	  },() => {
		  this.getBkData();
	  })
  }

  handleBkModalCancel(){
	  this.setState({
		  bkModalVisible: false
	  })
  }

  unBindCard(id){
	  unBindCard(id).then(res => {
		  if(res.resultCode == 1000){
			  message.success("操作成功");
			  this.getBkData();
		  }else{
			  Message.error(res.resultMessage);
		  }
	  });
  }

  invalidCard(id){
	  invalidCard(id).then(res => {
		  if(res.resultCode == 1000){
			  message.success("操作成功");
			  this.getBkData();
		  }else{
			  Message.error(res.resultMessage);
		  }
	  });
  }

  handleFyModalCancel() {
	    this.setState({
	    	fyModalVisible: false
	    })
	  }
  handleFkModalCancel() {
	  this.setState({
		  fkModalVisible: false
	  })
  }

  /**新增**/
  addFeedBackData(params) {
	  addFeedBack({
		  opinionInfo: encodeURIComponent(JSON.stringify(params))

    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('新增成功');
        this.setState({
          modalAddVisible: false
        },()=>{
        	this.getFkTableData(this.state.fkTablePg);
        });

      } else {
        message.error('网络错误，请重试')
      }
    })
  }
  updateState(params){
	  updateFeedBack({
	  opinionInfo: encodeURIComponent(JSON.stringify({id:params}))
     }).then(res => {
      if (res.resultCode === 1000) {
    	  message.success('更新成功');
    	  this.getFkTableData(this.state.fkTablePg);
	      } else {
	        Message.error('更新失败，请重试')
	      }
   })
}
  /**展示新增模态框**/
  showModalAdd() {
    this.setState({
      modalAddVisible: true,
      modalAddTime:moment().format("YYYY-MM-DD HH:mm:ss"),
      modalAddStatus: '10',
      modalAddOpinion: '',
    })
  }

  modalAddOpinionChange(e){
	  this.setState({
		  modalAddOpinion:e.target.value
	  });
  }
  modalAddStateChange(e){
	  this.setState({
		  modalAddStatus:e.target.value
	  });
  }

  handleModalAddOk() {
	//  console.log(this.state);
	  if(this.state.modalAddOpinion.trim()===""){

		      message.info("反馈信息不能为空");

		  return ;
	  }
	  this.addFeedBackData({
		  createTime:this.state.modalAddTime,
		  opinion:this.state.modalAddOpinion,
		  state:this.state.modalAddStatus,
		  userId:this.state.opinionId
	  });
  }

  handleModalAddCancel() {
    this.setState({
      modalAddVisible: false
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
        type: 'userlist/userDetailfetch',
        payload: record.userId
      })
    }else{
      //关闭弹框
      dispatch({
        type: 'userlist/changeModal',
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
        type: 'userlist/userDetailfetch',
        payload: record.userId
      })
    }else{
      //关闭弹框
      dispatch({
        type: 'userlist/changeModal',
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
      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
        realName:values.realName?values.realName.trim():undefined,
        registerClient:values.registerClient||undefined, channelId:values.registerChannel||undefined,
        state:values.state||undefined,
        userId:values.userId||undefined};
      if(values.registerTime && values.registerTime.length != 0){
          jsonParams.registerStartTime = values.registerTime[0].format('YYYY-MM-DD').toString();
          jsonParams.registerEndTime = values.registerTime[1].format('YYYY-MM-DD').toString()
      }

      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'userlist/fetch',
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
	        	startTime:values.logTime[0].format('YYYY-MM-DD').toString(),
		        endTime:values.logTime[1].format('YYYY-MM-DD').toString()
	          });
	         	          jsonParams.endTime = values.logTime[1].format('YYYY-MM-DD').toString()
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
  renderAdvancedForm(params = []) {
    const { getFieldDecorator } = this.props.form;
    const optionparams = params.length!=0?params.map(item=><Option key={item.id} value={item.id}>{item.name}</Option>):[];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone',{
                rules:[
                  { pattern:/^1[3|4|5|6|7|8]\d{9}$/,
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
            <FormItem label="姓名">
              {getFieldDecorator('realName')(
                <Input placeholder="请输入" style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
          <FormItem label="ID">
            {getFieldDecorator('userId',{
              rules:[
                { pattern:/\d/,
                  len:11,
                  message:'请输入有效数字'}
              ],
              validateTrigger:'onBlur'
            })(
              <Input placeholder="请输入"  maxLength="20" style={{ width: '50%' }} />
            )}
          </FormItem>
        </Col>
          <Col md={10} sm={24}>
            <FormItem label="注册时间">
              {getFieldDecorator('registerTime',{
                  initialValue:[moment(),moment().add(1,"days")]
              })(
                <RangePicker style={{ width: '80%' }} format={dateFormat}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="注册客户端">
              {getFieldDecorator('registerClient')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  <Option value="Android">Android</Option>
                  <Option value="iOS">iOS</Option>

                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
          <FormItem label="状态">
          {getFieldDecorator('state')(
            <Select placeholder="请选择" style={{ width: '80%' }}>
              <option value="100">资料未完善</option>
             <option value="103">未下单</option>
             <option value="102">已下单</option>
            </Select>
          )}
        </FormItem>
        </Col>
          <Col md={10} sm={24}>
             <span style={{ float: 'center', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                <Button  onClick={this.handleFormReset}>清空</Button>
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
            title: '用户ID',
            dataIndex: 'userId',
          },
    	{
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '姓名',
        dataIndex: 'realName',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
      },
      {
        title: '注册客户端',
        dataIndex: 'platform',
      },
      {
        title: '状态',
        dataIndex: 'state'
      },
      {
        title: '操作',
        render: (text,record) => {
          var dataUser = record;
          return (
            <div>
              <a onClick={() => this.handleModalVisible(true,dataUser)}>用户详情</a> &nbsp;&nbsp;
              <a onClick={() => this.showBkModal(dataUser)}>用户银行卡</a>
            </div>

          )},
      },
    ];

    const columnBkTable = [
        {title:'银行卡号',dataIndex:'cardNo'},
        {title:'银行编码',dataIndex:'bankCode'},
        {title:'银行名称',dataIndex:'bank'},
        {title:'开户行地址',dataIndex:'bankAddress'},
        {title:'是否有盾绑卡',dataIndex:'lianlian',render:(v) => {
        	return v?"是":"否"
        }},
        {title:'是否富友绑卡',dataIndex:'fuyou',render:(v) => {
        	return v?"是":"否"
        }},
        {title:'操作',dataIndex:'id',render:(v) => {
        	return (
        		<div>
        			<a onClick={() => this.unBindCard(v)}>富友解绑</a> &nbsp;&nbsp;
        			<a onClick={() => this.invalidCard(v)}>作废银行卡</a>
        		</div>
        	);
        }}
    ];

    const columnFyTable = [
        {title:'时间',dataIndex:'times',key:'result'},
        {title:'申请操作',dataIndex:'type',key:'result'},
        {title:'app版本号',dataIndex:'appVersion',key:'result'},
        {title:'结果',dataIndex:'result',key:'result'},

    ];

    const columnFkTable = [
    	{title:'时间',dataIndex:'createTime',key:'result'},
    	{title:'反馈信息',dataIndex:'opinion',key:'result'},
    	{title:'来源',dataIndex:'typeStr',key:'result'},
    	{title:'结果',dataIndex:'stateStr',key:'result'},
    	 {
            title: '操作',
            render: (text,record) => {
             let dataUser = record.id;
              return (
                <div>
                  { record.state === "10"? <a onClick={() => this.updateState(dataUser)}>确认</a>:"--"}
                </div>
              )},
          },

    	];
    const formItemLayout = {
    	      labelCol: {
    	        xs: {span: 12},
    	        sm: {span: 12},
    	      },
    	      wrapperCol: {
    	        xs: {span: 12},
    	        sm: {span: 12},
    	      },
    	    };
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
        title="银行卡列表"
        visible={this.state.bkModalVisible}
        onCancel={() => this.handleBkModalCancel()}
        width={1200}
        footer ={[
          <Button key="btn" type="primary" onClick={() => this.handleBkModalCancel()}>返回</Button>
        ]}
        >
	        <Table
		        dataSource={this.state.bkTableList}
		        columns={columnBkTable}
		        pagination={false}
		        bordered rowKey={record => record.id}
		        loading={this.state.bkTableLoading}
	        />
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
                <Button  onClick={this.logFormReset}>清空</Button>

              </span>


      </Form>
      <Table
      dataSource={this.state.fyTableList}
      columns={columnFyTable}
      pagination={this.state.fyTablePg}
      bordered rowKey={record => record.id}
      loading={this.state.fyTableLoading}
      onChange={this.StandardTableChange}
    />
      </Modal>

   <Modal
      visible={this.state.fkModalVisible}
      onCancel={this.handleFkModalCancel.bind(this)}
      width={1200}
      bodyStyle={{ height:'440px',overflowY:'auto'}}
   	  closable={false}
      footer ={[
        <Button key="btn" type="primary" onClick={this.handleFkModalCancel.bind(this)}>返回</Button>
      ]}>

    <Button type="primary" style={{ marginRight: 15}} onClick={this.showModalAdd.bind(this)}>添加</Button>

    <Table
    dataSource={this.state.fkTableList}
    columns={columnFkTable}
    pagination={this.state.fkTablePg}
    bordered rowKey={record => record.createTime}
    loading={this.state.fkTableLoading}
    onChange={this.StandardTableChanges}
  />
    </Modal>

    <Modal
	    title="添加反馈"
	    visible={this.state.modalAddVisible}
	    onCancel={this.handleModalAddCancel.bind(this)}
	    onOk={this.handleModalAddOk.bind(this)}
	    width={550}
    >
    <Form layout={'inline'}
    style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
	<FormItem {...formItemLayout} label={'时间'}>
	  <Input disabled={true} style={{width:150}} value={this.state.modalAddTime}/>
	</FormItem>
	  <FormItem {...formItemLayout} label={'详情'}>
	  	<TextArea value={this.state.modalAddOpinion} maxlength = '100' placeholder="请输入100字以内"  onChange={this.modalAddOpinionChange.bind(this)} rows={4} cols={60}  />
	 </FormItem>
	 <FormItem {...formItemLayout} label={'状态'}>
		 <select value ={this.state.modalAddStatus}   onChange={this.modalAddStateChange.bind(this) } >
	     <option value={100}>资料未完善</option>
       <option value={102}>未下单</option>
	     <option value={103}>已下单</option>
	     </select>
     </FormItem>
     </Form>
     </Modal>
      </PageHeaderLayout>
    );

  }
}

