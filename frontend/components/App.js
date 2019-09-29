import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge, Button,
					FormControl} from "react-bootstrap";
import Header from "./Header";
import Search from "./Search";
import Clients from "./Clients";
import Create from './Create';
import Continue from "./Continue";
import HistoryTable from "./HistoryTable";
import ClientInfo from "./ClientInfo";


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
			return "Консультирование"

		case 6:
			return "Закрыто"

		default:
			return "Не заполнен"

	}
}

function SetDate(date) {
	if(typeof(date) != "string") {return "Не заполнено"}
	let rest = date.split("-")
	return `${rest[2]}.${rest[1]}.${rest[0]}`
}

export default class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			whatsBlock : 0,
			submit: null,
			showCreate: false,
			showContinue: false,
			dataClient: {},
			id: 0,
			data: [],

			updateData: null,
		}

		this.onHideCreate = this.onHideCreate.bind(this);
		this.onHideContinue = this.onHideContinue.bind(this);
		this.openClient = this.openClient.bind(this);
		this.changeId = this.changeId.bind(this);
		this.changeBySearch = this.changeBySearch.bind(this);
		this.updatingData = this.updatingData.bind(this);
	}

	updatingData(f){
		this.setState({updateData: f})
	}

	changeBySearch(value){
		this.setState({data: value});
		console.log("Data has changed by SearchLine!")
	}

	changeId(id){
		this.setState({id: id});
	}

	// Показывает, скрывает анкету создания клиента
	onHideCreate(){
		this.setState({showCreate: (this.state.showCreate)?false:true})
	}

	onHideContinue(){
		this.setState({showContinue: false})
	}

	// Вызывает карточку полной информации о клиенте

	openClient(data){
		this.setState({ dataClient: data})
	}

	render(){

		// Определение максимальной высоты модульного окна
		function setHeight(){

				let scr = document.documentElement.clientHeight;
				let height = String(scr) + 'px';
				return height;
		}


		return(
			<Container>
				<Row>
					<Col
						md={12}
            sm={12}
            xl={12}
					>
					<Header onCreate={this.onHideCreate} exit={this.props.exit}/>
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
									<Search window={!this.state.showCreate && !this.state.showContinue && !Object.keys(this.state.dataClient).lenght}
													changeBySearch={this.changeBySearch}
									/>
								</Col>
							</Row>
							<Row className="mt-4">
								{/*Главный блок с клиентами*/}
								<Clients openInfo={this.openClient}
												 StatusForm={StatusForm}
												 SetDate={SetDate}
												 searchItems={this.state.data}
												 updatingData={this.updatingData}
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
					<ClientInfo dataClient={this.state.dataClient} setHeight={setHeight} SetDate={SetDate}
											StatusForm={StatusForm} user={this.props.user}
											updateData={this.state.updateData}
					/>
			</Container>
		)};}
