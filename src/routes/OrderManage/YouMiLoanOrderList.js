
/*
 * 组件名称：有米放款订单
 * 功能：列表的查询，
 * model: order_borrow
 * api: ordermanage
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin, Alert} from 'antd';
import StandardTable from '../../components/StandardTable';
import TableDetail from '../../components/OrderManage/LoanDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BorrowDetailList from '../../components/OrderManage/YouMiBorrowDetailList';

import {  actionLoanOrder } from '../../services/ordermanage';
import {  auditorList } from '../../services/commonManage';
import request from '../../utils/request';

import {

	queryExport,loanDataAmount


} from '../../services/ordermanage.js';


import styles from './BorrowOrderList.less';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  loanorder: state.loanorder,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    offline_record: {},
    fail_record:{},
    offline_model_visible: false,
    again_model_visible: false,
    showFail:false,
	todayAmount:0,
	loanTotalAmount:0,
    selectedRows: [],
    auditorData:[],
    isAgain: '',
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'loanorder/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
    loanDataAmount({searchParams:this.state.formValues.searchParams}).then(res => {
    	if(res.resultCode == 1000){
    		this.setState({
    			todayAmount:res.resultData.todayAmount,
    			loanTotalAmount:res.resultData.loanTotalAmount
    		});
    	}
    });
    auditorList().then(res => {
    	if(res.resultCode == 1000){
    		this.setState({
    			auditorData:res.resultData
    		});
    	}
    })
  }
  exportData = (e) => {
	    e.preventDefault();
	    const { dispatch, form } = this.props;
	    form.validateFields((err, fieldsValue) => {
	      if (err) return;
	      const values = {
	        ...fieldsValue
	      };
	      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
	    	        name:values.realName?values.realName.trim():undefined,
	    	        idNo:values.idNo?values.idNo.trim():undefined,
	    	        // checkChannel:values.checkChannel||undefined,
	    	        // isAgain: values.isAgain || undefined,
	    	        statusStr:values.statusStr||undefined };
		      if(values.borrowTime && values.borrowTime.length != 0){
		          jsonParams.loanStartTime = values.borrowTime[0].format('YYYY-MM-DD 00:00:00').toString();
		          jsonParams.loanEndTime = values.borrowTime[1].format('YYYY-MM-DD 23:59:59').toString()
		        }

	      this.setState({
	        formValues:{
	          currentPage: 1,
	          pageSize: 10,
	          searchParams:JSON.stringify(jsonParams)
	        },
	      });
	      queryExport({

	          searchParams:JSON.stringify(jsonParams)
	        	      });
	    });
	  }
  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues:{
        ...params
      }
    });

    dispatch({
      type: 'loanorder/fetch',
      payload: params,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  /*手动放款*/
  handleModalOk(){
	  const { dispatch } = this.props;
	  let that = this;
	  dispatch({
          type:'loanorder/loan',
          payload: this.state.offline_record.orderId,
          callback: (data)=>{
            if(data.resultCode === 1000) {
	        	that.setState({
	        		offline_model_visible:false
	        	});
              message.success('操作成功',3,() => {
            	  dispatch({
            		  type:'loanorder/fetch',
            		  payload:formValues
            	  })
              })
            }else{
              Modal.error({
                title:'操作失败'
              })
            }
          }
       })
  }
  /*再次放款*/
  handleAgainModalOk(){
	  const { dispatch } = this.props;
	  let that = this;
	  dispatch({
          type:'loanorder/againfetch',
          payload: this.state.offline_record.orderId,
          callback: (data)=>{
            if(data.resultCode === 1000) {
            	that.setState({
            		again_model_visible:false
	        	});
            	 message.success("操作成功",3,() => {
               	  dispatch({
               		  type:'loanorder/fetch',
               		  payload:formValues
               	  })
                 })

            }else{
              Modal.error({
                title:'操作失败'
              })
            }
          }
       })
  }
  /*TODO: 弹框的显示与隐藏 - 查看订单放款详情 - 传递数据[orderId , 事件类型 ]*/
  handleModalVisible = (flag = false,record,typeName) => {
    const { dispatch } = this.props;
    if(flag && record && typeName){
      if( typeName == 'detail'){
        dispatch({
          type: 'loanorder/detailfetch',
          payload: record
        })
      }else if( typeName == 'again'){
        this.showMoadl(record);
      }else if( typeName == 'loan'){
    	this.showLoanMoadl(record);
      }else if(typeName == 'fail'){
        this.showFailModal(record)
      }
    }else{
      dispatch({
        type: 'loanorder/changeModal',
        payload: flag
      })
    }
  }

  /* 发放回收款 -  单独显示弹框  */
  showLoanMoadl(record){
    const { dispatch } = this.props;
    const { formValues } = this.state;

    if (record) {
        this.setState({
          offline_record: record,
          offline_model_visible: true
        });
      } else {
        this.setState({
          offline_model_visible: false
        });
      }
  }
  //确认失败弹框
  showFailModal(record){
    if(record){
      this.setState({
        fail_record:record,
        showFail:true
      })
    }else{
      this.setState({
        showFail:false
      })
    }
  }
  //确认失败请求接口
  failNet(orderId){
    return request(`/modules/manage/biz/order/confirmPayFail.htm?orderId=${orderId}`)
  }

  //确认放款失败请求服务器
  failOk(){
    let orderId = this.state.fail_record.orderId;
    this.failNet(orderId).then(rep=>{
      if(rep.resultCode === 1000){
        message.success('操作成功')
        const { dispatch } = this.props;
        dispatch({
          type: 'loanorder/fetch',
          payload: {
            pageSize: 10,
            currentPage: 1,
            searchParams: ''
          }
    });
      }else{
        message.error(rep.resultMessage);
      }
      this.setState({
        showFail:false
      })
    }).catch(err=>{
      this.setState({
        showFail:false
      })
    })
  }

  /* 再次支付 -  单独显示弹框  */
  showMoadl(record){
    const { dispatch } = this.props;
    const { formValues } = this.state;
    if (record) {
        this.setState({
          offline_record: record,
          again_model_visible: true
        });
      } else {
        this.setState({
          again_model_visible: false
        });
      }
  }


  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }


  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = { phone:values.phone?values.phone.trim():undefined,
        name:values.realName?values.realName.trim():undefined,
        idNo:values.idNo?values.idNo.trim():undefined,
        // checkChannel:values.checkChannel||undefined,
        // isAgain: values.isAgain || undefined,
        statusStr:values.statusStr||undefined };
      if(values.borrowTime && values.borrowTime.length != 0){
        jsonParams.loanStartTime = values.borrowTime[0].format('YYYY-MM-DD 00:00:00').toString();
        jsonParams.loanEndTime = values.borrowTime[1].format('YYYY-MM-DD 23:59:59').toString()
      }
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'loanorder/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });

      loanDataAmount({searchParams:this.state.formValues.searchParams}).then(res => {
      	if(res.resultCode == 1000){
      		this.setState({
      			todayAmount:res.resultData.todayAmount,
      			loanTotalAmount:res.resultData.loanTotalAmount
      		});
      	}
      });

    });
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
  }

  /*TODO: 生成条件查询表单 ,参数是：无 */
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone',{
                rules:[
                  { pattern:/^1[3|4|5|6|7|8|9]\d{9}$/,
                    len:11,
                    message:'请输入有效的手机号'}
                ],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入"  maxLength='11' style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('realName')(
                <Input placeholder="请输入" style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="放款时间">
              {getFieldDecorator('borrowTime')(
                <RangePicker style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={7} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idNo',{
                rules:[
                  { pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                    max:18,
                    min:15,
                    message:'请输入有效的身份证号'}
                ],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入"  maxLength='18' style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>

          {/* <Col md={6} sm={24}>
          <FormItem label="是否复租">
            {getFieldDecorator('isAgain')(
              <Select style={{width: 100}} placeholder="请选择" onChange={this.queryIsAgain.bind(this)}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}

          </FormItem>
        </Col> */}

          <Col md={7} sm={24}>
            <FormItem label="放款状态">
              {getFieldDecorator('statusStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  <Option value="待放款">待放款</Option>
                  <Option value="放款中">放款中</Option>
                  <Option value="放款成功">放款成功</Option>
                  <Option value="放款失败">放款失败</Option>
                  <Option value="确认放款失败">确认放款失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col md={7} sm={24}>
          <FormItem label="审核渠道">
            {getFieldDecorator('checkChannel')(
              <Select placeholder="请选择" style={{ width: '80%'}}>
              {
            	  this.state.auditorData.map(v => {
            		  return (<Option key={v.id} key={v.code}>{v.name}</Option>);
            	  })
              }
              </Select>
            )}
          </FormItem>
        </Col>  */}

        <Col md={10} sm={24}>
           <span style={{ float: 'center', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
              <Button  onClick={this.handleFormReset}>重置</Button>
              <Button style={{marginLeft:16}} type={'primary '} onClick={this.exportData} >导出为EXCEL</Button>
            </span>
        </Col>
        </Row>
      </Form>
    );
  }

  queryIsAgain(is_again) {
	    this.setState({
	      isAgain: is_again
	    });
	  }


  render() {

	  const formItemLayout = {
		      labelCol: {
		        xs: {span: 23},
		        sm: {span: 23},
		      },
		      wrapperCol: {
		        xs: {span: 22},
		        sm: {span: 22},
		      },
		    };
    const { loanorder: { loading, data, modal, loanorderdetail} ,  dispatch } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
      },
      {
        title: '身份证号',
        dataIndex: 'idNo',
      },
      {
        title: '订单金额',
        dataIndex: 'principal',
        // render:(v,r) => {
        // 	if(v == null){
        // 		return r.principal -r.auditFee;
        // 	}else{
        // 		return r.loanValue;
        // 	}
        // }
      },
      {
        title: '贷款期限(天)',
        dataIndex: 'peroidValue',
      },
      {
        title: '放款时间',
        dataIndex: 'createTime',
      },
      {
        title: '状态',
        dataIndex: 'statusStr',
      },
      // {
      //   title: '设备估值',
      //   dataIndex: 'principal',
      // },

      // {
      //     title: '审核渠道',
      //     dataIndex: 'checkChannel',
      // },
      // {
      //     title: '注册渠道',
      //     dataIndex: 'registerChannel',
      // },
      {
        title: '放款记录',
        dataIndex: 'operate1',
        render: (text, record) => {
          let dataOrderId = record.orderId;
          return (
            <div>
              <a key="detail" onClick={() => this.handleModalVisible(true, dataOrderId, 'detail')}>详情</a>
            </div>
          )},
      },
      // {
      //     title: '是否复租',
      //     dataIndex: 'isAgain',
      //     render: (text, record, index) => {
      //       return text == 1 ? '是' : '否';
      //     }
      //   },
      {
        title: '操作',
        dataIndex: 'operate2',
        render: (text,record) => {
          let dataOrderId = record.orderId;
          return (
            <div>
              {/* { record.statusStr === "放款失败"? <a onClick={() => this.handleModalVisible(true, record, 'again')}>再次支付</a>:""} */}
              {
                record.statusStr === '放款失败' ?
                <div>
                    {/* <a onClick={() => this.handleModalVisible(true, record, 'loan')}>手动放款</a> */}
                    <a onClick={() => this.handleModalVisible(true, record, 'again')}>再次支付</a>
                    &nbsp;
                    <a onClick={() => this.handleModalVisible(true, record, 'fail')}>确认失败</a>
                </div>
                :
                null
              }
              &nbsp;
              { record.statusStr === "待放款"?
              <div>
                    <a onClick={() => this.handleModalVisible(true, record, 'loan')}>手动放款</a>
                    {/* &nbsp;
                    <a onClick={() => this.handleModalVisible(true, record, 'fail')}>确认失败</a> */}
                </div>
                :
                null
              }
            </div>
          )},
      },
    ];
    return (
      <PageHeaderLayout title="放款订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <StandardTable
              columns = { columns }
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>

          <div>
          	<span>今日放款成功总额：{this.state.todayAmount||0}元</span>&nbsp;&nbsp;
          	<span>累计放款成功总额：{this.state.loanTotalAmount||0}元</span>
          </div>

        </Card>
        <Modal
          title="放款详情"
          visible={modal}
          onCancel={() => this.handleModalVisible()}
          width={900}
          footer = {[
            <Button key="back" type="primary" onClick={()=>this.handleModalVisible()}>返回</Button>
          ]}
        >
          <TableDetail data={loanorderdetail} pagination={false}/>
        </Modal>
          <Modal
          title="手动放款"
          visible={this.state.offline_model_visible}
          onOk={() => this.handleModalOk()}
          onCancel={() => this.showLoanMoadl()}
          width={500}
          >
          <Form layout={'inline'}
		          style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
		      <FormItem {...formItemLayout} label={'放款金额'}>
		        <Input disabled={true} value={this.state.offline_record.loanValue || (this.state.offline_record.principal - this.state.offline_record.auditFee) }/>
		      </FormItem>
		      <FormItem {...formItemLayout} label={'收款人姓名'}>
		        <Input disabled={true} value={this.state.offline_record.name}/>
		      </FormItem>
		      <FormItem {...formItemLayout} label={'收款银行'}>
		        <Input disabled={true} value={this.state.offline_record.bank}/>
		      </FormItem>
		      <FormItem {...formItemLayout} label={'银行卡号'}>
		        <Input disabled={true} value={this.state.offline_record.cardNo}/>
		      </FormItem>

         </Form>

         </Modal>
         <Modal title="确认失败"
                visible={this.state.showFail}
                onOk={()=>this.failOk()}
                onCancel={()=>this.showFailModal()}
        >
          <p>是否确认放款失败？</p>
        </Modal>
         <Modal
         title="再次放款"
        	 visible={this.state.again_model_visible}
         onOk={() => this.handleAgainModalOk()}
         onCancel={() => this.showMoadl()}
         width={500}
         >
         <Form layout={'inline'}
         style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10}}>
         <FormItem {...formItemLayout} label={'放款金额'}>
         <Input disabled={true} value={this.state.offline_record.loanValue}/>
         </FormItem>
         <FormItem {...formItemLayout} label={'收款人姓名'}>
         <Input disabled={true} value={this.state.offline_record.name}/>
         </FormItem>
         <FormItem {...formItemLayout} label={'收款银行'}>
         <Input disabled={true} value={this.state.offline_record.bank}/>
         </FormItem>
         <FormItem {...formItemLayout} label={'银行卡号'}>
         <Input disabled={true} value={this.state.offline_record.cardNo}/>
         </FormItem>

         </Form>

         </Modal>

      </PageHeaderLayout>
    );
  }
}
