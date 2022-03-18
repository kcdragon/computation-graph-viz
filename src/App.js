import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, FormCheck, Row} from "react-bootstrap";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";
import { makeGraph } from "./Graph";

import 'bootstrap/dist/css/bootstrap.min.css';
import FormCheckInput from "react-bootstrap/FormCheckInput";
import LoremIpsum from "react-lorem-ipsum";


class App extends React.Component {
  constructor(props) {
    console.log("App constructor called")

    super(props);

    let equationStrings = [
      "x_1 x_2 + sin(x_2)",
      "x_1 + x_2",
      "x_1 + x_2 + x_3",
    ];
    this.equations = equationStrings.map(equation => {
      const { graph, sink } = makeGraph(equation);
      return {
        text: "\\( f = " + equation + " \\)",
        function: equation,
        graph,
        sink,
      }
    });

    this.state = {
      selectedTerm: null,
      selectedEquationIndex: 0,
    };

    this.selectTerm = this.selectTerm.bind(this);
    this.selectEquation = this.selectEquation.bind(this);
  }

  selectTerm(term) {
    this.setState({ selectedTerm: term, useDynamicMathJax: false });
  }

  selectEquation(equationIndex) {
    this.setState({ selectedEquationIndex: equationIndex, useDynamicMathJax: true });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={3}>
            <h2>Equation</h2>
            <MathJaxContext>
              <MathJax>
                {this.equations.map((equation, index) => {
                  return (
                    <FormCheck key={index}>
                      <FormCheckInput type="radio" name={"equation-" + index} checked={this.state.selectedEquationIndex === index} onChange={() => { this.selectEquation(index) }}></FormCheckInput>
                      <label htmlFor={"equation-" + index}>
                        {equation.text}
                      </label>
                    </FormCheck>
                  );
                })}
              </MathJax>
            </MathJaxContext>
          </Col>
          <Col md={5}>
            <h2>Computation Graph</h2>
            <ComputationGraph
              sink={this.equations[this.state.selectedEquationIndex].sink}
              graph={this.equations[this.state.selectedEquationIndex].graph}
              selectedTerm={this.state.selectedTerm}
            />
          </Col>
          <Col md={4}>
            <h2>Backpropagation</h2>
            <Backpropagation
              function={this.equations[this.state.selectedEquationIndex].function}
              sink={this.equations[this.state.selectedEquationIndex].sink}
              graph={this.equations[this.state.selectedEquationIndex].graph}
              selectTerm={this.selectTerm}
              selectedTerm={this.state.selectedTerm}
              useDynamicMathJax={this.state.useDynamicMathJax}
            />
          </Col>
        </Row>
        <Row>
          <h2>Article</h2>
          <LoremIpsum p={5} />
        </Row>
      </Container>
    );
  }
}
export default App;
