import React, { Component } from 'react'
import { Button, Modal, Input, message, Form, Select, DatePicker, Card, Table, Row, Col } from 'antd'
import ReactDOM from 'react-dom';
import { stringify } from 'qs'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
    queryAuditEnum,
    queryTypeEnum,
    queryAuditList,
    queryAuditAmount,
    submitAudit
} from '../../services/offlineRepayReview'
import styles from './offlinerepayreview.less'
const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const confirm = Modal.confirm;
const TextArea = Input.TextArea
@Form.create()
export default class OfflineRepayReview extends Component {
    constructor() {
        super()
        this.state = {
            checkModal: false,
            showBig: false,
            offlineAduitEnum: {},//复审类型
            typeEnum: {},//入账类型
            auditList: [],//复审列表
            auditListPage: {
                current: 1,
                pageSize: 10
            },
            searchParams: null,//查询参数
            auditDetail: null,//复审详情信息
        }
    }
    componentDidMount() {
        this.getOfflineAduit()
        this.getOfflineType()
        this.getOfflineAduitList()
    }
    //获取复审列表
    getOfflineAduitList = () => {
        let { auditListPage, searchParams } = this.state
        let { current: currentPage, pageSize } = auditListPage
        queryAuditList({ type: 1, currentPage, pageSize, searchParams }).then(res => {
            if (res.resultCode === 1000) {
                this.setState({ auditList: res.resultData })
            }
        })
    }
    //获取审核枚举
    getOfflineAduit() {
        queryAuditEnum().then(res => {
            if (res.resultCode === 1000) {
                this.setState({
                    offlineAduitEnum: res.resultData
                })
            }
        })
    }
    //获取类型枚举
    getOfflineType() {
        queryTypeEnum().then(res => {
            if (res.resultCode === 1000) {
                this.setState({
                    typeEnum: res.resultData
                })
            }
        })
    }
    //提交审核
    auditSubmit = (params) => {
        submitAudit(params).then(res => {
            if (res.resultCode === 1000) {
                let { auditListPage } = this.state
                let pageData = Object.assign({}, auditListPage, { current: 1 })
                this.setState({
                    checkModal: false,
                    auditListPage: pageData
                }, () => {
                    this.getOfflineAduitList()
                })
            }
        })
    }
    //提交查询
    querySubmit = (types) => {
        const { form: { validateFields } } = this.props
        let { auditListPage } = this.state
        validateFields((errors, values) => {
            if (!errors) {
                let {
                    orderNo,
                    name,
                    phone,
                    scheduleNo,
                    type,
                    status,
                    datePicker
                } = values
                let startTime, endTime;
                if (datePicker&&datePicker.length) {
                    startTime = datePicker[0].format('YYYY-MM-DD 00:00:00')
                    endTime = datePicker[1].format('YYYY-MM-DD 23:59:59')
                }
                let searchParams = {
                    orderNo: orderNo ? orderNo.trim() : undefined,
                    name: name ? name.trim() : undefined,
                    phone: phone ? phone.trim() : undefined,
                    scheduleNo: scheduleNo ? scheduleNo.trim() : undefined,
                    type: type ? type.trim() : undefined,
                    status: status ? status.trim() : undefined,
                    startTime: startTime ? startTime : undefined,
                    endTime: endTime ? endTime : undefined,
                }

                if (types === 'query') {
                    let pageData = Object.assign({}, auditListPage, { current: 1 })
                    this.setState({
                        searchParams: JSON.stringify(searchParams),
                        auditListPage: pageData
                    }, () => {
                        this.getOfflineAduitList()
                    })
                } else {
                    this.setState({
                        searchParams: JSON.stringify(searchParams)
                    }, () => {
                        this.exportTable()
                    })
                }
            }
        })
    }
    //重置表单
    resetFrom = () => {
        this.props.form.resetFields()
    }
    //显示确认框
    showConfirmModal = (pass, id) => {
        const _this = this
        if (pass) {
            confirm({
                title: '是否确认审核通过？',
                onOk() {
                    let params = {
                        id,
                        status: 50
                    }
                    _this.auditSubmit(params)
                },
                onCancel() {
                },
            });
        } else {
            confirm({
                title: '是否确认拒绝该申请？',
                content: <div>
                    <TextArea style={{ width: 400 }} maxLength={200} ref={el => { this.reason = el }} autosize={true} placeholder="请输入审核拒绝原因"></TextArea>
                </div>,
                onOk() {
                    // console.log(_this.reason.textAreaRef.value)
                    if (!_this.reason.textAreaRef.value.trim()) {
                        message.error('请输入拒绝的原因')
                        return
                    }
                    let params = {
                        id,
                        status: 41,
                        reason: _this.reason.textAreaRef.value
                    }
                    _this.auditSubmit(params)
                },
                onCancel() {
                },
            });
        }

    }
    //optionList 
    optionList = (obj) => {
        return Object.keys(obj).map(item => {
            return (<Option key={item} value={item}>
                {obj[item]}
            </Option>)
        })
    }
    //取消的确认框
    cancleComfirm = () => {
        const _this = this
        confirm({
            title: '是否确认取消本次操作？',
            onOk() {
                _this.showCheckModal(false)
            },
            onCancel() {
            },
        });
    }
    //复审modal
    checkModal = () => {
        const { checkModal, auditDetail } = this.state
        const { form: { getFieldDecorator } } = this.props
        return (
            <Modal
                title={"线下收款复审"}
                visible={checkModal}
                footer={null}
                onCancel={() => this.showCheckModal(false)}
                width={680}
            >
                <div className={styles.content}>

                    {auditDetail
                        ?
                        auditDetail.status === 40 ?
                            null :
                            <Row style={{ marginBottom: '20px' }}><Col md={8}>审核状态:{auditDetail.statusStr}</Col>{auditDetail.status === 41 ? <Col style={{ overflowWrap: 'break-word' }} md={14}>拒绝原因:{auditDetail.remark}</Col> : null}</Row> : null
                    }
                    <div className={styles['money-detail']}>
                        <div className={styles.detail_left}>
                            <div className={styles.l_head}>
                                应还金额
                        </div>
                            {/* className={styles.l_content} */}
                            <div className={styles.l_content} >
                                {auditDetail ? auditDetail.repayAmount.map(item => {
                                    return <Row className={styles.l_content_wrap} key={item.name}><Col md={12}><div style={{ textAlign: "right" }}>{item.name}：</div></Col><Col md={12}>{item.value}</Col></Row>
                                }) : null}
                            </div>
                            <div className={styles.l_bottom}>
                                <Row className={styles.l_content_wrap} ><Col md={12}><div style={{ textAlign: "right" }}>合计：</div></Col><Col md={12}><span>{auditDetail ? auditDetail.totalAmount : 0}</span> 元</Col></Row>
                            </div>
                        </div>
                        <div className={styles.detail_right}>
                            <div className={styles.r_head}>
                                剩余金额
                        </div>
                            <div className={styles.r_content}>
                                {auditDetail ? auditDetail.residueAmount.map(item => {
                                    return <Row className={styles.r_content_wrap} key={item.name}><Col md={12}><div style={{ textAlign: "right" }}>{item.name}：</div></Col><Col md={12}>{item.value}</Col></Row>
                                }) : null}
                            </div>
                            <div className={styles.r_bottom}>
                                <Row className={styles.l_content_wrap} ><Col md={12}><div style={{ textAlign: "right" }}>剩余合计：</div></Col><Col md={12}><span>{auditDetail ? auditDetail.remainAmount : 0}</span>元</Col></Row>

                            </div>
                        </div>
                    </div>
                    <div className={styles.form}>
                        <Form layout="inline">
                            <Row type="flex" justify="space-between" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={12} sm={12}>
                                    <FormItem label="线下还款类型">
                                        {getFieldDecorator('repayType', {
                                            initialValue: auditDetail ? auditDetail.typeStr : ''
                                        })(
                                            <Input style={{ width: 160 }} disabled />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={11} sm={12}>
                                    <FormItem label="线下还款期数">
                                        {getFieldDecorator('repaypPeriods', {
                                            initialValue: auditDetail ? auditDetail.scheduleNoStr : 0
                                        })(
                                            <Input style={{ width: 150 }} disabled />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="space-between" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={12} sm={12}>
                                    <FormItem label="线下还款金额">
                                        {getFieldDecorator('repayType', {
                                            initialValue: auditDetail && auditDetail.type === 22 ? auditDetail.amount : 0
                                        })(
                                            <Input style={{ width: 160 }} suffix="元" disabled />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={10} sm={12}>
                                    <FormItem label="息费减免">
                                        {getFieldDecorator('repaypPeriods', {
                                            initialValue: auditDetail && auditDetail.type === 31 ? auditDetail.amount : 0
                                        })(
                                            <Input style={{ width: 150 }} suffix="元" disabled />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" justify="space-between" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={11} sm={12}>
                                    <FormItem label="线下还款方式">
                                        {getFieldDecorator('repayType', {
                                            initialValue: auditDetail ? auditDetail.offlinerRepayTypeStr : ''
                                        })(
                                            <Input style={{ width: 150 }} disabled />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={24} push={1} sm={12}>
                                    <FormItem label="&nbsp;&nbsp;&nbsp;流水号">
                                        {getFieldDecorator('repaypPeriods', {
                                            initialValue: auditDetail ? auditDetail.paymentFlow : ''
                                        })(
                                            <Input type="text" style={{ width: 500 }} disabled />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                {auditDetail && auditDetail.imgUrl ? <Col>
                                    <FormItem label="转账图片">
                                        <div onClick={() => this.bigImg(auditDetail ? auditDetail.imgUrl : '')} className={styles.imgWrap}>
                                            <img src={auditDetail ? auditDetail.imgUrl : ''} alt="" />
                                        </div>
                                    </FormItem>
                                </Col> : null}
                            </Row>
                            <Row justify="center" style={{ marginTop: 20 }} type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                                {auditDetail && auditDetail.status === 40 ?
                                    <Col>
                                        <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.showConfirmModal(true, auditDetail.id)}>复审通过</Button>
                                        <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.showConfirmModal(false, auditDetail.id)}>复审拒绝</Button>
                                        <Button onClick={() => this.cancleComfirm()}>取消</Button>
                                    </Col> :
                                    <Col>
                                        <Button type="primary" onClick={() => this.showCheckModal(false)}>关闭</Button>
                                    </Col>
                                }
                            </Row>
                        </Form>
                    </div>
                </div>
            </Modal>
        )
    }
    //请求金额
    getAuditAmount = (record) => {
        let auditDetail = JSON.parse(JSON.stringify(record))
        // console.log(record.id)
        queryAuditAmount({ offlineAuditId: record.id }).then(res => {
            if (res.resultCode === 1000) {
                // console.log(res.resultData)
                const amountInfo = res.resultData.amountInfo
                let repayAmount = []
                let residueAmount = []
                amountInfo.map(item => {
                    let repay = {
                        name: item[0],
                        value: item[1]
                    }
                    let residue = {
                        name: item[2],
                        value: item[3]
                    }
                    repayAmount.push(repay)
                    residueAmount.push(residue)
                })
                auditDetail.repayAmount = repayAmount
                auditDetail.residueAmount = residueAmount
                auditDetail.remainAmount = res.resultData.remainAmount
                auditDetail.totalAmount = res.resultData.totalAmount
                this.setState({
                    auditDetail
                })
            }
        })
    }
    //是否显示modal
    showCheckModal = (isShow, record) => {
        // console.log(isShow, record)
        if (isShow && record) {
            this.getAuditAmount(record)
        } else {
            this.setState({
                auditDetail: null
            })
        }
        this.setState({
            checkModal: isShow
        })
    }
    //显示大图
    bigImg = (url) => {
        this.modal = document.createElement('div')
        document.body.append(this.modal)
        let Dom = (
            <div onClick={this.delBigImg} className={styles.b_wrap}>
                <img className={styles.b_img} src={url} alt="" />
            </div>
        )
        ReactDOM.render(Dom, this.modal)
    }
    //删除BigImg
    delBigImg = () => {
        this.modal && this.modal.parentNode.removeChild(this.modal)
    }
    renderAdvancedForm = () => {
        const { form: { getFieldDecorator } } = this.props
        const { offlineAduitEnum, typeEnum } = this.state
        let formLayout = {
            labelCol: {
                lg: { span: 24 },
                xl: { span: 9 },
            },
            wrapperCol: {
                lg: { span: 24 },
                xl: { span: 12 },
            },
        }
        return (
            < Form >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="订单号:"
                            {...formLayout}
                        >
                            {getFieldDecorator('orderNo', {
                                validateTrigger: 'onBlur'
                            })(
                                <Input style={{ width: 150 }} placeholder="请输入订单号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="手机号:"
                            {...formLayout}
                        >
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                                        len: 11,
                                        message: '请输入有效的手机号'
                                    }
                                ],
                                validateTrigger: 'onBlur'
                            })(
                                <Input placeholder="请输入客户手机号" maxLength={11} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="姓名:"
                            {...formLayout}
                        >
                            {getFieldDecorator('name', {
                                validateTrigger: 'onBlur'
                            })(
                                <Input placeholder="请输入客户姓名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="期数:"
                            {...formLayout}
                        >
                            {getFieldDecorator('scheduleNo', {
                                validateTrigger: 'onBlur'
                            })(
                                <Input placeholder="请输入期数" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="入账类型:"
                            {...formLayout}
                        >
                            {getFieldDecorator('type', {
                                initialValue: ""
                            })(
                                <Select style={{ width: 150 }}>
                                    <Option value=''>请选择</Option>
                                    {this.optionList(typeEnum)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                            label="审核状态:"
                            {...formLayout}
                        >
                            {getFieldDecorator('status', {
                                initialValue: ""
                            })(
                                <Select style={{ width: 150 }}>
                                    <Option value=''>请选择</Option>
                                    {this.optionList(offlineAduitEnum)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col
                        md={10} sm={24}
                    >
                        <FormItem
                            {...formLayout}
                            label="提交审核时间">
                            {
                                getFieldDecorator('datePicker')(
                                    <RangePicker>
                                    </RangePicker>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }} type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} justify="end">
                    <Col md={7} sm={24}>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.querySubmit('query')} >查询</Button>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={() => this.querySubmit('export')}>导出</Button>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.resetFrom}>重置</Button>
                    </Col>
                </Row>
            </ Form>
        )
    }
    //翻页
    changePage = (page) => {
        let { auditListPage } = this.state
        let pageData = Object.assign({}, auditListPage, { current: page.current })
        this.setState({
            auditListPage: pageData
        }, () => {
            this.getOfflineAduitList()
        })
    }
    //导出列表
    exportTable = () => {
        let { searchParams } = this.state
        window.location = `/modules/manage/repay/offlineAuditExport.htm?${stringify({ searchParams, type: 1 })}`
    }
    render() {
        const {
            auditList,
            auditListPage
        } = this.state
        let columns = [
            {
                title: "订单号",
                dataIndex: "orderNo",
                key: "0"
            },
            {
                title: "姓名",
                dataIndex: "name",
                key: "1"
            },
            {
                title: "手机号码",
                dataIndex: "phone",
                key: "2"
            },
            {
                title: "产品系列名称",
                dataIndex: "prodLineName",
                key: "3"
            },
            {
                title: "期数",
                dataIndex: "peroidValue",
                key: "4"
            },
            {
                title: "线下还款期数",
                dataIndex: "scheduleNoStr",
                key: "5"
            },
            {
                title: "入账类型",
                dataIndex: "typeStr",
                key: "6"
            },
            {
                title: "金额",
                dataIndex: "amount",
                key: "7"
            },
            {
                title: "提交人员",
                dataIndex: "operator",
                key: "8"
            },
            {
                title: "审核状态",
                dataIndex: "statusStr",
                key: "9"
            },
            {
                title: "提交审核时间",
                dataIndex: "createTime",
                key: "10"
            },
            {
                title: "操作",
                dataIndex: "operation",
                render: (text, record) => {
                    return (
                        <div>
                            {record.status === 40 ?
                                <span style={{ color: '#3771FB', cursor: 'pointer', marginRight: 10 }} onClick={() => this.showCheckModal(true, record)}>审核</span>
                                : <span style={{ color: '#3771FB', cursor: 'pointer' }} onClick={() => this.showCheckModal(true, record)}>查看</span>
                            }
                        </div>
                    )
                },
                key: "11"
            }
        ]
        return (
            <PageHeaderLayout title="线下还款复审">
                <Card>
                    <div>
                        {this.renderAdvancedForm()}
                    </div>
                    <div>
                        <div style={{ marginTop: 10 }}>
                            还款订单信息
                        </div>
                        <Table
                            columns={columns}
                            pagination={auditListPage}
                            dataSource={auditList}
                            onChange={this.changePage}
                        >
                        </Table>
                    </div>
                </Card>
                {this.checkModal()}
            </PageHeaderLayout>
        )
    }
}