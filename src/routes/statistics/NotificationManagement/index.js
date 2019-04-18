import React, { Component } from 'react'
import { Table, Modal, Button, Form, Input, DatePicker, Checkbox, message } from 'antd';
import styles from './index.less';
import {range} from 'lodash';
import moment, { isMoment } from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { queryNotificationList, editNotification, addNotification, upDataNotificationStatus } from '../../../services/NotificationManagement'

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const defaultPage = {
    currentPage:1,
    pageSize:10,
}
@Form.create()
export default class NotificationManagement extends Component {
    state = {
        data:[],
        visible: false,
        action: '新增',
        record: {},
        loading:false,
        pagination:{},
    }
    componentDidMount() {
        this.queryNotificationList(defaultPage);
    }
    // 查询通知列表
    queryNotificationList = (params)=>{
        this.setState({loading:true});
        queryNotificationList(params).then(res => {
            this.setState({loading:false});
            if(res.resultCode === 1000){
                this.setState({data:res.resultData,pagination:res.page});
            }else {
                message.warn(res.resultMessage);
            }
        })
    }
    // 编辑 删除 开启/关闭通知
    handleNotification = (action,record) => {
        if(action ==='编辑'){
            this.setState({action,visible:true,record});
        }else{
            upDataNotificationStatus({status:action,id:record.id}).then(res=>{
                if(res.resultCode === 1000){
                    this.queryNotificationList(defaultPage);
                }else {
                    message.warn(res.resultMessage);
                }
            })
        }
    }
    //分页查询列表
    onTableChange = (pagination) => {
        const {current,pageSize} = pagination;
        this.queryNotificationList({currentPage:current,pageSize});
    }
    // 弹框确认
    handleOk = () => {
        this.subFormData();
    }
    // 弹框取消
    handleCancel = () => {
        this.setState({ visible: !this.state.visible });
    }
    // 禁止的开始时间选择 防止大于结束时间 或小于当天时间
    disableBeginTime = (startValue) => {
        const {getFieldValue} = this.props.form;
        const endValue = getFieldValue('endTime');
        if (!startValue) {
          return false;
        }
        if (!endValue) {
          return startValue.valueOf() <= moment().add(-1, 'days').valueOf();
        }
        return endValue.valueOf() < startValue.valueOf() || startValue.valueOf() <= moment().add(-1, 'days').valueOf();
    }
    // 禁止的结束时间选择 防止小于开始时间 或小于当天时间
    disableEndTime = (endValue) => {
        const {getFieldValue} = this.props.form;
        const startValue = getFieldValue('beginTime');
        if (!endValue) {
          return false;
        }
        if (!startValue) {
            return endValue.valueOf() <= moment().add(-1, 'days').valueOf();
          }
         return endValue.valueOf() < startValue.valueOf() || endValue.valueOf() <= moment().add(-1, 'days').valueOf();
    }
    // 显示弹框
    showModal = () => {
        this.setState({action:'新增',visible:true});
    }
    //校验开始时间
    validatorBeginTime = (rule, value, callback) => {
        const endValue = this.props.form.getFieldValue('endTime');
        if(!value || value === ''){
            callback('请选择一个时间')
        }else if(endValue && endValue.valueOf() <= value.valueOf()){
            callback('开始时间不得大于或等于结束时间');
        }
        callback();
    }    
    //校验结束时间
    validatorEndTime = (rule, value, callback) => {
        const startValue = this.props.form.getFieldValue('beginTime');
        if(!value || value === ''){
            callback('请选择一个时间')
        }else if(startValue && value.valueOf() <= startValue.valueOf()){
            callback('开始时间不得大于或等于结束时间');
        }
        callback();
    } 
    disableTime = (timeType,disableType,hour,minute) => {
        //以下是对时分秒的禁用判断，待优化
        const begin = this.props.form.getFieldValue('beginTime');
        const end = this.props.form.getFieldValue('endTime');
        let rangeSt = 0 ;
        let rangeEd = 0;
        if(isMoment(begin) && isMoment(end)){
            const oneDay = begin.valueOf() < end.valueOf() - 24*60*60*1000;
            const oneHour = begin.valueOf() < end.valueOf() - 60*60*1000;
            const oneMinute = begin.valueOf() < end.valueOf() - 60*1000;
            if(disableType === 'begin'){
                if(timeType === 'hour'){
                    rangeSt = oneDay ? 24 : oneHour ? end.hour() + 1 : end.hour();
                    rangeEd = 24;
                }else if(timeType === 'minute' && hour && hour >= begin.hour()){
                    rangeSt = (oneDay || oneHour) ? 60 : oneMinute ? end.minute() + 1 : end.minute();
                    rangeEd = 60;
                }else if(timeType === 'second' && hour >= begin.hour() && minute >= begin.minute()){
                    rangeSt = (oneDay || oneHour || oneMinute) ? 60 : begin.second() + 1;
                    rangeEd = 60;
                }
            }else if(disableType ==='end'){
                    rangeSt = 0;
                if(timeType === 'hour'){
                    rangeEd = oneDay ? 0 : oneHour ? begin.hour() + 1 : begin.hour();
                }else if(timeType === 'minute' && hour && hour <= begin.hour()){
                    rangeEd = (oneDay || oneHour) ? 0 : oneMinute ? begin.minute() + 1 : begin.minute();
                }else if(timeType === 'second' && hour <= begin.hour() && minute <= begin.minute()){
                    rangeEd = (oneDay || oneHour || oneMinute) ? 0 : begin.second() + 1;
                }
            }
        }
        return range(rangeSt,rangeEd)
    } 
    // 提交添加/编辑的表单数据
    subFormData = () => {
        const {action,record} =this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { messageContent, beginTime, endTime, showPage } = values;
                const params = {
                    messageContent,
                    beginTime: isMoment(beginTime) ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    endTime: isMoment(endTime) ? endTime.format('YYYY-MM-DD HH:mm:ss') : '',
                    isHomeShow: showPage.includes('isHomeShow'),
                    isRollShow: showPage.includes('isRollShow'),
                    isStoreShow: showPage.includes('isStoreShow'),
                    isBindcardShow: showPage.includes('isBindcardShow'),
                };
                if (action === '新增') {
                    const formData =JSON.stringify(params);
                    addNotification({messageInfo:formData}).then(res => {
                        if (res.resultCode === 1000) {
                            this.queryNotificationList(defaultPage);
                        }
                    })
                } else if (action === '编辑') {
                    Object.assign(params,{id:record.id});
                    const formData =JSON.stringify(params);
                    editNotification({messageInfo:formData}).then(res => {
                        if (res.resultCode === 1000) {
                            this.queryNotificationList(defaultPage);
                        }
                    })
                }
                this.setState({ visible: !this.state.visible });
            }
        });
    }
    render() {
        const { visible, action,data,record,loading, pagination} = this.state;
        const showPage = [];
        if(record.isHomeShow){
            showPage.push('isHomeShow');
        }
        if(record.isRollShow){
            showPage.push('isRollShow');
        }
        if(record.isStoreShow){
            showPage.push('isStoreShow');
        }
        if(record.isBindcardShow){
            showPage.push('isBindcardShow');
        }
        const showBeginTime = {
            hideDisabledOptions: true,
            disabledHours: () => this.disableTime('hour','begin'),
            disabledMinutes :(hour) => this.disableTime('minute','begin',hour),
            disabledSeconds:(hour, minute) => this.disableTime('second','begin',hour,minute),
        };
        const showEndTime = {
            hideDisabledOptions: true,
            disabledHours: () => this.disableTime('hour','end'),
            disabledMinutes :(hour) => this.disableTime('minute','end',hour),
            disabledSeconds:(hour, minute) => this.disableTime('second','end',hour,minute),
        };
        const { getFieldDecorator } = this.props.form;
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
        const options = [
            { label: '首页弹框', value: 'isHomeShow' },
            { label: '首页滚动', value: 'isRollShow' },
            { label: '商城弹框', value: 'isStoreShow' },
            { label: '绑卡页', value: 'isBindcardShow' },
        ]
        const colunms = [
            {
                title: '通知内容',
                dataIndex: 'messageContent'
            },
            {
                title: '开始时间',
                dataIndex: 'beginTime'
            },
            {
                title: '结束时间',
                dataIndex: 'endTime'
            },
            {
                title: '首页展示',
                dataIndex: 'isHomeShow',
                render:(text)=><span>{text? '是' : '否'}</span>
            },
            {
                title: '滚动展示',
                dataIndex: 'isRollShow',
                render:(text)=><span>{text? '是' : '否'}</span>
            },
            {
                title: '商城展示',
                dataIndex: 'isStoreShow',
                render:(text)=><span>{text? '是' : '否'}</span>
            },
            {
                title: '绑卡页展示',
                dataIndex: 'isBindcardShow',
                render:(text)=><span>{text? '是' : '否'}</span>
            },
            {
                title: '状态',
                dataIndex: 'status',
                render:(text)=><span>{text ===0 ? '已开启' : text === 1 ? '已关闭' : ''}</span>
            },
            {
                title: '操作',
                dataIndex: 'actions',
                render: (text,record) => {
                    const status = record.status;
                    const nextStatus = status === 1 ? 0 : status === 0 ? 1 : status;
                    return (
                        <div>
                            <a onClick={()=>this.handleNotification('编辑',record)}>编辑      </a>
                            <a onClick={()=>this.handleNotification(2,record)}>删除           </a>
                            <a className={status===1 ? styles['action-start'] : styles['action-close']} onClick={()=>this.handleNotification(nextStatus,record)}>{status ===1 ? '开启' : status === 0 ? '关闭' : ''}</a>
                        </div>
                    )
                }
            },
        ]
        return (
            <PageHeaderLayout>
                <div>
                    <Button onClick={this.showModal} style={{ marginBottom: 10 }}>新增通知</Button>
                    <Table
                        columns={colunms}
                        dataSource={data}
                        loading={loading}
                        bordered
                        rowKey='id'
                        pagination={pagination}
                        onChange={this.onTableChange}
                    />
                    <Modal
                        visible={visible}
                        destroyOnClose
                        title={`${action}通知`}
                        maskClosable={false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={540}
                    >
                        <Form>
                            <FormItem
                                label="通知内容"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('messageContent', {
                                    rules: [{required:true, message: '请填写通知内容',whitespace: true},{max:200, message:'字符不能超过200'},],
                                    initialValue: action ==='编辑' ? record.messageContent : '',
                                })(
                                    <TextArea
                                        style={{ width: 260 }}
                                        autosize
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="开始时间"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('beginTime', {
                                    rules: [{required:true,validator: this.validatorBeginTime}],
                                    initialValue: action ==='编辑' && record.beginTime ? moment(record.beginTime) : null,
                                })(
                                    <DatePicker
                                        style={{ width: 260 }}
                                        showTime={showBeginTime}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={this.disableBeginTime}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="结束时间"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('endTime', {
                                    rules: [{required:true,validator: this.validatorEndTime}],
                                    initialValue: action ==='编辑' && record.endTime ? moment(record.endTime) : null,
                                })(
                                    <DatePicker
                                        style={{ width: 260 }}
                                        showTime={showEndTime}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabledDate={this.disableEndTime}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                label="展示页面"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('showPage', {
                                    rules: [{required:true, message: '请至少勾选一个需要展示页面的位置' }],
                                    initialValue: action ==='编辑' ? showPage : [],
                                })(
                                    <CheckboxGroup options={options} onChange={this.onOptionChange} />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </PageHeaderLayout>
        )
    }
}
