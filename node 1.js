
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


let employees = [];


function showMenu() {
  console.log("\n=== Employee Manager ===");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice.trim()) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        removeEmployee();
        break;
      case "4":
        console.log("Goodbye!");
        rl.close();
        break;
      default:
        console.log("Invalid choice, try again.");
        showMenu();
    }
  });
}


function addEmployee() {
  rl.question("Enter Employee ID: ", (id) => {
    if (employees.find((emp) => emp.id === id.trim())) {
      console.log("❌ Employee with this ID already exists.");
      return showMenu();
    }

    rl.question("Enter Employee Name: ", (name) => {
      employees.push({ id: id.trim(), name: name.trim() });
      console.log(`✅ Employee '${name}' added successfully!`);
      showMenu();
    });
  });
}


function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\n--- Employee List ---");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

function removeEmployee() {
  rl.question("Enter Employee ID to remove: ", (id) => {
    const index = employees.findIndex((emp) => emp.id === id.trim());

    if (index !== -1) {
      const removed = employees.splice(index, 1);
      console.log(`🗑️ Employee '${removed[0].name}' removed successfully!`);
    } else {
      console.log("❌ Employee not found.");
    }
    showMenu();
  });
}

// Start program
showMenu();
