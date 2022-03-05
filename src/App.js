import { MathJax, MathJaxContext } from "better-react-mathjax";
import * as d3Base from "d3";
import * as d3Dag from "d3-dag";
import React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { curveCatmullRom } from "@visx/curve";
import { Group } from "@visx/group";
import { MarkerArrow } from "@visx/marker";
import { LinePath, Circle } from "@visx/shape";
import { Text } from "@visx/text";

import 'bootstrap/dist/css/bootstrap.min.css';

const d3 = Object.assign({}, d3Base, d3Dag);

const data = [
  {
    id: "0",
    label: "x2",
  },
  {
    id: "1",
    label: "x1",
  },
  {
    id: "2",
    label: "sin()",
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
        .nodeSize(() => [20, 20]);
    this.dag = layout(d).dag;
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height}>
        <rect width={this.props.width} height={this.props.height} stroke="red" fill="#FFF" />
        <MarkerArrow id="marker-arrow-mid" fill="#333" refX={2} size={6} />
        <MarkerArrow id="marker-arrow-end" fill="#333" size={6} />
        <Group top={0} left={0}>
          <>
            {this.dag.links().map((link) => {
              const points = link.points
              if (points.length == 2) {
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
              return (
                <Group key={d.id}>
                  <Circle
                    key={d.id}
                    cx={this.props.width - d.x}
                    cy={this.props.height - d.y}
                    r={20}
                    fill={d.data.color || "red"}
                  />
                  <Text
                    x={this.props.width - d.x}
                    y={this.props.height - d.y}
                    textAnchor="middle"
                    fill="white">
                    {d.data.label || d.id}
                  </Text>
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
            <ComputationGraph data={data} />
          </Col>
          <Col>
            <MathJaxContext>
              <h2>Backpropagation</h2>
              <MathJax>{"\\(\\frac{10}{4x} \\approx 2^{12}\\)"}</MathJax>
            </MathJaxContext>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default App;
