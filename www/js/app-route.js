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

function save_parameters(id, brand, full_service, autoservice, reference_fservice, flatitude, flongitude){
  localStorage.setItem('rid', id);
  localStorage.setItem('rbrand', brand);
  localStorage.setItem('rbrand', brand);
  localStorage.setItem("rfull_service", full_service);
  localStorage.setItem("rautoservice", autoservice);
  localStorage.setItem("rreference_fservice", reference_fservice);
  window.location.href = "gas_station_detail.html?latitude="+flatitude+"?&longitude="+flongitude+"";
} 