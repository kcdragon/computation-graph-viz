import * as mathjs from "mathjs";

export function makeGraph(equationString) {
  const node = mathjs.parse(equationString);

  let idCounter = 0;

  // TODO do an initial pass to determine the number of intermediary variables so we can count down from the root

  const graph = {}
  const idToNodeName = {}

  node.traverse(function (node, path, parent) {
    node.id = idCounter
    idCounter += 1

    switch (node.type) {
      case 'OperatorNode':
        graph["a_1"] = {}
        graph["a_1"].children = []
        graph["a_1"].parents = []
        graph["a_1"].equation = "x_1 + x_2"

        idToNodeName[node.id] = "a_1"

        break
      case 'ConstantNode':
        break
      case 'SymbolNode':
        const parentNodeName = idToNodeName[parent.id];

        graph[node.name] = {}
        graph[node.name].parents = []
        graph[node.name].children = [parentNodeName]
        graph[node.name].equation = ""

        graph[parentNodeName].parents.push(node.name)

        idToNodeName[node.id] = node.name

        break
      default:
        console.log(node.type)
    }
  })

  return graph;
};
