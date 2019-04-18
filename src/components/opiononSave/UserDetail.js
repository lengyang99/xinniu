/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

var opiononsave =(props) =>{
  const { getFieldDecorator } = props.form
  const { modalType, form, handleOk, handleCancel, data , menu, menu2, btnloading} = props;
  const optionList = menu.length ==0 ?[]:menu.map((item)=><Option key={item.code} value={item.code}>{item.value}</Option>);
  const optionList2 = menu2.length ==0 ?[]:menu2.map((item)=><Option key={item.code} value={item.code}>{item.value}</Option>);
  const canEdit = modalType === 'change';
  console.log(data);
  if(data && data != undefined){
    var {  phoneName,
      phoneFirmName,
      phoneBrandName,
      phoneName,
      phoneMemory,
      phoneTotalValue,
      phoneAssessmentValue,
      phoneImg } = data
  }else{
    // if(modalType === 'add')  form.resetFields();
    var phoneName = '',
        phoneFirmName = '',
        phoneBrandName = '',
        phoneModel ='',
        phoneMemory = '',
        phoneTotalValue ='',
        phoneAssessmentValue = '',
        phoneImg = '';
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
  var handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
      
      
      
      
       
       const formData = new FormData(document.getElementById("editForm"));  
       
      var jsonParams = { phoneName:values.phoneName|| undefined, phoneFirmName:values.phoneFirmName ||undefined,
                         phoneBrandName:values.phoneBrandName|| undefined, phoneName:values.phoneName||undefined ,
                         phoneMemory:values.phoneMemory||undefined,phoneTotalValue:values.phoneTotalValue||undefined,
                         phoneModel:values.phoneModel||undefined,
                         phoneAssessmentValue:values.phoneAssessmentValue||undefined,phoneImg:values.phoneImg||undefined, };
      if(modalType === 'change'){
        jsonParams.id = data.id;
      }
      var json = {
        phoneInfo: JSON.stringify(jsonParams)
      };
      
       formData.append("phoneInfo", JSON.stringify(jsonParams)); 
       handleOk(modalType, formData);
    });
  };

  var handleReset = ()=>{
    handleOk(modalType);
  }
  return <Form layout="vertical" style={{width:'80%',marginLeft:'10%',marginTop:'20px'}}  enctype="multipart/form-data" id="editForm">
    <FormItem label="手机型号" {...formItemLayout}>
      {getFieldDecorator('phoneName',{
        rules: [{
          required: false , message: '请输入用户名！',
        },{
          max:20,
          message: '用户名最大长度20位',
        }],
        initialValue:phoneName
      })(<Input/>)}
    </FormItem>
    <FormItem label="手机厂商"  {...formItemLayout}>
      {getFieldDecorator('phoneFirmName',{
        rules: [{
          required: false , message: '请输入！',
        }],
        initialValue:phoneFirmName
      })(<Select>
        { optionList }
      </Select>)}
    </FormItem>
    <FormItem label="手机品牌"  {...formItemLayout}>
      {getFieldDecorator('phoneBrandName',{
        rules: [{
          required: false , message: '请输入！',
        }],
        initialValue:phoneBrandName
      })(<Select>
         { optionList2 }
      </Select>)}
    </FormItem>
    <FormItem label="内部型号" {...formItemLayout}>
      {getFieldDecorator('phoneModel',{
        rules: [{
          required: false , message: '请输入！',
        },{
          max:20,
          message: '用户名最大长度20位',
        }],
        initialValue:phoneName
      })(<Input/>)}
    </FormItem>
    <FormItem label="内存" {...formItemLayout}>
      {getFieldDecorator('phoneMemory',{
        rules: [{
          required: false , message: '请输入！',
        },{
          max:20,
          message: '用户名最大长度20位',
        }],
        initialValue:phoneMemory
      })(<Input/>)}
    </FormItem>
    <FormItem label="总值" {...formItemLayout}>
      {getFieldDecorator('phoneTotalValue',{
        rules: [],
        initialValue:phoneTotalValue
      })(<Input/>)}
    </FormItem>
    <FormItem label="估值" {...formItemLayout}>
      {getFieldDecorator('phoneAssessmentValue',{
        rules: [],
        initialValue:phoneAssessmentValue
      })(<Input name="'"/>)}
    </FormItem>
    {/*<FormItem label="图片" {...formItemLayout}>
      {getFieldDecorator('phoneImg',{
        rules: [],
        initialValue:phoneImg
      })(<img src={phoneImg} multiple="multiple" style={{width:200,height:100,border:'1px solid #ccc' }}/>)}
    </FormItem>*/}
    <FormItem label="上传" {...formItemLayout}>
      {getFieldDecorator('phoneImg',{
        rules: [],
        name:"phoneImg"
      })(<Input type ='file' name="phoneImg" multiple="multiple" />)}
    </FormItem>
    <FormItem>
      <Button type="primary"  htmlType="submit" loading={ btnloading } style={{ marginRight: 16 }} onClick={(e)=>handleSubmit(e)}>确定</Button>
      <Button onClick={()=>handleReset()} style={{marginLeft:'15px'}}>取消</Button>
    </FormItem>
  </Form>
}
opiononsave = Form.create()(opiononsave);

export default  opiononsave

