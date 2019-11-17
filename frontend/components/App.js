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
import ClientInfo from "./ClientInfo";
import RequestTable from "./RequestTable";


function days(seconds: Number, status: String) :Boolean {
	let days = seconds / 60 / 60 / 24;
	switch (status) {
	case "Заявка":
			if(days >= 20){
				return true
			}
		break;
	case "Договор":
			if(days >= 10){
				return true
			}
		break;
	case "Оплата":
			if(days >= 14){
				return true
			}
		break;
	case "Оформление":
			if(days >= 40){
				return true
			}
		break;
	return false;

	}
}

function preparingNumber(num: String) :String {
	try {
			all_num = '1234567890+'
			answer = ''
			for (let _ of num) {
				if(!all_num.includes(_)){
					continue
				}
				answer += _
			}
			if(answer.length == 11 && answer[0] == "8"){
				answer = '+7' + answer.slice(2)
			}
			return answer
	} catch (err) {
		console.log(err.stack)
		return num
	}
}


function correctFormNumber(num: String) :String {
	try {
			return `+7 (${num.slice(2,5)}) ${num.slice(5,8)}-${num.slice(8,10)}-${num.slice(10)}`
	} catch (err) {
		console.log(err.stack)
		return num
	}
}

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
			searchedData: [],

			updateData: null,
		}

		this.onHideCreate = this.onHideCreate.bind(this);
		this.onHideContinue = this.onHideContinue.bind(this);
		this.openClient = this.openClient.bind(this);
		this.changeId = this.changeId.bind(this);
		this.changeBySearch = this.changeBySearch.bind(this);
		this.updatingData = this.updatingData.bind(this);
		this.clearData = this.clearData.bind(this);
	}

	updatingData(f){
		this.setState({updateData: f})
	}

	changeBySearch(value){
		this.setState({searchedData: value});
	}

	changeId(id){
		this.setState({id: id});
	}

	// Показывает, скрывает анкету создания клиента
	onHideCreate(){
		this.setState({showCreate: !this.state.showCreate})
	}

	onHideContinue(){
		this.setState({showContinue: false})
	}

	// Вызывает карточку полной информации о клиенте

	openClient(data){
		this.setState({ dataClient: data})
	}

	clearData(){
		this.setState({ dataClient: {}})
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
					<Header onCreate={this.onHideCreate} exit={this.props.exit} user={this.props.user}/>
					</Col>
				</Row>
				<Row>
						<Col
							xs={12}
							lg={7}
							md={7}
							xl={7}
						>
							<Row>
								{/*Здесь рендер поисковой строки*/}
								<Col className="mt-4"
									xs={12}
									lg={11}
									md={11}
									xl={11}
								>
									<Search
													changeBySearch={this.changeBySearch}
													showFilter={this.state.dataClient != {} && this.state.id == 0}
													user={this.props.user}
									/>
								</Col>
							</Row>
							<Row className="mt-4">
								{/*Главный блок с клиентами*/}
								<Clients openInfo={this.openClient}
												 StatusForm={StatusForm}
												 SetDate={SetDate}
												 searchItems={this.state.searchedData}
												 updatingData={this.updatingData}
								/>
							</Row>
						</Col>

						{/* Таблица последних клиентов, которые были изменены и таблица с
							теми кто был просрочен на повышенном статусе */}
						<Col
							xs={12}
							lg={5}
							md={5}
							xl={5}
						>
							<Row className="mt-3 mr-3"
								lg={12}
								md={12}
								xl={12}
							>
							{this.state.updateData === null ? null :
										<RequestTable
															openInfo={this.openClient}
															StatusForm={StatusForm}
															SetDate={SetDate}
															filtering={days}

									/>}
							</Row>
						</Col>
						{/*Модальные окна "Создать" и "Статистика"*/}
						<Create showWindow={this.state.showCreate}
										onHideCreate={this.onHideCreate}
										onContinue={this.onHideContinue}
										changeId={this.changeId}
										preparingNumber={preparingNumber}
										updateData={this.state.updateData}
						/>
					<Continue 	showWindow={this.state.id}
											updateId={this.changeId}
											id={this.state.id}
											updateData={this.state.updateData}
											/>
					</Row>
					<ClientInfo dataClient={this.state.dataClient} setHeight={setHeight} SetDate={SetDate}
											StatusForm={StatusForm} user={this.props.user}
											updateData={this.state.updateData}
											closeWindow={this.clearData}
											updateId={this.changeId}
											correctFormNumber={correctFormNumber}
											preparingNumber={preparingNumber}
					/>
			</Container>
		)};}
