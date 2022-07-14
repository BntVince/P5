function postJsonToAPI(jsonToPost) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jsonToPost
  })
    .then(function (rep) {
      if (rep.ok) {
        return rep.json();
      }
    })
    .then(function (resultat) {
      displayOrderId(resultat);
      deleteCommand('command');
    })
}

function displayOrderId(responseFromApi) {
  document.getElementById('orderId').innerText = responseFromApi.orderId
}

function deleteCommand(command) {
  sessionStorage.removeItem(command)
}

//-----------------------------------------------------------------------------//

postJsonToAPI(sessionStorage.command);