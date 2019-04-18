import React, { Component } from 'react'
import moment from 'moment'
import { Button, Input, TimePicker, message, Upload, Calendar, Form, Radio, Select, DatePicker, Table, Card, Row, Col, Modal } from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FundsChannel.less';
import {
	queryChannelEnum,
	queryChannel,
	querySupportBankEnum,
	channelStatus,
	queryRepayCountStyleEnum,
	queryFundConfig,
	queryProductSeries,
	queryCooperationStyle,
	saveFundsChannel,
	changeFundsChannel,
	saveFundsPlan,
	queryPlanAmount,
	queryBankConfig,
	queryAgentEnum,
	queryPayOrWithhold
} from '../../services/fundChannel'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group;
@Form.create()
export default class FundChannel extends Component {
	constructor() {
		super()
		this.state = {
			isAdd: false,//新增渠道的Modal
			action: "",
			accountModel: null,//对账模板
			repayModel: null,//还款模板
			isFund: false,//资金配置计划
			fundChannelEnum: [],//资金渠道枚举
			searchParams: null,//搜索参数
			fundChannelPage: {
				current: 1,
				pageSize: 10
			},
			fundChannel: null,//资金管理渠道信息
			bankEnum: [],//代付方枚举
			withhold: [],//代付方枚举
			productSeriesEnum: [],//产品系列枚举
			repayCountStyleEnum: [],//还款计算方式枚举
			cooperationStyleEnum: [],//合作方式枚举
			editorChannel: null,//编辑渠道
			channelId: null,//渠道信息
			fundsConfigInfo: [],//资金配置信息
			isDisable: false,//是否禁止配置资金
			editorFundsConfigData: null,//配置某个资金配置信息
			fundsPlanAmount: {},//资金计划总额
			isShowBank: false,//是否显示银行明细
			bank: [],
			dateDisable: false//是否可编辑日期
		}
	}
	componentDidMount() {
		this.getChannelEnum()
		this.getFundChannel()
		this.getPlanAmount()
	}
	//获取银行配置
	getBankConfig = (payChannelId) => {
		queryBankConfig({ payChannelId }).then(res => {
			if (res.resultCode === 1000) {
				let data = res.resultData
				const bank = data.map(item => {
					let obj = {
						bankName: item.bankName,
						code: item.bankCode,
						id: item.id
					}
					return obj
				})
				// console.log(bank)
				this.setState({
					bank
				})
			}
		})
	}
	//获取编辑时的代扣方 代付方
	getPayOrWithhold = (params, style) => {
		queryPayOrWithhold({ type: 10, ...params }).then(res => {
			if (res.resultCode === 1000) {
				if (style) {
					this.setState({
						bankEnum: res.resultData
					})
				} else {
					this.setState({
						withhold: res.resultData
					})
				}
			}
		})
	}
	//获取代付方支持银行枚举
	getSupportBankEnum = (params) => {
		let param = { type: 10 }
		if (params) {
			param = Object.assign({}, param, params)
		}
		queryAgentEnum({ ...param }).then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					bankEnum: res.resultData
				})
			}
		})
	}
	//获取代扣方支持银行枚举
	getWithholdEnum = (params) => {
		let param = { type: 20 }
		if (params) {
			param = Object.assign({}, param, params)
		}
		queryAgentEnum({ ...param }).then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					withhold: res.resultData
				})
			}
		})
	}
	//修改渠道状态
	changeChannelStatus = (id) => {
		channelStatus({ id }).then(res => {
			if (res.resultCode === 1000) {
				this.getFundChannel()
			}
		})
	}

	//获取资金渠道枚举
	getChannelEnum = () => {
		queryChannelEnum().then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					fundChannelEnum: res.resultData
				})
			} else {
				message.error(res.resultMessage)
			}
		})
	}
	//获取资金计划配置额度
	getPlanAmount = () => {
		queryPlanAmount().then(res => {
			if (res.resultCode === 1000) {
				if (res.resultData[0] === null) {
					this.setState({
						fundsPlanAmount: {}
					})
				} else {
					this.setState({
						fundsPlanAmount: res.resultData[0]
					})
				}
			}
		})
	}
	//获取资金管理渠道
	getFundChannel() {
		const {
			fundChannelPage,
			searchParams
		} = this.state
		const { current, pageSize } = fundChannelPage
		queryChannel({ currentPage: current, pageSize, searchParams }).then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					fundChannel: res.resultData,
					fundChannelPage: res.page
				})
			} else {
				message.error(res.resultMessage)
			}
		})
	}
	//获取还款计算方式枚举
	getRepayCountStyleEnum = () => {
		queryRepayCountStyleEnum().then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					repayCountStyleEnum: res.resultData
				})
			} else {
				message.error(res.resultMessage)
			}
		})
	}
	//获取资金配置
	getFundConfig = (fundsChannelId) => {
		queryFundConfig({ fundsChannelId }).then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					fundsConfigInfo: res.resultData
				})
			}
		})
	}
	//添加资金配置
	addFundsConfig = (params) => {
		let { channelId } = this.state
		let bizFundsPlanModel = JSON.stringify({
			...params,
			fundsChannelId: channelId.id
		})
		saveFundsPlan({ bizFundsPlanModel }).then(res => {
			if (res.resultCode === 1000) {
				message.success('资金计划添加成功')
				this.getFundConfig(channelId.id)
				this.props.form.resetFields()
			}
		})
	}
	//获取产品系列
	getProductSeries = () => {
		queryProductSeries().then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					productSeriesEnum: res.resultData
				})
			} else {
				message.error(res.resultMessage)
			}
		})
	}
	//查询资金渠道
	getFoundInfo = () => {
		const { form: { validateFields } } = this.props
		const { fundChannelPage } = this.state
		validateFields((errors, values) => {
			let { series, channel, status } = values
			let searchParams = JSON.stringify({
				lineName: series ? series : undefined,
				status: status ? status : undefined,
				id: channel ? channel : undefined
			})
			const pageData = Object.assign({}, fundChannelPage, { current: 1 })
			this.setState({ searchParams, fundChannelPage: pageData }, () => {
				this.getFundChannel()
			})
		})
	}
	//获取合作方式枚举
	getCooperationStyle = () => {
		queryCooperationStyle().then(res => {
			if (res.resultCode === 1000) {
				this.setState({
					cooperationStyleEnum: res.resultData
				})
			}
		})
	}
	//添加资金渠道
	addFundsChannel = (fundsChannel) => {
		const { fundChannelPage } = this.state
		const pageData = Object.assign({}, fundChannelPage, { current: 1 })
		saveFundsChannel({ fundsChannel }).then(res => {
			if (res.resultCode === 1000) {

				this.setState({
					isAdd: false,
					fundChannelPage: pageData
				}, () => {
					this.getFundChannel()
				})
				this.props.form.resetFields()
			}
		})
	}
	//编辑资金渠道
	editorChannelInfo = (fundsChannel) => {
		changeFundsChannel({ fundsChannel }).then(res => {
			if (res.resultCode === 1000) {
				this.getFundChannel()
				this.setState({
					isAdd: false,
					editorChannel: null
				})
				this.props.form.resetFields()
			}
		})
	}
	//optionList
	optionList = (arr) => {
		return arr.map(item => {
			return (<Option key={item.id} value={item.id}>
				{item.name}
			</Option>)
		})
	}
	//objOptionList
	objOptionList = (obj) => {
		return Object.keys(obj).map(item => {
			return (<Option key={item} value={item}>
				{obj[item]}
			</Option>)
		})
	}
	//是否显示modal
	showAddChannel = (isShow, action, record) => {
		const { form: { resetFields } } = this.props
		if (isShow) {
			resetFields()
			this.getRepayCountStyleEnum()
			this.getProductSeries()
			this.getCooperationStyle()
		}
		if (isShow && record) {
			this.getSupportBankEnum({ payId: record.payId })
			this.getWithholdEnum({ payId: record.withholdId })
		} else if (isShow) {
			this.getSupportBankEnum()
			this.getWithholdEnum()
		}
		if (!isShow) {
			this.setState({
				editorChannel: null,
				bankEnum: [],
				withhold: []
			})
			this.props.form.resetFields()
		}
		if (record) {

			this.setState({
				editorChannel: record
			})
		}
		this.setState({
			isAdd: isShow,
			action
		})
	}
	//添加或者编辑渠道
	addChannel = (status) => {

		const { form: { validateFieldsAndScroll } } = this.props
		const { editorChannel } = this.state
		if (editorChannel && editorChannel.status === 1) {
			message.error('资金渠道正在启用，无法编辑')
			return
		}
		validateFieldsAndScroll((errors, values) => {
			if (!errors || !errors.afterDay && !errors.beforeDay && !errors.channelName && !errors.workWay &&
				!errors.datepicker && !errors.endTime && !errors.isHoliday && !errors.maxAmount && !errors.minAmount
				&& !errors.noWorkdayWay && !errors.payId && !errors.repayWay && !errors.channelLevel && !errors.prodLineId
				&& !errors.closeDateWay && !errors.startTime && !errors.withholdId) {
				let {
					afterDay,//后几天
					beforeDay,//前几天
					channelName,//渠道名称
					workWay,//合作方式
					datepicker,//启用有效期
					endTime,//开放结束时间
					isHoliday,//节假日是否放款
					maxAmount,//单笔还款上限
					minAmount,//单笔还款下限
					noWorkdayWay,//非工作日结算方式
					payId,//代付方
					repayWay,//还款方式
					channelLevel,//渠道优先级
					prodLineId,//产品配置
					closeDateWay,//结算日期
					startTime,//开放开始时间
					withholdId,//代扣方

				} = values
				if (startTime.isAfter(endTime)) {
					message.info('开放的开始时间不能大于结束时间')
					return
				}
				if (maxAmount < minAmount) {
					message.error('最低单笔下限不能高于最高单笔上限')
					return
				}
				if (closeDateWay === 1 && !beforeDay || closeDateWay === 2 && !afterDay) {
					message.error('请填写结算日期的天数')
					return
				}
				let closeDateWayValue;
				if (closeDateWay === 1 && beforeDay) {
					closeDateWayValue = beforeDay
				} else if (closeDateWay === 2 && afterDay) {
					closeDateWayValue = afterDay
				}
				const enableStartTime = datepicker[0].format('YYYY-MM-DD')
				const enableEndTime = datepicker[1].format('YYYY-MM-DD')
				let fundsChannel = {
					channelName,
					startTime: startTime.format('HH:mm'),
					endTime: endTime.format('HH:mm'),
					isHoliday,
					prodLineId,
					minAmount,
					maxAmount,
					repayWay,
					withholdId,
					payId,
					channelLevel,
					workWay,
					noWorkdayWay,
					closeDateWay,
					closeDateWayValue: closeDateWayValue ? closeDateWayValue : undefined,
					status,
					enableEndTime,
					enableStartTime
				}
				if (!editorChannel) {
					this.addFundsChannel(JSON.stringify(fundsChannel))
				} else {
					fundsChannel.id = editorChannel.id
					this.editorChannelInfo(JSON.stringify(fundsChannel))
				}
			}

		})

	}
	//是否显示资金配置计划
	showFund = (isShow, record) => {
		if (isShow && record) {
			this.setState({
				channelId: record
			})
			this.getFundConfig(record.id)
			this.props.form.resetFields()
		} else {
			this.setState({
				fundsConfigInfo: [],
				channelId: null,
				isDisable: false,
				dateDisable: false
			})
			this.props.form.setFieldsValue({
				configStartTime: null,
				configEndTime: null,
				loadAmount: ''
			})
		}
		this.setState({
			isFund: isShow
		})
	}
	//f翻页
	changePage = (page) => {
		const { fundChannelPage } = this.state
		const pageData = Object.assign({}, fundChannelPage, { current: page.current })
		this.setState({
			fundChannelPage: pageData
		}, () => {
			this.getFundChannel()
		})
	}
	onPanelChange = (value, mode) => {
		// console.log(value, mode)
	}
	//覆盖日历内容
	dateFullCellRender = (time, fundsConfigData) => {
		let loanAmount;
		let today = moment().format('YYYY-MM-DD')
		let date = time.format('YYYY-MM-DD')
		fundsConfigData.find(item => {
			if (item.fundPlanDate == time.format('YYYY-MM-DD 00:00:00')) {
				loanAmount = item.loanAmount
			}
		})
		return (
			<div className={`${styles.dayWrap} ${date < today ? styles.grey : date == today ? styles.blue : styles.black}`}>
				<p className={styles.day}>{time.format('DD')}</p>
				<p className={styles.loadAmount}>{loanAmount}</p>
			</div>
		)
	}
	//点击日期事件
	chooseDate = (time, a, record) => {
		if (record.isHoliday === 2 && time.day() === 0 || record.isHoliday === 2 && time.day() === 6) {
			message.error('周末无法配置资金计划')
			return
		}
		let { form: { setFieldsValue } } = this.props
		let { fundsConfigInfo, isDisable } = this.state
		let date = time.format('YYYY-MM-DD 00:00:00')
		// console.log(moment().format('YYYY-MM-DD 00:00:00'))
		this.setState({
			dateDisable: true
		})
		if (date < moment().format('YYYY-MM-DD 00:00:00') && !isDisable) {
			this.setState({
				isDisable: true
			})
		} else if (date >= moment().format('YYYY-MM-DD 00:00:00') && isDisable) {
			this.setState({
				isDisable: false
			})
		}

		// let planInfo ;
		let planInfo = fundsConfigInfo.find(item => {
			return item.fundPlanDate == date
		})

		if (planInfo) {
			setFieldsValue({
				configStartTime: moment(planInfo.fundPlanDate, 'YYYY-MM-DD 00:00:00'),
				configEndTime: moment(planInfo.fundPlanDate, 'YYYY-MM-DD 00:00:00'),
				loadAmount: planInfo.loanAmount
			})
		} else {
			setFieldsValue({
				configStartTime: time,
				configEndTime: time,
				loadAmount: ''
			})
		}
		// console.log(planInfo)
	}
	//提交资金配置修改
	addConfigPlan = () => {
		let { form: { validateFields } } = this.props
		let { isDisable } = this.state
		if (isDisable) {
			message.error('该资金计划已过期,无法配置')
			return
		}
		validateFields((errors, values) => {
			if (!errors || !errors.configStartTime && !errors.configEndTime && !errors.loadAmount) {
				let { configStartTime, configEndTime, loadAmount } = values
				let bizFundsPlanModel = {
					startTime: moment(configStartTime).format('YYYY-MM-DD'),
					endTime: moment(configEndTime).format('YYYY-MM-DD'),
					loadAmount
				}
				this.addFundsConfig(bizFundsPlanModel)
			}
		})
	}
	//资金计划配置
	fundConfig = () => {
		const { isFund, fundsConfigInfo, isDisable, dateDisable, channelId } = this.state
		const { form: { getFieldDecorator } } = this.props
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		const disabledDate = (current) => {
			if (channelId && channelId.isHoliday === 2) {
				return moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD') || moment(current).day() === 0 || moment(current).day() === 6
			} else {
				return moment(current).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
			}
		}
		const choosePikerDate = (moment) => {
			if (channelId.isHoliday === 2 && moment.day() === 0 || channelId.isHoliday === 2 && moment.day() === 6) {
				message.error('周末无法配置资金')
				return
			}
		}
		return (
			<Modal
				visible={isFund}
				title='资金计划配置'
				onCancel={() => this.showFund(false)}
				onOk={this.addConfigPlan}
				width={800}
			>
				<div className={styles.calendarWrap}>
					{/* <div>
						{moment().format('YYYY/MM')}
					</div> */}
					<Calendar
						format='YYYY-MM-DD HH:mm:ss'
						fullscreen={false}
						dateFullCellRender={(moment) => this.dateFullCellRender(moment, fundsConfigInfo)}
						onSelect={(moment) => this.chooseDate(moment, fundsConfigInfo, channelId)}
					>
					</Calendar>
					<div style={{ marginTop: 20 }}>
						<Form>
							<FormItem
								style={{ marginBottom: 5 }}
								{...formItemLayout}
								label="开始日期">
								{getFieldDecorator('configStartTime', {
									initialValue: null,
									rules: [{
										required: true,
										message: "请选择开始日期"
									}]
								})(
									<DatePicker
										disabled={isDisable || dateDisable}
										disabledDate={disabledDate}
										onChange={choosePikerDate}
										format="YYYY-MM-DD">
									</DatePicker>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								style={{ marginBottom: 5 }}
								label="结束日期">
								{getFieldDecorator('configEndTime', {
									initialValue: null,
									rules: [{
										required: true,
										message: "请选择结束日期"
									}]
								})(
									<DatePicker
										onChange={choosePikerDate}
										disabledDate={disabledDate}
										disabled={isDisable || dateDisable} format="YYYY-MM-DD">
									</DatePicker>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label="计划放款金额">
								{getFieldDecorator('loadAmount', {
									initialValue: '',
									rules: [{
										required: true,
										message: "请输入计划放款金额"
									}]
								})(
									<Input disabled={isDisable} placeholder="请输入计划放款金额" style={{ width: 170 }} suffix={'元'} />
								)}
							</FormItem>
						</Form>
					</div>
				</div>
			</Modal>
		)
	}

	chooseProdLineId = (value) => {
		const { productSeriesEnum } = this.state
		if (!value) {
			this.props.form.setFieldsValue({ maxAmount: '' })
			this.props.form.setFieldsValue({ minAmount: '' })
			return
		}
		if (productSeriesEnum.length) {
			productSeriesEnum.map(item => {
				if (item.id == value) {
					this.props.form.setFieldsValue({ maxAmount: item.maxLoanAmount })
					this.props.form.setFieldsValue({ minAmount: item.minLoanAmount })
				}
			})
		}
	}
	//编辑渠道
	aditorChannel = () => {
		const { isAdd, fundChannel, action, productSeriesEnum, repayCountStyleEnum, cooperationStyleEnum, withhold, bankEnum, editorChannel } = this.state
		const { form: { getFieldDecorator } } = this.props
		if (editorChannel) {
			var isPay = bankEnum.find(item => {
				return item.id === editorChannel.payId
			})
			var iswithhold = withhold.find(item => {
				return item.id === editorChannel.withholdId
			})
		}
		const optionList = (productSeriesEnum) => {
			return productSeriesEnum.map(item => {
				return (<Option key={item.id} value={item.id}>{item.prodLineName}</Option>)
			})
		}
		return (
			<Modal
				title={`${action}渠道信息`}
				visible={isAdd}
				onCancel={() => this.showAddChannel(false, "")}
				footer={null}
				width={900}
			>
				<Form layout="inline">
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="资金渠道名称:">
									{getFieldDecorator('channelName', {
										initialValue: editorChannel ? editorChannel.channelName : '',
										len: 50,
										rules: [
											{
												required: true,
												message: '名称长度不能超过50'
											},
										],
									})(
										<Input disabled={editorChannel && editorChannel.status === 1} type="text" style={{ width: 225 }} placeholder="请输入资金渠道名称" />
									)}
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="还款计算方式:">
									{getFieldDecorator('repayWay', {
										initialValue: editorChannel ? editorChannel.repayWay : "",
										rules: [
											{
												required: true,
												message: '请选择还款方式',
											}
										]
									})(
										<Select disabled={editorChannel && editorChannel.status === 1} style={{ width: 240 }}>
											<Option value="">
												请选择与资方结算时的取位方式
                                        </Option>
											{this.optionList(repayCountStyleEnum)}
										</Select>
									)}
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={10} offset={1}>
							<div className={styles.colinner}>
								<FormItem label="开放时间:">
									<FormItem style={{ marginRight: 0 }}>
										{getFieldDecorator('startTime', {
											initialValue: editorChannel ? moment(editorChannel.startTime, 'HH:mm') : null,
											rules: [
												{
													required: true,
													message: '请选择开放时间',
												}
											]
										})(
											<TimePicker
												disabled={editorChannel && editorChannel.status === 1} format={'HH:mm'} style={{ width: 110 }} />
										)}
									</FormItem><span>-</span><FormItem>
										{getFieldDecorator('endTime', {
											initialValue: editorChannel ? moment(editorChannel.endTime, 'HH:mm') : null,
											rules: [
												{
													required: true,
													message: '请选择开放时间',
												}
											]
										})(
											<TimePicker
												disabled={editorChannel && editorChannel.status === 1} format={'HH:mm'} style={{ width: 110 }} />
										)}
									</FormItem>
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="启用有效期:">

									{getFieldDecorator('datepicker', {
										initialValue: editorChannel ? [moment(editorChannel.enableStartTime, 'YYYY-MM-DD'), moment(editorChannel.enableEndTime, 'YYYY-MM-DD')] : null,
										rules: [
											{
												required: true,
												message: '请选择启用有效期',
											}
										]
									})(
										<RangePicker disabled={editorChannel && editorChannel.status === 1} format={'YYYY-MM-DD'} style={{ width: 240 }}>
										</RangePicker>
									)}
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="节假日是否放款:">
									{getFieldDecorator('isHoliday', {
										initialValue: editorChannel ? editorChannel.isHoliday : '',
										rules: [
											{
												required: true,
												message: '请选择节假日是否放款',
											}
										]
									})(
										<Select disabled={editorChannel && editorChannel.status === 1} style={{ width: 225 }}>
											<Option value="">
												请选择节假日是否放款
                                            </Option>
											<Option value={1}>
												是
                                            </Option>
											<Option value={2}>
												否
                                            </Option>
										</Select>
									)}
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="合作方式:">
									{getFieldDecorator('workWay', {
										rules: [{
											required: true,
											message: "请选择合作方式"
										}],
										initialValue: editorChannel ? editorChannel.workWay : ""
									})(
										<Select disabled={editorChannel && editorChannel.status === 1} style={{ width: 240 }}>
											<Option value="">
												请选择合作方式
                                        </Option>
											{this.optionList(cooperationStyleEnum)}
										</Select>
									)}
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="结算日期">
									<div style={{ width: 225 }}>
										{getFieldDecorator('closeDateWay', {
											initialValue: editorChannel ? editorChannel.closeDateWay : '',
											rules: [
												{
													required: true,
													message: '请选择结算日期',
												}
											]
										})(
											<RadioGroup disabled={editorChannel && editorChannel.status === 1}>
												<Radio value={1}>账单日前
												<FormItem>
														{getFieldDecorator('beforeDay', {
															initialValue: editorChannel && editorChannel.closeDateWay === 1 ? editorChannel.closeDateWayValue : '',
															rules: [{
																pattern: /^[0-9]{0,}$/,
																message: "请输入正确的天数"
															}]
														})(
															<Input disabled={editorChannel && editorChannel.status === 1} type="number" style={{ width: 145 }} suffix="天" />
														)}
													</FormItem>
												</Radio>
												<Radio value={2}>账单日后
												<FormItem>
														{getFieldDecorator('afterDay', {
															initialValue: editorChannel ? editorChannel.closeDateWay === 2 ? editorChannel.closeDateWayValue : '' : '',
															rules: [{
																pattern: /^[0-9]{0,}$/,
																message: "请输入正确的天数"
															}]
														})(
															<Input disabled={editorChannel && editorChannel.status === 1} type="number" style={{ width: 145 }} suffix="天" />
														)}
													</FormItem>
												</Radio>
												<Radio value={3}>结算当天</Radio>
											</RadioGroup>
										)}
									</div>
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="非工作日结算方式">
									<div style={{ width: 225 }}>
										{getFieldDecorator('noWorkdayWay', {
											initialValue: editorChannel ? editorChannel.noWorkdayWay : '',
											rules: [{
												required: true,
												message: "请选择非工作日结算方式"
											}]
										})(

											<RadioGroup disabled={editorChannel && editorChannel.status === 1}>
												<Radio value={1}>顺延至下一个工作日</Radio>
												<Radio value={2}>提前至上一个工作日</Radio>
											</RadioGroup>
										)}
									</div>
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="代付方">
									<div className={styles.atherPay}>
										{
											getFieldDecorator('payId', {
												initialValue: editorChannel ? isPay ? editorChannel.payId : '' : '',
												rules: [
													{
														required: true,
														message: '请选择代付方',
													}
												]
											})(
												<Select disabled={editorChannel && editorChannel.status === 1} style={{ width: 160 }}>
													<Option value=''>请选择代付方</Option>
													{this.optionList(bankEnum)}
												</Select>
											)
										}
									</div>
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="代扣方">
									<div className={styles.atherPay}>
										{
											getFieldDecorator('withholdId', {
												initialValue: editorChannel ? iswithhold ? editorChannel.withholdId : '' : '',
												rules: [
													{
														required: true,
														message: '请选择代扣方',
													}
												]
											})(
												<Select disabled={editorChannel && editorChannel.status === 1} style={{ width: 160 }}>
													<Option value=''>请选择代扣方</Option>
													{this.optionList(withhold)}
												</Select>
											)
										}
									</div>
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="产品配置:">
									{getFieldDecorator('prodLineId', {
										initialValue: editorChannel ? editorChannel.prodLineId : '',
										rules: [
											{
												required: true,
												message: '请选择产品配置',
											}
										]
									})(
										<Select onSelect={this.chooseProdLineId} disabled={editorChannel && editorChannel.status === 1} style={{ width: 225 }}>
											<Option value=''>请选择产品配置</Option>
											{optionList(productSeriesEnum)}
										</Select>
									)}
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="单笔金额下限:">
									{getFieldDecorator('minAmount', {
										initialValue: editorChannel ? editorChannel.minAmount : '',
										rules: [{
											pattern: /^[0-9]{1,10}$/,
											required: true,
											message: "请输入单笔金额下限"
										}]
									})(
										<Input disabled={editorChannel && editorChannel.status === 1} maxLength={10} style={{ width: 225 }} placeholder="请输入单笔金额下限" suffix="元" />
									)}
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="单笔金额上限:">
									{getFieldDecorator('maxAmount', {
										initialValue: editorChannel ? editorChannel.maxAmount : '',
										rules: [{
											pattern: /^[0-9]{1,10}$/,
											required: true,
											message: "请输入单笔金额上限"
										}]
									})(
										<Input disabled={editorChannel && editorChannel.status === 1} maxLength={10} style={{ width: 225 }} placeholder="请输入单笔金额上限" suffix="元" />
									)}
								</FormItem>
							</div>
						</Col>
					</Row>
					{/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="放款对账模板:">
									<div className={styles.uploadwrap}>
										<Upload

										>
											<Button>上传</Button>
										</Upload>
									</div>
								</FormItem>
							</div>
						</Col>
						<Col md={12}>
							<div className={styles.colinner}>
								<FormItem label="还款对账模板:">
									<div className={styles.uploadwrap}>
										<Upload>
											<Button>上传</Button>
										</Upload>
									</div>
								</FormItem>
							</div>
						</Col>
					</Row> */}
					<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
						<Col md={11}>
							<div className={styles.colinner}>
								<FormItem label="渠道优先级:">
									<div className={styles.uploadwrap}>
										{getFieldDecorator('channelLevel', {
											initialValue: editorChannel ? editorChannel.channelLevel : '',
											rules: [
												{
													pattern: /^[0-9]{1,2}$/,
													required: true,
													message: "请输入正确的渠道优先级"
												}
											]
										})(
											<Input disabled={editorChannel && editorChannel.status === 1} maxLength={2} style={{ width: 225 }} />
										)}
										<div className={styles.hint}>*数字越大，优先级越低</div>
									</div>
								</FormItem>
							</div>
						</Col>
					</Row>
					<Row type="flex" justify='center'>
						<Col>
							<Button disabled={editorChannel && editorChannel.status === 1} onClick={() => this.addChannel(2)} style={{ marginRight: 10 }} type="primary" htmlType="submit">保存</Button>
						</Col>
						<Col>
							<Button disabled={editorChannel && editorChannel.status === 1} onClick={() => this.addChannel(1)} style={{ marginRight: 10 }} type="primary">保存并启用</Button>
						</Col>
						<Col type="primary">
							<Button onClick={() => this.showAddChannel(false, "")}>取消</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		)
	}
	//枚举Option
	optionEnum = (obj) => {
		return Object.keys(obj).map(item => {
			return (
				<Option key={item} value={item}>{obj[item]}</Option>
			)
		})
	}
	renderAdvancedForm = () => {
		const { form: { getFieldDecorator } } = this.props
		const { fundChannelEnum } = this.state
		return (
			<Form layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={6} sm={24}>
						<FormItem label="产品系列">
							{getFieldDecorator('series')(
								<Input placeholder="请输入产品系列名称" style={{ width: 150 }} />
							)}
						</FormItem>
					</Col>
					<Col md={6} sm={24}>
						<FormItem label="资金渠道">
							{getFieldDecorator('channel', {
								initialValue: ""
							})(
								<Select style={{ width: 150 }}>
									<Option value="">
										请选择
                                    </Option>
									{this.optionList(fundChannelEnum)}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col md={6} sm={24}>
						<FormItem label="开启状态">
							{getFieldDecorator('status', {
								initialValue: ""
							})(
								<Select style={{ width: 150 }}>
									<Option value="">
										请选择
                                    </Option>
									<Option value={1}>启用</Option>
									<Option value={2}>停用</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col md={6} sm={24}>
						<Button onClick={this.getFoundInfo} type="primary" style={{ marginRight: 10 }}>查询</Button>
						<Button type="primary" onClick={() => this.showAddChannel(true, '新增')}>新增渠道</Button>
					</Col>
				</Row>
				{/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={11}>
						<div className={styles.colinner}>
							<FormItem label="产品配置:">
								{getFieldDecorator('productConfig', {
									initialValue: "0"
								})(
									<Select style={{ width: 240 }}>
										<Option value="0">
											请选择支持的产品系列
                                        </Option>
									</Select>
								)}
							</FormItem>
						</div>
					</Col>
				</Row> */}
			</Form>
		)
	}
	//是否显示银行信息
	showBank = (isShow, record, type) => {
		if (isShow && type === 'pay') {
			this.getBankConfig(record.payId)
			this.setState({
				isShowBank: isShow
			})
		} else if (isShow && type === 'withhold') {
			this.getBankConfig(record.withholdId)
			this.setState({
				isShowBank: isShow
			})
		}
		else {
			this.setState({
				isShowBank: isShow,
				bank: []
			})
		}
	}
	//银行信息列表
	bankModal = () => {
		const { isShowBank, bank } = this.state
		const columns = [
			{
				dataIndex: "key",
				title: "序号",
				render: (text, record, index) => index + 1
			}, {
				dataIndex: 'bankName',
				title: "银行名称"
			}
		]
		const dataSource = bank
		return (<Modal
			visible={isShowBank}
			onCancel={() => this.showBank(false)}
			footer={null}
			destroyOnClose
		>
			<Table
				columns={columns}
				dataSource={dataSource}
				rowKey={record => record.id}
				pagination={false}

			>

			</Table>
		</Modal>)
	}
	render() {
		const { fundChannel, fundsPlanAmount, fundChannelPage } = this.state
		const columns = [
			{
				dataIndex: "key",
				title: "序号",
				render: (text, record, index) => index + 1,
				width: 50,
				align: 'center'
			},
			{
				dataIndex: "channelName",
				title: "渠道名称",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "openTime",
				title: "开放时间",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "isHolidayStr",
				title: "是否支持节假日",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "lineName",
				title: "产品系列",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "loanAmount",
				title: "今日资金计划",
				render: text => <a style={{ textDecorationLine: 'none' }}>{text}</a>,
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "pushedPlan",
				title: "已推送计划",
				render: text => <a style={{ textDecorationLine: 'none' }}>{text}</a>,
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "minAmount",
				title: "最低单笔下限",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "maxAmount",
				title: "最高单笔上限",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "repayWayStr",
				title: "还款计算方式",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "enableTimeStr",
				title: "启用有效期",
				width: 105,
				align: 'center'
			},
			{
				dataIndex: "withholdName",
				title: "代扣方",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "withholdNumber",
				title: "代扣支持银行",
				render: (text, record) => {
					return text ? <a onClick={() => this.showBank(true, record, 'withhold')}>{text}</a> : '-'
				},
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "payName",
				title: "代付方",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "payNumber",
				title: "代付支持银行",
				width: 120,
				render: (text, record) => {
					return text ? <a onClick={() => this.showBank(true, record, 'pay')}>{text}</a> : '-'
				},
				align: 'center'
			},
			{
				dataIndex: "channelLevel",
				title: "渠道优先级",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "statusStr",
				title: "状态",
				width: 120,
				align: 'center'
			},
			{
				dataIndex: "opration",
				render: (text, record) => {
					const id = record.id
					const status = record.status
					return (
						<div className={styles.oprationbtn}>
							<span onClick={() => this.changeChannelStatus(id)}>{status === 1 ? '停用' : '启用'}</span>
							<span onClick={() => this.showAddChannel(true, '编辑', record)}>编辑</span>
							<span onClick={() => this.showFund(true, record)}>资金配置</span>
						</div>
					)
				},
				title: "操作",
				width: 180
			},
		]
		return (
			<PageHeaderLayout title="资金渠道管理">
				<Card>
					<div style={{ height: 100 }}>
						{
							this.renderAdvancedForm()
						}
					</div>
					<div>
						资金渠道明细
					</div>
					<div>
						<Table
							columns={columns}
							dataSource={fundChannel}
							scroll={{ x: 2280 }}
							rowKey={(record) => record.id}
							bordered
							pagination={fundChannelPage}
							onChange={this.changePage}
						></Table>
						<div>
							今日总资金计划<a style={{ textDecorationLine: 'none' }}>{fundsPlanAmount.loanTotleAmount ? fundsPlanAmount.loanTotleAmount : 0}</a>元，已推送计划<a style={{ textDecorationLine: 'none' }}>{fundsPlanAmount.planTotleAmount ? fundsPlanAmount.planTotleAmount : 0}</a>元
						</div>
					</div>
				</Card>
				{this.aditorChannel()}
				{
					this.fundConfig()
				}
				{this.bankModal()}
			</PageHeaderLayout>
		)
	}
}