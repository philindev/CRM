import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, Row, Dropdown, DropdownButton, ButtonToolbar, Alert} from "react-bootstrap";
import Table from "./Table";

export default class Clients extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			tableHeight: "100%",
			dropState: "Статус",
			data: [
				{
					status:"Вылет",
					name: `Красников Максим Николаевич`,
					country: "Филиппины",
					program: "5 недель Cambridge 2",
					data: "30.06.2019",
					dateBirth: "9 июня 2003 года",
					clientStatus: "V.I.P.",
					mail: "mimoz200385@gmail.com",
					number: "+7 964-430-58-68",
					year: "2019 год",
					type: "Группа",
					comment: null,
				},
				{
					status:"Вылет",
					name: `Вольных Елизавета Игоревна`,
					country: "Филиппины",
					program: "5 недель Cambridge 2",
					data: "30.06.2019"
				},
				{
					status:"Договор",
					name: `Полубояринова Оксана Евгеньевна`,
					country: "Корея",
					program: "Подготовка IELTS",
					data: "30.01.2020"
				},
				{
					status:"Вылет",
					name: `Вайсеро Ольга Степновна`,
					country: "Филиппины",
					program: "4 недели интенсив",
					data: "30.05.2019"
				},
				{
					status:"Не заполнен",
					name: `Иванов Артем Ростиславович`,
					country: "Англия",
					program: "Oxford 5 недель",
					data: "14.04.2021"
				},
				{
					status:"Вылет",
					name: `Красников Максим Николаевич`,
					country: "Филиппины",
					program: "5 недель Cambridge 2",
					data: "30.06.2019"
				},
				{
					status:"Вылет",
					name: `Вольных Елизавета Игоревна`,
					country: "Филиппины",
					program: "5 недель Cambridge 2",
					data: "30.06.2019"
				},
				{
					status:"Договор",
					name: `Полубояринова Оксана Евгеньевна`,
					country: "Корея",
					program: "Подготовка IELTS",
					data: "30.01.2020"
				},
				{
					status:"Вылет",
					name: `Вайсеро Ольга Степновна`,
					country: "Филиппины",
					program: "4 недели интенсив",
					data: "30.05.2019"
				},
				{
					status:"Не заполнен",
					name: `Иванов Артем Ростиславович`,
					country: "Англия",
					program: "Oxford 5 недель",
					data: "14.04.2021"
				},
			]
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

		let clients =
			<Col lg={12} md={12} xl={12}>
					<Button
						onClick={this.setHeight}
						size="sm" variant="outline-info"
						style={{
							fontFamily: "sans-serif",
							fontWeight: "light",
							fontSize: "8pt",
							textAlign: "center",
							position: "absolute",
							right: "10px",
						}}
					>
						обновить
					</Button>
					{/*Ниже данные с сервера*/}
					<Table
						data={this.state.data} screen={this.state.tableHeight}
						openInfo={this.props.openInfo}
					/>
			</Col>;

		return(clients);
	}
};
