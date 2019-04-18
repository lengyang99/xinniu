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
import {getQueryString} from  '../../utils/utils'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Meta } = Card;
@Form.create()
export default class ProductSeriesDetails extends PureComponent {
  componentDidMount() {
    console.log(getQueryString(this.props.history.location.search));
  }

  /**去编辑系列页面**/
  toEditSeries(code) {
    console.log(this.props.history.location.search);
    this.props.history.push('/staging/product-series/edit?code='+code);
  }

  //确认发布
  success() {
    Modal.success({
      centered: true,
      title: '',
      content: '发布成功，产品将在到达设置的生效日期时生效',
      okText: '关闭'
    });
  }

  //
  info() {

    Modal.info({
      centered: true,
      title: '',
      content: '操作已取消',
      okText: '关闭'
    });
  }


  //发布按钮
  showConfirm = () => {
    let me = this
    confirm({
      centered: true,
      content: '发布后，该产品系列将对外使用，确认发布？',
      onOk() {
        me.success()
      },
      onCancel() {
        me.info()
      },
    });
  };

  //去产品详情页
  productDetails = (id) => {
    this.props.history.push('/staging/product-set/details?code=' + id);
  }

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
        title: '产品代码',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <a onClick={() => {
              this.productDetails('222');
            }}>
              {text}
            </a>
          );
        }
      }, {
        title: '产品名称',
        dataIndex: 'name',
        width: '8%'
      }, {
        title: '贷款期数',
        dataIndex: 'amount'
      }, {
        title: 'IRR',
        dataIndex: 'peroidValue',
      },
      {
        title: '最小授信金额',
        dataIndex: 'peroidUnit',

      },
      {
        title: '最大授信金额',
        dataIndex: 'goodsFee'
      }, {
        title: '最小贷款金额',
        dataIndex: 'creditGrade'
      },
      {
        title: '最大贷款金额',
        dataIndex: 'dayRate',

      },
      {
        title: '生效日期',
        dataIndex: 'penaltyRate',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          );
        }
      },
      {
        title: '失效日期',
        dataIndex: 'penaltyRat',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          );
        }
      },

      {
        title: '状态',
        dataIndex: 'dailyRentDi'
      }
    ];
    return (
      <div>
        <h3>产品系列详情</h3>
        <div>
          <span>未发布</span>
          <Button style={{ float: 'right' }} onClick={() => this.showConfirm()}>发布</Button>
          <Button style={{ float: 'right' }} onClick={() => this.toEditSeries('修改')}>修改</Button>
        </div>
        <Form layout="inline">
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品系列代码' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('data', {})(<Input className={styles.noselect}
                                                      disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品系列名称' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('sex', {})(<Input className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>

          </Row>
          <Row style={{ marginTop: 20 }}>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品类型'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('marryState', {})(<Input className={styles.noselect}
                                                            disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='期限类型' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('idAddr', {})(<Input className={styles.noselect}
                                                        disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='还款方式'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('education', {})(<Input className={styles.noselect}
                                                           disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='计息方式' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('occupation', {})(<Input className={styles.noselect}
                                                            disabled={true}/>)}
              </FormItem>
            </Col>


          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小授信金额（≥）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('bankName', {})(<Input className={styles.noselect}
                                                          disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大授信金额（≤）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('bankCardNo', {})(<Input className={styles.noselect}
                                                            disabled={true}/>)}
              </FormItem>
            </Col>

          </Row>

          <Row style={{ marginTop: 20 }}>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小贷款金额（≥）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('ip', {})(<Input className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大贷款金额（≤）' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('gpsLocation', {})(<Input className={styles.noselect}
                                                             disabled={true}/>)}
              </FormItem>
            </Col>

          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='授信类型'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('aidName', {})(<Input className={styles.noselect}
                                                         disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='营销类型' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('aidLink', {})(<Input className={styles.noselect}
                                                         disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 6, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='犹豫期天数' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('otherName', {})(<Input className={styles.noselect}
                                                           disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='免息天数' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('otherLink', {})(<Input className={styles.noselect}
                                                           disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='是否进行人工信审' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('idSt1ate', {})(
                  <Select disabled={true} placeholder="请选择" allowClear={true}>
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
                {getFieldDecorator('idState', {})(<Input className={styles.noselect}
                                                         disabled={true}/>)}
              </FormItem>
            </Col>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='失效日期' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('phoneState', {})(<Input className={styles.noselect}
                                                            disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Divider orientation="left">备注</Divider>
          <p>asddddddddddddddddddddddddddddddddddcxzdsadasdxxzdwqedsad</p>
          <Divider orientation="left">产品列表</Divider>
          <Table
            marginTop={20}
            bordered
            columns={columns}
            dataSource={[{
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
            // pagination={}
            // onChange={() => {}}
          />
        </Form>
      </div>

    );
  }
}

