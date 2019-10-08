import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge, Button,
					FormControl} from "react-bootstrap";

class EditClient extends Component{
	constructor(props){
		super(props);
		const first = this.props.client.parents.first_parent;
		const second = this.props.client.parents.second_parent;
		this.state = {

			person_name: this.props.client.client_name,
			person_phone: this.props.client.phone_number,
			person_mail: this.props.client.mail,
			person_birth: this.props.client.date_of_birth,

			first_name: first.name,
			first_work: first.work,
			first_email: first.email,
			first_phone: first.phone_number,

			second_name: second.name,
			second_work: second.work,
			second_email: second.email,
			second_phone: second.phone_number,
		}

	}

	checkValue(){
		const client = this.props.client;

		const state = this.state;
		let files = {
			token: this.props.user.token,
			client: {
				id: client.client_id,
				name: state.person_name,
				date_of_birth: state.person_birth,
				mail: state.person_mail,
				phone_number: state.person_phone,
				status: client.status,
				first_parent: {
					name: state.first_name,
					number: state.first_phone,
					mail: state.first_email,
					job: state.first_work,
				},
				second_parent: {
					name: state.second_name,
					number: state.second_phone,
					mail: state.second_email,
					job: state.second_work,
				}

			}
		}
		this.props.submit(files);
	}

	componentWillUnmount(){
		this.checkValue();
	}

	render(){

		let edit =

				<Col
					md={8}
					lg={8}
					lx={8}
				>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">Ф.И.О.</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							placeholder="Username"
							aria-label="Username"
							value={this.state.person_name}
							onChange={(e) => this.setState({person_name: e.target.value})}
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">Д/Р</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							type="date" className="form-control" id="exampleInputDOB1"
							placeholder="Дата Рождения"
							value={this.state.person_birth}
							onChange={(e) => this.setState({person_birth: e.target.value})}
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">Номер</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							aria-label="Username"
							placeholder="Номер телефона"
							value={this.state.person_phone}
							onChange={(e) => this.setState({person_phone: e.target.value})}
							aria-describedby="basic-addon1"
						/>
					</InputGroup>


					<label htmlFor="basic-url">Редактирование родителей:</label>
					<InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="basic-addon1">1) Ф.И.О</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				      placeholder="Первый родитель"
				      aria-label="Username"
				      aria-describedby="basic-addon1"
				      value={this.state.first_name}
							onChange={(e) => this.setState({first_name: e.target.value})}
				    />
				  </InputGroup>

					<InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="basic-addon1">Почта</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				      placeholder="Почта"
				      aria-label="Username"
				      aria-describedby="basic-addon1"
				      value={this.state.first_email}
							onChange={(e) => this.setState({first_email: e.target.value})}
				    />
				  </InputGroup>

					<InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="basic-addon1">Номер</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				      placeholder="Номер телефона"
				      aria-label="Username"
				      aria-describedby="basic-addon1"
				      value={this.state.first_phone}
							onChange={(e) => this.setState({first_phone: e.target.value})}
				    />
				  </InputGroup>

					<InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="basic-addon1">Место работы</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				      placeholder="Должность"
				      aria-label="Username"
				      aria-describedby="basic-addon1"
				      value={this.state.first_work}
							onChange={(e) => this.setState({first_work: e.target.value})}
				    />
				  </InputGroup>

					{
						(this.state.second_name == null ||
						 this.state.second_work == null ||
						 this.state.second_email == null ||
						 this.state.second_phone == null
					 )
					 ?

					 null

					 :
				 <div className="mt-3">
					 <InputGroup className="mb-3">
						 <InputGroup.Prepend>
							 <InputGroup.Text id="basic-addon1">2) Ф.И.О</InputGroup.Text>
						 </InputGroup.Prepend>
						 <FormControl
							 placeholder="Первый родитель"
							 aria-label="Username"
							 aria-describedby="basic-addon1"
							 value={this.state.second_name}
							 onChange={(e) => this.setState({second_name: e.target.value})}
						 />
					 </InputGroup>

					 <InputGroup className="mb-3">
						 <InputGroup.Prepend>
							 <InputGroup.Text id="basic-addon1">Почта</InputGroup.Text>
						 </InputGroup.Prepend>
						 <FormControl
							 placeholder="Почта"
							 aria-label="Username"
							 aria-describedby="basic-addon1"
							 value={this.state.second_email}
							 onChange={(e) => this.setState({second_email: e.target.value})}
						 />
					 </InputGroup>

