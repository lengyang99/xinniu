import React, { Component } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UserInfoDetail from '../OrderDetail/UserInfoDetail';
import RepayDetail from '../OrderDetail/RepayDetail';
import LoanDetail from '../OrderDetail/LoanDetail';
import {checkData} from '../../../utils/utils';
import {
  queryBorrowOrder, queryUserDetail, manualReview, auditorList, tongrongContract, auditQuery,
  againAudit, bathAgainAudit, bizStatusEnum, getProdLine, orderListExport
} from '../../../services/order';
import { Card, Modal, Button, Tabs, message } from 'antd';
import SearchBar from './SearchBar';
import TableList from './TableList';
import moment, { isMoment } from 'moment';

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const defaultSearch = {
  createTimeStart: moment().format('YYYY-MM-DD 00:00:00'),
  createTimeEnd: moment().format('YYYY-MM-DD 23:59:59'),
}
const defaultPage = {
  current: 1,
  pageSize: 10
}
/**
 *
 *
 * @export
 * @class OrderManagement
 * @extends {Component}
 * @description 货款订单 货款订单 由订单列表 订单搜索栏 用户详情 放款详情 还款详情 放款计划等组件构成
 */
export default class OrderManagement extends Component {
  state = {
    visible: false,
    selectedRowKeys: [],
    orderListData: [], // 列表数据
    page: {...defaultPage}, // 订单列表分页信息
    searchParams: JSON.stringify(defaultSearch),  // 搜索条件
    loading: false, // 列表加载状态
    loanDetailData: [], // 放款详情列表数据
    repayDetailData: [], // 还款详情,
    repayPlanData: [], // 放款计划
    userDetailData: {}, // 用户详情,
    activeKey: '1',  // tab页key,
    record: {}, // 当前所点击的行信息,
    orderStatus: [], // 订单状态列表
    prodList: [], // 产品系列列表
    currentProdList: [], //过滤后产品列表
    auditorList: [], // 渠道列表
  }
  form = null;

