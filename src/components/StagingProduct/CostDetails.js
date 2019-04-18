import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Table, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';

import styles from '../../routes/UserManage/UserInfoList.less';

const FormItem = Form.Item;
const { Meta } = Card;
@Form.create()
export default class CostDetails extends PureComponent {
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

    return (
      <Modal title="费用详情"
             visible={this.props.costDetailsVisible}
             width={1200}
             footer={null}
             onOk={() => {

             }}
             onCancel={() => this.props.showCostDetails()}>
        <div>
          <Button style={{ float: 'right' }} onClick={() => this.showDelete()}>删除</Button>
          <Button style={{ float: 'right' }} onClick={() => this.showmodalAdd('修改')}>修改</Button>
        </div>
      <Form layout="inline">
        <Row style={{marginTop:20}}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='费用代码' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('data',{})(<Input className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='费用类型' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('sex',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>

        </Row>
        <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
          <FormItem label='产品系列' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('phoneState',{})(<Input  className={styles.noselect} disabled={true}/>)}
          </FormItem>
        </Col>
        <Row style={{marginTop:20}}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品名称' {...formItemLayout}  className={styles.formitem}>
              {getFieldDecorator('phoneState',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='产品系列' {...formItemLayout}  className={styles.formitem}>
              {getFieldDecorator('phoneState',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>

        <Row style={{marginTop:20}}>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='收取类型'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('marryState',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='收取时间' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('idAddr',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row style={{marginTop:20}}>
          <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='计算类型'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('education',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>%
          </Col>
          <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='比例' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('occupation',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>%
          </Col>


        </Row>
        <Row style={{marginTop:20}}>
          <Col style={{display: 'flex', alignItems: 'center'}} xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='适用功能'  {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('education',{})(<Input  className={styles.noselect} disabled={true}/>)}
            </FormItem>%
          </Col>
        </Row>
      </Form>
      </Modal>
    );
  }
}
