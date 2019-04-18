import React, {PureComponent} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Button, Form, Select, Input, Upload, Icon, message} from 'antd';
import request from '../../utils/request';


const FormItem = Form.Item;
const Option = Select.Option;

export default class logisticsManage extends PureComponent {
  state = {
    visible: false,
    columns: [
      {
        title: '贷款订单编号',
        dataIndex: 'orderNo',
      },
      {
        title: '商品订单编号',
        dataIndex: 'code',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '收货地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '物流信息',
        dataIndex: 'message',
        key: 'message',
        render: (text, record, index) => {
          return (
            <div>
              <h4>物流单号:
                <a href="http://www.kuaidi100.com/?from=openv" target={'_blank'}>{record.transportNo}</a>
              </h4>
              <h4>物流公司:{record.transportCom}</h4>
            </div>
          )
        }
      },
      {
        title: 'skuid',
        dataIndex: 'skuid',
        key: 'skuid',
      },
      {
        title: 'sku属性',
        dataIndex: 'skuName',
        key: 'skuName',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
      },
      {
        title: '供应商',
        dataIndex: 'merchantName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '订单状态',
        dataIndex: 'transportStatus',
        key: 'transportStatus',
        render: (text) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 0 ? '待发货' : text === 1 ? '待收货' : text === 2 ? '确认收货' : text === 3 ? '拒绝收货' : text === 4 ? '退货成功' : '--'}
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
              <a style={{color: 'blue', marginLeft: '10px'}}
                 onClick={() => {
                   this.action(text, record, index)
                 }}>
                编辑
              </a>
            </div>
          )
        }

      },
    ],

    phone: '',
    name: '',
    transportNo: '',
    transportStatus: '',

    tableData: [],
    pg: '',
    formValues: {
      pageSize: 10,
      current: 1
    },

    loansOrder: '',
    goodsOrder: '',
    logisticsNo: '',
    logisticsCom: '',
    orderStatus: '',
    orderStatusNo:　'',

    currentLogisticsNo: '',
    currentLogisticsCom: '',
    currentOrderStatusNo: '',

    noPassModalVisible: false,
    noPassModelList: []
  }

  //编辑按钮
  action =(t, r, i) => {
    this.setState({
      visible: true,
      loansOrder: r.orderNo,
      goodsOrder: r.id,
      logisticsNo: r.transportNo,
      logisticsCom: r.transportCom,
      orderStatusNo:r.transportStatus,
      currentLogisticsNo: r.transportNo,
      currentLogisticsCom: r.transportCom,
      currentOrderStatusNo:r.transportStatus,
      orderStatus: r.transportStatus === 0 ? '待发货' : r.transportStatus === 1 ? '待收货' : r.transportStatus === 2 ? '确认收货' : r.transportStatus === 3 ? '拒绝收货' :  '退货成功'
  })
  };

  //确认修改
  handleModalEditOk = () => {
    if (this.state.logisticsNo == this.state.currentLogisticsNo &&
      this.state.logisticsCom == this.state.currentLogisticsCom &&
      this.state.orderStatusNo == this.state.currentOrderStatusNo){
      this.handleModalEditCancel()
      return
    }
    let params = {}
    params.id = this.state.goodsOrder;
    params.transportNo = this.state.logisticsNo;
    params.transportCom = this.state.logisticsCom;
    params.transportStatus = this.state.orderStatusNo;
    params = JSON.stringify(params);
    request('/modules/manage/orderGoods/updateOrderGoods.htm', {
      method: 'POST',
      body: `orderGoods=${encodeURIComponent(params)}`
    }).then(res => {
      if (res.resultCode === 1000){
        this.setState({
          visible: false
        })
        message.success('修改成功')
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
      }
    })
  }

  //取消修改
  handleModalEditCancel = () => {
    this.setState({
      visible: false,
      logisticsNo: '',
      logisticsCom: '',
      orderStatus: ''
    })
  }
  //编辑数据
  orderStatus = (v) => {

    this.setState({
      orderStatusNo: v
    })
  }

  logisticsCom = (e) => {
    this.setState({
      logisticsCom: e.target.value
    })
  }
  logisticsNo = (e) => {
    this.setState({
      logisticsNo: e.target.value
    })
  }
  //获取物流列表
  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let searchParams = {};
    if (this.state.phone) {
      searchParams.phone = this.state.phone;
    }
    ;
    if (this.state.name) {
      searchParams.name = this.state.name;
    }
    ;
    if (this.state.transportNo) {
      searchParams.transportNo = this.state.transportNo;
    }
    ;
    if (this.state.transportStatus) {
      searchParams.transportStatus = this.state.transportStatus;
    }
    searchParams = JSON.stringify(searchParams);
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
    return request('/modules/manage/orderGoods/orderGoodsList.htm?' + paramsStr, {
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
      if (res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    });

  };

  searchPhone = (e) => {
    this.setState({
      phone: e.target.value
    })
  };

  searchName = (e) => {
    this.setState({
      name: e.target.value
    })
  };

  searchTransportNo = (e) => {
    this.setState({
      transportNo: e.target.value
    })
  };

  searchStatus = (v) => {
    this.setState({
      transportStatus: v
    })
  };

  //查询按钮
  searchList = () => {
    this.handleStandardTableChange({current: 1, pageSize: 10})
  };


  //取消上传
  cancelUpload = () => {
    this.setState({
      noPassModelList: [],
      noPassTableLoading: false,
      noPassModalVisible:false
    })
  }

  //忽略继续上传  确认无误上传
  continueUpload = () => {
    request('/modules/manage/orderGoods/importOrderGoods.htm').then(res => {
      if (res.resultCode === 1000){
        message.success('上传成功')
        this.setState({
          noPassModalVisible: false
        })
        this.handleStandardTableChange({current: 1, pageSize: 10})
      }
    })
  }

  //上传处理弹窗
  handleUpload = (info) => {
    if (info.file.response.resultCode === 1000){
      if(!info.file.response.resultData || info.file.response.resultData.length === 0){
        Modal.confirm({
          title: '确认导入',
          content: '信息无误，确认导入',
          okText: '确认',
          cancelText: '取消',
          onCancel:()=>{this.cancelUpload();},
          onOk:()=>{this.continueUpload();}
        });
      }else{
        this.setState({
          noPassModelList: info.file.response.resultData,
          noPassTableLoading: false,
          noPassModalVisible:true
        })
      }
    }else {
      message.error(info.file.response.resultmessage)
    }
  }


  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10})
  }

  //物流导出
  export = () => {
    let searchParams = {};
    if (this.state.phone) {
      searchParams.phone = this.state.phone;
    }
    ;
    if (this.state.name) {
      searchParams.name = this.state.name;
    }
    ;
    if (this.state.transportNo) {
      searchParams.transportNo = this.state.transportNo;
    }
    ;
    if (this.state.transportStatus) {
      searchParams.transportStatus = this.state.transportStatus;
    }
    searchParams = JSON.stringify(searchParams);
    let data = this.state.tableData;
    if(data){
      window.location.href =`/modules/manage/orderGoods/exportOrderGoods.htm?searchParams=${encodeURIComponent(searchParams)}`
    }else{
      message.error('没有数据可以导出')
    }
  }

  render() {
    const columnsNoPassTable = [
      {
        title: '商品订单编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '物流单号',
        dataIndex: 'transportNo',
        key: 'transportNo'
      },
      {
        title: '物流公司',
        dataIndex: 'transportCom',
        key: 'transportCom',
      },
      {
        title: '订单状态',
        dataIndex: 'transportStatusStr',
        key: 'transportStatusStr'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }
    ];

    const props = {
      name: 'file',
      action: '/modules/manage/orderGoods/verifyOrderGoods.htm',
      onChange:((info) => {
        if (info.file.status === 'done') {
          this.handleUpload(info)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }).bind(this)
    };
    return (
      <PageHeaderLayout title="物流管理">
        <Form layout={'inline'}
        >
          <FormItem label={'快递单号'}>
            <Input type="text"
                   value={this.state.transportNo}
                   onChange={this.searchTransportNo.bind(this)}
            />
          </FormItem>
          <FormItem label={'姓名'}>
            <Input type="text"
                   value={this.state.name}
                   onChange={this.searchName.bind(this)}
            />
          </FormItem>
          <FormItem label={'手机'}>
            <Input type="text"
                   value={this.state.phone}
                   onChange={this.searchPhone.bind(this)}
            />
          </FormItem>
          <FormItem label={'订单状态'}>
            <Select defaultValue="" style={{width: 120}}
                    value={this.state.transportStatus}
                    onChange={this.searchStatus.bind(this)}
            >
              <Option value="0">待发货</Option>
              <Option value="1">待收货</Option>
              <Option value="2">确认收货</Option>
              <Option value="3">拒收货</Option>
              <Option value="4">退货成功</Option>
            </Select>
          </FormItem>
          <Button
            style={{marginRight:20}}
            onClick={this.searchList.bind(this)}
          >
            查询
          </Button>
          <Button onClick={this.export.bind(this)}
                  style={{marginRight:20}}>
            批量导出
          </Button>
          <Upload  {...props}>
            <Button>
              批量导入
            </Button>
          </Upload>

        </Form>
        <Table
          marginTop={20}
          scroll={{x: 2000}}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          title="订单状态"
          visible={this.state.visible}
          onOk={this.handleModalEditOk.bind(this)}
          onCancel={this.handleModalEditCancel.bind(this)}
        >
          <Form layout={'inline'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <FormItem  label={'贷款订单'}>
              <Input value={this.state.loansOrder}
                     disabled={true}
              />
            </FormItem>
            <FormItem  label={'商品订单'}>
              <Input value={this.state.goodsOrder}
                     disabled={true}
              />
            </FormItem>
            <FormItem  label={'物流单号'}>
              <Input value={this.state.logisticsNo}
                     onChange={this.logisticsNo.bind(this)}
              />
            </FormItem>
            <FormItem  label={'物流公司'}>
              <Input value={this.state.logisticsCom}
                     onChange={this.logisticsCom.bind(this)}
              />
            </FormItem>
            <FormItem label={'订单状态'}>
              <Select defaultValue="" style={{width: 120}}
                      value={this.state.orderStatusNo}
                      onChange={this.orderStatus.bind(this)}
              >
                <Option value={0}>待发货</Option>
                <Option value={1}>待收货</Option>
                <Option value={2}>确认收货</Option>
                <Option value={3}>拒收货</Option>
                <Option value={4}>退货成功</Option>
              </Select>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          width={800}
          title="错误数据"
          visible={this.state.noPassModalVisible}
          onCancel={this.cancelUpload.bind(this)}
          footer = {null}
        >
          <Table

            pagination={false}
            dataSource={this.state.noPassModelList}
            columns={columnsNoPassTable}
            bordered rowKey={record => record.id}
            loading={this.state.noPassTableLoading}
            // onChange={this.getNoPassTableData.bind(this)}
          />
          <Button  onClick={this.continueUpload.bind(this)}>忽略以上数据</Button>
          <Button  onClick={this.cancelUpload.bind(this)}>取消上传</Button>
        </Modal>

      </PageHeaderLayout>
    )
  }
}
