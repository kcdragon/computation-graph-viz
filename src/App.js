import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";

import 'bootstrap/dist/css/bootstrap.min.css';

const graph = {
  x_1: {
    equation: "",
    parents: [],
    children: ["a_2"],
  },
  x_2: {
    equation: "",
    parents: [],
    children: ["a_1", "a_2"],
  },
  a_1: {
    equation: "sin(x_2)",
    parents: ["x_2"],
    children: ["a_3"],
  },
  a_2: {
    equation: "x_1 x_2",
    parents: ["x_1", "x_2"],
    children: ["a_3"],
  },
  a_3: {
    equation: "a_1 + a_2",
    parents: ["a_1", "a_2"],
    children: [],
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedTerm: null };

    this.selectTerm = this.selectTerm.bind(this);
  }

  selectTerm(term) {
    console.log("selected term", term);
    this.setState({ selectedTerm: term });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={2}>
            <h2>Equation</h2>
            <MathJaxContext>
              <MathJax>{"\\( f(x_1, x_2) = x_1 x_2 + sin(x_2) \\)"}</MathJax>
            </MathJaxContext>
          </Col>
          <Col md={5}>
            <h2>Computation Graph</h2>
            <ComputationGraph
              sink={"a_3"}
              graph={graph}
              selectedTerm={this.state.selectedTerm}
            />
          </Col>
          <Col md={5}>
            <h2>Backpropagation</h2>
            <Backpropagation
              function="x_1 x_2 + sin(x_2)"
              sink={"a_3"}
              graph={graph}
              selectTerm={this.selectTerm}
              selectedTerm={this.state.selectedTerm}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
