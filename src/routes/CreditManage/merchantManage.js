import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import WrappedDynamicFieldSet from '../../components/CreditManage/addOrEditMerchant'
import {Table, Modal, Button, Form, Input, Icon, message} from 'antd';
import request from '../../utils/request';

const FormItem = Form.Item;

export default class MerchantManage extends PureComponent {
  state = {
    columns: [
      {
        title: '商家id',
        dataIndex: 'id',
        width: '14%',
      },
      {
        title: '商家名称',
        dataIndex: 'merchantName',
        width: '14%'

      },
      {
        title: '商品分类',
        dataIndex: 'goodsCategory',
        width: '14%',
      },
      {
        title: '商家状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record, index) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 0 ? '已关闭' : text === 1 ? '已启动' : '--'}
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <a style={{color: 'red', marginLeft: '10px'}}
                 onClick={() => {
                   this.switchMerchantStatus(text, record, index)
                 }}>
                {record.status === 1 && '关闭'}{record.status === 0 && '开启'}
              </a>
              &nbsp;&nbsp;&nbsp;
              <a onClick={() => {
                this.showmodalEdit(text, record, index)
              }}>
                编辑
              </a>
            </div>
          )
        }

      },
    ],
    tableData: [],
    pg: {},

    addVisible: false,
    addMerchantName: '',
    addGoodsCategoryList: '',
    formValues: {
      pageSize: 10,
      current: 1
    },

    editVisible: false,
    editChannelId: '',
    editMerchantName: '',
    editGoodsCategoryList: [],

    editData: {}

  }

  //切换商家状态
  switchMerchantStatus = (t, r, i) => {
    let id = r.id;
    let params = `id=${id}`;
    request('/modules/manage/merchant/switchStatus.htm?' + params, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000) {
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10});
        message.success('操作成功')
      }
    })
  };

  //编辑按钮
  showmodalEdit = (t, r, i) => {
    let oldGoodsCategory = r.goodsCategoryList.map(item => {
      return item.id + '_' + item.category
    })
    this.setState({
      editData: r,
      editVisible: true,
      editChannelId: r.id,
      editMerchantName: r.merchantName,
      editGoodsCategoryList: oldGoodsCategory
    })
  };

  //新增商家
  addMerchant = () => {
    this.setState({
      addVisible: true,
      addMerchantName: '',
      addGoodsCategoryList: '',
    })
  };

  //新增商家名称

  addName = (e) => {
    this.setState({
      addMerchantName: e.target.value
    })
  };

  //新增商品分类
  addGoodsCategory = (value) => {
    this.setState({
      addGoodsCategoryList: value
    });
  }

  //确认新增
  handleModalAddOk = () => {
    if (!this.state.addMerchantName){
      message.warning('请输入商家名称')
      return
    }
    if (!this.state.addGoodsCategoryList){
      message.warning('请添加商家分类')
      return
    }
    this.setState({
      addVisible: false
    })
    let params = `merchantName=${this.state.addMerchantName}&goodsCategoryList=${this.state.addGoodsCategoryList}`
    request('/modules/manage/merchant/saveMerchant.htm?' + params, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('添加成功')
        this.handleStandardTableChange({current: 1, pageSize: 10})
      } else {
        message.error('添加失败,' + res.resultmessage)
      }
    })
  };

  //取消新增
  handleModalAddCancel = () => {
    this.setState({
      addVisible: false,
      addMerchantName: '',
      addGoodsCategoryList: '',
    })
  };

  //编辑商家名称
  editName = (e) => {
    this.setState({
      editMerchantName: e.target.value
    })
  };
  //编辑确认
  handleModalEditOk = () => {
    let params = `id=${this.state.editChannelId}&merchantName=${this.state.editMerchantName}&oldGoodsCategory=${this.state.editGoodsCategoryList}&newGoodsCategory=${this.state.addGoodsCategoryList}`;
    request('/modules/manage/merchant/updateMerchant.htm?' + params, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000){
        message.success('修改成功')
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
        this.setState({
          editVisible: false,
          editChannelId: '',
          editMerchantName: '',
          addGoodsCategoryList: [],
          editData: {}
        })
      }
    })
  };

  //取消编辑
  handleModalEditCancel = () => {
    this.setState({
      editVisible: false,
      editChannelId: '',
      editMerchantName: '',
      editGoodsCategoryList: [],
      editData: {}
    })
  }
  //获取渠道列表数据
  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}`;

    return request('/modules/manage/merchant/merchantList.htm?' + paramsStr, {
      method: 'GET'
    })
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
    this.getList(params).then(res => {
      if(res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    });

  }

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10})
  };


  render() {
    return (
      <PageHeaderLayout title="商家管理">
        <Button style={{marginRight: 16, marginBottom: 10}}
                onClick={this.addMerchant.bind(this)}>新增商家</Button>
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          destroyOnClose={true}
          title="新增商家"
          visible={this.state.addVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column'}}>

            <FormItem required label={'商家id'}>
              <Input maxLength="20"
                // onChange={this.addName.bind(this)}
                     disabled
              />
            </FormItem>
            <FormItem required label={'商家名称'}>
              <Input maxLength="100" value={this.state.addMerchantName}
                     onChange={this.addName.bind(this)}
              />
            </FormItem>


            <WrappedDynamicFieldSet keys={[]} addGoodsCategory={this.addGoodsCategory} list={this.state.addGoodsCategoryList}/>


          </Form>
        </Modal>
        <Modal
          destroyOnClose={true}
          title="编辑商家"
          visible={this.state.editVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column'}}>

            <FormItem required label={'商家id'}>
              <Input maxLength="20" value={this.state.editChannelId}
                // onChange={this.addName.bind(this)}
                     disabled
              />
            </FormItem>
            <FormItem required label={'商家名称'}>
              <Input maxLength="10" value={this.state.editMerchantName}
                     onChange={this.editName.bind(this)}
              />
            </FormItem>




            <WrappedDynamicFieldSet keys={[]} addGoodsCategory={this.addGoodsCategory} list={this.state.editData}/>


          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
