/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：系统管理 - 数据库参数列表
 * 功能：列表的查询，
 * model: limitlist
 * api: api
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Table, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin } from 'antd';
import DatabaseDetail from '../../components/SystemManage/DatabaseDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SystemDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  systemdict: state.systemdict,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalType: '新增',
    selectedRows: [],
    singleData: {},
    formValues: {
      pageSize: 10,
      currentPage: 1,
      searchParams: '',
    },
    formValuestab: {
      pageSize: 5,
      currentPage: 1,
      searchParams: '',
    },
    btnloading: false,
    modal: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemdict/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: '',
      },
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
        ...formValues,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    dispatch({
      type: 'systemdict/fetch',
      payload: params,
    });
  }

  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChangeTab = (pagination) => {
    const { dispatch } = this.props;
    const { formValuestab } = this.state;
    const params = {
      ...formValuestab,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues: {
        ...formValuestab,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    dispatch({
      type: 'systemdict/childfetch',
      payload: params,
      callback: (result) => {
        this.setState({
          loadingtab: false,
          datatab: result.resultData || [],
          paginationtab: result.page || false,
        });
      },
    });
  }

  /* TODO: 弹框的显示与隐藏 - 修改数据库的配置信息 - 传递数据[数据，事件类型] */
  handleModalVisible = (flag = false, record = '', type) => {
    const { dispatch } = this.props;
    const me = this;
    if (type === 'add' || type === 'addParent') {
      this.setState({
        modal: flag,
        modalTypecode: type,
        parentId: record,
        modalType: type === 'add' ? '新增子参数' : '新增父级参数',
      });
    } else if (type === 'delete' || type === 'deleteParent') {
      this.setState({
        parentId: type === 'delete'?record.parentId:record.id,
      });
      const urldelet = type === 'delete' ? 'systemdict/deletechild' : 'systemdict/deleteparent';
      const text = `当前数据 -> id:${record.id} | typeCode：${record.typeCode} | typeName：${record.typeName} | sort：${record.sort}`;
      const itemtext = `当前数据 -> id：${record.id} | itemCode：${record.itemCode} | itemValue：${record.itemValue}`;
      const content = type === 'delete' ? itemtext : text;
      Modal.confirm({
        title: '您确定要删除当前数据?',
        content,
        onOk() {
          dispatch({
            type: urldelet,
            payload: { Id: record.id },
            callback: (result) => {
              if (result.resultCode === 1000) {
                if (type === 'delete') {
                  me.submitChild();
                } else {
                  me.submitParent();
                }
              }
              me.setState({
                btnloading: false,
              });
            },
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (type === 'change' || type === 'changeParent') {
      this.setState({
        modal: flag,
        singleData: record,
        modalTypecode: type,
        parentId: type === 'change'?record.parentId:record.id,
        modalType: type === 'change' ? '修改子参数' : '修改父级参数',
      });
    } else {
      this.setState({
        modal: flag,
        modalType: '',
        singleData: {},
      });
    }
  }

  /** 该函数：辅助函数 - 监听子组件的触发事件 - 表单提交事件 * */
  handleOk(params) {
    const { dispatch } = this.props;
    this.setState({
      btnloading: true,
    });
    dispatch({
      type: params.url,
      payload: params.data,
      callback: (result) => {
        if (result.resultCode === 1000) {
          if (params.childform) {
            this.submitChild();
          } else {
            this.submitParent();
          }
          this.setState({
            btnloading: false,
            modal: false,
          });
        } else {
          this.setState({
            btnloading: false,
          });
        }
      },
    });
  }
  handleRefresh = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'systemdict/refreshcookie',
      callback:(result)=>{
         if(result.resultCode === 1000){
           Modal.success({
             title:'操作成功'
           })
         }else{
           Modal.error({
             title:'操作失败'
           })
         }
      }
    })
  }

  submitParent() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    Modal.success({
      title: '操作成功！',
      onOk() {
        dispatch({
          type: 'systemdict/fetch',
          payload: formValues,
        });
      },
    });
  }

  submitChild() {
    const { dispatch } = this.props;
    const { parentId } = this.state;

    const me = this;
    Modal.success({
      title: '操作成功！',
      onOk() {
        dispatch({
          type: 'systemdict/childfetch',
          payload: {
            searchParams: JSON.stringify({ parentId }),
            currentPage: 1,
            pageSize: 5,
          },
          callback: (result) => {
            me.setState({
              loadingtab: false,
              datatab: result.resultData || [],
              paginationtab: result.page || false,
            });
          },
        });
      },
    });
  }

  showExpand=(expanded, record) => {
    const { dispatch } = this.props;
    this.setState({
      loadingtab: true,
      formValuestab: {
        searchParams: JSON.stringify({ parentId: record.id }),
        currentPage: 1,
        pageSize: 5,
      },
    });
    if (expanded) {
      dispatch({
        type: 'systemdict/childfetch',
        payload: {
          searchParams: JSON.stringify({ parentId: record.id }),
          currentPage: 1,
          pageSize: 5,
        },
        callback: (result) => {
          this.setState({
            loadingtab: false,
            datatab: result.resultData || [],
            paginationtab: result.page || false,
          });
        },
      });
    }
  }

  expandedRowRender = (record) => {
    const { loadingtab, datatab, paginationtab } = this.state;
    const columns = [
      { title: 'id', dataIndex: 'id', key: 'id' },
      { title: 'itemCode', dataIndex: 'itemCode', key: 'itemCode' },
      { title: 'itemValue', dataIndex: 'itemValue', key: 'itemValue' },
      { title: 'parentId', dataIndex: 'parentId', key: 'parentId' },
      { title: 'state', dataIndex: 'state', key: 'state' },
      {
        title: '操作',
        dataIndex: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className="table-operation">
            <a onClick={() => this.handleModalVisible(true, record, 'change')}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleModalVisible(true, record, 'delete')}>删除</a>
          </span>
        ),
      },
    ];
    return (
      <Table
        style={{ background: '#fff' }}
        bordered
        title={() => '子参数列表'}
        showHeader
        columns={columns}
        loading={loadingtab}
        dataSource={datatab}
        pagination={paginationtab}
        onChange={this.handleStandardTableChangeTab}
      />
    );
  }

  render() {
    const { systemdict: { loading, data }, dispatch } = this.props;
    const { modalType, btnloading, modal, modalTypecode, singleData, parentId } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'typeCode',
        dataIndex: 'typeCode',
      },
      {
        title: 'typeName',
        dataIndex: 'typeName',
      },
      {
        title: 'sort',
        dataIndex: 'sort',
      },
      {
        title: 'remark',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => {
          const dataUser = record.id;
          const disabled = record.status === 1;
          return (
            <div>
              <a onClick={() => this.handleModalVisible(true, record, 'changeParent')}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleModalVisible(true, record, 'deleteParent')} >删除</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleModalVisible(true, dataUser, 'add')} >新增子参数</a>
            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="数据库参数列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: 16 }}
                onClick={() => this.handleModalVisible(true, '', 'addParent')}
              ><Icon type="plus" />新增
              </Button>
              <Button
                type="primary"
                ghost
                style={{ margin: 16 }}
                onClick={this.handleRefresh}
              ><Icon type="reload" />刷新缓存
              </Button>
            </div>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              loading={loading}
              expandedRowRender={this.expandedRowRender}
              dataSource={data.list}
              pagination={data.pagination}
              onExpand={this.showExpand}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title={`数据库参数--${modalType}`}
          visible={modal}
          style={{ height: '200px' }}
          onCancel={() => this.handleModalVisible()}
          footer={[]}
        >
          {
            modal && (<DatabaseDetail
              modalType={modalTypecode}
              data={singleData}
              btnloading={btnloading}
              parentId={parentId}
              handleOk={params => this.handleOk(params)}
              handleCancel={() => this.handleModalVisible()}
            />)
          }

        </Modal>
      </PageHeaderLayout>
    );
  }
}
