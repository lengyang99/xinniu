import React, { Component } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { Card, Modal, Input, Form, message } from 'antd';
import moment, { isMoment } from 'moment';
import SearchBar from './SearchBar';
import TableList from './TableList';
import styles from './index.less';
import LoanDetail from '../OrderDetail/LoanDetail';
import {checkData} from '../../../utils/utils';
import { queryLoanOrderList, batchLoanAgain, closedOrder, loanEnum, loanAgain,
  loan,confirmPayFail,exportLoan,loanDataAmount,getProdLine} from '../../../services/order';

const confirm = Modal.confirm;
const TextArea = Input.TextArea;
const defaultSearch = {
  createTimeStart: moment().format('YYYY-MM-DD 00:00:00'),
  createTimeEnd: moment().format('YYYY-MM-DD 23:59:59'),
}
const defaultPage = {
  current: 1,
  pageSize: 10
}
const ReasonItem = Form.create()((props => {
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <Form.Item>
        {getFieldDecorator('reason', {
          rules: [{ required: true, whitespace: true, message: '请输入关闭原因' }],
        })(<TextArea placeholder='请输入关闭原因' />)}
      </Form.Item>
    </Form>
  )
}));

/**
 *
 *
 * @export
 * @class LoanOrder
 * @extends {Component}
 * @description 放款订单 放款订单 由订单列表 订单搜索栏 放款详情 等组件构成
 */
