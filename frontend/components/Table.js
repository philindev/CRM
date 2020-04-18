import React from "react";
import Pow from "./Pow";

export default class Table extends React.Component{
  constructor(props){
		super(props);
		this.state = {
			dropState: "Статус",
            data: this.props.data,
		}
	}

  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.data})
  }

  render(){
        const copy_this = this;
        // Помещаю статус -> "Не заполнено" в конец списка
        function filteredData(){
                    let return_data = [];
                    if (copy_this.state.data.length){
                        for(let i of copy_this.state.data){
                            if(i.request.status !== null){
                                return_data.unshift(i);
                            } else {
                                return_data.push(i);
                            }
                        }
                    }
                    return return_data
                }

        let results = filteredData().map((obj, inx) => <Pow key={inx} data={obj} openInfo={this.props.openInfo}
                                                                      StatusForm={this.props.StatusForm}
                                                                      SetDate={this.props.SetDate}
                                                                      />);
        return(
          <div style={{
                    position: "absolute",
                    top: "2rem",
                  }}
                  id="tableDiv"
                >
                <table class="table table-hover mb-0" >
                      <thead class="thead-light">
                          <tr style={{textAlign: "center"}}>
                            <th scope="col" width="150px" style={{background: "#E4E0DC"}}>Статус</th>
                            <th scope="col" width="200px" style={{background: "#E4E0DC"}}>Ф.И.О.</th>
                            <th scope="col" width="210px" style={{background: "#E4E0DC"}}>Название программы</th>
                            <th scope="col" width="120px" style={{background: "#E4E0DC"}}>Страна</th>
                            <th scope="col" width="100px" style={{background: "#E4E0DC"}}>Дата выезда</th>
                          </tr>
                      </thead>
                </table>
                <div style={{height: this.props.screen, overflow: "auto"}}>
                    <table class="table table-hover">
                        <tbody>
                            {results}
                        </tbody>
                    </table>
                </div>
          </div>
        )
  }
};
