/*
 * 组件名称：有米租赁管理
 * 功能：列表的查询，
 * model: order_borrow
 * api: ordermanage
 *
 *  */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
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
  Tabs,
  Table,
  Checkbox
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import YouMiBorrowDetail from '../../components/OrderManage/YouMiBorrowDetail';
import YouMiLeaseDetail from '../../components/OrderManage/YouMiLeaseDetail';
import BorrowDetailList from '../../components/OrderManage/YouMiBorrowDetailList';
import TableDetail from '../../components/OrderManage/RepayDetail';
import FangkuanTable from '../../components/OrderManage/LoanDetail';
import Detail from '../../components/UserInfoList/Detail';
import request from '../../utils/request';
import styles from './LeaseList.less';
import {
  routeAgainAudit,
  batchAudit,
  routeRefuseAudit,
  batchRefuseAudit,
  orderListExport
} from '../../services/leaseListManage.js';
import {auditQuery, orderAuthUnPass, orderAuthPass} from '../../services/ordermanage';
import {queryRepayDetail} from '../../services/repayOrderManage';


const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const {Option} = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  borroworder: state.borroworder,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    selectedRowKeys: [],
    batchAduit: [],
    checked: true,
    isAgain: '',
    unfoldCount: '',
    disabled: false,
    selectOrderIds: [],
    userinfo: [],
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
    modal: false,
    loanorderdetail: [],
    repaydetail: [],
    userDetail: [],
    recordData: '', //弹框 - 用户的信息
    type: 'records',//弹框的tab初始值

    productDetails: [{}, {}],
    productDetailsVisible: false,

    manualCheckVisible: false,
    manualCheckLoanValue: '',
    manualCheckName: '',
    manualCheckOrderId: '',
  };

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'borroworder/navfetch',//获取订单状态枚举数据
      payload: ''
    })
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'borroworder/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
  }

  exportData = (e) => {
    e.preventDefault();
    orderListExport({
      searchParams: this.state.formValues.searchParams
    });
  }

  //查询审核结果 即刷新
  auditQuery = () => {
    const {dispatch} = this.props;
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
    const {dispatch} = this.props;
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
    dispatch({
      type: 'borroworder/fetch',
      payload: params,
    });
  }

  //查看放款记录
  queryLoanDetail(params) {
    return request(`/modules/manage/biz/order/loanDetail.htm?orderId=${params}`)
  }

  //查看用户详情
  queryUserInfoDetail(params) {
    return request(`/modules/manage/user/detail.htm?currentPage=${params.currentPage}&pageSize=${params.pageSize}&userId=${params.userId}&orderId=${params.orderId}`);
  }

  /*TODO: 弹框的显示与隐藏 - 查看订单详情 - 传递数据[orderId]*/
  handleModalVisible = (e, flag = false, record = '', userId = '') => {
    const {dispatch} = this.props;
    const {type} = this.state;

    this.setState({
      recordData: record,
      type: 'records',
      modal: true
    });
    if (flag && record != '') {
      dispatch({
        type: 'borroworder/youmimodalrecordfetch',
        payload: record

      });
      //查看还款计划
      dispatch({
        type: 'borroworder/modallistfetch',
        payload: record
      })

    } else {
      // dispatch({
      //   type: 'borroworder/changeModal',
      //   payload: false
      // });
    }
    //查看还款详情
    queryRepayDetail(record).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          repaydetail: res.resultData
        });
      }
    });
    //查看放款记录详情
    this.queryLoanDetail(record).then(rep => {
      this.setState({
        loanorderdetail: rep.resultData
      })
    })
    //查看用户详情
    let params = {
      userId: userId,
      orderId: record,
      currentPage: 1,
      pageSize: 10,
    }
    this.queryUserInfoDetail(params).then(rep => {
      this.setState({
        userinfo: rep.resultData
      })
    })
    /* TODO:  订单详情底部审核按钮的显示与隐藏 --  */
    var adopt = document.getElementById("adopt");
    var noAdopt = document.getElementById("noAdopt");
    var len = e.target.parentNode.parentNode.parentNode.childNodes.length;
    if (e.target.parentNode.parentNode.parentNode.childNodes[len - 2].innerHTML == "自动审核未决待人工复审") {
      if (adopt != null && noAdopt != null) {
        adopt.style.display = "none";
        noAdopt.style.display = "none";
      } else {
        console.log(adopt);
        console.log(noAdopt);
      }
    } else if (adopt == null && noAdopt == null) {
      console.log(adopt);
      console.log(noAdopt);
    } else {
      adopt.style.display = "none";
      noAdopt.style.display = "none";
    }
  }


  //商品详情
  productDetails = (orderId, userId, currentPage = 1, pageSize = 10) => {
    let params = `currentPage=${currentPage}&pageSize=${pageSize}&userId=${userId}&orderId=${orderId}`
    request('/modules/manage/orderGoods/orderGoodsDetail.htm?' + params, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          productDetails: res.resultData,
          productDetailsVisible: true
        })
      }
    })
  }

  //人工审核按钮
  auditPassOrUnpass = (t, r) => {
    this.setState({
      manualCheckVisible: true,
      manualCheckLoanValue: r.loanValue,
      manualCheckName: r.name,
      manualCheckOrderId: r.orderId,
    })
    // let that = this;
    // Modal.confirm({
    //   title: '人工审核',
    //   content: '人工审核是否通过',
    //   onOk() {
    //     orderAuthPass({orderId: orderId, isPass: true}).then(res => {
    //       if (res.resultCode === 1000) {
    //         message.success("操作成功!", 3, () => {
    //           that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
    //         });
    //       }
    //     });
    //   },
    //   onCancel() {
    //     orderAuthPass({orderId: orderId, isPass: false}).then(res => {
    //       if (res.resultCode === 1000) {
    //         message.success("操作成功!", 3, () => {
    //           that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
    //         });
    //       }
    //     });
    //   }
    // });
  }
  //人工审核取消
  manualCheckCancel = () => {
    this.setState({
      manualCheckVisible: false,
      manualCheckLoanValue: '',
      manualCheckName: '',
      manualCheckOrderId: '',
    })
  }

  //人工审核通过
  onCheckOk = (orderId) => {
        orderAuthPass({orderId: orderId, isPass: true}).then(res => {
          if (res.resultCode === 1000) {
            message.success("操作成功!", 3, () => {
              this.setState({
                manualCheckVisible: false,
                manualCheckLoanValue: '',
                manualCheckName: '',
                manualCheckOrderId: '',
              })
              this.handleStandardTableChange({...this.state.formValues, current: this.state.formValues.currentPage});
            });
          }
        });
      }
