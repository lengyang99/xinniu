/**
 * Created by Administrator on 2017/12/11 0011.
 */
/*
 * 组件名称：机型管理 - 机型列表
 * 功能：列表的查询，
 * model: limitlist
 * api: api
 *
 *  */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Spin} from 'antd';
import StandardTable from '../../components/StandardTable';
import UserDetail from '../../components/ModelManagement/UserDetail';
import RoleDetail from '../../components/SystemManage/RoleDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SystemDetail.less';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  management: state.management,
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
      type: 'management/menufetch',
    });
    dispatch({
      type:'management/systemnav'
    })
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'management/fetch',
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
      type: 'management/fetch',
      payload: params,
    });
  }

  /*TODO: 弹框的显示与隐藏 - 修改用户的基本信息 - 传递数据[用户数据，事件类型]*/
  handleModalVisible = (flag = false,record='assignrole',type) => {
    const { dispatch } = this.props;
    if(flag){
      this.setState({
        modalType:type,
        record:record,
      });
       if (type === 'delete' || type === 'delete') {
      this.setState({
        parentId: type === 'delete'?record.id:record.id,
      });
      const urldelet = type === 'delete' ? 'management/deleteparent' : 'management/deleteparent';
      const text = `确定删除此条信息?`;
      const itemtext = `确定删除此条信息?`;
      const content = type === 'delete' ? itemtext : text;
      Modal.confirm({
        title: '您确定要删除当前数据?',
        content,
        onOk() {
          dispatch({
            type: urldelet,
            payload: { id: record.id },
            callback: (result) => {
              if (result.resultCode === 1000) {
                if (type === 'delete') {
                	alert("删除成功")
                	window.location.reload();
                    me.submitParent();
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
    }
      else if(type === 'add' || type === 'assignrole'){
        dispatch({
          type: 'management/changeModal',
          payload: true,
          record:record,
          modalType:"add"
        })
      }
      else if(type === 'change'){
        dispatch({
          type:'management/singlefetch',
          payload: record,
          record:record,
        })
      }
    }else{
      this.setState({
        modalType:'',
        record:'',
      });
      dispatch({
        type: 'management/changeModal',
        payload:flag,
        record:record,
      })
    }
  }

  /*该函数：辅助函数 - 监听子组件的触发事件 - 表单提交事件*/
  handleOk(type,params){
  	console.log(this.props)
    const { dispatch } = this.props;
    this.setState({
      btnloading: true
    })
    if(type == 'add'){
      dispatch({
        type: 'management/addUserInfo',
        payload: params,
       
      })
    }else{
      dispatch({
        type:'management/updateUserInfo',
        payload: params,
        
        
      })
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
      var jsonParams = { phoneName:values.phoneName?values.phoneName.trim():undefined,
				         phoneFirm:values.phoneFirm?values.phoneFirm.trim():undefined,
				         phoneBrand:values.phoneBrand?values.phoneBrand.trim():undefined,};
       
      this.setState({
        formValues:{
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
      });
      dispatch({
        type: 'management/fetch',
        payload: {
          currentPage: 1,
          pageSize: 10,
          searchParams:JSON.stringify(jsonParams)
        },
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
renderAdvancedForm(params) {
    const { getFieldDecorator } = this.props.form;
    
  	 
      
      const firm =params.PHONE_MODEL_FIRM!=undefined? params.PHONE_MODEL_FIRM.map(item=><Option key={item.code} value={item.code}>{item.value}</Option>):[];
      				 
      const brand  =params.PHONE_MODEL_BRAND!=undefined?params.PHONE_MODEL_BRAND.map(item=><Option key={item.code} value={item.code}>{item.value}</Option>):[]; 
     
     return (
      <Form onSubmit={this.handleSearch} layout="inline">
         
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
        
        	<Col md={7} sm={24}>
        	    <FormItem label="型号">
	              {getFieldDecorator('phoneName')(
	                <Input placeholder="请输入" style={{ width: '80%' }} />
	              )}
	            </FormItem>
          	</Col>
          
          <Col md={7} sm={24}>
            <FormItem label="厂商">
              {getFieldDecorator('phoneFirm')(
                <Select placeholder="请选择" style={{ width: '80%'}}>
                  {firm}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('phoneBrand')(
                <Select placeholder="请选择" style={{ width: '80%' }}>
                      {brand}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
             <span style={{ float: 'center', marginBottom: 24 }}>
                <Button key="submit1" type="primary" htmlType="submit" style={{ marginRight: 16 }}>查询</Button>
                <Button key="submit2" type="primary" onClick={this.handleFormReset}>重置</Button>
                <Button key="submit3" type="primary" htmlType="submit" style={{ marginLeft: 20 }}
                       onClick={() => this.handleModalVisible(true,'','add')}>新增</Button>
              </span>
          </Col>
        </Row>
      </Form>
    );
  }






  render() {
  	var obj = this.props.management.menulist;
  		
  	const firm=obj.PHONE_MODEL_FIRM
  	const brand =obj.PHONE_MODEL_BRAND
  		 
    const { management: { loading , data , modal, singleData, menulist, navlist} ,  dispatch } = this.props;
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
      },
      {
        title: '手机型号',
        dataIndex: 'phoneName',
      },
      {
        title: '手机厂商',
        dataIndex: 'phoneFirmName',
      },
      {
        title: '手机品牌',
        dataIndex: 'phoneBrandName',
      },
      {
        title: '内部型号',
        dataIndex: 'phoneModel',
      },
      {
        title: '内存',
        dataIndex: 'phoneMemory',
      },
      {
        title: '图片',
      dataIndex: 'phoneImg',
      render: (text) => <img src={text} style={{width:'60px',height:'40px'}} />
      },
      {
        title: '全值',
        dataIndex: 'phoneTotalValue',
      },
      {
        title: '估值',
        dataIndex: 'phoneAssessmentValue',
      },
      {
        title: '操作',
        render: (text,record) => {
          var dataUser = record.id;
          return (
            <div>
              <a   onClick={() => this.handleModalVisible(true,dataUser,'change')}>编辑</a>
              {/*<Divider type="vertical" />
             <a onClick={() => this.handleModalVisible(true, record, 'delete')}>删除</a>*/}
            </div>
          )},
      },
    ];
    return (
      <PageHeaderLayout title="机型列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
            	{this.renderAdvancedForm(menulist)}                        
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
          title={modalType === 'add'?'新增机型':'编辑机型'}
          visible={modal}
          style={{ height:'200px'}}
          onCancel={()=>this.handleModalVisible()}
          footer = {modalType === 'assignrole'?[
            
          ]:[]}
        >
          {
            modal && (modalType === 'assignrole'?<RoleDetail navlist={navlist} record={record}/>:<UserDetail modalType = { modalType }
            menu = { firm }
            menu2 = { brand }
            data={ modalType === 'add'?{}:singleData }
            btnloading = {btnloading}
            handleOk={ (type,params)=>this.handleOk(type,params) }
            handleCancel={()=>this.handleModalVisible()}/>)
          }

        </Modal>
      </PageHeaderLayout>
    );
  }
}
