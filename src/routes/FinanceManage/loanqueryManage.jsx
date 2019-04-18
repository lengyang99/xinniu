import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Button, Form, Input, DatePicker,message, Table, Select, Row, Col, Card } from 'antd'
import {stringify} from 'qs'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
    queryLoanChannelEnum,
    queryLoanRecord,
    queryLoanAmount,
    queryProductEnum
    
} from '../../services/queryloan.js'

import styles from './loanquerymanage.less'
const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
@Form.create()
export default class LoanQueryManage extends Component {
    constructor(){
        super()
        this.state = {
            loanChannelEnum:[],//放款渠道枚举
            loanRecordPage:{
                current:1,
                pageSize:10
            },
            loanRecordData:[],//放款记录
            searchParams:null,//查询条件
            loanAmount:null,//放款总额
            productEnum:[],//产品列表枚举
            matchProductList:[],//产品列表
            inputId:null,//产品Id
        }
    }
    componentDidMount(){
        this.getLoanChannelEnum()
        this.getLoanRecord()
        this.getLoanAmount()
        this.getProductEnum()
    }
     //获取产品枚举
     getProductEnum = () =>{
        queryProductEnum().then(res =>{
            if(res.resultCode === 1000){
                console.log(1)
                this.setState({
                    productEnum:res.resultData
                })
            }
        })
    }
    //获取渠道枚举
    getLoanChannelEnum = () =>{
        queryLoanChannelEnum().then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    loanChannelEnum:res.resultData
                })
            }else{
                message.error(res.resultMessage)
            }
        })
    }
    //获取放款总额
    getLoanAmount = () =>{
        queryLoanAmount().then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    loanAmount:res.resultData
                })
            }
        })
    }
    //获取放款记录
    getLoanRecord = () =>{
        let {loanRecordPage,searchParams} = this.state
        let {current:currentPage,pageSize} =loanRecordPage
        queryLoanRecord({currentPage,pageSize,searchParams}).then(res =>{
            if(res.resultCode === 1000){
                this.setState({
                    loanRecordData:res.resultData,
                    loanRecordPage:res.page
                })
            }
        })
    }
    //导出列表
    exportTable = () =>{
        let {searchParams} = this.state
        window.location = `/modules/manage/loanRecord/export.htm?${stringify({searchParams})}`
    }
    //提交查询
    querySubmit = (type) => {
        // e.preventDefault()
        const {form:{validateFields}} = this.props
        const {loanRecordPage,inputId} = this.state
        validateFields((errors, values) => {
            if(!errors){
               const {
                prodLineId,
                name,
                phone,
                orderNo,
                idNo,
                fundsChanneId,
                datePicker
               } = values
               let loanStartTime;
               let loanEndTime;
               if(prodLineId&&!inputId){
                message.error('不存在该产品系列')
                return 
            }
               if(datePicker&&datePicker.length){
                    loanStartTime = datePicker[0].format('YYYY-MM-DD 00:00:00')
                    loanEndTime = datePicker[1].format('YYYY-MM-DD 23:59:59')
               }
               
               let searchParams = {
                prodLineId:inputId?inputId:undefined,
                realName:name?name:undefined,
                phone:phone?phone:undefined,
                orderNo:orderNo?orderNo:undefined,
                idNo:idNo?idNo:undefined,
                fundsChanneId:fundsChanneId?fundsChanneId:undefined,
                loanStartTime:loanStartTime?loanStartTime:undefined,  
                loanEndTime:loanEndTime?loanEndTime:undefined,    
               }
               if(type === 'query'){
                    let pageData = Object.assign({},loanRecordPage,{current:1})
                    this.setState({
                        searchParams:JSON.stringify(searchParams),
                        loanRecordPage:pageData
                    },()=>{
                        this.getLoanRecord()
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
    resetFrom = () => {
        this.setState({
            inputId:null
        })
        this.props.form.resetFields()
    }
    //optionList列表
    optionList = (arr) =>{
       return arr.map(item =>{
            return (<Option key={item.id} value={item.id}>
                {item.name}
            </Option>)
        })
    }
     //查找产品
     searchProduct = (e,type) =>{
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
        const {loanChannelEnum,matchProductList} = this.state
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

        const matchProductListDOM = matchProductList&&matchProductList.map(item =>{
            return <div  className={styles.prodList} id={item.id} key={item.id} onClick={this.chooseProduct}>{item.prodLineCode}{item.prodLineName}</div>
        })
        return (
            < Form  >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                <div className={styles.inputWrap}>
                        <FormItem 
                        {...formLayout}
                            label="产品系列名称:"
                        >
                            {getFieldDecorator('prodLineId')(
                                <Input autoComplete="off" onFocus={(e)=>this.searchProduct(e)} onBlur={this.getProductInfo} onChange={(e)=>this.searchProduct(e)} style={{width:150}} placeholder="请输入产品系列名称" />
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
                                <Input  placeholder="请输入客户手机号" maxLength={11} />
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
                                <Input  placeholder="请输入身份证号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={6} sm={24}>
                    <FormItem 
                    {...formLayout}
                            label="订单号:"
                        >
                            {getFieldDecorator('orderNo', {
                                validateTrigger: 'onBlur'
                            })(
                                <Input style={{width:160}}  placeholder="请输入订单号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col
                     md={6} sm={24}
                    >
                        <FormItem
                        {...formLayout}
                        label="资金渠道">
                        {
                            getFieldDecorator('fundsChanneId',{
                                initialValue:""
                            })(
                                <Select style={{width:160}}>
                                    <Option value="">
                                        请选择资金渠道
                                    </Option>
                                    {this.optionList(loanChannelEnum)}
                                </Select>
                            )
                        }
                        </FormItem>
                    </Col>
                    <Col
                    pull={1}
                     md={9} sm={24}
                    >
                        <FormItem
                        {...formLayout}
                        label="放款日期">
                        {
                            getFieldDecorator('datePicker')(
                                <RangePicker>
                                </RangePicker>
                            )
                        }
                        </FormItem>
                    </Col>
                </Row>
                <Row className={styles['btnRow']} type="flex" gutter={{ md: 8, lg: 24, xl: 48 }} justify="end">
                    <Col  md={7} sm={24}>
                        <Button className={styles.queryBtn} type="primary" onClick={()=>this.querySubmit('query')}>查询</Button>
                        {/* onClick={()=>derivedTable()}  <a style={{textDecorationLine:'none'}} href="/modules/manage/loanRecord/export.htm"> </a>*/}
                        <Button  className={styles.queryBtn}  type="primary" onClick={()=>this.querySubmit('export')}>导出</Button>
                        <Button className={styles.queryBtn} type="primary" onClick={this.resetFrom}>重置</Button>
                    </Col>
                </Row> 
            </Form >
        )
    }
    //翻页
    changePage = (page)=>{
        let {loanRecordPage} = this.state
        let pageData = Object.assign({},loanRecordPage,{current:page.current})
        this.setState({
            loanRecordPage:pageData
        },()=>{
            this.getLoanRecord()
        })
    }
    render() {
        const {loanRecordData,loanAmount,loanRecordPage} = this.state
        const columns = [
            {
                title:"订单号",
                dataIndex:"orderNo"
            },
            {
                title:"姓名",
                dataIndex:"realName"
            },
            {
                title:"手机号码",
                dataIndex:"phone"
            },
            {
                title:"用户ID",
                dataIndex:"userId"
            },
            {
                title:"证件号码",
                dataIndex:"idNo"
            },
            {
                title:"银行卡号",
                dataIndex:"cardNo"
            },
            {
                title:"开户行",
                dataIndex:"bank"
            },
            {
                title:"产品系列名称",
                dataIndex:"prodLineName"
            },
            {
                title:"借款金额",
                dataIndex:"principal"
            },
            {
                title:"实放款金额",
                dataIndex:"loanValue"
            },
            {
                title:"利率",
                dataIndex:"rate"
            },
            {
                title:"应还本金",
                dataIndex:"duePrincipal"
            },
            {
                title:"应还利息",
                dataIndex:"dueInterest"
            },
            {
                title:"应还服务费",
                dataIndex:"dueServiceFee"
            },
            {
                title:"应还其他费用总金额",
                dataIndex:"dueOtherFee"
            },
            {
                title:"三方交易流水号",
                dataIndex:"serialNo"
            },
            {
                title:"借款日期",
                dataIndex:"createTime"
            },
            {
                title:"资金渠道",
                dataIndex:"fundsChannelStr"
            },
            {
                title:"资金方关联单号",
                dataIndex:"funsChannelNo"
            }
        ]
        return (
            <PageHeaderLayout title="放款查询">
                <Card>
                    <div>
                        {this.renderAdvancedForm()}
                    </div>
                    <div>
                        <div style={{margin:"10px 0"}}>放款信息</div>
                        <Table
                        columns={columns}
                        scroll={{ x: 3000}} 
                        dataSource={loanRecordData}
                        pagination={loanRecordPage}
                        onChange={this.changePage}
                        ></Table>
                        <div style={{marginTop:10}}>
                            今日放款成功总额：<a style={{textDecorationLine:'none'}}>{loanAmount&&loanAmount.todayAmount?loanAmount.todayAmount:0}</a>元，累计放款成功总额：<a style={{textDecorationLine:'none'}}>{loanAmount&&loanAmount.loanTotalAmount?loanAmount.loanTotalAmount:0}</a>元
                        </div>
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}
