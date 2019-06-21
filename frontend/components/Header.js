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
	// Винный цвет 
	const tongueColor = "#AB274F";
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
				<Navbar collapseOnSelect expand="lg" sticky="top" variant="light"
					style={{
						background: "#E4E0DC",
					}}
				>
				  <Navbar.Brand>
				  	<img 
				  		src="image/logo.svg"
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
				    	<Nav.Link>Создать</Nav.Link>
				    	<Nav.Link style={{marginLeft: "20px"}}>
				    	Статистика
				    	</Nav.Link>
					    <Nav.Link onClick={this.changeBell}
					    		  style={{marginLeft: "20px"}}
					    >
					    	{bell}
					    </Nav.Link>

					    <Nav.Link>
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

