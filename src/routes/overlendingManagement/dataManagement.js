import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Button, Form, Input, Select, Radio, message, InputNumber, Tooltip, Upload, Checkbox} from 'antd';
import request from '../../utils/request';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@Form.create()
export default class DataManagement extends PureComponent {
  state = {
    todayColumns: [
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
        title: '平台名称',
        dataIndex: 'name',
        width: '16%',
      },
      {
        title: '今日最大UV',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '12%',
      },
      {
        title: '当前UV',
        dataIndex: 'feeType',
        key: 'feeType',
      },
      {
        title: 'UV单价',
        dataIndex: 'rank',
        key: 'rank',
        width: '14%',
      },
      {
        title: '当前合计收益',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
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
    historyColumns: [
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
        title: '平台名称',
        dataIndex: 'name',
        width: '16%',
      },
      {
        title: '累计最大UV',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '12%',
      },
      {
        title: 'UV单价',
        dataIndex: 'rank',
        key: 'rank',
        width: '14%',
      },
      {
        title: '累计上线天数',
        dataIndex: 'feeType',
        key: 'feeType',
      },
      {
        title: '预计收益',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={() => {
                this.showDetails()
              }}>
                查看详情
              </a>
            </div>
          )
        }

      },
    ],
    historyDetailsColumns: [
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
        title: '平台名称',
        dataIndex: 'name',
        width: '16%',
      },
      {
        title: '时间',
        dataIndex: 'templateName',
        key: 'templateName',
        width: '12%',
      },
      {
        title: 'UV总数',
        dataIndex: 'rank',
        key: 'rank',
        width: '14%',
      },
      {
        title: 'UV单价',
        dataIndex: 'feeType',
        key: 'feeType',
      },
      {
        title: '预计收益',
        dataIndex: 'status',
        key: 'status'
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

    searchStatus: '',


    visible: false,
    detailsModal: false,

    tamplateList: []
  };

  //查看详情按钮
  showDetails = () => {
    this.setState({
      detailsModal: true
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


  //编辑按钮处理
  showmodalEdit = (action, r, i) => {

    this.setState({
      action,
      visible: true
    })

  }

  //确认编辑处理
  handleModalOk = () => {
    const {validateFields} = this.props.form
    validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.min > fieldsValue.max) {
        message.warning('最小额度不得大于最大额度')
        return
      }
      const values = {
        ...fieldsValue
      };
      // console.log(values);
      let jsonParams = {};
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      });

    });
  };

  //编辑取消
  handleModalCancel = () => {
    this.setState({
      visible: false,
    })
  };

  handleDetailsCancel = () => {
    this.setState({
      detailsModal:false
    })
  }

  toNew = () => {
    this.props.history.push('/new')
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
    return (
      <PageHeaderLayout title="渠道管理">
        <Button onClick={this.toNew.bind(this)}>哈哈哈</Button>
        <h3>今日平台数据</h3>
        <Table
          marginTop={20}
          bordered
          columns={this.state.todayColumns}
          dataSource={this.state.data}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <h3>历史平台数据</h3>
        <Table
          marginTop={20}
          bordered
          columns={this.state.historyColumns}
          dataSource={this.state.data}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          destroyOnClose={true}
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
        <Modal
          width={1100}
          destroyOnClose={true}
          title={this.state.action}
          visible={this.state.detailsModal}
          onCancel={this.handleDetailsCancel.bind(this)}
          footer={null}
        >
          <Table
            marginTop={50}
            bordered
            columns={this.state.historyDetailsColumns}
            dataSource={this.state.data}
            pagination={this.state.pg}
            onChange={this.handleStandardTableChange.bind(this)}
          />
          合计UV数3000，预计收益XXX元
        </Modal>
      </PageHeaderLayout>
    )
  }
}
