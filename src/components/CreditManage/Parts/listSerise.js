/**
 * Created by Administrator on 2018/1/5 0005.
 */
import {Row, Col} from 'antd';


var ListSerise = (props) => {
  const {data, classStyle, titleStr } = props;
  //淘宝
  const {bind_phone, createTime, realname, taobao_id, user_name, loginemail, taobao_level,bindAlipayInfo:{verify_status, verify_name, phone}} = data;
  //手机号
  const {} = data;
 //信用卡
  return  <div className={classStyle.listSerise}>
              <Row>
                <Col span={24}>{titleStr}</Col>
              </Row>
              <Row>
                <Col span={6} className={classStyle.lineitem}>绑定手机号:</Col>
                <Col span={6} className={classStyle.lineitem}>{bind_phone}</Col>
                <Col span={6} className={classStyle.lineitem}>数据获取时间:</Col>
                <Col span={6} className={classStyle.lineitem}>{createTime}</Col>
              </Row>
              <Row>
                  <Col span={6} className={classStyle.lineitem}>姓名:</Col>
                  <Col span={6} className={classStyle.lineitem}>{realname}</Col>
                  <Col span={6} className={classStyle.lineitem}>淘宝ID:</Col>
                  <Col span={6} className={classStyle.lineitem}>{taobao_id}</Col>
              </Row>
              <Row>
                <Col span={6} className={classStyle.lineitem}>用户名:</Col>
                <Col span={6} className={classStyle.lineitem}>{user_name}</Col>
                <Col span={6} className={classStyle.lineitem}>注册邮箱:</Col>
                <Col span={6} className={classStyle.lineitem}>{loginemail}</Col>
              </Row>
              <Row>
                <Col span={6} >淘宝等级:</Col>
                <Col span={6} className={classStyle.lineitem}>{taobao_level}</Col>
                <Col span={6} className={classStyle.lineitem}>支付宝手机号:</Col>
                <Col span={6} className={classStyle.lineitem}>{phone}</Col>
              </Row>
              <Row>
                <Col span={6} className={classStyle.lineitem}>支付宝认证状态:</Col>
                <Col span={6} className={classStyle.lineitem}>{verify_status}</Col>
                <Col span={6} className={classStyle.lineitem}>支付宝认证姓名:</Col>
                <Col span={6} className={classStyle.lineitem}>{verify_name}</Col>
              </Row>
           </div>
}

export default ListSerise;
