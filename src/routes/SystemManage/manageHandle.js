/*
 * 组件名称：管理员操作表
 * 功能：列表的查询，
 * model: manageHandle
 * api: manageHandle
 *
 *  */
import React, {PureComponent} from 'react';
import {
  Table,
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
  Spin
} from 'antd';
import TableDetail from '../../components/OrderManage/RepayDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import {
	queryManageHandle,

 

} from '../../services/manageHandle';
import {
	queryUserAllList,

 

} from '../../services/systemmanage';
import moment from 'moment';

import styles from './LeaseList.less';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@Form.create()
export default class TableList extends PureComponent {
  state = {
    data: [],
    pg: {},
    userList:[],
    table_loading: false,
 
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: ''
    },
    
  };

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10});

  }


  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChange = (pagination) => {
    const {formValues} = this.state;
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
    queryManageHandle(params).then(res => {
      this.setState({
        data: res.resultData,
        pg: res.page
      });
    });
    queryUserAllList().then(res => {
    	this.setState({
    		userList: res.resultData
    	});
    });
  }

  /* TODO:条件查询 - 条件查询事件  - 内部状态管理：表单数据[ formValues ] */
  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = {
    	handleType: values.handleType ? values.handleType.trim() : undefined,
    	userId: values.userId||undefined,
        
      };
      if (values.time && values.time.length != 0) {
        jsonParams.startTime = values.time[0].format('YYYY-MM-DD').toString();
        jsonParams.endTime = values.time[1].format('YYYY-MM-DD').toString()
      }
      
      this.setState({
        formValues: {
          currentPage: 1,
          pageSize: 10,
          searchParams: JSON.stringify(jsonParams)
        },
      }, () => {
        this.handleStandardTableChange({current: 1, pageSize: 10});
      });

    });
  }

  /* TODO:条件查询 - 清空查询条件  - 内部状态管理：初始化表单数据[ formValues ] */
  handleFormReset = () => {
    const {form, dispatch} = this.props;
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
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch.bind(this)} layout="inline">
        
           
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={10} sm={24}>
            <FormItem label="时间">
              {getFieldDecorator('time')(
                <RangePicker style={{width: '80%'}}/>
              )}
            </FormItem>
          </Col>
          
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={7} sm={24}>
            <FormItem label="操作类型">
              {getFieldDecorator('handleType')(
                <Select placeholder="请选择" allowClear={true} style={{width: '80%'}}>
                <Option value="导出">导出</Option>
                <Option value="添加">添加</Option>
                <Option value="修改">修改</Option>
                <Option value="删除">删除</Option>
                <Option value="登录">登录</Option>
                <Option value="登出">登出</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
        
          <FormItem label="管理员">
          {getFieldDecorator('userId')(
        		  <Select placeholder="请选择" allowClear={true} style={{ width: '80%' }}>
	              	{
	            		this.state.userList.map(v => {
	            			return <Option key={v.id} value={v.id}>{v.userName}</Option>
	            		})
	            	}
	              </Select>
          )}
        </FormItem>            
          </Col>
          <Col md={10} sm={24}>
             <span style={{float: 'center', marginBottom: 24}}>
                <Button type="primary" htmlType="submit" style={{marginRight: 16}}>查询</Button>
                <Button onClick={this.handleFormReset} style={{marginRight: 16}}>重置</Button>

              </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 12},
        sm: {span: 12},
      },
      wrapperCol: {
        xs: {span: 12},
        sm: {span: 12},
      },
    };
    const columns = [
      {
        title: '时间',
        dataIndex: 'handleTime',
      },
      {
        title: '管理员',
        dataIndex: 'name',
      },
      {
        title: '操作类型',
        dataIndex: 'handleType',
      },
      {
        title: '接口名称',
        dataIndex: 'interfaceName',
      },
      {
        title: '详情',
        dataIndex: 'parameters',
      },
      {
        title: '结果',
        dataIndex: 'result',
      }
    ];
    return (
      <PageHeaderLayout title="管理员操作表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <Table
              loading={this.state.table_loading}
              bordered
              rowKey={record => record.id}
              dataSource={this.state.data}
              columns={columns}
              pagination={this.state.pg}
              onChange={this.handleStandardTableChange.bind(this)}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
