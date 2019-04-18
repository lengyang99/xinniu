/**
 * Created by Administrator on 2017/12/16 0016.
 */
import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

var management =(props) =>{
  const { getFieldDecorator } = props.form
  const { modalType, form, handleOk, handleCancel, data , menu, menu2, btnloading} = props;
  const optionList = menu.length ==0 ?[]:menu.map((item)=><Option key={item.code} value={item.code}>{item.value}</Option>);
  const optionList2 = menu2.length ==0 ?[]:menu2.map((item)=><Option key={item.code} value={item.code}>{item.value}</Option>);
  const canEdit = modalType === 'change';
  console.log(data);
  if(data && data != undefined){
    var {  phoneName,
      phoneFirm,
      phoneBrand,
      phoneModel,
      phoneMemory,
      phoneTotalValue,
      phoneAssessmentValue,
      phoneImg } = data
  }else{
    // if(modalType === 'add')  form.resetFields();
    var phoneName = '',
        phoneFirm = '',
        phoneBrand = '',
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
  
 


	//上传图片预览
	var Submit = (e) => {
	   var fileList = document.getElementById("file").files;
	   console.log(fileList)
	    for (var i = 0; i < fileList.length; i++) {    
	            var file = fileList.item(i);    
	            if (!(/^image\/.*$/i.test(file.type))) {    
	                continue; //不是图片 就跳出这一次循环    
	            }    
	            //实例化FileReader API    
	            var freader = new FileReader();    
	            freader.readAsDataURL(file);    
	            freader.onload = function(e) {    
	                document.getElementById("phoneImg").src=e.target.result;    
	            }    
	        }   
	}


  
  //弹窗确定按钮
  var handleSubmit = (e) => {
  	console.log(e)   
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      };
        //估值小于全值的验证
        var phoneTotalValues =parseInt(document.getElementById("phoneTotalValue").value);
		var phoneAssessmentValues =parseInt(document.getElementById("phoneAssessmentValue").value);
		console.log(phoneTotalValues)
		console.log(phoneAssessmentValues)
		if(phoneTotalValues < phoneAssessmentValues){
			alert("估值必须小于总值")
			return ""
		}
				
		//图片验证
		var imgSrc = document.getElementById("phoneImg").src;
		var imgfix = imgSrc.indexOf(".");
		console.log(imgSrc.indexOf("."));
		console.log(document.getElementById("phoneImg").src);
		var imgNameArr = document.getElementById("phoneImg").src.split('.');
		var fileNameArr = document.getElementById("file").value.split('.');
		 //文件名后缀  
        var imgsuffix = imgNameArr[imgNameArr.length-1];
        var suffix = fileNameArr[fileNameArr.length-1]; 
		console.log(imgsuffix);
		console.log(suffix);        
        //如果后缀为空  
        if(suffix==""&&imgsuffix!="jpg"&&imgsuffix!="jpeg"&&imgsuffix!="png"&&imgsuffix!="bmp"){  
            alert("图片为空或者图片格式不正确，仅支持.jpg .jpeg  .png .bmp此类图片格式！");  
            return false;  
        }else{
            if(suffix==""||suffix=='jpg'||suffix=='jpeg'||suffix=='png'||suffix=='bmp'){  
				console.log(suffix);
            }else{  
                alert("图片为空或者图片格式不正确，仅支持.jpg .jpeg  .png .bmp此类图片格式！");
                return false;  
            }  
        
		}    
      

       const formData = new FormData(document.getElementById("editForm"));  
       
      var jsonParams = { phoneName:values.phoneName|| undefined, phoneFirm:values.phoneFirm ||undefined,
                         phoneBrand:values.phoneBrand|| undefined,
                         phoneMemory:values.phoneMemory||undefined,phoneTotalValue:values.phoneTotalValue||undefined,
                         phoneModel:values.phoneModel||undefined,
                         phoneAssessmentValue:values.phoneAssessmentValue||undefined, };
      if(modalType === 'change'){
        jsonParams.id = data.id;
      }
      var json = {
        phoneInfo: JSON.stringify(jsonParams)
      };
      console.log(JSON.stringify(jsonParams))
       formData.append("phoneInfo", JSON.stringify(jsonParams)); 
       handleOk(modalType, formData);

    });
  };

  var handleReset = ()=>{
      handleCancel();
  }
  return <Form layout="vertical" style={{width:'80%',marginLeft:'10%',marginTop:'20px'}}  encType="multipart/form-data" id="editForm" disable="disable">
    <FormItem label="手机型号" {...formItemLayout}>
      {getFieldDecorator('phoneName',{
        rules: [{
          required: true , message: '请输入手机型号！',
        },{
          max:30,
          message: '最大长度30位',
        }],
        initialValue:phoneName
      })(<Input/>)}
    </FormItem>
    <FormItem label="手机厂商"  {...formItemLayout}>
      {getFieldDecorator('phoneFirm',{
        rules: [{
          required: true , message: '请选择手机厂商！',
        }],
        initialValue:phoneFirm
      })(<Select>
        { optionList }
      </Select>)}
    </FormItem>
    <FormItem label="手机品牌"  {...formItemLayout}>
      {getFieldDecorator('phoneBrand',{
        rules: [{
          required: true , message: '请选择手机品牌！',
        }],
        initialValue:phoneBrand
      })(<Select>
         { optionList2 }
      </Select>)}
    </FormItem>
    <FormItem label="内部型号" {...formItemLayout}>
      {getFieldDecorator('phoneModel',{
        rules: [{
          required: true , message: '请输入内部型号！',
        },{
          max:30,
          message: '最大长度30位',
        }],
        initialValue:phoneModel
      })(<Input/>)}
    </FormItem>
    <FormItem label="内存" {...formItemLayout}>
      {getFieldDecorator('phoneMemory',{
        rules: [{
          required: true , message: '请输入手机内存！',
        },{
          max:20,
          pattern:/^[1-9]{1}[0-9]*$/  ,
          message: '请输入正确的手机内存',
        }],
        initialValue:phoneMemory
      })(<Input/>)}
      <span style={{position: 'absolute',top:'-0px',left:'260px'}}>G</span>
    </FormItem>
    <FormItem label="总值" {...formItemLayout}>
      {getFieldDecorator('phoneTotalValue',{
        rules: [{
          required: true , message: '请输入总值！',
        },{
          pattern:/^(0|[1-9]\d*00)$/ ,
          message: '只能输入整百的数字',
        }
        
        ],
        initialValue:phoneTotalValue
      })(<Input/>)}
      <span style={{position: 'absolute',top:'-0px',left:'260px'}}>元</span>
    </FormItem>
    <FormItem label="估值" {...formItemLayout}>
      {getFieldDecorator('phoneAssessmentValue',{
        rules: [
        {
          required: true , message: '请输入估值！',
        },{
          pattern:/^(0|[1-9]\d*00)$/ ,
          message: '只能输入整百的数字',
        }],
        initialValue:phoneAssessmentValue
      })(<Input name="'"/>)}
      <span style={{position: 'absolute',top:'-0px',left:'260px'}}>元</span>
    </FormItem>
    <FormItem label="图片" {...formItemLayout}>
      {getFieldDecorator('phoneImg',{
        rules: [
        {
          required: false , message: '请选择图片！',
        }
        ],
        initialValue:phoneImg
      })(<img src={phoneImg} multiple="multiple" style={{width:200,height:100,border:'1px solid #ccc' }}/>)}
      <Input type ='file' name="phoneImg" multiple="multiple"  id="file" onChange={(e)=>Submit(event)}/>
    </FormItem>
    {/*<FormItem label="上传" {...formItemLayout}>
      {getFieldDecorator('phoneImg',{
        rules: [{
          required: true , message: '请上传手机图片！',
        },],
        name:"phoneImg"
      })(<Input type ='file' name="phoneImg" multiple="multiple" />)}
    </FormItem>*/}
    <FormItem>
      <Button type="primary"  htmlType="submit" loading={ btnloading } style={{ marginRight: 16 }} onClick={(e)=>handleSubmit(e)}>确定</Button>
      <Button type='class' onClick={()=>handleReset()} style={{marginLeft:'15px'}}>取消</Button>
    </FormItem>
  </Form>
}
management = Form.create()(management);

export default  management

