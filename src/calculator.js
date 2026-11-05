'use strict';

// All dimensions must use the same selected input unit.
const METERS_PER_UNIT = Object.freeze({
  cm: 0.01,
  in: 0.0254,
  ft: 0.3048,
});
const CUBIC_FEET_PER_CUBIC_METER = 35.31466672148859;

function parsePositiveNumber(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const normalized = String(value).trim().replace(',', '.');
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) && result > 0 ? result : null;
}

function calculateVolume({ length, width, height, quantity, unit }) {
  if (!Object.prototype.hasOwnProperty.call(METERS_PER_UNIT, unit)) {
    return { ok: false, error: 'Select a valid unit.' };
  }
  const values = [length, width, height].map(parsePositiveNumber);
  if (values.some((v) => v === null)) {
    return { ok: false, error: 'Enter a positive number for each dimension.' };
  }
  const qty = parsePositiveNumber(quantity);
  if (qty === null || !Number.isSafeInteger(qty) || qty > 999999) {
    return { ok: false, error: 'Quantity must be a whole number from 1 to 999,999.' };
  }
  const [l, w, h] = values;
  const factor = METERS_PER_UNIT[unit];
  const perItemCbm = (l * factor) * (w * factor) * (h * factor);
  const cbm = perItemCbm * qty;
  const cft = cbm * CUBIC_FEET_PER_CUBIC_METER;
  if (!Number.isFinite(cbm) || cbm > 1e12) {
    return { ok: false, error: 'The volume is too large to calculate.' };
  }
  return { ok: true, perItemCbm, cbm, cft, quantity: qty };
}

function formatVolume(value, maximumFractionDigits = 4) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

function formatCopyText(input, result) {
  if (!result || !result.ok) return '';
  const unit = input.unit;
  return [
    'Freight CBM — Volume Calculation',
    `Dimensions: ${input.length} × ${input.width} × ${input.height} ${unit}`,
    `Quantity: ${result.quantity} pcs`,
    `Total: ${formatVolume(result.cbm, 6)} CBM / ${formatVolume(result.cft, 4)} CFT`,
  ].join('\n');
}

module.exports = { calculateVolume, parsePositiveNumber, formatVolume, formatCopyText };
