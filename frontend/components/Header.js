import React from "react";
import ReactDOM from "react-dom";
import {Navbar, Nav, NavDropdown} from "react-bootstrap"

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
	// Переменная для смены цвета колокольчика уведомлений
	let bell = 
				this.state.notification_bell ? 
				<img src="image/notification.png"
			                 style={{
			                   marginLeft: "20px",
			                   height: "25px",
			                 }}
			            /> :
			    <img src="image/notification light.png"
			                 style={{
			                   marginLeft: "20px",
			                   height: "25px",
			                 }}
			            />;
	// Отрисовка главного навигатора
	let header = 
				<Navbar collapseOnSelect expand="lg"
					style={{
						background: "#AB274F"
					}}
				>
				  <Navbar.Brand href="#home">First Academy</Navbar.Brand>
				  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
				  <Navbar.Collapse id="responsive-navbar-nav">
				  	<Nav className="ml-auto"
				  		style={{
				  			fontColor: "black",
				  		}}
				  	>
				    	<Nav.Link href="#creat_client">Создать</Nav.Link>
				    	<Nav.Link href="#Statics">Статистика</Nav.Link>  
					    <Nav.Link href="#Notification" 
					    		onClick={this.changeBell}
					    >
					    	{bell}
					    </Nav.Link>
					    <Nav.Link href="#Exit">
					    	<img src="image/exit.png"
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

