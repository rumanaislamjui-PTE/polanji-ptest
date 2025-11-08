import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export let options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  const token = login();

  const res = http.get(`${BASE_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'status 200 (courses)': (r) => r.status === 200,
    'returns course list': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });

  sleep(1);
}


