// let total = 0;

// function addExpense() {
//   const descInput = document.getElementById("desc");
//   const amountInput = document.getElementById("amount");

//   const desc = descInput.value.trim();
//   const amount = parseFloat(amountInput.value);

//   if (!desc || isNaN(amount) || amount <= 0) {
//     alert("Please enter a valid description and amount.");
//     return;
//   }

//   const tableBody = document
//     .getElementById("expenseTable")
//     .getElementsByTagName("tbody")[0];

//   const newRow = tableBody.insertRow();

//   const descCell = newRow.insertCell(0);
//   const amountCell = newRow.insertCell(1);

//   descCell.textContent = desc;
//   amountCell.textContent = amount.toFixed(2);

//   total += amount;
//   document.getElementById("totalAmount").textContent = total.toFixed(2);

//   // Clear input fields
//   descInput.value = "";
//   amountInput.value = "";
// }


let total = 0;

function addExpense() {
  const dateInput = document.getElementById("date"); // NEW
  const descInput = document.getElementById("desc");
  const amountInput = document.getElementById("amount");

  const date = dateInput.value.trim(); // NEW
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // MODIFIED CONDITION
  if (!date || !desc || isNaN(amount) || amount <= 0) { 
    alert("Please enter a valid date, description, and amount.");
    return;
  }

  const tableBody = document
    .getElementById("expenseTable")
    .getElementsByTagName("tbody")[0];

  const newRow = tableBody.insertRow();

  const dateCell = newRow.insertCell(0); // NEW CELL at index 0
  const descCell = newRow.insertCell(1);
  const amountCell = newRow.insertCell(2);

  dateCell.textContent = date; // Set date content
  descCell.textContent = desc;
  amountCell.textContent = amount.toFixed(2);

  total += amount;
  document.getElementById("totalAmount").textContent = total.toFixed(2);

  // Clear input fields
  dateInput.value = ""; // ADD DATE INPUT CLEAR
  descInput.value = "";
  amountInput.value = "";
}