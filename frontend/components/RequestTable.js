import React, {Component} from "react";
import {Row, Col, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import PowMini from "./PowMini";

class NoTimeTable extends Component{
	constructor(props){
		super(props);
		this.state = {
			data: this.props.data,
			tableHeight: this.props.tableHeight,

			needToFilter: this.props.need,
		};
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			needToFilter: nextProps.need,
			data: nextProps.data,
			tableHeight: nextProps.tableHeight,
		})
	}

	render(){
		let openInfo = this.props.openInfo;
		let StatusForm = this.props.StatusForm;
		let filtering = this.props.filtering;
		// Фильтруем просроченные заявки
		let filteringData = this.state.data ? this.state.data : null;
		if(this.state.needToFilter){
			filteringData = this.state.data ?
				this.state.data.filter(
					function(obj){
						return filtering(obj.request.date_of_creation, StatusForm(obj.request.status));
					}
				) : null;
		} else {
			if(filteringData !== null && filteringData.length > 10){
				filteringData = filteringData.slice(10);
			}
		}
		// Выдаем каждую стору таблицы, используя отфильрованный массив выше
		let results = (filteringData !== null && filteringData.length) ? filteringData.map((data, inx) =>

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
								{results == null ? <p id="clear">Нет просроченных заявок</p> : results}
             </tbody>
        </table>
      </div>
		)
	}
}


export default class RequestTable extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			tableHeight: '',
			queue: this.props.queue,
			tipedState: true,
		};

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
			    console.log('error: ', error);
					main.setState({error: true})
			  })
	}

	// Определяем высоту окна и сохраняем
	setHeight(){
		let scr = document.documentElement.clientHeight;
		this.setState({
			tableHeight: String(scr - 200) + 'px',
		});
		this.getClients();
	}

	componentDidMount(){
		this.setHeight();
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			queue: nextProps.queue,
		})
	}

	render(){
		const copy_this = this;
		let currentTableIs = <NoTimeTable
									tableHeight={this.state.tableHeight}
									need={this.state.tipedState}
									openInfo={this.props.openInfo}
									StatusForm={this.props.StatusForm}
									SetDate={this.props.SetDate}
									filtering={this.props.filtering}
									data={ this.state.tipedState ? this.state.data : this.state.queue}
							/>;

		let renderBlock =
			<Row style={{width: "100%"}}>
				<Col sm={12} lg={12} lx={12} md={12} xs={12} xl={12} style={{width: "100%"}}>
					<ToggleButtonGroup type="radio" defaultValue={[1, 2]} name="options" className="ToggleToTable">
						<ToggleButton value={1} variant={this.state.tipedState ? "light" : "outline-light"} onClick={() => copy_this.setState({tipedState: true})}> Просроченные </ToggleButton>
						<ToggleButton value={2} variant={this.state.tipedState ? "outline-light" : "light"} onClick={() => copy_this.setState({tipedState: false})}> Последние </ToggleButton>
			    	</ToggleButtonGroup>
				</Col>
				<Col>
					{currentTableIs}
				</Col>
			</Row>;

		return(renderBlock);
	}
}
