import React, { Component } from 'react'
import { Table, Modal ,Upload, Row, InputNumber, Col, Button, Form, Input, DatePicker, Checkbox, message } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

import styles from './MaterialMange.less'

const FormItem = Form.Item;
@connect((state)=>({ materialmange: state.materialmange }))
@Form.create()
 class MaterialMange extends Component {
    state = {
        data:[],
        visible: false,//Modal显示隐藏
        action: '新增',
        currentPage:1, //当前页数
        pageSize:10, //页面条数
        fileList:[],//图片列表
        fileUrl:null,//图片路径
        sort: '',
        bannerInfo:{}, //单个banner信息
        currentTime:null, //当前时间
        sTime:'', //开始时间
        eTime: '' //结束时间
    }
    //操作模态框
    handleCancel = () =>{
        const {materialmange, dispatch} = this.props
        const {bannerInfo} = this.state
        let {visible} = this.state
        if(bannerInfo.id){
            // dispatch({
            //     type: 'materialmange/changeBannerInfo',
            //     payload:{}
            // })
            this.setState({
                fileList:[],//图片列表
                fileUrl:null,//图片路径
                bannerInfo:{},
                sTime: moment(),
                eTime: moment()
            })
        }
        this.setState({
            visible:!visible
        })
        if(!visible){
            this.setState({
                sTime: '', //开始时间
                eTime: '' //结束时间
            })
        }
    }
    //上传图片状态
    uploadChange = ({file,fileList,event}) => {
        if(file.status === 'done'){
            if(file.response&&file.response.resultCode === 1000){
                this.setState({
                    fileUrl: file.response.resultData
                })
            }
        }
        this.setState({
            fileList: fileList.slice(-1)
        })
    }
    //验证纯数字
    verifySort = (e) => {
        e.persist()
        e.target.value = e.target.value.replace(/[^0-9]/g,'')
    }

    //编辑或者修改banner
    handleOk = () => {
        this.onSubmit()
    }
    componentWillMount(){
       let {dispatch, materialmange} = this.props;
       this.setState({
        bannerInfo: materialmange.bannerInfo
       })
       dispatch({type:'materialmange/getAllBanner',payload:{
           currentPage:1,
           pageSize:10
       }})
    }
    formDate = (time) => {
        const date =new Date(time)
        let moth = date.getMonth()+1
        let year = date.getFullYear()
        let day = date.getDate()
        let hour = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
       const  addzore = (number) => {
            return number < 10 ? `0${number}`: number
        }
        return `${addzore(year)}-${addzore(moth)}-${addzore(day)} ${addzore(hour)}:${addzore(min)}:${addzore(sec)}`
    }
    //修改状态
    changeOperator = (sty, id) => {
        let {dispatch} = this.props
        switch (sty){
            case 'editor': {
                this.setState({
                    visible: true,
                    action: '编辑'
                })
                let callback = (bannerInfo)=>{
                    let strArr = bannerInfo.bannerImg.split('/')
                    let name = strArr[strArr.length-1]
                    let fileList = {
                        uid: '-1',
                        name,
                        status: 'done',
                        url: bannerInfo.bannerImg,
                        thumbUrl: bannerInfo.bannerImg
                    }
                    this.setState({
                        fileUrl: bannerInfo.bannerImg,
                        fileList:[fileList],
                        bannerInfo,
                        sTime: moment(bannerInfo.startTime),
                        eTime: moment(bannerInfo.endTime)
                    })
                }
                dispatch({type:'materialmange/getBannerInfo',payload:{id},callback})
                break;
            }    
            case 'del': {
                let payload = {
                    id: id,
                    status: 2
                } 
                dispatch({
                    type: 'materialmange/changeStatus',
                    payload
                })
                break;
            }
            case 'colse': {
                let payload = {
                    id: id,
                    status: 1
                } 
                dispatch({
                    type: 'materialmange/changeStatus',
                    payload
                })
                break;
            }
            case 'open': {
                let payload = {
                    id: id,
                    status: 0
                } 
                dispatch({
                    type: 'materialmange/changeStatus',
                    payload
                })
                break;
            }
        }
    }
    //提交修改或者创建banner
    onSubmit(){
        let {sTime, eTime, bannerInfo} = this.state
        const { form: { validateFieldsAndScroll }, dispatch, materialmange } = this.props
        validateFieldsAndScroll((err, values)=>{
            if(!err){
                const {sort, beginTime, endTime, link} =values
                const { fileUrl } = this.state
                if(!fileUrl){
                    message.info('请添加banner图片')
                    return
                }
                if(!sort){
                    message.info('请输入1-100排序权重')
                    return
                }
                if(sTime>= endTime){
                    message.info('结束时间必须比开始时间大')
                    return
                }
                if(bannerInfo.id){
                    var params = {
                        id:bannerInfo.id,
                        bannerImg: fileUrl,
                        startTime:this.formDate(beginTime),
                        endTime:this.formDate(endTime),
                        serviceUrl: link,
                        weight: sort
                    }

                }else{
                    var params = {
                        bannerImg: fileUrl,
                        startTime:this.formDate(beginTime),
                        endTime:this.formDate(endTime),
                        serviceUrl: link,
                        weight: sort
                    }
                }
                const callback = () => {
                   this.setState({
                       bannerInfo:{},
                       fileList:[],
                       fileUrl: '',
                       visible:false,
                       sTime: '', //开始时间
                       eTime:'' //结束时间
                   })
                }
                 dispatch({type:'materialmange/submitBanner',payload:{...params},callback})
            }
        })
    }
    //移除图片
    removeImg = (file) => {
        this.setState({
            fileUrl:'',
            fileList:[]
        })
    }
    //选择时间逻辑
    chooseTime = (endValue, sty) => {
        const currentTime = this.state.currentTime;	
        let {sTime, eTime} = this.state
        if(sty === 'endTime'){
            if(sTime){
                return endValue <= sTime
            }
            return endValue <= currentTime
        }else if(sty === 'startTime'){
            let me = this;
            if(eTime){
                return endValue < currentTime || endValue> eTime
            }
            return endValue <= currentTime
        }
    }
    handleEndOpenChange = (open) => {
        let me = this
		if(open){
			me.currentTime = moment();
		}
		this.setState({currentTime:moment() })
    }
    confirmTime=(date, sty) => {
        if(sty === 'endTime'){
            this.setState({
                eTime: date
            })
        }else if(sty === 'startTime'){
            this.setState({
                sTime: date
            })
        }
    }
    render() {
        const { visible, action,data, fileList, bannerInfo,sTime,eTime} = this.state;
        const { getFieldDecorator } = this.props.form;
        const {materialmange, dispatch} = this.props;
        let weight = '', url = '';
        if(bannerInfo.weight){
             weight = bannerInfo.weight
        }
        if(bannerInfo.serviceUrl){
             url = bannerInfo.serviceUrl
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const updateLayout = {
            span:{
                xs:{span:2,offset:4},
                sm: { span: 2,offset:4 }
            },
            upload:{
                xs:{span:16,offset:0},
                sm: { span: 14,offset:0 }
            }
        }
        const colunms = [
            {
                title: '序号',
                dataIndex: 'key',
                render: (text, record, index) => {
                    return index+1
                }
            },
            {
                title: '图片',
                dataIndex: 'bannerImg',
                render: (text, record, index)=>{
                   return (<div className={styles['img-wrap']}>
                       <img  src={text} />
                   </div>)
                }
            },
            {
                title: '排序',
                dataIndex: 'weight'
            },
            {
                title: '开始时间',
                dataIndex: 'startTime'
            },
            {
                title: '结束时间',
                dataIndex: 'endTime'
            },
            {
                title: '链接',
                dataIndex: 'serviceUrl',
    
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: (text)=>{
                     switch(text){
                         case 0: {
                             return '开启'
                         }
                         case 1: {
                            return '关闭'
                        }
                        case 2: {
                            return '删除'
                        }
                     }
                }
            },
            {
                title: '操作',
                dataIndex: 'operator',
                render:(text,record)=>{
                    let status = record.status
                    let statusDOM;
                    if(status === 0){
                        statusDOM =  <span className={styles.close} onClick={(e)=>{this.changeOperator('colse',record.id)}}>关闭</span>;
                    }else if(status === 1){
                        statusDOM =  <span className={styles.open} onClick={(e)=>{this.changeOperator('open',record.id)}}>开启</span>;
                    }else{
                        statusDOM = null   
                    }
                    return(
                        <div className={styles.operator}>
                            <span className={styles.operators} onClick={(e)=>{this.changeOperator('editor',record.id)}}>编辑</span>&nbsp;
                            <span className={styles.operators} onClick={(e)=>{this.changeOperator('del',record.id)}}>删除</span>&nbsp;
                            {statusDOM}
                        </div>
                    )
                }
            },
        ]
        const pagination ={
            defaultCurrent: 1,
            total:materialmange.page.total,
            pageSize:materialmange.page.pageSize,
            onChange: function(page, pageSize){
                dispatch({type:'materialmange/getAllBanner',payload:{
                    currentPage:page,
                    pageSize:pageSize
                }})
            }
        }
        const props = {
            action: '/modules/manage/fileUpload/imgSave.htm',
            listType: 'picture',
            fileList,
            className: 'upload-list-inline',
            name: 'file'
        }
        return (
            <PageHeaderLayout>
                <div>
                    <Button onClick={this.handleCancel} style={{ marginBottom: 10 }}>新增banner</Button>
                    <Table
                        columns={colunms}
                        dataSource={materialmange.banners}
                        pagination = {pagination}
                        bordered
                    />
                    <Modal
                        visible={visible}
                        title={`${action}banner`}
                        maskClosable={false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={540}
                        destroyOnClose = {true}
                    >   
                        <Form>
                            <Row>
                            <Col {...updateLayout.span}><span>图片 : </span> </Col>
                            <Col {...updateLayout.upload}>
                                    <Upload onRemove={this.removeImg} beforeUpload={this.beforeUpload} {...props} onChange={this.uploadChange}>
                                        <Button>上传图片</Button>
                                    </Upload>
                            </Col>
                            </Row>
                            
                            <FormItem
                                label="排序"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('sort', {
                                    rules: [{pattern:/(^[1-9]$)|(^[0-9]{2}$)|(^100$)/g,message: '请输入1-100的数字' }],
                                    initialValue: weight,
                                })(
                                    <Input
                                    onChange={this.verifySort}
                                        style={{ width: 260 }}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="开始时间"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('beginTime', {
                                    //      rules: [{ message: '开始时间' }],
                                    initialValue: sTime,
                                })(
                                    <DatePicker
                                        style={{ width: 260 }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={(data)=>this.chooseTime(data,'startTime')}
                                        onOpenChange={this.handleEndOpenChange}
                                        onOk={(date)=>{this.confirmTime(date, 'startTime')}}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="结束时间"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('endTime', {
                                    //       rules: [{ message: '结束时间' }],
                                    initialValue: eTime,
                                })(
                                    <DatePicker
                                        style={{ width: 260 }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={(data)=>this.chooseTime(data,'endTime')}
                                        onOpenChange={this.handleEndOpenChange}
                                        onOk={(date)=>{this.confirmTime(date, 'endTime')}}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="链接地址"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('link', {
                                    rules:[{pattern:/(^http:\/\/)|(^https:\/\/)/g,message:"请输入http://或https://开头的协议名"}],
                                    initialValue: url,
                                })(
                                    <Input
                                        style={{ width: 260 }}
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </PageHeaderLayout>
        )
    }
}


export default MaterialMange