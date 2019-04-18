/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

let DatabaseDetail = (props) => {
  const { getFieldDecorator } = props.form;
  const { modalType, form, handleOk, handleCancel, data, menu, btnloading, parentId } = props;
  const childform = modalType === 'change' || modalType === 'add';
  if (data && data != undefined) {
    if (childform) {
      var { itemCode,
        itemValue,
        state } = data;
    } else {
      var { typeCode,
        typeName,
        sort,
        remark } = data;
    }
  } else if (childform) {
    var itemCode = '',
      itemValue = '',
      state = '';
  } else {
    var typeCode = '',
      typeName = '',
      sort = '',
      remark = '';
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (childform) {
        var jsonParams = { itemCode: values.itemCode || undefined, itemValue: values.itemValue || undefined, state: values.state || undefined };
        var url = 'systemdict/addchild';
        if (modalType === 'change') {
          url = 'systemdict/updatechild';
          jsonParams.id = data.id;
        }
        jsonParams.parentId = parentId;
        var json = {
          url,
          childform,
          data: {
            sysdictDetail: JSON.stringify(jsonParams),
          },
        };
        handleOk(json);
      } else {
        var jsonParams = { typeCode: values.typeCode || undefined, typeName: values.typeName || undefined, sort: values.sort || undefined, remark: values.remark || undefined };
        var url = 'systemdict/addparent';
        if (modalType === 'changeParent') {
          url = 'systemdict/updateparent';
          jsonParams.id = data.id;
        }
        var json = {
          url,
          childform,
          data: {
            sysDict: JSON.stringify(jsonParams),
          },
        };
        handleOk(json);
      }
    });
  };

  const handleReset = () => {
    form.resetFields();
    handleCancel();
  };
  return (<Form layout="vertical" style={{ width: '80%', marginLeft: '10%', marginTop: '20px' }}>
    {
      childform ? <div>
        <FormItem label="itemCode" {...formItemLayout}>
          {getFieldDecorator('itemCode', {
          rules: [{
            required: true, message: '请输入itemCode！',
          }, {
            max: 64,
            message: 'itemCode最大长度64位',
          }],
          initialValue: itemCode,
        })(<Input maxLength="64" />)}
        </FormItem>
        <FormItem label="itemValue" {...formItemLayout}>
          {getFieldDecorator('itemValue', {
          rules: [{
            required: true, message: '请输入itemValue！',
          }, {
            max: 32,
            message: 'itemValue最大长度32位',
          }],
          initialValue: itemValue,
        })(<Input maxLength="32" />)}
        </FormItem>
        <FormItem label="state" {...formItemLayout}>
          {getFieldDecorator('state', {
          rules: [{
            required: true, message: '请选择',
          }],
          initialValue: state,
          })(<Select>
            <Option value="10">有效</Option>
            <Option value="20">无效</Option>
          </Select>)}
        </FormItem>
      </div> : <div>
                    <FormItem label="typeCode" {...formItemLayout}>
          {getFieldDecorator('typeCode', {
          rules: [{
            required: true, message: '请输入typeCode！',
          }],
          initialValue: typeCode,
        })(<Input />)}
        </FormItem>
                    <FormItem label="typeName" {...formItemLayout}>
          {getFieldDecorator('typeName', {
          rules: [{
            required: true, message: '请输入typeName！',
          }],
          initialValue: typeName,
        })(<Input />)}
        </FormItem>
                    <FormItem label="sort" {...formItemLayout}>
          {getFieldDecorator('sort', {
          rules: [{
            max: 10,
            pattern: /^\d{1,10}$/,
            message: 'sort应为整数',
            }, {
            required: true, message: '请设置sort',
          }],
          validateTrigger: 'onBlur',
          initialValue: sort,
        })(<Input maxLength="10" />)}
        </FormItem>
                    <FormItem label="remark" {...formItemLayout}>
          {getFieldDecorator('remark', {
          rules: [{
            required: true, message: '请输入remark！',
          }],
          initialValue: remark,
        })(<Input />)}
        </FormItem>
                           </div>
    }
    <FormItem>
      <Button type="primary" loading={btnloading} style={{ marginRight: 16 }} onClick={e => handleSubmit(e)}>确定</Button>
      <Button onClick={() => handleReset()} style={{ marginLeft: '15px' }}>取消</Button>
    </FormItem>
          </Form>);
};
DatabaseDetail = Form.create()(DatabaseDetail);

export default DatabaseDetail;

