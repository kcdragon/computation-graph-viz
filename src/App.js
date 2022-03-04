import React from 'react';
import * as d3Base from "d3";
import * as d3Dag from "d3-dag";
import { Group } from "@visx/group";
import { LinePath, Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { curveCatmullRom } from "@visx/curve";
import { MarkerArrow } from "@visx/marker";

// serialize to parent ids
// collapse node - remove node, add connections between all adjacent nodes
// collapsing may lead to cycles - how to handle it?

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
]

const d3 = Object.assign({}, d3Base, d3Dag);
const width = 800;
const height = 800;

const d = d3Dag.dagStratify()(data);
const layout = d3
  .sugiyama()
  .size([width, height])
  .decross(d3.decrossTwoLayer())
  .coord(d3.coordGreedy())
  .nodeSize(() => [20, 20]);

const dag = layout(d).dag;

class App extends React.Component {
  render() {
    return (
      <svg width={width} height={height}>
        <rect width={width} height={height} stroke="red" fill="#FFF" />
        <MarkerArrow id="marker-arrow-mid" fill="#333" refX={2} size={6} />
        <MarkerArrow id="marker-arrow-end" fill="#333" size={6} />
        <Group top={0} left={0}>
          <>
            {dag.links().map((link) => {
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
                x={(d) => width - d.x}
                y={(d) => height - d.y}
                stroke="#333"
                strokeWidth={2}
                markerMid="url(#marker-arrow-mid)"
                markerEnd="url(#marker-arrow-end)"
              />);
            })}
          </>
          <>
            {dag.descendants().map((d) => {
              console.log("d.data", d.data);
              return (
                <Group key={d.id}>
                  <Circle
                    key={d.id}
                    cx={width - d.x}
                    cy={height - d.y}
                    r={20}
                    fill={d.data.color || "red"}
                  />
                  <Text
                    x={width - d.x}
                    y={height - d.y}
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
export default App;
