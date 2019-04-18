import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';


class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows == undefined || nextProps.selectedRows.length === 0  ) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo, } = this.state;
    const { data: { list, pagination }, loading , columns , rowSelectionEdit } = this.props;

    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record =>{
        return {
           disabled: record.status != 31 ,
        }
      },
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
        </div>
        {
          rowSelectionEdit? <Table
            loading={loading}
            bordered
            rowKey={ record => record.key }
            rowSelection={rowSelection}
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
          /> : <Table
            loading={loading}
            bordered
            rowKey={ record => record.key }
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
          />
        }
      </div>
    );
  }
}

export default StandardTable;
