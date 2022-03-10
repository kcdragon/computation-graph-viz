import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import * as mathjs from "mathjs";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class Backpropagation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const backpropEquations = []
    const derivativesOfFunction = {}
    const needToVisit = []
    const visited = new Set()

    let node = this.props.sink;
    while (node != null) {
      visited.add(node);

      const derivativeOfFWithRespectToNodeTerm = {
        text: this.constructLatexFormattedDerivativeString("f", node),
        isDerivative: true,
        derivativeFunction: "f",
        derivativeVariable: node,
      };
      const children = this.props.graph[node].children;

      let equalsTerm = {
        text: "=",
        isDerivative: false,
      }

      let additionTerm = {
        text: "+",
        isDerivative: false,
      }

      let multiplicationTerm = {
        text: "*",
        isDerivative: false,
      }

      const terms = [derivativeOfFWithRespectToNodeTerm];
      terms.push(equalsTerm);

      if (children.length === 0) {
        derivativesOfFunction[node] = 1;
        terms.push({
          text: "1",
          isDerivative: false,
        });
      } else {

        const rightSide = children.map(child => {
          let derivativeOfFWithRespectToChildTerm = {
            text: this.constructLatexFormattedDerivativeString("f", child),
            isDerivative: true,
            derivativeFunction: "f",
            derivativeVariable: child,
          };

          let derivativeOfChildWithRespectToNodeTerm = {
            text: this.constructLatexFormattedDerivativeString(child, node),
            isDerivative: true,
            derivativeFunction: child,
            derivativeVariable: node,
          };

          return [derivativeOfFWithRespectToChildTerm, multiplicationTerm, derivativeOfChildWithRespectToNodeTerm, additionTerm];
        }).flat();
        rightSide.pop(); // remove last addition since it isn't needed
        terms.push(...rightSide);
        terms.push(equalsTerm);

        const derivativeEquation = children.map(child => {
          return derivativesOfFunction[child] + "*" + mathjs.derivative(this.props.graph[child].equation, node).toString();
        }).join("+");

        terms.push({
          text: derivativeEquation,
          isDerivative: false,
        });
        terms.push(equalsTerm);

        const simplifiedDerivativeEquation = mathjs.simplify(derivativeEquation).toString()
        terms.push({
          text: simplifiedDerivativeEquation,
          isDerivative: false,
        });
        derivativesOfFunction[node] = simplifiedDerivativeEquation;
      }

      backpropEquations.push(terms);

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
              {backpropEquations.map((terms, index) => {
                return (
                  <div key={index}>
                    {this.renderBackpropEquation(terms)}
                    <br />
                  </div>
                );
              })}
            </MathJaxContext>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBackpropEquation(terms) {
    return terms.map((term, index) => {
      if (term.isDerivative) {
        return <MathJax inline key={index}><HighlightableTerm term={term} selectedTerm={this.props.selectedTerm} selectTerm={this.props.selectTerm}>{"\\(" + term.text + "\\)"}</HighlightableTerm></MathJax>;
      } else {
        return <MathJax inline key={index}>{"\\(" + term.text + "\\)"}</MathJax>;
      }
    });
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
    this.props.selectTerm(this.props.term);
  }

  render() {
    const shouldHighlight = this.props.selectedTerm && this.props.selectedTerm.text === this.props.term.text;

    const style = {}
    if (shouldHighlight) {
      style["backgroundColor"] = "#FFFF00";
    }

    return <span className="highlightable-term" style={style} onClick={this.onClick}>{this.props.children}</span>
  }
}

export default Backpropagation;
