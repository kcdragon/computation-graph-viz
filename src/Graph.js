import * as mathjs from "mathjs";

export function makeGraph(equationString) {
  const node = mathjs.parse(equationString);

  let intermediaryVariableCount = 0;
  node.traverse(function (node, path, parent) {
    if (node.isSymbolNode) {
      intermediaryVariableCount += 1;
    }
  });
  intermediaryVariableCount -= 1;

  let idCounter = 0;
  const graph = {}
  const idToNodeName = {}

  node.traverse(function (node, path, parent) {
    switch (node.type) {
      case 'OperatorNode':
        node.id = idCounter
        idCounter += 1

        const operatorNodeName = "a_" + intermediaryVariableCount;
        intermediaryVariableCount -= 1;
        idToNodeName[node.id] = operatorNodeName;

        addOperatorNodeToGraph(graph, operatorNodeName, parent !== null ? idToNodeName[parent.id] : null, node.op);

        if (parent !== null) {
          let parentNodeName = idToNodeName[parent.id];
          if (graph[parentNodeName].parents.length == 1) {
            graph[parentNodeName].equation = graph[parentNodeName].operator + "(" + graph[parentNodeName].parents[0] + ")"
          }
        }


        break
      case 'ConstantNode':
        break
      case 'FunctionNode':
        node.id = idCounter
        idCounter += 1

        const functionNodeName = "a_" + intermediaryVariableCount;
        intermediaryVariableCount -= 1;
        idToNodeName[node.id] = functionNodeName;
        addOperatorNodeToGraph(graph, functionNodeName, parent !== null ? idToNodeName[parent.id] : null, "sin");

        break
      case 'SymbolNode':
        const symbolNodeName = node.name;
        const parentNodeName = idToNodeName[parent.id];

        if (symbolNodeName === "sin") {
          // a SymbolNode representing a function appears right after a FunctionNode, so we assign the same ID to them
          node.id = idCounter
          break;
        }

        node.id = idCounter
        idCounter += 1

        if (!graph.hasOwnProperty(symbolNodeName)) {
          graph[symbolNodeName] = {}
        }

        graph[symbolNodeName].parents = []
        graph[symbolNodeName].equation = ""

        if (!graph[symbolNodeName].hasOwnProperty("children")) {
          graph[symbolNodeName].children = [];
        }
        graph[symbolNodeName].children.push(parentNodeName)

        graph[parentNodeName].parents.push(symbolNodeName)
        if (graph[parentNodeName].parents.length == 2) {
          graph[parentNodeName].equation = graph[parentNodeName].parents.join(" " + graph[parentNodeName].operator + " ")
        }

        idToNodeName[node.id] = symbolNodeName

        break
      default:
        console.log("UNSUPPORTED NODE TYPE")
    }
  })

  return graph;
};

function addOperatorNodeToGraph(graph, nodeName, parentNodeName, operation) {
  if (!graph.hasOwnProperty(nodeName)) {
    graph[nodeName] = {}
  }

  graph[nodeName].parents = []
  graph[nodeName].operator = operation

  if (!graph[nodeName].hasOwnProperty("children")) {
    graph[nodeName].children = [];
  }

  if (parentNodeName !== null) {
    graph[nodeName].children.push(parentNodeName)
    graph[parentNodeName].parents.push(nodeName)
    if (graph[parentNodeName].parents.length == 2) {
      graph[parentNodeName].equation = graph[parentNodeName].parents.join(" " + graph[parentNodeName].operator + " ")
    }
  }
}