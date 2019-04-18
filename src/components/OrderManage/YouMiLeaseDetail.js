/**
 * 订单详情设备信息
 * Created by Administrator on 2017/12/15 0015.
 */
import React from 'react';
import { Row, Col, Form, Input} from 'antd';
import styles from '../../routes/UserManage/UserInfoList.less';
const FormItem = Form.Item;

const YouMiLeaseDetail  = Form.create({
  mapPropsToFields(props) {
  if(!props.modalrecord){
    var firmName,
      modelName,
      memory,
      value,
      udid;
  }else{
   var  {
       firmName,
        modelName,
        memory,
        value,
        udid
     } = props.modalrecord
  } 
    return {
    	
      loanAmount:  Form.createFormField({
        value: firmName||""
      }),
      loanTime:  Form.createFormField({
        value: modelName||""
      }),
      authFee:  Form.createFormField({
        value: memory||""
      }),
      serviceFee:  Form.createFormField({
        value: value||""
      }),
      interest:  Form.createFormField({
        value: udid||""
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
            <FormItem label='设备厂商' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanAmount',{})(<Input />)}
            </FormItem>
          </Col>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='设备型号' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('loanTime',{})(<Input  />)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='设备内存' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('authFee',{})(<Input  placeholder='' style={{display: 'inlene-block'}}/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 1, offset: 0.1 }} lg={{ span: 1, offset: 0.1 }}>
         	 <span style={{lineHeight: '40px'}}>G</span>
          </Col>
          <Col xs={{ span: 8, offset: 1 }} lg={{ span: 8, offset: 1 }}>
            <FormItem label='设备估值' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('serviceFee',{})(<Input  placeholder=''/>)}
            </FormItem>
          </Col>
          <Col xs={{ span: 1, offset: 0.1 }} lg={{ span: 1, offset: 0.1 }}>
         	 <span style={{lineHeight: '40px'}}>元</span>
          </Col>
        </Row>
        <Row  gutter={16}>
          <Col xs={{ span: 8, offset: 2 }} lg={{ span: 8, offset: 2 }}>
            <FormItem label='设备标识' {...formItemLayout} className={styles.formitem}>
              {getFieldDecorator('interest',{})(<Input  />)}
            </FormItem>
          </Col>
          
        </Row>
      </Form>
    </div>
  }
);

export default YouMiLeaseDetail;

