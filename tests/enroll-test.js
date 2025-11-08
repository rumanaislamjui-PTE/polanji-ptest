import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export let options = { vus: 1, iterations: 1 };

export default function () {
  const { token, userId } = login();

  const authHeader = { Authorization: `Bearer ${token}` };

  // --- Step 1: GET /courses (NO Content-Type on GET)
  const coursesRes = http.get(`${BASE_URL}/courses`, {
    headers: { ...authHeader, Accept: 'application/json' },
  });

  console.log('Courses GET status:', coursesRes.status);
  console.log('Courses GET body:', coursesRes.body);

  check(coursesRes, {
    'courses 200': (r) => r.status === 200,
  });

  if (coursesRes.status !== 200) {
    console.log('Stopping: could not fetch courses with auth.');
    return;
  }

  const courses = coursesRes.json();
  if (!Array.isArray(courses) || courses.length === 0) {
    console.log('No courses found.');
    return;
  }

  // pick first valid course
  const courseId = courses[0].id;

  // --- Step 2: POST /enroll (Content-Type: application/json)
  const enrollRes = http.post(
    `${BASE_URL}/enroll`,
    JSON.stringify({ user_id: userId, course_id: courseId }),
    { headers: { ...authHeader, 'Content-Type': 'application/json' } }
  );

  console.log('Enroll Response Status:', enrollRes.status);
  console.log('Enroll Response Body:', enrollRes.body);

  check(enrollRes, { 'enroll 200': (r) => r.status === 200 });

  sleep(1);
}

