import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;
@Form.create()
export default class addProductSeries extends PureComponent {
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
    return (
      <div>
        <h3>新增产品系列</h3>
        <Form layout="inline">
          <Row>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品系列代码' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('data', {})(<Input className={styles.noselect}
                                                      disabled={this.props.type === '修改'}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品系列名称' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('sex', {})(<Input className={styles.noselect}
                                                     disabled={this.props.type === '修改'}/>)}
              </FormItem>
            </Col>

          </Row>
          <Row style={{ marginTop: 20 }}>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品类型'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('marryState', {})(<Input className={styles.noselect}
                                                            disabled={this.props.type === '修改'}/>)}
              </FormItem>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end' }}
                 className={styles.formitem2} xs={{ span: 8, offset: 1 }}
                 lg={{ span: 8, offset: 1 }}>
              <FormItem style={{ width: 200, marginRight: 0 }} label='期限类型' {...formItemLayout}
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
                  <Input style={{ width: 120 }} className={styles.noselect}
                         disabled={this.props.type === '修改'}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='还款方式'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('education', {})(<Select disabled={this.props.type === '修改'}
                                                            placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='计息方式' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('occupation', {})(<Select disabled={this.props.type === '修改'}
                                                             placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
              </FormItem>
            </Col>


          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小授信金额（≥）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('bankName', {})(<Input disabled={this.props.type === '修改'}
                                                          className={styles.noselect}/>)}
              </FormItem><span>元</span>
            </Col>
            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大授信金额（≤）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('bankCardNo', {})(<Input disabled={this.props.type === '修改'}
                                                            className={styles.noselect}/>)}
              </FormItem><span>元</span>
            </Col>

          </Row>

          <Row style={{ marginTop: 20 }}>

            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小贷款金额（≥）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('ip', {})(<Input disabled={this.props.type === '修改'}
                                                    className={styles.noselect}/>)}
              </FormItem><span>元</span>
            </Col>

            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大贷款金额（≤）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('gpsLocation', {})(<Input disabled={this.props.type === '修改'}
                                                             className={styles.noselect}/>)}
              </FormItem><span>元</span>
            </Col>

          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='授信类型'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('aidName', {})(<Select disabled={this.props.type === '修改'}
                                                          placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='营销类型' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('aidLink', {})(
                  <Select disabled={this.props.type === '修改'} placeholder="请选择" allowClear={true}>
                    <Option value={'全部1'}>全部</Option>
                    <Option value={'1'}>分期</Option>
                    <Option value={'2'}>全款</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 6, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='犹豫期天数' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('otherName', {})(<Input disabled={this.props.type === '修改'}
                                                           className={styles.noselect}/>)}
              </FormItem><span>天</span>
            </Col>
            <Col style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                 xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='免息天数' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('otherLink', {})(<Input disabled={this.props.type === '修改'}
                                                           className={styles.noselect}/>)}
              </FormItem><span>天</span>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='是否进行人工信审' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('idSt1ate', {})(
                  <Select disabled={this.props.type === '修改'} placeholder="请选择" allowClear={true}>
                    <Option value={'1'}>是</Option>
                    <Option value={'2'}>否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='生效日期' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('idState', {})(<Input disabled={this.props.type === '修改'}
                                                         className={styles.noselect}/>)}
              </FormItem>
            </Col>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='失效日期' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('phoneState', {})(<Input className={styles.noselect}/>)}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">备注</Divider>
          <Row style={{ marginTop: 20 }}>
            <Col style={{ marginLeft: 0 }} xs={{ span: 24, offset: 1 }}
                 lg={{ span: 24, offset: 1 }}>
              <FormItem {...formItemLayout}
                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                        className={styles.formitem}>
                {getFieldDecorator('remarks', {})(<TextArea placeholder={'添加更多备注信息'}
                                                            disabled={this.props.type === '修改'}
                                                            rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <Button onClick={() => this.showReset()} style={{ marginLeft: '500px' }}>重置</Button>
          <Button onClick={() => this.showSubmit()} style={{ marginLeft: '20px' }}
                  type="primary">提交</Button>
        </div>
      </div>
    );
  }
}
