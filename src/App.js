import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";
import { makeGraph } from "./Graph";

import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedTerm: null };

    this.selectTerm = this.selectTerm.bind(this);

    this.graph = makeGraph("x_1 x_2 + sin(x_2)");
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
              graph={this.graph}
              selectedTerm={this.state.selectedTerm}
            />
          </Col>
          <Col md={5}>
            <h2>Backpropagation</h2>
            <Backpropagation
              function="x_1 x_2 + sin(x_2)"
              sink={"a_3"}
              graph={this.graph}
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
