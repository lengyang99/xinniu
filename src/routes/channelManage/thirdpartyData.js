import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Table, Modal, Button, Form, DatePicker, Select } from 'antd';
import request from '../../utils/request';
import {connect} from "dva";

const FormItem = Form.Item;
const Option = Select.Option;
@connect(state => ({
  currentUser: state.user,
}))
export default class MerchantManage extends PureComponent {
  state = {
    columns: [
      {
        title: '时间',
        dataIndex: 'date',
        width: '12%',
      },
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        width: '12%',
      },
      {
        title: '注册用户数',
        dataIndex: 'registerCount',
        width: '12%',
      }
    ],
    channelList: [],
    channelId: '',
    tableData: [],
    pg: '',
    formValues: {
      pageSize: 10,
      current: 1
    },
    pageSize: 10,
    current: 1,

    isChannelParter: false
  }

  //获取渠道列表
  getChannelList = () => {
    request('/modules/manage/common/channelList.htm', {
      method: 'GET'
    }).then(res => {
      if(res.resultCode === 1000) {
        this.setState({
          channelList: res.resultData
        })
      }
    })
  };
  componentDidMount () {
    this.getChannelList();
    this.handleStandardTableChange({current: 1, pageSize: 10})
    const {currentUser: {currentUser}} = this.props
    if (currentUser.role == 'channelParter'){
      this.setState({
        isChannelParter: true
      })
    }
  };


  //渠道选择
  searchChannelId =(v) => {
    this.setState({
      channelId: v
    })
  };
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

  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&channelId=${this.state.channelId}`;
    return request('/modules/manage/thirdpartyChannel/channelDataList.htm?' + paramsStr, {
      method: 'GET'
    })
  }


  render () {
    return (
      <PageHeaderLayout title="第三方数据">
        {
          this.state.isChannelParter ? null : <Form layout={'inline'} style={{display: 'flex', alignItems: 'center',}}>
            <FormItem label={'渠道'}>
              <Select defaultValue="" style={{width: 120}}
                      onChange={this.searchChannelId.bind(this)}
              >
                {
                  this.state.channelList.map((c, index) => {
                    return <Option value={c.id} key={index}>{c.name}</Option>
                  })
                }

              </Select>
            </FormItem>
            <Button style={{marginLeft: 30}} onClick={this.handleStandardTableChange.bind(this,{current: 1, pageSize: 10})} >
              搜索
            </Button>
          </Form>
        }
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
      </PageHeaderLayout>
    )
  }
}
