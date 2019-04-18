/*
 * TODO:组件名称：组件额度管理
 * 功能：列表的查询，
 * model: limitlist
 * api: limit
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, DatePicker, Modal, Spin, Tabs } from 'antd';
import StandardTable from '../../components/StandardTable';
import LimitListDetail from '../../components/LimitManage/LimitListDetail';
import Detail from '../../components/UserInfoList/Detail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './LimitManageList.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

@connect(state => ({
  limitlist: state.limitlist,
  userlist: state.userlist,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {
      currentPage: 1,
      pageSize: 10,
      searchParams: '',
    },
    recorduser: {},
    modalVisible: false,
    activeKey: '0',
    userlist: [],
    limitdetail: [],
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'limitlist/limitstatusfetch',
    });
    dispatch({
      type: 'limitlist/limittypefetch',
    });
    dispatch({
      type: 'userlist/channelNav',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'limitlist/fetch',
      payload: formValues,
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
      formValues: {
        ...params,
      },
    });
    dispatch({
      type: 'limitlist/fetch',
      payload: params,
    });
  }

  /* TODO: 弹框的显示与隐藏 - 查看用户详情 - 传递数据[userId] */
  handleModalVisible = (flag = false, record = {}) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: flag,
      recorduser: record,
    });
    if (flag) {
      dispatch({
        type: 'limitlist/userLimitDetailfetch',
        payload: {
          creditInfoId: record.id,
          pageSize: 10,
          currentPage: 1,
        },
        callback: (result) => {
          if (result.resultCode === 1000) {
            this.setState({
              limitdetail: result.resultData,
            });
          }
        },
      });
    }
  }

  /** 额度状态的释放和冻结
   * * */
  setLimitStatus = (record) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      creditInfoId: record.id,
      creditStatus: record.creditStatus == 1 ? 3 : 1,
    };
    const titleTxt = record.creditStatus == 1 ? '冻结' : '释放';

    Modal.confirm({
      title: `确定要${titleTxt}额度？`,
      onOk() {
        dispatch({
          type: 'limitlist/actionUserLimitfetch',
          payload: params,
          callback: (result) => {
            if (result.resultCode === 1000) {
              Modal.success({
                title: '操作成功',
                onOk: () => {
                  dispatch({
                    type: 'limitlist/fetch',
                    payload: formValues,
                  });
                },
              });
            } else {
              Modal.error({
                title: '操作失败',
              });
            }
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /** 查看详情- Tab切换事件
 * * */
  onSwitch = (key) => {
    const { dispatch } = this.props;
    const { recorduser } = this.state;

    if (key === 0) {
      dispatch({
        type: 'limitlist/userLimitDetailfetch',
        payload: {
          creditInfoId: recorduser.id,
          pageSize: 10,
          currentPage: 1,
        },
        callback: (result) => {
          if (result.resultCode === 1000) {
            this.setState({
              limitdetail: result.resultData,
            });
          }
        },
      });
    } else {
      dispatch({
        type: 'userlist/userDetailfetch',
        payload: recorduser.userId,
        callback: (result) => {
          if (result.resultCode === 1000) {
            this.setState({
              limitdetail: result.resultData,
            });
          }
        },
      });
    }
  }


  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {
        pageSize: 10,
        currentPage: 1,
        searchParams: '',
      },
    });
  }

  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const jsonParams = {
        phone: values.phone ? values.phone.trim() : undefined,
        idNo: values.idNo ? values.idNo.trim() : undefined,
        creditStatusStr: values.creditStatusStr || undefined,
        typeStr: values.typeStr || undefined,
        channelIdStr: values.channelIdStr || undefined };
      if (values.createTime && values.createTime.length != 0) {
        jsonParams.createTimeStart = values.createTime[0].format('YYYY-MM-DD').toString();
        jsonParams.createTimeEnd = values.createTime[1].format('YYYY-MM-DD').toString();
      }
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams),
        },
      });
      dispatch({
        type: 'limitlist/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams),
        },
      });
    });
  }


  /* TODO: 生成条件查询表单 ,参数是：渠道枚举数据 ,额度状态枚举，额度产品枚举 */
  renderAdvancedForm(statuslist = [], typeslist = [], channellist = []) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone', {
                rules: [
                  { pattern: /^1[3|4|5|7|8]\d{9}$/,
                    len: 11,
                    message: '请输入有效的手机号' },
                ],
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入" maxLength={11} style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idNo', {
                rules: [
                  { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                    max: 18,
                    min: 15,
                    message: '请输入有效的身份证号' },
                ],
                validateTrigger: 'onBlur',
              })(
                <Input placeholder="请输入" maxLength={18} style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createTime')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="额度状态">
              {getFieldDecorator('creditStatusStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  {statuslist}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="额度类型">
              {getFieldDecorator('typeStr')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                  {typeslist}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="渠道来源">
              {getFieldDecorator('channelIdStr')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {channellist}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
              <Button onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>

      </Form>
    );
  }


  render() {
    const { userlist: { channellist, userinfo }, limitlist: { data, loading, limitstatus, limittype }, dispatch } = this.props;
    const { modalVisible, activeKey, selectedRows, limitdetail } = this.state;
    const limitstatusOption = limitstatus ? limitstatus.map(item => <Option key={item}>{item}</Option>) : [];
    const limittypeOption = limittype ? limittype.map(item => <Option key={item}>{item}</Option>) : [];
    const channellistOption = channellist ? channellist.map(item => <Option key={item}>{item}</Option>) : [];
    const columns = [{
      title: '额度id',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    }, {
      title: '客户姓名',
      dataIndex: 'realName',
      width: 90,
    }, {
      title: '渠道来源',
      dataIndex: 'fromChannel',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    }, {
      title: '身份证号',
      dataIndex: 'idNo',
      width: 170,
    }, {
      title: '额度类型',
      dataIndex: 'productTypeStr',
      width: 90,
    }, {
      title: '额度',
      dataIndex: 'total',
      width: 80,
    }, {
      title: '已用额度',
      dataIndex: 'used',
      width: 90,
    }, {
      title: '生成时间',
      dataIndex: 'createTime',
    }, {
      title: '激活时间',
      dataIndex: 'enableTime',
    }, {
      title: '变更时间',
      dataIndex: 'updateTime',
    }, {
      title: '状态',
      dataIndex: 'creditStatusStr',
      width: 90,
    }, {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (value, record) => {
        switch (record.creditStatusStr) {
          case '已激活': return (<div><a onClick={() => this.handleModalVisible(true, record)}>查看</a><span className="ant-divider" />
            <a onClick={() => this.setLimitStatus(record)} >冻结</a>
                              </div>);
          case '已冻结': return (<div> <a onClick={() => this.handleModalVisible(true, record)}>查看</a><span className="ant-divider" />
            <a onClick={() => this.setLimitStatus(record)} >解冻</a>
                              </div>);
          case '未激活': return <a onClick={() => this.handleModalVisible(true, record)}>查看</a>;
          default: return '-';
        }
      },
    }];

    return (
      <PageHeaderLayout title="额度管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm(limitstatusOption, limittypeOption, channellistOption)}
            </div>
            <StandardTable
              columns={columns}
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="额度查看"
          visible={modalVisible}
          width={1200}
          bodyStyle={{ height: '640px', overflowY: 'auto' }}
          footer={[<Button type="primary" onClick={() => this.handleModalVisible()}>返回</Button>]}
          onCancel={() => this.handleModalVisible()}
        >
          { modalVisible && <Tabs defaultActiveKey={activeKey} onChange={this.onSwitch}>
            <TabPane tab="额度详情" key="0">
              <LimitListDetail data={limitdetail} />
            </TabPane>
            <TabPane tab="基本信息" key="1">
              {
                userinfo.manageUserDetailModel || userinfo.clUserAuth || userinfo.userEmerContacts ? <Detail {...userinfo} /> : <Spin size="small" style={{ marginLeft: 8 }} />
              }
            </TabPane>
                            </Tabs>
          }
        </Modal>
      </PageHeaderLayout>
    );
  }
}
