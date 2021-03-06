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
    width: 400,
    height: 600,
  }

  selectEdge = (edge) => () => {
    this.props.selectEdge(edge);
  }

  render() {
    const d = d3.dagStratify()(this.buildD3DagData(this.props.graph));
    const layout = d3
      .sugiyama()
      .size([this.props.width, this.props.height])
      .decross(d3.decrossTwoLayer())
      .coord(d3.coordGreedy())
      .nodeSize(() => [30, 30]);
    const dag = layout(d).dag;

    let edgesInvolvedInDerivative = new Set()
    if (!!this.props.selectedTerm) {
      const { derivativeFunction, derivativeVariable } = this.props.selectedTerm;
      const source = derivativeVariable;

      let sink = derivativeFunction;
      if (sink === "f") {
        // since f isn't in the graph we use the last intermediary variable
        sink = this.props.sink;
      }

      const pathsToSink = [];
      const pathsToExplore = [[source]];
      while (pathsToExplore.length > 0) {
        const path = pathsToExplore.pop();
        const node = path[path.length - 1]
        if (node === sink) {
          pathsToSink.push(path);
          continue;
        }

        const children = this.props.graph[node].children;
        const pathsFromNode = children.map(child => {
          return path.concat([child])
        })
        pathsToExplore.push(...pathsFromNode)
      }

      pathsToSink.forEach(path => {
        const edges = path.slice(1).map((node, index) => [node, path[index]]);
        edgesInvolvedInDerivative = new Set([...edgesInvolvedInDerivative, ...edges])
      });
    }

    const renderedEdges = this.renderEdges(dag, edgesInvolvedInDerivative);
    const renderedNodes = this.renderNodes(dag);

    return (
      <svg className="computation-graph" pointerEvents="bounding-box" width={this.props.width} height={this.props.height}>
        <rect width={this.props.width} height={this.props.height} fill="#FFF"/>
        <Group top={0} left={0}>
          {renderedEdges}
          {renderedNodes}
        </Group>
      </svg>
    );
  }

  renderEdges(dag, edgesInvolvedInDerivative) {
    return (
      <>
        {dag.links().map((link, index) => {
          let points = link.points
          if (points.length === 2) {
            const start = points[0];
            const end = points[1];

            // https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point
            const length = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))
            const v = [(end.x - start.x), (end.y - start.y)]
            const u = [v[0] / length, v[1] / length]
            const distanceToMoveMarkers = 23; // this is not perfect and might need to be tweaked if the sizes of other shapes change
            const newLastPoint = {
              x: end.x - distanceToMoveMarkers * u[0],
              y: end.y - distanceToMoveMarkers * u[1],
            }
            points = points.slice(0, -1).concat([newLastPoint])
          }

          let linePathClassName = "computation-graph__edge";
          let markerArrowRef = `marker-arrow-${link.source.id}-${link.target.id}`;
          if (!!this.props.selectedTerm) {
            const shouldHighlightEdge = Array.from(edgesInvolvedInDerivative).some(edge => edge[0] === link.target.id && edge[1] === link.source.id);
            if (shouldHighlightEdge) {
              linePathClassName = "computation-graph__edge--highlighted";
              markerArrowRef = `marker-arrow-highlighted-${link.source.id}-${link.target.id}`;
            }
          }

          if (!!this.props.selectedEdge) {
            const shouldHighlightEdge = link.source.id === this.props.selectedEdge.source && link.target.id === this.props.selectedEdge.target;
            if (shouldHighlightEdge) {
              linePathClassName = "computation-graph__edge--highlighted";
              markerArrowRef = `marker-arrow-highlighted-${link.source.id}-${link.target.id}`;
            }
          }

          let tutorialClassName = "";
          const useEdgeInTutorial = index === 0;
          if (useEdgeInTutorial) {
            tutorialClassName = "tutorial-computation-graph-edge";
          }

          const onClick = this.selectEdge({
            source: link.source.id,
            target: link.target.id,
          })

          return (
            <Group key={`${link.source.id}-${link.target.id}`}>
              <MarkerArrow
                id={`marker-arrow-${link.source.id}-${link.target.id}`}
                fill="#333"
                size={6}
                onClick={onClick}
              />
              <MarkerArrow
                id={`marker-arrow-highlighted-${link.source.id}-${link.target.id}`}
                fill="#01FF70"
                size={6}
                onClick={onClick}
              />
              <LinePath
                curve={curveCatmullRom}
                data={points}
                x={(d) => this.props.width - d.x}
                y={(d) => this.props.height - d.y}
                strokeWidth={4}
                markerMid={"url(#" + markerArrowRef + ")"}
                markerEnd={"url(#" + markerArrowRef + ")"}
                className={`${linePathClassName} ${tutorialClassName}`}
                onClick={onClick}
              />
            </Group>
          );
        })}
      </>
    );
  }

  renderNodes(dag) {
    return (
      <MathJaxContext>
        {dag.descendants().map((d) => {
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
                height="50">
                <div style={{textAlign: "center"}}>
                  <MathJax dynamic>{"\\( " + label + " \\)"}</MathJax>
                </div>
              </foreignObject>
            </Group>
          );
        })}
      </MathJaxContext>
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
