/**
 * Created by Administrator on 2018/1/3 0003. -- liuy
 * 页面 - 信用卡信息
 * props: 待定
 */

import React, {Component} from 'react'
import {Row, Col} from 'antd'
import ListTable from './Parts/listTable'

class CreditCardInfo extends Component {
  state = {
    creditinfo: {},
  }

  componentDidMount() {
    const {userId, dispatch, detailUrl} = this.props;
    dispatch({
      type: detailUrl,
      payload: userId,
      callback: (result) => {
        if (result.resultCode === 1000) {
          this.setState({
            creditinfo: result.resultData || {}
          })
        }
      }
    })
  }

  ListSerise(data, classStyle, titleStr) {
    if (data) {
      var {user_basic_information: {name, email, active_cards, bank_nums, first_bill_date}, credit_limit_informatin: {total_credit_limit, total_aviable_credit_limit}, overdue_information: {overdue_flag}} = data;
    } else {
      var name, email, active_cards, bank_nums, first_bill_date, total_credit_limit, total_aviable_credit_limit,
        overdue_flag;
    }
    return <div className={classStyle.listSerise}>
      <Row>
        <Col span={24}>{titleStr}</Col>
      </Row>
      <Row>
        <Col span={6}>姓名:</Col>
        <Col span={6}>{name || '-'}</Col>
        <Col span={6}>邮箱:</Col>
        <Col span={6}>{email || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>活跃卡数:</Col>
        <Col span={6}>{active_cards || '-'}</Col>
        <Col span={6}>银行数:</Col>
        <Col span={6}>{bank_nums || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>最初账单日:</Col>
        <Col span={6}>{first_bill_date || '-'}</Col>
        <Col span={6}>信用卡总额度:</Col>
        <Col span={6}>{total_credit_limit || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>信用卡总可用额度:</Col>
        <Col span={6}>{total_aviable_credit_limit || '-'}</Col>
        <Col span={6}>逾期标志:</Col>
        <Col span={6}>{overdue_flag || '-'}</Col>
      </Row>
    </div>
  }

  ListFourSerise(data, classStyle, titleStr) {
    if (data) {
      var {
        new_charge_information: {
          average_consume_l3m, average_consume_l6m, average_consume_l12m,
          max_consume_l3m, max_consume_l6m, max_consume_l12m,
          times_withdraw_deposit_l3m, total_withdraw_count_l6m, total_withdraw_count_l12m,
          withdraw_amount_l3m, withdraw_amount_l6m, withdraw_amount_l12m,
          average_withdraw_amount_l3m, average_withdraw_amount_l6m, average_withdraw_amount_l12m
        },
        credit_limit_analyze_informatin: {
          average_sell_div_credit_limit_l3m, average_sell_div_credit_limit_l6m, average_sell_div_credit_limit_l12m
        },
        payment_analyze_information: {
          average_payment_amount_l3m, average_payment_amount_l6m, average_payment_amount_l12m,
          average_payment_ratio_l3m, average_payment_ratio_l6m, average_payment_ratio_l12m,
          months_last_payment_from_now_l3m, months_last_payment_from_now_l6m, months_last_payment_from_now_l12m
        },
        overdue_analyze_information: {
          max_overdue_fine_l3m, max_overdue_fine_l6m, max_overdue_fine_l12m,
          max_overdue_status_l3m, max_overdue_status_l6m, max_overdue_status_l12m,
          months_last_overdue_months_from_now_l3m, months_last_overdue_months_from_now_l6m, months_last_overdue_months_from_now_l12m
        }
      } = data;
    } else {
      var average_consume_l3m, average_consume_l6m, average_consume_l12m,
        max_consume_l3m, max_consume_l6m, max_consume_l12m,
        times_withdraw_deposit_l3m, total_withdraw_count_l6m, total_withdraw_count_l12m,
        withdraw_amount_l3m, withdraw_amount_l6m, withdraw_amount_l12m,
        average_withdraw_amount_l3m, average_withdraw_amount_l6m, average_withdraw_amount_l12m,
        average_sell_div_credit_limit_l3m, average_sell_div_credit_limit_l6m, average_sell_div_credit_limit_l12m,
        average_payment_amount_l3m, average_payment_amount_l6m, average_payment_amount_l12m,
        average_payment_ratio_l3m, average_payment_ratio_l6m, average_payment_ratio_l12m,
        months_last_payment_from_now_l3m, months_last_payment_from_now_l6m, months_last_payment_from_now_l12m,
        max_overdue_fine_l3m, max_overdue_fine_l6m, max_overdue_fine_l12m,
        max_overdue_status_l3m, max_overdue_status_l6m, max_overdue_status_l12m,
        months_last_overdue_months_from_now_l3m, months_last_overdue_months_from_now_l6m,
        months_last_overdue_months_from_now_l12m;
    }
    return <div className={classStyle.listSerise}>
      <Row>
        <Col span={24}>{titleStr}</Col>
      </Row>
      <Row>
        <Col span={6}>类型</Col>
        <Col span={6}>近3月</Col>
        <Col span={6}>近6月</Col>
        <Col span={6}> 近12月</Col>
      </Row>
      <Row>
        <Col span={6}>月均消费金额:</Col>
        <Col span={6}>{average_consume_l3m || '-'}</Col>
        <Col span={6}>{average_consume_l6m || '-'}</Col>
        <Col span={6}>{average_consume_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>最高消费金额: </Col>
        <Col span={6}>{max_consume_l3m || '-'}</Col>
        <Col span={6}>{max_consume_l6m || '-'}</Col>
        <Col span={6}>{max_consume_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>提现次数: </Col>
        <Col span={6}>{times_withdraw_deposit_l3m || '-'}</Col>
        <Col span={6}>{total_withdraw_count_l6m || '-'}</Col>
        <Col span={6}>{total_withdraw_count_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>提现金额:</Col>
        <Col span={6}>{withdraw_amount_l3m || '-'}</Col>
        <Col span={6}>{withdraw_amount_l6m || '-'}</Col>
        <Col span={6}>{withdraw_amount_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>月均提现金额:</Col>
        <Col span={6}>{average_withdraw_amount_l3m || '-'}</Col>
        <Col span={6}>{average_withdraw_amount_l6m || '-'}</Col>
        <Col span={6}>{average_withdraw_amount_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}>近*月月均消费+提现金额占总额度比: </Col>
        <Col span={6}>{average_sell_div_credit_limit_l3m || '-'}</Col>
        <Col span={6}>{average_sell_div_credit_limit_l6m || '-'}</Col>
        <Col span={6}>{average_sell_div_credit_limit_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 近*月月均还款金额: </Col>
        <Col span={6}>{average_payment_amount_l3m || '-'}</Col>
        <Col span={6}>{average_payment_amount_l6m || '-'}</Col>
        <Col span={6}>{average_payment_amount_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 近*月月均还款率: </Col>
        <Col span={6}>{average_payment_ratio_l3m || '-'}</Col>
        <Col span={6}>{average_payment_ratio_l6m || '-'}</Col>
        <Col span={6}>{average_payment_ratio_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 近*月最近一次还款距今的月数: </Col>
        <Col span={6}>{months_last_payment_from_now_l3m || '-'}</Col>
        <Col span={6}>{months_last_payment_from_now_l6m || '-'}</Col>
        <Col span={6}>{months_last_payment_from_now_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 最高延滞金额: </Col>
        <Col span={6}>{max_overdue_fine_l3m || '-'}</Col>
        <Col span={6}>{max_overdue_fine_l6m || '-'}</Col>
        <Col span={6}>{max_overdue_fine_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 最高延滞状态: </Col>
        <Col span={6}>{max_overdue_status_l3m || '-'}</Col>
        <Col span={6}>{max_overdue_status_l6m || '-'}</Col>
        <Col span={6}>{max_overdue_status_l12m || '-'}</Col>
      </Row>
      <Row>
        <Col span={6}> 最近产生延滞金额距今的月数: </Col>
        <Col span={6}>{months_last_overdue_months_from_now_l3m || '-'}</Col>
        <Col span={6}>{months_last_overdue_months_from_now_l6m || '-'}</Col>
        <Col span={6}>{months_last_overdue_months_from_now_l12m || '-'}</Col>
      </Row>
    </div>
  }


  render() {
    const {classStyle, userId, listUrl, dispatch} = this.props;
    const {creditinfo} = this.state;
    const columns = [{
      title: '卡号',
      dataIndex: 'card_number',
    }, {
      title: '持卡人',
      dataIndex: 'name_on_card',
    }, {
      title: '账单日',
      dataIndex: 'bill_date',
    }, {
      title: '还款日',
      dataIndex: 'payment_due_date',
    }, {
      title: '信用额度',
      dataIndex: 'credit_limit',
    }, {
      title: '邮箱',
      dataIndex: 'mail_sender',
    }];

    return <div>
      <div className={classStyle.listDiv}>
        {
          this.ListSerise(creditinfo.creditCardBaseInfoModel, classStyle, '信用卡基本信息')
        }
      </div>
      <div className={classStyle.listDiv}>
        <div className={classStyle.listSerise}>
          <Row>
            <Col span={24}>信用卡明细</Col>
          </Row>
          <Row>
            <Col span={22} offset={1}>
              <ListTable userId={userId} listUrl={listUrl} columns={columns} dispatch={dispatch}/>
            </Col>
          </Row>
        </div>
      </div>
      <div className={classStyle.listDiv}>
        {
          this.ListFourSerise(creditinfo.creditCardUseMesModel, classStyle, '使用情况')
        }
      </div>
    </div>
  }
}

export default CreditCardInfo;
