const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateVolume, formatVolume, formatCopyText } = require('../src/calculator');

const testCalc = (input) => calculateVolume({
  length: '100', width: '100', height: '100', quantity: '1', unit: 'cm', ...input,
});
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('100 × 100 × 100 cm is exactly 1 CBM', () => {
  const r = testCalc({});
  assert.equal(r.ok, true);
  near(r.cbm, 1);
  near(r.cft, 35.31466672148859);
});
test('48 × 40 × 40 in × 2 gives correct CBM/CFT', () => {
  const r = testCalc({ length: '48', width: '40', height: '40', quantity: '2', unit: 'in' });
  assert.equal(r.ok, true);
  near(r.cbm, 2.5170530304);
  near(r.cft, 88.88888888888889);
});
test('1 cubic foot converts to 0.028316846592 CBM', () => {
  const r = testCalc({ length: '1', width: '1', height: '1', unit: 'ft' });
  near(r.cbm, 0.028316846592);
  near(r.cft, 1);
});
test('quantity multiplies unit volume, not dimensions', () => {
  const r = testCalc({ length: '50', width: '40', height: '30', quantity: '10' });
  near(r.perItemCbm, 0.06);
  near(r.cbm, 0.6);
});
test('decimal input and comma decimal separator', () => {
  const r = testCalc({ length: '25,5', width: '10.5', height: '.5' });
  assert.equal(r.ok, true);
  near(r.cbm, 0.000133875);
});
test('invalid inputs must not silently produce a number', () => {
  for (const [key, value] of [
    ['length', ''], ['width', '0'], ['height', '-1'], ['height', '1e4'],
    ['quantity', '0'], ['quantity', '1.5'], ['quantity', '1000000'],
    ['quantity', 'Infinity'], ['length', 'abc'],
  ]) assert.equal(testCalc({ [key]: value }).ok, false, `${key}=${value}`);
  assert.equal(testCalc({ unit: 'yard' }).ok, false);
});
test('formatting works and copied text contains units and quantity', () => {
  assert.equal(formatVolume(2.5170530304), '2.5171');
  const input = { length: '48', width: '40', height: '40', quantity: '2', unit: 'in' };
  const output = formatCopyText(input, testCalc(input));
  assert.match(output, /48 × 40 × 40 in/);
  assert.match(output, /Quantity: 2 pcs/);
  assert.match(output, /2.517053 CBM/);
});
