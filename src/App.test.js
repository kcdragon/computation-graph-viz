import { render, screen } from '@testing-library/react';
import App from './App';
import * as mathjs from 'mathjs';

test('mathjs', () => {
  let eq = mathjs.simplify(mathjs.derivative("x^2", "x") + "+" + mathjs.derivative("x", "x"))
  expect(eq.toString()).toBe("2 * x + 1")

  eq = mathjs.simplify("1 * 1")
  expect(eq.toString()).toBe("1")
});
