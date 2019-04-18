import React from 'react';
import { Button, Select, Input, DatePicker, Radio, Form, Row, Col, AutoComplete } from 'antd';
import moment from 'moment';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

export default Form.create()((props) => {
  const {form, handleSearch, getProdLineList, handleFormReset, handleExport,loanEnum,currentProdList} = props;
  const { getFieldDecorator} = form;
  const layout = {
    labelCol: {
      lg: { span: 8 },
    },
    wrapperCol: {
      lg: { span: 16 },
    },
  };
  const prodListOptions = currentProdList.map(item=><Option  value={item.prodLineName} key={item.id+''}>{`${item.prodLineCode} ${item.prodLineName}`}</Option>);
  const loanEnumOptions = loanEnum.map(item=><Option vlaue={item} key={item}>{item}</Option>);
  return (
    <Form onSubmit={handleSearch} >
      <Row>
        <Col span={6}>
          <FormItem label="产品系列名称" {...layout}>
            {getFieldDecorator('prodLineId', {rules: [{max: 50, message: '输入字符数不得超过50'}]})(
              <AutoComplete
                onChange={getProdLineList}
                optionLabelProp={'value'}
                placeholder="请输入产品系列名称"
              >
                {prodListOptions}
              </AutoComplete>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="手机号" {...layout}>
            {getFieldDecorator('phone', {
              rules: [
                {
                  pattern: /^1[3|4|5|7|8]\d{9}$/,
                  len: 11,
                  message: '请输入有效的手机号'
                }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input placeholder="请输入手机号" maxLength={'11'} />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="姓名" {...layout}>
            {getFieldDecorator('realName', {rules: [{max: 14, message: '输入字符数不得超过14'}]})(
              <Input placeholder="请输入姓名" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="身份证号" {...layout}>
            {getFieldDecorator('idNo', {
              rules: [
                {
                  pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                  max: 18,
                  min: 15,
                  message: '请输入有效的身份证号'
                }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input maxLength={'18'} placeholder="请输入身份证号" />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <FormItem label="订单号" {...layout}>
            {getFieldDecorator('orderNo',{rules: [{max: 30, message: '输入字符数不得超过30'}]})(
              <Input placeholder="请输入订单号" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="放款状态" {...layout}>
            {getFieldDecorator('statusStr',{initialValue:'全部'})(
              <Select placeholder="请选择" >
                <Option value='全部' key='全部'>全部</Option>
                {loanEnumOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={1} />
        <Col span={11}>
            <Col span={9}>
            <FormItem >
              {getFieldDecorator('radio',{initialValue:1})(
                <RadioGroup>
                  <Radio value={1}>下单时间</Radio>
                  <Radio value={2}>放款时间</Radio>
                </RadioGroup>
              )}
            </FormItem>
            </Col>
            <Col span={15}>
              <FormItem {...layout}>
              {getFieldDecorator('time',{initialValue: [moment(),moment()]})(
                  <RangePicker allowClear={false}/>
                )}
              </FormItem>
            </Col>
        </Col>
      </Row>
          <Row type="flex" justify="end" style={{marginBottom: 10}}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>查询</Button>
            <Button type="primary" style={{ marginRight: 10 }} onClick={handleExport}>导出</Button>
            <Button type="primary" onClick={handleFormReset}>重置</Button>
          </Row>
    </Form>
  );
})


