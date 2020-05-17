import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ParentCard from "./ParentsCard";
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

					
				</Col>;


		return(edit)
	}
}

export default class ClientPersonalInfo extends Component{
	constructor(props){
		super(props);
		this.state = {
			editClient: false,
			submitClient: this.props.submitClient,

		}
	}

	render(){

		let client = this.props.client;

		return(

			<Row>
			{
				(this.state.editClient) ?

				<EditClient client={client} submit={this.state.submitClient} user={this.props.user}/>

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
									<p>
										<ParentCard data={client.parents.first_parent}/>
										{
											client.parents.second_parent.name == null ? null :
											<ParentCard data={client.parents.second_parent}/>
										}
									</p>
							</p>

					</Col>
				}

					<Col>
							{/* Отрисовка кнопки изменения клиента если статус user'а Admin */}
							{
								(this.state.editClient && this.props.user.user_status == "Admin") ?

										<Button variant="primary" className="mt-3"
												onClick={() => this.setState({editClient: !this.state.editClient})}
												className="buttonEdit"
												style={{
													position: "absolute",
													right: "10%",
													fontSize: "14px",
													padding: "6px"
												}}
										>
												Изменить
										</Button>

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
										>
												Редактировать
										</Button>
								}

						</Col>
				</Row>

		)

	}
}
