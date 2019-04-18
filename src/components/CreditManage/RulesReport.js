/**
 * Created by Administrator on 2018/1/3 0003. -- liuy
 * 页面 - 信用卡信息
 * props: 待定
 */

import React, { Component } from 'react'
import { Row, Col, Collapse,Table } from 'antd'
const Panel = Collapse.Panel;

class RulesReport extends Component {
  state = {
     info:{},
  }

  componentDidMount(){
    const { userId, dispatch, detailUrl} = this.props;
    dispatch({
      type: detailUrl,
      payload: userId,
      callback:(result)=>{
        if(result.resultCode === 1000){
          this.setState({
            info: JSON.parse(result.resultData)||{}
          })
        }
      }
    })
  }

  ListSerise = (data, classStyle, titleStr)=> {
      const setColList = (rulename, rulevalues, count)=> <div key={count}><Col span={6}>{rulename}</Col><Col span={6}>{rulevalues}</Col></div>
      const setList = (data)=>{
        var tempList = [];
        var count = 0;
        for(var k in  data){
          if(k === 'ruleList') continue;
          var temp = setColList(k, data[k],count);
          count++;
          tempList.push(temp);
        }
        return tempList
      };
      return  <div className = {classStyle.listSerise}>
          <Row>
            <Col span={24}>{titleStr}</Col>
          </Row>
          <Row>
            {
              setList(data)
            }
          </Row>
        </div>
    }


  setTableOhject(data,columns){
      var count =0;
      var panellist = [];
     for(var k in data){
       var temp = this.setPanellist(k,data[k],columns,count)
       count++;
       panellist.push(temp)
     }
     return panellist
  }

