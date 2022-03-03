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
    parentIds: ["8"],
    color: "blue"
  },
  {
    id: "1",
    parentIds: []
  },
  {
    id: "2",
    parentIds: []
  },
  {
    id: "3",
    parentIds: ["11"]
  },
  {
    id: "4",
    parentIds: ["12"]
  },
  {
    id: "5",
    parentIds: ["18"]
  },
  {
    id: "6",
    parentIds: ["9", "15", "17"]
  },
  {
    id: "7",
    parentIds: ["3", "17", "20", "21"]
  },
  {
    id: "8",
    parentIds: []
  },
  {
    id: "9",
    parentIds: ["4"],
    color: "green"
  },
  {
    id: "10",
    parentIds: ["16", "21"]
  },
  {
    id: "11",
    parentIds: ["2"]
  },
  {
    id: "12",
    parentIds: ["21"]
  },
  {
    id: "13",
    parentIds: ["4", "12"]
  },
  {
    id: "14",
    parentIds: ["1", "8"]
  },
  {
    id: "15",
    parentIds: []
  },
  {
    id: "16",
    parentIds: ["0"]
  },
  {
    id: "17",
    parentIds: ["19"]
  },
  {
    id: "18",
    parentIds: ["9"]
  },
  {
    id: "19",
    parentIds: []
  },
  {
    id: "20",
    parentIds: ["13"]
  },
  {
    id: "21",
    parentIds: []
  }
];

const d3 = Object.assign({}, d3Base, d3Dag);
const width = 800;
const height = 800;

const d = d3Dag.dagStratify()(data);
const layout = d3
  .sugiyama()
  .size([width, height])
  .decross(d3.decrossTwoLayer())
  .coord(d3.coordGreedy())
  // .layering(d3.layeringLongestPath())
  // .decross(d3.decrossOpt())
  // .coord(d3.coordVert())
  .nodeSize(() => [20, 20]);

const dag = layout(d).dag;

class App extends React.Component {
  render() {
    return (
      <svg width={width} height={height}>
        <rect width={width} height={height} stroke="red" fill="#FFF" />
        <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={6} />
        <Group top={0} left={0}>
          <>
            {dag.links().map((link) => (
              <LinePath
                key={`${link.source.id}-${link.target.id}`}
                curve={curveCatmullRom}
                data={link.points}
                x={(d) => d.x}
                y={(d) => d.y}
                stroke="#333"
                strokeWidth={2}
                markerMid="url(#marker-arrow)"
              />
            ))}
          </>
          <>
            {dag.descendants().map((d) => {
              console.log("d", d);
              return (
                <Group key={d.id}>
                  <Circle
                    key={d.id}
                    cx={d.x}
                    cy={d.y}
                    r={20}
                    fill={d.data.color || "red"}
                  />
                  <Text
                    x={d.x}
                    y={d.y}>
                    {d.id}
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
