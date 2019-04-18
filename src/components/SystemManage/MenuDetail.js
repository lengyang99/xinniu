/**
 * Created by Administrator on 2017/12/26 0026.
 */
/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

var MenuDetail =(props) =>{
  const { getFieldDecorator } = props.form
  const { modalType, form, handleOk, handleCancel, data , btnloading} = props;
  const canEdit = true;
  if(data && data != undefined && modalType=== 'change'){
    var {  scriptId,
      name,
      sort,
      iconCls,
      parentId:parentIdname,
      leaf } = data
  }else if(modalType=== 'add'){
    var name = '',
      scriptId = '',
      sort = '',
      iconCls ='',
      parentIdname = '空',
       leaf =0;
  }else{
    var name = '',
      scriptId = '',
      sort = '',
      iconCls ='',
      parentIdname = data.parentId,
       leaf =1;
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10},
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  var handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = { scriptId:values.scriptId || undefined,
        name:values.name||undefined,
        iconCls:values.iconCls|| undefined,
        isLeaf:values.isLeaf  ,
        sort:values.sort ||undefined
      };
      if(modalType === 'change'){
        jsonParams.parentId =  data.parentId;
        jsonParams.id = data.id
      }else if(modalType =='addchild'){
        jsonParams.parentId =  data.id;
      }else{
        jsonParams.parentId = 0;
      }
      var json = {
        menuInfo: JSON.stringify(jsonParams)
      };
      handleOk(modalType,json);
    });
  };

  var handleReset = ()=>{
    form.resetFields();
    handleCancel();
  }
  return <Form layout="vertical" style={{width:'80%',marginLeft:'10%',marginTop:'20px'}}>
    <Row>
      <Col md={12} sm={24}>
        <FormItem label="组件名(scriptId)"  {...formItemLayout}>
          {getFieldDecorator('scriptId',{
            rules: [{
              required: true , message: '请输入组件名！',
            }],
            initialValue:scriptId
          })(<Input/>)}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="菜单名称(name)"  {...formItemLayout}>
          {getFieldDecorator('name',{
            rules: [{
              required: true , message: '请输入菜单名称！',
            }],
            initialValue:name
          })(<Input/>)}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col md={12} sm={24}>
        <FormItem label="排序(sort)"  {...formItemLayout}>
          {getFieldDecorator('sort',{
            rules: [{
              pattern:/^\d{0,5}$/,
              required: true , message: '请输入排序！',
            }],
            placeholder:'建议以10的倍数定义',
            validateTrigger:'onBlur',
            initialValue:sort
          })(<Input/>)}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="菜单图标(iconCls)"  {...formItemLayout}>
          {getFieldDecorator('iconCls',{
            rules: [{
              required: false , message: '请输入菜单图标！',
            }],
            initialValue:iconCls
          })(<Input/>)}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col md={12} sm={24}>
        <FormItem label="父级菜单(parentId)"  {...formItemLayout}>
          {getFieldDecorator('parentId',{
            rules: [{
              required: true , message: '请输入菜单名称！',
            }],
            initialValue:parentIdname
          })(<Input disabled={canEdit}/>)}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="是否为子菜单(isLeaf)"  {...formItemLayout}>
          {getFieldDecorator('isLeaf',{
            rules: [{
              required: true , message: '请选择子菜单！',
            }],
            initialValue:leaf
          })(<Select disabled={canEdit}>
            <Option key="isLeaf_1" value={1}>是</Option>
            <Option key="isLeaf_0" value={0}>否</Option>
          </Select>)}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col style={{textAlign:'center'}}>
        <Button loading={btnloading} type='primary' onClick={(e)=>handleSubmit(e)}>确定</Button>
        <Button onClick={()=>handleReset()} style={{marginLeft:'15px'}}>返回</Button>
      </Col>
    </Row>
  </Form>
}
MenuDetail = Form.create()(MenuDetail);

export default  MenuDetail

