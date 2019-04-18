/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：系统管理 - 用户列表
 * 功能：列表的查询，
 * model: limitlist
 * api: api
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';
import StandardTable from '../../components/StandardTable';
import UserDetail from '../../components/SystemManage/UserDetail';
import RoleDetail from '../../components/SystemManage/RoleDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SystemDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  systemuser: state.systemuser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalType:'change',
    selectedRows: [],
    showChannel:false,
    formValues: {},
    btnloading:false
  };

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'systemuser/menufetch',
    });
    dispatch({
      type:'systemuser/systemnav'
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemuser/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams: ''
      }
    });
  }

  /* TODO: 表格的分页处理 - 以及内部状态管理：表单数据[ formValues ] */
  handleStandardTableChange = (pagination ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues:{
        ...formValues,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      }
    });
    dispatch({
      type: 'systemuser/fetch',
      payload: params,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 修改用户的基本信息 - 传递数据[用户数据，事件类型]*/
  handleModalVisible = (flag = false,record='',type) => {
    const { dispatch } = this.props;
    if(flag){
      this.setState({
        modalType:type,
        record:record,
      });
      if(type === 'add' || type === 'assignrole'){
        dispatch({
          type: 'systemuser/changeModal',
          payload: true,
        })
      }else if(type === 'change'){
        dispatch({
          type:'systemuser/singlefetch',
          payload: record,
          callback:(s) => {
        	  this.setState({
        		  showChannel:s
        	  });
          }
        })
      }
    }else{
      this.setState({
        modalType:'',
        record:'',
      });
      dispatch({
        type: 'systemuser/changeModal',
        payload:flag
      })
    }
  }

  /*该函数：辅助函数 - 监听子组件的触发事件 - 表单提交事件*/
  handleOk(type,params){
    const { dispatch } = this.props;
    this.setState({
      btnloading: true
    })
    if(type == 'add'){
      dispatch({
        type: 'systemuser/addUserInfo',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'添加用户成功！',
              onOk() {
                dispatch({
                  type: 'systemuser/fetch',
                  payload: {
                    pageSize: 10,
                    currentPage: 1,
                    searchParams: ''
                  }
                });
              },
            });
          }
          this.setState({
            btnloading: false
          })
        }
      })
    }else{
      dispatch({
        type:'systemuser/updateUserInfo',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'用户修改成功！',
              onOk() {
                dispatch({
                  type: 'systemuser/fetch',
                  payload: {
                    pageSize: 10,
                    currentPage: 1,
                    searchParams: ''
                  }
                });
              },
            });
          }
          this.setState({
            btnloading: false
          })
        }
      })
    }
  }

  render() {
    const { systemuser: { loading , data , modal, singleData, menulist,channellist, navlist} ,  dispatch } = this.props;
    const { modalType, btnloading, record, showChannel} = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '登录名',
        dataIndex: 'userName',
      },
      {
        title: '员工状态',
        dataIndex: 'statusStr',
      },
      {
        title: '角色',
        dataIndex: 'roleNidStr',
      },
      {
        title: '操作',
        render: (text,record) => {
          var dataUser = record.id;
          let disabled = record.status === 1;
          return (
            <div>
              <a  disabled={disabled} onClick={() => this.handleModalVisible(true,dataUser,'change')}>编辑</a>
              <Divider/>
              <a onClick={()=> this.handleModalVisible(true,dataUser,'assignrole') } disabled={true}>分配权限[暂未开发]</a>
            </div>
          )},
      },
    ];
    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
               <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}
                       onClick={() => this.handleModalVisible(true,'','add')}><Icon type="plus"/>新增</Button>
            </div>
            <StandardTable
              columns = { columns }
              loading={ loading }
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <Modal
          title={modalType === 'assignrole'?'用户权限分配':modalType === 'add'?'新增用户':'修改用户信息'}
          visible={modal}
          style={{ height:'200px'}}
          onCancel={()=>this.handleModalVisible()}
          footer = {modalType === 'assignrole'?[
            <Button type="primary" key="SubmitBtn">确定</Button>,
            <Button  key="CallbackBtn">返回</Button>
          ]:[]}
        >
          {
            modal && (modalType === 'assignrole'?<RoleDetail navlist={navlist} record={record}/>:<UserDetail modalType = { modalType }
            menu = { menulist }
            parent = {this}
            showChannel = {showChannel}
            channel={ channellist}
            data={ modalType === 'add' ? '': singleData }
            btnloading = {btnloading}
            handleOk={ (type,params)=>this.handleOk(type,params) }
            handleCancel={()=>this.handleModalVisible()}/>)
          }

        </Modal>
      </PageHeaderLayout>
    );
  }
}