export default class LoanOrder extends Component {
  state = {
    loanDetailVisible: false, // 放款详情弹框显隐
    selectedRowKeys: [], // 勾选记录的key
    selectedRow: [],
    loanData: [],  // 放款订单列表
    loanDetailData: [], //放款详情列表
    loading: false, // 加载状态
    loanEnum: [], // 放款状态
    page: {...defaultPage}, // 列表分 页
    searchParams: JSON.stringify(defaultSearch), //搜索条件
    record: {}, //当前行
    loanDataTotal:'', //放款总额
    prodList: [],//产品列表
    currentProdList: [],
  }
  form = null;
  reasonForm = null;
  confirm = null;
  componentDidMount() {
    this.queryLoanOrderData();
    // 获取放款状态列表
    loanEnum().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ loanEnum: res.resultData });
      }
    });
    // 获取放款总额
    loanDataAmount().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ loanDataTotal: res.resultData });
      }
    });
    // 获取产品系列列表
    getProdLine().then(res => {
      if (res.resultCode === 1000) {
        this.setState({ prodList: res.resultData });
      }
    });    
  }
  // 获取放款订单列表
  queryLoanOrderData = (params = {}) => {
    const {page: {current,pageSize},searchParams} = this.state;
    this.setState({ loading: true });
    queryLoanOrderList({currentPage:current,pageSize,searchParams,...params}).then((res) => {
      this.setState({ loading: false });
      if (res.resultCode === 1000) {
        const { resultData, page } = res;
        this.setState({ loanData: resultData, page });
      }
    });
  }

  // 查询
  handleSearch = (e) => {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (err) return;
      const { prodLineId, phone, realName, statusStr, radio, time, orderNo, idNo, } = values;
      const target = this.state.prodList.filter(item=>item.prodLineName === prodLineId)[0];
      if(!target && prodLineId && prodLineId.trim()!==''){
        message.warn('输入的产品系列名称不存在');
        return 
      }
      const searchParams = {
        ...checkData({phone, realName, orderNo, idNo}),
        prodLineId: !target || (prodLineId && prodLineId.trim() === '') ? undefined : target.id,
        statusStr: statusStr !== '全部' ?  statusStr : undefined,
        createTimeStart: radio === 1 && time && isMoment(time[0])? time[0].format('YYYY-MM-DD 00:00:00') : undefined,
        createTimeEnd: radio === 1 && time && isMoment(time[1])? time[1].format('YYYY-MM-DD 23:59:59') : undefined,
        loanStartTime: radio === 2 && time && isMoment(time[0])? time[0].format('YYYY-MM-DD 00:00:00') : undefined,
        loanEndTime: radio === 2 && time && isMoment(time[1])? time[1].format('YYYY-MM-DD 23:59:59') : undefined,
      }
      this.queryLoanOrderData({ currentPage: 1, pageSize: 10, searchParams: JSON.stringify(searchParams) });
      this.setState({ searchParams: JSON.stringify(searchParams) });
    });
  }
  // 导出
  handleExport = () => {
    exportLoan({
      searchParams: this.state.searchParams
    }).then(res=>{
      
    })
  }
  // 重置
  handleFormReset = () => {
    this.form.resetFields();
    this.setState({searchParams: JSON.stringify(defaultSearch)});
  }
  // 批量放款
  bulkLoan = () => {
    const {selectedRowKeys,selectedRow} = this.state;
    if(selectedRowKeys.length === 0){
       message.warn('请至少勾选一条放款订单记录');
       return 
    }
    let principals = 0;
    selectedRow.forEach(item=>{
      principals = principals + item.principal;
    })
    const data = [{ label: '放款总金额', value: principals }];
    this.handleConfirm('是否确认批量放款', data, () => this.handleBatchLoan(selectedRowKeys), () => this.handleInfo('操作已取消'));
  }
  handleBatchLoan = (selectedRowKeys) => {
    batchLoanAgain({ ids: selectedRowKeys.toString() }).then((res) => {
      if (res.resultCode === 1000) {
        this.queryLoanOrderData();
      }
    })
  }
  // 操作
  handleAction = (record) => {
    let data = [];
    const {action, orderId, orderNo, bank, cardNo, realName, principal, phone} = record;
    if (action === '查看详情') {
      this.setState({ loanDetailVisible: true })
    } else if (action === '手动放款' || action === '再次放款') {
      data = [{ label: '放款金额', value: principal }, { label: '收款人姓名', value: realName }, { label: '收款银行', value: bank }, { label: '银行卡号', value: cardNo }];
      this.handleConfirm('是否确认放款', data, () => this.handleLoan(action,orderId), () => this.handleInfo('操作已取消'));
    } else if (action === '关闭') {
      data = [{ label: '收款人姓名', value: realName }, { label: '手机号', value: phone }, { label: '订单号', value: orderNo }];
      const node = <ReasonItem ref={ref => { this.reasonForm = ref }} />
      this.handleConfirm('关闭订单', data, (e) => this.handleCloseOrder(orderId), () => this.handleInfo('操作已取消'), node);
    } else if (action === '确认失败') {
      data = [{ label: '收款人姓名', value: realName }, { label: '手机号', value: phone }, { label: '订单号', value: orderNo }];
      this.handleConfirm('是否确认放款失败', data, () => this.handleConfirmPayFail(orderId), () => this.handleInfo('操作已取消'));
    }
    this.setState({record});
  }
  // 操作之后
  handleAfterAction = (res, info) => {
    if (res.resultCode === 1000) {
      this.handleInfo(info);
      this.setState({selectedRowKeys:[],selectedRow:[],});
      this.queryLoanOrderData();
    }
  }  
  // 操作选项
  handleConfirm = (title, data, onOk, onCancel, node = null) => {
    this.confirm = Modal.confirm({
      title,
      content: <div className={styles.modal}>
        {data.map(ele => (
          <div key={ele.label} className={styles.content}><span>{`${ele.label}：`}</span><span>{ele.value}</span></div>
        ))}
        {node}
      </div>,
      onOk,
      onCancel,
    })
  }
  // 操作结果通知弹框
  handleInfo = (title) => {
    Modal.info({
      title,
      okText: '关闭',
    });
  }
  // 手动/再次放款
  handleLoan = (action,orderId) => {
    if(action === '手动放款'){
      loan({orderId}).then(res =>{
         this.handleAfterAction(res,'手动放款成功');
      });
    }else if(action === '再次放款'){
      loanAgain({orderId}).then(res =>{
        this.handleAfterAction(res,'再次放款成功');
      });
    }
  }
  // 确认放款失败
  handleConfirmPayFail = (orderId) =>{
    confirmPayFail({orderId}).then(res=>{
      this.handleAfterAction(res,'确认放款失败成功');
    });
  }
  // 关闭订单
  handleCloseOrder = (orderId) => {
    this.reasonForm.validateFields((err, values) => {
      if (!err) {
        closedOrder({ orderId, reason: values.reason }).then(res => {
          if (res.resultCode === 1000) {
            this.confirm.destroy();
            this.handleAfterAction(res,'订单已关闭成功');
          }
        })
      }
    });
  }
  // 控制弹框的显隐
  handleLoanDetailVisibleChange = () => {
    this.setState({ loanDetailVisible: !this.state.loanDetailVisible });
  }
  // 分页查询
  handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.queryLoanOrderData({ currentPage: current, pageSize});
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
    const { loanDetailVisible, selectedRowKeys, loanData, page, loanEnum,
       loading ,record, loanDataTotal,currentProdList} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys,selectedRow) => { this.setState({ selectedRowKeys, selectedRow}) },
      getCheckboxProps: records => ({
        disabled: records.status !== 290,
      }),
    }
    const tableConfig = {
      rowSelection,
      pagination: page,
      loading,
      rowKey: (record) => record.orderId,
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
            currentProdList={currentProdList}
            getProdLineList={this.getProdLineList}
            loanEnum={loanEnum}
          />
          <TableList
            tableConfig={tableConfig}
            dataSource={loanData}
            handleAction={this.handleAction}
            bulkLoan={this.bulkLoan}
          />
          <div><span>今日放款成功总额：</span><span style={{color: 'rgb(55,113,251)'}}>{loanDataTotal.todayAmount  || 0}</span>
          <span>元，累计放款成功总额：</span><span style={{color: 'rgb(55,113,251)'}}>{loanDataTotal.loanTotalAmount || 0}</span><span>元</span></div>
        </Card>
        <Modal
          title='放款详情'
          width={1075}
          destroyOnClose
          visible={loanDetailVisible}
          onOk={this.handleLoanDetailVisibleChange}
          onCancel={this.handleLoanDetailVisibleChange}>
          <LoanDetail orderId={record.orderId}/>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
