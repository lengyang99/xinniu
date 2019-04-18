import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Button, Form, Input, Select, Radio, message, InputNumber, Tooltip} from 'antd';
import request from '../../utils/request';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class ChannelManage extends PureComponent {
  state = {
    columns: [
      {
      title: '渠道名称',
      dataIndex: 'name',
      width: '16%',
    },
      {
        title: '渠道编码',
        dataIndex: 'code',
        key: 'code',
        width: '14%',
      },
      {
        title: '注册模板',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '14%',
      },
      {
        title: '注册成本',
        dataIndex: 'feeType',
        key: 'feeType',
        render: (text, record, index) => {
          return (
            <div>
              {record.feeType === 1 ? record.cpa : record.feeType === 2 ? `${record.cpsPersent}% + ${record.cpsFee}` : '--'}
            </div>
          )
        }
      },
      {
        title: '折扣',
        dataIndex: 'discount',
        key: 'discount',
        width: '14%',
      },
      {
        title: '渠道状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 0 ? '已关闭' : text === 1 ? '已启动' : '--'}
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
              <a style={{color: 'red', marginLeft: '10px'}}
                 onClick={() => {
                   this.switchChannelStatus(text, record, index)
                 }}>
                {record.status === 1 && '关闭'}{record.status === 0 && '开启'}
              </a>
              &nbsp;&nbsp;&nbsp;
              <a onClick={() => {
                this.showmodalEdit(text, record, index)
              }}>
                编辑
              </a>
            </div>
          )
        }

      },
    ],
    data: [],
    pg: {},
    formValues: {
      pageSize: 10,
      current: 1
    },

    //搜索数据
    searchName: '',
    searchCode: '',
    searchStatus: '',

    //编辑修改
    editChannelName: '',
    editChannelId: '',
    editChannelCode: '',
    editChannelTemplateId: '',
    editChannelFeeType: '',
    editChannelCpa: '',
    editChannelCpsPersent: '',
    editChannelCpsFee: '',
    editChannelDiscount: '',

    //添加渠道
    addChannelName: '',
    addChannelId: '',
    addChannelCode: '',
    addChannelTemplateId: '',
    addChannelFeeType: '',
    addChannelCpa: '',
    addChannelCpsPersent: '',
    addChannelCpsFee: '',
    addChannelDiscount: '',

    editVisible: false,
    addVisible: false,

    tamplateList: []
  };


  //切换渠道状态
  switchChannelStatus = (t, r, i) => {
    let channelId = r.id;
    request('/modules/manage/channel/triggleStatus.htm', {
      method: 'POST',
      body: `channelId=${r.id}`
    }).then(res => {
      if (res.resultCode == 1000) {
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10});
        message.success('操作成功');
      } else {
        message.error('操作失败')
      }
    })
  }

  //搜索渠道名称
  searchChannelName = (e) => {
    this.setState({
      searchName: e.target.value
    })
  };
  //搜索渠道编码
  searchChannelCode = (e) => {
    this.setState({
      searchCode: e.target.value
    })
  };
  //搜索渠道状态
  searchChannelStatus = (v) => {
    this.setState({
      searchStatus: v
    })
  };
  //搜索渠道列表
  searchList = () => {
    let pageSize = 10;
    let currentPage = 1;
    let searchParams = {};
    if (this.state.searchName) {
      searchParams.name = this.state.searchName
    }
    if (this.state.searchCode) {
      searchParams.code = this.state.searchCode
    }
    if (this.state.searchStatus) {
      searchParams.status = this.state.searchStatus
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
    request('/modules/manage/channel/list.htm?' + paramsStr, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          data: res.resultData,
          pg: res.page
        });
      }

    })
  }

  //获取模板列表
  getTamplateList() {
    return request('/modules/manage/channel/templateList.htm', {
      method: 'GET'
    })
  }

  //获取渠道列表数据
  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let searchParams = {};
    if (this.state.searchName) {
      searchParams.name = this.state.searchName
    }
    if (this.state.searchCode) {
      searchParams.code = this.state.searchCode
    }
    if (this.state.searchStatus) {
      searchParams.status = this.state.searchStatus
    }
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${window.encodeURIComponent(JSON.stringify(searchParams))}`;

    return request('/modules/manage/channel/list.htm?' + paramsStr, {
      method: 'GET'
    })
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

    this.getList(params).then(res => {

      this.setState({
        data: res.resultData,
        pg: res.page
      });
    });

  }

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10})
    this.getTamplateList().then(res => {
      this.setState({
        tamplateList: res.resultData
      })
    })
  };

  //新增模板ID
  addTemplateId = (e) => {
    this.setState({
      addChannelTemplateId: e.target.value,
    });
  };

  //新增注册成本类型
  addFeeType = (e) => {

    this.setState({
      addChannelFeeType: e.target.value,
    });
  };

  //新增cpa
  addCpa = (v) => {

    this.setState({
      addChannelCpa: v,
    });
  };

  //新增cpsPersent
  addCpsPersent = (v) => {

    this.setState({
      addChannelCpsPersent: v,
    });
  };

  //新增cpsFee
  addCpsFee = (v) => {

    this.setState({
      addChannelCpsFee: v,
    });
  };

  //新增折扣
  addDiscount = (v) => {
    this.setState({
      addChannelDiscount: v,
    });
  };

  //新增渠道名称
  addName = (e) => {

    this.setState({
      addChannelName: e.target.value,
    });
  };

  //新增渠道编码
  addCode = (e) => {
    this.setState({
      addChannelCode: e.target.value,
    });
  };

  //新增按钮处理
  showmodalAdd = () => {
    this.setState({
      addVisible: true,
      addChannelName: '',
      addChannelId: '',
      addChannelCode: '',
      addChannelTemplateId: '',
      addChannelFeeType: '',
      addChannelCpa: '',
      addChannelCpsPersent: '',
      addChannelCpsFee: '',
      addChannelDiscount: '',
    })
  }

  //确认新增处理
  handleModalAddOk = () => {
    if (!(this.state.addChannelName && this.state.addChannelCode && this.state.addChannelTemplateId && this.state.addChannelFeeType && this.state.addChannelDiscount)){
      message.warning('星号为必填字段')
      return
    }
    if (!(this.state.addChannelName.trim() && this.state.addChannelCode.trim() && this.state.addChannelTemplateId && this.state.addChannelFeeType && this.state.addChannelDiscount)){
      message.warning('请正确传入对应数据')
      return
    }
    let params = {};
    // param.id = this.state.addChannelId;
    params.name = this.state.addChannelName;
    params.code = this.state.addChannelCode;
    params.templateId = this.state.addChannelTemplateId;
    params.feeType = this.state.addChannelFeeType;
    if (params.feeType == 1) {
      if (this.state.addChannelCpa){
        params.cpa = this.state.addChannelCpa;
      }else{
        message.warning('请填入cpa')
        return
      }
    } else if (params.feeType == 2) {
      if(this.state.addChannelCpsPersent && this.state.addChannelCpsFee){
        params.cpsPersent = this.state.addChannelCpsPersent;
        params.cpsFee = this.state.addChannelCpsFee;
      }else{
        message.warning('请填入完成cps')
        return
      }

    }
    params.discount = this.state.addChannelDiscount;
    params = JSON.stringify(params);
    request('/modules/manage/channel/saveOrUpdate.htm', {
      method: 'POST',
      body: `param=${params}`
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('添加成功');
        this.setState({
          addVisible: false
        })
        this.handleStandardTableChange({current: 1, pageSize: 10});
      } else {
        message.error('添加失败！' + res.resultmessage);
      }
    })
  };

  //新增渠道取消
  handleModalAddCancel = () => {
    this.setState({
      addVisible: false,
      addChannelName: '',
      addChannelId: '',
      addChannelCode: '',
      addChannelTemplateId: '',
      addChannelFeeType: '',
      addChannelCpa: '',
      addChannelCpsPersent: '',
      addChannelCpsFee: '',
      addChannelDiscount: '',
    })
  };


  //=========================================================================

  //编辑模板ID
  editTemplateId = (e) => {

    this.setState({
      editChannelTemplateId: e.target.value,
    });
  };

  //编辑注册成本类型
  editFeeType = (e) => {

    this.setState({
      editChannelFeeType: e.target.value,
    });
  };

  //编辑cpa
  editCpa = (v) => {

    this.setState({
      editChannelCpa: v,
    });
  };

  //编辑cpsPersent
  editCpsPersent = (v) => {

    this.setState({
      editChannelCpsPersent: v,
    });
  };

  //编辑cpsFee
  editCpsFee = (v) => {

    this.setState({
      editChannelCpsFee: v,
    });
  };

  //编辑折扣
  editDiscount = (v) => {

    this.setState({
      editChannelDiscount: v,
    });
  };

  // //编辑渠道名称
  // editName = (e) => {
  //   this.setState({
  //     addChannelName: e.target.value,
  //   });
  // };
  //
  // //编辑渠道编码
  // editCode = (e) => {
  //   this.setState({
  //     addChannelCode: e.target.value,
  //   });
  // };

  //编辑按钮处理
  showmodalEdit = (t, r, i) => {
    this.setState({
      editVisible: true,
      editChannelName: r.name,
      editChannelId: r.id,
      editChannelCode: r.code,
      editChannelTemplateId: r.templateId,
      editChannelFeeType: r.feeType,
      editChannelDiscount: r.discount,
    });
    if (r.feeType == 1) {
      this.setState({
        editChannelCpa: r.cpa,
        editChannelCpsPersent: '',
        editChannelCpsFee: '',
      })
    } else if (r.feeType == 2) {
      this.setState({
        editChannelCpa: '',
        editChannelCpsPersent: r.cpsPersent,
        editChannelCpsFee: r.cpsFee,
      })
    }
  }

  //确认编辑处理
  handleModalEditOk = () => {
    if (!this.state.editChannelDiscount){
      message.warning('请填入折扣')
      return
    }
    if (this.state.editChannelFeeType == 1){
      if (!this.state.editChannelCpa){
        message.warning('请填入cpa')
        return
      }
    }else{
      if (!this.state.editChannelCpsPersent || !this.state.editChannelCpsFee){
        message.warning('请完整填入cps')
        return
      }
    }
    this.setState({
      editVisible: false
    })
    let params = {};
    params.id = this.state.editChannelId;
    params.name = this.state.editChannelName;
    params.code = this.state.editChannelCode;
    params.templateId = this.state.editChannelTemplateId;
    params.feeType = this.state.editChannelFeeType;
    if (params.feeType == 1) {
      params.cpa = this.state.editChannelCpa;
    } else if (params.feeType == 2) {
      params.cpsPersent = this.state.editChannelCpsPersent;
      params.cpsFee = this.state.editChannelCpsFee;
    }
    ;
    params.discount = this.state.editChannelDiscount;
    params = JSON.stringify(params);
    request('/modules/manage/channel/saveOrUpdate.htm', {
      method: 'POST',
      body: `param=${params}`
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('修改成功');
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10});
      } else {
        message.error('修改失败！' + res.resultmessage);
      }
    })
  };

  //编辑渠道取消
  handleModalEditCancel = () => {
    this.setState({
      editVisible: false,
      editChannelName: '',
      editChannelId: '',
      editChannelCode: '',
      editChannelTemplateId: '',
      editChannelFeeType: '',
      editChannelCpa: '',
      editChannelCpsPersent: '',
      editChannelCpsFee: '',
      editChannelDiscount: '',
    })
  };

  render() {
    return (
      <PageHeaderLayout title="渠道管理">
        <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          <FormItem label={'渠道名称'}>
            <Input type="text" maxLength='15'
                   onChange={this.searchChannelName.bind(this)}/>
          </FormItem>
          <FormItem label={'渠道编码'} style={{marginLeft: -50}}>
            <Input type="text" maxLength='15'
                   onChange={this.searchChannelCode.bind(this)}/>
          </FormItem>
          <FormItem label={'渠道状态'} style={{marginLeft: -50}}>
            <Select defaultValue="" style={{width: 120}}
                    onChange={this.searchChannelStatus.bind(this)}>
              <Option value="1">开启</Option>
              <Option value="0">关闭</Option>
            </Select>
          </FormItem>
          <Button style={{marginLeft: -60}} onClick={this.searchList.bind(this)}>
            搜索
          </Button>
          <Button style={{marginLeft: -60}} onClick={this.showmodalAdd.bind(this)}>
            新增
          </Button>
        </Form>
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          title="新增渠道"
          visible={this.state.addVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>

            <FormItem required label={'渠道名称'}>
              <Input maxLength="20" value={this.state.addChannelName}
                     onChange={this.addName.bind(this)}
              />
            </FormItem>
            <FormItem required label={'渠道编码'}>
              <Input maxLength="10" value={this.state.addChannelCode}
                     onChange={this.addCode.bind(this)}
              />
            </FormItem>
            <FormItem required label={'注册模板'}>
              <RadioGroup value={this.state.addChannelTemplateId}
                          onChange={this.addTemplateId.bind(this)}>
                {
                  this.state.tamplateList.map((t, index) => {
                    return <div style={{display: 'inline-block', marginRight: '50px'}} key={index}>
                      <img src={t.image} alt="" style={{width: '100px', display: 'block'}}/>
                      <Radio value={t.id} key={t.id}>
                        {t.name}
                      </Radio>
                    </div>
                  })
                }
              </RadioGroup>
            </FormItem>
            <FormItem required label={'注册成本'}>
              <RadioGroup style={{marginLeft: '80px'}}
                          value={this.state.addChannelFeeType}
                          onChange={this.addFeeType.bind(this)}>
                <Radio value={1} style={{display: 'inline-block'}}>
                  cpa&nbsp;
                  <Tooltip title="3位正整数" trigger='focus'>
                  <InputNumber min={1} max={999} step={1} precision={0} style={{width: '30%'}}
                         value={this.state.addChannelCpa}
                         onChange={this.addCpa.bind(this)}
                         disabled={this.state.addChannelFeeType == 2}/>
                  </Tooltip>
                </Radio>
                <Radio value={2}>
                  cps&nbsp;
                  <Tooltip title="小于100的整数+1位小数" trigger='focus'>
                  <InputNumber min={0} max={99.9} step={0.1} precision={1} style={{width: '30%'}}
                         value={this.state.addChannelCpsPersent}
                         onChange={this.addCpsPersent.bind(this)}
                         disabled={this.state.addChannelFeeType == 1}/>
                  </Tooltip>% +
                  <Tooltip title="小于100的整数+1位小数" trigger='focus'>
                  <InputNumber min={0} max={99.9} step={0.1} precision={1} style={{width: '30%'}}
                         value={this.state.addChannelCpsFee}
                         onChange={this.addCpsFee.bind(this)}
                         disabled={this.state.addChannelFeeType == 1}/>
                  </Tooltip>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem required label={'折扣'}>
              <Tooltip title="0-1之间2位小数" trigger='focus'>
                <InputNumber min={0} max={1} step={0.01} precision={2} value={this.state.addChannelDiscount}
                     onChange={this.addDiscount.bind(this)}/>
              </Tooltip>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="编辑"
          visible={this.state.editVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>

            <FormItem required label={'渠道名称'}>
              <Input maxLength="20" value={this.state.editChannelName} disabled={true}/>
            </FormItem>

            <FormItem required label={'渠道编码'}>
              <Input disabled={true} maxLength="10" value={this.state.editChannelCode}/>
            </FormItem>
            <FormItem required label={'注册模板'}>
              <RadioGroup value={this.state.editChannelTemplateId}
                          onChange={this.editTemplateId.bind(this)}>
                {
                  this.state.tamplateList.map((t, index) => {
                    return <div style={{display: 'inline-block', marginRight: '50px'}} key={index}>
                      <img src={t.image} alt="" style={{width: '100px', display: 'block'}}/>
                      <Radio value={t.id} key={t.id}>
                        {t.name}
                      </Radio>
                    </div>
                  })
                }
              </RadioGroup>
            </FormItem>
            <FormItem required label={'注册成本'}>
              <RadioGroup style={{marginLeft: '80px'}}
                          value={this.state.editChannelFeeType}
                          onChange={this.editFeeType.bind(this)}>
                <Radio value={1} style={{display: 'inline-block'}}>
                  cpa&nbsp;
                  <Tooltip title="3位正整数" trigger='focus'>
                  <InputNumber min={1} max={999} step={1} precision={0} style={{width: '30%'}}
                         value={this.state.editChannelCpa}
                         onChange={this.editCpa.bind(this)}
                         disabled={this.state.editChannelFeeType == 2}/>
                  </Tooltip>
                </Radio>
                <Radio value={2}>
                  cps&nbsp;
                  <Tooltip title="小于100的整数+1位小数" trigger='focus'>
                    <InputNumber min={0} max={99.9} step={0.1} precision={1} style={{width: '30%'}}
                         value={this.state.editChannelCpsPersent}
                         onChange={this.editCpsPersent.bind(this)}
                         disabled={this.state.editChannelFeeType == 1}/>
                  </Tooltip>% +
                  <Tooltip title="小于100的整数+1位小数" trigger='focus'>
                    <InputNumber min={0} max={99.9} step={0.1} precision={1} style={{width: '30%'}}
                         value={this.state.editChannelCpsFee}
                         onChange={this.editCpsFee.bind(this)}
                                 disabled={this.state.editChannelFeeType == 1}/></Tooltip>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem required label={'折扣'} style={{alignSelf:'flex-start'}}>
              <Tooltip title="0-1之间2位小数" trigger='focus'>
                <InputNumber min={0} max={1} step={0.01} precision={2}
                             value={this.state.editChannelDiscount}
                     onChange={this.editDiscount.bind(this)}/>
              </Tooltip>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
