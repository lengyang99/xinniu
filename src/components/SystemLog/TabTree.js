/**
 * Created by Administrator on 2018/1/11 0011.
 */
import React from 'react';
import {Tree} from  'antd';
const TreeNode = Tree.TreeNode

var TabTree = (props)=>{
    const { dataList } = props;
    console.log(dataList);
    var list = (arr)=>{
        if(arr.children){
            return  <TreeNode title={arr.title} key={arr.key}> { list(arr.children) }</TreeNode>
        }else{
           return  <TreeNode title={arr.title} key={arr.key}/>
        }
    }

    var  renderTreeNodes = (data) => {

        return data.map((item) => {
            if(item.length){
                return item.map(arr =>{
                    if (arr.children) {
                        return (
                            <TreeNode title={arr.title||'_'} key={arr.key||(Math.random()*1000)+'aa'} dataRef={arr} style={{backgroundColor:'red',display:'block'}}>
                                { renderTreeNodes(arr.children)}
                            </TreeNode>
                        );
                    }
                    return <TreeNode {...arr} dataRef={arr} />;
                })
            }
            if (item.children) {
                return (
                    <TreeNode title={item.title||'_'} key={item.key} dataRef={item}>
                        { renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} />;
        });
    }
    return   <Tree
        defaultExpandedKeys={[]}
        defaultSelectedKeys={[]}
        defaultCheckedKeys={[]}
    >
        {
            renderTreeNodes(dataList)
        }
    </Tree>
}

export  default  TabTree;