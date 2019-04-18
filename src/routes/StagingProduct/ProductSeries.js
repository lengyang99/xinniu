import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Tabs,
  Checkbox,
  Tooltip, Table
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ProductDetail from '../../components/StagingProduct/ProductDetail';
import SeriesDetail from '../../components/StagingProduct/ProductSeriesDetails';
// import AddProductSeries from '../../components/StagingProduct/addProductSeries';
import ProductTable from '../../components/StagingProduct/ProductTable';

import styles from './ProductList.less';

import {
  querySaveProd,
  queryUpdateProd,
  queryUpdateState,
  queryPeriodValueList

} from '../../services/stagingproduct';
import CostDetails from '../../components/StagingProduct/CostDetails';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj)
  .map(key => obj[key])
  .join(',');
const confirm = Modal.confirm;

@connect(state => ({
  productlist: state.productlist,
}))
@Form.create()
export default class ProductSeries extends PureComponent {
  state = {
    productDetailsVisible: false,
    costDetailsVisible: false,
    modalType: '新增',
    addModalVisible: false,
    seriesDetailsVisible: false,
    modal: false,

    recordData: '',
    activeKey: '0',
    dataDetail: {},
    interestData: [], //利息
    payData: [], //支付信审费
    accoutData: [], //账户管理费
    penaltyData: [], //罚息,
    feeType: '1', //1是元2是%

    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },


  };

  //
  getList() {
    const { dispatch } = this.props;
    // this.getPeriodValueList();
    // dispatch({
    //   type: 'productlist/fetch',
    //   payload: {
    //     // pageSize: 10,
    //     // currentPage: 1,
    //     // searchParams: ''
    //   }
    // });
  }

  componentDidMount() {
    this.getList();
  }

  //去产品系列详情页
  toSeriesDetails = (id) => {
    this.props.history.push('/staging/product-series/details?code=' + id);
  };

  /**去新增系列页面**/
  toAddSeries() {

    this.props.history.push('/staging/product-series/add');
  }

  /**去编辑系列页面**/
  toEditSeries(code) {
    console.log(this.props.history.location.search);
    this.props.history.push('/staging/product-series/edit?code='+code);
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
  };

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
        ...params
      }
    });

    dispatch({
      type: 'productlist/fetch',
      payload: {},
    });
  };

  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue
      };
      console.log(values);
      var jsonParams = {
        code: values.code ? values.code.trim() : undefined,
        interestType: values.interestType ? values.interestType : undefined,
        marketingType: values.marketingType ? values.marketingType : undefined,
        repayType: values.repayType ? values.repayType : undefined,
        name: values.name ? values.name.trim() : undefined,
        status: values.status ? values.status : undefined,
        productType: values.productType ? values.productType : undefined,
      };
      // this.setState({
      //   formValues: {
      //     currentPage: 1,
      //     pageSize: 10,
      //     searchParams: JSON.stringify(jsonParams)
      //   },
      // });
      // dispatch({
      //   type: 'productlist/fetch',
      //   payload: {
      //     // currentPage: 1,
      //     // pageSize: 10,
      //     id: jsonParams.id
      //   },
      // });
    });
  };

  productDetails = () => {
    this.setState({
      productDetailsVisible: !this.state.productDetailsVisible
      // formValues: {
      //   currentPage: 1,
      //   pageSize: 10,
      //   searchParams: JSON.stringify(jsonParams)
      // },
    });
  };

  /*TODO: 生成条件查询表单 ,参数是：无 */
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="产品类型">
              {getFieldDecorator('productType', {})(
                <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="产品系列代码">
              {getFieldDecorator('code', {})(
                <Input placeholder="请输入" style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="产品系列名称">
              {getFieldDecorator('name', {})(
                <Input placeholder="请输入" style={{ width: '80%' }}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="营销类型">
              {getFieldDecorator('marketingType', {})(
                <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
                  <Option value={'全部1'}>全部</Option>
                  <Option value={'1'}>分期</Option>
                  <Option value={'2'}>全款</Option>
                </Select>
              )}
            </FormItem>
          </Col><Col md={6} sm={24}>
          <FormItem label="还款方式">
            {getFieldDecorator('repayType', {})(
              <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
                <Option value={'全部1'}>全部</Option>
                <Option value={'1'}>分期</Option>
                <Option value={'2'}>全款</Option>
              </Select>
            )}
          </FormItem>
        </Col><Col md={6} sm={24}>
          <FormItem label="计息方式">
            {getFieldDecorator('interestType', {})(
              <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
                <Option value={'全部1'}>全部</Option>
                <Option value={'1'}>分期</Option>
                <Option value={'2'}>全款</Option>
              </Select>
            )}
          </FormItem>
        </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', {})(
                <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
                  <Option value={'全部1'}>已发布</Option>
                  <Option value={'1'}>已生效</Option>
                  <Option value={'2'}>已失效</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={10} sm={24}>
             <span style={{ float: 'center', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>

                <Button onClick={this.handleFormReset} style={{ marginRight: 16 }}>重置</Button>

               <Button onClick={() => this.toAddSeries()}>新增</Button>
               <Button onClick={() => this.toEditSeries('aaa')}>编辑</Button>
               <Button onClick={() => this.toSeriesDetails('111')}>产品系列详情</Button>
               <Button onClick={() => this.showCostDetails()}>费用详情</Button>

              </span>
          </Col>
        </Row>
      </Form>
    );
  }


  //发布/撤销发布按钮
  showConfirm = () => {
    confirm({
      content: '发布后，该产品系列将对外使用，确认发布？',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  //提交按钮
  showSubmit = () => {
    let me = this;
    confirm({
      content: '信息填写无误,确认新建产品系列？',
      onOk() {

      },
      onCancel() {
        me.cancel();
      },
    });
  };

  //新建弹窗重置按钮
  showReset = () => {
    let add = this.refs.add;
    let me = this;
    confirm({
      content: '重置后,将清空已编辑好的资料,确认重置？',
      onOk() {
        add.resetFields();
      },
      onCancel() {
        me.cancel();
      },
    });
  };

  //取消编辑
  cancel = () => {
    let me = this;
    confirm({
      content: '确认放弃此次编辑？',
      onOk() {
        // add.resetFields()
        me.setState({
          addModalVisible: false
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };



  //产品详情展示
  showSeriesDetails = () => {
    this.setState({
      seriesDetailsVisible: !this.state.seriesDetailsVisible
    });
  };

  //费用详情展示
  showCostDetails = () => {
    this.setState({
      costDetailsVisible: !this.state.costDetailsVisible
    });
  };
  //费用详情展示
  toCostDetails = (r) => {
    this.setState({
      costDetailsVisible: true
    });
  };

  //产品修改对话框展示
  showModalEditProduct = () => {

  };

  render() {
    const { productlist: { loading, data }, dispatch } = this.props;
    const { activeKey, modal, recordData, dataDetail, interestData, payData, accoutData, penaltyData, feeType } = this.state;
    var { period } = recordData;
    const columns = [
      {
        title: '产品系列代码',
        dataIndex: 'id',
        render: (text, record) => {
          return (
            <a onClick={() => this.toSeriesDetails(record)}>
              {text}
            </a>
          );
        }
      }, {
        title: '产品系列名称',
        dataIndex: 'name',
        width: '8%'
      }, {
        title: '产品类型',
        dataIndex: 'amount'
      }, {
        title: '营销类型',
        dataIndex: 'peroidValue',
      },
      {
        title: '期限方式',
        dataIndex: 'peroidUnit',
        render: (text) => {
          return (
            <div>
              {text}
            </div>
          );
        }
      },
      {
        title: '还款方式',
        dataIndex: 'goodsFee'
      }, {
        title: '计息方式',
        dataIndex: 'creditGrade'
      },
      {
        title: '生效日期',
        dataIndex: 'dayRate',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          );
        }
      },

      {
        title: '失效日期',
        dataIndex: 'penaltyRate',
        render: (text, record, index) => {
          var data = +text;
          return (
            data.toFixed(4)
          );
        }
      },
      {
        title: '产品数量',
        dataIndex: 'penaltyFee',
        render: (text, record) => {
          return (
            <a onClick={() => this.toSeriesDetails(record)}>
              {text}
            </a>
          );
        }
      },
      {
        title: '状态',
        dataIndex: 'dailyRentDi'
      }, {
        title: '最后操作时间',
        dataIndex: 'dailyRentDis1'
      }, {
        title: '最后操作人员',
        dataIndex: 'dailyRentDis'
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record, index) => {
          var data = record;
          return (
            <div>
              <a onClick={() => this.toEditSeries()}>
                编辑
              </a>
              {/* &nbsp;&nbsp;&nbsp;&nbsp;
          <a style={{color: 'red', marginLeft: '10px'}}
          onClick={() => {
       	   this.switchConfigAlive(text, record, index)
          }}>
         {record.state === 1 && '关闭'}{record.state === 0 && '开启'}
       </a> */}
            </div>
          );
        }
      },
      {
        title: '备注',
        dataIndex: 'dailyRentD'
      }
    ];

    return (
      <PageHeaderLayout title="产品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <StandardTable
              columns={columns}
              loading={loading}
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
