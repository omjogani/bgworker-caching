function loadEMPData() {
  console.log("Loading Data");
  // check cache
  const cachedDataFromLocalStorage = localStorage.getItem("employees");
  if (cachedDataFromLocalStorage) {
    console.log("data");
  } else {
    loadEMPDataFromAPI();
  }
}

async function loadEMPDataFromAPI() {
  const addressWorker = new Worker("address_bgworker.js");
  fetch(`https://jsonplaceholder.typicode.com/users`)
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        // addressWorker.postMessage(json);
    });
}

function cacheData(key, value, isJson) {
  localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
}
