/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：定时任务
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
      type: 'systemuser/timefetch',
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
      type: 'systemuser/timefetch',
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

  
  
   /* TODO:  表格启动按钮 --  */
  start = (orderId) => {
	var { dispatch } = this.props;
	var _this=this;
	Modal.confirm({
	  title: '启动任务',
	  content: '确定启动此定时任务吗？',
	  onOk() {
		dispatch({
			type:'borroworder/authPass',
			payload:{orderId:orderId,tz:_this}
		})
	  },
	  onCancel() {
	  }
	});
  }
  
  
  
  
  /* TODO:  表格暂停按钮 --  */
  suspend = (orderId) => {
	    var { dispatch } = this.props;
		var _this=this;
        Modal.confirm({
          title: '暂停任务',
          content: `确定暂停此定时任务吗？`,
          onOk() {
			dispatch({
				type:'borroworder/authUnPass',
				payload:{orderId:orderId,tz:_this}
			})
          },
          onCancel() {
          }
        });
  }
  
  
  
  /* TODO:  表格立即执行按钮 --  */
  execute = (id) => {
	    var { dispatch } = this.props;
		var _this=this;
        Modal.confirm({
          title: '执行任务',
          content: `确定立即执行此定时任务吗？`,
          onOk() {
        	  dispatch({
	  				type:'systemuser/executeFetch',
	  				payload:id,
	  				callback:(res) => {
	  					if(res.resultCode === 1000){
	  						message.success("操作成功!");
	  					}else{
	  						message.error(res.resultMessage);
	  					}
	  				}
	  			})
          },
          onCancel() {
          }
        });
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
                  type: 'systemuser/timefetch',
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
                  type: 'systemuser/timefetch',
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
    const { systemuser: { loading , data , modal, singleData, menulist, navlist} ,  dispatch } = this.props;
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
      }
      },
      {
        title: '任务名称',
        dataIndex: 'name',
      },
      {
        title: '编码',
        dataIndex: 'code',
      },
      {
        title: 'Cron表达式',
        dataIndex: 'cycle',
      },
      {
        title: 'Bean',
        dataIndex: 'className',
      },
      {
        title: '状态',
        dataIndex: 'state',
      },
      {
        title: '操作',
        render: (text,record) => {
        	let id = record.id;
            return (
              <div>
              	<a onClick={() => this.start(id)} style={{ marginRight: 16 }}>启动</a>
              	<a onClick={() => this.suspend(id)} style={{ marginRight: 16 }}>暂停</a>
              	<a onClick={() => this.execute(id)} style={{ marginRight: 16 }}>立即执行</a>                
                  <a onClick={() => this.handleModalVisible(true,record,'change')}>编辑</a>
              </div>
            )},
      },
    ];
    return (
      <PageHeaderLayout title="定时任务">
        <Card bordered={false}>
          <div className={styles.tableList}>
            
            <StandardTable
              columns = { columns }
              loading={ loading }
              data={data}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
