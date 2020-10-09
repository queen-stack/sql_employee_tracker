const { connection } = require("./server");
//  View the Total Budget By Department
function viewTotalBudgetByDepartment() {
  const query = `select d.name "Department", SUM(r.salary) "BudgetUsed" 
  from role r
  JOIN department d 
  JOIN employee e 
  where r.id = e.role_id and r.id = d.id group by r.id;`;
  connection.query(query, (err, res) => {
    if (err)
      throw err;
    //build table data array from query result
    const tableData = [];
    for (let i = 0; i < res.length; i++) {
      tableData.push({
        "Department": res[i].Department,
        "Budget Used": res[i].BudgetUsed
      });
    }
    renderScreen(`Total Budget per Department`, tableData);
  });
}
exports.viewTotalBudgetByDepartment = viewTotalBudgetByDepartment;
