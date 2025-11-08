import http from 'k6/http';
import { login } from './login.js';
import { BASE_URL } from './utils/config.js';

export default function () {
  const { token, userId } = login();

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const courses = http.get(`${BASE_URL}/courses`, { headers }).json();
  const courseId = courses[0].id;

  const res = http.post(
    `${BASE_URL}/courses/update_progress`,
    JSON.stringify({
      user_id: userId,
      course_id: courseId,
      progress: 10
    }),
    { headers }
  );

  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);
}

