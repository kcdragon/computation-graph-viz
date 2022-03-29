import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import * as mathjs from "mathjs";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'

class Backpropagation extends React.Component {
  constructor(props) {
    console.log("Backpropagation constructor called")

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

    console.log("finished building backpropEquations")

    return (
      <Container>
        <Row>
          <Col>
            <MathJaxContext>
              <MathJax dynamic={this.props.useDynamicMathJax}>
                {backpropEquations.map((terms, index) => {
                  return (
                    <div key={index}>
                      {this.renderBackpropEquation(terms)}
                    </div>
                  );
                })}
              </MathJax>
            </MathJaxContext>
          </Col>
        </Row>
      </Container>
    );
  }

  renderBackpropEquation(terms) {
    return terms.map((term, index) => {
      if (term.isDerivative) {
        return (
          <HighlightableTerm key={index} term={term} selectedTerm={this.props.selectedTerm} selectedEdge={this.props.selectedEdge} selectTerm={this.props.selectTerm}>
            {"\\(" + term.text + "\\)"}
          </HighlightableTerm>
        );
      } else {
        return (
          <span key={index}>
            {"\\(" + term.text + "\\)"}
          </span>
        );
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
    const { term, selectedTerm, selectedEdge } = this.props;

    let shouldHighlight = selectedTerm && selectedTerm.text === term.text;
    if (!!selectedEdge) {
      shouldHighlight = shouldHighlight || term.derivativeFunction === selectedEdge.target && term.derivativeVariable === selectedEdge.source;
    }

    let className = "highlightable-term";
    if (shouldHighlight) {
      className = "highlightable-term--highlighted"
    }

    return <span className={className} onClick={this.onClick}>{this.props.children}</span>
  }
}

export default Backpropagation;
