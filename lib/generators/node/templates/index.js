<% if (coverage) { %>
module.exports = process.env.RUN_COVERAGE
  ? require('./lib-cov/index')
  : require('./lib/index');
<% } else { %>
module.exports = require('./lib/index');
<% } %>
