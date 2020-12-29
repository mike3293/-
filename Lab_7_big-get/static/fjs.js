function start() {
    loadJSON();
    loadXML();
}

function loadJSON() {
    let result = document.getElementById('json');
    fetch('http://localhost:5000/json.json', {method: 'GET'})
        .then(response =>  response.json())
        .then(response => {
            result.innerText = JSON.stringify(response);
        });
}

function loadXML() {
    let result = document.getElementById('xml');
    fetch('http://localhost:5000/xml.xml', {method: 'GET'})
        .then(response => response.text())
        .then(response => {
            result.innerText = response;
        })
        .catch(err => console.log(err))
    ;
}
