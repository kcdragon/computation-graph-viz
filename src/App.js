import {MathJax, MathJaxContext} from "better-react-mathjax";
import * as d3Base from "d3";
import * as d3Dag from "d3-dag";
import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {curveCatmullRom} from "@visx/curve";
import {Group} from "@visx/group";
import {MarkerArrow} from "@visx/marker";
import {Circle, LinePath} from "@visx/shape";

import 'bootstrap/dist/css/bootstrap.min.css';

const d3 = Object.assign({}, d3Base, d3Dag);

const data = [
  {
    id: "0",
    label: "x_2",
  },
  {
    id: "1",
    label: "x_1",
  },
  {
    id: "2",
    label: "sin",
    parentIds: ["0"],
  },
  {
    id: "3",
    label: "*",
    parentIds: ["0", "1"],
  },
  {
    id: "4",
    label: "+",
    parentIds: ["2", "3"],
  },
];

class ComputationGraph extends React.Component {
  static defaultProps = {
    width: 600,
    height: 600,
  }

  constructor(props) {
    super(props);

    const d = d3.dagStratify()(this.props.data);
    const layout = d3
        .sugiyama()
        .size([this.props.width, this.props.height])
        .decross(d3.decrossTwoLayer())
        .coord(d3.coordGreedy())
        .nodeSize(() => [30, 30]);
    this.dag = layout(d).dag;
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height}>
        <rect width={this.props.width} height={this.props.height} fill="#FFF" />
        <MarkerArrow id="marker-arrow-mid" fill="#333" refX={2} size={6} />
        <MarkerArrow id="marker-arrow-end" fill="#333" size={6} />
        <Group top={0} left={0}>
          <>
            {this.dag.links().map((link) => {
              const points = link.points
              if (points.length === 2) {
                const start = points[0];
                const end = points[1];

                // https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point
                const length = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))
                const v = [(end.x - start.x), (end.y - start.y)]
                const u = [v[0] / length, v[1] / length]
                const newLastPoint = {
                  x: end.x - 10 * u[0],
                  y: end.y - 10 * u[1],
                }
                points[points.length - 1] = newLastPoint
              }

              return (
              <LinePath
                key={`${link.source.id}-${link.target.id}`}
                curve={curveCatmullRom}
                data={link.points}
                x={(d) => this.props.width - d.x}
                y={(d) => this.props.height - d.y}
                stroke="#333"
                strokeWidth={2}
                markerMid="url(#marker-arrow-mid)"
                markerEnd="url(#marker-arrow-end)"
              />);
            })}
          </>
          <>
            {this.dag.descendants().map((d) => {
              let label = d.data.label || d.id;
              return (
                <Group key={d.id}>
                  <Circle
                    key={d.id}
                    cx={this.props.width - d.x}
                    cy={this.props.height - d.y}
                    r={20}
                    stroke="black"
                    fill="white"
                  />
                  <foreignObject
                    x={this.props.width - d.x - 10}
                    y={this.props.height - d.y - 10}
                    width="100"
                    height="100"
                    textAnchor="middle">
                    <MathJaxContext>
                      <MathJax>{"\\(" + label + "\\)"}</MathJax>
                    </MathJaxContext>
                  </foreignObject>
                </Group>
              );
            })}
          </>
        </Group>
      </svg>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h2>Equation</h2>
            <MathJaxContext>
              <MathJax>{"\\( f(x_1, x_2) = x_1 x_2 + sin(x_2) \\)"}</MathJax>
            </MathJaxContext>
          </Col>
          <Col>
            <h2>Computation Graph</h2>
            <ComputationGraph data={data} />
          </Col>
          <Col>
            <h2>Backpropagation</h2>
            <MathJaxContext>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial a_3} = 1 \\)"}</MathJax>
              <MathJax>{"\\( \\frac{\\partial f}{\\partial a_1} = \\frac{\\partial f}{\\partial a_3} \\frac{\\partial a_3}{\\partial a_1} = \\frac{\\partial f}{\\partial a_3} \\frac{\\partial (a_1 + a_2)}{\\partial a_1} = \\frac{\\partial f}{\\partial a_3} 1 =\\frac{\\partial f}{\\partial a_3}  \\)"}</MathJax>
            </MathJaxContext>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
