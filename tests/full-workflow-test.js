import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export let options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  // LOGIN
  const { token, userId } = login();

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // GET COURSES
  const coursesRes = http.get(`${BASE_URL}/courses`, { headers });
  check(coursesRes, { 'courses 200': (r) => r.status === 200 });
  const courseId = coursesRes.json()[0].id;

  // ENROLL
  http.post(`${BASE_URL}/enroll`, JSON.stringify({ user_id: userId, course_id: courseId }), { headers });

  // UPDATE PROGRESS
  const progressSteps = [10, 30, 50, 75, 100];
  progressSteps.forEach((progress) => {
    http.put(
      `${BASE_URL}/courses/update_progress`,
      JSON.stringify({ user_id: userId, course_id: courseId, progress }),
      { headers }
    );
    sleep(1);
  });

  // FETCH SECTIONS
  const courseDetail = http.get(`${BASE_URL}/courses/${courseId}`, { headers }).json();
  const sectionIndex = 0;

  // QUIZ COMPLETE
  const quizRes = http.post(
    `${BASE_URL}/courses/${courseId}/sections/${sectionIndex}/quiz-complete`,
    JSON.stringify({ user_id: userId }),
    { headers }
  );

  check(quizRes, { 'quiz completed (200)': (r) => r.status === 200 });

  sleep(1);
}

