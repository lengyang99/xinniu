/*
 * 组件名称：有米放款订单
 * 功能：列表的查询，
 * model: order_borrow
 * api: ordermanage
 *
 *  */
import React, {PureComponent} from 'react';
import {
  Table,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Spin
} from 'antd';
import TableDetail from '../../components/OrderManage/RepayDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import request from '../../utils/request';

import {
  queryRepayOrder,
  repayOrderExport,
  queryRepayDetail,
  actionOfflineRepay,
  actionPartRepay,
  queryRepayPlayByOrderId,
  actionDerateRepay,
  actionOptRepay
} from '../../services/repayOrderManage';
import {repayDataAmount} from '../../services/repayRecordmanage';
import {bizStatusEnum, auditorList} from '../../services/commonManage';

import moment from 'moment';

import styles from './LeaseList.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@Form.create()
export default class TableList extends PureComponent {
  state = {
    data: [],
    pg: {},
    selectedRows: [],
    table_loading: false,
    detail_model_visible: false,
    offline_model_visible: false,
    part_repay_model_visible: false,
    derate_model_visible: false,
    opt_model_visible: false,
    derate_amount: '',
    derate_record: {},
    surplus_offline: 0,
    offline_record: {},
    offline_amount: '',
    part_repay_record: {},
    part_repay_amount: '',
    repay_pay_record: {},
    biz_repay_plan_record: {},
    due_amount: '',
    due_principal: '',
    due_service_fee: '',
    due_interest: '',
    due_auth_fee: '',
    due_penalty: '',
    surplus_interest: '',
    surplus_overdue_fee: '',
    surplus_depreciation_fee: '',
    surplus_total: '',
    repaydetail: [],
    statusEnum: [],
    channelEnum: [],
    todayAmount: 0,
    allAmount: 0,
    isAgain: '',
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
  };

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10});
    this.getBizStatusEnum();
    this.getChannelEnum();
    this.getAmount();
  }

  getAmount() {
    repayDataAmount().then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          todayAmount: res.resultData.todayAmount,
          allAmount: res.resultData.allAmount
        });
      }
    });
  }

  getBizStatusEnum() {
    bizStatusEnum(5).then(res => {
      this.setState({
        statusEnum: res.resultData
      });
    });
  }

  getChannelEnum() {
    auditorList().then(res => {
      this.setState({
        channelEnum: res.resultData
      });
    });
  }

  exportData() {
    repayOrderExport({
      searchParams: this.state.formValues.searchParams
    });
  }

  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChange = (pagination) => {
    const {formValues} = this.state;
    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues: {
        ...params
      }
    });
    queryRepayOrder(params).then(res => {
      this.setState({
        data: res.resultData,
        pg: res.page
      });
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 查看订单交租详情 - 传递数据[orderId , 事件类型 ]*/
  handleModalVisible = (id) => {
    id && queryRepayDetail(id).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          detail_model_visible: true,
          repaydetail: res.resultData
        });
      }
    });
    !id && this.setState({
      detail_model_visible: false
    });
  }
  //获取线下还款金额信息
  getTotal(id){
    let paramsStr = `orderId=${id}`;
    return request('/modules/manage/repay/getRepayPlayByOrderId.htm',{
      method: 'POST',
      body: paramsStr
    })
  }

  /* 再次支付 -  单独显示弹框  */
  handleOfflineModel(record) {
    // console.log('xxxxxxxxxxxxxxxxxxxxxx',JSON.stringify(record));
    if(record){
      let orderId = record.id;
      this.getTotal(orderId).then(rep=>{
        // console.log('xxxxxxxxxxx',JSON.stringify(rep.resultData));
        this.setState({
          offline_model_visible: true,
          offline_record: rep.resultData,
          offline_amount:''
        })
      })
    }else{
      this.setState({
            offline_model_visible: false
          });
    }

    // if (record) {
    //   this.setState({
    //     offline_amount: '',
    //     offline_record: record,
    //     offline_model_visible: true
    //   });
    // } else {
    //   this.setState({
    //     offline_model_visible: false
    //   });
    // }
  }


  /*部分还款*/
  handlePartRepayModel(record) {
    if (record) {
      this.setState({
        surplus_interest: '',
        surplus_overdue_fee: '',
        surplus_depreciation_fee: '',
        surplus_total: '',
        part_repay_amount: '',
        part_repay_model_visible: true
      });
      this.queryRepayPlan(record);
    } else {
      this.setState({
        part_repay_model_visible: false
      });
    }
  }


  /*息费减免还款*/
  handleDerateRepayModel(record) {
    if (record) {
      this.setState({
        derate_amount: '',
        surplus_offline: 0,
        derate_model_visible: true
      });
      this.queryRepayPlan(record);
    } else {
      this.setState({
        derate_model_visible: false
      });
    }
  }

  handleOfflineAmountChange(v) {
    this.setState({
      offline_amount: v
    });

  }

  handleDerateAmountChange(v) {
    if(v !== undefined){
      this.setState({
        derate_amount: v,
        surplus_offline:( this.state.due_amount - v).toFixed(2)
      });
    }

  }

  /*查询还款计划*/
  queryRepayPlan(record) {
    let orderId = record.id;
    this.getTotal(orderId).then(res=>{
      if (res.resultCode === 1000) {
            this.setState({
              biz_repay_plan_record: res.resultData,
              due_amount: res.resultData.totalAmount,
              due_principal: res.resultData.principal,
              due_interest: res.resultData.interest,
              due_penalty: res.resultData.penalty
            })
          } else {
            message.error(res.resultMessage);
          }
    })
    // queryRepayPlayByOrderId({
    //   orderId: record.id
    // }).then(res => {
    //   if (res.resultCode === 1000) {
    //     this.setState({
    //       biz_repay_plan_record: res.resultData,
    //       due_amount: res.resultData.dueAmount,
    //       due_principal: res.resultData.duePrincipal,
    //       due_service_fee: res.resultData.dueServiceFee,
    //       due_interest: res.resultData.dueInterest,
    //       due_auth_fee: res.resultData.dueAuthFee,
    //       due_penalty: res.resultData.duePenalty
    //     })
    //   } else {
    //     message.error(res.resultMessage);
    //   }
    // });
  }

  handleActionDerateRepayOk() {
    if (!this.state.derate_amount) {
      message.info("请填写减免金额!");
      return;
    }
    if (this.state.surplus_offline < 0) {
      message.info("减免金额不能大于需交款金额");
      return;
    }
    actionDerateRepay({
      orderId: this.state.biz_repay_plan_record.orderId,
      amount: this.state.derate_amount
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success("减免还款成功");
        this.handleDerateRepayModel();
        this.handleStandardTableChange({
          current: this.state.formValues.currentPage,
          pageSize: this.state.formValues.pageSize
        });
      } else {
        message.error(res.resultMessage);
      }
    });
  }

  handleOfflineAmountChange(v) {
    this.setState({
      offline_amount: v
    });
  }

  handleActionOfflineRepayOk() {
    if (!this.state.offline_amount) {
      message.info("请填写线下收款金额!");
      return;
    }
    actionOfflineRepay({
      orderId: this.state.offline_record.orderId,
      amount: this.state.offline_amount
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success("线下还款成功");
        this.handleOfflineModel();
        this.handleStandardTableChange({
          current: this.state.formValues.currentPage,
          pageSize: this.state.formValues.pageSize
        });
      } else {
        message.error(res.resultMessage);
      }
    });
  }

  //部分交租
  handleActionPartRepayOk() {
    if (!this.state.part_repay_amount) {
      message.info("请填写部分交租金额!");
      return;
    }
    if (this.state.surplus_total < 0) {
      message.info("部分交租金额不能大于应还金额!");
      return;
    }
    actionPartRepay({
      orderId: this.state.biz_repay_plan_record.orderId,
      amount: this.state.part_repay_amount
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success("部分还款成功");
        this.handlePartRepayModel();
        this.handleStandardTableChange({
          current: this.state.formValues.currentPage,
          pageSize: this.state.formValues.pageSize
        });
      } else {
        message.error(res.resultMessage);
      }
    });

  }

  //手动代扣
  handleOptRepayModel(record) {
    if (record) {
      this.setState({
        opt_model_visible: true
      });
      this.queryRepayPlan(record);
    } else {
      this.setState({
        opt_model_visible: false
      });
    }

  }

  //发起手动代扣
  handleOptRepayOk(){
    actionOptRepay({
      orderId: this.state.biz_repay_plan_record.orderId,
      amount: this.state.due_amount
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success("手动代扣成功");
      } else {
        //message.info(res.resultMessage);
      }
      this.handleOptRepayModel();
      this.handleStandardTableChange({
        current: this.state.formValues.currentPage,
        pageSize: this.state.formValues.pageSize
      });
    });
  }

  //部分交租金额
  handlePartRepayAmountChange(v) {
    //剩余折旧费
    let surplus_depreciation;
    let surplus_overdue;
    let interest;
    let total;

    //剩余逾期费
    surplus_overdue = this.state.due_penalty - v;
    if (surplus_overdue < 0) {
      //剩余租金
      interest = this.state.due_interest + surplus_overdue;
      surplus_overdue = 0;
      if (interest < 0) {
        //剩余合计
        total = this.state.due_principal + interest;
        interest = 0;
      } else {
        total = this.state.due_amount - v;
      }
    } else {
      interest = this.state.due_interest;
      total = this.state.due_amount - v;
    }
    this.setState({
      part_repay_amount: v,
      surplus_interest: interest.toFixed(2),
      surplus_overdue_fee: surplus_overdue.toFixed(2),
      surplus_total: total.toFixed(2)
    });
  }

  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = {
        phone: values.phone ? values.phone.trim() : undefined,
        name: values.realName ? values.realName.trim() : undefined,
        // idNo: values.idNo ? values.idNo.trim() : undefined,
        statusStr: values.statusStr || undefined,
        isOverdue: values.isAgain || undefined,
        // auditor: values.auditor || undefined
      };
      if (values.repayTime && values.repayTime.length != 0) {
        jsonParams.repayStartTime = values.repayTime[0].format('YYYY-MM-DD 00:00:00').toString();
        jsonParams.repayEndTime = values.repayTime[1].format('YYYY-MM-DD 23:59:59').toString()
      }
      if (values.rentEndTime && values.rentEndTime.length != 0) {
        jsonParams.realRepayStartTime = values.rentEndTime[0].format('YYYY-MM-DD 00:00:00').toString();
        jsonParams.realRepayEndTime = values.rentEndTime[1].format('YYYY-MM-DD 23:59:59').toString()
      }
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      }, () => {
        this.handleStandardTableChange({current: 1, pageSize: 10});
      });

    });
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const {form, dispatch} = this.props;
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={7} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                    len: 11,
                    message: '请输入有效的手机号'
                  }
                ],
                validateTrigger: 'onBlur'
              })(
                <Input placeholder="请输入" maxLength={"11"} style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('realName')(
                <Input placeholder="请输入" style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
          {/* <Col md={7} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idNo', {
                rules: [
                  {
                    pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                    max: 18,
                    min: 15,
                    message: '请输入有效的身份证号'
                  }
                ],
                validateTrigger: 'onBlur'
              })(
                <Input placeholder="请输入" maxLength={18} style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="到期时间">
              {getFieldDecorator('repayTime')(
                <RangePicker style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
          <FormItem label="是否逾期">
            {getFieldDecorator('isAgain')(
              <Select style={{width: 100}} placeholder="请选择" onChange={this.queryIsAgain.bind(this)}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}

          </FormItem>
        </Col>

          <Col md={8} sm={24}>
            <FormItem label="实际还款时间">
              {getFieldDecorator('rentEndTime')(
                <RangePicker style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={7} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('statusStr')(
                <Select placeholder="请选择" allowClear={true} style={{width: '80%'}}>
                  {
                    this.state.statusEnum.map(v => {
                      return <Option key={v.key} value={v.value}>{v.value}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col md={7} sm={24}>
            <FormItem label="审核渠道">
              {getFieldDecorator('auditor')(
                <Select placeholder="请选择" allowClear={true} style={{width: '80%'}}>
                  {
                    this.state.channelEnum.map(v => {
                      return <Option key={v.id} value={v.code}>{v.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={10} sm={24}>
             <span style={{float: 'center', marginBottom: 24}}>
                <Button type="primary" htmlType="submit" style={{marginRight: 16}}>查询</Button>
                <Button onClick={this.handleFormReset} style={{marginRight: 16}}>重置</Button>
                <Button type="primary" onClick={this.exportData.bind(this)}>导出</Button>
              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  queryIsAgain(is_again) {
	    this.setState({
	      isAgain: is_again
	    });
	  }


  render() {
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
    const columns = [
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      // {
      //     title: '用户ID',
      //     dataIndex: 'userId',
      // },
      {
        title: '用户姓名',
        dataIndex: 'realName',
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
      },
      {
        title: '身份证号',
        dataIndex: 'idNo',
      },
      {
        title: '订单金额',
        dataIndex: 'amount',
      },
      // {
      //   title: '买断金额',
      //   dataIndex: 'dueAmount',
      // },
      {
        title: '期限',
        dataIndex: 'peroidValue',
      },
      {
        title: '放款时间',
        dataIndex: 'loanTime',
        render: (text) => {
          return text == null ? "" : moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '到期时间',
        dataIndex: 'rentEndTime',
        render: (text) => {
          return text == null ? "" : moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '是否逾期',
        render: (record)=>{
          return <span>{record.isOverdue == 1?'是':'否'}</span>
        }
      },
      // {
      //     title: '实际还款时间',
      //     dataIndex: 'repayTime',
      //     render: (text) => {
      //       return text == null ? "" : moment(text).format('YYYY-MM-DD');
      //     }
      // },
      {
        title: '状态',
        dataIndex: 'statusStr',
      },
      // {
      //     title: '是否复租',
      //     dataIndex: 'isAgain',
      //     render: (text, record, index) => {
      //       return text == 1 ? '是' : '否';
      //     }
      //   },
      // {
      //   title: '审核渠道',
      //   dataIndex: 'auditor',
      // },
      // {
      //     title: '注册渠道',
      //     dataIndex: 'registerChannel',
      //   },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '还款记录',
        dataIndex: 'operate1',
        render: (text, record) => {
          let id = record.id;
          return (
            <div>
              <a key="detail" onClick={() => this.handleModalVisible(id)}>查看详情</a>
            </div>
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'operate2',
        render: (text, record) => {
          return (
            <div>

              {record.canOfflineRepay === true ? <a onClick={() => this.handleOfflineModel(record)}>线下还款</a> : "-"}
              {/* {record.canOfflineRepay === true ?
                <a style={{marginLeft: 10}} onClick={() => this.handlePartRepayModel(record)}>部分交租</a> : "-"} */}
              {record.canOfflineRepay === true ?
                <a style={{marginLeft: 10}} onClick={() => this.handleDerateRepayModel(record)}>息费减免</a> : "-"}
              {record.canOfflineRepay === true ?
                <a style={{marginLeft: 10}} onClick={() => this.handleOptRepayModel(record)}>手动代扣</a> : "-"}
            </div>
          )
        },

      },
    ];
    return (
      <PageHeaderLayout title="还款订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <Table
              loading={this.state.table_loading}
              bordered
              rowKey={record => record.id}
              dataSource={this.state.data}
              columns={columns}
              pagination={this.state.pg}
              onChange={this.handleStandardTableChange.bind(this)}
            />
          </div>

          <div>

            <span>今日还款总额：{this.state.todayAmount || 0}元，累计还款总额：{this.state.allAmount || 0}元</span>

          </div>

        </Card>
        <Modal
          title="还款详情"
          visible={this.state.detail_model_visible}
          onCancel={() => this.handleModalVisible()}
          width={900}
          footer={[
            <Button key="back" type="primary" onClick={() => this.handleModalVisible()}>返回</Button>
          ]}
        >
          <TableDetail data={this.state.repaydetail} pagination={false}/>
        </Modal>
        <Modal
          title="线下还款"
          visible={this.state.offline_model_visible}
          onCancel={() => this.handleOfflineModel()}
          onOk={() => this.handleActionOfflineRepayOk()}
          width={350}
        >
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <FormItem {...formItemLayout} label={'贷款金额'}>
              <Input disabled={true} value={this.state.offline_record.principal}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'贷款利息'}>
              <Input disabled={true} value={this.state.offline_record.interest}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'逾期利息'}>
              <Input disabled={true} value={this.state.offline_record.penalty}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'合计应交'}>
              <Input disabled={true} value={this.state.offline_record.totalAmount}/>
            </FormItem>
            {/* <FormItem {...formItemLayout} label={'折旧费'}>
              <Input disabled={true} value={this.state.offline_record.depreciationFee}/>
            </FormItem> */}
            <FormItem {...formItemLayout} label={'线下还款'}>
              <InputNumber value={this.state.offline_amount} onChange={this.handleOfflineAmountChange.bind(this)}
                           style={{width: 120}} max={100000}
                           min={0} step={0.01} precision={2}/>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="部分交租"
          visible={this.state.part_repay_model_visible}
          onCancel={() => this.handlePartRepayModel()}
          onOk={() => this.handleActionPartRepayOk()}
          width={500}
        >
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <Row gutter={16}>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'设备本金'}>
                  <Input disabled={true} value={this.state.due_principal}/>
                </FormItem>
              </Col>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'部分交租'}>
                  <InputNumber value={this.state.part_repay_amount} style={{marginLeft: 20}}
                               onChange={this.handlePartRepayAmountChange.bind(this)}
                               max={100000} min={0} step={0.01} precision={2}/>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'应交租金'}>
                  <Input disabled={true} value={this.state.due_interest}/>
                </FormItem>
              </Col>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'剩余租金'}>
                  <Input style={{marginLeft: 20}} disabled={true} value={this.state.surplus_interest}/>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'逾期费'}>
                  <Input disabled={true} value={this.state.due_penalty}/>
                </FormItem>
              </Col>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'剩余逾期费'}>
                  <Input style={{marginLeft: 20}} disabled={true} value={this.state.surplus_overdue_fee}/>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'合计应交'}>
                  <Input disabled={true} value={this.state.due_amount}/>
                </FormItem>
              </Col>
              <Col xs={{span: 8, offset: 2}} lg={{span: 8, offset: 2}}>
                <FormItem {...formItemLayout} label={'剩余合计'}>
                  <Input style={{marginLeft: 20}} disabled={true} value={this.state.surplus_total}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title="息费减免"
          visible={this.state.derate_model_visible}
          onCancel={() => this.handleDerateRepayModel()}
          onOk={() => this.handleActionDerateRepayOk()}
          width={350}
        >
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <FormItem {...formItemLayout} label={'贷款金额'}>
              <Input disabled={true} value={this.state.due_principal}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'贷款利息'}>
              <Input disabled={true} value={this.state.due_interest}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'逾期利息'}>
              <Input disabled={true} value={this.state.due_penalty}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'合计应交'}>
              <Input disabled={true} value={this.state.due_amount}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'息费减免'}>
              <InputNumber value={this.state.derate_amount} onChange={this.handleDerateAmountChange.bind(this)}
                           style={{width: 120}} max={100000} min={0} step={0.01} precision={2}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'线下还款'}>
              <InputNumber disabled={true} value={this.state.surplus_offline} style={{width: 120}}/>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="手动代扣"
          visible={this.state.opt_model_visible}
          onCancel={() => this.handleOptRepayModel()}
          onOk={() => this.handleOptRepayOk()}
          width={350}
        >
          <h3 style={{textAlign:'center'}}>是否发起手动代扣{this.state.due_amount}元</h3>
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <FormItem {...formItemLayout} label={'贷款金额'}>
              <Input disabled={true} value={this.state.due_principal}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'贷款利息'}>
              <Input disabled={true} value={this.state.due_interest}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'逾期费'}>
              <Input disabled={true} value={this.state.due_penalty}/>
            </FormItem>
            <FormItem {...formItemLayout} label={'合计应交'}>
              <Input disabled={true} value={this.state.due_amount}/>
            </FormItem>
          </Form>
        </Modal>

      </PageHeaderLayout>
    );
  }
}
