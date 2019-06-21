import React from "react";
import ReactDOM from "react-dom";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {BootstrapTable,
       TableHeaderColumn} from 'react-bootstrap-table';

export default class Table extends React.Component{
  constructor(props){
		super()
		this.state = {
			dropState: "Статус",
		}

		this.setNameStatus = this.setNameStatus.bind(this);
	}

  // Меняет имя Статусу заявки
	setNameStatus(name){
		this.setState({
			dropState: name,
		})
	}

  render(){
    console.log(this.props.screen);
    return(
      <div style={{overflow: "auto", height: this.props.screen}}>
        <BootstrapTable data={this.props.data}>
          <TableHeaderColumn isKey dataField='status' width="140px">
            Не заполнено
          </TableHeaderColumn>
          <TableHeaderColumn dataField='name' width="250px">
            Ф.И.О.
          </TableHeaderColumn>
          <TableHeaderColumn dataField='country' width="150px">
            Страна
          </TableHeaderColumn>
          <TableHeaderColumn dataField='program' width="250px">
            Название программы
          </TableHeaderColumn>
          <TableHeaderColumn dataField='data' width="100px">
            Дата отъезда
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
};
