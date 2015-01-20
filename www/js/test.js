function initialize() {
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }
  mlatitude = parseFloat(getURLParameter('latitude'));
  mlongitude = parseFloat(getURLParameter('longitude'));
  if(mlatitude == null || mlongitude == null){
    window.location.href = "route-index.html";
  }
  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(mlatitude, mlongitude)
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var image = "img/icons/"+localStorage.getItem('rbrand')+".png";
  var myLatLng = new google.maps.LatLng(mlatitude, mlongitude);
  var beachMarker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image
  });
}
google.maps.event.addDomListener(window, 'load', initialize);


function set_icon_reference(reference, real_price, id){
  var reference = parseFloat(reference);
  var real_price = parseFloat(real_price);
  var icon;
  id = new String(id)
  if(real_price < reference && (real_price != 0 && reference != 0)){
    $("td#"+id).append("<img src='img/icons/arrow-down.png' />");
  }
  else if(real_price > reference && (real_price != 0 && reference != 0)){
    $("td#"+id).append("<img src='img/icons/arrow-up.png' />");
  }
  else{}
  return icon;
}


