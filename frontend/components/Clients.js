import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, Row, Dropdown, DropdownButton, ButtonToolbar, Alert} from "react-bootstrap";
import Table from "./Table";

export default class Clients extends React.Component{
	constructor(props){
		super()
		this.state = {
			tableHeight: "100%",
			dropState: "Статус",
		}
		this.setHeight = this.setHeight.bind(this);
}

	// Определяем высоту окна и сохраняем
	setHeight(){
		let scr = document.documentElement.clientHeight;
		this.setState({
			tableHeight: String(scr - 295) + 'px',
		})
	}


	render(){
		if (this.state.tableHeight == "100%"){
			this.setHeight();
		}

		let data = []
		for (var i = 0; i < 100; i++) {
			data.push({
				status:"Ф.И.О.",
				name: "Ф.И.О.",
				country: "Страна",
				program: "Название программы",
				data: "Дата отъезда"
			});
		}

		let clients =
			<Col lg={12} md={12}>
					<Table data={data} screen={this.state.tableHeight}/>
					{/*Ниже данные с сервера*/}
			</Col>;

		return(clients);
	}
};
