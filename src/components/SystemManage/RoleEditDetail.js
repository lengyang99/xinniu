/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React,{ Component} from 'react';
import { Tree,Input } from 'antd';
const TreeNode = Tree.TreeNode;

class RoleDetail extends Component {
  state = {
    checkedKeys:[],
    roleInput:'',
  }
  
  componentDidMount(){
	  let { onCheck } = this.props;
	  onCheck(this.state.checkedKeys);
  }
  
  onCheck = (checkedKeys,info) => {
	let { onCheck } = this.props;
	let ar = [];
    const checkedNodes = info.checkedNodes;
    for(let i=0;i<checkedNodes.length;i++){
    	ar.push(checkedNodes[i].props.dataRef.id+"");
    }
    this.setState({ checkedKeys:ar });
    onCheck(ar);
  }


  renderTreeNodes = (data) => {
    return data.map((item) => {
      if(item.hasRole){
        this.state.checkedKeys.push(item.id+"")
      }
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id}  dataRef={item} isLeaf={false}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });
  }


  render(){
     const { record, navlist, modalType} = this.props;
     this.state.checkedKeys = [];
     return (
       <div>
        <Tree
          checkable
          onCheck={this.onCheck.bind(this)}
          checkStrictly={true}
          defaultCheckedKeys={this.state.checkedKeys}
        >
          {this.renderTreeNodes(navlist)}
        </Tree>
        </div>
     )
  }
 
 
}

export default  RoleDetail;
