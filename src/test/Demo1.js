/**
*
* @title 数据关联
* @parent 列渲染 Custom Render
* @description 数据行关联自定义菜单显示
* demo0404
*/

import React, { Component } from 'react';
import {Icon,Checkbox,Dropdown,Menu} from 'tinper-bee';
import Table from '../../src';
import multiSelect from "../../src/lib/newMultiSelect";
import sort from "../../src/lib/sort";

const { Item } = Menu;

const data = [
  { 
    num:"NU0391025", 
    name: "aa",
    sex: "男",
    dept:'财务二科', 
    rank:"T1",
    year:"1",
    seniority:"1",
    key: "1"
  }, 
  { 
    num:"NU0391026", 
    name: "bb",
    sex: "女",
    dept:'财务一科', 
    rank:"M1",
    year:"1",
    seniority:"1",
    key: "2"
  },
  { 
    num:"NU0391027", 
    name: "dd",
    sex: "女",
    dept:'财务一科', 
    rank:"T2",
    year:"2",
    seniority:"2",
    key: "3"
  }
];

const MultiSelectTable = multiSelect(Table, Checkbox);
const ComplexTable = sort(MultiSelectTable, Icon);

class Demo33 extends Component {
    constructor(props) {
        super(props);
    }
    getSelectedDataFunc = data => {
        console.log(data);
    }
    onSelect = (item) => {
        console.log(item);
    }
    render() {
        const menu1 = (
            <Menu
                onSelect={this.onSelect}>
                <Item key="1">模态弹出</Item>
                <Item key="2">链接跳转</Item>
                <Item key="3">打开新页</Item>
            </Menu>);
        let columns = [
            {   title: "关联",dataIndex: "link",key: "link",width: 80, 
                render: (text, record, index) => {
                    return (
                        <Dropdown
                            trigger={['click']}
                            overlay={menu1}
                            animation="slide-up"
                        >
                            <Icon type="uf-link" style={{color:'rgb(0, 72, 152)',fontSize:'12px'}}></Icon>
                        </Dropdown>
                    )
                }
            },
            { title: "员工编号",dataIndex: "num",key: "num",width: 200 },
            { title: "员工姓名",dataIndex: "name",key: "name", width: 200},
            { title: "员工性别",dataIndex: "sex",key: "sex",width: 200 },
            { title: "部门",dataIndex: "dept",key: "dept",width: 200},
            { title: "职级",dataIndex: "rank",key: "rank",width: 200},
            { title: "工龄",dataIndex: "year",key: "year",width: 200},
            { title: "司龄",dataIndex: "seniority",key: "seniority",width: 200}
        ];
        return <ComplexTable 
                bordered
                columns={columns} 
                data={data} 
                multiSelect={{type: "checkbox"}}
                getSelectedDataFunc={this.getSelectedDataFunc}
                autoCheckedByClickRows={false} //行点击是否触发勾选动作
                />
    }
}

export default Demo33; 