  setPanellist(title,data, columns,count){
    const customPanelStyle = {
      background: '#D7E3FF',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    return <Panel header={title} key={count}  style={customPanelStyle}>
      {this.setTablelist(columns,data)}
    </Panel>
  }

  setTablelist(columns,data){
    return <Table size="middle" bordered columns={columns} dataSource={data} pagination={false}/>
  }

  render(){
    const { classStyle } = this.props;
    const { info } =this.state;
    const columns = [{
      title:'规则',
      dataIndex:'',
      render:(text,record)=>record.ruleId+'/'+record.ruleName
    },{
      title:'期望匹配值',
      dataIndex:'matching',
    },{
      title:'匹配规则',
      dataIndex:'rule',
    },{
      title:'当前值',
      dataIndex:'value',
    },{
      title:'结果',
      dataIndex:'result',
      width:64,
      render:(text, record)=>{
        switch (record.result){
          case 1:return <span className={classStyle.colorA}>通过</span>;
          case 2:return <span className={classStyle.colorB}>待人工复审</span>;
          case 3:return <span className={classStyle.colorC}>拒绝</span>;
          case 4:return <span className={classStyle.colorD}>积分卡</span>;
          case 5:return <span className={classStyle.colorE}>不提额</span>;
        }
      }
    },{
      title:'得分',
      dataIndex:'score',
    }];



    const dataJSon ={
      "resultCode":1000,
      "resultMessage":"操作成功",
      "resultData":{"欺诈分":"0","信用分":"0","ruleList":{"设备反欺诈":[{"id":594,"userId":92,"ruleId":"设备反欺诈","ruleName":"(提交额度计算时)的相同LBS最近1小时内申请人数","matching":"2","value":"1","rule":"<=","result":1,"createTime":1515207977000,"score":0.000,"valueName":"(提交额度计算时)的相同LBS最近1小时内申请人数","processId":44},{"id":593,"userId":92,"ruleId":"设备反欺诈","ruleName":"(提交额度计算时)的相同LBS最近12小时内申请人数","matching":"5","value":"1","rule":"<=","result":1,"createTime":1515207977000,"score":0.000,"valueName":"(提交额度计算时)的相同LBS最近12小时内申请人数","processId":44},{"id":595,"userId":92,"ruleId":"设备反欺诈","ruleName":"相同IP最近12小时内申请人数","matching":"5","value":"3","rule":"<=","result":1,"createTime":1515207977000,"score":0.000,"valueName":"相同IP最近12小时内申请人数","processId":44},{"id":596,"userId":92,"ruleId":"设备反欺诈","ruleName":"相同IP最近1小时内申请人数","matching":"3","value":"3","rule":"<=","result":1,"createTime":1515207977000,"score":0.000,"valueName":"相同IP最近1小时内申请人数","processId":44}],"准入规则":[{"id":584,"userId":92,"ruleId":"准入规则","ruleName":"城市 地理位置准入","matching":"新疆维吾尔自治区，西藏自治区，浙江省|温州市，福建省|泉州市，福建省|漳州市，安徽省|淮南市，广东省|汕头市，辽宁省|鞍山市，辽宁省|锦州市，山东省|淄博市，四川省|乐山市，山东省|聊城市","value":"北京市|","rule":"不包含","result":1,"createTime":1515207977000,"score":0.000,"valueName":"城市","processId":44},{"id":581,"userId":92,"ruleId":"准入规则","ruleName":"地理位置准入 院校（LBS计算额度时获取），年龄","matching":"院校，25","value":"null,null","rule":"不包含，>","result":1,"createTime":1515207505000,"score":0.000,"valueName":"院校（LBS计算额度时获取），年龄","processId":43},{"id":580,"userId":92,"ruleId":"准入规则","ruleName":"年龄准入","matching":"18,40,null","value":"null","rule":"<，>，==","result":3,"createTime":1515207505000,"score":0.000,"valueName":"年龄","processId":43},{"id":585,"userId":92,"ruleId":"准入规则","ruleName":"年龄准入","matching":"18,40","value":"34","rule":">=,=<","result":1,"createTime":1515207977000,"score":0.000,"valueName":"年龄","processId":44},{"id":582,"userId":92,"ruleId":"准入规则","ruleName":"城市 地理位置准入","matching":"新疆维吾尔自治区，西藏自治区，浙江省|温州市，福建省|泉州市，福建省|漳州市，安徽省|淮南市，广东省|汕头市，辽宁省|鞍山市，辽宁省|锦州市，山东省|淄博市，四川省|乐山市，山东省|聊城市","value":"null","rule":"不包含","result":1,"createTime":1515207505000,"score":0.000,"valueName":"城市","processId":43},{"id":583,"userId":92,"ruleId":"准入规则","ruleName":"地理位置准入 院校（LBS计算额度时获取），年龄","matching":"院校，25","value":"北京市朝阳区呼家楼街道东三环北路辅路北京国际中心,34","rule":"不包含，>","result":1,"createTime":1515207977000,"score":0.000,"valueName":"院校（LBS计算额度时获取），年龄","processId":44}],"黑名单":[{"id":590,"userId":92,"ruleId":"黑名单","ruleName":"芝麻行业关注清单","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"芝麻行业关注清单","processId":44},{"id":588,"userId":92,"ruleId":"黑名单","ruleName":"百融黑名单","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"百融黑名单","processId":44},{"id":587,"userId":92,"ruleId":"黑名单","ruleName":"天机黑名单","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"天机黑名单","processId":44},{"id":589,"userId":92,"ruleId":"黑名单","ruleName":"中智诚黑名单","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"中智诚黑名单","processId":44},{"id":586,"userId":92,"ruleId":"黑名单","ruleName":"同盾黑名单","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"同盾黑名单","processId":44},{"id":591,"userId":92,"ruleId":"黑名单","ruleName":"紧急联系人命中内部黑名单个数","matching":"1","value":"0","rule":"<","result":1,"createTime":1515207977000,"score":0.000,"valueName":"紧急联系人命中内部黑名单个数","processId":44},{"id":592,"userId":92,"ruleId":"黑名单","ruleName":"内部黑名单（身份证号查询）","matching":"false","value":"false","rule":"==","result":1,"createTime":1515207977000,"score":0.000,"valueName":"内部黑名单（身份证号查询）","processId":44}],"运营商反欺诈":[{"id":609,"userId":92,"ruleId":"运营商反欺诈","ruleName":"3个月运营商号码总通讯个数","matching":"30","value":"null","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"3个月运营商号码总通讯个数","processId":44},{"id":607,"userId":92,"ruleId":"运营商反欺诈","ruleName":"6个月所有运营商号码通讯总次数","matching":"150","value":"725","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"6个月所有运营商号码通讯总次数","processId":44},{"id":614,"userId":92,"ruleId":"运营商反欺诈","ruleName":"没有运营商数据","matching":"true","value":"true","rule":"==","result":1,"createTime":1515207978000,"score":0.000,"valueName":"没有运营商数据","processId":44},{"id":599,"userId":92,"ruleId":"运营商反欺诈","ruleName":"入网时长单位天","matching":"180","value":"74","rule":"<","result":3,"createTime":1515207978000,"score":0.000,"valueName":"入网时长单位天","processId":44},{"id":610,"userId":92,"ruleId":"运营商反欺诈","ruleName":"6个月内呼出电话top10电话触发自有黑名单库数量","matching":"1","value":"0","rule":"<","result":1,"createTime":1515207978000,"score":0.000,"valueName":"6个月内呼出电话top10电话触发自有黑名单库数量","processId":44},{"id":600,"userId":92,"ruleId":"运营商反欺诈","ruleName":"天机西瓜分普通版","matching":"580","value":"null","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"天机西瓜分普通版","processId":44},{"id":603,"userId":92,"ruleId":"运营商反欺诈","ruleName":"3个月内呼入前10电话全部次数相加的平均值≤X次 且 呼入前10第一名电话通话次数≤X次","matching":"3,5","value":"0","rule":">,>","result":1,"createTime":1515207978000,"score":0.000,"valueName":"3个月内呼入前10电话全部次数相加的平均值≤X次 且 呼入前10第一名电话通话次数≤X次","processId":44},{"id":608,"userId":92,"ruleId":"运营商反欺诈","ruleName":"运营商账号状态","matching":"冻结，欠费，销户，未激活","value":"null","rule":"不等于","result":1,"createTime":1515207978000,"score":0.000,"valueName":"运营商账号状态","processId":44},{"id":597,"userId":92,"ruleId":"运营商反欺诈","ruleName":"闪银通讯分","matching":"540","value":"509","rule":"<","result":3,"createTime":1515207978000,"score":0.000,"valueName":"闪银通讯分","processId":44},{"id":612,"userId":92,"ruleId":"运营商反欺诈","ruleName":"运营商三要素比对，爬虫对比（原A卡对比方式）","matching":"true","value":"1","rule":"==","result":1,"createTime":1515207978000,"score":0.000,"valueName":"运营商三要素比对，爬虫对比（原A卡对比方式）","processId":44},{"id":601,"userId":92,"ruleId":"运营商反欺诈","ruleName":"近3个月通话时长min","matching":"50","value":"471","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"近3个月通话时长min","processId":44},{"id":605,"userId":92,"ruleId":"运营商反欺诈","ruleName":"3个月内呼入&呼出前10内触发金融公司电话库次数","matching":"2","value":"0","rule":"<","result":1,"createTime":1515207978000,"score":0.000,"valueName":"3个月内呼入&呼出前10内触发金融公司电话库次数","processId":44},{"id":606,"userId":92,"ruleId":"运营商反欺诈","ruleName":"运营商6个月平均每月消费金额","matching":"18","value":"119.31","rule":">","result":1,"createTime":1515207978000,"score":0.000,"valueName":"运营商6个月平均每月消费金额","processId":44},{"id":615,"userId":92,"ruleId":"运营商反欺诈","ruleName":"通讯录个数","matching":"50","value":"90","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"通讯录个数","processId":44},{"id":613,"userId":92,"ruleId":"运营商反欺诈","ruleName":"呼入或呼出前十没有数据","matching":"true","value":"true","rule":"==","result":1,"createTime":1515207978000,"score":0.000,"valueName":"呼入或呼出前十没有数据","processId":44},{"id":602,"userId":92,"ruleId":"运营商反欺诈","ruleName":"近3个月通话次数","matching":"30","value":"354","rule":">=","result":1,"createTime":1515207978000,"score":0.000,"valueName":"近3个月通话次数","processId":44},{"id":604,"userId":92,"ruleId":"运营商反欺诈","ruleName":"近3个月内呼入最频繁电话联系总次数＜X次且近3个月内呼出最频繁电话联系总次数＜X次","matching":"5,5","value":"93;56","rule":">,>","result":1,"createTime":1515207978000,"score":0.000,"valueName":"近3个月内呼入最频繁电话联系总次数＜X次且近3个月内呼出最频繁电话联系总次数＜X次","processId":44},{"id":598,"userId":92,"ruleId":"运营商反欺诈","ruleName":"近3个月与两个紧急联系人通话总次数","matching":"6","value":"0","rule":"<","result":3,"createTime":1515207978000,"score":0.000,"valueName":"近3个月与两个紧急联系人通话总次数","processId":44},{"id":611,"userId":92,"ruleId":"运营商反欺诈","ruleName":"6个月内呼入电话top10电话触发自有黑名单库数量","matching":"1","value":"0","rule":"<","result":1,"createTime":1515207978000,"score":0.000,"valueName":"6个月内呼入电话top10电话触发自有黑名单库数量","processId":44}]}}
  }

    return   <div>
      <div className={classStyle.listDiv}>
        {
          this.ListSerise(info, classStyle, '模型分')
        }
      </div>
      <div className={classStyle.listDiv}>
        <div className={classStyle.listSerise}>
        <Row>
          <Col span={24}>规则报告列表</Col>
        </Row>
        </div>
        <Row>
          <Col span={24}>
            <Collapse defaultActiveKey={['0']}>
              {
                info.ruleList? this.setTableOhject(info.ruleList, columns):''
              }
            </Collapse>
          </Col>
        </Row>
      </div>
    </div>
  }
}

export default RulesReport;
