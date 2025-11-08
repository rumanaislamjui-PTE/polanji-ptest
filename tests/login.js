import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, USERNAME, PASSWORD } from './utils/config.js';

export function login() {
  const payload = `username=${USERNAME}&password=${PASSWORD}`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const res = http.post(`${BASE_URL}/log_in`, payload, { headers });

  console.log("Login Status:", res.status);
  console.log("Login Response Body:", res.body);

  check(res, { 'login successful': (r) => r.status === 200 });

  const token = res.json('access_token');
  const userId = res.json('user').id;

  console.log("Extracted token:", token);
  console.log("Extracted userId:", userId);

  return { token, userId };
}

