import React from 'react';
import './App.sass';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      equation_first: "",
      equation_operator: "",
      equation_last: "",
      equation_result: "",
      focus_button: "",
      active_button: "",
    }
  }

  componentDidMount = () => {
    document.addEventListener("keydown", event => {
      if (["0","1","2","3","4","5","6","7","8","9","C","Clear","Delete","Backspace","%",".","/","*","-","+","=","Enter"].indexOf(event.key) > -1) { 
        this.onButtonClick(event.key);
      }
    }, false);
    document.addEventListener("keyup", event => { this.clearButtonActive() }, false);
    document.addEventListener("mouseup", event => { this.clearButtonActive() }, false);
  }

  renderButton = (value, c) => {
    return (
      <div className="box-button">
        <button className={c + (this.state.focus_button === value  ? ' focus' : '') + (this.state.active_button === value  ? ' active' : '')} onClick={(e) => this.onButtonClick(value)}>
          {value}
        </button>
      </div>
    );
  }

  clearButtonActive = () => {
    this.setState({
      active_button: "",
    });
  }

  renderDisplay = () => {
    if (this.state.equation_result === "") {
      return (
        <div className="display">
          <div className="current-equasion"></div>
          <div className="current-result">
            {this.maskThousand(this.state.equation_first)}
            {this.renderOperator()}
            {this.maskThousand(this.state.equation_last)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="display">
          <div className="current-equasion">
            {this.maskThousand(this.state.equation_first)}
            {this.renderOperator()}
            {this.maskThousand(this.state.equation_last)}
          </div>
          <div className="current-result">
            {this.maskDecimal(this.state.equation_result)}
          </div>
        </div>
      );
    }
  }

  renderOperator = () => {
    if (this.state.current_operator !== "") {
      return (
        <span className="operator">
          {this.state.equation_operator }
        </span>
      );
    }
  }

  onButtonClick = button => {
    if (button === "=" || button === "Enter") {
      if (this.state.equation_result !== "") {
        this.setState({
          equation_first: this.state.equation_result,
        }, () => {
          this.calc();
        });
      } else {
        if (this.state.equation_last === "") {
          this.setState({
            equation_last: "0",
          }, () => {
            this.calc();
          });
        } else {
          this.calc();
        }
  
        this.setState({
          focus_button: "=",
          active_button: "=",
        });
      }
    } else if (["C","Clear","Delete","Backspace"].indexOf(button) > -1) {
      this.clear();

      this.setState({
        focus_button: "C",
        active_button: "C",
      });
    } else if (button === "00") {
      // Do something
    } else if (button === "+/-") {
      // Switch Signals
    } else if (button === "%") {
      // Do something

      this.setState({
        focus_button: button,
        active_button: button,
      });
    } else if (button === ".") {
      // Do something

      this.setState({
        focus_button: button,
        active_button: button,
      });
    } else if (["/", "*", "+", "-"].indexOf(button) > -1) {
      if (this.state.equation_first !== "") {
        if (this.state.equation_operator === "" || this.state.equation_last === "") {
          this.setState({
            equation_operator: button,
            active_button: button,
          }); 
        } else {
          this.calc();
          this.setState({
            equation_operator: button,
            active_button: button,
          });
        }

        this.setState({
          focus_button: button,
          active_button: button,
        });
      }
    } else if (["1","2","3","4","5","6","7","8","9"].indexOf(button) > -1) {
      if (!this.state.equation_operator) {
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_first: this.state.equation_first + button
          });
        } else {
          this.setState({
            equation_first: button
          });
        }
      } else {
        if (this.state.equation_last !== "0") {
          this.setState({
            equation_last: this.state.equation_last + button
          });
        } else {
          this.setState({
            equation_last: button
          });
        }
      }

      this.setState({
        focus_button: button,
        active_button: button,
      });
    } else if (button === "0") {
      if (!this.state.equation_operator) {
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_first: this.state.equation_first + button
          });
        }
      } else {
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_last: this.state.equation_last + button
          });
        }
      }

      this.setState({
        focus_button: button,
        active_button: button,
      });
    }
  };

  calc = () => {
    let result = null;

    if (this.state.equation_operator === "/")
      result = Number(this.state.equation_first) / Number(this.state.equation_last)
    else if (this.state.equation_operator === "*")
      result = Number(this.state.equation_first) * Number(this.state.equation_last)
    else if (this.state.equation_operator === "+")
      result = Number(this.state.equation_first) + Number(this.state.equation_last)
    else if (this.state.equation_operator === "-")
      result = Number(this.state.equation_first) - Number(this.state.equation_last)

    this.setState({
      equation_result: result,
    });
  }

  clear = () => {
    this.setState({
      equation_first: "",
      equation_operator: "",
      equation_last: "",
      equation_result: "",
    });
  }

  maskThousand(val) {
    return String(val).split("").reverse().join("")
    .replace(/(\d{3}\B)/g, "$1.")
    .split("").reverse().join("");
  }

  maskDecimal(val) {
    val = val.toFixed(2);
    return  String(val).replace(".", ",")
  }
  render() {
    return (
      <div className="App">
        <div className="main-container">
          <div className="calculator">
            <div className="inner">
              <div className="notch">
                <svg id="svg-notch" data-name="Notch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.21 41.32">
                  <title>notch</title>
                  <path className="path-notch" d="M318.21,41.32v-3.6A37.72,37.72,0,0,0,280.49,0H255.35c-4.39,0-8,1.05-8,5.94,0,.28-.17,3.44-.17,3.44-.63,8.93-7.26,15.5-16.63,16.07l-71.49.15-71.49-.15c-9.37-.57-16-7.14-16.62-16.07,0,0-.18-3.16-.18-3.44,0-4.89-3.56-5.94-8-5.94H37.72A37.72,37.72,0,0,0,0,37.72v3.6"/>
                </svg>
              </div>
              <div className="content">
                <header className="header">
                  <div className="btn-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="centered">
                    Calc<span>.</span>
                  </div>
                  <div className="btn-close">
                    <span></span>
                    <span></span>
                  </div>
                </header>
                {this.renderDisplay()}
                <div className="keyboard">
                  <div className="row">
                    {this.renderButton("C", "helper")}
                    {this.renderButton("+/-", "helper")}
                    {this.renderButton("%", "helper")}
                    {this.renderButton("/", "action")}
                  </div>
                  <div className="row">
                    {this.renderButton("7", "number")}
                    {this.renderButton("8", "number")}
                    {this.renderButton("9", "number")}
                    {this.renderButton("*", "action")}
                  </div>
                  <div className="row">
                    {this.renderButton("4", "number")}
                    {this.renderButton("5", "number")}
                    {this.renderButton("6", "number")}
                    {this.renderButton("-", "action")}
                  </div>
                  <div className="row">
                    {this.renderButton("1", "number")}
                    {this.renderButton("2", "number")}
                    {this.renderButton("3", "number")}
                    {this.renderButton("+", "action")}
                  </div>
                  <div className="row">
                    {this.renderButton("CE", "helper")}
                    {this.renderButton("0", "number")}
                    {this.renderButton(".", "helper")}
                    {this.renderButton("=", "submit")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
