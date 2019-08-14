import React from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge} from "react-bootstrap";
import Header from "./Header";
import Search from "./Search";
import Clients from "./Clients";
import Create from './Create';
import Continue from "./Continue";

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
						<Modal.Title>{info.name} <Badge variant="primary">{info.clientStatus}</Badge></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
					 <b>Дата рождения:</b> {info.dateBirth}
					 <br />
					 <b>Номер телефона:</b> {info.number}, <b>Почта:</b> {info.mail}
					 <br />
					 <b>Родители:</b> Не заполнено
					</p>
					<hr />
					<p>
						<h4>{info.country}</h4>
						<b>Название программы:</b> {info.program} <Badge variant="success">{info.status}</Badge>
						<br />
						<b>Год поездки:</b> {info.year}
						<br />
						<b>Дата отъезда:</b> {info.data} - {info.type}
						<br />
						<b>Комментарии:</b> {info.comment}
					</p>
					<hr />
					<p>
						<h5>История поездок:</h5>
						<br />
						Пусто
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
