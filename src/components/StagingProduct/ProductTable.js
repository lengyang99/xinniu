/**
 * Created by Administrator on 2017/12/19 0019.
 */

import {Table } from 'antd';

var ProductTable = (props)=>{
  const loading = props.data.length == 0?true:false;
  let txt = props.period == 1?'天数':'期数'
  let columns = [{
    title:txt,
    dataIndex:'',
    render:(text,record)=>record.titleV+txt.substring(0,1)
  },{
    title:'A',
    dataIndex:'1',
    render:(value)=> value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'B',
    dataIndex:'2',
    render:(value)=> value ||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'C',
    dataIndex:'3',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'D',
    dataIndex:'4',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'E',
    dataIndex:'5',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'F',
    dataIndex:'6',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'G',
    dataIndex:'7',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  },{
    title:'无等级',
    dataIndex:'-1',
    render:(value)=>value||value == 0 ?(props.feeType == 1?value+'元':value+'%'):''
  }];
  const { data, page } = props;
  return <Table  columns={ columns }
                 loading = {loading}
                 rowKey={ record => record.key }
                 dataSource={ data }
                 pagination={ page }/>
};
export default ProductTable;
