$(document).on("click", "a.item-picture", function(e){
  $(this).closest('div').css("background", "#eee");
});

$(document).on("click", "a.toogle-menu", function(e){
  $("button").trigger("click");
});
