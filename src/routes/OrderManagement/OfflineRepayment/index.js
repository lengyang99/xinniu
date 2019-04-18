import React, { Component } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { Card, Modal,message} from 'antd';
import SearchBar from './SearchBar';
import TableList from './TableList';
import RepayDetail from '../OrderDetail/RepayDetail';
import OrderModal from '../OrderModal/OrderModal';
import {checkData} from '../../../utils/utils';
import {
  queryRepayList, bizStatusEnum, exportRepay, offlineAuditStatus, cancelOfflineAudit, getRepayPlayByOrderId
  , batchDerateRepay, batchOfflineRepay, offlineRepay, optRepay, derateRepay,
} from '../../../services/order';

export default class OfflineRepayment extends Component {
  state = {
    visible: false,
    selectedRowKeys: [], // 选择行key 
    selectedRows: [], // 选中行
    record: {}, // 当前操作记录
    offStatus: [], // 审核状态列表
    bizStatus: [], //还款状态列表
    offRepayData:[], // 线下还款列表
    repayDetailVisible: false, //还款详情弹框
    page: {}, //列表分页
    searchParams: {}, //列表搜索条件
    loading: false, // 加载状态
    amountPayable: {}, // 应还金额
    amountResult: {}, // 剩余金额
  }
  componentDidMount(){
    // 获取审核状态列表
    offlineAuditStatus({ type: 1 }).then(res => {
      if (res.resultCode === 1000) {
        const data = res.resultData;
        const offStatus = [];
        Object.keys(data).forEach(item => {
          offStatus.push({ value: data[item], key: item });
        })
        this.setState({ offStatus });
      }
    });
    // 获取还款状态列表
    bizStatusEnum({ type: 5 }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({ bizStatus: res.resultData });
      }
    });
  }
  // 获取还款列表数据
  queryRepayData = (params) => {
    this.setState({ loading: true });
    queryRepayList(params).then(res => {
      this.setState({ loading: false })
      if (res.resultCode === 1000) {
        const { resultData, page } = res;
        this.setState({ offRepayData: resultData, page });
      }
    })
  }
  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (err) return;
      const { schuduleNo, phone, realName, status, orderNo,offlineAuditStatus} = values;
      const flag = [phone ,realName, orderNo].find(item=> item && item.trim() !==''); 
      if(!flag){
        message.warn('请从订单号,手机号,姓名中至少选择一个条件查询');
        return 
     }
      const searchParams = {
        ...checkData({schuduleNo, phone, realName, orderNo}),
        offlineAuditStatus: offlineAuditStatus !== '全部' ?  offlineAuditStatus : undefined, 
        status: status !== '全部' ?  status : undefined,
      }
      this.queryRepayData({ currentPage: 1, pageSize: 10, type:2,searchParams: JSON.stringify(searchParams) });
      this.setState({ searchParams: JSON.stringify(searchParams) });
    });
  }
  // 导出
  handleExport = () => {
    exportRepay({
      searchParams: this.state.searchParams
    }).then(res=>{

    })
  }
  // 重置
  handleFormReset = () => {
    this.form.resetFields();
    this.setState({searchParams: ''});
  }
  // 分页查询
  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.queryRepayData({ currentPage: current, pageSize, type:2,searchParams: this.state.searchParams });
  } 
  // 操作
  handleAction = (record) =>　{
    const {action,id,scheduleId} = record;
    let that = this;
    if(action === '查看详情'){
      this.setState({repayDetailVisible:true,record})
    }else if(action === '取消线下入账'){
      Modal.confirm({
        title:'是否取消线下入账',
        onOk(){
          that.hadnleCancelOfflineAudit(id);
        }
      });
      this.setState({record});
    }else{
      // 获取还款计划
      this.setState({ record },()=>{
        const type = action === '线下还款' ? 22 : action === '息费减免' ? 31 : '';
        this.getRepayPlan({amount: 0, scheduleIds: scheduleId,type});});
        this.handleVisibleChange();
    }
  }
  // 进行操作后刷新页面
  handleAfterAction = (res = {}) =>{
    if(res.resultCode === 1000){
      this.setState({selectedRowKeys:[]});
      const {page: {current, pageSize },searchParams} = this.state;
      this.queryRepayData({ currentPage: current, pageSize, type:2,searchParams });
    }
  }
  // 其他操作
  handleOtherAction = (values) => {
    const { record: { id, scheduleId, action, isBatch }, amount } = this.state;
    if (action === '息费减免') {
      if (isBatch) {
        batchDerateRepay({ orderId: id, scheduleIds: scheduleId, ...values, }).then(res => {
           this.handleAfterAction(res);
        });
      } else {
        derateRepay({ orderId: id, scheduleId, ...values, }).then(res => {
          this.handleAfterAction(res);
        });
      }
    } else if (action === '手动代扣') {
      optRepay({ orderId: id, scheduleId, amount:amount || 0 }).then(res => {
         this.handleAfterAction(res);
      });
    } else if (action === '线下还款') {
      if (isBatch) {
        batchOfflineRepay({ orderId: id, scheduleIds: scheduleId, ...values }).then(res => {
          this.handleAfterAction(res);
        });
      } else {
        offlineRepay({ orderId: id, scheduleId, ...values }).then(res => {
          this.handleAfterAction(res);
        });
      }
    }
    this.handleVisibleChange();
  }
  // 取消线下入账
  hadnleCancelOfflineAudit = (orderId) => {
    cancelOfflineAudit({ orderId }).then(res => {
      this.handleAfterAction(res);
    })
  } 
  onAmountChange = (e)=>{
    // 获取还款计划
    const val = e;
    const { record: { scheduleId, action } } = this.state;
    const type = action === '线下还款' ? 22 : action === '息费减免' ? 31 : '';
    if(val === "" || val === null || isNaN(val)){
      this.getRepayPlan({amount: 0, scheduleIds: scheduleId,type},1);
      return;
    }
    this.getRepayPlan({amount: e || 0, scheduleIds: scheduleId,type},1);
 } 
  handleVisibleChange = () => {
    this.setState({visible: !this.state.visible});
  }
  // 批量操作 (批量息费减免， 批量放款)
  handleBatch = (batch) => {
    const { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warn('未勾选还款订单记录');
      return 
    }
    const ids = [];
    selectedRows.forEach(item => {
      ids.push(item.id);
    });
    let flag = false;
    if (ids.length > 1) {
      const id = ids[0];
      flag = ids.find(item => item !== id);
    }
    if (flag) {
      message.warn('请勾选订单号相同的订单');
      return
    }
    const type = batch === 1 ? 22 : batch === 2 ? 31 : '';
    this.getRepayPlan({amount: 0, scheduleIds: selectedRowKeys.toString(),type});
    const params = { id: ids[0], scheduleId: selectedRowKeys.toString(), isBatch: true };
    if (batch === 1) {
      this.setState({ record: { action: '线下还款', ...params } });
    } else if (batch === 2) {
      this.setState({ record: { action: '息费减免', ...params } });
    }
    this.handleVisibleChange();
  }
 // 获取还款计划
 getRepayPlan = (params,type) => {
  const {record: {action}} = this.state;
  getRepayPlayByOrderId(params).then(res => {
    if (res.resultCode === 1000) {
      const { amountInfo, remainAmount , totalAmount  } = res.resultData;
      const dueAmountData = [];
      const restAmountData = [];
      amountInfo.forEach(item=>{
        dueAmountData.push({ label: item[0], value: item[1] });
        restAmountData.push({ label: item[2], value: type === 1 ? item[3] : 0});
      })
      const amountPayable = {
        title: '当期剩余应还金额',
        count: totalAmount,
        data: dueAmountData,
      };

      const amountResult = {
        title: '剩余金额',
        count: type === 1 ? remainAmount : 0,
        data: restAmountData,
      };
      if (action === '手动代扣') {
        this.setState({ amount: totalAmount });
      }
      this.setState({ amountPayable, amountResult});
    }
  })
}
  // 弹框显隐
  handleRepayDetailVisibleChange = () => {
    this.setState({ repayDetailVisible: !this.state.repayDetailVisible });
  }
  render() {
    const {record,visible,offStatus,selectedRowKeys,page,loading,repayDetailVisible,
      bizStatus,offRepayData,amountPayable,amountResult} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys,selectedRows) => { this.setState({ selectedRowKeys,selectedRows}) }
    }
    const tableConfig = {
      rowSelection,
      pagination: page,
      loading,
      rowKey: (record) => record.scheduleId,
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
            bizStatus={bizStatus}
          />
          <TableList
            tableConfig={tableConfig}
            handleBatch={this.handleBatch}
            dataSource={offRepayData}
            handleAction={this.handleAction}
          />
        </Card>
        <OrderModal 
        action={record.action}
        amountPayable={amountPayable}
        amountResult={amountResult}
        onAmountChange={this.onAmountChange} 
        visible={visible}
        onOk={(values) => this.handleOtherAction(values)} 
        onCancel={this.handleVisibleChange}
        />
        <Modal
          title='还款详情'
          width={1075}
          destroyOnClose
          visible={repayDetailVisible}
          onOk={this.handleRepayDetailVisibleChange}
          onCancel={this.handleRepayDetailVisibleChange}>
          <RepayDetail orderId={record.id}/>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
