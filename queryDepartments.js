// const { connection, promptDepartments } = require("./server");
// //query all departments
// function queryDepartments() {
//   const query = `SELECT department.name FROM department;`;
//   connection.query(query, (err, res) => {
//     if (err)
//       throw err;
//     //extract department names to array
//     const departments = [];
//     for (let i = 0; i < res.length; i++) {
//       departments.push(res[i].name);
//     }
//     //prompt for department selection
//     promptDepartments(departments);
//   });
// }
// exports.queryDepartments = queryDepartments;
