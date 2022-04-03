import {MathJax, MathJaxContext} from "better-react-mathjax";
import {Steps} from 'intro.js-react';
import React from 'react';
import {Col, Container, FormCheck, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/FormCheckInput";

import Article from "./Article";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";
import {makeGraph} from "./Graph";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'intro.js/introjs.css';


class App extends React.Component {
  constructor(props) {
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
      tutorialEnabled: true,
      selectedTerm: null,
      selectedEdge: null,
    });
  }

  endTutorial = () => {
    this.setState({
      tutorialEnabled: false,
      selectedTerm: null,
      selectedEdge: null,
    });
  }

  render() {
    const steps = [
      {
        element: '.tutorial-equation-selector',
        intro: 'The Equation section allows you to select an equation that will be used to display the computation graph and derive the backpropagation equations.',
      },
      {
        element: '.tutorial-computation-graph',
        intro: 'The Computation Graph section displays the computation graph based on the selected equation.',
      },
      {
        element: '.tutorial-backpropagation',
        intro: 'The Backpropagation section displays the backpropagation equations that are derived from calculating the partial derivatives of the selected equation.',
      },
      {
        element: '.tutorial-backpropagation-partial-derivative',
        intro: 'If you click on a partial derivative term, it will highlight where that term is used in other backpropagation equations and the edges in the graph that are involved in calculating that derivative.',
      },
      {
        element: '.tutorial-article',
        intro: "This article gives background on computation graphs and the backpropagation equations. It's suggested to read this before using the visualization if these concepts are unfamiliar to you.",
        position: "left",
      },
    ];

    return (
      <Container fluid>
        <Row>
          <Col>
            <Navbar bg="light">
              <Nav>
                <NavbarBrand>
                  Computation Graph Viz
                </NavbarBrand>
                <NavItem>
                  <NavLink onClick={this.startTutorial}>Tutorial</NavLink>
                </NavItem>
              </Nav>
            </Navbar>

            <Steps
              enabled={this.state.tutorialEnabled}
              steps={steps}
              initialStep={0}
              onExit={this.endTutorial}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <div className="tutorial-equation-selector">
              {this.renderEquationSelector()}
            </div>
          </Col>
          <Col md={5}>
            <div className="tutorial-computation-graph">
              <h2>Computation Graph</h2>
              {this.renderComputationGraph()}
            </div>
          </Col>
          <Col md={4}>
            <div className="tutorial-backpropagation">
              <h2>Backpropagation</h2>
              {this.renderBackpropagation()}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3} />
          <Col md={6}>
            <div className="tutorial-article">
              <Article />
            </div>
          </Col>
          <Col md={3} />
        </Row>
      </Container>
    );
  }

  renderEquationSelector() {
    return (
      <>
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
      </>
    )
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
