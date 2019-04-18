/*
 * 组件名称：分期产品列表
 * 功能：列表的查询，
 * model: staging_productlist
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
  Checkbox,
  Tooltip
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ProductDetail from '../../components/StagingProduct/ProductDetail';
import ProductTable from '../../components/StagingProduct/ProductTable';

import styles from './ProductList.less';

import {
  querySaveProd,
  queryUpdateProd,
  queryUpdateState,
  queryPeriodValueList

} from '../../services/stagingproduct';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const {Option} = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const confirm = Modal.confirm;

@connect(state => ({
  productlist: state.productlist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modal: false,

    recordData: '',
    activeKey: '0',
    dataDetail: {},
    interestData: [], //利息
    payData: [], //支付信审费
    accoutData: [], //账户管理费
    penaltyData: [], //罚息,
    feeType: '1', //1是元2是%

    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },


    id: '',
    state: '',

    periodValueList: [7, 15, 30],

    //新增
    modalAddVisible: false,
    modalAddId: '',
    modalAddName: '',
    modalAddPeriodValue: '',
    modalAddAuditFee: '',
    modalAddDailyRent: '',
    modalAddManagementFee: '',
    modalAddServiceCharge: '',
    modalAddDepreciationCost: '',
    modalAddCreditPoints: '',
    modalAddGoodsFee: '',
    modalAddPenaltyRate: '',
    modalAddPenaltyFee: '',
    modalAddPeroidUnit: '',
    addIsDefault: false,


    // modalAddDailyRentDis:'',

    //修改
    beforeEditData:{},
    modalEditVisible: false,
    modalEditId: '',
    modalEditName: '',
    modalEditPeriodValue: '',
    modalEditAuditFee: '',
    modalEditDailyRent: '',
    modalEditManagementFee: '',
    modalEditServiceCharge: '',
    modalEditDepreciationCost: '',
    modalEditCreditPoints: '',
    modalEditGoodsFee: '',
    modalEditPenaltyRate: '',
    modalEditPenaltyFee: '',
    modalEditPeroidUnit: '',
    editIsDefault: false,
    // modalEditDepreciationCost:'',
    // modalEditDailyRentDis:'',
    ROUTE_AUDIT_SWITCH_loading: false,
    modalEditAmount: ''
  };

  //
  getList() {
    const {dispatch} = this.props;
    // this.getPeriodValueList();
    dispatch({
      type: 'productlist/fetch',
      payload: {
        // pageSize: 10,
        // currentPage: 1,
        // searchParams: ''
      }
    });
  }

  componentDidMount() {
    this.getList()
  }

  isDefault = (ac) => {
    this.setState(ac)
  }


  /*TODO: 弹框的显示与隐藏 - 查看订单详情 - 传递数据[orderId]*/
  handleModalVisible = (flag = false, record = '') => {
    const {dispatch} = this.props;
    if (flag) {
      this.setState({
        modal: flag,
        recordData: record,
      });
      dispatch({
        type: 'productlist/productfetch',
        payload: record.id,
        callback: (result) => {
          this.setState({
            dataDetail: result.resultData,
          })
        }
      })
    } else {
      this.setState({
        modal: flag,
        recordData: '',
        activeKey: '0',
      })
    }
  }

  /* TODO:  Tab标签的切换事件 --  */
  onSwitch = (key) => {
    var {dispatch} = this.props;
    var {recordData} = this.state;
    this.setState({
      activeKey: key,
    });
    if (key === 0) {
      dispatch({
        type: 'productlist/productfetch',
        payload: recordData.id,
        callback: (result) => {
          this.setState({
            dataDetail: result.resultData
          })
        }
      });
    } else {
      let {id, rateVersion} = recordData;
      let params = {
        id,
        rateVersion,
        type: key
      };
      dispatch({
        type: 'productlist/productfeefetch',
        payload: params,
        callback: (result) => {
          this.setData(key, result);
        }
      });
    }
  };

  switchConfigAlive(text, record, index) {
    let that = this;
    that.setState({
      ROUTE_AUDIT_SWITCH_loading: true
    });
    confirm({
      title: '产品开关',
      content: `是否确认${record.state === 1 ? '关闭' : '开启'} [${record.name}] 产品?`,
      onOk() {
        /**改变开关状态**/
        queryUpdateState({
          id: record.id,
          state: record.state === 0 ? 1 : 0,
        }).then(res => {
          if (res.resultCode === 1000) {
            that.setState({
              ROUTE_AUDIT_SWITCH_loading: false
            });
            message.success(`[${record.name}] 产品${record.state === 1 ? '关闭' : '开启'}成功`);
            that.componentDidMount();
          } else {
            message.error('网络错误，请重试')
          }
        });
      },
      onCancel() {
        that.setState({
          ROUTE_AUDIT_SWITCH_loading: false
        });
      }
    });
  }

    //去产品详情页
  toDetails = (id) => {
    this.props.history.push('/staging/product-set/details?code=' + id);
  };

  /**去新增产品页面**/
  toAdd() {

    this.props.history.push('/staging/product-set/add');
  }

  /**去编辑产品页面**/
  toEdit(code) {
    console.log(this.props.history.location.search);
    this.props.history.push('/staging/product-set/edit?code='+code);
  }


  handleModalAddOk() {
    if (!this.state.modalAddName ||
        !this.state.modalAddPeriodValue ||
        !this.state.modalAddPenaltyRate ||
        !this.state.modalAddDailyRent ||
        !this.state.modalAddDepreciationCost ||
        !this.state.modalAddGoodsFee ||
        !this.state.modalAddPenaltyFee ||
        !this.state.modalAddPeroidUnit){
      message.warning('请输入完整信息')
      return
    }
    querySaveProd({
      product: JSON.stringify({
        name: this.state.modalAddName,
        peroidValue: this.state.modalAddPeriodValue,
        //creditAuditFee: this.state.modalAddAuditFee,
        dayRate: this.state.modalAddDailyRent,
        // serviceFee: this.state.modalAddManagementFee,
        penaltyRate: this.state.modalAddPenaltyRate,
        amount: this.state.modalAddDepreciationCost,
        goodsFee: this.state.modalAddGoodsFee,
        penaltyFee: this.state.modalAddPenaltyFee,
        peroidUnit: this.state.modalAddPeroidUnit,
        // creditGrade: this.state.modalAddCreditPoints
        // dailyRentDis:this.state.modalAddDailyRentDis,
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('添加成功');
        this.setState({
          modalAddVisible: false,
          modalAddId: '',
          modalAddName: '',
          modalAddPeriodValue: '',
          modalAddAuditFee: '',
          modalAddDailyRent: '',
          modalAddManagementFee: '',
          modalAddServiceCharge: '',
          modalAddDepreciationCost: '',
          // modalAddCreditPoints: '',
          modalAddGoodsFee: '',
          modalAddPenaltyRate: '',
          modalAddPenaltyFee: '',
          modalAddPeroidUnit: '',
        });
        this.componentDidMount();
      } else {
        message.error('添加失败！' + res.resultmessage);
      }
    });
  }

  handleModalAddCancel() {
    this.setState({
      modalAddVisible: false,
      modalAddId: '',
      modalAddName: '',
      modalAddPeriodValue: '',
      modalAddAuditFee: '',
      modalAddDailyRent: '',
      modalAddManagementFee: '',
      modalAddServiceCharge: '',
      modalAddDepreciationCost: '',
      modalAddCreditPoints: '',
      modalAddGoodsFee: '',
      modalAddPenaltyRate: '',
      modalAddPenaltyFee: '',
      modalAddPeroidUnit: '',
    })
  }

  handleModalEditOk() {
    let state = this.state;
    let record = this.state.beforeEditData
     if (state.modalEditName == record.name &&
        state.modalEditPeriodValue == record.peroidValue &&
        state.modalEditDailyRent == record.dayRate &&
        state.modalEditPenaltyRate == record.penaltyRate &&
        state.modalEditDepreciationCost == record.amount &&
        state.modalEditGoodsFee == record.goodsFee &&
        state.modalEditPenaltyFee == record.penaltyFee &&
        state.modalEditPeroidUnit == record.peroidUnit &&
        state.modalEditCreditPoints == record.creditGrade){
      this.handleModalEditCancel();
      return
    }
    queryUpdateProd({
      product: JSON.stringify({
        // id:this.state.modalEditId,
        prodTypeId: this.state.modalEditId,
        name: this.state.modalEditName,
        peroidValue: this.state.modalEditPeriodValue,
        dayRate: this.state.modalEditDailyRent,
        penaltyRate: this.state.modalEditPenaltyRate,
        amount: this.state.modalEditDepreciationCost,
        goodsFee: this.state.modalEditGoodsFee,
        penaltyFee: this.state.modalEditPenaltyFee,
        peroidUnit: this.state.modalEditPeroidUnit == '天' ? 1 : 2,
        creditGrade: this.state.modalEditCreditPoints
      })
    }).then(res => {
      if (res.resultCode === 1000) {

        message.success('修改成功');
        this.setState({modalEditVisible: false});
        this.getList()
      } else {
        message.error('修改失败！' + res.resultmessage);
      }
    });
  }

  handleModalEditCancel() {
    this.setState({
      modalEditVisible: false
    })
  }

  modalEditDepreciationCostChange = (v) => {
  this.setState({
    modalEditDepreciationCost: v
  })
  }

  searchChannelStatusEdit = (v) => {
    this.setState({
      modalEditPeroidUnit: v
    })
  };

  modalEditGoodsFeeChange = (v) => {
    this.setState({
      modalEditGoodsFee: v
    })
  }

  modalEditPeriodValueChange(e) {
    var reg = /^[0-9,]*$/;
    if (reg.test(e.target.value)) {
      this.setState({
        modalEditPeriodValue: e.target.value
      })
    }
  }

  modalEditCreditPointsChange = (e) => {
  this.setState({
    modalEditCreditPoints: e.target.value.trim()
  })
  }

  modalEditNameChange(e) {
    this.setState({
      modalEditName: e.target.value.trim()
    })
  }

  modalEditAuditFeeChange(v) {
    this.setState({
      modalEditAuditFee: v
    })
  }

  modalEditDailyRentChange(v) {
    this.setState({
      modalEditDailyRent: v
    })
  }
  modalEditPenaltyRateChange = (v) => {
    this.setState({
      modalEditPenaltyRate: v
    })
  }

  modalEditPenaltyFeeChange = (v) => {
    this.setState({
      modalEditPenaltyFee: v
    })
  }

  modalEditManagementFeeChange(v) {
    this.setState({
      modalEditManagementFee: v
    })
  }

  modalEditServiceChargeChange(v) {
    this.setState({
      modalEditServiceCharge: v
    })
  }

  modalEditAmount(v) {
    this.setState({
      modalEditAmount: v
    })
  }

  // modalEditDailyRentDisChange(v) {
  //     this.setState({
  //     	modalEditDailyRentDis: v
  //     })
  //   }


  searchChannelStatus = (v) => {
    this.setState({
      modalAddPeroidUnit: v
    })
  };

  modalAddPeriodValueChange(e) {
    var reg = /^[0-9,]*$/;
    if (reg.test(e.target.value)) {
      this.setState({
        modalAddPeriodValue: e.target.value
      })
    }
  }

  modalAddNameChange(e) {
    this.setState({
      modalAddName: e.target.value
    })
  }

  modalAddIdChange(e) {
    this.setState({
      modalAddId: e.target.value
    })
  }

  modalAddCreditPointsChange(e) {
    this.setState({
      modalAddCreditPoints: e.target.value
    })
  }

  modalAddDailyRentChange(v) {
    this.setState({
      modalAddDailyRent: v
    })
  }

  modalAddGoodsFeeChange(v) {
    this.setState({
      modalAddGoodsFee: v
    })
  }

  modalAddPenaltyRateChange(v) {
    this.setState({
      modalAddPenaltyRate: v
    })
  }

  modalAddDepreciationCostChange(v) {
    this.setState({
      modalAddDepreciationCost: v
    })
  }

  modalAddPenaltyFeeChange(v) {
      this.setState({
      	modalAddPenaltyFee: v
      })
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
      type: 'productlist/fetch',
      payload: {},
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
        id: values.id ? values.id.trim() : undefined,
        // peroidDay: values.periodValue ? values.periodValue : undefined
      };
      // this.setState({
      //   formValues: {
      //     currentPage: 1,
      //     pageSize: 10,
      //     searchParams: JSON.stringify(jsonParams)
      //   },
      // });
      dispatch({
        type: 'productlist/fetch',
        payload: {
          // currentPage: 1,
          // pageSize: 10,
          id: jsonParams.id
        },
      });
    });
  }

  /*TODO: 生成条件查询表单 ,参数是：无 */
  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={7} sm={24}>
            <FormItem label="产品ID">
              {getFieldDecorator('id', {
                rules: [
                  {max: 2, pattern: /^\d{1,2}$/, message: '产品ID应为小于99的整数'}
                ],
                validateTrigger: 'onBlur'
              })(
                <Input placeholder="请输入" style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
          {/*<Col md={7} sm={24}>
            <FormItem label="产品期限">
              {getFieldDecorator('periodValue',{
                // rules:[
                //   { pattern:/^[\u4e00-\u9fa5A-Za-z\d-.]+$/,message:'输入含有特殊字符，空格，请检查'}
                // ],
                // validateTrigger:'onBlur'
              })(
            		  <Select placeholder="请选择" allowClear={true} style={{width: '80%'}}>
                      {
                        this.state.periodValueList.map(v => {
                          return <Option key={v} value={v}>{v+"天"}</Option>
                        })
                      }
                    </Select>
              )}
            </FormItem>
          </Col>*/}
          <Col md={10} sm={24}>
             <span style={{float: 'center', marginBottom: 24}}>
                <Button type="primary" htmlType="submit" style={{marginRight: 16}}>查询</Button>
               {/*
                <Button  onClick={this.handleFormReset} style={{ marginRight: 16 }}>重置</Button>
*/}
               <Button onClick={this.toAdd.bind(this)}>新增</Button>

              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  /** 数据转换函数 ：根据不同类型生成相应的array数据 -
   * result : [
   *        {
   *        periodNum: number,
   *        feeType: number,
   *        prodFeeItemModels:[ { userLevel: 1,fee: 0.2},{userLevel: 2,fee: 0.2},...{userLevel: -1,fee: 0.2}]
   *        }
   *         ]
   *生成的新数据 newResult :[
   *     {
   *        titleV: string,
   *        1: 0.12,
   *        2: 0.2,
   *        ...
   *        -1: 0.1,
   *       ]
   *
   * **/
  setData = (key, result) => {
    const typeStr = [
      'dataDetail',
      'accoutData',
      'payData',
      'interestData',
      'penaltyData'
    ];
    var Typename = typeStr[key];
    var me = this;
    if (result.resultCode === 1000) {
      //1.创建一个临时对象
      var tempResult = {};
      if (result.resultData.length) {
        var tempArr = [];
        var feeType = '';
        result.resultData.map((obj) => {
          let tempObj = {
            titleV: obj.periodNum,
          }
          feeType = obj.feeType,
            obj.prodFeeItemModels.map((obj) => {
              tempObj[obj.userLevel] = (obj.fee != '' || obj.fee == 0) ? obj.fee : ''
            })
          tempArr.push(tempObj)
        });
        tempResult[Typename] = tempArr;
        me.setState({
          ...tempResult,
          feeType
        })
      } else {
        tempResult[Typename] = {
          ...result.data
        };
        me.setState({
          ...tempResult,
        })
      }
    }
  };

  render() {
    const {productlist: {loading, data}, dispatch} = this.props;
    const {activeKey, modal, recordData, dataDetail, interestData, payData, accoutData, penaltyData, feeType} = this.state;
    var {period} = recordData;
    const columns = [
      {
      title: '产品ID',
      dataIndex: 'id'
    }, {
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '产品金额',
      dataIndex: 'amount'
    }, {
      title: '产品期限',
      dataIndex: 'peroidValue',
    },
      {
        title: '期限类型',
        dataIndex: 'peroidUnit',
        render: (text) => {
          return (
            <div>
              {text}
            </div>
          )
        }
      },
      {
        title: '商品费用',
        dataIndex: 'goodsFee'
      }, {
        title: '信用分',
        dataIndex: 'creditGrade'
      },
      {
        title: '日利率%',
        dataIndex: 'dayRate',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          )
        }
      },
      // {
      //     title:'逾期服务费元',
      //     dataIndex:'serviceCharge'
      // },
      {
        title: '逾期罚息%',
        dataIndex: 'penaltyRate',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          )
        }
      },
      {
        title: '逾期罚金',
        dataIndex: 'penaltyFee'
      },
      // {
      // 	title:'日利率',
      // 	dataIndex:'dailyRentDis'
      // },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record, index) => {
          var data = record;
          return (
            <div>
              <a onClick={this.showModalEdit.bind(this, record)}>
                编辑
              </a>
              {/* &nbsp;&nbsp;&nbsp;&nbsp;
          <a style={{color: 'red', marginLeft: '10px'}}
          onClick={() => {
       	   this.switchConfigAlive(text, record, index)
          }}>
         {record.state === 1 && '关闭'}{record.state === 0 && '开启'}
       </a> */}
            </div>
          )
        }
      }];

    return (
      <PageHeaderLayout title="产品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <StandardTable
              columns={columns}
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="产品详情"
          visible={modal}
          onCancel={() => this.handleModalVisible()}
          width={900}
          footer={[
            <Button key="back" type="primary" onClick={() => this.handleModalVisible()}>
              返回
            </Button>
          ]}
        >
          {
            modal && <Tabs defaultActiveKey={activeKey} onChange={this.onSwitch}>
              <TabPane tab="基础信息" key='0'>
                <ProductDetail canEdit={true} data={dataDetail}/>
              </TabPane>
              {/*<TabPane tab="利率" key="3">
                {activeKey == '3' && <ProductTable data={ interestData } page={false}  key="Interest" feeType={feeType} period={period}/>}
              </TabPane>
              <TabPane tab="支付信审费" key="2">
                {activeKey == '2' &&<ProductTable data={ payData }  page={false}  key="pay" feeType={feeType}  period={period}/>}
              </TabPane>
              <TabPane tab="账户管理费" key="1">
                {activeKey == '1' && <ProductTable data={ accoutData } key="accout" page={false}  feeType={feeType} period={period}/>}
              </TabPane>
              <TabPane tab="罚息" key="4">
                {activeKey=='4'  && <ProductTable data={ penaltyData }  key="penalty" page={false}  feeType={feeType} period={period}/>}
             </TabPane>*/}
            </Tabs>
          }
        </Modal>
        <Modal
          title="新增产品"
          visible={this.state.modalAddVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {/*<FormItem required label={'产品ID'}>*/}
              {/*<Input value={this.state.modalAddId}*/}
                     {/*onChange={this.modalAddIdChange.bind(this)}/>*/}
            {/*</FormItem>*/}
            <FormItem required label={'产品名称'}>
              <Input maxLength="20" value={this.state.modalAddName}
                     onChange={this.modalAddNameChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'产品金额'}>
              <InputNumber value={this.state.modalAddDepreciationCost} style={{marginLeft: 20, width: 120}}
                           onChange={this.modalAddDepreciationCostChange.bind(this)}
                           min={0} step={1} precision={2}/>元
            </FormItem>
            <FormItem required label={'产品期限'}>
              <Tooltip title="多个期限之间使用,分隔" trigger='focus'>
              <Input type="text" value={this.state.modalAddPeriodValue}
                     style={{width: 150}}
                     onChange={this.modalAddPeriodValueChange.bind(this)}/>
              </Tooltip> 天
            </FormItem>


            <FormItem required label={'商品费'}>
              <Tooltip title="整百正整数" trigger='focus'>
              <InputNumber value={this.state.modalAddGoodsFee}
                           max={100000} min={0} step={100} precision={0}
                     onChange={this.modalAddGoodsFeeChange.bind(this)}/>
              </Tooltip>元
            </FormItem>
            <FormItem required label={'日利率'}>
              <InputNumber value={this.state.modalAddDailyRent} style={{marginLeft: 63}}
                           onChange={this.modalAddDailyRentChange.bind(this)}
                           max={100000} min={0} step={0.0001} precision={4}/>%
            </FormItem>
            <FormItem required label={'逾期日利率'}>
              <InputNumber value={this.state.modalAddPenaltyRate} style={{marginLeft: 35}}
                           onChange={this.modalAddPenaltyRateChange.bind(this)}
                           max={100000} min={0} step={0.0001} precision={4}/>%
            </FormItem>
            <FormItem required label={'逾期罚金'}>
              <InputNumber value={this.state.modalAddPenaltyFee} style={{marginLeft: 23}}
                           onChange={this.modalAddPenaltyFeeChange.bind(this)}
                           max={100000} min={0} step={1} precision={2}/>元
            </FormItem>
            <FormItem required label={'是否默认'}>
              <Checkbox onChange={this.isDefault({addIsDefault: true})}>默认</Checkbox>
            </FormItem>


          </Form>
        </Modal>
        <Modal
          title="编辑产品"
          visible={this.state.modalEditVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormItem required label={'产品ID'}>
            <Input value={this.state.modalEditId} disabled
            // onChange={this.modalEditIdChange.bind(this)}
            />
            </FormItem>
            <FormItem required label={'产品名称'}>
              <Input maxLength="20" value={this.state.modalEditName}
                     onChange={this.modalEditNameChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'产品金额'}>
              <InputNumber value={this.state.modalEditDepreciationCost} style={{marginLeft: 20, width: 120}}
                           onChange={this.modalEditDepreciationCostChange.bind(this)}
                           min={0} step={1} precision={2}/>元
            </FormItem>
            <FormItem required label={'产品期限'}>
              <Tooltip title="多个期限之间使用,分隔" trigger='focus'>
              <Input value={this.state.modalEditPeriodValue}
                     style={{width: 150}}
                           onChange={this.modalEditPeriodValueChange.bind(this)}/>
              </Tooltip> 天
            </FormItem>

            <FormItem required label={'信用分'}>
              <Input disabled={true} value={this.state.modalEditCreditPoints}
                     onChange={this.modalEditCreditPointsChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'商品费'}>
              <Tooltip title="整百正整数" trigger='focus'>
              <InputNumber value={this.state.modalEditGoodsFee}
                           max={100000} min={0} step={100} precision={2}
                           onChange={this.modalEditGoodsFeeChange.bind(this)}/>
              </Tooltip>元
            </FormItem>
            <FormItem required label={'日利率'}>
              <InputNumber value={this.state.modalEditDailyRent} style={{marginLeft: 63}}
                           onChange={this.modalEditDailyRentChange.bind(this)}
                           max={100000} min={0} step={0.0001} precision={4}/>%
            </FormItem>
            <FormItem required label={'逾期日利率'}>
              <InputNumber value={this.state.modalEditPenaltyRate} style={{marginLeft: 35}}
                           onChange={this.modalEditPenaltyRateChange.bind(this)}
                           max={100000} min={0} step={0.0001} precision={4}/>%
            </FormItem>
            <FormItem required label={'逾期罚金'}>
              <InputNumber value={this.state.modalEditPenaltyFee} style={{marginLeft: 23}}
                           onChange={this.modalEditPenaltyFeeChange.bind(this)}
                           max={100000} min={0} step={1} precision={2}/>元
            </FormItem>
            <FormItem required label={'是否默认'}>
              <Checkbox onChange={this.isDefault({editIsDefault: true})}>默认</Checkbox>
            </FormItem>


          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
