import React, {Component} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Table, Modal, Radio, Button, Input, Form, Select, Tooltip, message, Row, Col, InputNumber, Upload, Icon} from 'antd';
import request from '../../utils/request';
import GoodsInfo from '../../components/CreditManage/goodsInfo'


const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;

let currentData;
let currentSku;
@Form.create()
export default class MerchantManage extends Component {
  state = {
    visible: false,
    columns: [
      {
        title: '商品编号',
        dataIndex: 'goodsCode',
        key: 'goodsCode'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: '14%',
      },
      {
        title: 'skuId',
        dataIndex: 'skuid',
        key: 'skuid'
      },
      {
        title: 'sku属性',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '库存量',
        dataIndex: 'inventory',
        key: 'inventory'
      },
      {
        title: '商品类别',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: '是否虚拟物品',
        dataIndex: 'isVirtual',
        key: 'isVirtual',
        render: (text, record, index) => {
          return (
            <div style={{color: text === true ? '#67C23A' : ''}}>
              {text == 0 ? '否' : text == 1 ? '是' : '--'}
            </div>
          )
        }
      },
      {
        title: '商户',
        dataIndex: 'merchantName',
        key: "merchantName"
      },
      {
        title: '售价',
        dataIndex: 'tradingValue',
        key:'tradingValue'
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
              {
                record.merchantStatus == 0 ?
                  <a onClick={() => { return false }} style={{color: 'grey', marginLeft: '10px'}}>
                    {record.goodsStatus === 1 && '下架'}{record.goodsStatus === 0 && '上架'}
                  </a> :
                  <a style={{color: 'red', marginLeft: '10px'}}
                onClick={() => {
                this.switchGoodsStatus(text, record, index)
              }}>
              {record.goodsStatus === 1 && '下架'}{record.goodsStatus === 0 && '上架'}
                </a>
              }
              &nbsp;&nbsp;&nbsp;
              <a onClick={() => {
                this.showmodalEdit(text, record, index)
              }}>
                编辑
              </a>
              &nbsp;&nbsp;&nbsp;
              <a onClick={() => {
                this.showmodalEditInventory(text, record, index)
              }}>
                修改库存
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

    currentData: {},

    skuid: '',
    goodsCode: '',
    goodsName: '',
    merchantId: '',
    goodsStatus: '',
    goodsCategoryId: '',
    tradingValue: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    img: [],
    goodsInfo: '',
    isVirtual: '',
    length: '',

    goodsSku: [{skuid: "", skuName: "", inventory: "", getUrl: ""}],
    goodsCategory: [],

    addModal: false,
    editModal: false,

    id: '',//商品ID

    searchGoodsCode:'',
    searchSkuid:'',
    searchGoodsName:'',
    searchMerchantId:'',
    searchGoodsStatus:'',
    //修改库存
    editInventoryVisible: false,
    editInventoryData: {},
    editInventoryGoodsName: '',
    addOrDecrease: '',
    count: '',
    currentInventory: ''
  }

  componentWillMount() {
    request('/modules/manage/merchant/getAllMerchant.htm').then(res => {
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
    let searchParams = {};
    if (this.state.searchGoodsCode) {
      searchParams.goodsCode = this.state.searchGoodsCode
    }
    if (this.state.searchSkuid) {
      searchParams.skuid = this.state.searchSkuid
    }
    if (this.state.searchGoodsStatus) {
      searchParams.goodsStatus = this.state.searchGoodsStatus
    }
    if (this.state.searchGoodsName) {
      searchParams.goodsName = this.state.searchGoodsName
    }
    if (this.state.searchMerchantId) {
      searchParams.merchantId = this.state.searchMerchantId
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;

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
      if (res.resultCode === 1000) {
        this.setState({
          tableData: res.resultData,
          pg: res.page
        });
      }
    });

  }

  deepClone = (obj) => {
    var newObj = obj.constructor === Array ? []:{};
    if(typeof obj !== 'object'){
      return
    }else{
      for(var i in obj){
        if(obj.hasOwnProperty(i)){
          newObj[i] = typeof obj[i] === 'object'?this.deepClone(obj[i]):obj[i];
        }
      }
    }
    return newObj
  }

  //判断skuid是否重复
   isRepeat = (arr) => {
    var hash = {};
    for (var i in arr) {
      if (hash[arr[i]]){
        return true;
      }
      hash[arr[i]] = true;
    }
    return false;
  }

  //编辑按钮
  showmodalEdit = (t, r, i) => {
    request(`/modules/manage/goods/goodsinfo.htm?goodsId=${r.id}`).then(res => {
      let fileList = [];
      console.log(res.resultData.goods);
      if (res.resultCode === 1000) {
        for (var index in res.resultData.imgs) {
          fileList.push({
            uid: index,
            name: `${index}`,
            status: 'done',
            url: res.resultData.imgs[index],
          })
        }
        currentData = {
          id: r.id,
          merchantId: res.resultData.goods.merchantId,
          goodsName: r.goodsName,
          goodsCategoryId: res.resultData.goods.goodsCategoryId,
          tradingValue: r.tradingValue,
          goodsInfo: res.resultData.goods.goodsInfo,
          goodsStatus: r.goodsStatus,
          isVirtual: res.resultData.goods.isVirtual,
          goodsSku: [],
          img: [],
          fileList: fileList
        }
        this.setState({
          id: r.id,
          merchantId: res.resultData.goods.merchantId,
          goodsName: r.goodsName,
          goodsCategoryId: res.resultData.goods.goodsCategoryId,
          tradingValue: r.tradingValue,
          goodsInfo: res.resultData.goods.goodsInfo,
          goodsStatus: r.goodsStatus,
          isVirtual: res.resultData.goods.isVirtual,
          goodsSku: res.resultData.goodsSkus,
          length:res.resultData.goodsSkus.length,
          img: res.resultData.imgs,
          editModal: true,
          goodsCode: r.goodsCode,
          fileList: fileList
        }),
        currentSku = this.deepClone(res.resultData.goodsSkus)
        res.resultData.imgs.map(img => {
          currentData.img.push(img)
        })
      }
    })
    request(`/modules/manage/goods/goodsCategory.htm?merchantId=${r.merchantId}`).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          goodsCategory: res.resultData
        })
      }
    })
  }

  /*用正则表达式实现html解码*/
  htmlDecodeByRegExp = (str) => {
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;
  }

  //确认编辑
  handleEditOk = () => {
    if (!(this.state.goodsName &&
        this.state.tradingValue &&
        this.state.goodsInfo
      )){
      message.error('请输入完整商品信息')
      return
    }
    if (this.state.tradingValue % 100){
      message.error('商品价格必须为整百正整数')
      return
    }
    if (!this.state.img.length){
      message.error('商品图片不能为空')
      return
    }
    const {getFieldsValue, validateFields, isFieldsTouched} = this.props.form;
    const {goodsSku} = this.state;
    const skuArr = getFieldsValue()
    let skuidArr=[]
    for (var j = 0; j < goodsSku.length ; j++){
      skuidArr.push(skuArr[`skuid${j}`])
    }
    for (var i of skuidArr){
      if (i<=100){
        message.error('skuid为大于100的三位数')
        return
      }
    }
    if (this.isRepeat(skuidArr)){
      message.error('skuid不能重复')
      return
    }
    validateFields((err, values) => {
      goodsSku.map((item, index) => {
        item.skuid = skuArr[`skuid${index}`]
        item.skuName = skuArr[`skuName${index}`]
        item.inventory = skuArr[`inventory${index}`] ? skuArr[`inventory${index}`] : 0
        item.getUrl = skuArr[`getUrl${index}`] ? skuArr[`getUrl${index}`] : ''
      })
      goodsSku[goodsSku.length - 1].skuid = values[`skuid${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].skuName = values[`skuName${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].inventory = values[`inventory${goodsSku.length - 1}`] ? values[`inventory${goodsSku.length - 1}`] : 0
      goodsSku[goodsSku.length - 1].getUrl = values[`getUrl${goodsSku.length - 1}`] ? values[`getUrl${goodsSku.length - 1}`] : ''
    })
    let flag = true;
    if (goodsSku.length !== currentSku.length){
      flag = false;
    }
    if (flag){
      for (var i = 0;i < goodsSku.length; i ++){
        if (goodsSku[i].skuid !== currentSku[i].skuid ||
          goodsSku[i].skuName !== currentSku[i].skuName ||
          goodsSku[i].getUrl !== currentSku[i].getUrl
        ){
          flag = false
        }
      }
    }
    this.setState({goodsSku})
    if (this.state.goodsName === currentData.goodsName &&
      flag &&
      this.state.merchantId === currentData.merchantId &&
      this.state.goodsCategoryId === currentData.goodsCategoryId &&
      this.state.isVirtual === currentData.isVirtual &&
      this.state.tradingValue === currentData.tradingValue &&
      currentData.img.toString() == this.state.img.toString() &&
      this.state.goodsInfo === currentData.goodsInfo){
      this.handleEditNo()
      return
    }
    let goodsBasic = {};
    goodsBasic.id = this.state.id;
    goodsBasic.merchantId = this.state.merchantId;
    goodsBasic.goodsName = this.state.goodsName;
    goodsBasic.goodsCategoryId = this.state.goodsCategoryId;
    goodsBasic.tradingValue = this.state.tradingValue;
    goodsBasic.goodsInfo = this.state.goodsInfo;
    goodsBasic.isVirtual = this.state.isVirtual;
    goodsBasic.goodsStatus = this.state.goodsStatus;
    // console.log(goodsBasic, JSON.stringify(goodsBasic));
    goodsBasic = JSON.stringify(goodsBasic)
    request('/modules/manage/goods/update.htm', {
      method: 'POST',
      body: `goods=${encodeURIComponent(goodsBasic)}&goodsSku=${encodeURIComponent(JSON.stringify(this.state.goodsSku))}&img=${encodeURIComponent(JSON.stringify(this.state.img))}`
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('修改商品成功');
        this.setState({
          editModal: false,
          id:'',
          goodsCode: '',
          goodsName: '',
          merchantId: '',
          goodsStatus: '',
          goodsCategoryId: '',
          tradingValue: '',
          img: [],
          goodsInfo: '',
          isVirtual: '',
          goodsSku: [{skuid: "", skuName: "", inventory: "", getUrl: ''}],
          goodsCategory: [],
          fileList: [],

          noPassModalVisible: false,
          noPassModelList: []
        })
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
      }
    })
  }

  //取消编辑
  handleEditNo = () => {

    this.setState({
      editModal: false,
      goodsCode: '',
      goodsName: '',
      merchantId: '',
      goodsStatus: '',
      goodsCategoryId: '',
      tradingValue: '',
      img: [],
      goodsInfo: '',
      isVirtual: '',
      goodsSku: [{skuid: "", skuName: "", inventory: "", getUrl: ''}],
      goodsCategory: [],
      fileList: []
    })
  }
  //上下架切换
  switchGoodsStatus = (t, r, i) => {
    request('/modules/manage/goods/updateStatus.htm?' + `id=${r.id}&status=${r.goodsStatus === 1 ? 0 : 1}`, {
      method: 'POST',
    }).then(res => {
      if (res.resultCode === 1000) {
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
        message.success('操作成功')
      }
    })
  }

  //搜索参数
  searchGoodsCode = (e) => {
    this.setState({
      searchGoodsCode: e.target.value
    })
  }

  searchSkuid = (e) => {
    this.setState({
      searchSkuid: e.target.value
    })
  }


  searchGoodsName = (e) => {
    this.setState({
      searchGoodsName: e.target.value
    })
  }

  searchMerchantName = (v) => {
    this.setState({
      searchMerchantId: v
    })
  }

  searchStatus = (v) => {
    this.setState({
      searchGoodsStatus: v
    })
  }

  //搜索按钮
  searchList = () => {
    let pageSize = 10;
    let currentPage = 1;
    let searchParams = {};
    if (this.state.searchGoodsCode) {
      searchParams.goodsCode = this.state.searchGoodsCode
    }
    if (this.state.searchSkuid) {
      searchParams.skuid = this.state.searchSkuid
    }
    if (this.state.searchGoodsStatus) {
      searchParams.goodsStatus = this.state.searchGoodsStatus
    }
    if (this.state.searchGoodsName) {
      searchParams.goodsName = this.state.searchGoodsName
    }
    if (this.state.searchMerchantId) {
      searchParams.merchantId = this.state.searchMerchantId
    }
    searchParams = JSON.stringify(searchParams)
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&searchParams=${encodeURIComponent(searchParams)}`;
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

  //新增按钮
  handleAdd = () => {
    this.setState({
      addModal: true
    })

  }

  //确认新增
  handleOk = () => {
    if (!(this.state.merchantId &&
      this.state.goodsName &&
      this.state.goodsCategoryId &&
      this.state.tradingValue &&
      this.state.goodsInfo &&
      this.state.isVirtual
    )){
      message.error('请输入完整商品信息')
      return
    }
    if (this.state.tradingValue % 100){
      message.error('商品价格必须为整百正整数')
      return
    }
    if (!this.state.img.length){
      message.error('商品图片不能为空')
      return
    }
    const {validateFields, getFieldsValue} = this.props.form;
    const {goodsSku} = this.state
    const skuArr = getFieldsValue()
    let skuidArr=[];
    for (var j = 0; j < goodsSku.length ; j++){
      skuidArr.push(skuArr[`skuid${j}`])
    }

    for (var i of skuidArr){
      if (i<=100 ){
        message.error('skuid为大于100的三位数字')
        return
      }
    }
    if (this.isRepeat(skuidArr)){
      message.error('skuid不能重复')
      return
    }
    validateFields((err, values) => {

      goodsSku.map((item, index) => {
        item.skuid = skuArr[`skuid${index}`]
        item.skuName = skuArr[`skuName${index}`]
        item.inventory = skuArr[`inventory${index}`] ? skuArr[`inventory${index}`] : 0
        item.getUrl = skuArr[`getUrl${index}`] ? skuArr[`getUrl${index}`] : ''
      })
      goodsSku[goodsSku.length - 1].skuid = values[`skuid${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].skuName = values[`skuName${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].inventory = values[`inventory${goodsSku.length - 1}`] ? values[`inventory${goodsSku.length - 1}`] : 0
      goodsSku[goodsSku.length - 1].getUrl = values[`getUrl${goodsSku.length - 1}`] ? values[`getUrl${goodsSku.length - 1}`] : ''
    })

    this.setState({goodsSku})
    let goodsBasic = {};
    goodsBasic.merchantId = this.state.merchantId;
    // goodsBasic.goodsCode = this.state.goodsCode;
    goodsBasic.goodsName = this.state.goodsName;
    goodsBasic.goodsCategoryId = this.state.goodsCategoryId;
    goodsBasic.tradingValue = this.state.tradingValue;
    goodsBasic.goodsInfo = this.state.goodsInfo;
    goodsBasic.isVirtual = this.state.isVirtual;
    request('/modules/manage/goods/save.htm', {
      method: 'POST',
      body: `goods=${encodeURIComponent(JSON.stringify(goodsBasic))}&goodsSku=${encodeURIComponent(JSON.stringify(this.state.goodsSku))}&img=${encodeURIComponent(JSON.stringify(this.state.img))}`
    }).then(res => {
      if (res.resultCode === 1000) {
        message.success('添加商品成功');
        this.setState({
          addModal: false,
          goodsCode: '',
          goodsName: '',
          merchantId: '',
          goodsStatus: '',
          goodsCategoryId: '',
          tradingValue: '',
          img: [],
          goodsInfo: '',
          isVirtual: '',
          goodsSku: [{skuid: "", skuName: "", inventory: "", getUrl: ''}],
          goodsCategory: [],
          fileList: []
        })
        this.handleStandardTableChange({current: 1, pageSize: 10})
      }
    })
  }

  //取消新增
  handleNo = () => {
    this.setState({
      addModal: false,
      goodsCode: '',
      goodsName: '',
      merchantId: '',
      goodsStatus: '',
      goodsCategoryId: '',
      tradingValue: '',
      img: [],
      goodsInfo: '',
      isVirtual: '',
      goodsSku: [{skuid: "", skuName: "", inventory: "", getUrl: ''}],
      goodsCategory: [],
      fileList: []
    })
  }

  add = (index) => {
    const {getFieldsValue, resetFields} = this.props.form;
    const {goodsSku} = this.state;
    const skuArr = getFieldsValue()
    goodsSku[index].skuid = skuArr[`skuid${index}`]
    goodsSku[index].skuName = skuArr[`skuName${index}`]
    goodsSku[index].inventory = skuArr[`inventory${index}`] ? skuArr[`inventory${index}`] : 0
    goodsSku[index].getUrl = skuArr[`getUrl${index}`] ? skuArr[`getUrl${index}`] : ''
    goodsSku.push({skuid: "", skuName: "", inventory: "", getUrl: ""});
    this.setState({
      goodsSku: goodsSku
    })

  }

  remove = (index) => {
    const {getFieldsValue, resetFields, setFieldsValue, validateFields} = this.props.form;
    const {goodsSku} = this.state
    validateFields((err, values) => {
      goodsSku[goodsSku.length - 1].skuid = values[`skuid${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].skuName = values[`skuName${goodsSku.length - 1}`]
      goodsSku[goodsSku.length - 1].inventory = values[`inventory${goodsSku.length - 1}`] ? values[`inventory${goodsSku.length - 1}`] : 0
      goodsSku[goodsSku.length - 1].getUrl = values[`getUrl${goodsSku.length - 1}`] ? values[`getUrl${goodsSku.length - 1}`] : ''
    })
    const skuArr = getFieldsValue()
    goodsSku[index].skuid = skuArr[`skuid${index}`]
    goodsSku[index].skuName = skuArr[`skuName${index}`]
    goodsSku[index].inventory = skuArr[`inventory${index}`]?skuArr[`inventory${index}`]:0
    goodsSku[index].getUrl = skuArr[`getUrl${index}`]
    goodsSku.splice(index, 1);
    this.setState(
      {goodsSku: goodsSku},
      )
    resetFields()
  }


  //根据商户名称获取商品分类
  merchant = (v) => {
    const {setFieldsValue} = this.props.form;
    request(`/modules/manage/goods/goodsCategory.htm?merchantId=${v}`).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          goodsCategoryId: '',
          goodsCategory: res.resultData,
          merchantId: v
        }, () => {
          setFieldsValue({'goodsCategoryId': ''})
        })
      }
    })
  }

  //商品分类保存
  goodsCategory = (v) => {

    this.setState({
      goodsCategoryId: v
    })
  }

  //出售价格
  tradingValue = (v) => {
    this.setState({
      tradingValue: v
    })
  }

  //上传图片

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({fileList}) => {
    const img = [];
    fileList.map((item, index) => {
      if (item.status === 'done') {
        if (!item.response){
          img.push(item.url)
        }
        if (item.response && item.response.resultCode === 1000) {
          img.push(item.response.resultData)
        }
      }
    })
    this.setState({fileList, img : img})
  }

  beforeUpload = (file) => {
    let reg = new RegExp(/^image\/\jpeg|gif|jpg|png$/, 'i');
    if (reg.test(file.type)) {
      if (file.size/1048576 <= 5) {
        return true;
      } else {
       message.warning('上传文件不能超过5M');
        return false;
      }
    } else {
      message.warning('图片格式不对');
      return false;
    }
  }
  //编辑图片
  handleEditChange = ({fileList}) => this.setState({fileList})

  //商品详情
  goodsInfo = (info) => {
    this.setState({
      goodsInfo: info
    })
  }

  //商品编号
  goodsCode = (e) => {
    this.setState({
      goodsCode: e.target.value
    })
  }

  //商品名称
  goodsName = (e) => {
    this.setState({
      goodsName: e.target.value
    })
  }

  //是否虚拟
  isVirtual = (v) => {
    this.setState({isVirtual: v})
  }

  //导入商品弹窗
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

  //忽略继续上传  确认无误上传
  continueUpload = () => {
    request('/modules/manage/goods/importGoods.htm').then(res => {
      if (res.resultCode === 1000){
        message.success('上传成功')
        this.setState({
          noPassModalVisible: false
        })
        this.handleStandardTableChange({current: 1, pageSize: 10})
      }
    })
  }

  //取消上传
  cancelUpload = () => {
    this.setState({
      noPassModelList: [],
      noPassTableLoading: false,
      noPassModalVisible:false
    })
  }


  //修改库存按钮
  showmodalEditInventory = (t, r, i) => {
    let editInventoryData = {};
    editInventoryData.skuName = r.skuName;
    editInventoryData.inventory = r.inventory;
    this.setState({
      goodsSkuId : r.goodsSkuId,
      editInventoryVisible:　true,
      editInventoryData: editInventoryData,
      editInventoryGoodName: r.goodsName,
      currentInventory: r.inventory
    })
  }

  //增加或减少
  addOrDecrease = (e) => {
    this.setState({
      addOrDecrease: e.target.value
    })
  }

  //数量
  handleCount = (v) => {
    this.setState({
      count: v
    })
  }

  //修改库存确认
  handleEditInventoryOk = () => {
    if (!this.state.addOrDecrease && this.state.count > this.state.currentInventory){
      message.warning('减少量不能大于当前库存');
      return;
    }
    request('/modules/manage/goods/updateGoodsSkuInventory.htm', {
      method: 'POST',
      body: `goodsSkuId=${this.state.goodsSkuId}&number=${this.state.count}&flag=${this.state.addOrDecrease}`
    }).then(res => {
      if (res.resultCode === 1000){
        this.setState({
          editInventoryVisible: false,
          editInventoryData: {},
          editInventoryGoodsName: '',
          addOrDecrease: '',
          count: '',
          currentInventory: ''
        })
        this.handleStandardTableChange({current: this.state.formValues.currentPage, pageSize: 10})
        message.success('修改成功')
      }
    })
  }

  //修改库存取消
  handleEditInventoryNo = () => {
    this.setState({
      editInventoryVisible: false,
      editInventoryData: {},
      editInventoryGoodsName: '',
      addOrDecrease: '',
      count: '',
      currentInventory: ''
    })
  }

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {previewVisible, previewImage, fileList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const props = {
      name: 'file',
      action: '/modules/manage/goods/verifyGoods.htm',
      onChange:((info) => {
        if (info.file.status === 'done') {
          this.handleUpload(info)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }).bind(this)
    };
    const colimusEditIInventoryTable = [
      {
        title: 'sku属性',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '库存量',
        dataIndex: 'inventory',
        key: 'inventory'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <RadioGroup
                onChange={this.addOrDecrease.bind(this)}
                value={this.state.addOrDecrease}>
                <Radio value={true}>添加</Radio>
                <Radio value={false}>减少</Radio>
              </RadioGroup>
            </div>
          )
          }
      },
      {
        title: '数量',
        dataIndex: 'number',
        key: 'number',
        render: () => {
          return (
            <InputNumber maxLength={'7'} max={9999999} onChange={this.handleCount}/>
          )
        }
      },
    ];
    const columnsNoPassTable = [
      {
        title: '商品编号',
        dataIndex: 'goodsCode',
        key: 'goodsCode'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: '商户ID',
        dataIndex: 'merchantId',
        key: 'merchantId',
      },
      {
        title: '是否虚拟物品',
        dataIndex: 'isVirtual',
        key: 'isVirtual'
      },
      {
        title: '出售价格',
        dataIndex: 'tradingValue',
        key: 'tradingValue'
      },
      {
        title: '商品详情',
        dataIndex: 'info',
        key: 'info'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }
    ];
    return (
      <PageHeaderLayout title="商品管理">
        <Form layout={'inline'}>
          <FormItem label={'商品编号'}>
            <Input type="text"
                   value={this.state.searchGoodsCode}
                   onChange={this.searchGoodsCode.bind(this)}
            />
          </FormItem>
          <FormItem label={'skuId'}>
            <Input type="text"
                   value={this.state.searchSkuid}
                   onChange={this.searchSkuid.bind(this)}
            />
          </FormItem>
          <FormItem label={'商品名称'}>
            <Input type="text"
                   value={this.state.searchGoodsName}
                   onChange={this.searchGoodsName.bind(this)}
            />
          </FormItem>
          <FormItem label={'商家'}>
            <Select defaultValue="" style={{width: 120}}
                    value={this.state.searchMerchantId}
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
                    value={this.state.searchGoodsStatus}
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
                  onClick={this.handleAdd.bind(this)}
          >
            新增商品
          </Button>
          <Upload  {...props}>
            <Button style={{marginRight: 30, marginTop: 10}}>
              导入商品
            </Button>
          </Upload>
        </Form>
        <Table
          marginTop={20}
          bordered
          columns={this.state.columns}
          dataSource={this.state.tableData}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal title="新增商品"
               width={700}
               onOk={this.handleOk}
               destroyOnClose={true}
               onCancel={this.handleNo}
               visible={this.state.addModal}>

          {/*{this.renderAdvancedForm()}*/}
          <Form layout="inline" style={{display: 'flex', flexDirection: 'column'}}>
            < FormItem
              label="商品名称">
              {getFieldDecorator('goodsName', {
                initialValue: this.state.goodsName
              })
              (
                <Input onChange={this.goodsName} placeholder="请输入" maxLength='50' style={{width: '80%'}}/>
              )
              }
            </FormItem>
            < FormItem
              label="是否为虚拟物品">
              {getFieldDecorator('isVirtual', {
                initialValue: this.state.isVirtual
              })
              (<Select onChange={this.isVirtual.bind(this)} style={{width: 120}}>
                <Option value='0'>不是</Option>
                <Option value='1'>是</Option>
              </Select>)
              }
            </FormItem>
            <span style={{marginRight: 15, marginTop: 10, display: 'block'}}>SKU</span>
            {
              this.state.goodsSku.map((element, index) => (
                <span key={index}>

                  <FormItem>
                    <Tooltip title="大于100的3位数字" trigger='focus'>
                    {getFieldDecorator(`skuid${index}`, {
                      initialValue: element.skuid,

                    })(

                      <Input placeholder="skuid" maxLength='3' style={{width: 100}}/>

                    )}
                    </Tooltip>
                  </FormItem>

                  <FormItem>
                    {getFieldDecorator(`skuName${index}`, {
                      initialValue: element.skuName,
                      trigger: 'onChange',
                      rules: [{
                        required: true,
                        message: '请输入sku属性!',
                      },],
                    })(
                      <Input placeholder="sku属性" maxLength='20' style={{width: 100}}/>,
                    )}
                  </FormItem>
                <FormItem>
                    {getFieldDecorator(`inventory${index}`, {
                      initialValue: 0,
                      trigger: 'onChange',
                    })(
                      <Input maxLength='10' style={{width: 100}}/>,
                    )}
                  </FormItem>
                  {
                    this.state.isVirtual === '1' ?
                      <FormItem>
                        {getFieldDecorator(`getUrl${index}`, {
                          initialValue: element.getUrl ? element.getUrl : '',
                        })(
                          <Input placeholder="领取地址" maxLength='20' style={{width: 150}}/>,
                        )}
                      </FormItem>
                      : null
                  }
                  {index < 9 && <Button
                    disabled={!getFieldValue(`skuid${index}`) || !getFieldValue(`skuName${index}`) || index < this.state.goodsSku.length - 1}
                    style={{verticalAlign: 'middle', marginTop: 7}} shape="circle" size="small" icon="plus"
                    type="primary" onClick={() => this.add(index)}/>}
                  {index > 0 &&
                  <Button style={{verticalAlign: 'middle', marginTop: 7}} shape="circle" size="small" icon="minus"
                          type="default" onClick={() => this.remove(index)}/>}
                </span>
              ))
            }
            < FormItem
              label="供货商家">
              {getFieldDecorator('merchantId', {
                initialValue: this.state.merchantId
              })
              (<Select onChange={this.merchant.bind(this)} style={{width: 200}}>
                {
                  this.state.merchantList.map((item, index) => {
                    return <Option key={index} value={item.id}>
                      {item.merchantName}
                      {
                        item.status == 0 ? '(该商家已关闭)' : null
                      }
                      </Option>
                  })

                }
              </Select>)
              }
            </FormItem>
            < FormItem
              label="商品分类">
              {getFieldDecorator('goodsCategoryId', {
                initialValue: this.state.goodsCategoryId
              })
              (<Select onChange={this.goodsCategory.bind(this)} style={{width: 120}}>
                {
                  this.state.goodsCategory.map((item, index) => {
                    return <Option key={index} value={item.id}>{item.category}</Option>
                  })

                }
              </Select>)
              }
            </FormItem>
            <FormItem label={'出售价格/元'}>
              <Tooltip
                title="请输入整百正整数"
                trigger={'focus'}>
                {getFieldDecorator('tradingValue', {
                  initialValue: this.state.tradingValue
                })
                (
                  <InputNumber
                    max={1000} min={0} step={100} precision={2}
                    onChange={this.tradingValue.bind(this)}/>
                )}
              </Tooltip>
            </FormItem>
            <div style={{marginTop: 10}}>
              商品图片
              <div className="clearfix">
                <Upload
                  name='file'
                  action="/modules/manage/goods/imgUpdate.htm"
                  listType="picture-card"
                  defaultFileList={fileList}
                  multiple={true}
                  beforeUpload={this.beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length > 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </div>
            </div>
            <GoodsInfo goodsInfo={this.goodsInfo} info={this.state.goodsInfo}></GoodsInfo>
          </Form>
        </Modal>
        <Modal
          title="编辑商品"
          width={700}
          destroyOnClose={true}
          maskClosable={false}
          onOk={this.handleEditOk}
          onCancel={this.handleEditNo}
          visible={this.state.editModal}>

          {/*{this.renderAdvancedForm()}*/}
          <Form layout="inline" style={{display: 'flex', flexDirection: 'column'}}>
            < FormItem
              label="商品名称">
              {getFieldDecorator('goodsName', {
                initialValue: this.state.goodsName
              })
              (
                <Input onChange={this.goodsName} placeholder="请输入" maxLength='50' style={{width: '80%'}}/>
              )
              }
            </FormItem>
            < FormItem
              label="是否为虚拟物品">
              {getFieldDecorator('isVirtual', {
                initialValue: this.state.isVirtual === 0 ? '不是' : '是'
              })
              (<Select onChange={this.isVirtual.bind(this)} style={{width: 120}}>
                <Option value='0'>不是</Option>
                <Option value='1'>是</Option>
              </Select>)
              }
            </FormItem>

            <span style={{marginRight: 15, marginTop: 10, display: 'block'}}>SKU</span>
            {
              this.state.goodsSku.map((element, index) => (
                <span key={index}>
                  <FormItem>
                    {getFieldDecorator(`skuid${index}`, {
                      initialValue: element.skuid,
                      rules: [{
                        required: true,
                        message: '请输入skuid!',
                      },],
                    })(

                        <Input  placeholder="skuid" maxLength='3' style={{width: 100}}/>

                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator(`skuName${index}`, {
                      initialValue: element.skuName,
                      trigger: 'onChange',
                      rules: [{
                        required: true,
                        message: '请输入sku属性!',
                      },],
                    })(
                      <Input placeholder="sku属性" maxLength='20' style={{width: 100}}/>,
                    )}
                  </FormItem>

                <FormItem>
                    {getFieldDecorator(`inventory${index}`, {
                      initialValue: element.inventory,
                    })(
                      <Input disabled={true} placeholder="库存量" maxLength='10' style={{width: 100}}/>,
                    )}
                  </FormItem>
                  {

                    this.state.isVirtual == 1 ?
                      <FormItem>
                        {getFieldDecorator(`getUrl${index}`, {
                          initialValue: element.getUrl ? element.getUrl : '',
                        })(
                          <Input placeholder="领取地址" maxLength='20' style={{width: 150}}/>,
                        )}
                      </FormItem>
                      : null
                  }
                  {index < 9 && <Button
                    disabled={!getFieldValue(`skuid${index}`) || !getFieldValue(`skuName${index}`) || index < this.state.goodsSku.length - 1}
                    style={{verticalAlign: 'middle', marginTop: 7}} shape="circle" size="small" icon="plus"
                    type="primary" onClick={() => this.add(index)}/>}
                  { this.state.goodsSku.length !== 1 &&
                  <Button disabled={index<=this.state.length - 1} style={{verticalAlign: 'middle', marginTop: 7}} shape="circle" size="small" icon="minus"
                          type="default" onClick={() => this.remove(index)}/>}
                </span>
              ))
            }
            < FormItem
              label="供货商家">
              {getFieldDecorator('merchantId', {
                initialValue: this.state.merchantId
              })
              (<Select disabled={true} onChange={this.merchant.bind(this)} style={{width: 200}}>
                {
                  this.state.merchantList.map((item, index) => {
                    return <Option key={index} value={item.id}>
                      {item.merchantName}
                      {
                        item.status == 0 ? '(已关闭)' : null
                      }
                      </Option>
                  })

                }
              </Select>)
              }
            </FormItem>
            < FormItem
              label="商品分类">
              {getFieldDecorator('goodsCategoryId', {
                initialValue: this.state.goodsCategoryId
              })
              (<Select disabled={true} onChange={this.goodsCategory.bind(this)} style={{width: 120}}>
                {
                  this.state.goodsCategory.map((item, index) => {
                    return <Option key={index} value={item.id}>{item.category}</Option>
                  })

                }
              </Select>)
              }
            </FormItem>
            <FormItem label={'出售价格/元'}>
              <Tooltip
                title="请输入整百正整数"
                trigger={'focus'}>
                {getFieldDecorator('tradingValue', {
                  initialValue: this.state.tradingValue
                })
                (
                  <InputNumber
                    max={1000} min={0} step={100} precision={2}
                    onChange={this.tradingValue.bind(this)}/>
                )}
              </Tooltip>
            </FormItem>
            <div style={{marginTop: 10}}>
              商品图片
              <div className="clearfix">
                <Upload
                  name='file'
                  action="/modules/manage/goods/imgUpdate.htm"
                  listType="picture-card"
                  defaultFileList={fileList}
                  multiple={true}
                  beforeUpload={this.beforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length > 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </div>
            </div>
            <GoodsInfo goodsInfo={this.goodsInfo} info={this.state.goodsInfo}></GoodsInfo>
          </Form>
        </Modal>
        <Modal
          width={1000}
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
          />
          <Button  onClick={this.continueUpload.bind(this)}>忽略以上数据</Button>
          <Button  onClick={this.cancelUpload.bind(this)}>取消上传</Button>
        </Modal>
        <Modal
              width={600}
              title='修改库存'
              onOk={this.handleEditInventoryOk}
              onCancel={this.handleEditInventoryNo}
              visible={this.state.editInventoryVisible}>
          <h3>商品名称: {this.state.editInventoryGoodName}</h3>
          <Table
            pagination={false}
            bordered
            columns={colimusEditIInventoryTable}
            dataSource={[this.state.editInventoryData]}
          />
        </Modal>
      </PageHeaderLayout>
    )
  }
}
