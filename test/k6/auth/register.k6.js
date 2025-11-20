import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config.js';

export const options = {
  scenarios: {
    register_scenario: {
      executor: 'constant-vus',
      vus: 30,
      duration: '60s'
    }
  },
  thresholds: {
    'http_req_duration{name:register}': ['p(95)<200'],
    checks: ['rate>0.99']
  }
};

function uniqueEmail() {
  // Combine time, VU id and iteration to avoid collisions under load
  return `k6user_${Date.now()}_${__VU}_${__ITER}@example.com`;
}

export default function () {
  const url = `${BASE_URL}/api/v1/auth/register`;
  const payload = JSON.stringify({
    name: 'Usuario K6',
    email: uniqueEmail(),
    password: 'SenhaForte123',
    passwordConfirmation: 'SenhaForte123'
  });

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post(url, payload, { headers, tags: { name: 'register' } });

  // Validate functional expectations lightly while focusing on performance
  const ok = check(res, {
    'status 201': (r) => r.status === 201,
    'message de sucesso': (r) => {
      try {
        const body = r.json();
        return body && body.message === 'Usuário cadastrado com sucesso.';
      } catch (_) {
        return false;
      }
    }
  });

  // Small pacing to avoid unrealistic tight loops; not required
  if (!ok) {
    // Optional: brief sleep to reduce error storm
    sleep(0.1);
  } else {
    sleep(0.05);
  }
}
