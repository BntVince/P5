fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json', 
      'Content-Type': 'application/json'
    },
    body: sessionStorage.command
  })
  .then(function (rep) {
    if (rep.ok) {
        return rep.json();
    }
  })
.then(function (res) {
    document.getElementById('orderId').innerText = res.orderId
    sessionStorage.removeItem('command')
  })