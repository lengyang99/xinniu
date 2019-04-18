
/*
 * 组件名称：借款订单
 * 功能：列表的查询，
 * model: order_borrow
 * api: ordermanage
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Tabs} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BorrowDetail from '../../components/OrderManage/BorrowDetail';
import BorrowDetailList from '../../components/OrderManage/BorrowDetailList';

import styles from './BorrowOrderList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  borroworder: state.borroworder,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
    recordData:'', //弹框 - 用户的信息
    type:'records',//弹框的tab初始值
  };

  componentWillMount (){
    const { dispatch } = this.props;
    dispatch({
      type: 'borroworder/navfetch',//获取订单状态枚举数据
      payload:''
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'borroworder/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
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
      type: 'borroworder/fetch',
      payload: params,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 查看订单详情 - 传递数据[orderId]*/
  handleModalVisible = (flag = false,record='') => {
    const { dispatch } = this.props;
    const { type } = this.state;
    this.setState({
      recordData:record,
      type: flag?type:'records',
    });
    if(flag&&record!=''){
      dispatch({
        type: 'borroworder/modalrecordfetch',
        payload: record
      })
    }else{
      dispatch({
        type: 'borroworder/changeModal',
        payload: flag
      });
    }
  }

  /* TODO:  Tab标签的切换事件 --  */
  onSwitch = (key) => {
    var { dispatch } = this.props;
    var { recordData } = this.state;
    this.setState({
      type: key,
    });
    if(key === 'records'){
      dispatch({
        type:'borroworder/modalrecordfetch',
        payload:recordData
      })
    }else if(key === 'repayment'){
      dispatch({
        type:'borroworder/modallistfetch',
        payload:recordData
      })
    }
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
      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
        realName:values.realName? values.realName.trim():undefined,
        idNo:values.idNo?values.idNo.trim():undefined,
        statusStr:values.statusStr||undefined };

      if(values.borrowTime && values.borrowTime.length != 0){
        jsonParams.startTime = values.borrowTime[0].format('YYYY-MM-DD').toString();
        jsonParams.endTime = values.borrowTime[1].format('YYYY-MM-DD').toString()
      }
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'borroworder/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
    });
  }

  /*TODO: 生成条件查询表单 ,参数是：渠道订单状态枚举数据 select的下拉选项 */
  renderAdvancedForm(params) {
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
            <FormItem label="姓名">
              {getFieldDecorator('realName')(
                <Input placeholder="请输入"  style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="借款时间">
              {getFieldDecorator('borrowTime')(
                <RangePicker style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                <Input style={{ width: '80%' }}  maxLength={18} placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('statusStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  {params}
                </Select>
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

  //UI组件显示
  render() {
    const { borroworder: { statusnav, loading , data , modal, modalrecord, modallist} ,  dispatch } = this.props;
    const {  type } = this.state;
    const OptionList = statusnav.length?statusnav.map((item)=><Option key={item}>{item}</Option>):[];

    const columns = [
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
        title: '订单状态',
        dataIndex: 'statusStr',
      },
      {
        title: '身份证号',
        dataIndex: 'idNo',
      },
      {
        title: '借款时间',
        dataIndex: 'createTime',
      },
      {
        title: '借款金额',
        dataIndex: 'principal',
      },
      {
        title: '借款期限',
        dataIndex: 'peroidValue',
      },
      {
        title: '操作',
        render: (text,record) => {
          var dataUser = record.orderId;
          return (
            <div>
              <a onClick={() => this.handleModalVisible(true,dataUser)}>订单详情</a>
            </div>
          )},
      },
    ];
    return (
      <PageHeaderLayout title="借款订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm(OptionList)}
            </div>
            <StandardTable
              columns = { columns }
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="订单详情"
          visible={modal}
          onCancel={() => this.handleModalVisible()}
          width={1200}
          bodyStyle={{ height:'640px',overflowY:'auto'}}
          footer={[
            <Button key="back" type="primary"  onClick={ ()=>this.handleModalVisible() }>
              返回
            </Button>,
          ]}
        >
          {modal && <Tabs defaultActiveKey={ type } onChange={this.onSwitch}>
            <TabPane tab="合同金额" key="records">
              <BorrowDetail  modalrecord={ modalrecord }/>
            </TabPane>
            <TabPane tab="还款计划" key="repayment">
             <BorrowDetailList data={ modallist } pagination={false}/>
            </TabPane>
          </Tabs>}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
