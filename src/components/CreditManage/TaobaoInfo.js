/**
 * Created by Administrator on 2018/1/3 0003. -- liuy
 * 页面 - 信用卡信息
 * props: 待定
 */

import React, { Component } from 'react'
import { Row, Col } from 'antd'
import ListTable from './Parts/listTable'


class TaobaoInfo extends Component {
  state = {
    info:{},
  }
  componentWillReceiveProps(){
    const { userId, dispatch, detailUrl } = this.props;
    dispatch({
      type: detailUrl,
      payload: userId,
      callback:(result)=>{
        this.setState({
          info:result.resultData,
        })
      }
    })
  }

  componentDidMount(){
    const { userId, dispatch, detailUrl} = this.props;
    dispatch({
      type:detailUrl,
      payload: userId,
      callback: (result)=>{
        if(result.resultCode === 1000 ){
          this.setState({
            info:result.resultData,
          })
        }
      }
    })
  }

  ListSerise(data, classStyle, titleStr) {
    if(data.bind_phone || data.bindAlipayInfo){
      var {bind_phone, createTime, realname, taobao_id, user_name, loginemail, taobao_level,bindAlipayInfo:{verify_status, verify_name, phone}} = data;
    }else{
      var bind_phone, createTime, realname, taobao_id, user_name, loginemail, taobao_level, verify_status, verify_name, phone;
    }
    return  <div className={classStyle.listSerise}>
      <Row>
        <Col span={24}>{titleStr}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>绑定手机号:</Col>
        <Col span={6} className={classStyle.lineitem}>{bind_phone|| '-'}</Col>
        <Col span={6} className={classStyle.lineitem}>数据获取时间:</Col>
        <Col span={6} className={classStyle.lineitem}>{createTime||'-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>姓名:</Col>
        <Col span={6} className={classStyle.lineitem}>{realname||'-'}</Col>
        <Col span={6} className={classStyle.lineitem}>淘宝ID:</Col>
        <Col span={6} className={classStyle.lineitem}>{taobao_id||'-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>用户名:</Col>
        <Col span={6} className={classStyle.lineitem}>{user_name||'-'}</Col>
        <Col span={6} className={classStyle.lineitem}>注册邮箱:</Col>
        <Col span={6} className={classStyle.lineitem}>{loginemail||'-'}</Col>
      </Row>
      <Row>
        <Col span={6} >淘宝等级:</Col>
        <Col span={6} className={classStyle.lineitem}>{taobao_level||'-'}</Col>
        <Col span={6} className={classStyle.lineitem}>支付宝手机号:</Col>
        <Col span={6} className={classStyle.lineitem}>{phone||'-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>支付宝认证状态:</Col>
        <Col span={6} className={classStyle.lineitem}>{verify_status||'-'}</Col>
        <Col span={6} className={classStyle.lineitem}>支付宝认证姓名:</Col>
        <Col span={6} className={classStyle.lineitem}>{verify_name||'-'}</Col>
      </Row>
    </div>
  }

  ListThreeSerise(data, classStyle, titleStr) {
    if(data.bind_phone || data.bindAlipayInfo){
      var { averageConsumptionAmountSixMonths, averageAmountItemSixMonths,proportionVirtualGoodsSixMonths } = data;
    }else{
      var averageConsumptionAmountSixMonths, averageAmountItemSixMonths,proportionVirtualGoodsSixMonths;
    }
    return  <div className={classStyle.listSerise}>
      <Row>
        <Col span={24}>{titleStr}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>近6个月平均每月消费金额:</Col>
        <Col span={6} className={classStyle.lineitem}>{averageConsumptionAmountSixMonths|| '-'}</Col>
        <Col span={6} className={classStyle.lineitem}>平均每件商品金额:</Col>
        <Col span={6} className={classStyle.lineitem}>{averageAmountItemSixMonths||'-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>虚拟商品占比:</Col>
        <Col span={6} className={classStyle.lineitem}>{proportionVirtualGoodsSixMonths||'-'}</Col>
      </Row>
    </div>
  }

  render(){
    const { classStyle, userId, listUrl, dispatch} = this.props;
    const { info } =this.state;
    const columns = [{
      title:'地址',
      dataIndex:'address',
    },{
      title:'省',
      dataIndex:'province',
    },{
      title:'市',
      dataIndex:'city',
    },{
      title:'区',
      dataIndex:'area',
    },{
      title:'收货人名字',
      dataIndex:'name',
    },{
      title:'收货人手机号',
      dataIndex:'phone',
    },{
      title:'使用次数',
      dataIndex:'count',
    }];

    return   <div>
      <div className={classStyle.listDiv}>
        {
          this.ListSerise(info, classStyle, '淘宝基本信息')
        }
      </div>
      <div className={classStyle.listDiv}>
        <div className={classStyle.listSerise}>
          <Row>
            <Col span={24}>收货地址列表</Col>
          </Row>
          <Row>
            <Col span={22} offset={1}>
              <ListTable userId={userId}  listUrl={listUrl} columns={columns} dispatch={dispatch}/>
            </Col>
          </Row>
        </div>
      </div>
      <div className={classStyle.listDiv}>
        {
          this.ListThreeSerise(info, classStyle, '订单信息')
        }
      </div>
    </div>
  }
}

export default TaobaoInfo;
