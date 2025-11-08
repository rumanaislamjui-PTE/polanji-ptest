import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export let options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  const { token, userId } = login();

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Step 1: Get Courses
  const courses = http.get(`${BASE_URL}/courses`, { headers }).json();
  const courseId = courses[0].id;

  // Step 2: Get Course Sections
  const courseDetail = http.get(`${BASE_URL}/courses/${courseId}`, { headers }).json();
  const sectionIndex = 0; // Testing first section's quiz

  // Step 3: POST quiz complete
  const res = http.post(
    `${BASE_URL}/courses/${courseId}/sections/${sectionIndex}/quiz-complete`,
    JSON.stringify({ user_id: userId }),
    { headers }
  );

  console.log(`Quiz Complete Status: ${res.status}`);
  console.log(`Response: ${res.body}`);

  check(res, {
    'quiz completed (200)': (r) => r.status === 200,
  });

  sleep(1);
}

