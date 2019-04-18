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
            console.log(fieldsValue);
            var formdata = {
                ...fieldsValue,
                dateStr:fieldsValue.dateStr.format('YYYYMMDD').toString()
            };
            setParams(formdata,1);
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
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
                    <Col md={10} sm={24}>
                        <FormItem label="输入查询命令"  {...formItemLayout} style={{ width: '100%' }}>
                            {getFieldDecorator('searchCmd',{
                                rules: [{
                                    required: false,
                                    message: '输入查询命令',
                                }],
                                validateTrigger:'onBlur'
                            })(
                                <Input placeholder="请输入查询命令" style={{ width: '100%' }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={5} sm={24}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                        <Button  onClick={this.onCancel}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const SerachFormComponent = Form.create()(SerachForm);
export default SerachFormComponent
