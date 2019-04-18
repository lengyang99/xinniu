/**
 * 额度管理审核
 *
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal, Spin, Tabs } from 'antd';
import StandardTable from '../../components/StandardTable';
import CreditCardInfo from '../../components/CreditManage/CreditcardInfo';
import MobileCarrier from '../../components/CreditManage/MobileCarrier';
import RulesReport from '../../components/CreditManage/RulesReport';
import TaobaoInfo from '../../components/CreditManage/TaobaoInfo';
import Detail from '../../components/UserInfoList/Detail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CreditManage.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

@connect(state => ({
  creditlimitlist: state.creditlimitlist,
  userlist: state.userlist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {
      currentPage: 1,
      pageSize: 10,
      searchParams:''
    },
    recorduser: {},
    modalVisible:false,
    activeKey:"0",
    userlist:[],
    limitdetail:[],
  };

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'creditlimitlist/creditlimitstatusfetch',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'creditlimitlist/fetch',
      payload: formValues
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
      type: 'creditlimitlist/fetch',
      payload: params
    });
  }

  /*TODO: 弹框的显示与隐藏 - 查看用户详情 - 传递数据[userId]*/
  handleModalVisible = (flag = false,record={}) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: flag,
      recorduser: record
    });
    if(flag){
      dispatch({
        type:'userlist/userDetailfetch',
        payload: record.userId,
      });
    }
  }

  /**查看详情- Tab切换事件
   * **/
  onSwitch = (key)=> {
    const { dispatch } = this.props;
    const { recorduser } = this.state;
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
        idNo:values.idNo?values.idNo.trim():undefined,
        authStatusStr:values.authStatusStr||undefined
            };
      if(values.createTime && values.createTime.length != 0 ){
        jsonParams.createTimeStart = values.createTime[0].format('YYYY-MM-DD').toString();
        jsonParams.createTimeEnd = values.createTime[1].format('YYYY-MM-DD').toString()
      }
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'creditlimitlist/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
    });
  }


  /*TODO: 生成条件查询表单 ,参数是：渠道枚举数据 ,额度状态枚举，额度产品枚举 */
  renderAdvancedForm(statuslist=[] ) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone',{
                rules:[
                  { pattern:/^1[3|4|5|7|8]\d{9}$/,
                    len:11,
                    message:'请输入有效的手机号'}
                ],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入" maxLength={11} style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idNo',{
                rules:[
                  { pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                    max:18,
                    min:15,
                    message:'请输入有效的身份证号'}
                ],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入"  maxLength={18} style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createTime')(
                <RangePicker style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="额度审核状态">
              {getFieldDecorator('authStatusStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  {statuslist}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
             <span style={{ float: 'left', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                <Button  onClick={this.handleFormReset}>重置</Button>
              </span>
          </Col>
        </Row>

      </Form>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userlist: { userinfo }, creditlimitlist: { data, loading , creditlimitstatus } ,  dispatch } = this.props;
    const { modalVisible ,activeKey, recorduser } = this.state;
    const limitstatusOption = creditlimitstatus?creditlimitstatus.map(item=><Option key={item}>{item}</Option>):[];

    const columns = [{
      title: '额度id',
      dataIndex: 'id',
      key: 'id',
      width:80,
    }, {
      title: '客户姓名',
      dataIndex: 'realName',
      width:90,
    }, {
      title: '手机号',
      dataIndex: 'phone',
      width:120,
    }, {
      title: '身份证号',
      dataIndex: 'idNo',
      width:170,
    }, {
      title: '额度类型',
      dataIndex: 'productType',
      width:90,
      render:(text)=>text==1?'PDL':'分期'
    }, {
      title: '额度',
      dataIndex: 'total',
      width:80,
    }, {
      title: '已用额度',
      dataIndex: 'used',
      width:90,
    }, {
      title: '生成时间',
      dataIndex: 'createTime',
    }, {
      title: '激活时间',
      dataIndex: 'enableTime',
    }, {
      title: '变更时间',
      dataIndex: 'updateTime',
    }, {
      title: '状态',
      dataIndex: 'authStatusStr',
      width:120,
    },{
      title: '操作',
      dataIndex: '',
      render: (value, record) => { return (<a onClick={()=>this.handleModalVisible(true,record)}>查看</a>) }
    }];

    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    return (
      <PageHeaderLayout title="额度审核列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm(limitstatusOption)}
            </div>
            <StandardTable
              columns = { columns }
              loading={loading}
              data={ data }
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="信息查看"
          visible={ modalVisible }
          width={ 1200 }
          style={{top:50}}
          bodyStyle={{ height:'734px',overflowY:'auto'}}
          footer={[<Button  type="primary"  key="reset" onClick={() => this.handleModalVisible()}>返回</Button>]}
          onCancel={() => this.handleModalVisible()}
        >
          {  modalVisible &&  <Tabs defaultActiveKey={ activeKey } onChange={this.onSwitch} style={{borderBottom:'1px solid #E8E8E8',margin:0,paddingBottom:10}}  size='samll'>
            <TabPane tab="基本信息" key="0" style={{height:'480px',overflowY:'auto',overflowX:'hidden'}}>
              {
                userinfo.manageUserDetailModel|| userinfo.clUserAuth || userinfo.userEmerContacts ? <Detail {...userinfo} />:<Spin size="small" style={{ marginLeft: 8 }} />
              }
            </TabPane>
            <TabPane tab="运营商报告" key="1" style={{height:'480px',overflowY:'auto',overflowX:'hidden'}}>
              <MobileCarrier classStyle={styles}  userId={recorduser.userId}  dispatch={dispatch}  detailUrl={'creditlimitlist/mobileInfofetch'}/>
            </TabPane>
            <TabPane tab="规则报告" key="2"  style={{height:'480px',overflowY:'auto',overflowX:'hidden'}}>
              <RulesReport classStyle={styles}  userId={recorduser.userId}  dispatch={dispatch} detailUrl={'creditlimitlist/ruleInfofetch'}/>
            </TabPane>
            <TabPane tab="淘宝信息" key="3"  style={{height:'480px',overflowY:'auto',overflowX:'hidden'}}>
              <TaobaoInfo classStyle={styles}  userId={recorduser.userId}  dispatch={dispatch}  detailUrl={'creditlimitlist/taobaoInfofetch'}  listUrl={'creditlimitlist/taobaolistfetch'}/>
            </TabPane>
            <TabPane tab="信用卡信息" key="4"  style={{height:'480px',overflowY:'auto',overflowX:'hidden'}}>
              <CreditCardInfo classStyle={styles}  userId={recorduser.userId}  dispatch={dispatch}  detailUrl={'creditlimitlist/cardInfofetch'}   listUrl={'creditlimitlist/cardlistfetch'}/>
            </TabPane>
          </Tabs>
          }
          {
            modalVisible &&  <FormItem label='审核状态' {...formItemLayout1} style={{margin:10,height:'30px'}}>
              {getFieldDecorator('authState',{
                initialValue:recorduser.authStatusStr,
              })(
                <Input disabled={true}/>
              )}
            </FormItem>
          }
        </Modal>
      </PageHeaderLayout>
    );
  }
}


