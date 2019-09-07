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

class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			whatsBlock : 0,
			submit: null,
			showCreate: false,
			showContinue: false,
			dataClient: {},

		}

		this.onHideCreate = this.onHideCreate.bind(this);
		this.onHideContinue = this.onHideContinue.bind(this);
		this.openClient = this.openClient.bind(this);
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
		// Открытие окна информации клиента
		let info = this.state.dataClient;
		let modalInfo = (sizeOfData) ?

		<Modal
				size="lg"
				show
				onHide={() => this.setState({dataClient: {}})}
				aria-labelledby="example-modal-sizes-title-lg"
				style={{ maxHeight: setHeight(), overflow: "auto",}}
			>
				<Modal.Header closeButton>
						<Modal.Title>{info.client.name} <Badge variant="primary">{info.client.status}</Badge></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
					 <b>Дата рождения:</b> {info.client.date_of_birth}
					 <br />
					 <b>Номер телефона:</b> {info.client.number}, <b>Почта:</b> {info.client.mail}
					 <br />
					 <b>Родители:</b>
					 	<p>
							<b></b>
						</p>
					</p>
					<hr />
					<p>
						<h4>{info.request.country}</h4>
						<b>Название программы:</b> {info.request.name_of_program} <Badge variant="success">{info.client.status}</Badge>
						<br />
						<b>Год поездки:</b> {info.request.year_of_fly}
						<br />
						<b>Дата отъезда:</b> {info.request.data_of_will_fly} - {info.client.type_of_program}
						<br />
						<b>Комментарии:</b> {info.request.comment}
					</p>
					<hr />
					<p>
						<h5>История поездок:</h5>
						<br />
						{
							(info.history.length) ? Пусто :

							info.history.map((data, ind) => <tr style={{textAlign: "center", fontSize: "10pt", border: "1px solid grey"}}																					      >
																					        <th>{data.status}</th>
																					        <td>{data.name_of_program}</td>
																					        <td>{data.country}</td>
																					        <td>{data.year_of_fly}</td>
																					        <td>{data.type_of_program}</td>
																					      </tr>)

						}
					</p>


				</Modal.Body>
			</Modal>

		: null;

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
								<Clients openInfo={this.openClient}/>
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
								<HistoryTable />
							</Row>
							<Row></Row>
						</Col>
						{/*Модальные окна "Создать" и "Статистика"*/}
						<Create showWindow={this.state.showCreate}
										onHideCreate={this.onHideCreate}
										onContinue={this.onHideContinue}
						/>
						<Continue showWindow={this.state.showContinue}
											onHideContinue={this.onHideContinue}/>
					</Row>
					{modalInfo}
			</Container>
		)};
};

export default App;
