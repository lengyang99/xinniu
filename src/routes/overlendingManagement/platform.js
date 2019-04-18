import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Upload, Table, Modal, Button, Form, Input, Select, Radio, message, InputNumber, Tooltip, Checkbox} from 'antd';
import request from '../../utils/request';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@Form.create()
export default class Platform extends PureComponent {
  state = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text, record, index) => {
          return (
            <div>
              {++index}
            </div>
          )
        }
      },
      {
        title: '借款产品名称',
        dataIndex: 'name',
        width: '16%',
      },
      {
        title: '贷款金额',
        dataIndex: 'code',
        key: 'code',
        width: '10%',
      },
      {
        title: '每天最大UV',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '12%',
      },
      {
        title: 'UV',
        dataIndex: 'feeType',
        key: 'feeType',
      },
      {
        title: '产品排序',
        dataIndex: 'rank',
        key: 'rank',
        width: '14%',
      },
      {
        title: '产品状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 0 ? '已上线' : text === 1 ? '未上线' : '--'}
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
                {record.status === 1 && '下线'}{record.status === 0 && '上线'}
              </a>
              &nbsp;&nbsp;&nbsp;
              <a onClick={() => {
                this.showmodalEdit('编辑', record, index)
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

    visible: false,
    action: false,


    editMaxLimit: '',
    editMinLimit: '',


    tamplateList: []
  };


  //切换状态
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

  //搜索名称
  searchPlatformName = (e) => {
    this.setState({
      searchName: e.target.value
    })
  };
  //搜索状态
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


  //=========================================================================


  //编辑按钮处理
  showmodalEdit = (action, r, i) => {

      this.setState({
        action,
        visible: true
      })

  }

  //确认处理
  handleModalOk = () => {
    const {validateFields} = this.props.form
    validateFields((err, fieldsValue) => {
      if (err) return;
      if(fieldsValue.min > fieldsValue.max){
        message.warning('最小额度不得大于最大额度')
        return
      }
      const values = {
        ...fieldsValue
      };
      // console.log(values);
      let jsonParams = {

      };
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      });

    });
  };

  //编辑渠道取消
  handleModalCancel = () => {
    this.setState({
      visible: false,
    })
  };

  //新增按钮
  addPlatform = () => {
    this.setState({
      action: '新增',
      visible: true
    })
  }


  render() {
    const {getFieldDecorator} = this.props.form
    const props = {
      accept: "image/jpg,image/jpeg,image/png",
      name: 'file',
      action: '/modules/manage/repay/imgUpdate.htm',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.resultCode === 1000) {
            message.success(`上传成功`);
            // saveImgUrl(info.file.response.resultData);
          } else {
            message.error(info.file.response.resultData || `上传成功`);
          }

        } else if (info.file.status === 'error') {
          message.error(`上传失败`);
        }
      },
      beforeUpload(file) {
        let reg = new RegExp(/^image\/\jpeg|jpg|png$/, 'i');
        if (!reg.test(file.type)) {
          message.error('请选择jpg,jpeg,png图片格式');
          return false;
        }
        if (file.size / 1048576 <= 2) {
          return true;
        } else {
          message.warning('上传文件不能超过2M');
          return false;
        }
      },
      onRemove() {
        // upload();
      }
    };
    const options = [
      {label: '审核失败页面', value: '1'}
    ]
    return (
      <PageHeaderLayout title="渠道管理">
        <Form layout={'inline'} style={{display: 'flex', alignItems: 'center'}}>
          <FormItem label={'平台名称'}>
            <Input type="text" maxLength='15'
                   onChange={this.searchPlatformName.bind(this)}/>
          </FormItem>
          <FormItem label={'状态'}>
            <Select placeholder="请选择" style={{width: 120}}
                    onChange={this.searchChannelStatus.bind(this)}>
              <Option value="1">已上线</Option>
              <Option value="0">未上线</Option>
            </Select>
          </FormItem>
          <Button onClick={this.searchList.bind(this)}>
            搜索
          </Button>
          <Button onClick={this.addPlatform.bind(this)}>
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
          destroyOnClose = {true}
          title={this.state.action}
          visible={this.state.visible}
          onOk={this.handleModalOk.bind(this)}
          onCancel={this.handleModalCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>

            <FormItem required label={'平台名称'}>
              {getFieldDecorator('platformname', {
                rules: [
                  {
                    max: 20,
                    message: '20字以内',
                    required: true
                  }
                ],
                initialValue: this.state.editChannelName,
              })(
                <Input/>)}
            </FormItem>
            <FormItem required label={'平台链接'}>
              {getFieldDecorator('platformaddress', {
                rules: [
                  {
                    max: 50,
                    message: '50字符以内',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <Input/>)}
            </FormItem>
            <FormItem required label={'平台描述'}>
              {getFieldDecorator('platformdescribe', {
                rules: [
                  {
                    max: 20,
                    message: '20字以内',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <Input maxLength={'20'}/>)}
            </FormItem>
            <FormItem required label={'LOGO'}>
              <Upload {...props}>
                <Button disabled={this.state.upload}>
                  上传
                </Button>
              </Upload>
            </FormItem>
            <div>
              <FormItem required label={'额度范围'}>
                {getFieldDecorator('min', {
                  rules: [
                    {
                      message: '请填入最小额度',
                      required: true
                    }
                  ],
                  initialValue: '',
                })(
                  <InputNumber/>)}--</FormItem><FormItem required>
              {getFieldDecorator('max', {
                rules: [
                  {
                    message: '请填入最大额度',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <InputNumber/>)}
              </FormItem>
            </div>
            <div>
              <FormItem required label={'借款期限'}>
                {getFieldDecorator('timelimit', {
                  rules: [
                    {
                      message: '请填入借款期限',
                      required: true
                    }
                  ],
                  initialValue: '',
                })(
                  <InputNumber maxLength={'6'}/>)}

              </FormItem>
              <FormItem required>
                {getFieldDecorator('timetype', {
                  rules: [
                    {
                      message: '请选择期限类型',
                      required: true
                    }
                  ],
                  initialValue: '',
                })(
                  <Select placeholder="请选择">
                    <Option value="1">天</Option>
                    <Option value="0">月</Option>
                  </Select>)}

              </FormItem>
            </div>

            <FormItem required label={'日费率'}>
              {getFieldDecorator('dayrate', {
                rules: [
                  {
                    message: '请填入日费率',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <InputNumber precision={4} min={0} max={100}/>)}
              %
            </FormItem>
            <FormItem label={'前置费'}>
              {getFieldDecorator('frontmoney', {
                initialValue: '',
              })(
                <InputNumber precision={2} min={0} max={100}/>)}
              %
            </FormItem>
            <FormItem label={'每天最大UV'}>
              {getFieldDecorator('maxuv', {
                initialValue: '',
              })(
                <InputNumber maxLength={6} min={0} max={999999}/>)}

            </FormItem>
            <FormItem required label={'UV单价'}>
              {getFieldDecorator('price', {
                rules: [
                  {
                    message: '请填入uv单价',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <InputNumber maxLength={4} precision={1} min={0} max={1000}/>)}
            </FormItem>
            <FormItem required label={'热线电话'}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    message: '请填入热线电话',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <Input type={'number'}/>)}
            </FormItem>
            <FormItem required label={'排序'}>
              {getFieldDecorator('rank', {
                rules: [
                  {
                    message: '请填入排序',
                    required: true
                  }
                ],
                initialValue: '',
              })(
                <InputNumber/>)}
            </FormItem>
            <FormItem label={'推荐栏目'}>
              {getFieldDecorator('programa', {
                initialValue: '',
              })(
                <Checkbox>审核失败页面</Checkbox>)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