  componentDidMount() {
    this.queryOrderList();
    // 获取订单状态列表
    bizStatusEnum().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ orderStatus: res.resultData });
      }
    });
    // 获取审核状态列表
    auditorList().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ auditorList: res.resultData });
      }
    });
    // 获取产品系列列表
    getProdLine().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ prodList: res.resultData });
      }
    });
  }
  // 获取订单列表数据
  queryOrderList = (params = {}) => {
    const {page: {current,pageSize},searchParams} = this.state;
    this.setState({ loading: true });
    queryBorrowOrder({currentPage:current,pageSize,searchParams,...params}).then((res) => {
      this.setState({ loading: false });
      if (res.resultCode === 1000) {
        const { page, resultData } = res;
        this.setState({ orderListData: resultData, page });
      }
    })
  }
  //获取用户详情数据
  queryUserDetailData = (params) => {
    queryUserDetail(params).then((res) => {
      if (res.resultCode === 1000) {
        const { resultData } = res;
        this.setState({ userDetailData: resultData });
      }
    })
  }

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (err) return;
      const { prodLineId, phone, userName, status, radio, time, orderNo, idCard, isReloan, auditChannel } = values;
      const target = this.state.prodList.filter(item=>item.prodLineName === prodLineId)[0];
      if(!target && prodLineId && prodLineId.trim()!==''){
        message.warn('输入的产品系列名称不存在');
        return 
      }
      const searchParams = {
        ...checkData({phone, userName, orderNo, idCard}),
        prodLineId: !target || (prodLineId && prodLineId.trim() === '') ? undefined : target.id,
        auditChannel: auditChannel === '全部' ? undefined : auditChannel,
        status: status === '全部' ? undefined : status,
        isReloan: isReloan === '全部' ? undefined : isReloan,
        createTimeStart: radio === 1 && time && isMoment(time[0]) ? time[0].format('YYYY-MM-DD 00:00:00') : undefined,
        createTimeEnd: radio === 1 && time && isMoment(time[1]) ? time[1].format('YYYY-MM-DD 23:59:59') : undefined,
        loanTimeStart: radio === 2 && time && isMoment(time[0]) ? time[0].format('YYYY-MM-DD 00:00:00') : undefined,
        loanTimeEnd: radio === 2 && time && isMoment(time[1]) ? time[1].format('YYYY-MM-DD 23:59:59') : undefined,
      }
      this.queryOrderList({ currentPage: 1, pageSize: 10, searchParams: JSON.stringify(searchParams) });
      this.setState({ searchParams: JSON.stringify(searchParams) });
    });
  }
  // 导出
  handleExport = () => {
    orderListExport({
      searchParams: this.state.searchParams
    }).then(res => { });
  }
  // 重置
  handleFormReset = () => {
    this.form.resetFields();
    this.setState({
      searchParams: JSON.stringify(defaultSearch),
    });
  }
  // 批量审核
  batchAudit = () => {
    if(this.state.selectedRowKeys.length === 0){
      message.warn('请至少勾选一条货款订单记录');
      return 
   }
    this.handleConfirm('是否进行批量自动审核？', '确认', '取消', () => this.handleAgainAudit('批量'), () => this.handleInfo('操作已取消'));
  }
  //自动审核/批量自动审核
  handleAgainAudit = (orderId) => {
    const {selectedRowKeys} = this.state;
    if (orderId === '批量') {
      bathAgainAudit({ids: selectedRowKeys.toString()}).then((res) => {
         this.handleAfterAction(res,'批量自动审核成功');
      })
    } else {
      againAudit({ orderId }).then((res) => {
          this.handleAfterAction(res,'自动审核成功');
      })
    }
  }
  // 操作
  handleAction = (record) => {
    const action = record.action;
    const orderId = record.id;
    if (action === '查看详情') {
      this.queryUserDetailData({ userId: record.userId, thirdOrderNo: record.thirdOrderNo });
      this.setState({ visible: true, record });
    } else if (action === '自动审核') {
      this.handleConfirm('是否进行自动审核？', '确认', '取消', () => this.handleAgainAudit(orderId), () => this.handleInfo('操作已取消'));
    } else if (action === '人工审核') {
      this.handleConfirm('是否进行人工审核？', '确认', '取消', () => this.handleArtificial(orderId), () => this.handleInfo('操作已取消'));
    } else if (action === '回调审核结果') {
      auditQuery({ orderId }).then((res) => {
        if (res.resultCode === 1000) {
          this.queryOrderList();
        }
      })
    } else if (action === '下载合同') {
      tongrongContract({ orderId }).then((res) => { 
        if(res.resultCode === 1000){
          window.location.href = res.resultData;
        }
      });
    }
  }
  // 操作之后
  handleAfterAction = (res, info) => {
    if (res.resultCode === 1000) {
      this.handleInfo(info);
      this.setState({selectedRowKeys:[]});
      this.queryOrderList();
    }
  }
  // 人工审核
  handleArtificial = (orderId) => {
    this.handleConfirm('页面具体内容待与360确认了风控规则再确认？', '通过', '拒绝', () => this.handleArtificialAction('yes', orderId), () => this.handleArtificialAction('no'));
  }
  // 人工审核结果确认
  handleArtificialAction = (action, orderId) => {
    if (action === 'yes') {
      this.handleConfirm('是否审核通过？', '确认', '取消', () => this.handleArtificialPass(true, orderId), () => this.handleInfo('操作已取消'));
    } else if (action === 'no') {
      this.handleConfirm('是否拒绝该客户？', '确认', '取消', () => this.handleArtificialPass(false, orderId), () => this.handleInfo('操作已取消'));
    }
  }
  // 是否通过人工审核
  handleArtificialPass = (isPass, orderId) => {
    manualReview({ isPass, orderId }).then(res => {
        if (isPass) {
          this.handleAfterAction(res,'该订单已审核通过');
        } else {
          this.handleAfterAction(res,'该订单已拒绝');
        }
    })
  };
  // 选择操作弹框
  handleConfirm = (title, okText, cancelText, onOk, onCancel) => {
    confirm({ title, okText, cancelText, onOk, onCancel });
  }
  // 操作结果通知弹框
  handleInfo = (title) => {
    Modal.info({
      title,
      okText: '关闭',
    });
  }
  // 控制弹框显隐
  handleVisibleChange = () => {
    this.setState({ visible: !this.state.visible, activeKey: '1' });
  }

  // 分页查询
  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.queryOrderList({ currentPage: current, pageSize});
  }
  // tab页发生改变查询记录
  onTabsChange = (activeKey) => {
    this.setState({ activeKey });
  }
  getProdLineList = (value) => {
    if (!value && value === '') {
       this.setState({currentProdList:[]});
    }else{
      const {prodList} = this.state;
      const target = prodList.filter(item => item.prodLineName.toLowerCase().indexOf(value.toLowerCase()) >= 0);
      if(target){
        this.setState({currentProdList:target});
      }
    }
  }
  render() {
    const { selectedRowKeys, orderListData, page, activeKey, record, visible,
      userDetailData, loading, orderStatus, currentProdList, auditorList } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: records => ({
        disabled: records.status !== 200,
      }),
    }
    const tableConfig = {
      rowSelection,
      pagination: page,
      loading,
      rowKey: (record) => record.id,
      onChange: (pagination) => this.handleTableChange(pagination)
    }
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <SearchBar
            ref={ref => this.form = ref}
            handleSearch={(e) => { this.handleSearch(e) }}
            handleFormReset={this.handleFormReset}
            handleExport={this.handleExport}
            orderStatus={orderStatus}
            currentProdList={currentProdList}
            auditorList={auditorList}
            getProdLineList={this.getProdLineList}
          />
          <TableList
            tableConfig={tableConfig}
            dataSource={orderListData}
            handleAction={this.handleAction}
            batchAudit={this.batchAudit}
          />
        </Card>
        <Modal
          visible={visible}
          destroyOnClose
          onCancel={this.handleVisibleChange}
          onOk={this.handleVisibleChange}
          width={1200}
          centered={true}
          footer={[
            <Button key="back" type="primary" onClick={this.handleVisibleChange}>返回</Button>,
          ]}
        >
          <Tabs defaultActiveKey='1' activeKey={activeKey} onChange={this.onTabsChange}>
            <TabPane tab='用户详情' key='1'><UserInfoDetail data={userDetailData} /></TabPane>
            <TabPane tab='放款详情' key='2'><LoanDetail orderId={record.id} /></TabPane>
            <TabPane tab='还款详情' key='3'><RepayDetail orderId={record.id} /></TabPane>
          </Tabs>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
