import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Switch, Form, Modal, TimePicker, Input, InputNumber, Button, message} from 'antd'
import moment from 'moment';
import {
  queryRouteInfo,
  queryRouteSwitch,
  queryRouteAlive,
  queryUpdateRouteConfig,
  queryRouteBankPage,
  queryRouteBankAlive,
  querypdateRouteBank,
  queryRefresh
} from '../../services/routeManage';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    /**
     *
     channelId: 1,
     channelName: '叮咚', //渠道名称
     channelType: 10,//渠道类型 10放款 20还款
     weight: 10, //权重等级
     ratio: 2, //比例系数
     startTime: '083030',//开放时间
     endTime: '210010',//结束时间
     quotaPerDay: 77.7,//交易额度
     alive: 1,//当前状态 1开启 0关闭

     * **/
    this.state = {
      tableLoading: false,
      // 放款渠道列表
      loanRouteConfigList: [],

      // 还款渠道列表
      repayRouteConfigList: [],

      /**三个开关**/
      ROUTE_TRADE_SWITCH: '',
      ROUTE_TRADE_SWITCH_loading: false,

      ROUTE_LOAN_RATIO_SWITCH: '',
      ROUTE_LOAN_RATIO_SWITCH_loading: false,

      ROUTE_REPAY_RATIO_SWITCH: '',
      ROUTE_REPAY_RATIO_SWITCH_loading: false,


      /**模态框 - 编辑**/
      modalEditVisible: false,
      modalEditTitle: '',
      modalEditChannelId: '',
      modalEditChannelType: '',
      modalEditInputWeight: '',
      modalEditInputRatio: '',
      modalEditInputStartTime: '',
      modalEditInputEndTime: '',
      modalEditInputQuotaPerDay: '',

      modalOKLoading: false,

      /**模态框 - 银行配置**/
      modalBankSettingsVisible: false,
      modalBankSettingsSearch: '',
      modalBankSettingsTitle: '银行配置',
      modalBankSettingsChannelId: '',
      modalBankSettingsChannelType: '',
      modalBankSettingsBankName: '',
      modalBankSettingsLoading: false,

      routeBankPage: [],

      /**模态框 - 编辑 - 银行配置**/
      modalBankEditVisible: false,
      modalBankEditTitle: '',
      modalBankEditInputId: '',
      modalBankEditInputQuotaPerOnce: '',
      modalBankEditInputQuotaPerDay: '',
      modalBankEditInputQuotaPerThirty: '',
    }
  }

  /**获取数据**/
  getData() {
    this.setState({
      tableLoading: true
    });
    queryRouteInfo().then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          ROUTE_TRADE_SWITCH: res.resultData.switchMap.ROUTE_TRADE_SWITCH,
          ROUTE_LOAN_RATIO_SWITCH: res.resultData.switchMap.ROUTE_LOAN_RATIO_SWITCH,
          ROUTE_REPAY_RATIO_SWITCH: res.resultData.switchMap.ROUTE_REPAY_RATIO_SWITCH,

          loanRouteConfigList: res.resultData.loanRouteConfigList,
          repayRouteConfigList: res.resultData.repayRouteConfigList,
          tableLoading: false
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**刷新缓存**/
  refresh() {
    message.info('数据同步中...');
    queryRefresh().then(res => {
      if (res.resultCode === 1000) {
        message.success('数据已同步');
        this.getData()
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**编辑按钮**/
  edit(text, record,) {
    let tail = record.channelType === 10 ? '放款渠道' : record.channelType === 20 ? '还款渠道' : '';
    let modalEditTitle = record.channelName + ' - ' + tail;
    this.setState({
      modalEditVisible: true,
      modalEditTitle,
      modalEditChannelId: record.channelId,
      modalEditChannelType: record.channelType,
      modalEditInputWeight: record.weight,
      modalEditInputRatio: record.ratio,
      modalEditInputStartTime: record.startTime,
      modalEditInputEndTime: record.endTime,
      modalEditInputQuotaPerDay: record.quotaPerDay,
    });
  }

  /**渠道开启or关闭按钮**/
  channelSwitch(text, record,) {
    let that = this;
    let aliveChanged = record.alive === 1 ? 0 : 1;
    confirm({
      title: `${record.channelName} - ${record.channelType === 10 ? '放款渠道' : '还款渠道'}`,
      content: `是否确认 ${aliveChanged === 1 ? '开启' : '关闭'} ${record.channelName} - ${record.channelType === 10 ? '放款渠道' : '还款渠道'}`,
      onOk() {
        queryRouteAlive({
          channelId: record.channelId,
          channelType: record.channelType,
          alive: aliveChanged
        }).then(res => {
          if (res.resultCode === 1000) {
            that.getData()
          } else {
            message.error('网络错误，请重试')
          }
        })
      }
    });
  }

  /**银行配置按钮**/
  bankSettings(text, record) {
    let tail = record.channelType === 10 ? '放款渠道' : record.channelType === 20 ? '还款渠道' : '';
    let modalBankSettingsTitle = '银行配置 - ' + record.channelName + ' - ' + tail;

    this.setState({
      modalBankSettingsVisible: true,
      modalBankSettingsTitle,
      modalBankSettingsChannelId: record.channelId,
      modalBankSettingsChannelType: record.channelType,
      modalBankSettingsBankName: '',
    });

    this.getBankData(record.channelId, record.channelType, '')
  }

  /**三个开关**/
  handleSwitch(switchID) {
    let that = this;
    switch (switchID) {
      case 'ROUTE_TRADE_SWITCH':
        that.setState({
          ROUTE_TRADE_SWITCH_loading: true
        });
        confirm({
          title: '路由总开关',
          content: `是否确认 ${this.state.ROUTE_TRADE_SWITCH === 'on' ? '关闭' : '开启'} 路由总开关`,
          onOk() {
            /**改变开关状态**/
            queryRouteSwitch({
              switchID: 'ROUTE_TRADE_SWITCH',
              switchKey: that.state.ROUTE_TRADE_SWITCH === 'on' ? 0 : 1
            }).then(res => {
              if (res.resultCode === 1000) {
                that.setState({
                  ROUTE_TRADE_SWITCH_loading: false
                });
                that.getData()
              } else {
                message.error('网络错误，请重试')
              }
            });
          },
          onCancel() {
            that.setState({
              ROUTE_TRADE_SWITCH_loading: false
            });
          }
        });
        break;
      case 'ROUTE_LOAN_RATIO_SWITCH':
        that.setState({
          ROUTE_LOAN_RATIO_SWITCH_loading: true
        });
        confirm({
          title: '放款比例开关',
          content: `是否确认 ${this.state.ROUTE_LOAN_RATIO_SWITCH === 'on' ? '关闭' : '开启'} 放款比例开关`,
          onOk() {
            /**改变开关状态**/
            queryRouteSwitch({
              switchID: 'ROUTE_LOAN_RATIO_SWITCH',
              switchKey: that.state.ROUTE_LOAN_RATIO_SWITCH === 'on' ? 0 : 1
            }).then(res => {
              if (res.resultCode === 1000) {
                that.setState({
                  ROUTE_LOAN_RATIO_SWITCH_loading: false
                });
                that.getData()
              } else {
                message.error('网络错误，请重试')
              }
            });
          },
          onCancel() {
            that.setState({
              ROUTE_LOAN_RATIO_SWITCH_loading: false
            });
          }
        });
        break;
      case 'ROUTE_REPAY_RATIO_SWITCH':
        that.setState({
          ROUTE_REPAY_RATIO_SWITCH_loading: true
        });
        confirm({
          title: '还款比例开关',
          content: `是否确认 ${this.state.ROUTE_REPAY_RATIO_SWITCH === 'on' ? '关闭' : '开启'} 还款比例开关`,
          onOk() {
            /**改变开关状态**/
            queryRouteSwitch({
              switchID: 'ROUTE_REPAY_RATIO_SWITCH',
              switchKey: that.state.ROUTE_REPAY_RATIO_SWITCH === 'on' ? 0 : 1
            }).then(res => {
              if (res.resultCode === 1000) {
                that.setState({
                  ROUTE_REPAY_RATIO_SWITCH_loading: false
                });
                that.getData()
              } else {
                message.error('网络错误，请重试')
              }
            });
          },
          onCancel() {
            that.setState({
              ROUTE_REPAY_RATIO_SWITCH_loading: false
            });
          }
        });
        break;
    }
  }

  /**模态框 - 编辑 - 确认按钮**/
  handleModalEditOk() {
    this.setState({
      modalOKLoading: true
    });
    queryUpdateRouteConfig({
      channelId: this.state.modalEditChannelId,
      channelType: this.state.modalEditChannelType,
      weight: this.state.modalEditInputWeight ? this.state.modalEditInputWeight : '',
      ratio: this.state.modalEditInputRatio ? this.state.modalEditInputRatio : '',
      startTime: this.state.modalEditInputStartTime,
      endTime: this.state.modalEditInputEndTime,
      quotaPerDay: this.state.modalEditInputQuotaPerDay ? this.state.modalEditInputQuotaPerDay : '',
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          modalOKLoading: false,
          modalEditVisible: false
        });
        this.getData()
      } else {
        message.error('网络错误，请重试')
      }
    });
  }

  /**模态框 - 编辑 - 取消按钮**/
  handleModalEditCancel() {
    this.setState({
      modalEditVisible: false
    })
  }


  modalEditWeightChange(value) {
    this.setState({
      modalEditInputWeight: value
    })
  }

  modalEditRatioChange(value) {
    this.setState({
      modalEditInputRatio: value
    })
  }

  modalEditStartTimeChange(time, timeString) {
    this.setState({
      modalEditInputStartTime: timeString.split(':')[0] + timeString.split(':')[1] + timeString.split(':')[2]
    })
  }

  modalEditEndTimeChange(time, timeString) {
    this.setState({
      modalEditInputEndTime: timeString.split(':')[0] + timeString.split(':')[1] + timeString.split(':')[2]
    })
  }

  modalEditQuotaPerDayChange(value) {
    this.setState({
      modalEditInputQuotaPerDay: value
    })
  }


  /**模态框 - 银行设置 - 取消**/
  handleModalBankSettingsCancel() {
    this.setState({
      modalBankSettingsVisible: false,
    })
  }


  /**获取银行配置数据**/
  getBankData(channelId, channelType, bankName) {
    queryRouteBankPage({
      currentPage: 1,
      pageSize: 999999,
      channelId: channelId,
      channelType: channelType,
      bankName: bankName,
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          routeBankPage: res.resultData.list,
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**编辑 银行配置**/
  bankEdit(text, record, index) {
    this.setState({
      modalBankEditTitle: record.bankName,
      modalBankEditVisible: true,
      modalBankEditInputId: record.id,
      modalBankEditInputQuotaPerOnce: record.quotaPerOnce,
      modalBankEditInputQuotaPerDay: record.quotaPerDay,
      modalBankEditInputQuotaPerThirty: record.quotaPerThirty,
    })
  }


  modalBankEditQuotaPerOnceChange(value) {
    this.setState({
      modalBankEditInputQuotaPerOnce: value
    })
  }

  modalBankEditQuotaPerDayChange(value) {
    this.setState({
      modalBankEditInputQuotaPerDay: value
    })
  }

  modalBankEditQuotaPerThirtyChange(value) {
    this.setState({
      modalBankEditInputQuotaPerThirty: value
    })
  }

  /**模态框 - 编辑 - 银行配置 - 确认按钮**/
  handleModalBankEditOk() {
    this.setState({
      modalOKLoading: true
    });
    querypdateRouteBank({
      id: this.state.modalBankEditInputId,
      quotaPerOnce: this.state.modalBankEditInputQuotaPerOnce ? this.state.modalBankEditInputQuotaPerOnce : '',
      quotaPerDay: this.state.modalBankEditInputQuotaPerDay ? this.state.modalBankEditInputQuotaPerDay : '',
      quotaPerThirty: this.state.modalBankEditInputQuotaPerThirty ? this.state.modalBankEditInputQuotaPerThirty : '',
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('操作成功');
        this.setState({
          modalOKLoading: false,
          modalBankEditVisible: false
        });
        this.getBankData(this.state.modalBankSettingsChannelId, this.state.modalBankSettingsChannelType, '')
      } else {
        message.error('网络错误，请重试')
      }
    });
  }

  /**模态框 - 编辑 - 银行配置 - 取消按钮**/
  handleModalBankEditCancel() {
    this.setState({
      modalBankEditVisible: false
    })
  }

  /**银行配置开启or关闭按钮**/
  bankSwitch(text, record, index) {
    let that = this;
    let aliveChanged = record.alive === 1 ? 0 : 1;
    queryRouteBankAlive({
      id: record.id,
      alive: aliveChanged
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('操作成功');
        that.getBankData(that.state.modalBankSettingsChannelId, that.state.modalBankSettingsChannelType, that.state.modalBankSettingsSearch)
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**生命周期**/
  componentDidMount() {
    this.getData()
  }

  render() {
    const columnsForRouteTable = [{
      title: '序号',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return (
          <div>
            {index + 1}
          </div>
        )
      }
    }, {
      title: '渠道名称',
      dataIndex: 'channelName',
      key: 'channelName',
    }, {
      title: '权重等级',
      dataIndex: 'weight',
      key: 'weight',
    }, {
      title: '比例系数',
      dataIndex: 'ratio',
      key: 'ratio',
    }, {
      title: '开放时间',
      dataIndex: '',
      key: '',
      render: (text, record) => {
        return (
          <div>
            {record.startTime.substring(0, 2) + ":" + record.startTime.substring(2, 4) + ":" + record.startTime.substring(4, 6)}
            -
            {record.endTime.substring(0, 2) + ":" + record.endTime.substring(2, 4) + ":" + record.endTime.substring(4, 6)}
          </div>
        )
      }
    }, {
      title: '交易额度',
      dataIndex: 'quotaPerDay',
      key: 'quotaPerDay',
    }, {
      title: '当前状态',
      dataIndex: 'alive',
      key: 'alive',
      render: (text) => {
        return (
          <div style={{color: text === 1 ? '#67C23A' : ''}}>
            {text === 0 ? '已关闭' : text === 1 ? '已启动' : '--'}
          </div>
        )
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div>

            <a onClick={() => {
              this.edit(text, record, index)
            }}>
              编辑
            </a>

            <a style={{color: 'red', marginLeft: '10px'}}
               onClick={() => {
                 this.channelSwitch(text, record, index)
               }}>
              {record.alive === 1 && '关闭'}{record.alive === 0 && '开启'}
            </a>

            <a style={{marginLeft: '10px'}}
               onClick={() => {
                 this.bankSettings(text, record, index)
               }}>
              银行配置
            </a>

          </div>
        )
      }

    }];
    const columnsForBankSettingsTable = [{
      title: '序号',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return (
          <div>
            {index + 1}
          </div>
        )
      }
    }, {
      title: '银行编码',
      dataIndex: 'bankCode',
      key: 'bankCode',
    }, {
      title: '银行名称',
      dataIndex: 'bankName',
      key: 'bankName',
    }, {
      title: '单笔限额',
      dataIndex: 'quotaPerOnce',
      key: 'quotaPerOnce',
    }, {
      title: '单日限额',
      dataIndex: 'quotaPerDay',
      key: 'quotaPerDay',
    }, {
      title: '30天限额',
      dataIndex: 'quotaPerThirty',
      key: 'quotaPerThirty',
    }, {
      title: '当前状态',
      dataIndex: 'alive',
      key: 'alive',
      render: (text) => {
        return (
          <div style={{color: text === 1 ? '#67C23A' : ''}}>
            {text === 0 ? '已关闭' : text === 1 ? '已启动' : '--'}
          </div>
        )
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div>

            <a onClick={() => {
              this.bankEdit(text, record, index)
            }}>
              编辑
            </a>

            <a style={{color: 'red', marginLeft: '10px'}}
               onClick={() => {
                 this.bankSwitch(text, record, index)
               }}>
              {record.alive === 1 && '关闭'}{record.alive === 0 && '开启'}
            </a>

          </div>
        )
      }

    }];

    return (
      <div>
        <Card>

          <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <FormItem label={'路由总开关'}>
              <Switch checkedChildren="开"
                      unCheckedChildren="关"
                      checked={this.state.ROUTE_TRADE_SWITCH === 'on'}
                      onChange={this.handleSwitch.bind(this, 'ROUTE_TRADE_SWITCH')}
                      loading={this.state.ROUTE_TRADE_SWITCH_loading}/>
            </FormItem>
            <Button type={'primary'} onClick={this.refresh.bind(this)}>Redis同步数据库</Button>
          </Form>


          <h3 style={{marginTop: '20px'}}>放款路由</h3>
          <Form layout={'inline'}>
            <FormItem label={'放款比例开关'}>
              <Switch checkedChildren="开"
                      unCheckedChildren="关"
                      checked={this.state.ROUTE_LOAN_RATIO_SWITCH === 'on'}
                      onChange={this.handleSwitch.bind(this, 'ROUTE_LOAN_RATIO_SWITCH')}
                      loading={this.state.ROUTE_LOAN_RATIO_SWITCH_loading}/>
            </FormItem>
          </Form>
          <Table
            dataSource={this.state.loanRouteConfigList}
            columns={columnsForRouteTable}
            pagination={true}
            bordered rowKey={record => record.channelId}
            loading={this.state.tableLoading}/>


          <h3 style={{marginTop: '20px'}}>还款路由</h3>
          <Form layout={'inline'}>
            <FormItem label={'还款比例开关'}>
              <Switch checkedChildren="开"
                      unCheckedChildren="关"
                      checked={this.state.ROUTE_REPAY_RATIO_SWITCH === 'on'}
                      onChange={this.handleSwitch.bind(this, 'ROUTE_REPAY_RATIO_SWITCH')}
                      loading={this.state.ROUTE_REPAY_RATIO_SWITCH_loading}/>
            </FormItem>
          </Form>
          <Table
            dataSource={this.state.repayRouteConfigList}
            columns={columnsForRouteTable}
            pagination={true}
            bordered rowKey={record => record.channelId}
            loading={this.state.tableLoading}/>
        </Card>

        {/**编辑模态框**/}
        <Modal
          title={this.state.modalEditTitle}
          visible={this.state.modalEditVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
          footer={[
            <Button key="cancel" onClick={this.handleModalEditCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.modalOKLoading}
                    onClick={this.handleModalEditOk.bind(this)}>
              确认
            </Button>,
          ]}
        >

          <Form layout={'inline'}>
            <Row>
              <Col span={12}>
                <FormItem label={'权重等级'} required>
                  <InputNumber value={this.state.modalEditInputWeight}
                               onChange={this.modalEditWeightChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={'比例系数'} required>
                  <InputNumber value={this.state.modalEditInputRatio}
                               onChange={this.modalEditRatioChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label={'开始时间'} required>
                  <TimePicker value={moment(this.state.modalEditInputStartTime, 'HH:mm:ss')}
                              onChange={this.modalEditStartTimeChange.bind(this)}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={'结束时间'} required>
                  <TimePicker value={moment(this.state.modalEditInputEndTime, 'HH:mm:ss')}
                              onChange={this.modalEditEndTimeChange.bind(this)}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label={'交易额度'} required>
                  <InputNumber value={this.state.modalEditInputQuotaPerDay} step={0.01}
                               onChange={this.modalEditQuotaPerDayChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
          </Form>

        </Modal>

        {/**银行配置模态框**/}
        <Modal
          width={1040}
          title={this.state.modalBankSettingsTitle}
          visible={this.state.modalBankSettingsVisible}
          footer={null}
          onCancel={this.handleModalBankSettingsCancel.bind(this)}
        >
          <Search style={{width: '800px'}} addonBefore="银行名称：" onChange={v => {this.setState({modalBankSettingsSearch:v.target.value})}}   value={this.state.modalBankSettingsSearch}
                  onSearch={value => {
                    message.success(`搜索关键字 ${value} 成功`);
                    this.getBankData(this.state.modalBankSettingsChannelId, this.state.modalBankSettingsChannelType, value);
                    this.setState({
                      modalBankSettingsSearch: value
                    })
                  }}
                  placeholder="请输入您要搜索的银行名称" enterButton="查询" size="large"/>
          <Button size={'large'}
                  style={{marginLeft: '20px'}}
                  onClick={() => {
                    message.success(`重置成功`);
                    this.setState({modalBankSettingsSearch: ''})
                  }}>重置</Button>
          <Table
            style={{marginTop: '20px'}}
            dataSource={this.state.routeBankPage}
            columns={columnsForBankSettingsTable}
            pagination={true}
            bordered rowKey={record => record.id}
            loading={this.state.modalBankSettingsLoading}/>
        </Modal>

        {/**编辑-银行配置模态框**/}
        <Modal
          title={this.state.modalBankEditTitle}
          visible={this.state.modalBankEditVisible}
          onOk={this.handleModalBankEditOk.bind(this)}
          onCancel={this.handleModalBankEditCancel.bind(this)}
          footer={[
            <Button key="cancel" onClick={this.handleModalBankEditCancel.bind(this)}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.modalOKLoading}
                    onClick={this.handleModalBankEditOk.bind(this)}>
              确认
            </Button>,
          ]}
        >

          <Form layout={'inline'}>
            <Row>
              <Col span={24}>
                <FormItem label={'单笔限额'} required>
                  <InputNumber value={this.state.modalBankEditInputQuotaPerOnce}
                               onChange={this.modalBankEditQuotaPerOnceChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label={'单日限额'} required>
                  <InputNumber value={this.state.modalBankEditInputQuotaPerDay}
                               onChange={this.modalBankEditQuotaPerDayChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label={'30天限额'} required>
                  <InputNumber value={this.state.modalBankEditInputQuotaPerThirty}
                               onChange={this.modalBankEditQuotaPerThirtyChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
          </Form>

        </Modal>
      </div>
    );
  }
}
