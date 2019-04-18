
/*
 * 组件名称：借款订单
 * 功能：列表的查询，
 * model: order_borrow
 * api: ordermanage
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';
import StandardTable from '../../components/StandardTable';
import TableDetail from '../../components/OrderManage/LoanDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {  actionLoanOrder } from '../../services/ordermanage';



import styles from './BorrowOrderList.less';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  loanorder: state.loanorder,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'loanorder/fetch',
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
      type: 'loanorder/fetch',
      payload: params,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 查看订单放款详情 - 传递数据[orderId , 事件类型 ]*/
  handleModalVisible = (flag = false,record,typeName) => {
    const { dispatch } = this.props;
    if(flag && record && typeName){
      if( typeName == 'detail'){
        dispatch({
          type: 'loanorder/detailfetch',
          payload: record
        })
      }else if( typeName == 'again'){
        this.showMoadl(record);
      }
    }else{
      dispatch({
        type: 'loanorder/changeModal',
        payload: flag
      })
    }
  }

  /* 再次支付 -  单独显示弹框  */
  showMoadl(record){
    const { dispatch } = this.props;
    const { formValues } = this.state;
    confirm({
      title: '再次支付',
      content: '您确认要再次支付吗？',
      onOk() {
        dispatch({
          type:'loanorder/againfetch',
          payload: record,
          callback: (data)=>{
            if(data.resultCode === 1000) {
              Modal.success({
                title:'操作成功',
                onOk(){
                  dispatch({
                    type:'loanorder/fetch',
                    payload:formValues
                  })
                }
              })
            }else{
              Modal.error({
                title:'操作失败'
              })
            }
          }
        })

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
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
        idNo:values.idNo?values.idNo.trim():undefined,
        statusStr:values.statusStr||undefined };
      if(values.borrowTime && values.borrowTime.length != 0){
    	  jsonParams.startTime = values.borrowTime[0].format('YYYY-MM-DD 00:00:00').toString();
          jsonParams.endTime = values.borrowTime[1].format('YYYY-MM-DD 00:00:00').toString()
      }
      console.log(JSON.stringify(jsonParams));
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'loanorder/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
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

  /*TODO: 生成条件查询表单 ,参数是：无 */
  renderAdvancedForm() {
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
                <Input placeholder="请输入"  maxLength={11} style={{ width: '80%' }} />
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
          <Col md={10} sm={24}>
            <FormItem label="放款时间">
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
                <Input placeholder="请输入"  maxLength={18} style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="放款状态">
              {getFieldDecorator('statusStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  <Option value="待放款">待放款</Option>
                  <Option value="放款中">放款中</Option>
                  <Option value="放款成功">放款成功</Option>
                  <Option value="放款失败">放款失败</Option>
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

  render() {
    const { loanorder: { loading, data, modal, loanorderdetail} ,  dispatch } = this.props;
    const { selectedRows } = this.state;
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
        title: '放款状态',
        dataIndex: 'statusStr',
      },
      {
        title: '身份证号',
        dataIndex: 'idNo',
      },
      {
        title: '放款金额',
        dataIndex: 'loanValue',
      },
      {
        title: '放款时间',
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
        title: '放款记录',
        dataIndex: 'operate1',
        render: (text, record) => {
          let dataOrderId = record.orderId;
          return (
            <div>
              <a onClick={() => this.handleModalVisible(true, dataOrderId, 'detail')}>详情</a>
            </div>
          )},
      },
      {
        title: '操作',
        dataIndex: 'operate2',
        render: (text,record) => {
          let dataOrderId = record.orderId;
          return (
            <div>
              { record.statusStr === "放款失败"? <a onClick={() => this.handleModalVisible(true, dataOrderId, 'again')}>再次支付</a>:"-"}
            </div>
          )},
      },
    ];
    return (
      <PageHeaderLayout title="放款订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <div className={styles.tableListOperator}>
            {
            selectedRows.length > 0 && (
            <span>
            <Button onClick={()=>{console.log('批量放款没开发')}}>批量放款</Button>
            </span>
            )
            }
            </div>
            <StandardTable
              columns = { columns }
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowSelectionEdit = { true }
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="放款详情"
          visible={modal}
          onCancel={() => this.handleModalVisible()}
          width={900}
          footer = {[
            <Button type="primary" onClick={()=>this.handleModalVisible()}>返回</Button>
          ]}
        >
          <TableDetail data={loanorderdetail} pagination={false}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
