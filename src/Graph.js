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
    node.id = idCounter
    idCounter += 1

    switch (node.type) {
      case 'OperatorNode':
        const operatorNodeName = "a_" + intermediaryVariableCount;
        intermediaryVariableCount -= 1;

        if (!graph.hasOwnProperty(operatorNodeName)) {
          graph[operatorNodeName] = {}
        }

        graph[operatorNodeName].parents = []
        graph[operatorNodeName].operator = node.op

        if (!graph[operatorNodeName].hasOwnProperty("children")) {
          graph[operatorNodeName].children = [];
        }

        if (parent !== null) {
          const parentNodeName = idToNodeName[parent.id];
          graph[operatorNodeName].children.push(parentNodeName)
          graph[parentNodeName].parents.push(operatorNodeName)
          if (graph[parentNodeName].parents.length == 2) {
            graph[parentNodeName].equation = graph[parentNodeName].parents.join(" " + graph[parentNodeName].operator + " ")
          }
        }

        idToNodeName[node.id] = operatorNodeName

        break
      case 'ConstantNode':
        break
      case 'SymbolNode':
        const symbolNodeName = node.name;
        const parentNodeName = idToNodeName[parent.id];

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
