/**
 * Created by Administrator on 2018/1/11 0011.
 */
/**
 * Created by Administrator on 2018/1/11 0011.
 */
import React, { PureComponent } from 'react'
import {Row, Col, Form, Input, DatePicker, Button} from 'antd';
const FormItem = Form.Item;

class SerachForm extends PureComponent {

    onCancel = ()=>{
        const { form } = this.props;
        form.resetFields();
    }

    onSubmit=(e)=>{
        e.preventDefault();
        const { setParams, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            var formdata = {
                ...fieldsValue,
                dateStr:fieldsValue.dateStr.format('YYYYMMDD').toString()
            };
           setParams(formdata,2);
        });
    }

    render(){
        const { getFieldDecorator } =this.props.form;
        const formItemLayout = {
            labelCol: { span: 9},
            wrapperCol: { span: 15 },
        };
        return (
            <Form onSubmit={this.onSubmit} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={7} sm={24}>
                        <FormItem label="输入查询日期"   {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('dateStr',{
                                rules: [{
                                    required: true,
                                    message: '输入查询日期',
                                }],
                            })(
                                <DatePicker  format="YYYY-MM-DD" style={{ width: '100%' }}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                        <FormItem label="resultCode"  {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('resultCode')(
                                <Input placeholder="请输入resultCode" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                        <FormItem label="serviceCode"  {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('serviceCode')(
                                <Input placeholder="请输入serviceCode" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:'20px'}}>
                    <Col md={7} sm={24}>
                        <FormItem label="phone"  {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('phone')(
                                <Input placeholder="请输入phone" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={7} sm={24}>
                        <FormItem label="userId"  {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('userId')(
                                <Input placeholder="请输入userId" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={5} sm={24} offset={1}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                        <Button  onClick={this.onCancel}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
        }
}
const TabsearchForm = Form.create()(SerachForm);
export default TabsearchForm
