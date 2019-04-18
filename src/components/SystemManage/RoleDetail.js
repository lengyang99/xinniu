/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React,{ Component} from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class RoleDetail extends Component {

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.is} dataRef={item} isLeaf={item.leaf}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.is} dataRef={item} />;
    });
  }
  render(){
     console.log('RoleDetail');
     console.log(this.props);
     let { record, navlist} = this.props;
     return (
        <Tree
          checkable
          // onSelect={this.onSelect}
          // onCheck={this.onCheck}
        >
          {this.renderTreeNodes(navlist)}
        </Tree>
     )
  }
}

export default  RoleDetail;
