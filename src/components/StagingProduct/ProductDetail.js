import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Table, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';

import styles from '../../routes/UserManage/UserInfoList.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

const { Meta } = Card;
@Form.create()
export default class ProductDetails extends PureComponent {
  state = {
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
      content: '发布后，该产品将对外使用，确认发布？',
      onOk() {
        me.success()
      },
      onCancel() {
        me.info()
      },
    });
  };

  toEditProduct = (id) => {
    this.props.history.push('/staging/product-set/edit?code=' + id);
  }
  render() {

    const { getFieldDecorator } =this.props.form;
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
              this.props.showCostDetails();}}>
              {text}
            </a>
          )
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
      },{
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
        title:'配帐优先级',
        dataIndex:'dailyRentDi'
      }
    ];
    return (
      <div>
        <h3>产品详情</h3>
        <div>
          <span>未发布</span>
          <Button style={{ float: 'right' }} onClick={() => this.showConfirm()}>发布</Button>
          <Button style={{ float: 'right' }} onClick={() => this.toEditProduct('修改')}>修改</Button>
        </div>
        <Form layout="inline">
          <Row style={{marginTop:20}}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品代码' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('data',{})(<Input className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品名称' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('sex',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>

          </Row>
          <Row style={{marginTop:20}}>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='生效日期' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('idState',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='失效日期' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('phoneState',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginTop:20}}>

            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='产品类型'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('marryState',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>
            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='贷款期数' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('idAddr',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginTop:20}}>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='年费率'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('education',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>%
            </Col>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='年IRR' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('occupation',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>%
            </Col>


          </Row>
          <Row style={{marginTop:20}}>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='日费率'  {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('education',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>%
            </Col>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='年利率' {...formItemLayout} className={styles.formitem}>
                {getFieldDecorator('occupation',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>%
            </Col>


          </Row>
          <Row style={{marginTop:20}}>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小授信金额（≥）' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('bankName',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>元
            </Col>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大授信金额（≤）' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('bankCardNo',{})(<Input   className={styles.noselect} disabled={true}/>)}
              </FormItem>元
            </Col>

          </Row>

          <Row style={{marginTop:20}}>

            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最小贷款金额（≥）' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('ip',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>元
            </Col>

            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='最大贷款金额（≤）' {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('gpsLocation',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>元
            </Col>

          </Row>
          <Row style={{marginTop:20}}>
            <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
              <FormItem label='逾期宽限天数'  {...formItemLayout}  className={styles.formitem}>
                {getFieldDecorator('aidName',{})(<Input  className={styles.noselect} disabled={true}/>)}
              </FormItem>天
            </Col>
          </Row>
          <div style={{ marginTop: 20 , marginLeft: 65}}>
            <FormItem    label='本金还款设定'  >
              {getFieldDecorator('aidName', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>前</span><Input disabled={true} style={{width: 80, margin: '0px 5px'}}
              /><span>期,</span>
              </div>)}
            </FormItem>
            <FormItem   >
              {getFieldDecorator('aidName1', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>还款</span><Input disabled={true} style={{width: 80, margin: '0px 5px'}}
              /><span>%</span>
              </div>)}
            </FormItem>

            <FormItem  >
              {getFieldDecorator('aidLink', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>后</span><Input disabled={true} style={{width: 80, margin: '0px 5px'}}
              /><span>期,</span>
              </div>)}
            </FormItem>
            <FormItem  >
              {getFieldDecorator('aidLink1', {})(<div style={{display: 'flex', flexWrap: 'nowrap'}}>
                <span>还款</span><Input disabled={true} style={{width: 80, margin: '0px 5px'}}
              /><span>%</span>
              </div>)}
            </FormItem>
          </div>
          <Divider orientation={"left"}>备注</Divider>
          <p>asddddddddddddddddddddddddddddddddddcxzdsadasdxxzdwqedsad</p>
          <Divider orientation={"left"}>基础费率设置</Divider>
          <Table
            marginTop={20}
            bordered
            columns={columns}
            dataSource={[{id: 21, name: "测试四位小数..", amount: "1000", creditGrade: 200, dayRate: "0.1499", penaltyRate: "0.0097"}
              ,{id: 20, name: "信小贝", amount: "5000", creditGrade: 300, dayRate: "0.0098", penaltyRate: "0.15"}
              ,{id: 19, name: "测试偶数个产品时APP的默认展示", amount: "1000", creditGrade: 300, dayRate: "0.0201"}
              ,{id: 18, name: "测试修改期限问题", amount: "3000", creditGrade: 400, dayRate: "0.02", penaltyRate: "2"}
              ,{id: 17, name: "kuka", amount: "2000", creditGrade: 400, dayRate: "0.01", penaltyRate: "1"}
              ,{id: 16, name: "多米白卡", amount: "1000", creditGrade: 300, dayRate: "0.0099", penaltyRate: "1"}]
            }
            // pagination={}
            // onChange={() => {}}
          />
        </Form>
      </div>

    );
  }
}
