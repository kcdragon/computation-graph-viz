import React from 'react';

class Article extends React.Component {
  render() {
    return (
      <div>
        <h3>
          What are computation graphs?
        </h3>
        <p>
          Computation graphs are directed acyclic graphs that visualize a mathematical equation.
          Nodes represent variables in an equation and operations on variables or expressions.
          Edges between nodes represent a variable or expression being part of an expression.
          Computation graphs can be a helpful tool to visualize the backpropagation algorithm and calculate the derivatives derived during that algorithm.
        </p>

        <h3>
          What is backpropagation?
        </h3>
        <p>
          Backpropagation is an optimization algorithm commonly used to find the optimal weights in a Neural Network.
          Backpropagation is effective because it uses partial derivatives calculated previously to compute subsequent partial derivatives.
        </p>

        <h3>
          Constructing a computation graph
        </h3>
        <p>
          Computation graphs are built using the following iterative process:
        </p>
        <ol>
          <li>Define a node for each variable in the equation.</li>
          <li>For each operation involving a node, add a new node representing the operation and add directed edges from the operand nodes to the operation node.</li>
          <li>Repeat 2 until a node has been added that represents the entire equation.</li>
        </ol>

        <h3>
          Calculating derivatives using computation graphs
        </h3>
        <p>
          The derivative of the function with respect to each input and intermediary variable can be calculated using backpropagation.
          The derivatives can be calculated with the following iterative process:
        </p>
        <ol>
          <li>The derivative of the function with respect to the intermediary variable at the sink node will always be 1.</li>
          <li>Start with the sink node of the graph. The sink node is the node with no outgoing edges.</li>
          <li>Visit each parent of the current node</li>
          <li>For the current node, the derivative will the sum of the derivatives for each path from the current node to the sink node.</li>
          <li>The derivative for a path is the derivative of the function with respect to the child's variable multiplied by the derivative of the child's variable with respect to the node's variable. The former has already been calculated by a previous step in this process is calculated using the child's equation.</li>
          <li>Repeat steps 3-5 for each node as its encountered.</li>
        </ol>

        <h3>
          References
        </h3>
        <p>
          I found the following resources helpful in building this tool.
        </p>
        <ul>
          <li><a href="https://colah.github.io/posts/2015-08-Backprop/">Calculus on Computational Graphs: Backpropagation</a> by Christopher Olah</li>
        </ul>
      </div>
    );
  }
}

export default Article;