import {makeGraph} from './Graph';

test('makeGraph builds Graph for addition equation', () => {
  let equationString = "x_1 + x_2";
  let graph = makeGraph(equationString);

  const expectedGraph = {
    x_1: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    x_2: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    a_1: {
      equation: "x_1 + x_2",
      parents: ["x_1", "x_2"],
      children: [],
      operator: "+",
    },
  };

  expect(graph).toEqual(expectedGraph);
});

test('makeGraph builds Graph for multiplication equation', () => {
  let equationString = "x_1 x_2";
  let graph = makeGraph(equationString);

  const expectedGraph = {
    x_1: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    x_2: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    a_1: {
      equation: "x_1 * x_2",
      parents: ["x_1", "x_2"],
      children: [],
      operator: "*",
    },
  };

  expect(graph).toEqual(expectedGraph);
});

test('makeGraph builds Graph for two term equation', () => {
  let equationString = "x_1 x_2 + x_1";
  let graph = makeGraph(equationString);

  const expectedGraph = {
    x_1: {
      equation: "",
      parents: [],
      children: ["a_1", "a_2"],
    },
    x_2: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    a_1: {
      equation: "x_1 * x_2",
      parents: ["x_1", "x_2"],
      children: ["a_2"],
      operator: "*",
    },
    a_2: {
      equation: "a_1 + x_1",
      parents: ["a_1", "x_1"],
      children: [],
      operator: "+",
    },
  };

  expect(graph).toEqual(expectedGraph);
});

test('makeGraph builds Graph for unary operator equation', () => {
  let equationString = "sin(x_1 * x_2)";
  let graph = makeGraph(equationString);

  const expectedGraph = {
    x_1: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    x_2: {
      equation: "",
      parents: [],
      children: ["a_1"],
    },
    a_1: {
      equation: "x_1 * x_2",
      parents: ["x_1", "x_2"],
      children: ["a_2"],
      operator: "*",
    },
    a_2: {
      equation: "sin(a_1)",
      parents: ["a_1"],
      children: [],
      operator: "sin",
    },
  };

  expect(graph).toEqual(expectedGraph);
});

test('makeGraph builds Graph for equation with unary and binary operators', () => {
  let equationString = "x_1 x_2 + sin(x_2)";
  let graph = makeGraph(equationString);

  const expectedGraph = {
    x_1: {
      equation: "",
      parents: [],
      children: ["a_2"],
    },
    x_2: {
      equation: "",
      parents: [],
      children: ["a_2", "a_1"],
    },
    a_1: {
      equation: "sin(x_2)",
      parents: ["x_2"],
      children: ["a_3"],
      operator: "sin",
    },
    a_2: {
      equation: "x_1 * x_2",
      parents: ["x_1", "x_2"],
      children: ["a_3"],
      operator: "*",
    },
    a_3: {
      equation: "a_2 + a_1",
      parents: ["a_2", "a_1"],
      children: [],
      operator: "+",
    },
  };

  expect(graph).toEqual(expectedGraph);
});
