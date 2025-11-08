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
    'Content-Type': 'application/json',
  };

  // Step 1: Get courses
  const coursesRes = http.get(`${BASE_URL}/courses`, { headers });
  check(coursesRes, { 'courses 200': (r) => r.status === 200 });
  const courses = coursesRes.json();
  const courseId = courses[0].id;

  // Step 2: Reset progress to 0 (Ensures test is repeatable)
  http.put(
    `${BASE_URL}/courses/update_progress`,
    JSON.stringify({
      user_id: userId,
      course_id: courseId,
      progress: 0,
    }),
    { headers }
  );

  // Step 3: Increment progress like a real learner
  const progressSteps = [10, 30, 50, 75, 100];

  progressSteps.forEach((progress) => {
    const payload = JSON.stringify({
      user_id: userId,
      course_id: courseId,
      progress: progress,
    });

    const res = http.put(`${BASE_URL}/courses/update_progress`, payload, { headers });

    console.log(`Progress Updated To ${progress}% --> Status: ${res.status}`);
    console.log(`Response: ${res.body}`);

    check(res, {
      [`progress updated to ${progress}%`]: (r) => r.status === 200,
    });

    sleep(1);
  });
}

