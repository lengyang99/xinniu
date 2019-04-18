/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import {Form, Input, Select, Button} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

var UserDetail = (props) => {
  const {getFieldDecorator} = props.form
  const {parent, modalType, form, handleOk, handleCancel, data, menu, channel, btnloading, showChannel, merchantList, role, parterId} = props;
  const optionList = menu.length == 0 ? [] : menu.map((item) => <Option key={item} value={item}>{item}</Option>);
  const channelOptionList = channel.length == 0 ? [] : channel.map((item) => <Option key={item.id}
                                                                                     value={item.id}>{item.name}</Option>);
  const canEdit = modalType === 'change';
  const roleEdit = data.role === 'partner';
  let options = [];
  let roleStr = '';
  if (data && data !== undefined) {
    var {
      name,
      userName,
      password,
      roleNidStr,
      statusStr,
      channelId,
      partnerStr
    } = data
  } else {
    var name = '',
      userName = '',
      password = '',
      roleNidStr = '',
      statusStr = '',
      channelId = '';
    partnerStr = ''
  }
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 6},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };

  var handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      var jsonParams = {
        name: values.name || undefined,
        userName: values.userName || undefined,
        roleNidStr: values.roleNidStr || undefined,
        statusStr: values.statusStr || undefined,
        password: values.password || undefined,
        parterId: values.parterId || undefined
      };
      if (modalType === 'change') {
        jsonParams.id = data.id;
      }
      // if (!showChannel) {
      //   jsonParams.channelId = undefined
      // } else {
      //   jsonParams.channelId = values.channelId || undefined
      // }
      var json = {
        userInfo: JSON.stringify(jsonParams)
      };
      handleOk(modalType, json);
    });
  };

  var handleReset = () => {
    form.resetFields();
    handleCancel();
  };
  var partner = (v) => {

    parent.setState({
      parterId: v
    })
  }
  var roles = (e) => {

    roleStr = e;

    parent.setState({
      role: e,
    });

    parent.setState({
      role: e,
    });

  };
  return <Form layout="vertical" style={{width: '80%', marginLeft: '10%', marginTop: '20px'}}>
    <FormItem label="用户名" {...formItemLayout}>
      {getFieldDecorator('name', {
        rules: [{
          required: true, message: '请输入用户名！',
        }, {
          max: 20,
          message: '用户名最大长度20位',
        }],
        initialValue: name
      })(<Input/>)}
    </FormItem>
    <FormItem label="登录名" {...formItemLayout}>
      {getFieldDecorator('userName', {
        rules: [{
          required: true, message: '请输入登录名！',
        }, {
          max: 20,
          message: '登录名最大长度20位',
        }],
        initialValue: userName
      })(<Input disabled={canEdit}/>)}
    </FormItem>
    <FormItem label="密码"  {...formItemLayout}>
      {getFieldDecorator('password', {
        rules: [{
          required: true, message: '请设置密码！密码组合:字母+数组'
        }, {
          max: 20,
          pattern: /^(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,16}$/,
          message: '密码设置长度6-20，不要含中文和空格'
        }],
        placeholder: '请设置密码！密码组合:字母+数组',
        validateTrigger: 'onBlur',
        initialValue: password
      })(<Input/>)}
    </FormItem>
    <FormItem label="角色"  {...formItemLayout} >
      {getFieldDecorator('roleNidStr', {
        rules: [{
          required: true, message: '请输入角色！',
        }],
        initialValue: data.roleNidStr
      })(<Select disabled={roleEdit} onChange={(e) => roles(e)}>
        {optionList}
      </Select>)}
    </FormItem>
    {
      parent.state.role == '商户合作方' || parent.state.role == '渠道合作方' ?
        <FormItem label={parent.state.role === "商户合作方" ? '商户名称' : '渠道名称'}  {...formItemLayout}>
          {getFieldDecorator('parterId', {
            rules: [{
              required: true, message: '请选择合作方！',
            }],
            initialValue: data.parterId
          })(<Select disabled={roleEdit} onChange={(e) => partner(e)}>
            {
              parent.state.role === "商户合作方" ? props.merchantList.map((item, index) => {
                return <Option key={index} value={item.id}>{item.merchantName}</Option>
              }) : props.channel.map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>
              })
              // options?options.map((item, index) => {
              //   return <Option key={index} value={item.id}>{ item.name}</Option>
              // }):null
            }
          </Select>)}
        </FormItem> : null
    }
    <FormItem label="员工状态"  {...formItemLayout}>
      {getFieldDecorator('statusStr', {
        rules: [{
          required: true, message: '请输入员工状态！',
        }],
        initialValue: statusStr
      })(<Select>
        <Option key="在职" value="在职">在职</Option>
        <Option key="离职" value="离职">离职</Option>
      </Select>)}
    </FormItem>
    {/*<FormItem style={showChannel?{}:{display:"none"}} label="渠道名称"  {...formItemLayout} id='channel'>*/}
    {/*{getFieldDecorator('channelId',{*/}
    {/*rules: [showChannel?{*/}
    {/*required: true , message: '请输入渠道名称！',*/}
    {/*}:{required: false}],*/}
    {/*initialValue:channelId*/}
    {/*})(<Select >*/}
    {/*{channelOptionList}*/}
    {/*</Select>)}*/}
    {/*</FormItem>*/}
    <FormItem>
      <Button type="primary" loading={btnloading} style={{marginRight: 16}} onClick={(e) => handleSubmit(e)}>确定</Button>
      <Button onClick={() => handleReset()} style={{marginLeft: '15px'}}>取消</Button>
    </FormItem>
  </Form>
}
UserDetail = Form.create()(UserDetail);

export default UserDetail