//人工审核不通过
    onCheckCancel = (orderId) => {
      orderAuthPass({orderId: orderId, isPass: false}).then(res => {
        if (res.resultCode === 1000) {
          message.success("操作成功!", 3, () => {
            this.setState({
              manualCheckVisible: false,
              manualCheckLoanValue: '',
              manualCheckName: '',
              manualCheckOrderId: '',
            })
            this.handleStandardTableChange({...this.state.formValues, current: this.state.formValues.currentPage});
          });
        }
      });
    }


  /* TODO:  表格通过按钮 --  */
  auditPass(orderId) {
    let that = this;
    Modal.confirm({
      title: '重新自动审核',
      content: '是否重新自动审核',
      onOk() {
        routeAgainAudit(orderId).then(res => {
          if (res.resultCode === 1000) {
            message.success("操作成功!", 3, () => {
              that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
            });
          }
        });
      },
      onCancel() {
      }
    });
  }

  /* TODO:  表格通过按钮 --  */
  auditNotPass(orderId) {
    let that = this;
    Modal.confirm({
      title: '租赁订单审核',
      content: '确定要拒绝此租赁订单吗？',
      onOk() {
        routeRefuseAudit(orderId).then(res => {
          if (res.resultCode === 1000) {
            message.success("操作成功!", 3, () => {
              that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
            });
          }
        });
      },
      onCancel() {
      }
    });
  }

  /* TODO:  表格通过按钮 --  */
  adopt = (orderId) => {
    var {dispatch} = this.props;
    var _this = this;
    Modal.confirm({
      title: '租赁订单审核',
      content: '确定要通过此租赁订单吗？',
      onOk() {
        dispatch({
          type: 'borroworder/authPass',
          payload: {orderId: orderId, tz: _this}
        })
      },
      onCancel() {
      }
    });
  }


  /* TODO:  表格不通过按钮 --  */
  noAdopt = (orderId) => {
    var {dispatch} = this.props;
    var _this = this;
    Modal.confirm({
      title: '租赁订单审核',
      content: `确定拒绝此租赁订单吗？`,
      onOk() {
        dispatch({
          type: 'borroworder/authUnPass',
          payload: {orderId: orderId, tz: _this}
        })
      },
      onCancel() {
      }
    });
  }


  /* TODO:  Tab标签的切换事件 --  */
  onSwitch = (key) => {
    var {dispatch} = this.props;
    var {recordData} = this.state;
    this.setState({
      type: key,
    });
    // if (key === 'records') {
    //   // dispatch({
    //   //   type: 'borroworder/youmimodalrecordfetch',
    //   //   payload: recordData
    //   // })
    // } else if (key === 'lease') {
    //   // dispatch({
    //   //   type: 'borroworder/youmileasemodalrecordfetch',
    //   //   payload: recordData
    //   // })
    // } else {
    //   // dispatch({
    //   //   type: 'borroworder/modallistfetch',
    //   //   payload: recordData
    //   // })
    // }
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const {form} = this.props;
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
    e && e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = {
        phone: values.phone ? values.phone.trim() : undefined,
        name: values.realName ? values.realName.trim() : undefined,
        idNo: values.idNo ? values.idNo.trim() : undefined,
        statusStr: values.statusStr || undefined,
        isAgain: values.isAgain || undefined,
        // unfoldCount: values.unfoldCount || undefined
      };

      if (values.borrowTime && values.borrowTime.length != 0) {
        jsonParams.startTime = values.borrowTime[0].format('YYYY-MM-DD 00:00:00').toString();
        jsonParams.endTime = values.borrowTime[1].format('YYYY-MM-DD 23:59:59').toString()
      }
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'borroworder/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      });
    });
  }

  /*TODO: 生成条件查询表单 ,参数是：渠道订单状态枚举数据 select的下拉选项 */
  renderAdvancedForm(params) {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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
                <Input placeholder="请输入" maxLength='11' style={{width: '80%'}}/>
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
          <Col md={10} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('borrowTime')(
                <RangePicker style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="复贷">
              {getFieldDecorator('isAgain')(
                <Select style={{width: 100}} placeholder="请选择" onChange={this.queryIsAgain.bind(this)}>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}

            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
                <Input style={{width: '80%'}} maxLength='18' placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('statusStr')(
                <Select placeholder="请选择" style={{width: '80%'}}>
                  {params}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>


          <Col md={12} sm={24}>
             <span style={{float: 'center', marginBottom: 24}}>
                <Button type="primary" htmlType="submit" style={{marginRight: 16}}>查询</Button>
                <Button onClick={this.handleFormReset}>重置</Button>
                <Button style={{marginLeft: 16}} type={'primary '}
                        onClick={this.exportData.bind(this)}>导出为EXCEL</Button>
                <Button style={{marginLeft: 16}} type={'primary '} onClick={this.batchAduit.bind(this)}>批量审核</Button>
               {/* <Button style={{marginLeft: 16}} type={'primary '}
                        onClick={this.batchAduitNoPass.bind(this)}>批量驳回</Button> */}
              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  batchAduitNoPass() {
    let that = this;
    if (this.state.selectOrderIds.length == 0) {
      message.info("请选择欲审核的订单!");
      return;
    }
    Modal.confirm({
      title: '租赁订单审核',
      content: '确定要拒绝选中租赁订单吗？',
      onOk() {
        batchRefuseAudit(that.state.selectOrderIds).then(res => {
          if (res.resultCode === 1000) {
            message.success("操作成功!", 3, () => {
              that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
            });
          }
        });
      },
      onCancel() {
      }
    });
  }

  batchAduit() {
    let that = this;
    if (this.state.selectOrderIds.length == 0) {
      message.info("请选择欲审核的订单!");
      return;
    }
    Modal.confirm({
      title: '租赁订单审核',
      content: '确定要通过选中租赁订单吗？',
      onOk() {
        batchAudit(that.state.selectOrderIds).then(res => {
          if (res.resultCode === 1000) {
            message.success("操作成功!", 3, () => {
              that.handleStandardTableChange({...that.state.formValues, current: that.state.formValues.currentPage});
            });
          }
        });
      },
      onCancel() {
      }
    });
  }

  queryIsAgain(is_again) {
    this.setState({
      isAgain: is_again
    });
  }

  unfoldCount(unfoldCount) {
    this.setState({
      unfoldCount: unfoldCount
    });
  }

  onSelectChange = (sks, srs) => {
    this.state.selectOrderIds = [];
    let orderId = [];
    srs.map(e => {
      orderId.push(e.orderId);
    });
    this.setState({
      selectOrderIds: orderId
    });
  }

  //UI组件显示
  render() {
    // console.log('borroworder',JSON.stringify(this.props.borroworder.data));
    const {borroworder: {statusnav, loading, data, modal, modalrecord, modaldetail, modallist, limitData}, dispatch} = this.props;
    const {type} = this.state;
    const OptionList = statusnav.length ? statusnav.map((item) => <Option key={item}>{item}</Option>) : [];
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      onChange: this.onSelectChange.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
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
        title: '贷款时间',
        dataIndex: 'createTime',
      },
      // {
      //   title: '租赁设备型号',
      //   dataIndex: 'modelName',
      // },
      {
        title: '贷款金额',
        dataIndex: 'loanValue',
      },
      {
        title: '贷款期限(天)',
        dataIndex: 'peroidValue',
      },
      // {
      //     title: '审核渠道',
      //     dataIndex: 'checkChannel',
      // },
      // {
      //     title: '机审结果',
      //     dataIndex: 'auditResultStr',
      // },
      {
        title: '状态',
        dataIndex: 'statusStr',
      },
      {
        title: '是否复贷',
        dataIndex: 'isAgain',
        render: (text, record, index) => {
          return text == 1 ? '是' : '否';
        }
      },
      // {
      //  title: '展期次数/展期到期时间',
      //   render: (record, index) => {
      //     const unfoldCount = record.unfoldCount;
      //     const dueRepayTime = record.dueRepayTime;
      //     if(unfoldCount){
      //       return(
      //         <div>
      //             <span>{unfoldCount+'/'+dueRepayTime}</span>
      //         </div>
      //       )
      //     }else{
      //       return null
      //     }
      //
      //   }
      // },
      {
        title: '操作',
        render: (text, record) => {
          var orderId = record.orderId;
          var orderStatus = record.status;
          const userId = record.userId;
          if (orderStatus === 25) {
            return (
              <div>
                <a onClick={(e) => this.handleModalVisible(e, true, orderId, userId)} style={{marginRight: 16}}>查看详情</a>
                <a onClick={() => this.auditPassOrUnpass(text,  record)} style={{marginRight: 16}}>人工审核</a>
              </div>
            )
          } else if (orderStatus === 50 ||
            orderStatus === 60 ||
            orderStatus === 70) {
            return (
              <div>
                {/* <a onClick={() => this.auditNotPass(orderId)}>驳回审核</a> */}
                <a onClick={(e) => this.handleModalVisible(e, true, orderId, userId)} style={{marginRight: 16}}>查看详情</a>
                <a onClick={() => this.productDetails(orderId, userId)} style={{marginRight: 16}}>商品详情</a>
              </div>
            )
          } else if (orderStatus === 10) {
            return (
              <div>

                {/* <a onClick={() => this.auditNotPass(orderId)}>驳回审核</a> */}
                <a onClick={(e) => this.handleModalVisible(e, true, orderId, userId)} style={{marginRight: 16}}>查看详情</a>
                <a onClick={() => this.auditPass(orderId)} style={{marginRight: 16}}>自动审核</a>
              </div>
            )
          } else if (orderStatus === 19) {
            return (
              <div>
                <a onClick={() => this.auditQuery()}>查询审核结果</a>
                <a onClick={(e) => this.handleModalVisible(e, true, orderId, userId)} style={{marginRight: 16}}>查看详情</a>
              </div>
            )
          } else {
            return (
              <div>
                <a onClick={(e) => this.handleModalVisible(e, true, orderId, userId)} style={{marginRight: 16}}>查看详情</a>
              </div>
            )
          }
        },
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <PageHeaderLayout title="借款订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm(OptionList)}
            </div>
            <Table
              style={{marginTop: 30}}
              loading={loading}
              bordered
              rowKey={record => record.key}
              rowSelection={rowSelection}
              dataSource={data.list}
              columns={columns}
              pagination={data.pagination}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="订单详情"
          visible={this.state.modal}
          onCancel={() => this.setState({modal: false})}
          width={1200}
          bodyStyle={{height: '640px', overflowY: 'auto'}}
          footer={[
            <Button key="back1" type="primary" style={{display: "none"}} id="adopt"
                    onClick={() => this.adopt(this.props.borroworder.data.list[0].orderId)}>审核通过</Button>,
            <Button key="back2" type="primary" style={{display: "none"}} id="noAdopt"
                    onClick={() => this.noAdopt(this.props.borroworder.data.list[0].orderId)}>审核不通过</Button>,
            <Button key="back3" type="primary" onClick={() => this.setState({modal: false})}>返回</Button>,
          ]}
        >
          {modal && <Tabs activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="客户信息" key="records">
              <Detail {...this.state.userinfo} />
            </TabPane>
            <TabPane tab="放款记录" key="lease">
              <FangkuanTable data={this.state.loanorderdetail} pagination={false}/>
            </TabPane>
            <TabPane tab="还款计划" key="repayment">
              <h3>还款计划</h3>
              <BorrowDetailList data={modallist} pagination={false}/>
              <h3>还款详情</h3>
              <TableDetail data={this.state.repaydetail} pagination={false}/>
            </TabPane>
          </Tabs>}
        </Modal>
        <Modal visible={this.state.productDetailsVisible}
               onCancel={() => this.setState({productDetailsVisible: false})}
               footer={null}
               className={styles.details}
               bodyStyle={{overflowY: 'auto'}}
        >
          <Tabs defaultActiveKey={'0'} onChange={this.onSwitch}>
            {
              this.state.productDetails.map((p, index) => {
                return <TabPane tab={`商品${index + 1}详情`} key={index}>
                  <Form layout={'inline'}>
                    <Row gutter={16}>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品订单' {...formItemLayout}>
                        <Input disabled={true} value={p.code}/>
                      </FormItem>
                      </Col>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品名称' {...formItemLayout}>
                        <Input disabled={true} value={p.goodsName}/>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品价格' {...formItemLayout}>
                        <Input disabled={true} value={p.goodsPrice}/>
                      </FormItem>
                      </Col>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品数量' {...formItemLayout}>
                        <Input disabled={true} value={p.goodsNumber}/>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品属性' {...formItemLayout}>
                        <Input disabled={true} value={p.goodSkuName}/>
                      </FormItem>
                      </Col>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='商品状态' {...formItemLayout}>
                        <Input disabled={true} value={p.transportStatus === -1 ? '待确认':p.transportStatus === 0 ? '待发货' : p.transportStatus === 1 ? '待收货' : p.transportStatus === 2 ? '确认收货' : p.transportStatus === 3 ? '拒绝收货' : '退货成功'}/>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='物流公司' {...formItemLayout}>
                        <Input disabled={true} value={p.transportCom}/>
                      </FormItem>
                      </Col>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='物流单号' {...formItemLayout}>
                        <Input disabled={true} value={p.transportNo}/>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={{ span: 10, offset: 1 }} lg={{ span: 10, offset: 1 }}>
                      <FormItem label='更新时间' {...formItemLayout}>
                        <Input disabled={true} value={p.updateTime}/>
                      </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={{ span: 22, offset: 1 }} lg={{ span: 22, offset: 1 }}>
                        <FormItem label='商品图片' {...formItemLayout}>
                        <div>
                          <img src={p.goodImgUrl} alt="" style={{display: 'inline-block', width: 100, height : 100}}/>
                        </div>
                        </FormItem>
                      </Col>
                    </Row>





                  </Form>

                </TabPane>
              })
            }
          </Tabs>
        </Modal>
        <Modal visible={this.state.manualCheckVisible}
               title='人工审核'
               centered={true}
               onCancel={this.manualCheckCancel.bind(this)}
               footer = {null}
        >
          <h3>姓名:{this.state.manualCheckName}</h3>
          <h3>金额:{this.state.manualCheckLoanValue}</h3>
          <Button type='primary'  onClick={ this.onCheckOk.bind(this, this.state.manualCheckOrderId)}>通过</Button>
          <Button style={{marginLeft: 20}} onClick={ this.onCheckCancel.bind(this, this.state.manualCheckOrderId)}>不通过</Button>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
