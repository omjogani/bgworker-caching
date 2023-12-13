onmessage = function(e) {
    // calculate addresses
    const addresses = new Object();
    for(const employee of e.data) {
        const empAdd = employee.address;
        addresses[`${employee.id}`] = `${empAdd.street}, ${empAdd.suite}, ${empAdd.city}, ${empAdd.zipcode}`;
    }
    this.postMessage(addresses);
}