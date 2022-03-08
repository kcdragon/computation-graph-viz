import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import * as mathjs from "mathjs";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class Backpropagation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedDerivative: null };

    this.selectDerivative = this.selectDerivative.bind(this);
  }

  selectDerivative(derivative) {
    console.log("derivative selected", derivative);
    this.setState({ selectedDerivative: derivative });
  }

  render() {
    const backpropEquations = []
    const derivativesOfFunction = {}
    const needToVisit = []
    const visited = new Set()

    let node = this.props.sink;
    while (node != null) {
      visited.add(node);

      const leftSide = this.constructLatexFormattedDerivativeString("f", node);
      const children = this.props.graph[node].children;

      const parts = [leftSide];
      if (children.length == 0) {
        derivativesOfFunction[node] = 1;
        parts.push("1");
      } else {
        const rightSide = children.map(child => {
          return this.constructLatexFormattedDerivativeString("f", child) + "*" + this.constructLatexFormattedDerivativeString(child, node);
        }).join("+");
        parts.push(rightSide);

        const derivativeEquation = children.map(child => {
          return derivativesOfFunction[child] + "*" + mathjs.derivative(this.props.graph[child].equation, node).toString();
        }).join("+");

        parts.push(derivativeEquation);

        const simplifiedDerivativeEquation = mathjs.simplify(derivativeEquation).toString()
        parts.push(simplifiedDerivativeEquation);
        derivativesOfFunction[node] = simplifiedDerivativeEquation;
      }

      backpropEquations.push(parts.filter(s => s != "").join("="));

      let newNodesToExplore = this.props.graph[node].parents.filter(n => !visited.has(n) && !needToVisit.includes(n));
      needToVisit.push(...newNodesToExplore);
      node = needToVisit.shift();
    }

    return (
      <Container>
        <Row>
          <Col>
            <h3>Hardcoded</h3>
            <MathJaxContext>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial a_3} = 1 \\)"}</MathJax>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial a_1} = \\frac{\\partial f}{\\partial a_3} * \\frac{\\partial a_3}{\\partial a_1} = 1 * 1 = 1 \\)"}</MathJax>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial a_2} = \\frac{\\partial f}{\\partial a_3} * \\frac{\\partial a_3}{\\partial a_2} = 1 * 1 = 1 \\)"}</MathJax>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial x_2} = \\frac{\\partial f}{\\partial a_1} * \\frac{\\partial a_1}{\\partial x_2} + \\frac{\\partial f}{\\partial a_2} * \\frac{\\partial a_2}{\\partial x_2} = 1 * cos(x_2) + 1 * x_1 = cos(x_2) + x_1 \\)"}</MathJax>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial x_1} = \\frac{\\partial f}{\\partial a_2} * \\frac{\\partial a_2}{\\partial x_1} = 1 * x_2 = x_2 \\)"}</MathJax>
            </MathJaxContext>
          </Col>
          <Col>
            <h3>Calculated</h3>
            <MathJaxContext>
              {backpropEquations.map((equation, index) => <MathJax key={index}>\({equation}\)</MathJax>)}
            </MathJaxContext>
          </Col>
          <Col>
            <h3>Playground</h3>
            <MathJaxContext>
              <MathJax>When the equation <HighlightableTerm selectedDerivative={this.state.selectedDerivative} selectDerivative={this.selectDerivative}>{"\\(x + 1\\)"}</HighlightableTerm> is clicked, it also highlights the equation <HighlightableTerm selectedDerivative={this.state.selectedDerivative} selectDerivative={this.selectDerivative}>{"\\(x + 1\\)"}</HighlightableTerm> here. When the equation <HighlightableTerm selectedDerivative={this.state.selectedDerivative} selectDerivative={this.selectDerivative}>{"\\(x + 2\\)"}</HighlightableTerm> is clicked, it also highlights the equation <HighlightableTerm selectedDerivative={this.state.selectedDerivative} selectDerivative={this.selectDerivative}>{"\\(x + 2\\)"}</HighlightableTerm> here.</MathJax>
            </MathJaxContext>
          </Col>
        </Row>
      </Container>
    );
  }

  constructLatexFormattedDerivativeString(top, bottom) {
    return "\\frac{\\partial " + top + "}{\\partial " + bottom + "}";
  }
}

class HighlightableTerm extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.selectDerivative(this.props.children);
  }

  render() {
    const shouldHighlight = this.props.selectedDerivative === this.props.children;

    const style = {}
    if (shouldHighlight) {
      style["backgroundColor"] = "#FFFF00";
    }

    return <span className="highlightable-term" style={style} onClick={this.onClick}>{this.props.children}</span>
  }
}

export default Backpropagation;
