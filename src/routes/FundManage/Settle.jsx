import React, { Component } from 'react'
import { Button, Input, TimePicker, message, Upload, Form, Select, DatePicker, Table, Card, Row, Col, Modal } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
@Form.create()
export default class Settle extends Component {
    constructor() {
        super()
        
    }
    searchSubmit = (e) => {
        e.preventDefault()
        return () => {
            
        }
    }
    handleReset = () => {
        this.props.form.resetFields();
      }
    renderAdvanceForm = () => {
        const { form: { getFieldDecorator } } = this.props
        return (
            <Form layout='inline' onSubmit={this.searchSubmit}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                    <Col md={5} xm={24}>
                        <FormItem label='产品系列:'>
                            {getFieldDecorator('productseries', {
                                initialValue: ''
                            })(
                                <Input style={{ width: 129 }} placeholder='请输入产品系列' />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} xm={24}>
                        <FormItem label='结算状态:'>
                            {getFieldDecorator('settlestatus', {
                                initialValue: ''
                            })(
                                <Select style={{ width: 160 }}>
                                    <Option value=''>
                                        请选择状态
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={7} xm={24}>
                        <FormItem label='结算日期:'>
                            {getFieldDecorator('settledate')(
                                <RangePicker style={{ width: 200 }}>
                                </RangePicker>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{marginTop:10}} type="flex" justify="end">
                    <Col md={5} xm={24}>
                        <Button style={{marginRight:10}} type="primary" htmlType="submit">查询</Button>
                        <Button style={{marginRight:10}} type="primary">导出</Button>
                        <Button type="primary" onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row> 
            </Form>
        )
    }
    chooseOrder =(selectedRowKeys, selectedRows) =>{
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
    render() {
        const columns = [
            {
                title:"订单号",
                render: (text,record) => <a href="javascript:;">{text}</a>,
                dataIndex:'orderId'
            },
            {
                title:"姓名",
                dataIndex:"name"
            },
            {
                title:"手机号码",
                dataIndex:"phone"
            },
            {
                title:"证件号码",
                dataIndex:"paper"
            },
            {
                title:"是否提前还款",
                dataIndex:"whetherToPrepay"
            },
            {
                title:"是否逾期",
                dataIndex:"overdue"
            },
            {
                title:"产品系列",
                dataIndex:"productseries"
            },
            {
                title:"资金渠道",
                dataIndex:"fundchannel"
            },
            {
                title:"借款金额",
                dataIndex:"borrowmoney"
            },
            {
                title:"资金方年利率",
                dataIndex:"interestRate"
            },
            {
                title:"放款日期",
                dataIndex:"loandate"
            },
            {
                title:"客户账单日",
                dataIndex:"billday"
            },
            {
                title:"客户实还日期",
                dataIndex:"repaymentdate"
            },
            {
                title:"期数",
                dataIndex:"periods"
            },
            {
                title:"客户实还金额",
                dataIndex:"repaymentmoney"
            },
            {
                title:"结算本金",
                dataIndex:"settlemoney"
            },
            {
                title:"结算利息",
                dataIndex:"settleinterest"
            },
            {
                title:"结算服务费",
                dataIndex:"settleservermoney"
            },
            {
                title:"提前结清手续费",
                dataIndex:"advance"
            },
            {
                title:"结算总额",
                dataIndex:"settletotalmoney"
            },
            {
                title:"结算状态",
                dataIndex:"settlestatus"
            },
            {
                title:"结算日",
                dataIndex:"settleday"
            }
            
        ]
        const dataSource=[
            {
                orderId:'2'
            },
            {
                orderId:'3'
            }
        ]
        const rowSelection = {
            onChange: this.chooseOrder
        }
        return (
            <PageHeaderLayout>
                <Card>
                    <div style={{height:100}}>
                        {this.renderAdvanceForm()}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div>
                            结算明细
                        </div>
                        <div>
                            <Button type="primary">结算</Button>
                        </div>
                    </div>
                    <div>
                        <Table 
                        rowSelection={rowSelection}
                        columns={columns}
                        scroll={{x:2600}}
                        dataSource={dataSource}
                        >

                        </Table>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}