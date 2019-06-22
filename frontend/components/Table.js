import React from "react";
import ReactDOM from "react-dom";
import {Dropdown, DropdownButton} from "react-bootstrap";
import Row from "./Row";

export default class Table extends React.Component{
  constructor(props){
		super()
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
    let results = this.props.data.map((obj, inx) => <Row key={inx} data={obj} />);
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
              <thead class="thead-dark">
                  <tr style={{textAlign: "center"}}>
                    <th scope="col" width="150px">Не заполнен</th>
                    <th scope="col" width="200px">Ф.И.О.</th>
                    <th scope="col" width="210px">Название программы</th>
                    <th scope="col" width="120px">Страна</th>
                    <th scope="col" width="100px">Дата отъезда</th>
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
