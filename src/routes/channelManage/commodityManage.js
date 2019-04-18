import React, {Component} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Button, Input, Form, Select, Message, Row, Col} from 'antd';
import request from '../../utils/request';
// import Detail from '../../components/CreditManage/skuId'

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class MerchantManage extends Component {
  state = {
    visible: false,
    columns: [
      {
        title: '商品编号',
        dataIndex: 'goodsCode',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
      },
      {
        title: 'skuId',
        dataIndex: 'skuid',

      },
      {
        title: 'sku属性',
        dataIndex: 'skuName',
      },
      {
        title: '库存量',
        dataIndex: 'inventory',
      },
      {
        title: '商品类别',
        dataIndex: 'category',

      },
      {
        title: '商户',
        dataIndex: 'merchantName',
      },
      {
        title: '售价',
        dataIndex: 'tradingValue',

      },
      {
        title: '商品状态',
        dataIndex: 'goodsStatus',
        key: 'status',
        render: (text, record, index) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text === 0 ? '未上架' : text === 1 ? '已上架' : '--'}
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
                   this.switchGoodsStatus(text, record, index)
                 }}>
                {record.goodsStatus === 1 && '下架'}{record.goodsStatus === 0 && '上架'}
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
    merchantList: [],
    categorys: [],
    formValues: {
      pageSize: 10,
      current: 1
    },

    skuid: '',
    goodsCode: '',
    goodsName: '',
    merchantId: '',
    goodsStatus: '',

    goodsSku :[{skuid:"",skuName:"",inventory:""}]
  }

  componentWillMount() {
    request('/modules/manage/merchant/getAllMerchant.htm').then(res => {
      console.log(res);
      if (res.resultCode === 1000) {
        this.setState({
          merchantList: res.resultData
        })
      }
    })
  }

  componentDidMount() {
    this.handleStandardTableChange({current: 1, pageSize: 10})
  }

  getList(params) {
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}`;

    return request('/modules/manage/goods/goodsList.htm?' + paramsStr, {
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
      console.log(res);
      if (res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    });

  }

  //上下架切换
  switchGoodsStatus = (t, r, i) => {
    request('/modules/manage/goods/updateStatus.htm?' + `id=${r.id}&status=${r.goodsStatus === 1 ? 0 : 1}`, {
      method: 'POST',
    }).then(res => {
      console.log(res);
      if (res.resultCode === 1000) {
        this.handleStandardTableChange({current: 1, pageSize: 10})
        Message.success('操作成功')
      }
    })
  }

  //搜索参数
  searchGoodsCode = (e) => {
    this.setState({
      goodsCode: e.target.value
    })
  }

  searchSkuid = (e) => {
    this.setState({
      skuid: e.target.value
    })
  }

  searchGoodsName = (e) => {
    this.setState({
      goodsName: e.target.value
    })
  }

  searchMerchantName = (v) => {
    this.setState({
      merchantId: v
    })
  }

  searchStatus = (v) => {
    this.setState({
      goodsStatus: v
    })
  }

  //搜索按钮
  searchList = () => {
    let pageSize = 10;
    let currentPage = 1;
    let searchParams = {};
    if (this.state.goodsCode) {
      searchParams.goodsCode = this.state.goodsCode
    }
    if (this.state.skuid) {
      searchParams.skuid = this.state.skuid
    }
    if (this.state.goodsStatus) {
      searchParams.goodsStatus = this.state.goodsStatus
    }
    if (this.state.goodsName) {
      searchParams.goodsName = this.state.goodsName
    }
    if (this.state.merchantId) {
      searchParams.merchantId = this.state.merchantId
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${searchParams}`;
    // console.log(paramsStr);
    request('/modules/manage/goods/goodsList.htm?' + paramsStr, {
      method: 'GET'
    }).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    })
  }

  handleSearch = () => {
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      const values = {
        ...fieldsValue
      };
    })
  }

  add = (index) =>{
    // const {getFieldsValue} = this.props.form;
    // const skuArr = getFieldsValue();
    // console.log(skuArr);
    const {goodsSku} = this.state;
    goodsSku.push({skuid:"",skuName:"",inventory:""});
    //
    // goodsSku[index].skuid = skuArr[`skuid${index}`]
    // goodsSku[index].skuName = skuArr[`skuName${index}`]
    // goodsSku[index].inventory = skuArr[`inventory${index}`]?skuArr[`inventory${index}`]:0
    this.setState(
      {goodsSku: goodsSku},
      () => {
        console.log(this.state.goodsSku);
      })

  }

  remove = (index) => {
    const {getFieldsValue, resetFields} = this.props.form;
    resetFields([`skuid${index}`,`skuName${index}`,`inventory${index}`,[]])
    const {goodsSku} = this.state;
    const skuArr = getFieldsValue()
    goodsSku[index].skuid = skuArr[`skuid${index}`]
    goodsSku[index].skuName = skuArr[`skuName${index}`]
    goodsSku[index].inventory = skuArr[`inventory${index}`]?skuArr[`inventory${index}`]:0
    goodsSku.splice(index,1);
    this.setState(
      {goodsSku: goodsSku},
      () => {
        console.log(this.state.goodsSku);
      })
  }

  partner = (v) => {
    console.log(v);
    this.setState({
      merchantId: v
    })
  }

  saveSkuid = (index) => {

    console.log(index);
    // const {goodsSku} = this.state
    // goodsSku.skuid = value
    // this.setState({
    //   goodsSku: goodsSku
    // })
  }


  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    return (
      <PageHeaderLayout title="商品管理" >
        <Form layout={'inline'}
              style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
          <FormItem label={'商品编号'}>
            <Input type="text"
                   value={this.state.goodsCode}
                   onChange={this.searchGoodsCode.bind(this)}
            />
          </FormItem>
          <FormItem label={'skuId'}>
            <Input type="text"
                   value={this.state.skuid}
                   onChange={this.searchSkuid.bind(this)}
            />
          </FormItem>
          <FormItem label={'商品名称'}>
            <Input type="text"
                   value={this.state.goodsName}
                   onChange={this.searchGoodsName.bind(this)}
            />
          </FormItem>
          <FormItem label={'商家'}>
            <Select defaultValue="" style={{width: 120}}
                    value={this.state.merchantId}
                    onChange={this.searchMerchantName.bind(this)}
            >
              {
                this.state.merchantList.map((m, index) => {
                  return <option value={m.id} key={m.id}>{m.merchantName}</option>
                })
              }
            </Select>
          </FormItem>
          <FormItem label={'状态'}>
            <Select defaultValue="" style={{width: 120}}
                    value={this.state.goodsStatus}
                    onChange={this.searchStatus.bind(this)}
            >
              <Option value="1">已上架</Option>
              <Option value="0">未上架</Option>
            </Select>
          </FormItem>
          <Button style={{marginRight: 30}}
                  onClick={this.searchList.bind(this)}
          >
            搜索
          </Button>
          <Button style={{marginRight: 30, marginTop: 10}}
            // onClick={this.resetSearch.bind(this)}
          >
            新增商品
          </Button>
          <Button style={{marginRight: 30, marginTop: 10}}
            // onClick={this.handleExport.bind(this)}
          >
            导入商品
          </Button>
        </Form>
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          onOk={this.handleSearch}
          visible={true}
          >

          {/*{this.renderAdvancedForm()}*/}
          <Form layout="inline" style={{display: 'flex', flexDirection: 'column'}}>
            <FormItem label="商品编号">
              {getFieldDecorator('goodsCode', {
                rules: [
                  {
                    len: 5,
                    message: '5位数字,以商家Id开头'
                  }
                ],
                validateTrigger: 'onBlur'
              })(
                <Input placeholder="请输入" maxLength='5' style={{width: '80%'}}/>
              )}
            </FormItem>
            < FormItem
              label="商品名称">
              {getFieldDecorator('goodsName')
              (
                <Input placeholder="请输入" maxLength='50' style={{width: '80%'}}/>
              )
              }
            </FormItem>
            <span style={{marginRight: 15, marginTop: 10, display: 'block'}}>SKU</span>
            {
              this.state.goodsSku.map((element, index) => (
              <span key={index}>
                  <FormItem>
                      <Input required={true}
                             onBlur={this.saveSkuid(index)}
                             placeholder="请输入skuid"
                             maxLength='3'
                             style={{width: 110}}/>

                      <Input value={element.skuName} placeholder="请输入sku属性" maxLength='20' style={{width: 120}}/>



                      <Input value={element.inventory} placeholder="请输入库存量" maxLength='10' style={{width: 110}}/>

                  </FormItem>
                {index < 9 && <Button style={{verticalAlign:'middle', marginTop: 7}} shape="circle" size="small" icon="plus" type="primary" onClick={() => this.add(index)}/>}
                {index > 0 && <Button style={{verticalAlign:'middle', marginTop: 7}}  shape="circle" size="small" icon="minus" type="default" onClick={() => this.remove(index)} />}
                </span>
            ))
            }
            < FormItem
              label="商户名称">
              {getFieldDecorator('merchantId', {
                rules: [{
                  required: true, message: '请选择商户！',
                }],
                initialValue: ''
              })
                (<Select onChange={this.partner.bind(this)} style={{width: 120}}>
                  {
                    this.state.merchantList.map((item, index) => {
                      return <Option key={index} value={item.id}>{item.merchantName}</Option>
                    })

                  }
                </Select>)
              }
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
