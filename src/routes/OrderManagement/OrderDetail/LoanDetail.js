import React, { Component } from 'react';
import {Table} from 'antd';
import { queryLoanDetail } from '../../../services/order';

export default class LoanDetail extends Component {
    state = {
        loanDetailData: [], // 还款计划列表
    }
    componentDidMount() {
        const { orderId } = this.props;
        //获取还款计划列表数据
        if (orderId) {
            queryLoanDetail({orderId}).then((res) => {
                if (res.resultCode === 1000) {
                  const { resultData } = res;
                  this.setState({ loanDetailData: resultData });
                }
            })
        }
    }
    render() {
        const {loanDetailData} =this.state;
        let cloumns = [{
            title:'交易流水号',
            dataIndex:'tradeNum'
          },{
            title:'资金方',
            dataIndex:'fundsChannelName'
          },{
            title:'交易渠道',
            dataIndex:'tradeChannelStr'
          },{
            title:'发送时间',
            dataIndex:'createTime'
          },{
            title:'接收时间',
            dataIndex:'updateTime'
          },{
            title:'放款金额',
            dataIndex:'tradeAmount'
          },{
            title:'交易状态',
            dataIndex:'tradeStatusStr'
          },{
            title:'交易详情',
            dataIndex:'tradeResult'
          }];
        return (
            <Table 
            columns={ cloumns }
            bordered
            rowKey={record=>record.id}
            dataSource={ loanDetailData }
            />
        )
    }
}
