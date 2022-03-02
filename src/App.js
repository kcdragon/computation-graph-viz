import React from 'react';
import * as d3 from "d3";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.myReference = React.createRef();
  }

  componentDidMount() {
    const margin = { top: 100, right: 100, bottom: 100, left: 100 }
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3.select(this.myReference.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);
    
    const filename = "data_network.json"
    d3.json(filename).then( function( data) {

      // Initialize the links
      const link = svg
        .selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#aaa")

      // Initialize the nodes
      const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 20)
        .style("fill", "#69b3a2")

      // Let's list the force we wanna apply on the network
      const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
          .id(function(d) { return d.id; })                     // This provide  the id of a node
          .links(data.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      function ticked() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("cx", function (d) { return d.x+6; })
          .attr("cy", function(d) { return d.y-6; });
      }

    });
  }

  render() {
    return (
      <div>
        <div ref={this.myReference}>
        </div>
      </div>
    );
  }
}

export default App;
