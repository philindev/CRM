import React, { Component } from 'react';

import {Row, Col, Dropdown, DropdownButton, InputGroup, Badge, Button,
					FormControl} from "react-bootstrap";


function slice_on_the_halfs(string, slicing_part) {
		let pos = string.indexOf(slicing_part);
		let first = string.slice(0, pos);
		let second = string.slice(pos + 12, string.length);
		return [first, second];
}

class EditRequest extends Component{
	constructor(props){
		super(props);
		this.state = {
			program_name: this.props.request.program_name,
			country: this.props.request.country,
			type: this.props.request.type,
			departure_date: this.props.request.departure_date,
			comment: this.props.request.comment.includes('--Contacts--') ? slice_on_the_halfs(this.props.request.comment, '--Contacts--')[0] :
																								this.props.request.comment ? this.props.request.comment : " Не указано ",
			contacts: this.props.request.comment.includes('--Contacts--') ? slice_on_the_halfs(this.props.request.comment, '--Contacts--')[1] : " Не указано ",
		};

		this.checkValue = this.checkValue.bind(this);
	}

	checkValue(){
		let request = {
			token: this.props.user.token,
			status: this.props.request.status,
			name_of_program: this.state.program_name,
			country: this.state.country,
			type_of_program: this.state.type,
			comment: this.state.comment + '--Contacts--' + this.state.contacts,
			id: this.props.client.client_id,
			date_of_will_fly: this.state.departure_date,
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
					placeholder="например: Англия"
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
						placeholder="Дата"
						aria-label="Username"
						aria-describedby="basic-addon1"
						value={this.state.departure_date}
						onChange={(e) => this.setState({departure_date: e.target.value})}
					/>
				</InputGroup>

				<InputGroup className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Комментарий:</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						placeholder="Комментарий"
						aria-label="Username"
						aria-describedby="basic-addon1"
						value={this.state.comment}
						onChange={(e) => this.setState({comment: e.target.value})}
					/>

				</InputGroup><InputGroup className="mb-3">
					<InputGroup.Prepend>
						<InputGroup.Text id="basic-addon1">Контактная инф.:</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						placeholder="Контактная инф."
						aria-label="Username"
						aria-describedby="basic-addon1"
						value={this.state.contacts}
						onChange={(e) => this.setState({contacts: e.target.value})}
					/>
				</InputGroup>

		</Col>;

		return(edit)
	}

}

export default class ClientRequestInfo extends Component{
	constructor(props){
		super(props);
		this.state = {
			status: false,
			request: this.props.request,
		}
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			request: nextProps.request,
		})
	}

	render(){
		let request = this.state.request;

		{/* Кривой кусок кода который отрисовывает меню редактирования заявки с кнопкой сохранения*/}
		let editBlock =
			<Row>
					<Col
						className="commonRequest"
								md={8}
								lg={8}
								lx={8}
						>
							<EditRequest request={request} submit={this.props.submitRequest} user={this.props.user}
													client={this.props.client}
									/>
					</Col>
					<Col	md={4}
								lg={4}
								lx={4}
					>
							<Button variant="primary" className="mt-3 buttonEdit"
										onClick={() => this.setState({status: !this.state.status})}
										style={{
											position: "absolute",
											right: "10%",
											fontSize: "14px",
											padding: "6px"
										}}
										>
										Изменить
							</Button>
					</Col>
				</Row>;

		{/* Блок отрисовки кнопок редактироваие и статус*/}

		let editbtns =
					<Col
							md={4}
							lg={4}
							lx={4}
					>
							<Row style={{height: "40px"}}>
									<Col
											md={12}
											lg={12}
											lx={12}
									>
											<Button variant="secondary" className="mt-3"
													onClick={() => this.setState({status: !this.state.editRequest})}
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
															<Dropdown.Item onClick={() => this.props.sendRequest("Заявка")}>Заявка</Dropdown.Item>
															<Dropdown.Item onClick={() => this.props.sendRequest("Консультирование")}>Консультирование</Dropdown.Item>
															<Dropdown.Item onClick={() => this.props.sendRequest("Договор")}>Договор</Dropdown.Item>
															<Dropdown.Item onClick={() => this.props.sendRequest("Оплата")}>Оплата</Dropdown.Item>
															<Dropdown.Item onClick={() => this.props.sendRequest("Оформление")}>Оформление</Dropdown.Item>
															<Dropdown.Item onClick={() => this.props.sendRequest("Выезд")}>Выезд</Dropdown.Item>
													<Dropdown.Divider/>
															{this.props.user.user_status == "Admin" ? <Dropdown.Item onClick={() => this.props.sendRequest("Закрыто")}>Закрыто</Dropdown.Item> : null}
															<Dropdown.Item onClick={() => this.props.sendRequest("Отказ")}>Отказ</Dropdown.Item>
												</DropdownButton>
									</Col>
							</Row>
					</Col>;


		let block = null;
		if(
			request.program_name == null ||
			request.country == null ||
			request.departure_date == null
			) {

				block =
						<Row>
								<Col className="commonRequest"
										md={8}
										lg={8}
										lx={8}
								>
									<div>
											Нет текущей заявки - создайте новую заявку!
									</div>
								</Col>
								<Col className="commonRequest"
										md={4}
										lg={4}
										lx={4}
								>
										<Button variant="warning" className="mt-3"
													onClick={() => {
														this.props.updateId(this.props.client.client_id)
														this.props.closeWindow()
													}}
													className="buttonEdit"
													style={{
														position: "absolute",
														right: "10%",
														fontSize: "14px",
														padding: "6px"
													}}
										>Создать</Button>

								</Col>
						</Row>;
		} else {

			if(this.state.status){

				block = editBlock;

			} else {
					{/* Отрисовывает блок с информацией и двумя кнопками*/}
				block =
					<Row>
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
										<b>Дата выезда:</b> {this.props.SetDate(request.departure_date)} - {request.type}
											<br />
											<b>Комментарии:</b> {request.comment.includes('--Contacts--') ? slice_on_the_halfs(request.comment, '--Contacts--')[0] :
																								request.comment ? request.comment : " Не указано "
																					}

											<br />
											<b>Контактная информация:</b> {request.comment.includes('--Contacts--') ? slice_on_the_halfs(request.comment, '--Contacts--')[1] : " Не указано "}
							</Col>
						{editbtns}
					</Row>;

			}
		}

		return(block);
	}
}
