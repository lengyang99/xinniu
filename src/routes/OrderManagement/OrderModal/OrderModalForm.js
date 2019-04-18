import { Input, Row, Col, Select, Form, Upload, Button, InputNumber} from "antd";
import styles from './OrderModal.less';
import ReactDOM from 'react-dom';
const Option = Select.Option;
const FormItem = Form.Item;

const OrderModalForm = Form.create()((props => {
    const { action, form, offlineAuditType,uploadProps,data = {}, count ='',onAmountChange,disabled} = props;
    const {typeStr,scheduleNoStr,amount,offlinerRepayTypeStr,paymentFlow,type,imgUrl = ''} = data || {};
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: {
            xs: { span: 12 },
            sm: { span: 10 },
        },
        wrapperCol: {
            xs: { span: 28 },
            sm: { span: 12 },
            md: { span: 6 },
        },
    };
    let component = null
    let modal = null;
    const offlineAuditTypeOptions = offlineAuditType.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>);

    const bigImg = (url) => {
        modal = document.createElement('div')
        document.body.append(modal)
        let Dom = (
            <div onClick={delBigImg} className={styles.b_wrap}>
                <img className={styles.b_img} src={url} alt="" />
            </div>
        )
        ReactDOM.render(Dom, modal);
    } 
    //删除BigImg
    const delBigImg = () => {
        modal && modal.parentNode.removeChild(modal);
    }
    //校验金额
    const validatorAmount = (_, value, callback,text) => {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
        if(!value || value === ''){
            callback(text)
        }else if(isNaN(value)){
            callback('请填写数字');
        }else if(!reg.test(value)){
            callback('请保留小数点后两位小数');
        }
        callback();
    }  
    if (action === '线下还款') {
        component = <Form>
            <FormItem {...formItemLayout} label={'线下还款金额'}>
                {getFieldDecorator('amount', 
                { initialValue: count,rules:[{required:true,validator: (_,value,callback)=>{validatorAmount(_,value,callback,'请输入线下还款金额')}}] })(
                    <InputNumber style={{ width: 169 }} onChange={onAmountChange} placeholder='请输入线下还款金额' suffix='元'/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={'线下还款方式'}>
                {getFieldDecorator('type', { initialValue: '',rules:[{required:true,message:'请选择线下还款方式'}] })(
                    <Select placeholder='请选择线下还款方式'>{offlineAuditTypeOptions}</Select>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={'流水号'}>
                {getFieldDecorator('subjoin', { initialValue: '',rules:[{required:true,message:'请填写流水号'}] })(
                    <Input placeholder='请输入线下还款流水号'/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={'转账图片'}>
                <Upload {...uploadProps}><Button disabled={disabled}>上传</Button></Upload>
            </FormItem>
        </Form>
    } else if (action === '息费减免') {
        component = <Form>
            <FormItem {...formItemLayout} label={'息费减免'}>
                {getFieldDecorator('amount', 
                { initialValue: '',rules:[{required:true,validator: (_,value,callback)=>{validatorAmount(_,value,callback,'请输入减免的息费')}}] })(
                    <InputNumber   style={{ width: 169 }} placeholder='请输入减免的息费' style={{ width: 160 }} suffix='元'/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={'流水号'}>
                {getFieldDecorator('subjoin', { initialValue: '' ,rules:[{required:true,message:'请填写流水号'}]})(
                    <Input placeholder='请输入息费减免流水号' style={{ width: 160 }} />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label={'转账图片'}>
                <Upload {...uploadProps}><Button disabled={disabled}>上传</Button></Upload>
            </FormItem>
        </Form>
    } else if (action === '审核' || action === '查看') {
        component = <Form>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'线下还款类型'}>
                        {getFieldDecorator('typeStr', { initialValue: typeStr})(
                            <Input style={{ width: 160 }} disabled/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'线下还款期数'}>
                        {getFieldDecorator('scheduleNo', { initialValue: scheduleNoStr })(
                            <Input style={{ width: 160 }} disabled />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'线下还款金额'}>
                        {getFieldDecorator('amount', { initialValue: type ===22 ? amount: 0 })(
                            <Input  style={{ width: 169 }} style={{ width: 160 }} disabled suffix='元'/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'息费减免'}>
                        {getFieldDecorator('amount2', { initialValue: type ===31 ? amount: 0 })(
                            <Input style={{ width: 169 }} style={{ width: 160 }} disabled suffix='元'/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'线下还款方式'}>
                        {getFieldDecorator('offlinerRepayTypeStr', { initialValue: offlinerRepayTypeStr})(
                            <Input style={{ width: 160 }} disabled></Input>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'流水号'} >
                        {getFieldDecorator('paymentFlow', { initialValue: paymentFlow})(
                            <Input style={{ width: 500 }} disabled />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem {...formItemLayout} label={'转账图片'}>
                    {imgUrl && imgUrl !=='' ? <div onClick={() => bigImg(imgUrl)} className={styles.imgWrap}>
                            <img src={imgUrl} alt="" />
                        </div> : null }
                    </FormItem>
                </Col>
                <Col span={12}>
                </Col>
            </Row>
        </Form>
    }
    return component;
}));

export default OrderModalForm;