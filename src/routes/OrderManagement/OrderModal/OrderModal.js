import React, { Component } from 'react';
import { Modal, Divider, Input, Button, Form, Select, message} from 'antd';
import styles from './OrderModal.less';
import OrderModalForm from './OrderModalForm';
import {offlineAuditTypeEnum,getRepayPlayByOrderId} from '../../../services/order';

const TextArea = Input.TextArea;
const Option = Select.Option;
const confirm = Modal.confirm;

const ListItem = ({ msg: { data = [], title = '', count = '' } = {}, length }) => {
    return data.length > 0 ? <div className={styles[`modal-${length}`]}>
        <div>{title}</div>
        <Divider className={styles.divider}></Divider>
        {data.map(ele => (
            <div key={ele.label} className={styles.content}>
                <span className={styles['item-label']}>{`${ele.label}：`}</span>
                <span className={styles['item-value']}>{`${ele.value}  元`}</span>
            </div>
        ))}
        <Divider className={styles.divider}></Divider>
        <div className={styles.content}><span >合计：</span><span className={styles.count}>{count}</span><span>&nbsp;&nbsp;元</span></div>
    </div> : null
}

const ReasonItem = Form.create()((props => {
    const { getFieldDecorator } = props.form;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('reason', {
            rules: [{ required: true, whitespace: true, message: '请输入审核拒绝原因' }],
          })(<TextArea maxLength={'200'} placeholder='请输入审核拒绝原因' />)}
        </Form.Item>
      </Form>
    )
}));
export default class OrderModal extends Component {
    state = {
        offlineAuditType: [], // 线下还款方式
        imgUrl: '', // 请求路径
        upload:false, 
    }
    form = null;
    reasonForm = null;
    confirm = null;
    componentDidMount(){
        // 线下还款方式
        offlineAuditTypeEnum().then(res=>{
            const data = res.resultData;
            const offlineAuditType = [];
            Object.keys(data).forEach(item => {
                offlineAuditType.push({ value: data[item], key: item });
            })
            if(res.resultCode === 1000){
                this.setState({offlineAuditType});
            }
        });
    }
    // type 为1需要弹框确认 为2不需要
    onOk = (type) => {
        let that = this;
        const {imgUrl} = this.state;
        this.form.validateFields((err, values) => {
            if(!err){
                console.log(values,'哈哈');
                if(type === 1){
                    confirm({
                        title: '是否确认审核是否通过？',
                        okText: '确认',
                        cancelText: '取消',
                        onOk() {
                            that.props.onOk({imgUrl,...values});
                        }
                    });
                }else if(type ===2){
                    that.props.onOk({imgUrl,...values});
                }
            }
        });
    }
    onRefuse = () => {
        let that = this;
        const node = <ReasonItem ref={ref=>{this.reasonForm = ref}}/>
        this.confirm = confirm({
            title: '是否确认拒绝该申请？',
            content: node,
            okText: '确认',
            cancelText: '取消',
            onOk: (e) => that.onSubmitReason(e),
        });
    }
    onCancel = () => {
        this.form.resetFields();
        this.props.onCancel();
    }
    onSubmitReason = () =>{
        this.reasonForm.validateFields((err, values) =>{
            if(!err){
                this.confirm.destroy();
                this.props.onRefuse(values);
            }
        });
    }
    onClose = () => {
        let that = this;
        confirm({
            title: '是否确认取消本次操作？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.form.resetFields();
                that.props.onCancel();
            }
        });
    }
    // 根据类型动态渲染modal内容
    renderBody = (action, length) => {
        const {amountPayable,amountResult,record,onAmountChange} =this.props;
        let that = this;
        const uploadProps = {
            accept: "image/jpg,image/jpeg,image/png",
            name: 'file',
            action: '/modules/manage/repay/imgUpdate.htm',
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
              if (info.file.status === 'done') {
                if (info.file.response.resultCode === 1000) {
                  message.success(`上传成功`);
                  that.setState({imgUrl:info.file.response.resultData, upload:true});
                } else {
                  message.error(info.file.response.resultData || `上传失败`);
                }
              } else if (info.file.status === 'error') {
                message.error(`上传失败`);
              }
            },
            beforeUpload(file) {
              let reg = new RegExp(/^image\/\jpeg|jpg|png|bmp|gif|pdf$/, 'i');
              if (!reg.test(file.type)) {
                message.error('请选择jpg,jpeg,png,bmp,gif,pdf图片格式');
                return false;
              }
              if (file.size / 1048576 / 4 <= 2) {
                return true;
              } else {
                message.warning('上传文件不能超过500k');
                return false;
              }
            },
            onRemove() {
                that.setState({imgUrl:'',upload:false});
            },
          };
        return <div>
            {action === '手动代扣' ? <div className={styles.title}>
            <span>是否手动代扣</span><span className={styles.count}>{amountPayable.count || ''}</span><span>元</span></div> : null}
            {action === '查看' ? <div className={styles.extra}><div className={styles.extraTitle}><label>审核状态：</label><span>{record.statusStr || ''}</span></div>
            {['初审拒绝','复审拒绝'].includes(record.statusStr) ? <div className={styles.extraTitle}><label>拒绝原因：</label><span>{record.remark || ''}</span></div> : null} </div> : null}
            <div className={styles.modal}>
                <ListItem msg={amountPayable} length={length} />
                {length > 1 ? <div className={styles['modal-middle']} ><Divider className={styles.divider} action="vertical"></Divider></div> : null}
                {length > 1 ? <ListItem msg={amountResult} length={length} /> : null}
            </div>
            <OrderModalForm 
            ref={ref => { this.form = ref }}
            data = {record}
            action={action}
            onAmountChange={onAmountChange}
            count={amountPayable.count || ''} 
            uploadProps={uploadProps}
            disabled={this.state.upload}
            offlineAuditType={this.state.offlineAuditType}/>
        </div>
    }
    // 根据类型动态渲染modal底部
    renderFooter = (action) => {
        let footer = [];
        const btnTexts = ['息费减免', '手动代扣', '线下还款', '取消线下入账'];
        const btnTexts2 = ['审核'];
        const btnTexts3 = ['查看'];
        if (btnTexts2.includes(action)) {
            footer = [
                <div key='footer' className={styles['modal-footer']}>
                    <Button type='primary' onClick={() => this.onOk(1)}>初审通过</Button>
                    <Button type='primary' onClick={() => this.onRefuse()}>初审拒绝</Button>
                    <Button onClick={() => this.onClose()}>取消</Button>
                </div>
            ]
        } else if (btnTexts.includes(action)) {
            footer = [
                <div key='footer' className={styles['modal-footer']}>
                    <Button onClick={() => this.onCancel()}>取消</Button>
                    <Button type='primary' onClick={() => this.onOk(2)}>提交审核</Button>
                </div>
            ]
        } else if (btnTexts3.includes(action)) {
            footer = [
                <div key='footer' className={styles['modal-footer']}>
                    <Button onClick={() => this.onCancel()}>关闭</Button>
                </div>
            ]
        } else {
            footer = null;
        }
        return footer;
    } 
    render() {
        const { action, visible } = this.props;
        const btnTexts = ['息费减免', '手动代扣'];
        const btnTexts2 = ['线下还款', '审核', '查看'];
        let length = null;
        if (btnTexts.includes(action)) {
            length = 1;
        } else if (btnTexts2.includes(action)) {
            length = 2;
        }
        const title = action === '审核' ? '线下收款初审': action === '查看' ? '线下收款查询' : action;
        return (
            <Modal
                destroyOnClose
                afterClose={()=>{this.setState({upload:false,imgUrl:''})}}
                title={title}
                visible={visible}
                width={length > 1 ? 725 : 425}
                onCancel={this.props.onCancel}
                footer={this.renderFooter(action)}
            >
                {this.renderBody(action, length)}
            </Modal>
        )
    }
}
