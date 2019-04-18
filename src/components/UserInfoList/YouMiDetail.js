import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';

import styles from '../../routes/UserManage/UserInfoList.less';

const FormItem = Form.Item;
const { Meta } = Card;

const Detail = Form.create({
  mapPropsToFields(props) {
    let {
      manageUserDetailModel,
      clUserAuth,
      userEmerContacts
    } = props;
    if(!manageUserDetailModel || manageUserDetailModel === null) {
      var  realName,
        sex,
        age,
        idNo,
        idAddr,
        bankCardNo,
        education,
        occupation,
        marryState,
        zhimaScore,
        taobaoAccount,
        creditCardEmail,
        liveAddr,
        registerAddr,
        registerCoordinate;
    }else{
      var {
        realName,
        sex,
        age,
        idNo,
        idAddr,
        bankCardNo,
        education,
        occupation,
        marryState,
        zhimaScore,
        taobaoAccount,
        creditCardEmail,
        liveAddr,
        registerAddr,
        registerCoordinate,
      } = manageUserDetailModel;
    }
    if(!clUserAuth){
      var idStateStr,
        contactStateStr,
        bankCardStateStr,
        phoneStateStr,
        zhimaStateStr,
        creditCardStateStr,
        taobaoStateStr,
        netSilverStateStr;
    }else{
      var  {
        idStateStr,
        contactStateStr,
        bankCardStateStr,
        phoneStateStr,
        zhimaStateStr,
        creditCardStateStr,
        taobaoStateStr,
        netSilverStateStr,
      } = clUserAuth;
    }



    if( userEmerContacts && userEmerContacts.length != 0){
      if(userEmerContacts.length == 1){
        if(userEmerContacts[0].type == '10'){
          var  aidLink = userEmerContacts[0].phone,
            aidName = userEmerContacts[0].name,
            aidWith = userEmerContacts[0].relation;
          var  otherLink ='',otherName ='', otherWith = '';
        }else{
          var  otherLink = userEmerContacts[0].phone,
            otherName = userEmerContacts[0].name,
            otherWith = userEmerContacts[0].relation;
          var  aidLink ='', aidName ='', aidWith ='';
        }
      }else if(userEmerContacts.length == 2 || userEmerContacts.length > 2){
        if(userEmerContacts[0].type == '10'){
          var  aidLink = userEmerContacts[0].phone,
            aidName = userEmerContacts[0].name,
            aidWith = userEmerContacts[0].relation,
            otherLink = userEmerContacts[1].phone,
            otherName = userEmerContacts[1].name,
            otherWith = userEmerContacts[1].relation;
        }else{
          var  aidLink = userEmerContacts[1].phone,
            aidName = userEmerContacts[1].name,
            aidWith = userEmerContacts[1].relation,
             otherLink = userEmerContacts[0].phone,
            otherName = userEmerContacts[0].name,
            otherWith = userEmerContacts[0].relation;
        }
      }
    }else{
      var  otherLink ='',otherName ='', otherWith = '',
           aidLink ='', aidName ='', aidWith ='';
    }
    return {
      realName:  Form.createFormField({
        value: realName?realName:""
      }),
      sex:  Form.createFormField({
        value: sex?sex:""
      }),
      age:  Form.createFormField({
        value: age?age:""
      }),
      idNo:  Form.createFormField({
        value: idNo?idNo:""
      }),
      idAddr:  Form.createFormField({
        value: idAddr?idAddr:""
      }),
      bankCardNo:  Form.createFormField({
        value: bankCardNo?bankCardNo:""
      }),
      education:  Form.createFormField({
        value: education?education:""
      }),
      occupation:  Form.createFormField({
        value: occupation?occupation:""
      }),
      marryState:  Form.createFormField({
        value: marryState?marryState:""
      }),
      zhimaScore:  Form.createFormField({
        value: zhimaScore?zhimaScore:""
      }),
      taobaoAccount:  Form.createFormField({
        value: taobaoAccount?taobaoAccount:""
      }),
      creditCardEmail:  Form.createFormField({
        value: creditCardEmail?creditCardEmail:""
      }),
      liveAddr:  Form.createFormField({
        value: liveAddr?liveAddr:""
      }),
      registerAddr:  Form.createFormField({
        value: registerAddr?registerAddr:""
      }),
      registerCoordinate:  Form.createFormField({
        value: registerCoordinate?registerCoordinate:""
      }),
      idState:  Form.createFormField({
        value: idStateStr?idStateStr:""
      }),
      contactState:  Form.createFormField({
        value: contactStateStr?contactStateStr:""
      }),
      bankCardState:  Form.createFormField({
        value: bankCardStateStr?bankCardStateStr:""
      }),
      phoneState:  Form.createFormField({
        value: phoneStateStr?phoneStateStr:""
      }),
      zhimaState:  Form.createFormField({
        value: zhimaStateStr?zhimaStateStr:""
      }),
      creditCardState:  Form.createFormField({
        value: creditCardStateStr?creditCardStateStr:""
      }),
      taobaoState:  Form.createFormField({
        value: taobaoStateStr?taobaoStateStr:""
      }),
      netSilverState:  Form.createFormField({
        value: netSilverStateStr?netSilverStateStr:""
      }),
      aidName:  Form.createFormField({
        value: aidName?aidName:""
      }),
      aidLink:  Form.createFormField({
        value: aidLink?aidLink:""
      }),
      aidWith:  Form.createFormField({
        value: aidWith?aidWith:""
      }),
      otherName:  Form.createFormField({
        value: otherName?otherName:""
      }),
      otherLink:  Form.createFormField({
        value: otherLink?otherLink:""
      }),
      otherWith:  Form.createFormField({
        value: otherWith?otherWith:""
      }),

    };
  },
})((props) => {
  const { getFieldDecorator } = props.form;
  let { manageUserDetailModel } = props;
  if(manageUserDetailModel){
    var {
      livingImg,
      frontImg,
      backImg,
    } = manageUserDetailModel;
  }else{
    var livingImg = '',
      frontImg = '',
      backImg = '';
  }
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
  const formItemLayout1 = {
    labelCol: {
      span: 24
    },
    wrapperCol: {
      span: 20
    },
  };
  return (
    <Form layout="inline">
      

      <Row style={{marginTop:10}} gutter={16}>
        
        
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='机型' {...formItemLayout} className={styles.formitem}>
            {getFieldDecorator('idNo',{})(<Input  className={styles.noselect} />)}
          </FormItem>
        </Col>
      </Row>
      <Row style={{marginTop:20}}>
        
        
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='厂商' {...formItemLayout} className={styles.formitem}>
            {getFieldDecorator('idAddr',{})(
            	<Select placeholder="请选择">
                  <Option value="苹果">苹果</Option>
                  <Option value="华为">华为</Option>
                </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{marginTop:20}}>
        
        
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='品牌' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('bankCardNo',{})(
            	<Select placeholder="请选择">
                  <Option value="Android">Android</Option>
                  <Option value="iOS">iOS</Option>
                </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row style={{marginTop:20}}>
        
        
        <Col xs={{ span: 5, offset: 1 }} lg={{ span:10, offset: 1 }}>
          <FormItem label='内部型号' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('liveAddr',{})(<Input  className={styles.noselect} />)}
          </FormItem>
        </Col>

      </Row>
      <Row style={{marginTop:20}}>
        
        
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='内存' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('registerAddr',{})(<Input  className={styles.noselect} />)}
          </FormItem>
        </Col>
        <Col xs={{ span: 1, offset: 0.1 }} lg={{ span: 1, offset: 0.1 }}>
         	 <span style={{lineHeight: '40px'}}>G</span>
          </Col>

      </Row>
      <Row style={{marginTop:20}}>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='总值' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('aidWith',{})(<Input  className={styles.noselect} />)}
          </FormItem>
        </Col>
        <Col xs={{ span: 1, offset: 0.1 }} lg={{ span: 1, offset: 0.1 }}>
         	 <span style={{lineHeight: '40px'}}>元</span>
          </Col>
        
      </Row>
      <Row style={{marginTop:20}}>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 10, offset: 1 }}>
          <FormItem label='估值' {...formItemLayout}  className={styles.formitem}>
            {getFieldDecorator('otherLink',{})(<Input  className={styles.noselect} />)}
          </FormItem>
        </Col>
        <Col xs={{ span: 1, offset: 0.1 }} lg={{ span: 1, offset: 0.1 }}>
         	 <span style={{lineHeight: '40px'}}>元</span>
          </Col>
        
      </Row>

      <Row style={{marginTop:20}}>
	      <Meta
	        title="图片:"
	        style={{ marginLeft: 163}}
	      />
	        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 2 }}>
	          <Card
	            hoverable
	            style={{  width: 240,marginLeft:120}}
	            cover={<div style={{backgroundImage:`url(${backImg})`}} className={styles.coverdiv}>&nbsp;</div>}
	          >
	          </Card>
	        </Col>
        <Col xs={{ span: 1, offset: 4 }} lg={{ span: 1, offset: 4 }}>
         	 <Button key="btnimg" type="primary" onClick={() => this.handleModalVisible()}>上传图片</Button>
        </Col>
        
      </Row>
      
      
    </Form>
  );
});

export default Detail;