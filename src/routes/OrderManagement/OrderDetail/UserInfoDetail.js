import React from 'react';
import { Row, Col, Card, Form, Divider,} from 'antd';
import styles from './UserInfoDetail.less';
const { Meta } = Card;

const Detail = Form.create()((props)=>{
  const {data:{manageUserDetailModel:user = {}, clUserAuth = {}, userEmerContacts = {}} = {}} = props;
  const clUserAuthInfo = [
    {
      label: '运营商认证',
      value: clUserAuth.phoneStateStr
    },{
      label: '实名认证',
      value: clUserAuth.idStateStr
    },{
      label: '联系人认证',
      value: clUserAuth.contactStateStr
    }];
  const relationship = {1:'父母',2:'配偶',3:'兄弟',4:'姐妹',5:'朋友',6:'其他'};
  const userInfo = [
  {
    label:'真实姓名',
    value: user.realName,
  },{
    label:'性别',
    value:user.sex,
  },{
    label:'年龄',
    value: user.age
  },{
    label:'身份证',
    value: user.idNo
  },{
    label:'',
    value:''
  },{
    label:'身份证地址',
    value: user.idAddr,
  },{
    label:'学历',
    value: user.education
  },{
    label:'职业',
    value: user.occupation
  },{
    label:'婚姻情况',
    value: '未婚',
  },{
    label:'居住地址',
    value: user.idAddr
  },{
    label:'IP地址',
    value: user.ipAddr
  },{
    label:'下单经纬度',
    value: user.registerCoordinate
  },{
    label:'银行',
    value: user.bankName
  },{
    label:'银行卡号',
    value: user.bankCardNo
  },{
    label:'预留手机',
    value: user.bankCardPhone
  },{
    label:'紧急联系人姓名',
    value: userEmerContacts.emergency_contact_personA_name,
  },{
    label:'紧急联系方式',
    value: userEmerContacts.emergency_contact_personA_phone
  },{
    label:'紧急联系人关系',
    value: relationship[userEmerContacts.emergency_contact_personB_relationship],
  },{
    label:'其他联系人姓名',
    value: userEmerContacts.emergency_contact_personB_name,
  },{
    label:'其他联系方式',
    value: userEmerContacts.emergency_contact_personB_phone,
  },{
    label:'其他联系人关系',
    value: relationship[userEmerContacts.emergency_contact_personB_relationship],
  },];
  return (
    <Form>
      <Row>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 2 }}>
          <Card key="peopleimg"
                hoverable
                style={{ width: 240}}
                cover={<div style={{backgroundImage:`url(${user.livingImg})`}} className={styles.coverdiv}>&nbsp;</div>}
          >
            <Meta
              title="人脸正面照"
            />
          </Card>
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 2 }}>
          <Card key="fontimg"
                hoverable
                style={{ width: 240 }}
                cover={<div style={{backgroundImage:`url(${user.frontImg})`}} className={styles.coverdiv}>&nbsp;</div>}
          >
            <Meta key="endimg"
                  title="身份证正面照"
                  style={{textAlign:'center',width:'100%'}}
            />
          </Card>
        </Col>
        <Col xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 2 }}>
          <Card
            hoverable
            style={{  width: 240}}
            cover={<div style={{backgroundImage:`url(${user.backImg})`}} className={styles.coverdiv}>&nbsp;</div>}
          >
            <Meta
              title="身份证背面照"
            />
          </Card>
        </Col>
      </Row>
      <Divider>用户基本信息</Divider>
      {
        userInfo.map(item => (
          <div key={item.label} className={styles.form_item}>
            <label className={styles.form_label}>{`${item.label}${item.label === '' ? '' : ':' }`} </label>
            <label className={styles.form_input}>{item.value} </label>
          </div>
          ))
      }
      <Divider>认证状态</Divider>
      {
        clUserAuthInfo.map(item => (
          <div key={item.label} className={styles.form_item}>
            <label className={styles.form_label}>{`${item.label}${item.label === '' ? '' : ':' }`} </label>
            <label className={styles.form_input}>{item.value} </label>
          </div>
          ))
      }
    </Form>
  );
})
  
export default Detail;
