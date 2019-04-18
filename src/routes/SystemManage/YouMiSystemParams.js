import React, {PureComponent} from 'react';
import {Table, Card, Form, Modal, Input, Button, message, Select} from 'antd'
import {
  addSystemParams,
  deleteSystemParams,
  updateSystemParams,// 编辑数据&开启关闭 已完成
  querySystemList, // 获取数据列表 已完成
  refreshCache // 刷新缓存 已完成
} from '../../services/systemmanage';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      // 还款渠道列表
      listData: [],

      searchCode: '',
      searchName: '',

      pagination: {
        current: '',
        pageSize: '',
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: '',
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
      },

      modalEditVisible: false,
      modalEditCode: '',
      modalEditName: '',
      modalEditValue: '',
      modalEditRemark: '',
      modalEditCreator: '',
      modalEditId: '',
      modalEditStatus: '',
      modalEditType: '',


      modalAddVisible: false,
      modalAddCode: '',
      modalAddName: '',
      modalAddValue: '',
      modalAddRemark: '',
      modalAddStatus: 1, // 新增默认开启
      modalAddType: '',
    }
  }

  /**获取数据**/
  getData(params) {
    this.setState({
      tableLoading: true
    });
    querySystemList(
      params
    ).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          listData: res.resultData.resultData,
          tableLoading: false,
          pagination: res.resultData.page
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**控制页码器**/
  handlePageChange(pagination) {
    this.setState({
      pagination: pagination
    });
    this.getData({
      pageSize: pagination.pageSize,
      currentPage: pagination.current,
      searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
    });
  }

  /**搜索**/
  search() {
    this.getData({
      pageSize: this.state.pagination.pageSize,
      currentPage: this.state.pagination.current,
      searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
    })
  }

  handleSearchCodeChange(e) {
    this.setState({
      searchCode: e.target.value
    })
  }

  handleSearchNameChange(e) {
    this.setState({
      searchName: e.target.value
    })
  }

  /**重置**/
  reset() {
    this.setState({
      searchCode: '',
      searchName: '',
    });
    this.getData({
      pageSize: this.state.pagination.pageSize,
      currentPage: this.state.pagination.current,
      searchParams: ''
    })
  }

  /**刷新缓存**/
  refreshCache() {
    refreshCache().then(res => {
      if (res.resultCode === 1000) {
        message.success('刷新成功')
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**新增**/
  addSystemParams(params) {
    addSystemParams({
      sysconfig: encodeURIComponent(JSON.stringify(params))
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('新增成功');
        this.setState({
          modalAddVisible: false
        });
        this.getData({
          pageSize: this.state.pagination.pageSize,
          currentPage: this.state.pagination.current,
          searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**展示新增模态框**/
  showModalAdd() {
    this.setState({
      modalAddVisible: true,
      modalAddCode: '',
      modalAddName: '',
      modalAddValue: '',
      modalAddRemark: '',
    })
  }

  handleModalAddOk() {
    this.addSystemParams({
      code: this.state.modalAddCode,
      name: this.state.modalAddName,
      remark: this.state.modalAddRemark,
      status: this.state.modalAddStatus,
      type: this.state.modalAddType,
      value: this.state.modalAddValue,
    });
  }

  handleModalAddCancel() {
    this.setState({
      modalAddVisible: false
    })
  }

  modalAddCodeChange(e) {
    this.setState({
      modalAddCode: e.target.value
    })
  }

  modalAddNameChange(e) {
    this.setState({
      modalAddName: e.target.value
    })
  }

  modalAddValueChange(e) {
    this.setState({
      modalAddValue: e.target.value
    })
  }

  handleSelectChange(e) {
    this.setState({
      modalAddType: e
    })
  }

  modalAddRemarkChange(e) {
    this.setState({
      modalAddRemark: e.target.value
    })
  }


  /**删除数据**/
  deleteSystemParams(id) {
    confirm({
      title: '提示',
      content: '确认删除此数据吗？',
      onOk: () => {
        deleteSystemParams({
          id: id
        }).then(res => {
          if (res.resultCode === 1000) {
            message.success('操作成功');
            this.getData({
              pageSize: this.state.pagination.pageSize,
              currentPage: this.state.pagination.current,
              searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
            })
          } else {
            message.error('网络错误，请重试')
          }
        })
      }
    });
  }


  /***********编辑**********/

  /**编辑数据**/
  updateSystemParams(params) {
    updateSystemParams({
      sysconfig: encodeURIComponent(JSON.stringify(params))
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('操作成功');
        this.setState({
          modalEditVisible: false
        });
        this.getData({
          pageSize: this.state.pagination.pageSize,
          currentPage: this.state.pagination.current,
          searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  /**展示编辑模态框**/
  showModalEdit(record) {
    this.setState({
      modalEditVisible: true,
      modalEditCode: record.code,
      modalEditName: record.name,
      modalEditValue: record.value,
      modalEditRemark: record.remark,
      modalEditCreator: record.creator,
      modalEditId: record.id,
      modalEditStatus: record.status,
      modalEditType: record.type,
    })
  }

  /**编辑模态框 确认按钮**/
  handleModalEditOk() {
    this.updateSystemParams({
      code: this.state.modalEditCode,
      creator: this.state.modalEditCreator,
      id: this.state.modalEditId,
      name: this.state.modalEditName,
      remark: this.state.modalEditRemark,
      status: this.state.modalEditStatus,
      type: this.state.modalEditType,
      value: this.state.modalEditValue,
    });
  }

  /**编辑模态框 取消按钮**/
  handleModalEditCancel() {
    this.setState({
      modalEditVisible: false
    })
  }

  modalEditCodeChange(e) {
    this.setState({
      modalEditCode: e.target.value
    })
  }

  modalEditNameChange(e) {
    this.setState({
      modalEditName: e.target.value
    })
  }

  modalEditValueChange(e) {
    this.setState({
      modalEditValue: e.target.value
    })
  }

  modalEditRemarkChange(e) {
    this.setState({
      modalEditRemark: e.target.value
    })
  }

  /**生命周期**/
  componentDidMount() {
    this.getData({
      pageSize: this.state.pagination.defaultPageSize,
      currentPage: this.state.pagination.defaultCurrent,
      searchParams: JSON.stringify({code: this.state.searchCode, name: this.state.searchName})
    })
  }

  render() {
    const columns = [{
      title: '参数编号',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '参数类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        return (
          <div>
            {record.type === 10 && '系统关键参数'}
            {record.type === 20 && '业务参数'}
            {record.type === 30 && '协议参数'}
            {record.type === 40 && 'H5参数'}
            {record.type === 50 && '备注参数'}
            {record.type === 60 && '短信参数'}
            {record.type === 70 && '大圣'}
            {record.type === 80 && '第三方'}
          </div>
        )
      }
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return (
          <div style={{color: text === 1 ? '#67C23A' : ''}}>
            {text === 0 ? '已关闭' : text === 1 ? '已启动' : '--'}
          </div>
        )
      }
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {
        return (
          <div>
            <a onClick={this.showModalEdit.bind(this, record)}>
              编辑
            </a>

            <a style={{color: 'red', marginLeft: '10px'}}
               onClick={
                 this.updateSystemParams.bind(this, {
                   code: record.code,
                   creator: record.creator,
                   id: record.id,
                   name: record.name,
                   remark: record.remark,
                   status: record.status === 1 ? 0 : 1,
                   type: record.type,
                   value: record.value,
                 })
               }>
              {record.status === 1 && '关闭'}{record.status === 0 && '开启'}
            </a>

            <a style={{marginLeft: '10px'}}
               onClick={this.deleteSystemParams.bind(this, record.id)} disabled={record.status === 1}>
              删除
            </a>

          </div>
        )
      }
    }];

    return (
      <div>
        <Card>

          <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            <FormItem label={'参数编号'}>
              <Input value={this.state.searchCode} onChange={this.handleSearchCodeChange.bind(this)}
                     placeholder={'不支持模糊查询'}/>
            </FormItem>
            <FormItem label={'参数名称'}>
              <Input value={this.state.searchName} onChange={this.handleSearchNameChange.bind(this)}
                     placeholder={'支持模糊查询'}/>
            </FormItem>
            <Button type={'primary'} onClick={this.search.bind(this)}>
              查询
            </Button>
            <Button style={{marginLeft: '15px'}} onClick={this.reset.bind(this)}>
              重置
            </Button>
            <Button style={{marginLeft: '15px'}} onClick={this.showModalAdd.bind(this)}>
              新增
            </Button>
            <Button style={{marginLeft: '15px'}} onClick={this.refreshCache.bind(this)}>
              刷新缓存
            </Button>
          </Form>

        </Card>
        <Card>
          <Table
            dataSource={this.state.listData}
            columns={columns}
            pagination={this.state.pagination}
            onChange={this.handlePageChange.bind(this)}
            bordered rowKey={record => record.id}
            loading={this.state.tableLoading}/>
        </Card>
        <Modal
          title="编辑"
          visible={this.state.modalEditVisible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormItem required label={'参数编号'}>
              <Input value={this.state.modalEditCode}
                     onChange={this.modalEditCodeChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数名称'}>
              <Input value={this.state.modalEditName}
                     onChange={this.modalEditNameChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数的值'}>
              <Input value={this.state.modalEditValue}
                     onChange={this.modalEditValueChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数备注'}>
              <Input value={this.state.modalEditRemark}
                     onChange={this.modalEditRemarkChange.bind(this)}/>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="新增"
          visible={this.state.modalAddVisible}
          onOk={this.handleModalAddOk.bind(this)}
          onCancel={this.handleModalAddCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <FormItem required label={'参数编号'}>
              <Input value={this.state.modalAddCode}
                     onChange={this.modalAddCodeChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数名称'}>
              <Input value={this.state.modalAddName}
                     onChange={this.modalAddNameChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数的值'}>
              <Input value={this.state.modalAddValue}
                     onChange={this.modalAddValueChange.bind(this)}/>
            </FormItem>
            <FormItem required label={'参数类型'}>
              <Select defaultValue={''} style={{width: '171px'}} onChange={this.handleSelectChange.bind(this)}>
                <Option value={10}>系统关键参数</Option>
                <Option value={20}>业务参数</Option>
                <Option value={30}>协议参数</Option>
                <Option value={40}>H5参数</Option>
                <Option value={50}>备注参数</Option>
                <Option value={60}>短信参数</Option>
                <Option value={70}>大圣</Option>
                <Option value={80}>第三方</Option>
              </Select>
            </FormItem>
            <FormItem required label={'参数备注'}>
              <Input value={this.state.modalAddRemark}
                     onChange={this.modalAddRemarkChange.bind(this)}/>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
