import React, { Component } from 'react'
import { Button, Select, DatePicker,message, Input, Form, Table, Card, Row, Col } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {stringify} from 'qs'
import {
    queryRepayChannelEnum,
    queryRepayRecord,
    queryRepayTypeEnum,
    queryRepayAmount,
    queryProductEnum,
} from '../../services/queryRepay'
import styles from './repayquery.less'
import { RegExp } from 'core-js';
const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
@Form.create()

export default class RepayQueryManage extends Component {
    constructor(){
        super()
        this.state = {
            repayChannelEnum:[],//资金渠道枚举
            repayRecord:[],//还款记录
            repayType:[],//还款类型
            repayRecordPage:{
                current:1,
                pageSize:10
            },
            searchParams:null,//查询参数
            productEnum:[],
            matchProductList:[],
            inputId:null,//产品ID
            Amount:{}//还款总额
        }
    }
    componentDidMount(){
        this.getRepayChannel()
        this.getRepayRecord()
        this.getRepayType()
        this.getProductEnum()
        this.getRepayAmount()
    }
    //获取渠道枚举
    getRepayChannel = () =>{
        queryRepayChannelEnum().then(res =>{
            if(res.resultCode===1000){
                this.setState({
                    repayChannelEnum:res.resultData
                })
            }
        })
    }
    //获取总额
    getRepayAmount = () => {
        queryRepayAmount().then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    Amount:res.resultData
                })
            }
        })
    }
    //获取产品枚举
    getProductEnum = () =>{
        queryProductEnum().then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    productEnum:res.resultData
                })
            }
        })
    }
    //获取放款类型枚举
    getRepayType =() =>{
        queryRepayTypeEnum().then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    repayType:res.resultData
                })
            }
        })
    }
    //获取还款记录
    getRepayRecord = () =>{
        let {repayRecordPage,searchParams} = this.state
        let {current:currentPage,pageSize} = repayRecordPage
        queryRepayRecord({currentPage,pageSize,searchParams}).then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    repayRecord:res.resultData,
                    repayRecordPage:res.page
                })
            }
        })
    }
     //导出列表
     exportTable = () =>{
        let {searchParams} = this.state
        window.location = `/modules/manage/repayRecord/export.htm?${stringify({searchParams})}`
    }
    //提交查询
    querySubmit = (types) => {
        const { form: { validateFields } } = this.props
        const { repayRecordPage,inputId } = this.state
        validateFields((errors, values) => {
            if (!errors) {
                const {
                    prodLineId,
                    name,
                    phone,
                    repayType,
                    overdueStatus,
                    writeOffStatus,
                    orderNo,
                    idNo,
                    fundsChanneId,
                    datePicker
                } = values
                
               let loanStartTime,loanEndTime;
            //    console.log(prodLineId,prodLineId.trim()&&!inputId)
                if(prodLineId.trim()&&!inputId){
                    message.error('不存在该产品系列')
                    return 
                }
                console.log(datePicker)
               if(datePicker&&datePicker.length){
                   loanStartTime = datePicker[0].format('YYYY-MM-DD 00:00:00')
                   loanEndTime = datePicker[1].format('YYYY-MM-DD 23:59:59')
               }
               let searchParams = {
                prodLineId:inputId?inputId:undefined,
                realName:name?name.trim():undefined,
                phone:phone?phone.trim():undefined,
                repayType:repayType?repayType:undefined,
                overdueStatus:overdueStatus?overdueStatus:undefined,
                writeOffStatus:writeOffStatus?writeOffStatus:undefined,
                orderNo:orderNo?orderNo.trim():undefined,
                idNo:idNo?idNo.trim():undefined,
                fundsChanneId:fundsChanneId?fundsChanneId:undefined,
                loanStartTime:loanStartTime?loanStartTime:undefined,
                loanEndTime:loanEndTime?loanEndTime:undefined,
               }
               if(types === 'query'){
                let pageData = Object.assign({},repayRecordPage,{current:1})
                this.setState({
                    searchParams:JSON.stringify(searchParams),
                    repayRecordPage:pageData
                },()=>{
                    this.getRepayRecord()
                })
               }else{
                this.setState({
                    searchParams:JSON.stringify(searchParams)
                },()=>{
                    this.exportTable()
                })
               }
               
            }
        })
    }
    //重置表单
    resetFrom = (e) => {
        e.persist()
        this.setState({
            inputId:null
        })
        this.props.form.resetFields()
    }
    optionList = (arr) =>{
        return arr.map(item=>{
            return (
                <Option key={item.id} value={item.id}>
                    {item.name}
                </Option>
            )
        })
    }
    //查找产品
    searchProduct = (e) =>{
        e.persist()
        // console.log(e.currentTarget.value)
        const {productEnum} = this.state
        const value = e.currentTarget.value
        const matchProductList =  productEnum.filter(item =>{
            if(item.prodLineName.includes(value)){
                return item
            }
        })
        if(!matchProductList.length){
            this.setState({
                inputId:null
            })
        }
        this.setState({
            matchProductList
        })
    }
    //选择产品
    chooseProduct = (e) => {
        e.persist()
        e.preventDefault()
        e.stopPropagation()
        this.props.form.setFieldsValue({'prodLineId':e.currentTarget.innerText})
        // console.log(e.currentTarget.id,e)
        this.setState({
            matchProductList:[],
            inputId:e.currentTarget.id
        })
    }
     //获取产品信息
     getProductInfo = (e) =>{
       setTimeout(()=>{
        this.setState({
            matchProductList:[]
        })
       },200)
    }
    renderAdvancedForm = () => {
        const { form: { getFieldDecorator } } = this.props
        const {repayChannelEnum,repayType,matchProductList} = this.state
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
        const repayTypeArr = Object.keys(repayType).map(item =>{
            return {
                id:item,
                name:repayType[item]
            }
        })
        const matchProductListDOM = matchProductList&&matchProductList.map(item =>{
            return <div  className={styles.prodList} id={item.id} key={item.id} onClick={this.chooseProduct}>{item.prodLineCode}{item.prodLineName}</div>
        })
        return (
            < Form   >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                    <div className={styles.inputWrap}>
                        <FormItem
                            {...formLayout}
                            label="产品系列名称:"
                        >
                            {getFieldDecorator('prodLineId',{
                                initialValue:''
                            })(
                                    <Input onFocus={this.searchProduct} onBlur={this.getProductInfo} onChange={this.searchProduct} style={{ width: 150 }}  autoComplete="off" placeholder="请输入产品系列名称" /> 
                            )}
                            {matchProductList.length?
                                    <div className={styles.inputList}>
                                        {matchProductListDOM}
                                    </div>:null}
                        </FormItem>
                        </div>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                         {...formLayout}
                            label="手机号:"
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
                            {...formLayout}
                            label="姓名:"
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
                            {...formLayout}
                            label="身份证号:"
                        >
                            {getFieldDecorator('idNo', {
                                validateTrigger: 'onBlur'
                            })(
                                <Input placeholder="请输入身份证号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                        <FormItem 
                         {...formLayout}
                        label="订单号">
                            {
                                getFieldDecorator('orderNo')(
                                    <Input  placeholder="请输入订单号" />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                         {...formLayout}
                        label="还款类型">
                            {
                                getFieldDecorator('repayType', {
                                    initialValue: ""
                                })(
                                    <Select>
                                        <Option value="">
                                            请选择还款类型
                                        </Option>
                                        {this.optionList(repayTypeArr)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                         {...formLayout}
                        label="是否逾期">
                            {
                                getFieldDecorator('overdueStatus', {
                                    initialValue: ""
                                })(
                                    <Select style={{ width: 100 }}>
                                        <Option value="">
                                            请选择是否逾期
                                        </Option>
                                        <Option value="0">
                                            否
                                        </Option>
                                        <Option value="1">
                                            是
                                        </Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col md={6} sm={24}>
                        <FormItem
                         {...formLayout}
                        label="核销状态">
                            {
                                getFieldDecorator('writeOffStatus', {
                                    initialValue: ""
                                })(
                                    <Select style={{ width: 100 }}>
                                        <Option value="">
                                            请选择核销状态
                                        </Option>
                                        <Option value="0">
                                            未核销
                                        </Option>
                                        <Option value="1">
                                            已核销
                                        </Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col
                        md={5} sm={24}
                    >
                        <FormItem
                         {...formLayout}
                            label="资金渠道">
                            {
                                getFieldDecorator('fundsChanneId', {
                                    initialValue: ""
                                })(
                                    <Select
                                    style={{width:160}}
                                    >
                                        <Option value="">
                                            请选择资金渠道
                                        </Option>
                                        {this.optionList(repayChannelEnum)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col
                        md={8} sm={24}
                    >
                        <FormItem
                         {...formLayout}
                            label="还款日期">
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
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={()=>this.querySubmit('query')}>查询</Button>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={()=>this.querySubmit('export')}>导出</Button>
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.resetFrom}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
    //翻页
    changePage = (page) =>{
        let {repayRecordPage} = this.state
        let pageData = Object.assign({},repayRecordPage,{current:page.current})
        this.setState({
            repayRecordPage:pageData
        },()=>{
            this.getRepayRecord()
        })
    }
    render() {
        const {repayRecord,repayRecordPage,Amount} = this.state
        const columns = [
            {
                title: "借款订单号",
                dataIndex: "orderNo"
            },
            {
                title: "姓名",
                dataIndex: "realName"
            },
            {
                title: "手机号码",
                dataIndex: "phone"
            },
            {
                title: "还款类型",
                dataIndex: "repayTypeStr"
            },
            {
                title: "是否逾期",
                dataIndex: "overdueStatusStr"
            },
            {
                title: "核销状态",
                dataIndex: "writeOffStatusStr"
            },
            {
                title: "产品系列名称",
                dataIndex: "prodLineName"
            },
            {
                title: "借款本金",
                dataIndex: "principal"
            },
            {
                title: "借款期数",
                dataIndex: "peroidValue"
            },
            {
                title: "当前期数",
                dataIndex: "scheduleNo"
            },
            {
                title: "账单日",
                dataIndex: "dueTime"
            },
            {
                title: "实还日期",
                dataIndex: "realRepayTime"
            },
            {
                title: "实还金额",
                dataIndex: "realRepayAmount"
            },
            {
                title: "资方渠道",
                dataIndex: "funsChannelName"
            },
        ]
        return (
            <PageHeaderLayout title="还款查询">
                <Card>
                    <div>
                        {this.renderAdvancedForm()}
                    </div>
                    <div>
                        <div style={{ margin: "10px 0" }}>
                            还款信息
                    </div>
                        <Table
                            columns={columns}
                            scroll={{ x: 2000 }}
                            pagination={repayRecordPage}
                            dataSource={repayRecord}
                            onChange={this.changePage}
                        ></Table>
                        <div style={{ marginTop: 10 }}>
                            今日还款总额：<a style={{textDecorationLine:'none'}}>{Amount.todayRepay?Amount.todayRepay:0}</a>元，累计还款总额：<a style={{textDecorationLine:'none'}}>{Amount.totalRepay?Amount.totalRepay:0}</a>元
                        </div>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}