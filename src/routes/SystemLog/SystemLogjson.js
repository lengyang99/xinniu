import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Card, Spin } from 'antd';
import AjaxUtil from '../../utils/ajaxRequest';
import styles from './systemlog.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SerachFormComponent from '../../components/SystemLog/SearchParams';
import TabsearchForm from '../../components/SystemLog/TabsearchForm';
import TabTree from '../../components/SystemLog/TabTree';

const TabPane = Tabs.TabPane;


@connect(state => ({

}))
export default class TableList extends Component {
  state={
    activekey: '1',
    datalistTab1: {},
    datalistTab2: {},
    loading: false,
  };

  setParams=(params, code) => {
    if (code === 1) {
      this.setState({
        loadingTab1: true,
      });
      AjaxUtil({
        url: '/logadmin/apimanager/searchCmdByDate.htm',
        data: params,
        callback: (result) => {
          if (result.msg === '查询成功') {
            this.setState({
              datalistTab1: result,
              loadingTab1: false,
            });
          } else {
            this.setState({
              datalistTab1: { text: '查询失败' },
              loadingTab1: false,
            });
          }
        },
        error: () => {
          this.setState({
            datalistTab1: { text: '查询出错了' },
            loadingTab1: false,
          });
        },
      });
    } else if (code === 2) {
      this.setState({
        loadingTab2: true,
      });
      AjaxUtil({
        url: '/logadmin/apimanager/quert.htm',
        data: params,
        callback: (result) => {
          if (result.msg === '查询成功') {
            this.setState({
              datalistTab2: result,
              loadingTab2: false,
            });
          } else {
            this.setState({
              datalistTab2: { text: '查询失败' },
              loadingTab2: false,
            });
          }
        },
        error: () => {
          this.setState({
            datalistTab2: { text: '查询出错了' },
            loadingTab2: false,
          });
        },
      });
    }
  }

  onChang = (key) => {
    this.setState({
      activeKey: key,
    });
  }

  setObjecttoArray =(dataobj, num) => {
    const list = [];
    for (const x in dataobj) {
      num++;
      if (dataobj[x].length && typeof dataobj[x] !== 'string') {
        const temparr = dataobj[x];
        const ss = temparr.map((item, i) => this.setObjecttoArray(item, num * 10 * (i + 1)));
        list.push({ title: x, key: num, children: [...ss] });
      } else if (!dataobj[x].length && typeof dataobj[x] === 'object') {
        const tempobj = dataobj[x];
        list.push({ title: x, key: num, children: this.setObjecttoArray(tempobj, num * 10) });
      } else {
        const str = `${x}:${dataobj[x]}`;
        list.push({ title: str, key: num });
      }
    }
    return list;
  }

  render() {
    const { activekey, loadingTab1, loadingTab2, datalistTab1, datalistTab2 } = this.state;
    return (
      <PageHeaderLayout title="系统Log日志查询系统">
        <Card bordered={false} style={{ minHeight: '78vh' }}>
          <div className={styles.bodydiv}>
            <Tabs defaultActiveKey={activekey} onChange={this.onChang} size="large" tabPosition="left">
              <TabPane tab="自定义mongo指令查询" key="1">
                <Card title={<SerachFormComponent setParams={this.setParams} />} bordered={false}>
                  { loadingTab1 ? <Spin size="large" /> : <TabTree dataList={this.setObjecttoArray(datalistTab1, 0)} />}
                </Card>
              </TabPane>
              <TabPane tab="条件查询" key="2">
                <Card title={<TabsearchForm setParams={this.setParams} />} bordered={false}>
                  { loadingTab2 ? <Spin size="large" /> : <TabTree dataList={this.setObjecttoArray(datalistTab2, 0)} />}
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

