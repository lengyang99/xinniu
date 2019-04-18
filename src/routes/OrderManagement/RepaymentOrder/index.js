import React, { Component } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { Card, Modal, message } from 'antd';
import SearchBar from './SearchBar';
import TableList from './TableList';
import RepayDetail from '../OrderDetail/RepayDetail';
import OrderModal from '../OrderModal/OrderModal';
import {checkData} from '../../../utils/utils';
import {
  queryRepayList, bizStatusEnum, exportRepay, offlineAuditStatus, cancelOfflineAudit, getRepayPlayByOrderId
  , batchDerateRepay, batchOfflineRepay, offlineRepay, optRepay, derateRepay,repayRecordAmount
} from '../../../services/order';
import { isMoment } from 'moment';

/**
 *
 *
 * @export
 * @class OrderManagement
 * @extends {Component}
 * @description 还款订单 还款订单 由订单列表 订单搜索栏 还款详情 等组件构成
 */
export default class RepaymentOrder extends Component {
  state = {
    visible: false,
    repayDetailVisible: false, // 控制还款详情的显隐
    selectedRowKeys: [], // 勾选记录的key
    selectedRows: [], // 勾选记录
    repayData: [], // 还款列表数据
    page: {}, // 分页信息
    searchParams: '', // 搜素条件
    loading: false, // 加载状态
    record: {}, // 当前操作记录
    offStatus: [], // 审核状态列表
    bizStatus: [], // 还款状态列表
    amountPayable: {}, // 应还金额
    amountResult: {}, // 剩余金额
    amount: '',  // 手动代扣金额
    isBatch: false, //是否批量
    repayRecordTotal: '', //还款总额
  }
  componentDidMount() {
    // this.queryRepayData({ currentPage: 1, pageSize: 10, searchParams: '' });
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
    repayRecordAmount().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ repayRecordTotal: res.resultData });
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
        this.setState({ repayData: resultData, page });
      }
    })
  }
  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (err) return;
      const { schuduleNo, phone, realName, offlineAuditStatus, status, repayTime, realRepayTime, orderNo } = values;
      const flag = [phone ,realName,orderNo].find(item=> item && item.trim() !==''); 
      const flag2 = (!repayTime || repayTime.length ===0)  && (!realRepayTime || realRepayTime.length ===0);
      if (!flag && flag2) {
        message.warn('请从订单号,手机号,姓名中至少选择一个条件查询');
        return
      }
      if(realRepayTime && isMoment(realRepayTime[0])){
        const days =realRepayTime[1].diff(realRepayTime[0],'days');
        if(days>30){
          message.warn('实际还款日查询时间段不得大于30天');
          return 
        }
      }
      if(repayTime && isMoment(repayTime[0])){
        const days =repayTime[1].diff(repayTime[0],'days');
        if(days>30){
          message.warn('账单日查询时间段不得大于30天');
          return 
        }
      }  
      const searchParams = {
        ...checkData({schuduleNo, phone, realName,orderNo}),
        status: status !== '全部' ? status : undefined,
        offlineAuditStatus: offlineAuditStatus !== '全部' ? offlineAuditStatus : undefined,
        realRepayStartTime: realRepayTime && isMoment(realRepayTime[0]) ? realRepayTime[0].format('YYYY-MM-DD 00:00:00') : undefined,
        realRepayEndTime: realRepayTime && isMoment(realRepayTime[1]) ? realRepayTime[1].format('YYYY-MM-DD 23:59:59') : undefined,
        repayStartTime: repayTime && isMoment(repayTime[0]) ? repayTime[0].format('YYYY-MM-DD 00:00:00') : undefined,
        repayEndTime: repayTime && isMoment(repayTime[1]) ? repayTime[1].format('YYYY-MM-DD 23:59:59') : undefined,
      }
      this.queryRepayData({ currentPage: 1, pageSize: 10, searchParams: JSON.stringify(searchParams) });
      this.setState({ searchParams: JSON.stringify(searchParams) });
    });
  }
  // 导出
  handleExport = () => {
    exportRepay({
      searchParams: this.state.searchParams
    }).then(res => {

    })
  }
  // 重置
  handleFormReset = () => {
    this.form.resetFields();
    this.setState({ searchParams: '' });
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
  // 进行操作后刷新页面
  handleAfterAction = (res = {}) =>{
    if(res.resultCode === 1000){
      this.setState({selectedRowKeys:[],selectedRows:[]});
      const {page: {current, pageSize },searchParams} = this.state;
      this.queryRepayData({ currentPage: current, pageSize,searchParams });
    }
  }  
  // 操作
  handleAction = (record) => {
    const { action, id, scheduleId } = record;
    let that = this;
    if (action === '查看详情') {
      this.setState({ repayDetailVisible: true,record})
    } else if (action === '取消线下入账') {
      Modal.confirm({
        title: '是否取消线下入账',
        onOk() {
          that.hadnleCancelOfflineAudit(id);
        }
      });
      this.setState({ record });
    } else {
      // 获取还款计划
      this.setState({ record },()=>{
        const type = action === '线下还款' ? 22 : action === '息费减免' ? 31 : '';
        this.getRepayPlan({amount: 0, scheduleIds: scheduleId,type});});
        this.handleVisibleChange();
    }
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
          restAmountData.push({ label: item[2], value: type === 1 ? item[3] : 0 });
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
  // 分页查询
  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.queryRepayData({ currentPage: current, pageSize, searchParams: this.state.searchParams });
  }
  // 弹框显隐
  handleVisibleChange = () => {
    this.setState({ visible: !this.state.visible, isBatch: false });
  }
  // 弹框显隐
  handleRepayDetailVisibleChange = () => {
    this.setState({ repayDetailVisible: !this.state.repayDetailVisible });
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
  render() {
    const { record, visible, repayDetailVisible, selectedRowKeys, repayData, page, loading,
      offStatus, bizStatus, amountPayable, amountResult, repayRecordTotal} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => { this.setState({ selectedRowKeys, selectedRows }) }
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
            dataSource={repayData}
            handleAction={this.handleAction}
            handleBatch={(batch) => { this.handleBatch(batch) }}
          />
           <div>
             <span>今日还款成功总额：</span><span style={{color: 'rgb(55,113,251)'}}>{repayRecordTotal.todayRepay || 0}</span>
          <span>元，累计还款成功总额：</span><span style={{color: 'rgb(55,113,251)'}}>{repayRecordTotal.totalRepay || 0}</span><span>元</span></div>
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
          <RepayDetail orderId={record.id} />
        </Modal>
      </PageHeaderLayout>
    )
  }
}
