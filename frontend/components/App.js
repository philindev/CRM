import React from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge} from "react-bootstrap";
import Header from "./Header";
import Search from "./Search";
import Clients from "./Clients";
import Create from './Create';
import Continue from "./Continue";
import HistoryTable from "./HistoryTable";


//Функция преобразования числа для статуса заявки
function StatusForm(number) {
	switch (number) {
		case 1:
			return "Заявка"

		case 2:
			return "Договор"

		case 3:
			return "Оплата"

		case 4:
			return "Вылет"

		case 5:
			return "Консудьтирование"

		case 6:
			return "Закрыто"

		default:
			return "Не заполнен"

	}
}

export default class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			whatsBlock : 0,
			submit: null,
			showCreate: false,
			showContinue: false,
			dataClient: {},
			id: 0,
		}

		this.onHideCreate = this.onHideCreate.bind(this);
		this.onHideContinue = this.onHideContinue.bind(this);
		this.openClient = this.openClient.bind(this);
		this.changeId = this.changeId.bind(this);
	}

	changeId(id){
		this.setState({id: id});
	}

	// Показывает, скрывает анкету создания клиента
	onHideCreate(){
		this.setState({showCreate: (this.state.showCreate)?false:true})
	}

	onHideContinue(){
		this.setState({showContinue: (this.state.showContinue)?false:true})
	}

	// Вызывает карточку полной информации о клиенте

	openClient(data){
		this.setState({ dataClient: data})
	}

	render(){
		// Определение размера объекта
		let sizeOfData = Object.keys(this.state.dataClient).length;
		// Определение максимальной высоты модульного окна
		function setHeight(){
				let scr = document.documentElement.clientHeight;
				let height = String(scr) + 'px';
				return height;
		}
		let status = null;
		let modalInfo = null;

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
						show
						onHide={() => this.setState({dataClient: {}})}
						aria-labelledby="example-modal-sizes-title-lg"
						style={{ maxHeight: setHeight(), overflow: "auto",}}
					>
						<Modal.Header closeButton>
								<Modal.Title>{client.client_name} <Badge variant="primary">{status}</Badge></Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>
							 <b>Дата рождения:</b> {client.date_of_birth}
							 <br />
							 <b>Номер телефона:</b> {client.phone_number}, <b>Почта:</b> {client.mail}
							 <br />
							 <b>Родители:</b>
							 	<p>
									<b></b>
								</p>
							</p>
							<hr />
							<p>
								<h4>{request.country}</h4>
								<b>Название программы:</b> {request.program_name} <Badge variant="success">{StatusForm(request.status)}</Badge>
								<br />
								<b>Год поездки:</b> {request.year_of_fly}
								<br />
								<b>Дата отъезда:</b> {request.data_of_will_fly} - {client.type_of_program}
								<br />
								<b>Комментарии:</b> {request.comment}
							</p>
							<hr />
							<p>
								<h5>История поездок:</h5>
								<br />
								{
									(history.length) ? Пусто :

									history.map((data, ind) => <tr style={{textAlign: "center", fontSize: "10pt", border: "1px solid grey"}}																					      >
																							        <th>{data.status}</th>
																							        <td>{data.program_name}</td>
																							        <td>{data.country}</td>
																							        <td>{data.year_of_fly}</td>
																							        <td>{data.type}</td>
																							      </tr>)

								}
							</p>


						</Modal.Body>
					</Modal>;
				}

		return(
			<Container>
				<Row>
					<Col
						md={12}
            sm={12}
            xl={12}
					>
					<Header onCreate={this.onHideCreate}/>
					</Col>
				</Row>
				<Row>
						<Col
							lg={8}
							md={8}
							xl={8}
						>
							<Row>
								{/*Здесь рендер поисковой строки*/}
								<Col className="mt-4"
									lg={11}
									md={11}
									xl={11}
								>
									<Search />
								</Col>
							</Row>
							<Row className="mt-4">
								{/*Главный блок с клиентами*/}
								<Clients openInfo={this.openClient}
												 StatusForm={StatusForm}
								/>
							</Row>
						</Col>

						{/* Таблица последних клиентов, которые были изменены и таблица с
							теми кто был просрочен на повышенном статусе */}
						<Col>
							<Row className="mt-3 mr-3"
								lg={12}
								md={12}
								xl={12}
							>
								{/*<HistoryTable />*/}
							</Row>
							<Row></Row>
						</Col>
						{/*Модальные окна "Создать" и "Статистика"*/}
						<Create showWindow={this.state.showCreate}
										onHideCreate={this.onHideCreate}
										onContinue={this.onHideContinue}
										changeId={this.changeId}
						/>
						<Continue showWindow={this.state.id}
											onHideContinue={this.onHideContinue}
											id={this.state.id}
											/>
					</Row>
					{modalInfo}
			</Container>
		)};}
