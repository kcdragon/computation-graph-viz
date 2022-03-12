import {makeGraph} from './Graph';

test('makeGraph builds Graph addition equation', () => {
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
    },
  };

  expect(graph).toEqual(expectedGraph);
});
