import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Alert,
  Row,
  Col,
  Card,
  Form,
  Radio,
  Input,
  Table,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Spin
} from 'antd';

import styles from '../../routes/UserManage/UserInfoList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;
@Form.create()
export default class addOrEditProduct extends PureComponent {
  onChange = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const values = {
        ...fieldsValue
      };
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns = [
      {
        title: '费用代码',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <a onClick={() => {
              console.log(this.props);
            }}>
              {text}
            </a>
          );
        }
      }, {
        title: '费用名称',
        dataIndex: 'name',
        width: '8%'
      }, {
        title: '费用类型',
        dataIndex: 'amount'
      },
      {
        title: '收取类型',
        dataIndex: 'amount1'
      }, {
        title: '计算类型',
        dataIndex: 'peroidValue',
      },
      {
        title: '固定金额',
        dataIndex: 'peroidUnit',

      },
      {
        title: '计算基础',
        dataIndex: 'goodsFee'
      }, {
        title: '计算比例',
        dataIndex: 'creditGrade'
      },
      {
        title: '适用功能',
        dataIndex: 'dayRate',

      },
      {
        title: '配帐优先级',
        dataIndex: 'dailyRentDi',
        render: (text, record) => {
          return (
            <Input/>
          );
        }
      }
    ];
    return (
      <Form layout="inline">
        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='费用代码' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('data', {})(<Input className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='费用类型' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('sex', {})(
                <Select disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
          </Col>

        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='费用名称' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('phoneState', {})(<Input placeholder="请输入" className={styles.noselect}
              />)}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>

          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品系列' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('phoneState', {})(<Input placeholder="请输入" className={styles.noselect}
              />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品名称' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('phoneState', {})(
                <Select disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>

          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}
               xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem style={{ width: 200, marginRight: 0 }} label='收取类型'  {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('marryState', {})(
                <Select style={{ width: 120 }} disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
            </FormItem>
            <FormItem style={{ width: 120, marginRight: 0 }}  {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('marryState', {})(
                <Select style={{ width: 120 }} disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
            </FormItem>

          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='收取时间'  {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('marryState', {})(<div
                  style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                  <span>第</span>
                  <Select style={{ margin: '0 5px' }} disabled={this.props.type === '修改'}
                          placeholder="请选择" allowClear={true}>
                    <Option value={'全部1'}>全部</Option>
                    <Option value={'1'}>分期</Option>
                    <Option value={'2'}>全款</Option>
                  </Select>
                  <span>期</span>
                </div>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='计算类型'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('education', {})(
                <RadioGroup onChange={this.onChange()}>
                  <Radio value={1}>按比例</Radio>
                  <Radio value={2}>按固定金额</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
               className={styles.formitem2} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem style={{ width: 200, marginRight: 0 }} label='比例' {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('idAddr', {})(
                <Select placeholder="请选择" style={{ width: 120 }} allowClear={true}
                        disabled={this.props.type === '修改'}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} style={{ width: 120, marginRight: 0 }}
                      className={styles.formitem1}>
              {getFieldDecorator('type1', {})(
                <Input placeholder="请输入" style={{ width: 120 }} className={styles.noselect}/>
              )}
            </FormItem><span>%</span>
          </Col>


        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='固定金额'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('educa3tion', {})(<Input placeholder="请输入" className={styles.noselect}
              />)}
            </FormItem>元
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最高收取金额'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('educ1ation', {})(<Input placeholder="请输入" className={styles.noselect}
              />)}
            </FormItem>元
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最低收取金额'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('educa3ti3on', {})(<Input placeholder="请输入"
                                                           className={styles.noselect}
              />)}
            </FormItem>元
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='适用功能'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('educ1at1ion', {})(
                <Select placeholder="请选择" allowClear={true} disabled={this.props.type === '修改'}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
