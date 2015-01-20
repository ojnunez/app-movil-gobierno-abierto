$(document).ready( function() {
      
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }

  params = getURLParameter('reference');
  if(params != null && params == "config"){
    return_url = "gas_station_list.html";
  }
  else{
    return_url = "index.html";
  }
  
  if(localStorage.getItem("route_fuel_kind")){
    var fuel = localStorage.getItem("route_fuel_kind");
    $("#fuel").val(fuel).attr('selected', true);
  }

  if(localStorage.getItem("route_distance")){
    var distance = localStorage.getItem("route_distance");
    $("#distance").val(distance).attr('selected', true);
  }

  $("#settings-form").validate({
    rules:{
      'route_fuel_kind': { required: true },
      'route_distance': { required: true }
    },
    messages: {
      'route_fuel_kind': {required: "Por favor ingrese el tipo de combustible"},
      'route_distance': {required: "Por favor ingrese la distancia a la redonda"}
    },
    submitHandler: function() {
      localStorage.setItem("route_fuel_kind", document.getElementById('fuel').value);
      localStorage.setItem("route_distance", document.getElementById('distance').value);
      window.location.href = return_url;
    }
  });
});