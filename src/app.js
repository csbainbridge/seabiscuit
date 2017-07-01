function loadCountry() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if ( this.readyState == 4 && this.status == 200 ) {
            var data = this.response
            console.log(JSON.parse(data))
            var json = JSON.parse(data)
            json.data.forEach(function(value) {
                document.getElementById('response').innerHTML = JSON.stringify(value)
            })
            
        }
    }
    xhttp.open(
        "GET",
        "http://localhost:8080/race",
        "true"
    )
    xhttp.send()    
}

var output = document.getElementById('output')
Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

document.getElementById('btn-today').addEventListener('click', function(event) {
    var date = new Date()
    output.innerHTML = date.yyyymmdd();
})

document.getElementById('country').addEventListener('click', function(event) {
    loadCountry()
})
