import React, { Component } from 'react'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card, Table, Row, Col, Form, Select, Button, DatePicker, Divider } from 'antd'
const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const Option = Select.Option
@Form.create()
export default class CapitalReport extends Component {
    renderAdvanceForm = () => {
        const { form: { getFieldDecorator } } = this.props
        return (
            <Form layout='inline' onSubmit={this.searchSubmit}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={5} xm={24}>
                        <FormItem label='产品系列:'>
                            {getFieldDecorator('productseries', {
                                initialValue: ''
                            })(
                                <Select style={{ width: 129 }}>
                                    <Option value=''>
                                        全部
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} xm={24}>
                        <FormItem label='资金渠道:'>
                            {getFieldDecorator('fundchannel', {
                                initialValue: ''
                            })(
                                <Select style={{ width: 160 }}>
                                    <Option value=''>
                                        全部
                                </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} xm={24}>
                        <FormItem label='支付渠道:'>
                            {getFieldDecorator('paychannel', {
                                initialValue: ''
                            })(
                                <Select style={{ width: 160 }}>
                                    <Option value=''>
                                        全部
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={7} xm={24}>
                        <FormItem label='查询日期:'>
                            {getFieldDecorator('querydate')(
                                <RangePicker style={{ width: 200 }}>
                                </RangePicker>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }} type="flex" justify="end">
                    <Col md={5} xm={24}>
                        <Button style={{ marginRight: 10 }} type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginRight: 10 }} type="primary">导出</Button>
                        <Button type="primary" onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
    loanTotal = () => {
        const columns = [
            {
                title: "序号",
                render: (text, record, index) => index + 1,
                dataIndex: "key"
            },
            {
                title: "产品系列",
                dataIndex: "productseries"
            },
            {
                title: "资金渠道",
                dataIndex: "fundchannel"
            },
            {
                title: "放款本金",
                dataIndex: "loadmoney"
            },
            {
                title: "实际到账金额",
                dataIndex: "actualmoney"
            },
            {
                title: "笔数",
                dataIndex: "orderNum"
            },
            {
                title: "实收费用",
                dataIndex: "actualfee"
            }
        ]
        return (
            <div>
                <div>
                    放款统计
                </div>
                <div style={{margin:"20px 0"}}>
                    <span>
                        2018/11/02
                    </span>
                    <span style={{ marginLeft: 50 }}>
                        2018/11/02
                    </span>
                </div>
                <Table
                    bordered
                    columns={columns}
                >
                </Table>
            </div>
        )
    }
    repaymentTotal = () => {
        const columns = [
            {
                title: "序号",
                render: (text, record, index) => index + 1,
                dataIndex: "key"
            },
            {
                title: "产品系列",
                dataIndex: "productseries"
            },
            {
                title: "支付渠道",
                dataIndex: "paychannel"
            },
            {
                title: "实收本金",
                dataIndex: "actualmoney"
            },
            {
                title: "实收利息",
                dataIndex: "actualinterest"
            },
            {
                title: "实收服务费",
                dataIndex: "actualfee"
            },
            {
                title: "实收逾期违约金",
                dataIndex: "actualdedit "
            },
            {
                title: "实收提前还款手续费",
                dataIndex: "actualservercharge"
            }
        ]
        return (
            <div>
                <div>
                    还款统计
                </div>
                <div style={{margin:"20px 0"}}>
                    <span>
                        2018/11/02
                    </span>
                    <span style={{ marginLeft: 50 }}>
                        2018/11/02
                    </span>
                </div>
                <Table
                    bordered
                    columns={columns}
                >
                </Table>
            </div>
        )
    }
    render() {
        return (
            <PageHeaderLayout>
                <Card>
                    <div style={{ height: 100 }}>
                        {this.renderAdvanceForm()}
                    </div>
                    {this.loanTotal()}
                    <Divider></Divider>
                    {this.repaymentTotal()}
                </Card>
            </PageHeaderLayout>
        )
    }
}
