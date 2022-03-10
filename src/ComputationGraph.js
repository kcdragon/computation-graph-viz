import {MathJax, MathJaxContext} from "better-react-mathjax";
import * as d3Base from "d3";
import * as d3Dag from "d3-dag";
import React from 'react';
import {curveCatmullRom} from "@visx/curve";
import {Group} from "@visx/group";
import {MarkerArrow} from "@visx/marker";
import {LinePath} from "@visx/shape";

import 'bootstrap/dist/css/bootstrap.min.css';


const d3 = Object.assign({}, d3Base, d3Dag);

class ComputationGraph extends React.Component {
  static defaultProps = {
    width: 600,
    height: 600,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const d = d3.dagStratify()(this.buildD3DagData(this.props.graph));
    const layout = d3
      .sugiyama()
      .size([this.props.width, this.props.height])
      .decross(d3.decrossTwoLayer())
      .coord(d3.coordGreedy())
      .nodeSize(() => [30, 30]);
    this.dag = layout(d).dag;

    return (
      <svg className="computation-graph" width={this.props.width} height={this.props.height}>
        <rect width={this.props.width} height={this.props.height} fill="#FFF"/>
        <MarkerArrow id="marker-arrow" fill="#333" size={6}/>
        <MarkerArrow id="marker-arrow-highlighted" fill="#FFFF00" size={6}/>
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

              let linePathClassName = "computation-graph__edge";
              let markerArrowRef = "marker-arrow"
              if (!!this.props.selectedTerm) {
                const { derivativeFunction, derivativeVariable } = this.props.selectedTerm;
                if (derivativeFunction === link.target.id && derivativeVariable === link.source.id) {
                  linePathClassName = "computation-graph__edge--highlighted";
                  markerArrowRef = "marker-arrow-highlighted"
                }
              }

              return (
                <LinePath
                  key={`${link.source.id}-${link.target.id}`}
                  curve={curveCatmullRom}
                  data={link.points}
                  x={(d) => this.props.width - d.x}
                  y={(d) => this.props.height - d.y}
                  strokeWidth={5}
                  markerMid={"url(#" + markerArrowRef + ")"}
                  markerEnd={"url(#" + markerArrowRef + ")"}
                  className={linePathClassName}
                />);
            })}
          </>
          <>
            {this.dag.descendants().map((d) => {
              let label = d.data.label || d.id;
              return (
                <Group key={d.id}>
                  <ellipse
                    cx={this.props.width - d.x}
                    cy={this.props.height - d.y}
                    rx={60}
                    ry={20}
                    stroke="black"
                    fill="white"
                  />

                  <foreignObject
                    x={this.props.width - d.x - 50}
                    y={this.props.height - d.y - 15}
                    width="100"
                    height="100">
                    <div style={{textAlign: "center"}}>
                      <MathJaxContext>
                        <MathJax>{"\\(" + label + "\\)"}</MathJax>
                      </MathJaxContext>
                    </div>
                  </foreignObject>
                </Group>
              );
            })}
          </>
        </Group>
      </svg>
    );
  }

  buildD3DagData(graph) {
    const data = [];
    for (const [key, value] of Object.entries(graph)) {
      const node = {};
      node.id = key;
      node.label = [key, value.equation].filter(e => e !== "").join(" = ");
      node.parentIds = value.parents;
      data.push(node);
    }
    return data;
  }
}

export default ComputationGraph;