/**
 * Created by Administrator on 2017/12/26 0026.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Tree, Divider, Spin} from 'antd';
import MenuDetail from '../../components/SystemManage/MenuDetail';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './SystemDetail.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  systemmenu: state.systemmenu,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    visibleModal:false,
    recordData:{},
    modalType:'add',
    modalTypeStr:'新增一级菜单',
    checkedkey:[],
    isLeaf:true,
    btnloading:false,
  }

  componentDidMount(){
    let { dispatch } = this.props;
    dispatch({
       type: 'systemmenu/fetch'
    })
  }

  handleModalVisible(flag=false,type='add'){
    let titleStr = type==='addchild'?'新增子菜单':type==='change'?'菜单修改':'新增一级菜单';
    if(flag){
      this.setState({
        visibleModal: flag,
        modalType: type,
        modalTypeStr: titleStr
      })
    }else{
      this.setState({
        visibleModal: flag,
        recordData: '',
        modalType: type,
        modalTypeStr: ''
      })
    }
  }

  handleOk= (modalType,params) => {
    const { dispatch } = this.props;
    this.setState({
      btnloading:true
    })
    if(modalType == 'change'){
      dispatch({
        type:'systemmenu/updatemenufetch',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'菜单修改成功！',
              onOk() {
                dispatch({
                  type: 'systemmenu/fetch',
                });
              },
            });
          }
          this.setState({
            visibleModal:false,
            btnloading: false
          })
        }
      })
    }else{
      dispatch({
        type:'systemmenu/addmenufetch',
        payload: params,
        callback:(result)=>{
          if(result.resultCode === 1000){
            Modal.success({
              title:'添加成功！',
              onOk() {
                dispatch({
                  type: 'systemmenu/fetch',
                });
              },
            });
          }
          this.setState({
            visibleModal:false,
            btnloading: false
          })
        }
      })
    }
  };

  /**
   * 树形结构 -- 结构生成
   * **/
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name}
                    key={item.id}
                    dataRef={item}
                    isLeaf={item.leaf === 0} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={ item.name }
                        key={item.id}
                        dataRef={item}/>;
    });
  }
  /**
   * 树形结构 -- 触发节点的点击事件
   * **/
  onSelect = (selectedKeys, {node}) => {
    let { props } = node;
    this.setState({
      checkedkey: selectedKeys,
      isLeaf:  props.hasOwnProperty('isLeaf')? props.isLeaf === 0 ? false:true : true,
      recordData: props.hasOwnProperty('dataRef')? props.dataRef:''
    })
  }


  render(){
    const { systemmenu:{ menulist ,loading }} = this.props;
    const　{recordData, visibleModal, modalTypeStr, modalType, checkedkey, isLeaf, btnloading} = this.state;
    const navkey = checkedkey.length?checkedkey[0]:''

    return   <PageHeaderLayout title="用户列表">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
              <Button type="primary"
                      style={{ marginRight: 16 }}
                      disabled = { navkey !=='0-0' }
                      onClick={() => this.handleModalVisible(true,'add')} ><Icon type="plus"/>新增一级菜单</Button>
              <Button type="primary"
                        disabled = { navkey ==='0-0' || checkedkey.length == 0}
                        style={{ marginRight: 16 }}
                        onClick={() => this.handleModalVisible(true, 'change')}><Icon type="plus"/>修改菜单</Button>
              <Button type="primary"
                      disabled = { navkey ==='0-0'|| checkedkey.length == 0 || recordData.parentId != 0 }
                      style={{ marginRight: 16 }}
                      onClick={() => this.handleModalVisible(true, 'addchild')}><Icon type="plus"/>添加子菜单</Button>
          </div>
          <Divider/>
          {
             menulist.length ?<Tree checkable={true}
                                    checkStrictly={true}
                                    multiple = {false}
                                    checkedKeys = { checkedkey }
                                    selectedKeys = { checkedkey }
                                    onSelect={ this.onSelect}
                                    onCheck={ this.onCheck}>
               <TreeNode title="系统菜单目录" key="0-0" isLeaf={false} >
                {
                 this.renderTreeNodes(menulist)
                }
               </TreeNode>
             </Tree>: <div style={{width:'100%',height:'100%',textAlign:'center'}}><Spin size="large" /></div>
          }
        </div>
      </Card>
      <Modal visible={visibleModal}
             title={modalTypeStr}
             width={900}
             footer={[]}
             onCancel={()=>this.handleModalVisible()}>
        {
          visibleModal && <MenuDetail   btnloading = { btnloading }
                                        modalType = { modalType }
                                        data={ recordData }
                                        handleOk={ (type,params)=>this.handleOk(type,params) }
                                        handleCancel={ ()=>this.handleModalVisible()}/>
        }
      </Modal>
    </PageHeaderLayout>
  }

}
