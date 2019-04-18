import React, { PureComponent } from 'react';
import { Button, Select, Input, DatePicker, Radio, Form, Row, Col } from 'antd';
import moment, { isMoment } from 'moment';
import update from 'immutability-helper';
import styles from './index.less';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

export default Form.create()((props) => {
  const { form,handleFormReset, handleSearch, handleExport, offStatus,offlineRepyaType} = props;
  const { getFieldDecorator} = form;
  const layout = {
    labelCol: {
      lg: { span: 8 },
    },
    wrapperCol: {
      lg: { span: 16 },
    },
  };
  const offlineRepyaTypeOptions = offlineRepyaType.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>);
  const offStatusOptions = offStatus.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
  return (
    <Form onSubmit={handleSearch} >
      <Row>
      <Col span={6}>
          <FormItem label="订单号" {...layout}>
            {getFieldDecorator('orderNo',{rules: [{max: 30, message: '输入字符数不得超过30'}]})(
              <Input placeholder="请输入订单号" />
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
            {getFieldDecorator('name', {rules: [{max: 14, message: '输入字符数不得超过14'}]})(
              <Input placeholder="请输入姓名" />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="期数" {...layout}>
            {getFieldDecorator('scheduleNo',)(
              <Input placeholder="请输入第几期" />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
      <Col span={6}>
          <FormItem label="入账类型" {...layout}>
            {getFieldDecorator('type',{initialValue: '全部'})(
              <Select placeholder="请选择" >
                <Option value='全部' key='全部'>全部</Option>
                {offlineRepyaTypeOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="审核状态" {...layout}>
            {getFieldDecorator('status',{initialValue: '全部'})(
              <Select placeholder="请选择" >
                <Option value='全部' key='全部'>全部</Option>
                {offStatusOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={6}>
              <FormItem label="提交审核时间" {...layout}>
                {getFieldDecorator('time',{})(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
      </Row>
          <Row type="flex" justify="end" style={{marginBottom: 10}}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>查询</Button>
            <Button type="primary" htmlType="submit" style={{ marginRight: 10 }} onClick={handleExport}>导出</Button>
            <Button type="primary" onClick={handleFormReset}>重置</Button>
          </Row>
    </Form>
  );
})


