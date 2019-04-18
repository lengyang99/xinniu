import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Switch, Form, Modal, TimePicker, Input, InputNumber, Button, message,Checkbox } from 'antd'
import moment from 'moment';
import {
  queryRouteList,
  querySwitchRoute,
  queryUpdateRouteConfig,
  queryRefresh
} from '../../services/auditRouteManage';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;

export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      //风控渠道列表
      auditRouteConfigList: [],


      /**三个开关**/
      ROUTE_AUDIT_SWITCH: false,
      ROUTE_AUDIT_SWITCH_loading: false,


      /**模态框 - 编辑**/
      modalEditVisible: false,
      modalEditTitle: '',
      modalEditConfigId: '',
      modalEditInputWeight: '',
      modalEditInputSort: '',
      modalEditInputStartTime: '',
      modalEditInputEndTime: '',
      modalEditInputDayLimit: '',
      ios:'',
      android:'',
      personReview:'',
      modalOKLoading: false
    }
  }

  /**获取数据**/
  getData() {
    this.setState({
      tableLoading: true
    });
    queryRouteList().then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          ROUTE_AUDIT_SWITCH :  res.resultData.auditSwitch,
          auditRouteConfigList: res.resultData.auditRouteList,
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
  edit(text, record, index) {
    let modalEditTitle = record.name;
    this.setState({
      modalEditVisible: true,
      modalEditTitle,
      modalEditConfigId: record.id,
      modalEditInputWeight: record.weight,
      modalEditInputSort: record.sort,
      modalEditInputStartTime: record.startTime,
      modalEditInputEndTime: record.endTime,
      modalEditInputDayLimit: record.dayLimit,
      ios:record.ios,
      android:record.android,
      personReview:record.personReview
    });
  }

  switchConfigAlive(text,record,index){
	let that = this;
    that.setState({
    	ROUTE_AUDIT_SWITCH_loading: true
    });
    confirm({
      title: '风控渠道开关',
      content: `是否确认${record.alive === true ? '关闭' : '开启'} [${record.name}] 渠道?`,
      onOk() {
        /**改变开关状态**/
    	queryUpdateRouteConfig({
    		id:record.id,
    		alive:!record.alive
    	}).then(res => {
          if (res.resultCode === 1000) {
            that.setState({
            	ROUTE_AUDIT_SWITCH_loading: false
            });
            that.getData()
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

  /**渠道开启or关闭按钮**/
//  channelSwitch(text, record,) {
//    let that = this;
//    let aliveChanged = record.alive === 1 ? 0 : 1;
//    confirm({
//      title: `${record.channelName} - ${record.channelType === 10 ? '放款渠道' : '还款渠道'}`,
//      content: `是否确认 ${aliveChanged === 1 ? '开启' : '关闭'} ${record.channelName} - ${record.channelType === 10 ? '放款渠道' : '还款渠道'}`,
//      onOk() {
//        queryRouteAlive({
//          channelId: record.channelId,
//          channelType: record.channelType,
//          alive: aliveChanged
//        }).then(res => {
//          if (res.resultCode === 1000) {
//            that.getData()
//          } else {
//            message.error('网络错误，请重试')
//          }
//        })
//      }
//    });
//  }

  /**三个开关**/
  handleSwitch() {
    let that = this;
    that.setState({
    	ROUTE_AUDIT_SWITCH_loading: true
    });
    confirm({
      title: '路由总开关',
      content: `是否确认 ${this.state.ROUTE_TRADE_SWITCH === true ? '关闭' : '开启'} 风控路由总开关`,
      onOk() {
        /**改变开关状态**/
    	querySwitchRoute().then(res => {
          if (res.resultCode === 1000) {
            that.setState({
            	ROUTE_AUDIT_SWITCH_loading: false
            });
            that.getData()
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

  /**模态框 - 编辑 - 确认按钮**/
  handleModalEditOk() {
	let data = {
		      id: this.state.modalEditConfigId,
		      dayLimit: this.state.modalEditInputDayLimit !== '' ? this.state.modalEditInputDayLimit : '',
		      sort: this.state.modalEditInputSort !== '' ? this.state.modalEditInputSort : '',
		      weight: this.state.modalEditInputWeight !== '' ? this.state.modalEditInputWeight : '',
		      ios: this.state.ios !== '' ? this.state.ios : '',
		      android: this.state.android !== '' ? this.state.android : '',
		      personReview : this.state.personReview !== '' ? this.state.personReview : '',
		      startTime: this.state.modalEditInputStartTime,
		      endTime: this.state.modalEditInputEndTime
		    };
	for(let p in data){
		if(data[p] === null || data[p] === '' || typeof(data[p]) == "undefined"){
			return;
		}
	}
	this.setState({
	      modalOKLoading: true
	    });
    queryUpdateRouteConfig(data).then(res => {
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

  IOSChange(e) {
	  this.setState({
	      ios: e.target.checked
	    })

	}
  androidChange(e) {
	  this.setState({
	      android: e.target.checked
	    })

	}
  
  personReviewChange(e) {
	  this.setState({
		  personReview: e.target.checked
	  })
	  
  }

  modalEditWeightChange(value) {
    this.setState({
      modalEditInputWeight: value
    })
  }

  modalEditSortChange(value) {
    this.setState({
      modalEditInputSort: value
    })
  }

  modalEditStartTimeChange(time, timeString) {
    this.setState({
      modalEditInputStartTime: timeString?(timeString.split(':')[0] + timeString.split(':')[1] + timeString.split(':')[2]):''
    })
  }

  modalEditEndTimeChange(time, timeString) {
    this.setState({
      modalEditInputEndTime: timeString?(timeString.split(':')[0] + timeString.split(':')[1] + timeString.split(':')[2]):''
    })
  }

  modalEditDayLimitChange(value) {
    this.setState({
      modalEditInputDayLimit: value
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
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '权重等级',
      dataIndex: 'weight',
      key: 'weight',
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
      dataIndex: 'dayLimit',
      key: 'dayLimit',
    }, {
        title: '今日审核金额',
        dataIndex: 'dayAmount',
        key: 'dayAmount',
    }, {
      title: '当前状态',
      dataIndex: 'alive',
      key: 'alive',
      render: (text) => {
        return (
          <div style={{color: text === true ? '#67C23A' : ''}}>
            {text === false ? '已关闭' : text === true ? '已启动' : '--'}
          </div>
        )
      }
    },  {
        title: '支持设备',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>

                {record.ios === true && 'IOS'}&nbsp;&nbsp;&nbsp;{record.android === true && '安卓'}

            </div>
          )
        }

      },
      {
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
            	   this.switchConfigAlive(text, record, index)
               }}>
              {record.alive === true && '关闭'}{record.alive === false && '开启'}
            </a>
          </div>
        )
      }

    }];

    return (
      <div>
        <Card>

          <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <FormItem label={'风控路由总开关'}>
              <Switch checkedChildren="开"
                      unCheckedChildren="关"
                      checked={this.state.ROUTE_AUDIT_SWITCH === true}
                      onChange={this.handleSwitch.bind(this)}
                      loading={this.state.ROUTE_AUDIT_SWITCH_loading}/>
            </FormItem>
            <Button type={'primary'} onClick={()=>{this.refresh()}}>Redis同步数据库</Button>
          </Form>

          <Table
            dataSource={this.state.auditRouteConfigList}
            columns={columnsForRouteTable}
            pagination={true}
            bordered rowKey={record => record.id}
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
                <FormItem label={'排序'} required>
                  <InputNumber value={this.state.modalEditInputSort}
                               onChange={this.modalEditSortChange.bind(this)}
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
                  <InputNumber value={this.state.modalEditInputDayLimit} step={0.01}
                               onChange={this.modalEditDayLimitChange.bind(this)}
                               min={0}/>
                </FormItem>
              </Col>
            </Row>
            <Row>

              <FormItem label={'支持设备'} required>
              <Checkbox checked={this.state.ios} onChange={this.IOSChange.bind(this)}>IOS</Checkbox>
              <Checkbox checked={this.state.android} onChange={this.androidChange.bind(this)}>安卓</Checkbox>
              </FormItem>

          </Row>
          
          <Row>
	          <FormItem label={'人工复审'} required>
	          	<Checkbox checked={this.state.personReview} onChange={this.personReviewChange.bind(this)}></Checkbox>              
	          </FormItem>
          </Row>
          </Form>

        </Modal>
      </div>
    );
  }
}
