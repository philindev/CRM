import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge, Button,
					FormControl} from "react-bootstrap";
import ClientRequestInfo from "./ClientRequestInfo";
import ClientPersonalInfo from "./ClientEditInfo";

export default class ClientInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
			dataClient: this.props.dataClient,
      editClient: false,
			editRequest: false,
			loading: false,
			ChangeClient: false,
			updateData: this.props.updateData,
			window_status: 0,

			money: 0,
			brief: '',
			cause: ''
    }
		this.submitClient = this.submitClient.bind(this);
		this.submitRequest = this.submitRequest.bind(this);
		this.sendRequest = this.sendRequest.bind(this);
		this.changeWindow = this.changeWindow.bind(this);
		this.deleteInfo = this.deleteInfo.bind(this);
		this.SetDefault = this.SetDefault.bind(this);
  }


	componentWillReceiveProps(nextProps){
    this.setState({
			dataClient: nextProps.dataClient,
			updateData: nextProps.updateData,
		})
  }

	SetDefault(){
		this.state.updateData();
		this.changeWindow("Default");
		this.props.closeWindow();
	}

	changeWindow(num){
		this.setState({window_status: num})
	}

	submitClient(obj){
		const main = this;
		fetch('/ChangeClient',
				{
					method: 'post',
					headers: {
						'Content-Type':'application/json',
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
					},
					body: JSON.stringify(obj),
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
						if(data != false){
							main.setState({
								editClient: false,
								loading: false,
							})
							main.state.updateData();
							main.props.closeWindow();
						}
						});
	})
}

	//Изменяет статус клиента
	sendRequest(str){
		let client = this.state.dataClient.client;
		const main = this;
		let id = client.client_id;

		if(str != "Отказ" && str != "Закрыто"){

			fetch('/ChangeCurrentStatus',
					{
						method: 'post',
						headers: {
							'Content-Type':'application/json',
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
						},
						body: JSON.stringify({
							token: this.props.user.token,
							status: str,
							data: {
								id: client.client_id,
							},
						}),
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
							if(data != false){
								main.state.updateData();
								main.props.closeWindow();
							}
							else{ console.log("Something goes wrong!") }
							});
					})
			}
			else if (str == "Закрыто" && this.props.user.user_status == 'Admin') {
				let sure = confirm("Вы уверены, что хотите закрыть заявку?");
				if(sure){
					main.changeWindow(1);
				}
			}
			else if (str == "Отказ") {
				let sure = confirm("Вы уверены, что хотите написать \'Отказ\'?");
				if(sure){
					main.changeWindow(2);
				}
			}
	}

	deleteInfo(parametr: String, id: Number){
		let booly = confirm("Вы уверенны, что хотите удалить?")
		const main = this;
		if (parametr === 'Client' && booly){
			fetch('/Delete/Client',
					{
						method: 'post',
						headers: {
							'Content-Type':'application/json',
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
						},
						body: JSON.stringify({
							token: this.props.user.token,
							client_id: id,
						}),
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
							if(data != false || data != null){
									main.state.updateData();
									main.props.closeWindow();
							}
		})})
		}
	}


	submitRequest(obj){
		const main = this;
		fetch('/ChangeCurrent',
				{
					method: 'post',
					headers: {
						'Content-Type':'application/json',
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
					},
					body: JSON.stringify(obj),
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
						if(data != false){
								main.setState({
									editRequest: false,
									loading: false,
								})
								main.state.updateData();
								main.props.closeWindow();
						}
						else{ console.log("Something goes wrong!") }
						});
				})
	}



  render(){
    let sizeOfData = Object.keys(this.state.dataClient).length;
    let modalInfo = null;
    let status = null;
		// Открытие окна информации клиента
		if(sizeOfData){
			let request = this.state.dataClient.request;
			let client = this.state.dataClient.client;
			let history = this.state.dataClient.history;

			switch (client.client_status) {
				case 1:
					status = "V.I.P"
					break;
				case 3:
					status = "Повторный"
				default:
					status = "Новый"
			}

    let commonWindow =
    	<Modal.Body>

	    		<ClientPersonalInfo SetDate={this.props.SetDate}
											client={client}
											submitClient={this.submitClient}
											user={this.props.user}/>

		      <hr/>

					<ClientRequestInfo request={request}
														submitRequest={this.submitRequest}
														user={this.props.user}
														StatusForm={this.props.StatusForm}
														closeWindow={this.props.closeWindow}
														updateId={this.props.updateId}
														client={client}
														SetDate={this.props.SetDate}
														sendRequest={this.sendRequest}/>

          <hr/>
					<Row>
								<Col>
			          <h5>	<b>История поездок:</b>	</h5>
			          <br />
					          {
					            (!Object.keys(history).length) ?

											<span style={{paddingLeft: "40%"}}> Пусто </span>

											:

					            history.map((data, ind) => <tr style={{textAlign: "center", fontSize: "10pt", border: "1px solid grey"}}																					      >
					            <th>{data.status}</th>
					            <td>{data.program_name}</td>
					            <td>{data.country}</td>
					            <td>{data.year_of_fly}</td>
					            <td>{data.type}</td>
					            </tr>)

					          }
								</Col>
					</Row>


      </Modal.Body>;

	let window_render = null;
	let window_footer = null;

	switch (this.state.window_status) {

		case 1:

			window_render =
			<Modal.Body>
				<h4>{request.program_name} - {request.country}</h4>
				< br />
				<InputGroup className="mb-3" style={{fontSize: "14px"}}>
					<InputGroup.Prepend>
						<InputGroup.Text>Заработано:</InputGroup.Text>
					</InputGroup.Prepend>
			    <FormControl onChange={(e) => this.setState({money: e.target.value})}/>
				</InputGroup>

				<InputGroup style={{fontSize: "14px"}}>
			    <InputGroup.Prepend>
			      <InputGroup.Text>Заметки</InputGroup.Text>
			    </InputGroup.Prepend>
			    <FormControl as="textarea" aria-label="With textarea" onChange={(e) => this.setState({brief: e.target.value})}/>
			  </InputGroup>

			</Modal.Body>;

			window_footer =
					<Modal.Footer>
						<Button onClick={() => {
							fetch('/ChangeCurrentStatus',
									{
										method: 'post',
										headers: {
											'Content-Type':'application/json',
											"Access-Control-Allow-Origin": "*",
											"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
										},
										body: JSON.stringify({
											data: {
												money: this.state.money,
												brief: this.state.brief,
												id: client.client_id,
											},
											token: this.props.user.token,
											status: "Закрыто"
										}),
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
											if(data != false){
													console.log(data)
													this.state.updateData();
													this.setState(window_status: 0);
													this.props.closeWindow();
											}
						})})}}
										variant="outline-warning"
										centered
						>Сохранить</Button>
					</Modal.Footer>;
			break;

		case 2:


							window_render =
							<Modal.Body>
								<h4>{request.program_name} - {request.country}</h4>
								< br />
								<InputGroup className="mb-3" style={{fontSize: "14px"}}>
									<InputGroup.Prepend>
										<InputGroup.Text>Заголовок:</InputGroup.Text>
									</InputGroup.Prepend>
							    <FormControl onChange={(e) => this.setState({cause: e.target.value})}/>
								</InputGroup>

								<InputGroup style={{fontSize: "14px"}}>
							    <InputGroup.Prepend>
							      <InputGroup.Text>Причина:</InputGroup.Text>
							    </InputGroup.Prepend>
							    <FormControl as="textarea" aria-label="With textarea" onChange={(e) => this.setState({brief: e.target.value})}/>
							  </InputGroup>

							</Modal.Body>

							window_footer =
									<Modal.Footer>
										<Button onClick={() => {
											fetch('/ChangeCurrentStatus',
													{
														method: 'post',
														headers: {
															'Content-Type':'application/json',
															"Access-Control-Allow-Origin": "*",
															"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
														},
														body: JSON.stringify({
															data: {
																cause: this.state.money,
																brief: this.state.brief,
																id: client.client_id,
															},
															token: this.props.user.token,
															status: "Отказ"
														}),
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
															if(data != false){
																	console.log(data)
																	this.state.updateData();
																	this.setState(window_status: 0);
																	this.props.closeWindow();
															}
										})})}}
														variant="outline-warning"
														centered
										>Сохранить</Button>
									</Modal.Footer>;

			break;

			default:

			window_render = commonWindow
			window_footer = this.props.user.user_status != "Admin" ? null :
					<Modal.Footer id="specialRed">
						<DropdownButton
						alignRight
						title="Дополнительные опции"
						variant="#fff"
						>
								<Dropdown.Item onClick={() => this.deleteInfo('Client', client.client_id)}>Удалить клиента</Dropdown.Item>
								<Dropdown.Divider />

						</DropdownButton>
					</Modal.Footer>;

		}


		modalInfo =
			    <Modal
						    size="lg"
						    show={ this.state.dataClient != {}? true: false}
						    onHide={() => this.SetDefault()}
						    aria-labelledby="example-modal-sizes-title-lg"
						    style={{ maxHeight: this.props.setHeight(), overflow: "auto"}}>
							    <Modal.Header closeButton>
							    			<Modal.Title><span className="gosha" style={{fontSize: "30px"}}> {client.client_name} </span><Badge variant="danger">{status}</Badge></Modal.Title>
							    </Modal.Header>
						    	{window_render}
									{window_footer}
			    </Modal>;
		} else {
			modalInfo = null
		}


		return(modalInfo)

 }
}
