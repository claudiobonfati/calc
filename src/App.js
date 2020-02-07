import React from 'react';
import logo from './logo.svg';
import './App.sass';

class App extends React.Component {
  constructor(){
    super();

    this.state = {
      equation_first: "",
      equation_operator: "",
      equation_last: "",
      equation_result: "",
      equation_main_display: "",
    }
  }

  renderButton(value, c) {
    return (
      <div className="box-button">
        <button className={c} onClick={(e) => this.onButtonClick(value)}>
          {value}
        </button>
      </div>
    );
  }

  renderOperator() {
    if (this.state.current_operator != "") {
      return (
        <span className="operator">
          { this.state.equation_operator }
        </span>
      );
    }
  }

  onButtonClick = button => {
    if (button === "=") {
      // this.calc();
    } else if (button === "C") {
      this.clear();
    } else if (button === "+/-") {
      // this.moreOrLess();
    } else if (button === "%") {
      // Do something
    } else if (button === "00") {
      // Do something
    } else if (button === ".") {
      // Do something
    } else if (["/","*","+","-"].indexOf(button) > -1) {
      this.setState({
        equation_operator: button
      });
    } else if (["0","1","2","3","4","5","6","7","8","9"].indexOf(button) > -1) {
      if (!this.state.equation_operator) {
        this.setState({
          equation_first: this.state.equation_first + button
        });
      } else {
        this.setState({
          equation_last: this.state.equation_last + button
        });
      }
    }
  };

  calc = () => {

  }

  clear = () => {
    this.setState({
      current_equation: "",
      current_operator: ""
    });
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
                <div className="display">
                  <div className="current-equasion">
                    { this.state.equation_first }
                    { this.renderOperator() }
                    { this.state.equation_last }
                  </div>
                  <div className="current-result">
                    358.875
                  </div>
                </div>
                <div className="keyboard">
                  <div className="row">
                    { this.renderButton("C", "helper") }
                    { this.renderButton("+/-", "helper") }
                    { this.renderButton("%", "helper") }
                    { this.renderButton("/", "action") }
                  </div>
                  <div className="row">
                    { this.renderButton("7", "number") }
                    { this.renderButton("8", "number") }
                    { this.renderButton("9", "number") }
                    { this.renderButton("*", "action") }
                  </div>
                  <div className="row">
                    { this.renderButton("4", "number") }
                    { this.renderButton("4", "number") }
                    { this.renderButton("6", "number") }
                    { this.renderButton("+", "action") }
                  </div>
                  <div className="row">
                    { this.renderButton("1", "number") }
                    { this.renderButton("2", "number") }
                    { this.renderButton("3", "number") }
                    { this.renderButton("-", "action") }
                  </div>
                  <div className="row">
                    { this.renderButton("00", "helper") }
                    { this.renderButton("0", "number") }
                    { this.renderButton(".", "helper") }
                    { this.renderButton("=", "submit") }
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
