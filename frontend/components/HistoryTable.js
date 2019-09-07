import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class HistoryTable extends Component{

  constructor(props){
    super(props);
  }

  render(){
    let table =
        <div style={{
              border: "1px solid grey",
              overflow: "auto",
              position: "absolute",
              top: "2rem",
              maxWidth: "98%",
              height: "300px"
            }}
            id="tableDiv"
            className="mr-3"
          >
          <table class="table table-hover">
                <thead class="thead-light">
                    <tr style={{textAlign: "center", overflow: "auto"}}>
                      <th scope="col" width="250px" style={{background: "#E4E0DC"}}>Статус</th>
                      <th scope="col" width="250px" style={{background: "#E4E0DC"}}>Ф.И.О.</th>
                      <th scope="col" width="400px"  style={{background: "#E4E0DC"}}>Программа</th>
                    </tr>
                </thead>
                <tbody>

               </tbody>
          </table>
        </div>;

    return(table);
  }
}
