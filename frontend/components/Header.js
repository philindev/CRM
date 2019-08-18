import React from "react";
import ReactDOM from "react-dom";
import {Navbar, Nav, NavDropdown, Popover, OverlayTrigger,
				Dropdown, DropdownButton} from "react-bootstrap"

export default class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			notification_bell: 0,
		}
		this.changeBell = this.changeBell.bind(this);
	};
	// Функция меняет цвет колокольчика после нажатия
	changeBell() {
		this.setState({
			notification_bell: (this.state.notification_bell) ? 0 : 1,
		});
	}

	render(){
	// Окно уведомлений
	const popover =
			<Popover id="popover-basic" style={{ minHeight: "200px", minWidth: "250px"}}>
			<hr />
				<h6 style={{ fontColor: "grey", textAlign: "center", marginTop: '70px'}}>
					Нет уведомлений
				</h6>
			<hr />
		  </Popover>;
	// Винный цвет
	const tongueColor = "#AB274F";
	// Переменная для смены цвета колокольчика уведомлений
	let bell =
				this.state.notification_bell ?
				<img src="frontend/image/notification.png"
			                 style={{
			                   marginLeft: "20px",
			                   height: "25px",
			                 }}
			            /> :
			    <img src="frontend/image/notification light.png"
			                 style={{
			                   marginLeft: "20px",
			                   height: "25px",
			                 }}
			            />;
	// Статистика выпадающее меню
	let statistic =
			<DropdownButton
			  alignRight
			  title="Статистика"
				variant="light"
				>
				<Dropdown.Item>Статистика отказов - причины</Dropdown.Item>
				<Dropdown.Item>Финансовые показатели</Dropdown.Item>
				<Dropdown.Item>Общая статистика</Dropdown.Item>
			  <Dropdown.Divider />
			  <Dropdown.Item>Другое</Dropdown.Item>
			</DropdownButton>;

	// Отрисовка главного навигатора
	let header =
				<Navbar collapseOnSelect expand="lg" sticky="top" variant="light"
					style={{
						background: "#E4E0DC",
					}}
				>
				  <Navbar.Brand>
				  	<img
				  		src="frontend/image/logo.svg"
				  		style={{cursor: "pointer"}}
				  	/>
				  </Navbar.Brand>
				  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
				  <Navbar.Collapse id="responsive-navbar-nav">
				  	<Nav className="ml-auto"
				  		style={{
				  			fontColor: "#000",
				  			fontFamily: "Raleway, sans-serif",
				  			fontSize: "14pt",
				  		}}
				  	>
				    	<Nav.Link onClick={this.props.onCreate} style={{marginRight: "20px"}}
							>Создать</Nav.Link>
				    	<Nav.Link style={{marginRight: "20px"}}>
				    	 {statistic}
				    	</Nav.Link>
							<OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
							    <Nav.Link onClick={this.changeBell}>
							    	{bell}
							    </Nav.Link>
								</OverlayTrigger>
					    <Nav.Link>
					    	<img src="frontend/image/exit.png"
				                 style={{
				                   marginLeft: "20px",
				                   height: "25px",
				                 }}
				            />
					    </Nav.Link>
				    </Nav>
				  </Navbar.Collapse>
				</Navbar>;

		return(header)
	}
};
