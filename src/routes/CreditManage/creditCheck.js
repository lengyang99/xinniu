import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Button, Form, Select, DatePicker, Input, message} from 'antd';
import request from '../../utils/request';
import Carousel from '../../components/CreditManage/Carousel'
import moment from 'moment';


const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class MerchantManage extends PureComponent {
  state = {
    visible: false,
    columns: [
      {
        title: '贷款订单编号',
        dataIndex: 'orderNo',
        width: '16%',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '14%',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: '14%',
      },
      {
        title: '类型',
        dataIndex: 'authType',
        key: 'authType',
        render: (text, record, index) => {
          return (
            <div>
              {text === 10 ? '房产认证' : text === 20 ? '社保认证' : text === 30 ? '公积金认证' : text === 40 ? '网银认证' : '--'}
            </div>
          )
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '14%',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: '14%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 10 ? '待审核' : text === 20 ? '审核失败' : '--'}
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
              <a style={{color: 'blue', marginLeft: '10px'}}
                 onClick={() => {
                   this.action(text, record, index)
                 }}>
                {record.status === 20 && '查看'}{record.status === 10 && '审核'}
              </a>
            </div>
          )
        }

      },
    ],
    formValues: {
      pageSize: 10,
      current: 1
    },
    tableData: [],

    phone: '',
    name: '',
    status: '',
    startDate: '',
    endDate: '',

    imgList: [],
    authType: '',
    checkVisible: false,
    checkName: '',
    checkStatus: '',
    checkId: ''
  };

  //搜索手机
  searchPhone = (e) => {

    this.setState({
      phone: e.target.value
    })
  };

  //搜索姓名
  searchName = (e) => {

    this.setState({
      name: e.target.value
    })
  };
  //搜索状态
  searchStatus = (v) => {

    this.setState({
      status: v
    })
  };
  //搜索时间
  dateChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      startDate: dateString[0] + ' 00:00:00',
      endDate: dateString[1] + ' 23:59:59',
    })
  };

  //审核查看
  action = (t, r, i) => {
    this.getImg(r.id).then(res => {
      if(res.resultCode === 1000) {
        this.setState({
          imgList : res.resultData,
          checkVisible: true,
          authType: r.authType,
          checkName: r.name,
          checkStatus: r.status,
          checkId: r.id
        })
      }
    })
  };

  handleModalAddOk = () => {
    this.setState({
      imgList: [],
      authType: '',
      checkVisible: false,
      checkName: '',
      checkStatus: '',
      checkId: ''
    })
  };

  handleModalAddCancel =() => {
    this.setState({
      imgList: [],
      authType: '',
      checkVisible: false,
      checkName: '',
      checkStatus: '',
      checkId: ''
    })
  };

  //审核不通过
  checkFaild = () => {
    let params = `id=${this.state.checkId}`;
    request('/modules/manage/creditAuth/creditScoreAuthAudit.htm?' + params, {
      method: 'GET'
    }).then(res => {
      if(res.resultCode === 1000){
        message.success('操作成功');
        this.handleModalAddCancel();
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
      }
    })
  };

  //列表导出
  handleExport = () =>　{
    let searchParams = {};
    if (this.state.name) {
      searchParams.name = this.state.name
    }
    if (this.state.phone) {
      searchParams.phone = this.state.phone
    }
    if (this.state.status) {
      searchParams.status = this.state.status
    }
    if (this.state.startDate) {
      searchParams.startTime= this.state.startDate
    }
    if (this.state.endDate) {
      searchParams.endTime = this.state.endDate
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `searchParams=${encodeURIComponent(searchParams)}`;
    window.location.href = '/modules/manage/creditAuth/export.htm?' + paramsStr
  }



  //获取图片
  getImg = (id) => {
    let paramsStr = `id=${id}`;
    return request('/modules/manage/creditAuth/creditScoreAuthDetail.htm?' + paramsStr, {
      method: 'GET'
    })
  }


  //获取表格数据
  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let searchParams = {};
    if (this.state.name) {
      searchParams.name = this.state.name
    }
    if (this.state.phone) {
      searchParams.phone = this.state.phone
    }
    if (this.state.status) {
      searchParams.status = this.state.status
    }
    if (this.state.startDate) {
      searchParams.startTime= this.state.startDate
    }
    if (this.state.endDate) {
      searchParams.endTime = this.state.endDate
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;


    return request('/modules/manage/creditAuth/creditScoreAuth.htm?' + paramsStr, {
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
      if (res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    });
  };

  //搜索按钮
  searchList = () => {
    let pageSize = 10;
    let currentPage = 1;
    let searchParams = {};
    if (this.state.name) {
      searchParams.name = this.state.name
    }
    if (this.state.phone) {
      searchParams.phone = this.state.phone
    }
    if (this.state.status) {
      searchParams.status = this.state.status
    }
    if (this.state.startDate) {
      searchParams.startTime= this.state.startDate
    }
    if (this.state.endDate) {
      searchParams.endTime = this.state.endDate
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
    request('/modules/manage/creditAuth/creditScoreAuth.htm?' + paramsStr, {
      method: 'GET'
    }).then(res => {
      if(res.resultCode === 1000){
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }

    })
  };

  //重置按钮
  resetSearch = () => {
    const {resetFields} = this.props.form
    this.setState({
      phone: '',
      name: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    resetFields();
    this.handleStandardTableChange({current: 1, pageSize: 10})
  };

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10})
  };

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <PageHeaderLayout title="信用审核">
        <Form layout={'inline'}
              style={{display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between'}}>
          <FormItem label={'手机'}>
            <Input type="text"
                   value={this.state.phone}
                   onChange={this.searchPhone.bind(this)}
            />
          </FormItem>
          <FormItem label={'姓名'} style={{marginLeft: -50}}>
            <Input type="text"
                   value={this.state.name}
                   onChange={this.searchName.bind(this)}
            />
          </FormItem>
          <FormItem label={'创建时间'} style={{marginLeft: -50}}>
            {getFieldDecorator('RangePicker')
            (<RangePicker
              onChange={this.dateChange.bind(this)}
              format={'YYYY-MM-DD'}
            />)
            }
          </FormItem>
          <FormItem label={'状态'} style={{marginLeft: -50}}>
            <Select defaultValue="" style={{width: 120}}
                    value={this.state.status}
                    onChange={this.searchStatus.bind(this)}
            >
              <Option value="10">待审核</Option>
              <Option value="20">审核失败</Option>
            </Select>
          </FormItem>
          <Button style={{marginLeft: -60}}
                  onClick={this.searchList.bind(this)}
          >
            搜索
          </Button>
          <Button style={{marginLeft: -60}}
                  onClick={this.resetSearch.bind(this)}
          >
            重置
          </Button>
          <Button style={{marginLeft: -60}}
                  onClick={this.handleExport.bind(this)}
          >
            导出
          </Button>
        </Form>
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          destroyOnClose={true}
          title={this.state.checkStatus === 10 ? '审核' : this.state.checkStatus === 20 ? '查看' : '--'}
          visible={this.state.checkVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <FormItem label={'姓名'} >
              <Input maxLength="20"
                     value={this.state.checkName}
                     disabled
              />
            </FormItem>
            <Carousel imgList={this.state.imgList} authType={this.state.authType}/>
            {
              this.state.checkStatus === 10 ? <Button type="danger" style={{marginTop: 20}}
              onClick={this.checkFaild.bind(this)}>不通过</Button> : null
            }

          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
