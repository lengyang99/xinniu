/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：意见反馈 - 信息列表
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
  opiononsave: state.opiononsave,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalType:'change',
    selectedRows: [],
    formValues: {},
    btnloading:false
  };

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'opiononsave/menufetch',
    });
    dispatch({
      type:'opiononsave/systemnav'
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opiononsave/fetch',
      payload: {
        pageSize: 10,
        currentPage: 1,
        searchParams:JSON.stringify({type:2})
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
      searchParams:JSON.stringify({type:2})
    };
    this.setState({
      formValues:{
        ...formValues,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        searchParams:JSON.stringify({type:2})
      }
    });
    dispatch({
      type: 'opiononsave/fetch',
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
          type: 'opiononsave/changeModal',
          payload: true,
        })
      }else if(type === 'change'){
        dispatch({
          type:'opiononsave/singlefetch',
          payload: record,
        })
      }
    }else{
      this.setState({
        modalType:'',
        record:'',
      });
      dispatch({
        type: 'opiononsave/changeModal',
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
        type: 'opiononsave/addUserInfo',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'',
              onOk() {
                dispatch({
                  type: 'systemusers/fetch',
                  payload: {
                    pageSize: 10,
                    currentPage: 1,
                    
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
        type:'opiononsave/updateUserInfo',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'',
              onOk() {
                dispatch({
                  type: 'systemusers/fetch',
                  payload: {
                    pageSize: 10,
                    currentPage: 1,
                    
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
    const { opiononsave: { loading , data , modal, singleData, menulist, navlist} ,  dispatch } = this.props;
    const { modalType, btnloading, record } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: '',
		key:'',
        render: (text, record, index) => {
		 return (
           <div>
             {index + 1}
           </div>
         )
        },
       width: '100px'
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        width: '150px'
      },
      {
        title: '内容',
        dataIndex: 'opinion',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '210px'
      },
     
      
    ];
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
               
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
          title={modalType === 'assignrole'?'':modalType === 'add'?'':''}
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
