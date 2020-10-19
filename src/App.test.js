import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { isObj, isEmptyObj } from '../src/utils/is'
import Fetch from '../src/utils/fetch'

// interface
test('renders Starting location', () => {
  const { getByLabelText } = render(<App />);
  const el = getByLabelText(/starting location/i);
  expect(el).toBeInTheDocument();
});

test('renders Drop-off point', () => {
  const { getByLabelText } = render(<App />);
  const el = getByLabelText(/Drop-off point/i);
  expect(el).toBeInTheDocument();
});

// is
test("test is util isObj", () => {
  expect(isObj({})).toBe(true);
  expect(isObj([])).toBe(false);
  expect(isObj(undefined)).toBe(false);
  expect(isObj(1)).toBe(false);
  expect(isObj('1')).toBe(false);
  expect(isObj(false)).toBe(false);
});

test("test is util isEmptyObj", () => {
  expect(isEmptyObj({})).toBe(true);
  expect(isEmptyObj({ a: 1 })).toBe(false);
  expect(isEmptyObj([])).toBe(false);
  expect(isEmptyObj(1)).toBe(false);
  expect(isEmptyObj('1')).toBe(false);
  expect(isEmptyObj(false)).toBe(false);
});

// fetch
test("test POST /mock/route/500", async () => {
  try {
    await Fetch('https://mock-api.dev.lalamove.com/mock/route/500', {
      method: 'POST'
    })
  } catch (e) {
    expect(e).toBe('Internal Server Error');
  }
});

test("test POST /mock/route/success", async () => {
  const res = await Fetch('https://mock-api.dev.lalamove.com/mock/route/success', {
    method: 'POST'
  })
  expect(res.token).toBe("9d3503e0-7236-4e47-a62f-8b01b5646c16");
});

test("test GET /mock/route/500", async () => {
  try {
    await Fetch('https://mock-api.dev.lalamove.com/mock/route/500')
  } catch (e) {
    expect(e).toBe('Internal Server Error');
  }
});

test("test GET /mock/route/success", async () => {
  const res = await Fetch('https://mock-api.dev.lalamove.com/mock/route/success')
  expect(res.path).toStrictEqual([
    ["22.372081", "114.107877"],
    ["22.326442", "114.167811"],
    ["22.284419", "114.159510"]
  ]);
  expect(res.total_distance).toBe(20000);
  expect(res.total_time).toBe(1800);
});

test("test GET /mock/route/inprogress", async () => {
  try {
    await Fetch('https://mock-api.dev.lalamove.com/mock/route/inprogress')
  } catch (e) {
    expect(e).toBe('request time out');
  }
});

test("test GET /mock/route/failure", async () => {
  try {
    await Fetch('https://mock-api.dev.lalamove.com/mock/route/failure')
  } catch (e) {
    expect(e).toBe('Location not accessible by car');
  }
});


