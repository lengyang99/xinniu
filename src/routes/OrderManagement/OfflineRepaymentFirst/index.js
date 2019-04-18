import React, { Component } from 'react';
import { Card } from 'antd';
import SearchBar from './SearchBar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from './TableList';
import OrderModal from '../OrderModal/OrderModal';
import {checkData} from '../../../utils/utils';
import { offlineAudit, updateOfflineAuditStatus,offlineAuditStatus,offlineAuditExport,
  offlineRepyaTypeEnum,getRepayPlayByOrderId} from '../../../services/order';
import { isMoment } from 'moment';

export default class OfflineRepaymentFirst extends Component {
  state = {
    record: {}, // 弹框初始数据,
    visible: false, 
    loading: false,
    searchParams: '', //搜索条件
    page: {}, //分页
    offData: [], // 初审列表
    offStatus: [],  //审核状态列表
    offlineRepyaType: [], // 入账类型
    amountPayable: {}, // 应还金额
    amountResult: {}, // 剩余金额
  }
  componentDidMount() {
     this.queryOfflineAudit({ currentPage: 1, pageSize: 10, searchParams: '' });
    // 获取审核状态列表
    offlineAuditStatus({ type: 2 }).then(res => {
      if (res.resultCode === 1000) {
        const data = res.resultData;
        const offStatus = [];
        Object.keys(data).forEach(item => {
          offStatus.push({ value: data[item], key: item });
        })
        this.setState({ offStatus });
      }
    });
    // 线下还款初审 入账类型
    offlineRepyaTypeEnum().then(res => {
      if (res.resultCode === 1000) {
        const data = res.resultData;
        const offlineRepyaType = [];
        Object.keys(data).forEach(item => {
          offlineRepyaType.push({ value: data[item], key: item });
        })
        this.setState({ offlineRepyaType});
      }
    })
  }
  // 查询线下收款初审列表
  queryOfflineAudit = (params) => {
    this.setState({ loading: true });
    offlineAudit(params).then((res) => {
      this.setState({ loading: false });
      if (res.resultCode === 1000) {
        const { resultData, page } = res;
        this.setState({ offData: resultData, page });
      }
    });
  }
  // 分页查询
  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.queryOfflineAudit({ currentPage: current, pageSize, searchParams: this.state.searchParams });
  };

  onVisibleChange = () => {
    this.setState({ visible: !this.state.visible });
  }

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (err) return;
      const { scheduleNo, phone, name, type, status, orderNo, time} = values;
      const searchParams = {
        ...checkData({scheduleNo, phone, name,orderNo}),
        type: type !== '全部' ?  type : undefined,
        status: status !== '全部' ?  status : undefined,
        startTime: time && isMoment(time[0]) ? time[0].format('YYYY-MM-DD 00:00:00') : undefined,
        endTime: time && isMoment(time[1])? time[1].format('YYYY-MM-DD 23:59:59') : undefined,
      }
      this.queryOfflineAudit({ currentPage: 1, pageSize: 10, searchParams: JSON.stringify(searchParams) });
      this.setState({ searchParams: JSON.stringify(searchParams) });
    });
  }
  // 导出
  handleExport = () => {
    offlineAuditExport({
      searchParams: this.state.searchParams
    }).then(res=>{

    })
  }
  // 重置
  handleFormReset = () => {
    this.form.resetFields();
    this.setState({searchParams: ''});
  }
  // 操作
  handleAction = (record) =>　{
    const {id} =record;
    this.getRepayPlan({offlineAuditId: id });
    this.setState({record});
  }
  handleVisibleChange = () => {
    this.setState({visible: !this.state.visible});
  }
 // 获取还款计划
 getRepayPlan = (params) => {
  const {record: {action}} = this.state;
  getRepayPlayByOrderId(params).then(res => {
    if (res.resultCode === 1000) {
      const { amountInfo, remainAmount , totalAmount  } = res.resultData;
      const dueAmountData = [];
      const restAmountData = [];
      amountInfo.forEach(item=>{
        dueAmountData.push({ label: item[0], value: item[1] });
        restAmountData.push({ label: item[2], value: item[3]});
      })
      const amountPayable = {
        title: '当期剩余应还金额',
        count: totalAmount,
        data: dueAmountData,
      };

      const amountResult = {
        title: '剩余金额',
        count: remainAmount,
        data: restAmountData,
      };
      if (action === '手动代扣') {
        this.setState({ amount: totalAmount });
      }
      this.setState({ amountPayable, amountResult, visible: !this.state.visible });
    }
  })
}
  onOk = (values) => {
    this.modifyOfflineAuditStatus(40);
  }
  onRefuse= (values) => {
    this.modifyOfflineAuditStatus(31,values);
  }
  modifyOfflineAuditStatus = (status,values = {}) =>{
    const {record: {id},page:{current,pageSize},searchParams} = this.state;
    updateOfflineAuditStatus({id,status,...values}).then(res=>{
      if(res.resultCode === 1000){
        this.queryOfflineAudit({ currentPage: current, pageSize, searchParams});
        this.handleVisibleChange();
       }
    });
  }
  render() {
    const { offData, loading, record, visible, page, 
      offStatus, offlineRepyaType,amountPayable,amountResult} = this.state;
    const tableConfig = {
      pagination: page,
      loading,
      rowKey: (record) => record.id,
      onChange: (pagination) => this.handleTableChange(pagination),
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
        <SearchBar
            ref={ref => this.form = ref}
            handleSearch={(e) => { this.handleSearch(e) }}
            handleFormReset={this.handleFormReset}
            handleExport={this.handleExport}
            offStatus={offStatus}
            offlineRepyaType={offlineRepyaType}
          />
          <TableList
            tableConfig={tableConfig}
            dataSource={offData}
            handleAction={this.handleAction}
          />
        </Card>
        <OrderModal 
        action={record.action} 
        visible={visible}
        record={record}
        amountPayable={amountPayable}
        amountResult={amountResult}  
        onCancel={this.handleVisibleChange}
        onRefuse={(values)=>this.onRefuse(values)}
        onOk={(values)=>this.onOk(values)}
        />
      </PageHeaderLayout>
    );
  }
}
