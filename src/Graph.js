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
  const sink = "a_" + intermediaryVariableCount;

  let idCounter = 0;
  const graph = {}
  const idToNodeName = {}

  node.traverse(function (node, path, parent) {
    switch (node.type) {
      case 'OperatorNode':
        if (parent !== null && parent.type === 'ParenthesisNode') {
          node.id = parent.id
          node.parent = parent.parent
        } else {
          node.id = idCounter
          node.parent = parent
          idCounter += 1
        }

        const operatorNodeName = "a_" + intermediaryVariableCount;
        intermediaryVariableCount -= 1;
        idToNodeName[node.id] = operatorNodeName;

        addOperatorNodeToGraph(graph, operatorNodeName, node.parent !== null ? idToNodeName[node.parent.id] : null, node.op);

        if (parent !== null) {
          let parentNodeName = idToNodeName[parent.id];
          graph[parentNodeName].equation = equationForGraphNode(graph[parentNodeName]);
        }

        break
      case 'FunctionNode':
        node.id = idCounter
        node.parent = parent
        idCounter += 1

        const functionNodeName = "a_" + intermediaryVariableCount;
        intermediaryVariableCount -= 1;
        idToNodeName[node.id] = functionNodeName;
        addOperatorNodeToGraph(graph, functionNodeName, parent !== null ? idToNodeName[parent.id] : null, node.name);

        break
      case 'ParenthesisNode':
        node.id = idCounter
        node.parent = parent
        idCounter += 1

        break
      case 'SymbolNode':
        const symbolNodeName = node.name;
        const parentNodeName = idToNodeName[parent.id];

        if (isSymbolAFunction(symbolNodeName)) {
          // a SymbolNode representing a function appears right after a FunctionNode, so we assign the same ID to them
          node.id = idCounter
          node.parent = parent.parent
          break;
        }

        node.id = idCounter
        node.parent = parent
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
        graph[parentNodeName].equation = equationForGraphNode(graph[parentNodeName]);

        idToNodeName[node.id] = symbolNodeName

        break
      default:
        throw "UNSUPPORTED NODE TYPE: " + node.type;
    }
  })

  return { graph, sink };
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

function equationForGraphNode(graphNode) {
  if (graphNode.parents.length == 1) {
    return graphNode.operator + "(" + graphNode.parents[0] + ")";
  } else if (graphNode.parents.length == 2) {
    return graphNode.parents.join(" " + graphNode.operator + " ")
  }
}

function isSymbolAFunction(symbol) {
  return !!mathjs[symbol];
}
