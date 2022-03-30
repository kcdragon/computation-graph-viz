import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Button, Col, Container, FormCheck, Modal, Row} from "react-bootstrap";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";
import { makeGraph } from "./Graph";
import * as bootstrap from "bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import FormCheckInput from "react-bootstrap/FormCheckInput";
import Article from "./Article";


class App extends React.Component {
  constructor(props) {
    console.log("App constructor called")

    super(props);

    let equationStrings = [
      "x_1 x_2 + sin(x_2)",
      "w_1 * x_1 + w_2 * x_2"
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
    this.selectEdge = this.selectEdge.bind(this);
    this.selectEquation = this.selectEquation.bind(this);
  }

  componentDidMount() {
    this.showAllPopups();
  }

  componentDidUpdate() {
    this.showAllPopups();
  }

  selectTerm(term) {
    this.setState({
      selectedTerm: term,
      selectedEdge: null,
      useDynamicMathJax: false,
    });
  }

  selectEdge(edge) {
    this.setState({
      selectedTerm: null,
      selectedEdge: edge,
      useDynamicMathJax: false,
    });
  }

  selectEquation(equationIndex) {
    this.setState({
      selectedEquationIndex: equationIndex,
      selectedTerm: null,
      selectedEdge: null,
      useDynamicMathJax: true,
    });
  }

  startTutorial = () => {
    this.setState({
      tutorialStageIndex: 0,
      selectedEquationIndex: null,
      selectedTerm: null,
      selectedEdge: null,
    });
  }

  nextTutorialStage = (currentTutorialStageIndex) => () => {
    const nextTutorialStageIndex = currentTutorialStageIndex + 1;
    console.log("next tutorial stage index", nextTutorialStageIndex)
    this.setState({
      tutorialStageIndex: nextTutorialStageIndex,
    })
  }

  endTutorial = () => {
    this.setState({
      tutorialStageIndex: null,
      selectedTerm: null,
      selectedEdge: null,
    });
  }

  showAllPopups() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
    popoverList.forEach(popover => popover.show())
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Button variant="primary" onClick={this.startTutorial}>
              Tutorial
            </Button>

            <Modal show={this.state.tutorialStageIndex === 0} onHide={this.endTutorial}>
              <Modal.Header closeButton>
                <Modal.Title>Tutorial</Modal.Title>
              </Modal.Header>
              <Modal.Body>Welcome to the tutorial. Press "Next" to continue.</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.endTutorial}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.nextTutorialStage(this.state.tutorialStageIndex)}>
                  Next
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <h2>Equation</h2>
            <MathJaxContext>
              <MathJax>
                {this.equations.map((equation, index) => {
                  let equationDemoPopoverAttributes = {}
                  if (index === 0 && this.state.tutorialStageIndex === 1) {
                    equationDemoPopoverAttributes = {
                      "data-bs-toggle": "popover",
                      "data-bs-content": "Select this equation to display the corresponding computation graph and backpropagation equations.",
                    }
                  }

                  return (
                    <FormCheck key={index}>
                      <FormCheckInput type="radio" name={"equation-" + index} checked={this.state.selectedEquationIndex === index} onChange={() => { this.selectEquation(index) }}></FormCheckInput>
                      <label htmlFor={"equation-" + index} {...equationDemoPopoverAttributes}>
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
            {this.renderComputationGraph()}
          </Col>
          <Col md={4}>
            <h2>Backpropagation</h2>
            {this.renderBackpropagation()}
          </Col>
        </Row>
        <Row>
          <Article />
        </Row>
      </Container>
    );
  }

  renderComputationGraph() {
    if (this.state.selectedEquationIndex !== null) {
      return (
        <ComputationGraph
          sink={this.equations[this.state.selectedEquationIndex].sink}
          graph={this.equations[this.state.selectedEquationIndex].graph}
          selectEdge={this.selectEdge}
          selectedEdge={this.state.selectedEdge}
          selectedTerm={this.state.selectedTerm}
        />
      );
    } else {
      return <span></span>
    }
  }

  renderBackpropagation() {
    if (this.state.selectedEquationIndex !== null) {
      return (
        <Backpropagation
          function={this.equations[this.state.selectedEquationIndex].function}
          sink={this.equations[this.state.selectedEquationIndex].sink}
          graph={this.equations[this.state.selectedEquationIndex].graph}
          selectTerm={this.selectTerm}
          selectedEdge={this.state.selectedEdge}
          selectedTerm={this.state.selectedTerm}
          useDynamicMathJax={this.state.useDynamicMathJax}
        />
      );
    } else {
      return <span></span>
    }
  }
}
export default App;
