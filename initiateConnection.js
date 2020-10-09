const { connection, startApp } = require("./server");
function initiateConnection() {
  connection.connect(function (err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
    startApp();
  });
}
exports.initiateConnection = initiateConnection;
