import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const api_host = `${__ENV.API_HOST}/api`;

export const options = {
    stages: [
        { duration: '5m', target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
        //{ duration: '30m', target: 100 }, // stay at 100 users for 30 minutes
        { duration: '1m', target: 50 }, // ramp-down to 50 users
    ]
}

export function setup() {
    // add some data
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    for (let i = 0; i < 20; i++) {
        const res = http.post(api_host, JSON.stringify({title: uuidv4()}), params);
        check(res, {'item added': (r) => r.status === 201});
    }
}

export default function () {
    http.get(api_host);
}