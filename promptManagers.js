const inquirer = require("inquirer");
//manager prompt
function promptManagers(managers) {
  inquirer
    .prompt({
      type: "list",
      name: "promptChoice",
      message: "Select Manager:",
      choices: managers
    })
    .then(answer => {
      queryEmployeesByManager(answer.promptChoice);
    });
}
