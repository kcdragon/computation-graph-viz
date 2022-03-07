import { render, screen } from '@testing-library/react';
import App from './App';
import * as mathjs from 'mathjs';

test('mathjs', () => {
  // const eq = mathjs.chain(mathjs.derivative("x^2", "x")).add(mathjs.derivative("x", "x"))

  let eq = mathjs.simplify(mathjs.derivative("x^2", "x") + "+" + mathjs.derivative("x", "x"))

  eq = mathjs.simplify("1 * 1")

  console.log(eq.toString())
});