					 <InputGroup className="mb-3">
						 <InputGroup.Prepend>
							 <InputGroup.Text id="basic-addon1">Номер</InputGroup.Text>
						 </InputGroup.Prepend>
						 <FormControl
							 placeholder="Номер телефона"
							 aria-label="Username"
							 aria-describedby="basic-addon1"
							 value={this.state.second_phone}
							 onChange={(e) => this.setState({second_phone: e.target.value})}
						 />
					 </InputGroup>

					 <InputGroup className="mb-3">
						 <InputGroup.Prepend>
							 <InputGroup.Text id="basic-addon1">Место работы</InputGroup.Text>
						 </InputGroup.Prepend>
						 <FormControl
							 placeholder="Должность"
							 aria-label="Username"
							 aria-describedby="basic-addon1"
							 value={this.state.second_work}
							 onChange={(e) => this.setState({second_work: e.target.value})}
						 />
					 </InputGroup>
				 </div>

					}
					</Col>;


		return(edit)
	}
}

class EditRequest extends Component{
	constructor(props){
		super(props);
		this.state = {
			program_name: this.props.request.program_name,
			country: this.props.request.country,
			type: this.props.request.type,
			departure_date: this.props.request.departure_date,
		}
	}

	checkValue(){
		let request = {
			token: this.props.user,
			name_of_program: this.state.program_name,
			country: this.state.country,
			type_of_program: this.state.type,
			comment: this.state.comment,
		}

		this.props.submit(request);
	}

	componentWillUnmount(){
		this.checkValue();
	}

