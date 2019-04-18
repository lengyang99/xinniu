import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Select, Form, Modal, DatePicker, Input, InputNumber,Upload, Icon,Button, message} from 'antd'
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {
  importValidateData,
  successList,
  exportValidateData,
  failList,
  toIgnore,
  reEdit

} from '../../services/tianqiValidate.js';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
export default class hitLibraryList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,

      //数据列表
      dataModelList: [],
      dataModelListPg : {},
      noPassModalVisible: false,
      noPassTableLoading:false,
      noPassModelList: []

    }
  }


  getTableData(page){
    page = page||{current:1,pageSize:10};
    successList({currentPage:page.current||1,pageSize:page.pageSize||10}).then(res => {
      if (res.resultCode === 1000) {
        this.setState({
          dataModelList: res.resultData,
          dataModelListPg:res.page,
          tableLoading: false
        })
      } else {
        message.error('网络错误，请重试')
      }
    })
  }

  getNoPassTableData(){
    failList().then(res => {
      if (res.resultCode === 1000) {
        if(!res.resultData || res.resultData.length ==0){
            Modal.confirm({
              title: '确认导入',
              content: '信息无误，确认导入',
              okText: '确认',
              cancelText: '取消',
              onCancel:()=>{this.reEditData();},
              onOk:()=>{this.ignoreData();this.getTableData();}
            });
        }else{
          this.setState({
            noPassModelList: res.resultData,
            noPassTableLoading: false,
            noPassModalVisible:true
          })
        }
      } else {
        message.error(res.resultmessage)
      }
    })
  }


  exportData(){
    exportValidateData()
  }
  importData(){
    importValidateData();
  }

  /**获取数据**/
  getData() {
    this.setState({
      tableLoading: true
    });
    this.getTableData();
  }

  /**生命周期**/
  componentDidMount() {
    this.getData()
  }

  handleNoPassModalCancel(){
    this.setState({
       noPassModalVisible: false
    })
  }

  ignoreData(){
    toIgnore();
    this.handleNoPassModalCancel();
    this.getTableData();
  }

  reEditData(){
    reEdit();
    this.handleNoPassModalCancel()
  }

  render() {

    const columnsFormodalTable = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '身份证',
        dataIndex: 'id_no',
        key: 'id_no',
      },
      {
        title: '手机号',
        dataIndex: 'phone_no',
        key: 'phone_no'
      }
    ];

    const columnsNoPassTable = [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '身份证',
        dataIndex: 'id_no',
        key: 'id_no',
      },
      {
        title: '手机号',
        dataIndex: 'phone_no',
        key: 'phone_no'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }
    ];

    const props = {
      name: 'file',
      action: '/modules/manage/validateData/import.htm',
      onChange:((info) => {
        console.log(info);
        if (info.file.status === 'done') {
          this.getNoPassTableData();
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }).bind(this)
    };




    return (
      <div>
        <h1>数据撞库
          <Upload style={{marginLeft:60}} {...props}>
            <Button>
              <Icon type="upload" /> 上传excel
            </Button>
          </Upload>
        </h1>
        <Table
          dataSource={this.state.dataModelList}
          columns={columnsFormodalTable}
          pagination={this.state.dataModelListPg}
          bordered rowKey={record => record.id}
          loading={this.state.tableLoading}
          onChange={this.getTableData.bind(this)}
        />
        <label>合计通过{this.state.dataModelListPg.total}条</label>
        <Button style={{marginLeft:60}} onClick={this.exportData.bind(this)} >导出为EXCEL</Button>

        <Modal
          title="错误数据"
          visible={this.state.noPassModalVisible}
          onCancel={this.reEditData.bind(this)}
          footer = {null}
        >
          <Table
            dataSource={this.state.noPassModelList}
            columns={columnsNoPassTable}
            bordered rowKey={record => record.id}
            loading={this.state.noPassTableLoading}
            onChange={this.getNoPassTableData.bind(this)}
          />
          <Button  onClick={this.ignoreData.bind(this)}>忽略以上数据</Button>
          <Button  onClick={this.reEditData.bind(this)}>重新编辑</Button>
        </Modal>
      </div>
    );
  }
}
