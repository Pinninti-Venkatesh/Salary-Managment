const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "salary_management",
  password: "postgres",
  port: 5432,
});

const query = (text, params) => {
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = { query };
