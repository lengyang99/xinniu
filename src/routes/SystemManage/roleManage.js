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
import RoleDetail from '../../components/SystemManage/RoleEditDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SystemDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
	systemrole : state.systemrole,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    record:{},
    modalType:'change',
    selectedRows: [],
    formValues: {},
    btnloading:false,
    roleName:'',
    checkedKeys:[]
  };

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'systemrole/menufetch',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemrole/userRolefetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        btnloading:false
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
      type: 'systemrole/userRolefetch',
      payload: params,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 修改角色 - 传递数据[数据，事件类型]*/
  handleModalVisible = (flag = false,record='',type) => {
    const { dispatch } = this.props;
    if(flag){
      this.setState({
        modalType:type,
        record:record,
      });
      if(type === 'assignroleChange' || type === 'assignrole'){
    	this.setState({
    		record:record,
    		roleName:record?record.name:''
    	},() => {
    		dispatch({
    	          type: 'systemrole/systemnav',
    	          payload: record?record.id:null,
    	        })
    	});
      }else if(type === 'assignroleChange'){
        dispatch({
          type:'systemrole/userRolefetch',
          payload: record,
        })
      }
    }else{
      this.setState({
        modalType:'',
        record:'',
      });
      dispatch({
        type: 'systemrole/changeModal',
        payload:flag
      })
    }
  }
  
  handleChange(e){
	    this.setState({roleName: e.target.value});
	  }
  
  /*该函数：辅助函数 - 监听子组件的触发事件 - 表单提交事件*/
  
  handleOk(type){
    const { dispatch } = this.props;
    let {record,roleName,checkedKeys} = this.state;
    if(roleName == ""){
    	message.info("请填写角色名称!");
    	return;
    }
    this.setState({
      btnloading: true
    })
   dispatch({
        type: type == "assignroleChange"?'systemrole/editRolefetch':'systemrole/addRolefetch',
        payload: {
        	id:record.id,
        	name:roleName,
        	menuIds:checkedKeys.join(',')
        },
        callback:(result)=>{
          this.setState({
                btnloading: false
              })
          if(result.resultCode === 1000){
            message.success(type == "assignroleChange"?'编辑角色成功':'新增角色成功！',3,() => {
            	dispatch({
            		type: 'systemrole/userRolefetch',
            		payload: {
            			pageSize: 10,
            			currentPage: 1,
            			searchParams: ''
            		}
            	});
            });
          }else{
        	message.error("操作失败！"+result.resultMessage);
          }
        }
      })
  }

  render() {
    const { systemrole: { loading , data , modal, singleData, menulist, navlist} ,  dispatch } = this.props;
    const { modalType, btnloading, record, roleName } = this.state;
    const columns = [
      {
        title: '角色',
        dataIndex: 'name',
      },
      {
        title: '用户数',
        dataIndex: 'count',
      },
      {
        title: '操作',
        render: (text,record) => {
          var dataUser = record.id;
          let disabled = record.status === 1;
          return (
        	record.id!=1&&(
            <div>
              <a onClick={()=> this.handleModalVisible(true,record,'assignroleChange') } disabled={false}>编辑</a>
            </div>)
          )},
      },
    ];
    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
               <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}
                       onClick={() => this.handleModalVisible(true,'','assignrole')}><Icon type="plus"/>新增角色</Button>
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
          title={modalType === 'assignrole'?'新增角色':'编辑角色'}
          visible={modal}
          style={{ height:'200px'}}
          onCancel={()=>this.handleModalVisible()}
          footer = {[
            <Button loading={btnloading} type="primary" key="SubmitBtn" onClick={ ()=>this.handleOk(modalType) }>确定</Button>,
            <Button  key="CallbackBtn" onClick={()=>this.handleModalVisible()}>返回</Button>
          ]}
        >
        <label> 角色：</label><Input placeholder=" " maxLength={"20"} value={roleName} onChange={this.handleChange.bind(this)} style={{width:'200px'}} />
          {
            modal && (<RoleDetail navlist={navlist} record={record} 
              modalType = { modalType }
              menu = { menulist }
              onCheck = {(ids) => {
            	  this.setState({
            		  btnloading:true,
            		  checkedKeys:ids
            	  },() => {
            		  this.setState({
            			  btnloading:false
            		  });
            	  })
              } }
          />)
          }

        </Modal>
      </PageHeaderLayout>
    );
  }
}
