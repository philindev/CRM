import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col, Modal, ButtonGroup, ButtonToolbar,
				Dropdown, DropdownButton, InputGroup, Badge, Button,
					FormControl} from "react-bootstrap";
import PowMini from "./PowMini";

export default class RequestTable extends Component{
	constructor(props){
		super(props)
		this.state = {
			data: [],
			tableHeight: ''
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
			tableHeight: String(scr - 130) + 'px',
		})
		this.getClients();
	}

	componentDidMount(){
		this.setHeight();
	}

	render(){
		let openInfo = this.props.openInfo;
		let StatusForm = this.props.StatusForm;
		let filtering = this.props.filtering;
		// Фильтруем просроченные заявки
		let filteringData = this.state.data ?
				this.state.data.filter(
										function(obj){
													return filtering(obj.request.date_of_creation, StatusForm(obj.request.status));
												}
									)	: null;
		// Выдаем каждую стору таблицы, используя отфильрованный массив выше
		let results = filteringData.length ? filteringData.map((data, inx) =>

																				<PowMini
																							data={data}
																							StatusForm={StatusForm}
																							openInfo={openInfo}
																					/>

		) : null;

		return(
			<div style={{
            overflow: "auto",
            height: this.state.tableHeight || '500px',
            position: "absolute",
            top: "2rem",
						width: "445px",
						borderRadius: "10px",
					  borderRight: "2px solid darkgray"
          }}
					className="ml-3"
        >
        <table class="table table-hover">
              <thead class="thead-light">
                  <tr style={{textAlign: "center"}}>
                    <th scope="col" width="100px" style={{background: "#E4E0DC"}}>Статус</th>
                    <th scope="col" width="150px" style={{background: "#E4E0DC"}}>Ф.И.О.</th>
                    <th scope="col" width="180px" style={{background: "#E4E0DC"}}>Название программы</th>
                  </tr>
              </thead>
              <tbody>
								{results == null ? <p id="clear">Нет просроченных заявок</p>: results}
             </tbody>
        </table>
      </div>
		)
	}
}
