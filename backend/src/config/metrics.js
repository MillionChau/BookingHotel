const client = require('prom-client');

// Tạo registry
const register = new client.Registry();

// Thêm metrics mặc định
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

const databaseCallDuration = new client.Histogram({
  name: 'db_call_duration_ms',
  help: 'Duration of database calls in ms',
  labelNames: ['operation', 'collection'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500]
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(databaseCallDuration);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  databaseCallDuration
};