	render(){
		let edit =

		<Col
			md={8}
			lg={8}
			lx={8}
		>

			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<InputGroup.Text id="basic-addon1">Название:</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					placeholder="Название программы"
					aria-label="Username"
					aria-describedby="basic-addon1"
					value={this.state.program_name}
					onChange={(e) => this.setState({program_name: e.target.value})}
				/>
			</InputGroup>

			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<InputGroup.Text id="basic-addon1">Страна:</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					placeholder="Название программы"
					aria-label="Username"
					aria-describedby="basic-addon1"
					value={this.state.country}
					onChange={(e) => this.setState({country: e.target.value})}
				/>
			</InputGroup>

			<InputGroup className="mb-3">
				<InputGroup.Prepend>
					<InputGroup.Text id="basic-addon1">Тип:</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					placeholder="Группа/Индивидуально"
					aria-label="Username"
					aria-describedby="basic-addon1"
					value={this.state.type}
					onChange={(e) => this.setState({type: e.target.value})}
				/>
			</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Дата отлета:</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						type="date" className="form-control" id="exampleInputDOB1"
						placeholder="Группа/Индивидуально"
						aria-label="Username"
						aria-describedby="basic-addon1"
						value={this.state.departure_date}
						onChange={(e) => this.setState({departure_date: e.target.value})}
					/>
				</InputGroup>

		</Col>;

		return(edit)
	}

}



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

    }
		this.submitClient = this.submitClient.bind(this);
		this.submitRequest = this.submitRequest.bind(this);
		this.sendRequest = this.sendRequest.bind(this);
  }


	componentWillReceiveProps(nextProps){
    this.setState({
			dataClient: nextProps.dataClient,
			updateData: nextProps.updateData,
		})
  }

	submitClient(obj){
		let id = this.state.dataClient.client.client_id;

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
							console.log(data)
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
		let id = this.state.dataClient.client.client_id;

		if(str != "Отказ" || str != "Закрыто"){

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
								console.log(data);
								main.state.updateData();
								main.props.closeWindow();
							}
							else{ console.log("Something goes wrong!") }
							});
					})
			}}


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
								console.log(data)
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
    modalInfo =
    <Modal
    size="lg"
    show={ this.state.dataClient != {}? true: false}
    onHide={() => this.props.closeWindow()}
    aria-labelledby="example-modal-sizes-title-lg"
    style={{ maxHeight: this.props.setHeight(), overflow: "auto"}}>
    <Modal.Header closeButton>
    <Modal.Title><span className="gosha" style={{fontSize: "30px"}}> {client.client_name} </span><Badge variant="danger">{status}</Badge></Modal.Title>
    </Modal.Header>
    <Modal.Body>

    <Row>
    {(this.state.editClient) ?

      <EditClient client={client} submit={this.submitClient} user={this.props.user}/>
      :
      <Col
      md={8}
      lg={8}
      lx={8}
      >
      <p  className="commonRequest">
      <b>Дата рождения:</b> {this.props.SetDate(client.date_of_birth)}
      <br />
      <b>Номер телефона:</b> {client.phone_number}
      <br />
      <b>Почта:</b> {client.mail}
      <br />
      <b>Родители: </b>
      <p>
      <b>{client.parents.firstParent}</b>
      </p>
      </p>

      </Col>}

      <Col>
      {this.state.editClient ?
        <Button variant="primary" className="mt-3"
        onClick={() => this.setState({editClient: !this.state.editClient})}
        className="buttonEdit"
        style={{
          position: "absolute",
          right: "10%",
          fontSize: "14px",
          padding: "6px"
        }}
        >Изменить</Button>
        :
				<Button variant="secondary" className="mt-3"
        onClick={() => this.setState({editClient: !this.state.editClient})}
        className="buttonEdit"
        style={{
          position: "absolute",
          right: "10%",
          fontSize: "14px",
          padding: "6px"
        }}
        >Редактировать</Button> }

        </Col>

        </Row>
        <hr />
				<Row>
        {
				(
					request.program_name == null ||
					request.country == null ||
					request.departure_date == null
				)
				?

					<Col><div> Нет текущей заявки </div></Col>

				:

				(this.state.editRequest) ?

						<EditRequest request={request} submit={this.submitRequest} user={this.props.user}/>

						:

						<Col className="commonRequest"
								md={8}
								lg={8}
								lx={8}
						>
		          <h3 className="gosha">{request.program_name} <Badge variant="success" style={{fontSize: "18px"}}>{this.props.StatusForm(request.status)}</Badge> </h3>
		          <b>Страна:</b> {request.country}
		          <br />
		          <b>Год поездки:</b> {request.departure_date.split("-")[0]}
		          <br />
		          <b>Дата отъезда:</b> {this.props.SetDate(request.departure_date)} - {request.type}
		          <br />
		          <b>Комментарии:</b> {request.comment || " Не указано "}
						</Col>
				}

				<Col
				md={4}
				lg={4}
				lx={4}
				>

					<Row>

						{this.state.editRequest ?
							<Col
								md={12}
								lg={12}
								lx={12}
							>
					        <Button variant="primary" className="mt-3"
					        onClick={() => this.setState({editRequest: !this.state.editRequest})}
					        className="buttonEdit"
					        style={{
					          position: "absolute",
					          right: "10%",
					          fontSize: "14px",
					          padding: "6px"
					        }}
					        >Изменить</Button>
							</Col>
			        :
							<Col
								md={12}
								lg={12}
								lx={12}
							>
								<Row style={{height: "40px"}}>
									<Col
										md={12}
										lg={12}
										lx={12}
									>
										<Button variant="secondary" className="mt-3"
						        onClick={() => this.setState({editRequest: !this.state.editRequest})}
						        className="buttonEdit"
						        style={{
						          position: "absolute",
						          right: "10%",
						          fontSize: "14px",
						          padding: "6px"
						        }}
						        >Редактировать</Button>
									</Col>
								</Row>
								<Row  style={{height: "40px"}}>
									<Col
										md={12}
										lg={12}
										lx={12}
									>
										<DropdownButton
											style={{
												fontSize: "12px",
												position: "absolute",
												marginTop: "2px",
												right: "10%"
											}}
											alignRight
											title="Cтатус"
											variant="secondary"
											>
												<Dropdown.Item onClick={() => this.sendRequest("Заявка")}>Заявка</Dropdown.Item>
												<Dropdown.Item onClick={() => this.sendRequest("Договор")}>Договор</Dropdown.Item>
												<Dropdown.Item onClick={() => this.sendRequest("Оплата")}>Оплата</Dropdown.Item>
												<Dropdown.Item onClick={() => this.sendRequest("Оформление")}>Оформление</Dropdown.Item>
												<Dropdown.Item onClick={() => this.sendRequest("Выезд")}>Выезд</Dropdown.Item>
											<Dropdown.Divider/>
												<Dropdown.Item onClick={() => this.sendRequest("Закрыто")}>Закрыто</Dropdown.Item>
												<Dropdown.Item onClick={() => this.sendRequest("Отказ")}>Отказ</Dropdown.Item>
										</DropdownButton>
									</Col>
								</Row>
						</Col>

						}
					</Row>

				</Col>


				</Row>
          <hr />
				<Row>
					<Col>
          <h5><b>История поездок:</b></h5>
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


        </Modal.Body>
      </Modal>;
		}
		else{
			modalInfo = null
		}


    return(modalInfo)
 }
}
