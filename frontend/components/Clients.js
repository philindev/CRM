import React from "react";
import ReactDOM from "react-dom";
import {Button, Col, Row, Dropdown, DropdownButton, ButtonToolbar, Alert} from "react-bootstrap";
import Table from "./Table";

export default class Clients extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			tableHeight: "100%",
			dropState: "Статус",
			data: [],
			error: false,
		}
		this.setHeight = this.setHeight.bind(this);
		this.getClients = this.getClients.bind(this);
}

	getClients(){
		const main = this;
		fetch('/GetInfo')
			  .then(function (response) {
			    if (response.status !== 200) {
			      return Promise.reject(new Error(response.statusText))
			    }
			    return Promise.resolve(response)
			  })
			  .then(function (response) {
			    return response.json()
			  })
			  .then(function (data) {
			    console.log('Info for table', data);
					main.setState({data: data});
			  })
			  .catch(function (error) {
			    console.log('error: ', error)
					main.setState({error: true})
			  })
	}



	// Определяем высоту окна и сохраняем
	setHeight(){
		let scr = document.documentElement.clientHeight;
		this.setState({
			tableHeight: String(scr - 295) + 'px',
		})
		this.getClients();
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.searchItems.length){
				this.setState({data: nextProps.searchItems});
				console.log("Updated in this.state.searchItems")
		}
		else if (nextProps.searchItems.length == 0) {
				this.getClients();
		}
	}

	componentDidMount(){
		this.setHeight();
	}


	render(){

		let clients =
			<Col lg={12} md={12} xl={12}>
					<Button
						onClick={this.setHeight}
						size="sm" variant="outline-info"
						style={{
							fontFamily: "sans-serif",
							fontWeight: "light",
							fontSize: "8pt",
							textAlign: "center",
							position: "absolute",
							right: "10px",
						}}
					>
						обновить
					</Button>
					{/*Ниже данные с сервера*/}
					<Table
						data={this.state.data} screen={this.state.tableHeight}
						openInfo={this.props.openInfo}
						StatusForm={this.props.StatusForm}
						SetDate={this.props.SetDate}
					/>
			</Col>;

		return(clients);
	}
};
