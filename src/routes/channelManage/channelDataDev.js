import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Table, Modal, Button, Form, DatePicker, Select } from 'antd';
import moment from 'moment';
import request from '../../utils/request';
import {message} from "antd/lib/index";

const FormItem = Form.Item;
const Option = Select.Option;

export default class MerchantManage extends PureComponent {
  state = {
    generalizeColumns: [
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        width: '12%',
      },
      {
        title: '注册用户数',
        dataIndex: 'registerCount',
        width: '8%',
      },
      {
        title: '认证用户数',
        dataIndex: 'authCount',
        width: '9%',
      },{
        title: '登录用户数',
        dataIndex: 'loginCount',
        width: '9%',
      },
      {
        title: '绑卡用户数',
        dataIndex: 'bindcardCount',
        width: '9%',
      },
      {
        title: '下单用户数',
        dataIndex: 'orderCount',
        width: '9%',
      },
      {
        title: '审核通过用户数',
        dataIndex: 'auditCount',
        width: '12%',
      },{
        title: '审核通过待确认用户数',
        dataIndex: 'auditPassConfirmCount',
        width: '12%',
      },
      {
        title: '批款用户数',
        dataIndex: 'loanCount',
        width: '12%',
      },
      {
        title: '批款金额',
        dataIndex: 'loanAmount',
        width: '12%',
      },
    ],
    operationColumns: [
      {
        title: '渠道名称',
        dataIndex: 'channelName',
        width: '16%',
      },
      {
        title: '复贷用户数',
        dataIndex: 'reorderCount',
        width: '16%',
      },
      {
        title: '复贷批款用户数',
        dataIndex: 'reloanCount',
        width: '16%',
      },
      {
        title: '复贷批款金额',
        dataIndex: 'reloanAmount',
        width: '16%',
      },
      {
        title: '昨日逾期用户数',
        dataIndex: 'yesterdayOverdueCount',
        width: '16%',
      },
      {
        title: '昨日逾期未还金额',
        dataIndex: 'yesterdayOverdueAmount',
        width: '16%',
      },
    ],
    channelList: [],
    date: '',
    channelId: '',
    tableData: []
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
    this.setState({
      date: moment().format('YYYY-MM-DD')
    });
    this.search(); // 获取表格数据
    this.getChannelList();
  };

  //日期选择
  dateChange = (date, dateString) => {
    this.setState({
      date: dateString
    })
  };

  //日期限制
  disabledDate = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  //渠道选择
  searchChannelId =(v) => {
    this.setState({
      channelId: v
    })
  };

  //搜索按钮  &&  获取表格数据
  search = () => {
    let paramsStr = `date=${this.state.date}&channelId=${this.state.channelId}`
    request('/modules/manage/channelStatistic/list.htm?' + paramsStr, {
      method: 'GET'
    }).then(res => {
      if(res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData
        })
      }
    })
  };

  //导出
  export = () => {
    let paramsStr = `date=${this.state.date}&channelId=${this.state.channelId}`
    let data = this.state.tableData;
    if(data){
      window.location.href ='/modules/manage/channelStatistic/export.htm?'+paramsStr
    }else{
      message.error('没有数据可以导出')
    }
  }


  render () {
    return (
      <PageHeaderLayout title="渠道数据">
        <Form layout={'inline'} style={{display: 'flex', alignItems: 'center',}}>
          <FormItem label={'时间'}>
            <DatePicker onChange={this.dateChange.bind(this)}
                        disabledDate={this.disabledDate.bind(this)}
                        format="YYYY-MM-DD"

            />
          </FormItem>
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
          <Button style={{marginLeft: 30}} onClick={this.search.bind(this)} >
            搜索
          </Button>
          <Button style={{marginLeft: 30}} onClick={this.export.bind(this)}>
            导出
          </Button>
        </Form>
        <h2>推广数据表</h2>
        <Table
          marginTop={20}
          bordered
          columns={this.state.generalizeColumns}
          dataSource={this.state.tableData}
          // pagination={this.state.pg}
          // onChange={this.handleStandardTableChange.bind(this)}
        />
        <h2>运营数据表</h2>
        <Table
          marginTop={20}
          bordered
          columns={this.state.operationColumns}
          dataSource={this.state.tableData}
          // pagination={this.state.pg}
          // onChange={this.handleStandardTableChange.bind(this)}
        />
      </PageHeaderLayout>
    )
  }
}
