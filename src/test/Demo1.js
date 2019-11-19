/**
*
* @title 列过滤面板
* @parent 列操作-隐藏 Hide
* @description 点击表头右侧按钮，设置显示或隐藏表格列。可以自定义设置显示某列，通过ifshow属性控制，默认值为true（显示表格所有列）。afterFilter方法为列过滤后触发的回调函数。
* demo0802
*/


import React, { Component } from 'react';
import {Icon,Popover} from "tinper-bee";
import Table from '../../src';
import filterColumn from '../../src/lib/filterColumn';
import sum from '../../src/lib/sum';

const data = [
  { 
    orderCode:"NU0391025", 
    supplierName: "xx供应商",
    type_name: "1",
    purchasing:'组织c', 
    purchasingGroup:"aa",
    voucherDate:"2018年03月18日",
    approvalState_name:"已审批",
    confirmState_name:"执行中",
    closeState_name:"未关闭",
    key: "1"
  }, 
  { 
    orderCode:"NU0391026", 
    supplierName: "xx供应商",
    type_name: "2",
    purchasing:'组织a', 
    purchasingGroup:"bb",
    voucherDate:"2018年02月05日",
    approvalState_name:"已审批",
    confirmState_name:"待确认",
    closeState_name:"未关闭",
    key: "2"
  },
  { 
    orderCode:"NU0391027", 
    supplierName: "xx供应商",
    type_name: "3",
    purchasing:'组织b', 
    purchasingGroup:"aa",
    voucherDate:"2018年07月01日",
    approvalState_name:"已审批",
    confirmState_name:"终止",
    closeState_name:"已关闭",
    key: "3"
  }
];

const FilterColumnTable = filterColumn(Table, Popover, Icon);

const defaultProps21 = {
  prefixCls: "bee-table"
};

class Demo21 extends Component {
  constructor(props) {
    super(props);
    this.state ={
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: 80, 
          fixed: 'left',
          render(text, record, index){return index + 1}
        },
        {
            title: "订单编号",
            dataIndex: "orderCode",
            key: "orderCode",
            width: 100, 
            fixed: 'left',
        },
        {
            title: "供应商名称",
            dataIndex: "supplierName",
            key: "supplierName",
            width: 150
        },
        {
            title: "类型",
            dataIndex: "type_name",
            key: "type_name",
            width: 100
        },
        {
            title: "采购组织",
            dataIndex: "purchasing",
            key: "purchasing",
            width: 100
        },
      ]};
  }
  afterFilter = (optData,columns)=>{
    if(optData.key == 'b'){
        if(optData.ifshow){
          columns[2].ifshow = false;
        }else{
          columns[2].ifshow = true;
        }
        this.setState({
          columns21 :columns,
          showFilterPopover:true
        });
    }
    
  }
 
  render() {
    return <FilterColumnTable 
            columns={this.state.columns} 
            data={data} 
            afterFilter={this.afterFilter} 
            showFilterPopover={this.state.showFilterPopover}
            />;
  }
}

Demo21.defaultProps = defaultProps21;
export default Demo21;