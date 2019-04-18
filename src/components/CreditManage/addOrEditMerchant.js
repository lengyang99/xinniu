import React, {PureComponent} from 'react';
import { Form, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;

let uuid;

class DynamicFieldSet extends PureComponent {
  state={
    visible: 'inline-block',
  }
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  componentDidMount() {

    uuid=0;
  };

  componentWillUnmount() {

  }

  add = () => {
    this.setState({
      visible: 'none'
    })
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  getGoodsCategory = (e) => {
    let str1;
    e.preventDefault();
    this.props.form.validateFields(['names'],(err, values) => {
      if (!err) {

        for (let i = 0; i < values.names.length; i++){

          if(values.names[i] == undefined){
            values.names.splice(i,1);
            i = i - 1;
          }
        }

        str1=values.names.join(',')

        this.props.addGoodsCategory(str1)
      }

    });

  };

  // value =(e) => {
  //   console.log(e.target.value, e);
  // }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          style={{display: 'flex', flexDirection: 'column', textAlign:'left', marginTop: 10}}
          // label={index === 0 ? '添加分类' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "请输入正确分类",
            }],
          })(
            <Input placeholder="" style={{ width: '30%', marginRight: 8, marginLeft:50 }} maxLength='15'/>
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <div>
        {
          this.props.list.goodsCategoryList?<div>
            已有分类:
            {
              this.props.list.goodsCategoryList.map((item, index) => {
                return <Input key={index} style={{width: 100, marginTop:10, marginLeft:10}} value={item.category} disabled/>
              })
            }
          </div>:null
        }



        <span style={{marginRight: 15, marginTop: 10, display: 'block'}}>添加分类:</span>
        {formItems}
        <FormItem style={{ width: '60%' }}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%', display: 'flex', justifyContent: 'center', marginTop: 15, marginLeft:50 }}>
            <Icon type="plus" />
          </Button>
          <Button type="primary" style={{marginTop: 15, marginLeft:50}} onClick={this.getGoodsCategory}>保存分类</Button>
        </FormItem>
      </div>


    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;

