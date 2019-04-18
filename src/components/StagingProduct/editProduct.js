import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Alert,
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

const FormItem = Form.Item;
const confirm = Modal.confirm
const { TextArea } = Input;
const { Option } = Select;
const { Meta } = Card;
@Form.create()
export default class addProduct extends PureComponent {

  //提交按钮
  showSubmit = () => {
    let me = this
    confirm({
      centered: true,
      content: '信息填写无误，确认编辑产品？',
      onOk() {
        message.success('操作成功')
      },
      onCancel() {
        message.success('已取消')
      },
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
      <div>
        <h3>编辑产品</h3>
      <Form layout="inline">

        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品代码' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('data', {})(<Input className={styles.noselect} />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品名称' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('sex', {})(<Input className={styles.noselect} />)}
            </FormItem>
          </Col>

        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='生效日期' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('idState', {})(<Input className={styles.noselect}
                                                       />)}
            </FormItem>
          </Col>

          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='失效日期' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('phoneState', {})(<Input className={styles.noselect}
                                                          />)}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>

          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}
               xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem style={{ width: 200 }} label='产品系列'  {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('marryState', {})(
                <Select style={{ width: 120 }} disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>)}
            </FormItem>
            <FormItem style={{ width: 120, marginRight: 0 }} {...formItemLayout}
                      className={styles.formitem}>
              {getFieldDecorator('marryState', {})(
                <Select style={{ width: 120 }} disabled={this.props.type === '修改'}
                        placeholder="请选择" allowClear={true}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='贷款期数' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('idAddr', {})(<Input className={styles.noselect}
                                                      />)}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='年费率'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('education', {})(<Input className={styles.noselect}
                                                         />)}
            </FormItem>%
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='年IRR' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('occupation', {})(<Input className={styles.noselect}
                                                          />)}
            </FormItem>%
          </Col>


        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='日费率'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('education', {})(<Input className={styles.noselect}
                                                         />)}
            </FormItem>%
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='年利率' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('occupation', {})(<Input className={styles.noselect}
                                                          />)}
            </FormItem>%
          </Col>


        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最小授信金额（≥）' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('bankName', {})(<Input className={styles.noselect}
                                                        />)}
            </FormItem>元
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最大授信金额（≤）' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('bankCardNo', {})(<Input className={styles.noselect}
                                                          />)}
            </FormItem>元
          </Col>

        </Row>

        <Row style={{ marginTop: 20 }}>

          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最小贷款金额（≥）' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('ip', {})(<Input className={styles.noselect} />)}
            </FormItem>元
          </Col>

          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='最大贷款金额（≤）' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('gpsLocation', {})(<Input className={styles.noselect}
                                                           />)}
            </FormItem>元
          </Col>

        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }} xs={{ span: 8, offset: 1 }}
               lg={{ span: 8, offset: 1 }}>
            <FormItem label='逾期宽限天数'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('aidNam', {})(<Input className={styles.noselect}
                                                       />)}
            </FormItem>天
          </Col>
        </Row>
        <div style={{ marginTop: 20 , marginLeft: 65}}>
            <FormItem    label='本金还款设定'  >
              {getFieldDecorator('aidName', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>前</span><Input style={{width: 80, margin: '0px 5px'}}
                        /><span>期,</span>
              </div>)}
            </FormItem>
            <FormItem   >
              {getFieldDecorator('aidName1', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>还款</span><Input style={{width: 80, margin: '0px 5px'}}
                       /><span>%</span>
              </div>)}
            </FormItem>

            <FormItem  >
              {getFieldDecorator('aidLink', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>后</span><Input style={{width: 80, margin: '0px 5px'}}
                        /><span>期,</span>
              </div>)}
            </FormItem>
            <FormItem  >
              {getFieldDecorator('aidLink1', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>还款</span><Input style={{width: 80, margin: '0px 5px'}}
                       /><span>%</span>
              </div>)}
            </FormItem>
        </div>
        <Divider orientation={'left'}>备注</Divider>
        <Row style={{ marginTop: 20 }}>
          <Col style={{ marginLeft: 0 }} xs={{ span: 24, offset: 1 }} lg={{ span: 24, offset: 1 }}>
            <FormItem  {...formItemLayout}
                       style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {getFieldDecorator('remarks', {})(<TextArea style={{ width: '100%' }}
                                                          placeholder={'添加更多备注信息'}
                                                          disabled={this.props.type === '修改'}
                                                          rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Divider orientation={'left'}>费用设置</Divider>
        <Icon type="exclamation-circle"/>本金配账优先级为15，利息配账优先级为10。
        <Table
          marginTop={20}
          bordered
          columns={columns}
          dataSource={
            [
              {
                id: 21,
                name: '测试四位小数..',
                amount: '1000',
                creditGrade: 200,
                dayRate: '0.1499',
                penaltyRate: '0.0097'
              }
              , {
              id: 20,
              name: '信小贝',
              amount: '5000',
              creditGrade: 300,
              dayRate: '0.0098',
              penaltyRate: '0.15'
            }
              , {
              id: 19,
              name: '测试偶数个产品时APP的默认展示',
              amount: '1000',
              creditGrade: 300,
              dayRate: '0.0201'
            }
              , {
              id: 18,
              name: '测试修改期限问题',
              amount: '3000',
              creditGrade: 400,
              dayRate: '0.02',
              penaltyRate: '2'
            }
              , {
              id: 17,
              name: 'kuka',
              amount: '2000',
              creditGrade: 400,
              dayRate: '0.01',
              penaltyRate: '1'
            }
              , {
              id: 16,
              name: '多米白卡',
              amount: '1000',
              creditGrade: 300,
              dayRate: '0.0099',
              penaltyRate: '1'
            }]
          }
          pagination={false}
          // onChange={() => {}}
        />
      </Form>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <Button onClick={() => this.showReset()} style={{ marginLeft: '500px' }}>重置</Button>
          <Button onClick={() => this.showSubmit()} style={{ marginLeft: '20px' }}
                  type="primary">提交</Button>
        </div>
      </div>);
  }
}
