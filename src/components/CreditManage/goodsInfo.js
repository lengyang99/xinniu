import React, {Component} from 'react';
import Editor from 'wangeditor'
import {Form} from "antd/lib/index";
import './editor.css'

const FormItem = Form.Item;
var e ;
@Form.create()


export default class MerchantManage extends Component{
  componentDidMount () {
    var editor = new Editor(document.getElementById('desc'));
    editor.customConfig.onchange = (html) => {
      this.props.goodsInfo(editor.txt.html().replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, " "))
    }

    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'image',  // 插入图片
      // 'table',  // 表格
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ]
    editor.customConfig.uploadImgServer = '/modules/manage/goods/imgUpdate.htm'
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.uploadImgMaxLength = 1
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果

      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {

        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：

        var url = result.resultData
        insertImg(url)

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    editor.create();
    editor.txt.html(this.props.info)
    e = editor;
  }
  showHtml = () => {
    let html = e.txt.html()
    let a = document.getElementsByClassName('html')[0]
    if (a.innerText == '预览源码'){
      a.innerText = '取消预览'
      html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
      e.txt.html(html)
    }else if (a.innerText == '取消预览'){
      a.innerText = '预览源码'
     html = html.replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&nbsp;/ig, " ")
      e.txt.html(html)
    }
  }
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <FormItem label="商品描述">
        {getFieldDecorator('desc', {
          rules: [{
            message: '请填写描述',
          }],
          initialValue: ''
        })(<div id='editor' style={{height:'400px',maxWidth:'634px'}}></div>)}
        <a className='html' onClick={() => this.showHtml()}>预览源码</a>
      </FormItem>

    )
  }
}
