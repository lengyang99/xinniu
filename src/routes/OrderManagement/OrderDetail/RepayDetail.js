import React, { Component } from 'react';
import {Table, Divider} from 'antd';
import { queryRepayPlan, queryRepayDetail } from '../../../services/order';

export default class RepayDetail extends Component {
    state = {
        repayPlanData: [], // 放款计划列表
        repayPlanCloumns: [], // 放款计划表头
        repayDetailData: [], // 放款详情列表
    }
    componentDidMount() {
        const { orderId } = this.props;
        console.log(orderId,'www');
        //获取还款计划列表数据
        if (orderId) {
            queryRepayPlan({ orderId }).then((res) => {
                if (res.resultCode === 1000) {
                    const { resultData } = res;
                    let repayPlanCloumns = [];
                    let cloumns =  [];
                    resultData.forEach((item,i) =>{
                        cloumns = [...cloumns, ...Object.keys(resultData[i])];
                    })
                    cloumns = [...new Set(cloumns)];
                    cloumns.forEach(item => {
                        if(item === '期数'){
                            repayPlanCloumns.unshift({ title: item, dataIndex: item})
                        }else{
                            repayPlanCloumns.push({ title: item, dataIndex: item});
                        }
                    });
                    this.setState({
                        repayPlanData: resultData,
                        repayPlanCloumns
                    });
                }
            })
            //获取还款详情列表数据
            queryRepayDetail({ orderId }).then((res) => {
                if (res.resultCode === 1000) {
                    const { resultData } = res;
                    this.setState({
                        repayDetailData: resultData
                    });
                }
            })
        }
    }
    render() {
        const { repayPlanData, repayDetailData, repayPlanCloumns } = this.state;
        const cloumns = [
        {
            title: '对应期数',
            dataIndex: 'scheduleNo'
        }, 
        {
            title: '交易流水号',
            dataIndex: 'serialNo'
        }, {
            title: '交易渠道',
            dataIndex: 'tradeChannel'
        }, {
            title: '发送时间',
            dataIndex: 'tradeStartTime'
        }, {
            title: '接收时间',
            dataIndex: 'updateTime'
        }, {
            title: '还款金额',
            dataIndex: 'tradeAmount'
        }, {
            title: '交易状态',
            dataIndex: 'tradeStatusStr'
        }, {
            title: '交易详情',
            dataIndex: 'result'
        }];
        return (
            <div>
                <div>还款计划</div>
                <Divider style={{ marginTop: 5 }}></Divider>
                <Table
                    columns={repayPlanCloumns}
                    bordered
                    rowKey={'期数'}
                    scroll={{x:1800}}
                    dataSource={repayPlanData}
                />
                <div style={{ height: 20 }}></div>
                <div>还款详情</div>
                <Divider style={{ marginTop: 5 }}></Divider>
                <Table
                    columns={cloumns}
                    bordered
                    rowKey={record => record.serialNo}
                    dataSource={repayDetailData}
                />
            </div>
        )
    }
}
