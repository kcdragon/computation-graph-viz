import {MathJax, MathJaxContext} from "better-react-mathjax";
import React from 'react';
import {Button, Col, Form, FormCheck, Row} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/FormCheckInput";

class EquationSelector extends React.Component {
  render() {
    const customEquationTextRef = React.createRef();

    return (
      <>
        <Row>
          <MathJaxContext>
            <MathJax dynamic={this.props.useDynamicMathJax}>
              {this.props.equations.map((equation, index) => {
                return (
                  <FormCheck key={index}>
                    <FormCheckInput type="radio" name={"equation-" + index}
                                    checked={this.props.selectedEquationIndex === index} onChange={() => {
                      this.props.selectEquation(index)
                    }}></FormCheckInput>
                    <label htmlFor={"equation-" + index}>
                      {equation.text}
                    </label>
                  </FormCheck>
                );
              })}
            </MathJax>
          </MathJaxContext>
        </Row>

        <Row className="tutorial-equation-selector-custom">
          <h4>Add your own equation</h4>
          <Form>
            <Row>
              <Col>
                <textarea className="form-control" type="text" ref={customEquationTextRef} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button primary onClick={() => this.props.addEquation(customEquationTextRef)}>Add</Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </>
    );
  }
}

export default EquationSelector;
