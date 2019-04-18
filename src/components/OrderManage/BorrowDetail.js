/**
 * Created by Administrator on 2017/12/15 0015.
 */
import React from 'react';
import { Row, Col, Form, Input} from 'antd';
import styles from '../../routes/UserManage/UserInfoList.less';
const FormItem = Form.Item;

const BorrowDetail  = Form.create({
  mapPropsToFields(props) {
    console.log(props);
  if(!props.modalrecord){
    var loanAmount,
      loanTime,
      authFee,
      serviceFee,
      interest,
      repayAmount;
  }else{
   var  {
       loanAmount,
        loanTime,
        authFee,
        serviceFee,
        interest,
        repayAmount
     } = props.modalrecord
  }
    return {
      loanAmount:  Form.createFormField({
        value: loanAmount||""
      }),
      loanTime:  Form.createFormField({
        value: loanTime||""
      }),
      authFee:  Form.createFormField({
        value: authFee||""
      }),
      serviceFee:  Form.createFormField({
        value: serviceFee||""
      }),
      interest:  Form.createFormField({
        value: interest||""
      }),
      repayAmount:  Form.createFormField({
        value: repayAmount||""
      })
  }
  }
})(
  (props)=>{
    const { getFieldDecorator } = props.form;
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
    return <div>
     <Form>
        <Row style={{marginTop:40}} gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='放款金额' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanAmount',{})(<Input disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='放款时间' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanTime',{})(<Input  disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='支付信审费' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('authFee',{})(<Input  disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='服务费' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('serviceFee',{})(<Input  disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='利息' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('interest',{})(<Input  disabled={true}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='还款总额' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('repayAmount',{})(<Input  disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  }
);

export default BorrowDetail;

