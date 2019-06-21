import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, Row, Dropdown, DropdownButton, ButtonToolbar, Alert} from "react-bootstrap";

export default class Clients extends React.Component{
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

		let clients = 
			<Col lg={12} md={12}>
				<Row>
					<ButtonToolbar style={{ height: "30px"}}>
						
					    <Col lg={2} md={2}>
					    <DropdownButton
							lg={12} md={12}
					        title={this.state.dropState}
					        variant="secondary"
					        id={`dropdown-variants-secondary`}
					        key="Secondary"
					        style={{ width: "100px"}}
					        >
					        <Dropdown.Item onClick={() => this.setNameStatus("Не заполнен")}>Не заполнен</Dropdown.Item>
					        <Dropdown.Item className="mr-5" onClick={() => this.setNameStatus("Заявка")}>Заявка</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("Договор")}>Договор</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("Оплата")}>Оплата</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("Выезд")}>Выезд</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("План")}>План</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("Отказ")}>Отказ</Dropdown.Item>
					        <Dropdown.Item onClick={() => this.setNameStatus("Закрытые")}>Закрытые</Dropdown.Item>
					        <Dropdown.Divider />
					        <Dropdown.Item onClick={() => this.setNameStatus("Статус")}>По-умолчанию</Dropdown.Item>
					    </DropdownButton>

					    </Col>
					    
						<Col lg={3} md={3}>
							<Alert variant="dark" className="mr-3" lg={12} md={12}>
							  Ф.И.О.
							</Alert>
						</Col>
						
						<Col lg={2} md={2}>
							<Alert variant="dark" className="mr-3" lg={12} md={12}>
							  Страна
							</Alert>
						</Col>
						
						<Col lg={3} md={3}>
							<Alert variant="dark" className="mr-3" lg={12} md={12}>
							  Название программы
							</Alert>
						</Col>
						
						<Col lg={1} md={1}>
						<Alert variant="dark" className="mr-3" lg={12} md={12}>
						  Дата отъезда
						</Alert>
						</Col>
					</ButtonToolbar>
					{/*Ниже данные с сервера*/}
				</Row>
			</Col>;

		return(clients);
	}
};
