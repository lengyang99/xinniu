/**
 * Created by Administrator on 2018/1/5 0005.
 */

import React, { Component } from 'react';
import { Table } from 'antd';

class ListTable extends Component{
  state = {
    data: [],
    formValues: {
      userId: '',
      currentPage: 1,
      pageSize: 5,
    },
    loading: false,
    pagination:{},
  };

  handleTableChange = (pagination) => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({
      formValues:{
        ...params
      }
    });
    //发送父请求
    this.fetch(params);
  }

  fetch = (params) => {
    var me = this;
    const { listUrl ,dispatch} = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: listUrl,
      payload: params,
      callback:(result)=>{
        if(result.resultCode === 1000 ){
          me.setState({
            data: result.resultData,
            pagination: result.page?result.page:false,
            loading: false,
          })
        }else{
          me.setState({
            loading: false,
          })
        }
      }
    })
  }

  componentWillMount() {
    var { userId } = this.props;
    this.setState({
      formValues:{
        userId: userId,
        currentPage: 1,
        pageSize: 5,
      }
    });
    this.fetch({
      userId: userId,
      currentPage: 1,
      pageSize: 5,
    });
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.data) return true;
    else return false;
  }

  render(){
    const { columns } = this.props;
    const { data, pagination, loading } = this.state;
    return <Table columns={ columns }
                  rowKey={ record => record.id }
                  dataSource={data}
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTableChange} />
  }
}

export default ListTable;


