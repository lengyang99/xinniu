import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Select, Form, Modal, DatePicker, Input, InputNumber, Button, Message} from 'antd'
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  queryChannelList,
  channelListDateExport,
  getChannelDateList
} from '../../services/channelmanage.js';

import {
	queryCurrent
} from '../../services/user.js';


const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,

      //渠道列表
      channelModelListModelList: [],
      channelModelListPg : {},


      //渠道
      channelList:[],

      ChannelModelList: [],

      //渠道
      ChannelList:[],

      queryStartTime:'',
      queryEndTime:'',
      queryChannelId:'',
 
      userInfo:''
    }
  }

  
  getChannelList(){
	  queryChannelList().then(res => {
          if (res.resultCode === 1000) {
          this.setState({
            channelList: res.resultData,
            tableLoading: false
          })
        } else {
          Message.error('网络错误，请重试')
        }
      })
  }
  
  
  getUserInfo(){
	  queryCurrent().then(res => {
	        if (res.resultCode === 1000) {
	        this.setState({
	          userInfo: res.resultData,
	          tableLoading: false
	        })
	      } else {
	        Message.error('网络错误，请重试')
	      }
	    })
  }
  
  /**获取数据**/
  getData() {
    this.setState({
      tableLoading: true
    });
   if(this.state.userInfo.role==="partner"){
	   
   }else{
	   this.getChannelList()
   }
        


    this.getTableData();
  }

  getTableData(page){
    page = page||{current:1,pageSize:10};
    getChannelDateList({currentPage:page.current||1,pageSize:page.pageSize||10,searchParams:JSON.stringify({
        startTime:this.state.queryStartTime,
        endTime:this.state.queryEndTime,
        channelId:this.state.queryChannelId,
        timeId:this.state.queryTimeId
      })}).then(res => {
      if (res.resultCode === 1000) {
      this.setState({
        ChannelModelListModelList: res.resultData,
        channelModelListPg:res.page,
        tableLoading: false
      })
    } else {
      Message.error('网络错误，请重试')
    }
  })
  }
  
  createmodalOption(){
    let ops = [];
    ops.push(<Option key={'-1'}>请选择....</Option>);
    this.state.channelList.forEach( (c) => {
      ops.push(<Option key={c.id}>{c.name}</Option>);
  });
    return ops;
  }
  queryChangeStartTime(time){
    this.setState({
      queryStartTime:time?time.format('YYYY-MM-DD'):''
    });
  }

  queryChangeDisable(d){
    return d<=moment(this.state.queryStartTime)
  }

  queryChangeEndTime(time){
    this.setState({
      queryEndTime: time?time.format('YYYY-MM-DD'):''
    });
  }

  queryChangeId(id){
    this.setState({
      queryChannelId: id
    });
  }


  queryTimeId(timeId){
    this.setState({
      queryTimeId: timeId
    });
  }
  exportData(){
	  channelListDateExport({searchParams:JSON.stringify({
        startTime:this.state.queryStartTime,
        endTime:this.state.queryEndTime,
        channelId:this.state.queryChannelId,
        timeId:this.state.queryTimeId
      })})
  }



  /**生命周期**/
  componentDidMount() {
	this.getUserInfo()
    this.getData()
  }

  render() {
    const columnsFormodalTable = [
      {
        title: '时间',
        dataIndex: 'dates',
        key: 'dates',
        width:120
      },
      {
        title: '渠道名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '合作模式',
        dataIndex: 'cooperation_model',
        key: 'cooperation_model',
        width: 120,
        render: (text,record) => {
        var r = record;
    return (
      <div>
      <p>Cpa: {r.register_each_fee}</p>
    <p>Cps: {r.loan_fee}%+{r.loan_each_fee}</p>
    </div>
  )}
  },
    {
      title: '注册用户数',
        dataIndex: 'registers',
      key: 'registers',
    },
    {
      title: '认证用户数',
        dataIndex: 'auth',
      key: 'auth',
    },
    {
      title: '下单用户数',
        dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: '批款用户数',
        dataIndex: 'mu',
      key: 'mu',
    },

  ];
   
    return (
      <div>
      <Card>
      <Form layout={'inline'} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  <FormItem label={'时间'}>
      <DatePicker  onChange={this.queryChangeStartTime.bind(this)}  />
    --
    <DatePicker disabledDate={this.queryChangeDisable.bind(this)} onChange={this.queryChangeEndTime.bind(this)}  />
    </FormItem>
    <FormItem style={this.state.userInfo.role==="partner"?{display:"none"}:{}} label={'渠道'} >
  <Select style={{width:100}} defaultValue={'请选择.....'} onChange={this.queryChangeId.bind(this)} >
    {this.createmodalOption()}
  </Select>
    </FormItem>

    <Button style={{marginLeft:-60}} type={'primary '} htmlType="submit" onClick={this.getTableData.bind(this)} >搜索</Button>

    <Button style={{marginLeft:-60}} type={'primary '} onClick={this.exportData.bind(this)} >导出为EXCEL</Button>

    </Form>

    <Table
    dataSource={this.state.ChannelModelListModelList}
    columns={columnsFormodalTable}
    pagination={this.state.channelModelListPg}
    bordered rowKey={record => record.id+record.dates}
    loading={this.state.tableLoading}
    onChange={this.getTableData.bind(this)}
    />
    </Card>
    </div>
  );
  }
}
