import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Table } from "react-bootstrap";

export default class HistoryTable extends Component{

  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

  render(){
    let table =
    <div style={{maxHeight: "400px", overflow: 'auto'}}>

      <Table striped bordered hover size="sm"
        style={{
          fontFamily: "sans-serif",
          fontWeight: "light",
          fontSize: "10pt",
          textAlign: "center",
        }}
        >
        <thead id="history">
          <tr>
            <th>Год</th>
            { this.props.user.user_status == 'Admin' ? <th>Финансы</th> : null}
              <th>Статус</th>
              <th>Название</th>
              <th>Страна</th>
              <th>Дата отъезда</th>
              <th>Тип</th>
              <th>Причина</th>
              <th>Заметки</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.data.map((obj, ind) =>
              <tr key={ind}>
                    <td>{obj.departure_date.split("-")[0] || " - "}</td>
                    {this.props.user.user_status == 'Admin' ? <td> {obj.money || " - "} </td> : null}
                    <td>{this.props.StatusForm(obj.status) || " - "}</td>
                    <td style={{maxWidth: "150px"}}>{obj.program_name || " - "}</td>
                    <td>{obj.country || " - "}</td>
                    <td>{this.props.SetDate(obj.departure_date) || " - "}</td>
                    <td>{obj.type || " - "}</td>
                    <td style={{maxWidth: "150px"}}>{obj.cause || " - "}</td>
                    <td style={{maxWidth: "150px"}}>{obj.brief || " - "}</td>
              </tr>
              )
            }
        </tbody>
      </Table>
    </div>


    return(table);
  }
}
