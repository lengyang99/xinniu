/**
 * 订单详情租赁信息
 * Created by Administrator on 2017/12/15 0015.
 */
import React from 'react';
import { Row, Col, Form, Input} from 'antd';
import styles from '../../routes/UserManage/UserInfoList.less';
const FormItem = Form.Item;

const YouMiBorrowDetail  = Form.create({
  mapPropsToFields(props) {
  if(!props.modaldetail){
    var principal,
      loanTime,
      authFee,
      overdueServiceFee,
      overdueManageFee,
      rentFee,
      depreciationFee,
      allFee;
  }else{
   var  {
       principal,
        loanTime,
        authFee,
        overdueServiceFee,
        overdueManageFee,
        rentFee,
        depreciationFee,
        allFee
     } = props.modaldetail
  }
    return {
      loanAmount:  Form.createFormField({
        value: principal
      }),
      loanTime:  Form.createFormField({
        value: loanTime
      }),
      authFee:  Form.createFormField({
        value: authFee
      }),
      serviceFee:  Form.createFormField({
        value: overdueServiceFee
      }),
      interest:  Form.createFormField({
        value: overdueManageFee
      }),
      repayAmount:  Form.createFormField({
        value: rentFee
      }),
      depreciationFee:  Form.createFormField({
        value: depreciationFee
      }),
      allFee:  Form.createFormField({
        value: allFee
      }),
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
            <FormItem label='设备估值' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanAmount',{})(<Input />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='放款时间' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanTime',{})(<Input  />)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='信审费用' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('authFee',{})(<Input  />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='服务费用' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('serviceFee',{})(<Input  />)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='租金' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('repayAmount',{})(<Input  />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='逾期管理费' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('interest',{})(<Input  />)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='折旧费用' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('depreciationFee',{})(<Input  />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='交租总额' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('allFee',{})(<Input  />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  }
);

export default YouMiBorrowDetail;

