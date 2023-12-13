const remark = document.getElementById("status");
const table = document.getElementById("tbl");

function loadEMPData() {
  console.log("Loading Data");
  const cachedDataFromLocalStorage = localStorage.getItem("employees");
  if (cachedDataFromLocalStorage) {
    // CACHE DATA FOUND
    mapDataToTable(JSON.parse(cachedDataFromLocalStorage));
    remark.innerHTML = "LOADED FROM CACHES";
  } else {
    // FETCH REQUEST
    loadEMPDataFromAPI();
  }
}

async function loadEMPDataFromAPI() {
  const addressWorker = new Worker("address_bgworker.js");
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      mapDataToTable(json);
      cacheData("employees", json, true);
      addressWorker.postMessage(json);
    });
  addressWorker.onmessage = function (addresses) {
    cacheData("Addresses", JSON.stringify(addresses.data), false);
  };
}

function loadAddress(empId) {
  const cachedAddressFromLocalStorage = localStorage.getItem("Addresses");
  if (cachedAddressFromLocalStorage) {
    // CACHED ADDRESS FOUND
    remark.innerHTML = "ADDRESS FROM CACHE";
    table.rows[empId + 1].cells[4].innerHTML = JSON.parse(cachedAddressFromLocalStorage)[empId];
  } else {
    const cachedDataFromLocalStorage = localStorage.getItem("employees");
    const addressWorker = new Worker("address_bgworker.js");
    addressWorker.postMessage(JSON.parse(cachedDataFromLocalStorage));
    addressWorker.onmessage = function (addresses) {
      remark.innerHTML = "ADDRESS FROM BG WORKER";
      table.rows[empId + 1].cells[4].innerHTML = addresses.data[empId]; 
      cacheData("Addresses", JSON.stringify(addresses.data), false);
    };
  }
}

function mapDataToTable(data) {
  for (const emp of data) {
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    let id = row.insertCell(0);
    id.innerHTML = emp.id;
    let name = row.insertCell(1);
    name.innerHTML = emp.name;
    let username = row.insertCell(2);
    username.innerHTML = emp.username;
    let email = row.insertCell(3);
    email.innerHTML = emp.email;
    let button = row.insertCell(4);
    button.innerHTML = `<button onclick="loadAddress(${emp.id})" role="button">Address</button>`;
  }
}

function cacheData(key, value, isJson) {
  localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
}
