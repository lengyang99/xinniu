import React, { Component } from 'react'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Button, Input, Select, Icon, Form, message, Row, Col, Table, Card, Modal } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
import styles from './FundsChannel.less'
import {
    queryChannelEnum,
    getPayChannel,
    ChannelStatus,
    queryBankEnum,
    savePayChannel,
    queryBankConfig,
    changePayChannel,
    delBankConfig
} from '../../services/payChannelMange.js'
import { resolve } from 'path';
@Form.create()
export default class PayChannel extends Component {
    constructor() {
        super()
        this.state = {
            payChannelPage: {
                current: 1,
                pageSize: 10
            },
            isBankDetail: false,
            payChannelList: [],//支付渠道列表
            searchParams: null,//查询参数
            channelEnum: [],
            action: "",
            showChannelModal: false,
            bank: [],//银行
            bankEnum: [],//银行枚举列表
            editorChannel: null,//编辑渠道信息
            bankConfigMark: false,
            isShowBank: false,
        }
    }
    componentDidMount() {
        this.payChannelData()
        this.getChannelEnum()
        this.getBankEnum()
    }
    //获取银行枚举
    getBankEnum = () => {
        queryBankEnum().then(res => {
            if (res.resultCode === 1000) {
                this.setState({
                    bankEnum: res.resultData
                })
            } else {
                message.error(res.resultMessage)
            }
        })
    }
    //获取场景枚举
    getChannelEnum = () => {
        queryChannelEnum().then(res => {
            if (res.resultCode === 1000) {
                this.setState({
                    channelEnum: res.resultData
                })
            }
        })
    }
    //修改渠道状态
    changeChannelStatus = (id) => {

        let { payChannelPage } = this.state
        ChannelStatus({ id }).then(res => {
            if (res.resultCode === 1000) {
                let pageData = Object.assign({}, payChannelPage, { current: 1 })
                this.setState({
                    payChannelPage: pageData
                }, () => {
                    this.payChannelData()
                })
            } else {
                message.error(res.resultMessage)
            }
        })
    }
    //修改支付渠道
    editorPayChannel = (params) => {
        return new Promise((resolve, reject) => {
            changePayChannel(params).then(res => {
                if (res.resultCode === 1000) {
                    resolve()
                    this.payChannelData()
                    this.setState({
                        showChannelModal: false,
                        bank: []
                    })
                } else {
                    message.error(res.resultMessage)
                }
            })
        })
    }
    //添加支付渠道
    addPayChannel = (params) => {
        savePayChannel(params).then(res => {
            if (res.resultCode === 1000) {
                this.payChannelData()
                this.setState({
                    showChannelModal: false,
                    bank: []
                })
            } else {
                message.error(res.resultMessage)
            }
        })
    }
    //是否显示渠道
    showConfigChannel = (isShow, action, record) => {
        if (!isShow) {
            this.setState({
                bank: [],
                editorChannel: null
            })
        }
        if (action === '编辑') {
            this.setState({
                editorChannel: record
            }, () => {
                this.getBankConfig(record.id)
            })
        }
        this.setState({
            showChannelModal: isShow,
            action
        })
    }
    //提交新建或修改渠道
    channelSubmit = () => {
        const { form: { validateFields } } = this.props
        const { bankEnum, bank, action, editorChannel } = this.state
        if (!bank.length) {
            message.error('请配置银行')
            return
        }
        validateFields((errors, values) => {
            if (!errors||!errors.channelname&&!errors.channeltype) {
                const { channelname, channeltype } = values
                if (action === '新建') {
                    let payChannel = JSON.stringify({
                        name: channelname,
                        type: channeltype,
                        bankNumber: bank.length
                    })
                    let newBankData = bank.map(item => {
                        let obj = {
                            bankName: item.bankName,
                            bankCode: item.code
                        }
                        return obj
                    })
                    let payBankList = JSON.stringify(newBankData)
                    this.addPayChannel({
                        payChannel,
                        payBankList
                    })
                } else if (action === '编辑') {
                    let payChannel = JSON.stringify({
                        id: editorChannel.id,
                        name: channelname,
                        type: channeltype,
                        bankNumber: bank.length
                    })
                    let newBankData = bank.map(item => {
                        let obj = {
                            bankName: item.bankName,
                            bankCode: item.code,
                            payChannelId: editorChannel.id
                        }
                        return obj
                    })
                    let payBankList = JSON.stringify(newBankData)
                    this.editorPayChannel({
                        payChannel,
                        payBankList
                    })
                }
            }
        })
    }
    //获取银行设置
    getBankConfig = (payChannelId) => {
        return new Promise((resolve, reject) => {
            queryBankConfig({ payChannelId }).then(res => {
                if (res.resultCode === 1000) {
                    resolve()
                    let data = res.resultData
                    const bank = data.map(item => {
                        let obj = {
                            bankName: item.bankName,
                            code: item.bankCode,
                            id: item.id
                        }
                        return obj
                    })
                    this.setState({
                        bank
                    })
                }
            })
        })
    }
    //直接设置银行
    setBankConfig = (record) => {
        this.getBankConfig(record.id).then(() => {
            this.setState({
                isBankDetail: true,
                bankConfigMark: true,
                editorChannel: record
            })
        })
    }
    //新建渠道
    configChannel = () => {
        const { action, showChannelModal, channelEnum, editorChannel,bank } = this.state
        const { form: { getFieldDecorator } } = this.props
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const optionList = channelEnum.map(item => {
            return (
                <Option key={item.id} value={item.id}>{item.name}</Option>
            )
        })
        return (
            <Modal
                title={`${action}支付渠道信息`}
                visible={showChannelModal}
                onCancel={() => this.showConfigChannel(false, '')}
                onOk={this.channelSubmit}
                zIndex={1000}
                destroyOnClose
            >
                <Form >
                    <FormItem {...formItemLayout} label="支付渠道名称">
                        {getFieldDecorator('channelname', {
                            initialValue: editorChannel ? editorChannel.name : '',
                            rules:[
                                {
                                    required:true,
                                    message:"请输入渠道名称"
                                }
                            ]
                        })(
                            <Input placeholder="请输入渠道名称" style={{ width: 200 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="渠道类型">
                        {getFieldDecorator('channeltype', {
                            initialValue: editorChannel ? editorChannel.type : "",
                            rules:[
                                {
                                    required:true,
                                    message:"请选择渠道类型"
                                }
                            ]
                        })(
                            <Select
                                disabled={editorChannel&&editorChannel.edit===false?true:false}
                                style={{ width: 200 }}>
                                <Option value="">
                                    请选择渠道类型
                                </Option>
                                {optionList}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="支持银行">
                        <div>{editorChannel?<span><a style={{ marginLeft:20 }} onClick={() => this.bankConfig(true)}>{bank.length}</a>&nbsp;家</span>:null} <a style={{ marginLeft: 30 }} onClick={() => this.bankConfig(true)}>配置银行</a></div>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    //配置银行明细
    bankConfig = (isShow) => {
        const { form: { resetFields } } = this.props
        const { editorChannel, bank, bankConfigMark } = this.state
        resetFields('bankname')
        if (!isShow && bankConfigMark && editorChannel) {
            this.setState({
                bankConfigMark: false,
                editorChannel: null
            })
        }
        if (editorChannel && !bank.length) {
            this.getBankConfig(editorChannel.id)
        }
        this.setState({
            isBankDetail: isShow
        })
    }
    //提交银行配置明细
    bankConfigSubmit = () => {
        const { bank, editorChannel, bankConfigMark } = this.state
        if (!bank.length) {
            message.error('请添加支持的银行')
            return
        }
        if (bankConfigMark && editorChannel) {
            let payChannel = JSON.stringify({
                id: editorChannel.id,
                name: editorChannel.name,
                type: editorChannel.type,
                bankNumber: bank.length
            })
            let newBankData = bank.map(item => {
                let obj = {
                    bankName: item.bankName,
                    bankCode: item.code,
                    payChannelId: editorChannel.id
                }
                return obj
            })
            let payBankList = JSON.stringify(newBankData)
            this.editorPayChannel({
                payChannel,
                payBankList
            }).then(() => {
                this.setState({
                    editorChannel: null,
                    bankConfigMark: false
                })
            })
        }
        this.setState({
            isBankDetail: false
        })
    }
    //添加支持银行
    addSupportBank = () => {
        const { form: { validateFields, resetFields } } = this.props
        let { bank, bankEnum } = this.state
        validateFields((error, values) => {
            // console.log(error)
            if (!error||!error.bankname) {
                // console.log(values)
                const { bankname } = values
                let obj = bankEnum.find(item => {
                    return item.code == bankname
                })
                const bankData = [...bank, obj]
                this.setState({
                    bank: bankData
                }, () => {
                    resetFields(['bankname'])
                })
            }
        })
    }
    //删除银行信息
    deleteBank = (code) => {
        const { bank } = this.state
        const newBank = bank.filter(item => {
            return item.code != code
        })
        this.setState({
            bank: newBank
        })
        // this.delBank({id,payChannelId:editorChannel.id})
    }
    //银行明细
    bankDetail = () => {
        const { isBankDetail, bankEnum, bank } = this.state
        const { form: { getFieldDecorator } } = this.props
        let bankEnumObj = JSON.parse(JSON.stringify(bankEnum));
        bank.map((item) => {
            bankEnumObj.map((key, index) => {
                if (item.code == key.code) {
                    bankEnumObj.splice(index, 1)
                }
            })
        })
        const columns = [
            {
                title: "序号",
                render: (text, record, index) => index + 1,
                dataIndex: "key"
            },
            {
                title: "支持银行名称",
                dataIndex: "bankName"
            },
            {
                title: "操作",
                render: (text, record) => {
                    const code = record.code
                    return (
                        <span onClick={() => this.deleteBank(code)} style={{ color: '#3771FB', cursor: 'pointer' }}>删除</span>
                    )
                },
                dataIndex: "opration"
            }
        ]
        let optionList = bankEnumObj.map((item, index) => {
            return (
                <Option key={item.code} value={item.code}>
                    {item.bankName}
                </Option>
            )
        })
        let dataSource = bank
        return (
            <Modal
                visible={isBankDetail}
                title="配置银行明细"
                width={680}
                footer={null}
                // onOk={this.bankConfigSubmit}
                onCancel={() => this.bankConfig(false)}
                zIndex={1001}
                destroyOnClose
            >
                <div className={styles.bankContent}>
                    <div>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{ y: 300 }}
                            pagination={false}
                            rowKey={(record) => record.code}
                        >
                        </Table>
                    </div>
                    <div className={styles.bankForm}>
                        <Form layout='inline'>
                            <FormItem label="支持银行名称:">
                                {
                                    getFieldDecorator('bankname',
                                        {
                                            initialValue: "",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择支持的银行"
                                                }
                                            ]
                                        })(
                                            <Select
                                                style={{ width: 182 }}>
                                                <Option key="" value="">
                                                    请选择支持的银行名称
												</Option>
                                                {optionList}
                                            </Select>
                                        )}
                                {/* <Icon onClick={this.addSupportBank} type="plus" style={{cursor:"pointer",marginLeft:10,color:'#3771FB'}} /> */}
                                <a onClick={this.addSupportBank} style={{ cursor: "pointer", marginLeft: 10, color: '#3771FB' }}>添加</a>
                            </FormItem>
                            <div className={styles.bankBtn}>
                                <Button style={{ marginRight: 10 }} onClick={this.bankConfigSubmit} type="primary" htmlType='submit'>保存</Button>
                                <Button onClick={() => this.bankConfig(false)}>取消</Button>
                            </div>
                        </Form>

                    </div>
                </div>
            </Modal>
        )
    }
    //请求获取支付渠道列表
    payChannelData = () => {
        let { payChannelPage, searchParams } = this.state
        let { current, pageSize } = payChannelPage
        getPayChannel({ currentPage: current, pageSize, searchParams }).then(res => {
            if (res.resultCode === 1000) {
                this.props.form.resetFields(['channelname','channeltype'])
                this.setState({
                    payChannelList: res.resultData,
                    payChannelPage: res.page
                })
            } else {
                message.error(res.resultMessage)
            }
        })
    }
    //提交申请
    searchSubmit = (e) => {
        e.preventDefault()
        const { form: { validateFields } } = this.props
        validateFields((errors, values) => {
            // if(!errors.name&&!errors.type&&!errors.status){
            let { name, type, status } = values
            let searchParams = JSON.stringify({
                name: name ? name : undefined,
                type: type ? type : undefined,
                status: status ? status : undefined
            })
            this.setState({
                searchParams
            }, () => {
                this.payChannelData()
            })

            // }
        })
    }
    //枚举列表
    // channelEnumOption=(obj)=>{
    //     return obj.map((item,index) => {
    //         return (
    //             <Option key={obj.code} value={item.code}>
    //                 {item.}
    //             </Option>
    //         )
    //     })
    // }
    //支付渠道列表翻页
    changePage = (page) => {
        let { payChannelPage } = this.state
        let pageData = Object.assign({}, payChannelPage, { current: page.current })
        this.setState({
            payChannelPage: pageData
        }, () => {
            this.payChannelData()
        })
    }
    renderAdvanceForm = () => {
        const { form: { getFieldDecorator } } = this.props
        const { channelEnum } = this.state
        const optionList = channelEnum.map(item => {
            return (
                <Option key={item.id} value={item.id}>
                    {item.name}
                </Option>
            )
        })
        return (
            <Form layout="inline" onSubmit={this.searchSubmit}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8}>
                        <FormItem label="支付渠道名称:">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入渠道名称" style={{ width: 160 }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8}>
                        <FormItem label="渠道类型:">
                            {getFieldDecorator('type', {
                                initialValue: ""
                            })(
                                <Select style={{ width: 160 }}>
                                    <Option value="">
                                        请选择渠道类型
                                    </Option>
                                    {optionList}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8}>
                        <FormItem label="开启状态:">
                            {getFieldDecorator('status', {
                                initialValue: ""
                            })(
                                <Select style={{ width: 160 }}>
                                    <Option value="">
                                        请选择开启状态
                                    </Option>
                                    <Option value={1}>
                                        启用
                                    </Option>
                                    <Option value={2}>
                                        停用
                                    </Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    <Button type="primary" htmlType="submit">查询</Button>
                </Row>
            </Form>
        )
    }
    BankModal = () => {
        const { isShowBank, bank } = this.state
        const columns = [
            {
                dataIndex: "key",
                title: "序号",
                render: (text, record, index) => index + 1
            }, {
                dataIndex: 'bankName',
                title: "银行名称"
            }
        ]
        const dataSource = bank
        return (<Modal
            visible={isShowBank}
            onCancel={()=>this.showBank(false)}
            footer={null}
            destroyOnClose
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={record=>record.id}
                pagination={false}
               
            >

            </Table>
        </Modal>)
    }
    showBank = (isShow, record) => {
        if (isShow) {
            this.getBankConfig(record.id)
            this.setState({
                isShowBank: isShow
            })
        } else {
            this.setState({
                isShowBank: isShow,
                bank: []
            })
        }
    }
    render() {
        const { payChannelList, payChannelPage } = this.state
        let columns = [
            {
                title: "序号",
                dataIndex: "key",
                render: (text, record, index) => index + 1,
                align:'center',
            },
            {
                title: "渠道名称",
                dataIndex: "name",
                align:'center',
            },
            {
                title: "渠道类型",
                dataIndex: "typeName",
                align:'center',
            },
            {
                title: "支持银行",
                render: (text, record) => text?<a onClick={() => this.showBank(true, record)}>{text}</a>:'-',
                dataIndex: "bankNumber",
                align:'center',
            },
            {
                title: "状态",
                dataIndex: "statusName",
                align:'center',
            },
            {
                title: "操作",
                render: (text, record) => {
                    const id = record.id
                    return (
                        <div>
                            <a onClick={() => this.changeChannelStatus(id)} style={{ marginRight: 10 }}>{record.status === 1 ? '停用' : '启用'}</a>
                            <a style={{ marginRight: 10 }} onClick={() => this.showConfigChannel(true, '编辑', record)}>编辑</a>
                            <a onClick={() => this.setBankConfig(record)}>银行设置</a>
                        </div>
                    )
                },
                dataIndex: "operation"
            }
        ]
        return (
            <PageHeaderLayout title="111">
                <Card>
                    <div>
                        {
                            this.renderAdvanceForm()
                        }
                    </div>
                    <Row style={{ marginTop: 20 }} type="flex" justify="end">
                        <Button type="primary" onClick={() => this.showConfigChannel(true, '新建')}>新建</Button>
                    </Row>
                    <div>
                        支付渠道明细
                    </div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={payChannelList}
                            rowKey={(record) => record.id}
                            pagination={payChannelPage}
                            onChange={this.changePage}
                          
                        >
                        </Table>
                    </div>
                </Card>
                {this.configChannel()}
                {this.bankDetail()}
                {this.BankModal()}
            </PageHeaderLayout>
        )
    }
} 