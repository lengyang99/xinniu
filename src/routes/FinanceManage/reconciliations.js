import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Table,Modal } from 'antd';
import request from '../../utils/request';


export default class Demo extends PureComponent {
  state = {
    columns: [{
      title: '日期',
      dataIndex: 'accountDate',
      width: '16%',
    }, {
      title: '订单笔数',
      dataIndex: 'orderNumber',
      width: '14%',
    }, {
      title: '放款金额',
      dataIndex: 'orderAmount',
      width: '14%',
    }, {
      title: '易宝订单笔数',
      dataIndex: 'ybNumber',
      width: '14%',
    },
    {
        title: '易宝放款金额',
        dataIndex: 'ybAmount',
        width: '14%',
      },
      {
        title: '对账结果',
        width: '14%',
        render: (record) => {
          const accountStatus = record.accountStatus;
          let statusStr = accountStatus == '10' ? '成功' : accountStatus == '20' ?'失败':'未确认';
          return(
            <span>{statusStr}</span>
          )
        }
      }, {
      title: '查看详情',
      key: 'action',
      width: '14%',
      render: (record) => {
        const id = record.id;
        return(
          <a onClick={()=>{this.setState({id:id},()=>this.showModal({current: 1, pageSize: 10}))}}>对账详情</a>
        )
      }

    }],
    columnsDetails: [{
      title: '易宝订单号',
      width: '16%',
      render: (record)=>{
        const status = record.status;
        const ybOrderNo = record.ybOrderNo;
        return(this.redCode(status,ybOrderNo));
      }
    },{
      title: '易宝订单金额',
      width: '14%',
      render: (record)=>{
        const status = record.status;
        const ybAmount = record.ybAmount;
        return(this.redCode(status,ybAmount));
      }
    },{
      title: '数据库订单号',
      width: '14%',
      render: (record)=>{
        const status = record.status;
        const orderNo = record.orderNo;
        return(this.redCode(status,orderNo));
      }
    },
    {
        title: '数据库金额',
        width: '14%',
        render: (record)=>{
          const status = record.status;
          const amount = record.amount;
          return(this.redCode(status,amount));
        }
      },
      {
        title: '电话',
        width: '14%',
        render: (record)=>{
          const status = record.status;
          const phone = record.phone;
          return(this.redCode(status,phone));
        }
      }],
    data :[],
    detail :[],
    visible:false,
    pg:{},
    formValues: {
      pageSize: 10,
      currentPage: 1
    },
    pgDetail:{},
    formValuesDetail:{
      pageSize: 10,
      currentPage: 1
    },
    id:''
  };
  showModal = (page) => {
    this.setState({
      visible: true,
    });
    // this.getDetails(id).then(
    //   rep=>{
    //     console.log(JSON.stringify(rep));
    //     this.setState({
    //       detail:rep.resultData
    //     })
    //   }
    // )
    this.handleStandardTableChangeDetail(page);
  }
  redCode = (status,text)=>{
        if (status != 10){
          return <span style={{color:'red'}}>{text}</span>
        }else{
          return <span>{text}</span>
        }
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  //获取对账列表
  getList(params){
    let pageSize=params.pageSize;
    let currentPage=params.currentPage;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}`;
    return request('/modules/manage/checkAccount/checkAccount.htm',{
      method: 'POST',
      body: paramsStr
    })
  }
  //对账列表分页处理
  handleStandardTableChange = (pagination) => {
    console.log(pagination);
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
      this.setState({
        data: res.resultData,
        pg: res.page
      });
    });
  }
    //对账详情分页处理
    handleStandardTableChangeDetail = (pagination) => {
      const {formValuesDetail,id} = this.state;
      const params = {
        ...formValuesDetail,
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.setState({
        formValuesDetail: {
          ...params
        }
      });

      this.getDetails(id,params).then(res => {
        this.setState({
          detail: res.resultData,
          pgDetail: res.page
        });
      });
    }
  //获取对账详情
  getDetails = (id,params) => {
    let  pageSize=params.pageSize;
    let  currentPage=params.currentPage;
    let  checkId=id;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}&checkId=${checkId}`;
    return request('/modules/manage/checkAccount/checkDetail.htm',{
      method: 'POST',
      body: paramsStr
    })
  }

  componentDidMount(){
    // this.getList().then(rep=>{
    //  this.setState({
    //    data:rep.resultData
    //  })
    // })
    // .catch(err=>{
    //   console.log(JSON.stringify(err))
    // })
    this.handleStandardTableChange({current: 1, pageSize: 10});
  }

  render() {
    return (
      <PageHeaderLayout title="财务对账">
        <Table
          bordered
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pg}
          onChange={this.handleStandardTableChange.bind(this)}
        />
        <Modal
          title="对账详情"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          width={1000}
        >
          <Table
            bordered
            columns={this.state.columnsDetails}
            dataSource={this.state.detail}
            pagination={this.state.pgDetail}
            onChange={this.handleStandardTableChangeDetail.bind(this)}
          />
        </Modal>
      </PageHeaderLayout>

    );
  }
}
