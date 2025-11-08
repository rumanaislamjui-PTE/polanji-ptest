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

  const res = http.get(`${BASE_URL}/topics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}

