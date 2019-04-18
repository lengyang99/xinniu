import React, {PureComponent} from 'react';
import {Row, Col, Table, Card, Select, Form, Modal, DatePicker, Input, InputNumber, Button, Message} from 'antd'
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {processTransformation,processTransformationExport,} from '../../services/statisticsManage';

const Search = Input.Search;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: false,
      processTransformationList: [],
      queryDate : moment().format("YYYY-MM-DD"),
    }
  }

  /**获取数据**/
  getData() {
	  this.setState({
		  tableLoading:true
	  });
	  processTransformation({
		  date:this.state.queryDate
	  }).then(res => {
      if(res.resultCode === 1000){
			  this.setState({
				  tableLoading:false,
				  processTransformationList:res.resultData
			  });
		  }
	  });
  }

  handleSearch(e){
	  e.preventDefault();
	  const { form } = this.props;
	  form.validateFields((err, fieldsValue) => {
		  this.setState({
			  queryDate:fieldsValue.date.format('YYYY-MM-DD').toString()
		  },()=>{
			  this.getData();
		  });
	  });

  }

  exportData(){
	  processTransformationExport({
		  date:this.state.queryDate
	  })
  }

  /**生命周期**/
  componentDidMount() {
    this.getData()
  }

  render() {
	const { getFieldDecorator } = this.props.form;
    const columnsFormodalTable = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '用户端',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '推送用户数',
        dataIndex: 'pushCount',
        key: 'pushCount',
      },
      {
        title: '完成实名认证',
        dataIndex: 'realNameCount',
        key: 'realNameCount',
      },
      {
        title: '完成联系人',
        dataIndex: 'contactCount',
        key: 'contactCount',
      },
      {
        title: '进入绑卡',
        dataIndex: 'inBindCardCount',
        key: 'inBindCardCount',
      },
      {
        title: '完成绑卡',
        dataIndex: 'bindCardCount',
        key: 'bindCardCount',
      },
      {
        title: '审核通过',
        dataIndex: 'auditPassCount',
        key: 'auditPassCount	',
      },
      {
        title: '完成贷款确认',
        dataIndex: 'confirmCount',
        key: 'confirmCount'
      },
      {
        title: '完成贷款确认/推送',
        dataIndex: 'oDrRate',
        key: 'oDrRate'
      }
    ];

    return (
      <div>
        <Card>
          <Form layout={'inline'} style={{alignItems: 'right', justifyContent: 'space-between'}}>

          	<FormItem label={'日期'}>
          		{
          			getFieldDecorator("date",{
          				initialValue:moment()
          			})(
          					<DatePicker allowClear={false}  />
          					)
          		}

            </FormItem>
	        <Button type={'primary '} style={{marginLeft:60}} htmlType="submit" onClick={this.handleSearch.bind(this)} >搜索</Button>
	        <Button type={'primary '} style={{marginLeft:60}} onClick={this.exportData.bind(this)} >导出为EXCEL</Button>
          </Form>

          <Table
            dataSource={this.state.processTransformationList}
            columns={columnsFormodalTable}
            pagination={false}
            bordered rowKey={record => record.name}
            loading={this.state.tableLoading}
          />
        </Card>
      </div>
    );
  }
}
