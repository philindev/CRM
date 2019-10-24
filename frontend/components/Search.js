import React from "react";
import ReactDOM from "react-dom";
import {InputGroup, FormControl, Button, OverlayTrigger, Popover,
				Form, Col, Row, DropdownButton, Dropdown} from "react-bootstrap";

function preparingSt(string: String) :String {
	if(string == null || string == false){
		return ""
	}
	string = string[0].toUpperCase() + string.slice(1).toLowerCase()

	return string
}

export default class Search extends React.Component{
	constructor(props){
		super(props);
		console.log("work");
		this.state = {
			searchLine: '',
			phone_number: '',
			status: '',
			show: false,
			buttonName: 'Статус'
		}

		this.sendSubmit = this.sendSubmit.bind(this);
		this.changeState = this.changeState.bind(this);
	}

	sendSubmit(){
		const main = this;
		bn = this.state.buttonName;

		let files = {
			searchLine: this.state.searchLine,
			phone_number: this.state.phone_number || "",
			status: bn == "Конс-ция" ? "Консультация" : bn
		}
		if(
			files.searchLine ||
			files.phone_number ||
			files.status
		){
			fetch('/Search',
	        {
	          method: 'post',
	          headers: {
	            'Content-Type':'application/json',
	            "Access-Control-Allow-Origin": "*",
	            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	          },
	          body: JSON.stringify(files),
	        })
	        .then(
	        function(response) {
	          if (response.status !== 200) {
	            console.log('Looks like there was a problem. Status Code: ' + response.status);
	            if(response.status === 500){
	                console.log("Status: 500")
	            }
	            return;
	          }

	          // Examine the text in the response
	          response.json()
	          .then(function(data) {
	            console.log(data);
							if(data.length){
								main.props.changeBySearch(data);
								console.log("Completly changed!")
							}
	            });
	        })
		}
	}

	changeState(){
		this.setState({
			show: !this.state.show,
			phone_number: '',
			status: ''
		})
	}

	render(){
		const main = this;

		let searchLine =
				<Row>
					<Col lg={12} md={12} xl={12}>
					<InputGroup className="my-3">
						<FormControl
							name="SearchLine"
							placeholder="Ф.И.О."
							aria-label="Recipient's username"
							aria-describedby="basic-addon2"
							onKeyPress={ (event) => {
								if(event.key == 'Enter' ){
									main.sendSubmit();
								}
								return false;
							}}
							onChange={(e) => this.setState({searchLine: e.target.value})}
							size="lg"
							/>
						<InputGroup.Append>
							<Button variant="outline-danger"
								onClick={this.sendSubmit}
								style={{
									width: "100px",
								}}
								>
								Поиск
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Col>
				<Col xs={12} lg={1} md={2} xl={1}>
					<Button variant={this.state.show ? "outline-secondary" :"outline-danger"}
									size="sm"
									onClick={this.changeState}
						>
						{this.state.show ? 'Скрыть' : 'Фильтр'}
					</Button>
				</Col>
				{ this.state.show?
					<Col xs={8} lg={10} md={9} xl={10} className="ml-3">
						<InputGroup>
							<FormControl type="text" placeholder="Номер телефона" size="sm"
								onChange={(e) => this.setState({phone_number: e.target.value})}
								/>
							<DropdownButton
							alignRight
							title={this.state.buttonName}
							variant="secondary"
							size="sm"
							>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Заявка"})}>Заявка</Dropdown.Item>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Договор"})}>Договор</Dropdown.Item>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Оплата"})}>Оплата</Dropdown.Item>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Конс-ция"})}>Консультация</Dropdown.Item>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Оформление"})}>Оформление</Dropdown.Item>
										<Dropdown.Item onClick={() => this.setState({buttonName: "Выезд"})}>Выезд</Dropdown.Item>
								</DropdownButton>
						</InputGroup>
					</Col>
					: null
				}
				</Row>

		return(searchLine);
	}
}
