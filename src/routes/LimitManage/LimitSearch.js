/*
 * TODO:组件名称：组件额度管理
 * 功能：列表的查询，
 * model: limitlist
 * api: limit
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, DatePicker, Modal, Spin, Tabs } from 'antd';
import StandardTable from '../../components/StandardTable';
import LimitListDetail from '../../components/LimitManage/LimitListDetail';
import Detail from '../../components/UserInfoList/Detail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './LimitManageList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

@connect(state => ({
  limitlist: state.limitlist,
  userlist: state.userlist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
    modalVisible:false,
    activeKey:"0",
    limitdetail :[],
    recordeuser: '',
    data:{
      list:[],
      pagination: false
    }
  };

  fetch(params) {
    const { dispatch } = this.props;
    dispatch({
      type: 'limitlist/fetch',
      payload:params,
      callback:(result)=>{
         this.setState({
            data:{
              list:result.resultData,
              pagination:false,
            }
         })
      }
    });
  }

  onSwitch = (key)=> {
    const { dispatch } = this.props;
    const { recordeuser } = this.state;
    if(key === 0){
      dispatch({
        type:'limitlist/userLimitDetailfetch',
        payload: {
          creditInfoId:recordeuser.id,
          pageSize:10,
          currentPage:1
        },
        callback:(result)=>{
          if(result.resultCode === 1000 ){
            this.setState({
              limitdetail:result.resultData
            })
          }
        }
      });
    }else{
      dispatch({
        type:'userlist/userDetailfetch',
        payload: recordeuser.userId,
        callback:(result)=>{
          if(result.resultCode === 1000 ){
            this.setState({
              limitdetail:result.resultData
            })
          }
        }
      });
    }
  }

  /*TODO: 弹框的显示与隐藏 - 查看用户详情 - 传递数据[userId]*/
  handleModalVisible = (flag = false,record={}) => {
    const { dispatch } = this.props;
    if(flag){
      this.setState({
        modalVisible:flag,
        recordeuser: record,
      })
      dispatch({
        type:'limitlist/userLimitDetailfetch',
        payload: {
          creditInfoId:record.id,
          pageSize:10,
          currentPage:1
        },
        callback:(result)=>{
          if(result.resultCode === 1000 ){
            this.setState({
              limitdetail:result.resultData
            })
          }
        }
      });
    }else{
      this.setState({
        modalVisible:flag,
        recordeuser: record,
        activeKey: "0",
        limitdetail:[],
      })
    }
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const { form  } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      },
      data:{
        list:[],
        pagination: false
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
      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
        idNo:values.idNo?values.idNo.trim():undefined };
      if(jsonParams.phone||jsonParams.idNo) {
        this.setState({
          formValues: {
            currentPage: 1,
            pageSize: 10,
            searchParams: JSON.stringify(jsonParams)
          },
        });
        this.fetch({
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        });
      }else{
        Modal.info({
          title:'请输入查询条件'
        })
      }
    });
  }

  /*TODO: 生成条件查询表单 ,参数是：渠道枚举数据 ,额度状态枚举，额度产品枚举 */
  renderAdvancedForm( ) {
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
                <Input placeholder="请输入"  maxLength={11}  style={{ width: '80%' }} />
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
                <Input placeholder="请输入"  maxLength={18}  style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
             <span style={{ float: 'center', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                <Button  onClick={this.handleFormReset}>重置</Button>
              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { userlist: { userinfo }, limitlist: { loading } , dispatch } = this.props;
    const { modalVisible ,activeKey, selectedRows, limitdetail, data } = this.state;

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
        title: '渠道来源',
        dataIndex: 'fromChannel',
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
        dataIndex: 'productTypeStr',
        width:90,
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
        dataIndex: 'creditStatusStr',
        width:90,
      },{
      title: '操作',
      dataIndex: 'type',
      render: (value, record) => {
        return <a onClick={()=>this.handleModalVisible(true,record)} >查看</a>
      }
    }];

    return (
      <PageHeaderLayout title="额度管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              { this.renderAdvancedForm() }
            </div>
            <StandardTable
              columns = { columns }
              loading={loading}
              data={ data }
              selectedRows = { selectedRows }
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="额度查看"
          visible={ modalVisible }
          width={ 1200 }
          bodyStyle={{ height:'640px',overflowY:'auto'}}
          footer={[<Button type='primary' onClick={() => this.handleModalVisible()}>返回</Button>]}
          onCancel={() => this.handleModalVisible()}
        >
          {
            modalVisible && <Tabs defaultActiveKey={ activeKey } onChange={this.onSwitch}>
            <TabPane tab="额度详情"  key="0">
              <LimitListDetail  data={ limitdetail }/>
            </TabPane>
            <TabPane tab="基本信息"  key="1">
              {
                userinfo.manageUserDetailModel|| userinfo.clUserAuth || userinfo.userEmerContacts ?  <Detail { ...userinfo }/> : <Spin size="small" style={{ marginLeft: 8 }} />
              }
            </TabPane>
          </Tabs>
          }
        </Modal>
      </PageHeaderLayout>
    );
  }
}
