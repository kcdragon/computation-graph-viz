import {Steps} from 'intro.js-react';
import React from 'react';
import {
  Col,
  Container,
  Modal,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row
} from "react-bootstrap";

import Article from "./Article";
import Backpropagation from "./Backpropagation";
import ComputationGraph from "./ComputationGraph";
import EquationSelector from "./EquationSelector";
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
    const equations = equationStrings.map(equationString => {
      return this.makeEquation(equationString);
    });

    this.state = {
      selectedTerm: null,
      selectedEquationIndex: 0,
      showFeedbackModal: false,
      equations,
    };

    this.selectTerm = this.selectTerm.bind(this);
    this.selectEdge = this.selectEdge.bind(this);
    this.selectEquation = this.selectEquation.bind(this);
  }

  makeEquation(equationString) {
    const { graph, sink } = makeGraph(equationString);
    return {
      text: "\\( f = " + equationString + " \\)",
      function: equationString,
      graph,
      sink,
    }
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

  addEquation = (customEquationTextRef) => {
    const equationString = customEquationTextRef.current.value;
    const equation = this.makeEquation(equationString);

    const equations = this.state.equations;
    equations.push(equation);
    this.setState({
      equations: equations,
      useDynamicMathJax: true,
    });

    customEquationTextRef.current.value = "";
  }

  render() {
    const steps = [
      {
        element: '.tutorial-equation-selector',
        intro: 'The Equation section allows you to select an equation that will be used to display the computation graph and derive the backpropagation equations.',
      },
      {
        element: '.tutorial-equation-selector-custom',
        intro: 'You can add your own equation to the list and select it.',
      },
      {
        element: '.tutorial-computation-graph',
        intro: 'The Computation Graph section displays the computation graph based on the selected equation.',
      },
      {
        element: '.tutorial-computation-graph-edge',
        intro: 'If you click on an edge in the graph, the partial derivative that the edge represents will be highlighted in the backpropagation equations.',
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
                <NavItem>
                  <NavLink onClick={() => this.setState({ showFeedbackModal: true })}>Feedback</NavLink>
                </NavItem>
              </Nav>
            </Navbar>

            <Steps
              enabled={this.state.tutorialEnabled}
              steps={steps}
              initialStep={0}
              onExit={this.endTutorial}
            />

            <Modal
              show={this.state.showFeedbackModal}
              onHide={() => this.setState({ showFeedbackModal: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>Feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Thanks for using Computation Graph Viz! You can propose a new feature or report a bug by <a href="https://github.com/kcdragon/computation-graph-viz/issues/new" target="_blank">opening an issue</a> in the Github project.
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <div className="tutorial-equation-selector">
              <h2>Equation</h2>
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
      <EquationSelector
        equations={this.state.equations}
        selectedEquationIndex={this.state.selectedEquationIndex}
        selectEquation={this.selectEquation}
        addEquation={this.addEquation}
        useDynamicMathJax={this.state.useDynamicMathJax}
      />
    )
  }

  renderComputationGraph() {
    if (this.state.selectedEquationIndex !== null) {
      return (
        <ComputationGraph
          sink={this.state.equations[this.state.selectedEquationIndex].sink}
          graph={this.state.equations[this.state.selectedEquationIndex].graph}
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
          function={this.state.equations[this.state.selectedEquationIndex].function}
          sink={this.state.equations[this.state.selectedEquationIndex].sink}
          graph={this.state.equations[this.state.selectedEquationIndex].graph}
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
