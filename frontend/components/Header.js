import React from "react";
import ReactDOM from "react-dom";
import {Navbar, Nav, NavDropdown, Popover, OverlayTrigger,
				Dropdown, DropdownButton, Modal} from "react-bootstrap"

export default class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			notification_bell: 0,
			alert: false,
		}
		this.changeBell = this.changeBell.bind(this);
		this.get_file_url = this.get_file_url.bind(this);
	};
	// Функция меняет цвет колокольчика после нажатия
	changeBell() {
		this.setState({
			notification_bell: (this.state.notification_bell) ? 0 : 1,
		});
	}


	get_file_url(url) {
		let token = this.props.user.token;
		const main = this;
		fetch("/Download/" + url, {
			method: 'post',
			headers: {
				'Content-Type':'application/json',
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
			},
			body: JSON.stringify({
				token: this.props.user.token,
			}),
	  })
		.then(
		function(response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' +
					response.status);
				if(response.status === 500){
						console.log("Status: 500")
				}
				return;
			}
			response.json()
			.then(function(data) {
				if(data === null){
					main.setState({alert: true})
				} else {
					let current_location = document.location.href;
					window.open(current_location + '/' + data, '_blank');
				}
				});
		})

	  .catch(function (error) {
	    console.log('Request failed', error);
	  });

	}

	render(){
	// Окно ошибок
	let wrongTabs =
	<Modal onHide={() => this.setState({alert: false})} show={this.state.alert}>
	  <Modal.Header closeButton>
	    <Modal.Title>Скачивание таблицы</Modal.Title>
	  </Modal.Header>

	  <Modal.Body>
	    <p>Что-то пошло не так. Скорее всего данной информации нет на сервере.
				 Если такое повториться снова, обратитесь в тех.поддержку!</p>
	  </Modal.Body>
</Modal>;

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
				<img src="./frontend/image/notification.png"
			                 style={{
			                   marginLeft: "20px",
			                   height: "25px",
			                 }}
			            /> :
			    <img src="./frontend/image/notification light.png"
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
				<Dropdown.Item onClick={() => this.get_file_url('closed')}>Статистика отказов - причины</Dropdown.Item>
				<Dropdown.Item onClick={() => this.get_file_url('finance')}>Финансовые показатели</Dropdown.Item>
				<Dropdown.Item onClick={() => this.get_file_url('statics')}>Общая статистика</Dropdown.Item>
			  {/*}<Dropdown.Divider />
			<Dropdown.Item>Другое</Dropdown.Item>*/}
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
							{/*<OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
							    <Nav.Link onClick={this.changeBell}>
							    	{bell}
							    </Nav.Link>
								</OverlayTrigger>*/}
					    <Nav.Link onClick={this.props.exit}>
					    	<img src="frontend/image/exit.png"
				                 style={{
				                   marginLeft: "20px",
				                   height: "25px",
				                 }}
				            />
					    </Nav.Link>
				    </Nav>
				  </Navbar.Collapse>
					{wrongTabs}
				</Navbar>;

		return(header)
	}
};
