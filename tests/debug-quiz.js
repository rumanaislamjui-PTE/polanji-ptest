import http from 'k6/http';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export default function () {
  const { token, userId } = login();

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch courses
  const courses = http.get(`${BASE_URL}/courses`, { headers }).json();
  const courseId = courses[0].id;

  // Fetch course details to find sections
  const courseDetail = http.get(`${BASE_URL}/courses/${courseId}`, { headers }).json();
  const sectionIndex = 0; // first section

  const res = http.post(
    `${BASE_URL}/courses/${courseId}/sections/${sectionIndex}/quiz-complete`,
    JSON.stringify({ user_id: userId }),
    { headers }
  );

  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);
}

