/**
 * Created by Administrator on 2018/1/3 0003. -- liuy
 * 页面 - Tab内嵌页 -  手机运营商
 * props:
 */

import React, { PureComponent } from 'react'
import {Row, Col, Table} from 'antd'

class MobileCarrier extends PureComponent {
  state = {
    info: {},
  }

  componentWillReceiveProps() {
    const {userId, dispatch, detailUrl} = this.props;
    dispatch({
      type: detailUrl,
      payload: userId,
      callback: (result) => {
        this.setState({
          info: result.resultData,
        })
      }
    })
  }

  componentDidMount() {
    const {userId, dispatch, detailUrl} = this.props;
    dispatch({
      type: detailUrl,
      payload: userId,
      callback: (result) => {
        if (result.resultCode === 1000) {
          this.setState({
            info: result.resultData,
          })
        }
      }
    })
  }

  ListSerise(data, classStyle, titleStr) {
    if (data.phone || data.name) {
      var {phone, name, innetDate, obtainDate, province, city} = data;
    } else {
      var phone, name, innetDate, obtainDate, province, city;
    }
    return <div className={classStyle.listSerise}>
      <Row>
        <Col span={24}>{titleStr}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>运营商认证手机号:</Col>
        <Col span={6} className={classStyle.lineitem}>{phone || '-'}</Col>
        <Col span={6} className={classStyle.lineitem}>数据获取时间:</Col>
        <Col span={6} className={classStyle.lineitem}>{obtainDate || '-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>姓名:</Col>
        <Col span={6} className={classStyle.lineitem}>{name || '-'}</Col>
        <Col span={6} className={classStyle.lineitem}>入网时间:</Col>
        <Col span={6} className={classStyle.lineitem}>{innetDate || '-'}</Col>
      </Row>
      <Row>
        <Col span={6} className={classStyle.lineitem}>号码所在省:</Col>
        <Col span={6} className={classStyle.lineitem}>{province || '-'}</Col>
        <Col span={6} className={classStyle.lineitem}>号码所在市:</Col>
        <Col span={6} className={classStyle.lineitem}>{city || '-'}</Col>
      </Row>
    </div>
  }

  render() {
    const {classStyle} = this.props;
    const {info} = this.state;
    const columns = [{
      title: '电话',
      dataIndex: '',
      key: 'tell',
      render: (text, record) => {
        let temp = JSON.parse(record);
        return temp.length && temp.length >= 1 ? temp[0] : ''
      }
    }, {
      title: '次数',
      dataIndex: '',
      key: 'count',
      width: 68,
      render: (text, record) => {
        let temp = JSON.parse(record);
        return temp.length && temp.length >= 2 ? temp[1] : ''
      }
    }, {
      title: '归属地',
      dataIndex: 'city',
      render: (text, record) => {
        let temp = JSON.parse(record);
        return temp.length && temp.length >= 3 ? temp[2] : '-'
      }
    }];

    return <div>
      <div className={classStyle.listDiv}>
        {
          this.ListSerise(info, classStyle, '号码基本信息')
        }
      </div>
      <div className={classStyle.listDiv}>
        <div className={classStyle.listSerise}>
          <Row>
            <Col span={24}>手机运营商呼入呼出前十</Col>
          </Row>
          <Row>
            <Col span={10} offset={1}>
              <p style={{marginTop: '14px'}}>呼入前十</p>
              <Table size="small"
                     bordered
                     columns={columns}
                     dataSource={ info.top_ten_call_in_phone_num_label_list || [] }
                     pagination={false}/>
            </Col>
            <Col span={10} offset={2}>
              <p style={{marginTop: '14px'}}>呼出前十</p>
              <Table size="small"
                     bordered
                     columns={columns}
                     dataSource={info.top_ten_call_out_phone_num_label_list || []}
                     pagination={false}/>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  }
}

export default MobileCarrier;
