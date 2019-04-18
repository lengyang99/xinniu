import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Select, Form, Modal, DatePicker, Input, InputNumber, Button, Message} from 'antd'
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  queryChannelList,
  querySaveChannel,
  channelStatisticExport,
  queryUpdateChannel,
  queryGetChannelById,
  channelStatisticList,
  channelFyList,
  addChannelFy,
  updateChannelFy,
  channelDiscountList,
  updaterChannelDiscount
} from '../../services/channelmanage.js';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,

      //渠道列表
      channelModelListModelList: [],
      channelModelListPg: {},


      //渠道
      channelList: [],

      ChannelModelList: [],

      //渠道
      ChannelList: [],

      queryStartTime: moment().format('YYYY-MM-DD'),
      queryEndTime: '',
      queryChannelId: '',
      queryTimeId: '3',


      //新增
      modalAddVisible: false,
      modalAddCode: '',
      modalAddName: '',
      modalAddRegisterEachFee: '',
      modalAddLoanFee: '',
      modalAddLoanEachFee: '',

      //修改渠道
      modalEditVisible: false,
      modalEditCode: '',
      modalEditName: '',
      modalEditRegisterEachFee: '',
      modalEditLoanFee: '',
      modalEditLoanEachFee: '',
      modalEditId: '',


      modalOKLoading: false,


      fyModalVisible: false,
      fyModalChannelId: '',

      fyTableList: [],
      fyTablePg: {},
      fyTableLoading: false,
      fyTablePayTime: '',


      fyAddModalVisible: false,
      fyState: 'add',
      fyAddId: '',
      fyAddPayTime: '',
      fyAddAmount: '',

      zkModalVisible: false,
      zkModalChannelId: '',

      zkTableList: [],
      zkTablePg: {},
      zkTableLoading: false,
      zkTableDicountDate: '',

      zkAddModalVisible: false,
      zkAddId: '',
      zkAddChannelId: '',
      zkAddDiscountRatio: '',
      zkAddTime: ''

    }
  }

  /**获取数据**/
  getData() {
    this.setState({
      tableLoading: true
    });
    queryChannelList().then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          channelList: res.resultData,
          tableLoading: false
        })
      } else {
        Message.error('网络错误，请重试')
      }
    })
    this.getTableData();
  }

  getTableData(page) {
    page = page || {current: 1, pageSize: 10};
    channelStatisticList({
      currentPage: page.current || 1, pageSize: page.pageSize || 10, searchParams: JSON.stringify({
        startTime: this.state.queryStartTime,
        endTime: this.state.queryEndTime,
        channelId: this.state.queryChannelId,
        timeId: this.state.queryTimeId
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          ChannelModelListModelList: res.resultData,
          channelModelListPg: res.page,
          tableLoading: false
        })
      } else {
        Message.error('网络错误，请重试')
      }
    })
  }

  getFyTableData(page) {
    page = page || {current: 1, pageSize: 10};
    channelFyList({
      currentPage: page.current || 1, pageSize: page.pageSize || 10, searchParams: JSON.stringify({
        payment_time: this.state.fyTablePayTime,
        channel_code: this.state.fyModalChannelId
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          fyTableList: res.resultData,
          fyTablePg: res.page,
          fyTableLoading: false
        })
      } else {
        Message.error('网络错误，请重试')
      }
    })
  }

  getZkTableData(page) {
    page = page || {current: 1, pageSize: 10};
    channelDiscountList({
      currentPage: page.current || 1, pageSize: page.pageSize || 10, searchParams: JSON.stringify({
        discountDate: this.state.zkTableDicountDate || undefined,
        channelId: this.state.zkModalChannelId
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          zkTableList: res.resultData,
          zkTablePg: res.page,
          zkTableLoading: false
        })
      } else {
        Message.error('网络错误，请重试')
      }
    })
  }

  createmodalOption() {
    let ops = [];
    ops.push(<Option key={'-1'}>请选择....</Option>);
    this.state.channelList.forEach((c) => {
      ops.push(<Option key={c.id}>{c.name}</Option>);
    });
    return ops;
  }

  queryChangeStartTime(time) {
    this.setState({
      queryStartTime: time.format('YYYY-MM-DD')
    });
  }

  queryChangeDisable(d) {
    return d <= moment(this.state.queryStartTime)
  }

  queryChangeEndTime(time) {
    this.setState({
      queryEndTime: time ? time.format('YYYY-MM-DD') : ''
    });
  }

  queryChangeId(id) {
    this.setState({
      queryChannelId: id
    });
  }


  queryTimeId(timeId) {
    this.setState({
      queryTimeId: timeId
    });
  }

  exportData() {
    channelStatisticExport({
      searchParams: JSON.stringify({
        startTime: this.state.queryStartTime,
        endTime: this.state.queryEndTime,
        channelId: this.state.queryChannelId,
        timeId: this.state.queryTimeId
      })
    })
  }

  /**展示新增模态框**/
  showmodalAdd() {
    this.setState({
      modalAddVisible: true,
      modalAddCode: '',
      modalAddName: '',
      modalAddRegisterEachFee: '',
      modalAddLoanFee: '',
      modalAddLoanEachFee: '',
    })
  }

  /**展示编辑模态框**/
  showModalEdit(record) {
    this.setState({
      modalEditVisible: true,
      modalEditCode: record.code,
      modalEditName: record.name,
      modalEditRegisterEachFee: record.register_each_fee,
      modalEditLoanFee: record.loan_fee,
      modalEditLoanEachFee: record.loan_each_fee,
      modalEditId: record.id,

    })
  }

  showFyModal(record) {
    this.setState({
      fyModalVisible: true,
      fyModalChannelId: record.id
    }, () => {
      this.getFyTableData();
    })

  }

  showZkModal(record) {
    if (!this.state.queryChannelId || this.state.queryChannelId === '-1') {
      Message.info("请选择渠道!");
      return;
    }
    this.setState({
      zkModalVisible: true,
      zkModalChannelId: this.state.queryChannelId
    }, () => {
      this.getZkTableData();
    })

  }

  showFyAddModal(r) {
    r = r || {};
    this.setState({

      fyAddModalVisible: true,
      fyState: r.id ? 'edit' : 'add',
      fyAddId: r.id || '',
      fyAddPayTime: (r.id ? r.payment_time : ''),
      fyAddAmount: (r.id ? r.money : ''),

    })
  }

  showZkAddModal(r) {
    r = r || {};
    this.setState({
      zkAddModalVisible: true,
      fyAddId: r.id || '',
      zkAddDiscountRatio: (r.id ? r.DiscountRatio : ''),
      zkAddTime: moment().format("YYYY-MM-DD"),
    })
  }

  /**编辑模态框 确认按钮**/
  handleModalEditOk() {
    queryUpdateChannel({
      userChannel: JSON.stringify({
        code: this.state.modalEditCode,
        id: this.state.modalEditId,
        name: this.state.modalEditName,
        registerEachFee: this.state.modalEditRegisterEachFee,
        loanFee: this.state.modalEditLoanFee,
        loanEachFee: this.state.modalEditLoanEachFee,
      })
    }).then(res => {

      if (res.resultCode === 1000) {
        Message.success('修改成功');
        this.setState({modalEditVisible: false});
        this.getData()
      } else {
        Message.error('修改失败！' + res.resultMessage);
      }
    });
  }

  handleFyAddModalEditOk() {
    if (!this.state.fyAddPayTime || !this.state.fyAddAmount) {
      Message.info('请填写输入值！');
      return;
    }
    if (this.state.fyState === 'add') {
      addChannelFy({
        searchParams: JSON.stringify({
          channel_code: this.state.fyModalChannelId,
          payment_time: this.state.fyAddPayTime,
          money: this.state.fyAddAmount
        })
      }).then(res => {
        if (res.resultCode === 1000) {
          Message.success('添加成功');
          this.setState({fyAddModalVisible: false});
          this.getFyTableData();
        } else {
          Message.error('添加失败！' + res.resultMessage);
        }
      });
    } else {
      updateChannelFy({
        searchParams: JSON.stringify({
          id: this.state.fyAddId,
          channel_code: this.state.fyModalChannelId,
          payment_time: this.state.fyAddPayTime,
          money: this.state.fyAddAmount
        })
      }).then(res => {
        if (res.resultCode === 1000) {
          Message.success('修改成功');
          this.setState({fyAddModalVisible: false});
          this.getFyTableData();
        } else {
          Message.error('修改失败！' + res.resultMessage);
        }
      });
    }
  }


  handleZkAddModalEditOk() {
    if (this.state.zkAddDiscountRatio === '') {
      Message.info('请输入值！');
      return;
    }
    if (this.state.zkAddDiscountRatio < 0) {
      Message.info('折扣不能小于0！');
      return;
    }

    updaterChannelDiscount({
      userChannelDiscount: JSON.stringify({
        channelId: this.state.zkModalChannelId,
        discountRatio: this.state.zkAddDiscountRatio
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        Message.success('修改成功');
        this.setState({zkAddModalVisible: false});
        this.getZkTableData();
      } else {
        Message.error('修改失败！' + res.resultMessage);
      }
    });
  }


  /**编辑模态框 取消按钮**/
  handleModalEditCancel() {
    this.setState({
      modalEditVisible: false
    })
  }

  handleFyModalCancel() {
    this.setState({
      fyModalVisible: false
    })
  }

  handleZkModalCancel() {
    this.setState({
      zkModalVisible: false
    })
  }

  handleFyAddModalCancel() {
    this.setState({
      fyAddModalVisible: false
    })
  }

  handleZkAddModalCancel() {
    this.setState({
      zkAddModalVisible: false
    })
  }

  modalEditCodeChange(e) {
    this.setState({
      modalEditCode: e.target.value
    })
  }

  modalEditNameChange(e) {
    this.setState({
      modalEditName: e.target.value
    })
  }

  modalEditRegisterEachFeeChange(e) {
    this.setState({
      modalEditRegisterEachFee: e.target.value
    })
  }

  modalEditLoanFeeChange(e) {
    this.setState({
      modalEditLoanFee: e.target.value
    })
  }

  modalEditLoanEachFeeChange(e) {
    this.setState({
      modalEditLoanEachFee: e.target.value
    })
  }


  handleModalAddCancel() {
    this.setState({
      modalAddVisible: false
    })
  }

  modalAddCodeChange(e) {
    this.setState({
      modalAddCode: e.target.value
    })
  }

  modalAddNameChange(e) {
    this.setState({
      modalAddName: e.target.value
    })
  }

  modalAddRegisterEachFeeChange(e) {
    this.setState({
      modalAddRegisterEachFee: e.target.value
    })
  }

  handleSelectChange(e) {
    this.setState({
      modalAddType: e
    })
  }

  modalAddLoanFeeChange(e) {
    this.setState({
      modalAddLoanFee: e.target.value
    })
  }

  modalAddLoanEachFeeChange(e) {
    this.setState({
      modalAddLoanEachFee: e.target.value
    })
  }

  modalFyQueryChange(e, v) {
    this.setState({
      fyTablePayTime: v
    })
  }

  modalZkQueryChange(e, v) {
    this.setState({
      zkTableDicountDate: v
    })
  }

  modalFyAddPaytimeChange(e, v) {
    this.setState({
      fyAddPayTime: v
    })
  }

  modalFyAddAmountChange(e, v) {
    this.setState({
      fyAddAmount: e
    })
  }

  modalZkAddDiscountChange(e, v) {
    this.setState({
      zkAddDiscountRatio: e
    })
  }

  handleModalAddOk() {
    querySaveChannel({
      userChannel: JSON.stringify({
        name: this.state.modalAddName,
        code: this.state.modalAddCode,
        registerEachFee: this.state.modalAddRegisterEachFee,
        loanFee: this.state.modalAddLoanFee,
        loanEachFee: this.state.modalAddLoanEachFee
      })
    }).then(res => {
      if (res.resultCode === 1000) {
        Message.success('添加成功');
        this.setState({modalAddVisible: false});
      } else {
        Message.error('添加失败！' + res.resultMessage);
      }
    });
  }


  /**生命周期**/
  componentDidMount() {
    this.getData()
  }

  render() {
    const columnsFormodalTable = [
      {
        title: '时间',
        dataIndex: 'dates',
        key: 'dates',
        width: 120
      },
      {
        title: '渠道名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '合作模式',
        dataIndex: 'cooperation_model',
        key: 'cooperation_model',
        width: 120,
        render: (text, record) => {
          var r = record;
          return (
            <div>
              <p>Cpa: {r.register_each_fee}</p>
              <p>Cps: {r.loan_fee}%+{r.loan_each_fee}</p>
            </div>
          )
        }
      },
      {
        title: '注册用户数',
        dataIndex: 'registers',
        key: 'registers',
      },
      {
        title: '认证用户数',
        dataIndex: 'auth',
        key: 'auth',
      },
      {
        title: '下单用户数',
        dataIndex: 'orders',
        key: 'orders',
      },
      {
        title: '批款用户数',
        dataIndex: 'mu',
        key: 'mu',
      },
      {
        title: '批款金额',
        dataIndex: 'mm',
        key: 'mm',
      },
      {
        title: '注册-认证转化率',
        dataIndex: 'ra',
        key: 'ra',
        render: (text, record) => {
          var r = record;
          let rate;
          if (r.auth && r.registers && r.registers != 0) {
            rate = ((r.auth / r.registers) * 100).toFixed(2) + '%';
          } else {
            rate = 0;
          }
          return (
            rate
          )
        }
      },
      {
        title: '注册-下单转换率',
        dataIndex: 'ro',
        key: 'ro',
        render: (text, record) => {
          var r = record;
          let rate;
          if (r.orders && r.registers && r.registers != 0) {
            rate = ((r.orders / r.registers) * 100).toFixed(2) + '%';
          } else {
            rate = 0;
          }
          return (
            rate
          )
        }
      },
      {
        title: '下单-放款通过率',
        dataIndex: 'om',
        key: 'om',
        render: (text, record) => {
          var r = record;
          let rate;
          if (r.mu && r.orders && r.orders != 0) {
            rate = ((r.mu / r.orders) * 100).toFixed(2) + '%';
          } else {
            rate = 0;
          }
          return (
            rate
          )
        }
      },
      {
        title: '注册成本',
        dataIndex: 'rc',
        key: 'rc',
        render: (text, record) => {
          var r = record;
          let rate;
          if (r.money && r.registers && r.registers != 0) {
            rate = (r.money / r.registers).toFixed(2)
          } else {
            rate = 0
          }
          return (
            rate
          )
        }
      },
      {
        title: '放款成本',
        dataIndex: 'mc',
        key: 'mc',
        render: (text, record) => {
          var r = record;
          let rate;
          if (r.money && r.mu && r.mu != 0) {
            rate = (r.money / r.mu).toFixed(2)
          } else {
            rate = 0
          }
          return (
            rate
          )
        }
      },
      {
        title: '操作',
        dataIndex: '',
        key: '',
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={this.showModalEdit.bind(this, record)}>
                编辑
              </a>&nbsp;&nbsp;&nbsp;
              <a onClick={this.showFyModal.bind(this, record)}>
                费用
              </a>
            </div>
          )
        }
      }

    ];


    const columnFyTable = [
      {title: '缴费日期', dataIndex: 'payment_time', key: 'payment_time'},
      {title: '添加时间', dataIndex: 'create_time', key: 'create_time'},
      {title: '金额', dataIndex: 'money', key: 'money'},
      {
        title: '操作', dataIndex: '', key: '', render: (t, r, i) => {
          return (
            <div><a onClick={this.showFyAddModal.bind(this, r)}>修改</a></div>
          );
        }
      }
    ];
    const columnZkTable = [
      {title: '折扣日期', dataIndex: 'discountDate', key: 'discountDate'},
      {title: '添加时间', dataIndex: 'createTime', key: 'createTime'},
      {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime'},
      {title: '比例', dataIndex: 'discountRatio', key: 'discountRatio'},
    ];


    return (
      <div>
        <Card>
          <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <FormItem label={'渠道名称'}>
              {/*<DatePicker allowClear={false} defaultValue={moment()} onChange={this.queryChangeStartTime.bind(this)}/>*/}
              {/*--*/}
              {/*<DatePicker disabledDate={this.queryChangeDisable.bind(this)}*/}
              {/*onChange={this.queryChangeEndTime.bind(this)}/>*/}
            </FormItem>
            <FormItem label={'渠道编码'} style={{marginLeft: -50}}>
              <Select style={{width: 100}} defaultValue={'请选择.....'} onChange={this.queryChangeId.bind(this)}>
                {this.createmodalOption()}
              </Select>
            </FormItem>
            <FormItem label="时间跨度" style={{marginLeft: -70}}>
              <Select style={{width: 100}} defaultValue={'3'} onChange={this.queryTimeId.bind(this)}>
                <Option value="1" selected>1小时</Option>
                {/* <Option value="2">12小时</Option> */}
                <Option value="3">1天</Option>
                {/* <Option value="2">7天</Option> */}
              </Select>
            </FormItem>
            <Button style={{marginLeft: -60}} onClick={this.showZkModal.bind(this)}>
              折扣
            </Button>
            <Button style={{marginLeft: -60}} type={'primary '} htmlType="submit"
                    onClick={this.getTableData.bind(this)}>搜索</Button>


            <Button style={{marginLeft: -60}} onClick={this.showmodalAdd.bind(this)}>
              添加
            </Button>

            <Button style={{marginLeft: -60}} type={'primary '} onClick={this.exportData.bind(this)}>导出为EXCEL</Button>

          </Form>

          <Table
            dataSource={this.state.ChannelModelListModelList}
            columns={columnsFormodalTable}
            pagination={this.state.channelModelListPg}
            bordered rowKey={record => record.id + record.dates}
            loading={this.state.tableLoading}
            onChange={this.getTableData.bind(this)}
          />
        </Card>
        <Modal
          title="新增渠道"
          visible={this.state.modalAddVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <FormItem required label={'渠道名称'}>
              <Input maxlength="20" value={this.state.modalAddName}
                     onChange={this.modalAddNameChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'渠道编码'}>
              <Input maxlength="10" value={this.state.modalAddCode}
                     onChange={this.modalAddCodeChange.bind(this)}/>
            </FormItem>
            <FormItem style={{width: '240px'}} required label={'注册费用'}>
              <Input style={{width: '130px'}} value={this.state.modalAddRegisterEachFee}
                     onChange={this.modalAddRegisterEachFeeChange.bind(this)}/>
              元
            </FormItem>

            <FormItem required label={'放款费用'}>
              <Input style={{width: '50px'}} value={this.state.modalAddLoanFee}
                     onChange={this.modalAddLoanFeeChange.bind(this)}/>%+
              <Input style={{width: '50px'}} value={this.state.modalAddLoanEachFee}
                     onChange={this.modalAddLoanEachFeeChange.bind(this)}/>元
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="编辑"
          visible={this.state.modalEditVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <FormItem required label={'渠道名称'}>
              <Input maxlength="20" value={this.state.modalEditName}
                     onChange={this.modalEditNameChange.bind(this)}/>
            </FormItem>

            <FormItem required label={'渠道编号'}>

              <Input disabled="disabled" maxlength="10" value={this.state.modalEditCode}

                     onChange={this.modalEditCodeChange.bind(this)}/>
            </FormItem>

            <FormItem style={{width: '240px'}} required label={'注册费用'}>
              <Input style={{width: '130px'}} value={this.state.modalEditRegisterEachFee}
                     onChange={this.modalEditRegisterEachFeeChange.bind(this)}/>
              元
            </FormItem>
            <FormItem required label={'放款费用'}>
              <Input style={{width: '50px'}} value={this.state.modalEditLoanFee}
                     onChange={this.modalEditLoanFeeChange.bind(this)}/>%+
              <Input style={{width: '50px'}} tyle={{width: '50px'}} value={this.state.modalEditLoanEachFee}
                     onChange={this.modalEditLoanEachFeeChange.bind(this)}/>元
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="渠道费用列表"
          visible={this.state.fyModalVisible}
          onCancel={this.handleFyModalCancel.bind(this)}
          footer={null}
        >
          <Form layout={'inline'} style={{alignItems: 'center', marginBottom: 10}}>
            <FormItem label={'缴费日期'}>
              <DatePicker onChange={this.modalFyQueryChange.bind(this)}/>
            </FormItem>
            <FormItem>
              <Button type={'primary '} htmlType="submit" onClick={this.getFyTableData.bind(this)}>搜索</Button>
              <Button type={'primary '} style={{marginLeft: 10}} htmlType="submit"
                      onClick={this.showFyAddModal.bind(this)}>添加</Button>
            </FormItem>
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

        <Modal
          title="添加渠道费用"
          visible={this.state.fyAddModalVisible}
          onCancel={this.handleFyAddModalCancel.bind(this)}
          onOk={this.handleFyAddModalEditOk.bind(this)}
        >
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <FormItem required label={'缴费日期'}>
              <DatePicker disabled={this.state.fyState === 'add' ? false : true}
                          value={this.state.fyAddPayTime ? moment(this.state.fyAddPayTime) : null}
                          onChange={this.modalFyAddPaytimeChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'缴费金额'}>
              <InputNumber style={{width: 158}} min={0} step={0.01} max={100000} precision={2}
                           value={this.state.fyAddAmount}
                           onChange={this.modalFyAddAmountChange.bind(this)}/>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="渠道折扣列表"
          visible={this.state.zkModalVisible}
          onCancel={this.handleZkModalCancel.bind(this)}
          footer={null}
        >
          <Form layout={'inline'} style={{alignItems: 'center', marginBottom: 10}}>
            <FormItem label={'日期'}>
              <DatePicker onChange={this.modalZkQueryChange.bind(this)}/>
            </FormItem>
            <FormItem>
              <Button type={'primary '} htmlType="submit" onClick={this.getZkTableData.bind(this)}>搜索</Button>
              <Button type={'primary '} style={{marginLeft: 10}}
                      onClick={this.showZkAddModal.bind(this)}>修改明日渠道折扣</Button>
            </FormItem>
          </Form>
          <Table
            dataSource={this.state.zkTableList}
            columns={columnZkTable}
            pagination={this.state.zkTablePg}
            bordered rowKey={record => record.id}
            loading={this.state.zkTableLoading}
            onChange={this.getZkTableData.bind(this)}
          />
        </Modal>

        <Modal
          title="修改明日折扣"
          visible={this.state.zkAddModalVisible}
          onCancel={this.handleZkAddModalCancel.bind(this)}
          onOk={this.handleZkAddModalEditOk.bind(this)}
        >
          <Form layout={'inline'}
                style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
            <FormItem required label={'折扣日期'}>
              <Input disabled={true} value={moment().add(1, 'day').format("YYYY-MM-DD")}/>
            </FormItem>
            <FormItem required label={'折扣比例'}>
              <InputNumber style={{width: 158}} min={0} step={0.01} max={1} precision={2}
                           value={this.state.zkAddDiscountRatio}
                           onChange={this.modalZkAddDiscountChange.bind(this)}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
