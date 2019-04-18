import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Table,Button } from 'antd';
import request from '../../utils/request';


export default class Demo extends PureComponent {
  state = {
    columns: [{
      title: '订单号',
      dataIndex: 'orderNo',
    }, {
      title: '客户名称',
      dataIndex: 'name',
    }, {
      title: '证件号码',
      dataIndex: 'idNo',
    }, {
      title: '年龄',
      dataIndex: 'age',
    },
    {
        title: '放款日期',
        dataIndex: 'loanTime',
    },
    {
      title: '到期日期',
      dataIndex:'rentEndTime'
    },
      {
        title: '产品期限',
        dataIndex: 'peroidDay',
      }, 
      {
        title: '贷款金额',
        dataIndex: 'principal',
      },
      
      {
        title: '实际到账金额',
        dataIndex: 'loanAmount',
      },
      // {
      //   title: '商品费用',
      //   dataIndex: 'prodFee',
      // },
      {
        title: '商品费',
        dataIndex: 'goodsPrice',
      },
      {
        title: '性别',
        dataIndex: 'sex',
      },
      {
        title: '借款次数',
        dataIndex: 'orderCount',
      },
      {
        title: '注册客户端',
        dataIndex: 'registerClient',
      },
      {
        title: '审核渠道',
        dataIndex: 'checkChannel',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
    }],
    data: [],
    formValues: {
      pageSize: 10,
      currentPage: 1
    },
    pg:{}
  };
  exportData = () => {
    window.location.href ='/modules/manage/urge/todayRepayInfoExport.htm?';
  }

   //获取列表数据
   getList(params){
    let pageSize=params.pageSize;
    let currentPage=params.currentPage;
    let paramsStr = `pageSize=${pageSize}&currentPage=${currentPage}`;
    return request('/modules/manage/urge/todayRepayInfo.htm',{
      method: 'POST',
      body: paramsStr
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
      this.setState({
        data: res.resultData,
        pg: res.page
      });
    });
  }

  componentDidMount(){
    // this.getList().then(rep=>{
    //   // console.log(JSON.stringify(rep));
    //   this.setState({
    //     data: rep.resultData
    //   })
    // })
    this.handleStandardTableChange({current: 1, pageSize: 10});
  };


  render() {
    return (
        <PageHeaderLayout title="当天到期表">
            <Button style={{marginRight: 16}} type={'primary '}
                    onClick={this.exportData}>导出为EXCEL</Button>
            <Table
                bordered
                columns={this.state.columns}
                dataSource={this.state.data}
                pagination={this.state.pg}
                onChange={this.handleStandardTableChange.bind(this)}
            />
        </PageHeaderLayout>
            
    );
  }
}
