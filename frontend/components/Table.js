import React from "react";
import ReactDOM from "react-dom";
import {Dropdown, DropdownButton} from "react-bootstrap";
import Row from "./Row";

export default class Table extends React.Component{
  constructor(props){
		super(props);
		this.state = {
			dropState: "Статус",
		}

		this.setNameStatus = this.setNameStatus.bind(this);
	}

  // Меняет имя Статусу заявки
	setNameStatus(name){
		this.setState({
			dropState: name,
		})
	}

  render(){
    let results = this.props.data.map((obj, inx) => <Row key={inx} data={obj} openInfo={this.props.openInfo}
                                                                  StatusForm={this.props.StatusForm}
                                                                  SetDate={this.props.SetDate}
                                                                  />);
    return(
      <div style={{
            overflow: "auto",
            height: this.props.screen,
            position: "absolute",
            top: "2rem",
          }}
          id="tableDiv"
        >
        <table class="table table-hover">
              <thead class="thead-light">
                  <tr style={{textAlign: "center"}}>
                    <th scope="col" width="150px" style={{background: "#E4E0DC"}}>Не заполнен</th>
                    <th scope="col" width="200px" style={{background: "#E4E0DC"}}>Ф.И.О.</th>
                    <th scope="col" width="210px" style={{background: "#E4E0DC"}}>Название программы</th>
                    <th scope="col" width="120px" style={{background: "#E4E0DC"}}>Страна</th>
                    <th scope="col" width="100px" style={{background: "#E4E0DC"}}>Дата отъезда</th>
                  </tr>
              </thead>
              <tbody>
                {results}
             </tbody>
        </table>
      </div>
    )
  }
};
