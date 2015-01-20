angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $ionicLoading) {
  var onSuccess = function(position) {
    localStorage.setItem("latitude_coord", position.coords.latitude);
    localStorage.setItem("longitude_coord", position.coords.longitude);
  };

  function onError(error) {
    //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
  }

  function getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 10000, enableHighAccuracy: true});
    }
  }

  function showPosition(position){
    latitude_coord = position.coords.latitude;
    longitude_coord = position.coords.longitude;
  }

  $(function (){
    getLocation();
    $(document).on("click", "a.load-spin", function(e){
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
    });
  });
})

.controller('SettingsCtrl', function($scope, $timeout, $ionicLoading) {
  
  $(function (){
  
    $(document).on("click", "a.load-spin", function(e){
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
    });

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
        $ionicLoading.show({
          content: 'Loading...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 0
        });
        localStorage.setItem("route_fuel_kind", document.getElementById('fuel').value);
        localStorage.setItem("route_distance", document.getElementById('distance').value);
        $timeout(function () {
          $ionicLoading.hide();
          window.location.href = return_url;
        }, 3000);
      }
    });
  });
})

.controller('ContactCtrl', function($scope, $timeout, $ionicLoading) {
  var url = 'http://api.gobiernoabierto.gob.sv/informations/contacts';

  $(document).on("click", "a.load-spin", function(e){
    $ionicLoading.show({
      content: 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 500,
      showDelay: 0
    });
  });


  $(document).on("click", "#submit-form", function(e){
    $("#contact_message").validate({
      rules:{
        'contact_message[name]': { required: true },
        'contact_message[email]': { required: true, email: true },
        'contact_message[message]': { required: true },
      },

      messages: {
        'contact_message[name]': {required: "Por favor ingrese su nombre"},
        'contact_message[email]': {required: "Por favor ingrese su correo electronico", email: "Por favor ingrese una direccion valida"},
        'contact_message[message]': {required: "Por favor ingrese un comentario"},
      },

      errorPlacement: function(error, element){
        switch(element.attr('name')){
          default:
            element.attr('placeholder', error.text());
        }
      },

      submitHandler: function() {
        var myCallback = function(data) {
          $ionicLoading.hide();        
          if(data.response == "success"){
            $(".form-wrapper").html("<p class='denouncement-sent'>Comentario enviado exitosamente</p><div class='thanks-message'>¡Gracias, tu comentario ha sido enviado!</div>")
          }
          else{
            $(".form-wrapper").html("<p class='denouncement-sent'>El comentario no pudo ser enviado</p>") 
          }
        };
        $ionicLoading.show({
          content: 'Loading...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 0
        });

        $.ajax({
          type: 'GET',
          url: url,
          async: true,
          contentType: "application/json",
          dataType: 'jsonp',
          jsonp: 'callback',
          data: {
            "contact_message": {
              "name": $('#name').val(),
              "phone": $('#phone').val(),
              "email": $('#email').val(),
              "message": $('#message').val()
            }
          },
          success: function(data) {
            myCallback(data);
          },
        });
      }
    });
  });
})

.controller('VehicleDenouncementCtrl', function($scope, $timeout, $ionicLoading) {
  document.addEventListener("deviceready", onDeviceReady, false);
   
  function id(element) {
    return document.getElementById(element);
  }

  function onDeviceReady() {
    cameraApp = new cameraApp();
    cameraApp.run();
    var connectionInfo = new ConnectionApp();
    connectionInfo.run();
  }

  function cameraApp(){}

  cameraApp.prototype={
    _pictureSource: null,
    _destinationType: null,
    run: function(){
      var that=this;
      that._pictureSource = navigator.camera.PictureSourceType;
      that._destinationType = navigator.camera.DestinationType;
      id("getPhotoFromLibraryButton").addEventListener("click", function(){
        that._getPhotoFromLibrary.apply(that,arguments)
      });
    },
    
    _capturePhoto: function() {
      var that = this;  
      // Take picture using device camera and retrieve image as base64-encoded string.
      navigator.camera.getPicture(function(){
        that._onPhotoDataSuccess.apply(that,arguments);
      },function(){
        that._onFail.apply(that,arguments);
      },{
        quality: 50,
        destinationType: that._destinationType.DATA_URL
      });
    },
    
    _capturePhotoEdit: function() {
      var that = this;
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
      // The allowEdit property has no effect on Android devices.
      navigator.camera.getPicture(function(){
        that._onPhotoDataSuccess.apply(that,arguments);
      }, function(){
        that._onFail.apply(that,arguments);
      }, {
        quality: 20, allowEdit: true,
        destinationType: cameraApp._destinationType.DATA_URL
      });
    },
    
    _getPhotoFromLibrary: function() {
      var that= this;
      // On Android devices, pictureSource.PHOTOLIBRARY and
      // pictureSource.SAVEDPHOTOALBUM display the same photo album.
      that._getPhoto(that._pictureSource.PHOTOLIBRARY);
    },
    
    _getPhotoFromAlbum: function() {
      var that= this;
      // On Android devices, pictureSource.PHOTOLIBRARY and
      // pictureSource.SAVEDPHOTOALBUM display the same photo album.
      that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
      var that = this;
      // Retrieve image file location from specified source.
      navigator.camera.getPicture(function(){
          that._onPhotoDataSuccess.apply(that,arguments);
      }, function(){
          cameraApp._onFail.apply(that,arguments);
      }, {
          quality: 50,
          destinationType: cameraApp._destinationType.DATA_URL,
          sourceType: source
      });
      //alert("destinationType: "+destinationType);
      //alert("destinationType2: "+ navigator.camera.getPicture.destinationType);
    },
    
    _onPhotoDataSuccess: function(imageData) {
      var smallImage = document.getElementById('smallImage');
      //smallImage.style.display = 'block';
  
      // Show the captured photo.
      smallImage.src = "data:image/jpeg;base64," + imageData;
      localStorage.setItem("denouncement_image", smallImage.src);
    },
    
    _onPhotoURISuccess: function(imageURI) {
      var smallImage = document.getElementById('smallImage');
      //smallImage.style.display = 'block';
      
      // Show the captured photo.
      smallImage.src = imageURI;

      //alert("imageURI: "+imageURI);
      //alert("smallImage.src: "+ smallImage.src);
      localStorage.setItem("denouncement_image", smallImage.src);
      //var imgURL = window.resolveLocalFileSystemURI(smallImage.src, gotFileEntry, fail); 
      //alert("imgURL: "+imgURL);
    },
    
    _onFail: function(message) {
      alert(message);
    },
  }
  function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
  }

  function gotFile(file){
    readDataUrl(file);
    //readAsText(file);
  }

  function readDataUrl(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        alert("Read as data URL");
        console.log(evt.target.result);
    };
    alert("DATA_URL: "+reader.readAsDataURL(file));
    reader.readAsDataURL(file);
  }
  function fail(evt) {
    alert(evt.target.error.code);
  }

  function ConnectionApp() {}
  ConnectionApp.prototype = {
    run: function() {
      var that = this,
      buttonCheckConnection = document.getElementById("buttonCheckConnection");
      buttonCheckConnection.addEventListener("click",
      function() {
        that._checkConnection.apply(that, arguments)
      }, false);
      that._checkConnection();
    },

    _checkConnection: function() {
      var that = this;
      networkState = navigator.connection.type;
     
      if(networkState == "none"){
        document.getElementById("content").style.display = 'none';
        document.getElementById("internet-connection").style.display = 'block';
      }
      else{
        document.getElementById("content").style.display = 'block';
        document.getElementById("internet-connection").style.display = 'none'; 
      }
    },      
  }

  $(document).on("click", "a.load-spin", function(e){
    $ionicLoading.show({
      content: 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 500,
      showDelay: 0
    });
  });


  $(document).on("click", "#getPhotoFromLibraryButton", function(e){
    e.stopPropagation();
    e.preventDefault();
  });

  function onLoad(){
    $ionicLoading.hide();
    window.localStorage.clear("denouncement_image");
    //alert("AFTER INICIO: "+ localStorage.getItem("denouncement_image"));

    $('#denouncement_plate').keyup(function(){ 
      this.value = this.value.replace(/[^0-9\.]/g,'');
    });
    $('#denouncement_plate').attr("maxlength", "7");


    $('#denouncement_complaint_date').datetimepicker({
      maxDate:'+1970/01/02'//tommorow is maximum date calendar
    });
  }

  $(document).on("click", "#submit-form", function(e){

    $("#service-vehicle").validate({
      rules:{
        'denouncement[plate]': { required: true },
        'denouncement[place]': { required: true },
        'denouncement[complaint_date]': { required: true },
        'denouncement[comment]': { required: true },
      },

      messages: {
        'denouncement[plate]': {required: "Ingrese la placa del automotor"},
        'denouncement[place]': {required: "Ingrese el lugar del incidente"},
        'denouncement[complaint_date]': {required: "Ingrese la fecha del incidente"},
        'denouncement[comment]': {required: "Ingrese un comentario"},
      },

      errorPlacement: function(error, element){
        switch(element.attr('name')){
          default:
            element.attr('placeholder', error.text());
        }
      },

      submitHandler: function() {
        var win = function (r) {
          $ionicLoading.hide();
          $(".form-wrapper").html("<p class='denouncement-sent'>Denuncia completa</p><img class='confirm' src='img/icons/bg-confirm-email.jpg'><div class='thanks-message'>Gracias por hacer valer tu derecho, te recordamos que esta denuncia es completamente an&oacute;nima.</div><a class='btn-denounce' href='vehicle_denouncement.html'>Hacer otra denuncia</a>")
        }

        var fail = function (error) {
          $ionicLoading.hide();
          $(".form-wrapper").html("<p class='denouncement-sent'>La denuncia no pudo ser enviada</p>") 
        }

        var myCallback = function(data) {
          $ionicLoading.hide();
          if(data.response == "success"){
            $(".form-wrapper").html("<p class='denouncement-sent'>Denuncia completa</p><img class='confirm' src='img/icons/bg-confirm-email.jpg'><div class='thanks-message'>Gracias por hacer valer tu derecho, te recordamos que esta denuncia es completamente an&oacute;nima.</div><a class='btn-denounce' href='vehicle_denouncement.html'>Hacer otra denuncia</a>")
          }
          else{
            $(".form-wrapper").html("<p class='denouncement-sent'>La denuncia no pudo ser enviada</p>") 
          }
        }

        if(localStorage.getItem("denouncement_image")!=null){
          $ionicLoading.show({
            content: 'Loading...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 500,
            showDelay: 0
          });
          image_URI = document.getElementById("smallImage");
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName="denouncement-"+Date.now();
          options.mimeType="image/jpeg";
          var params = new Object();

          params.plate = $('#denouncement_plate').val();
          params.place = $('#denouncement_place').val();
          params.complaint_date = $('#denouncement_complaint_date').val();
          params.comment = $('#denouncement_comment').val();
          options.params = params;

          options.chunkedMode = false;
          var ft = new FileTransfer();
          ft.upload(image_URI.src, "http://api.gobiernoabierto.gob.sv/denouncements/vehicles", win, fail, options); 

        }
        else{
          $.ajax({
            type: 'GET',
            url: "http://api.gobiernoabierto.gob.sv/denouncements/vehicles",
            contentType: "application/json",
            beforeSend: function (request) {
              $ionicLoading.show({
                content: 'Loading...',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
              });
              return true;
            },
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
              "plate": $('#denouncement_plate').val(),
              "place": $('#denouncement_place').val(),
              "complaint_date": $('#denouncement_complaint_date').val(),
              "comment": $('#denouncement_comment').val(),
            },
            success: function(data) {
              myCallback(data);
            },
            error: function (){
              $ionicLoading.hide();
              $(".form-wrapper").html("<p class='denouncement-sent'>La denuncia no pudo ser enviada</p>") 
            }
          });
        }

      }
    });

    $(".test").addClass("has-header2");
  });

  window.localStorage.clear("denouncement_image");
  //alert("AFTER INICIO: "+ localStorage.getItem("denouncement_image"));

  $('#denouncement_plate').keyup(function(){ 
    this.value = this.value.replace(/[^0-9\.]/g,'');
  });
  $('#denouncement_plate').attr("maxlength", "7");


  $('#denouncement_complaint_date').datetimepicker({
    maxDate:'+1970/01/02'//tommorow is maximum date calendar
  });
})

.controller('InfoRequestCtrl', function($scope, $timeout, $ionicLoading) {

  $(function (){

  document.addEventListener("deviceready", onDeviceReady, false);
   
  function id(element) {
    return document.getElementById(element);
  }

  function onDeviceReady() {
    cameraApp = new cameraApp();
    cameraApp.run();
    var connectionInfo = new ConnectionApp();
    connectionInfo.run();
  }

  function cameraApp(){}

  cameraApp.prototype={
    _pictureSource: null,
    _destinationType: null,
    run: function(){
      var that=this;
      that._pictureSource = navigator.camera.PictureSourceType;
      that._destinationType = navigator.camera.DestinationType;
      id("getPhotoFromLibraryButton").addEventListener("click", function(){
        that._getPhotoFromLibrary.apply(that,arguments)
      });
    },
    
    _capturePhoto: function() {
      var that = this;  
      // Take picture using device camera and retrieve image as base64-encoded string.
      navigator.camera.getPicture(function(){
        that._onPhotoDataSuccess.apply(that,arguments);
      },function(){
        that._onFail.apply(that,arguments);
      },{
        quality: 50,
        destinationType: that._destinationType.DATA_URL
      });
    },
    
    _capturePhotoEdit: function() {
      var that = this;
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
      // The allowEdit property has no effect on Android devices.
      navigator.camera.getPicture(function(){
        that._onPhotoDataSuccess.apply(that,arguments);
      }, function(){
        that._onFail.apply(that,arguments);
      }, {
        quality: 20, allowEdit: true,
        destinationType: cameraApp._destinationType.DATA_URL
      });
    },
    
    _getPhotoFromLibrary: function() {
      var that= this;
      // On Android devices, pictureSource.PHOTOLIBRARY and
      // pictureSource.SAVEDPHOTOALBUM display the same photo album.
      that._getPhoto(that._pictureSource.PHOTOLIBRARY);
    },
    
    _getPhotoFromAlbum: function() {
      var that= this;
      // On Android devices, pictureSource.PHOTOLIBRARY and
      // pictureSource.SAVEDPHOTOALBUM display the same photo album.
      that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
      var that = this;
      // Retrieve image file location from specified source.
      navigator.camera.getPicture(function(){
          that._onPhotoDataSuccess.apply(that,arguments);
      }, function(){
          cameraApp._onFail.apply(that,arguments);
      }, {
          quality: 50,
          destinationType: cameraApp._destinationType.DATA_URL,
          sourceType: source
      });
      //alert("destinationType: "+destinationType);
      //alert("destinationType2: "+ navigator.camera.getPicture.destinationType);
    },
    
    _onPhotoDataSuccess: function(imageData) {
      var smallImage = document.getElementById('smallImage');
      //smallImage.style.display = 'block';
  
      // Show the captured photo.
      smallImage.src = "data:image/jpeg;base64," + imageData;
      localStorage.setItem("denouncement_image", smallImage.src);
    },
    
    _onPhotoURISuccess: function(imageURI) {
      var smallImage = document.getElementById('smallImage');
      //smallImage.style.display = 'block';
      
      // Show the captured photo.
      smallImage.src = imageURI;

      //alert("imageURI: "+imageURI);
      //alert("smallImage.src: "+ smallImage.src);
      localStorage.setItem("denouncement_image", smallImage.src);
      //var imgURL = window.resolveLocalFileSystemURI(smallImage.src, gotFileEntry, fail); 
      //alert("imgURL: "+imgURL);
    },
    
    _onFail: function(message) {
      alert("No se pudo adjuntar la imagen");
    },
  }
  function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
  }

  function gotFile(file){
    readDataUrl(file);
    //readAsText(file);
  }

  function readDataUrl(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        alert("Read as data URL");
        console.log(evt.target.result);
    };
    alert("DATA_URL: "+reader.readAsDataURL(file));
    reader.readAsDataURL(file);
  }
  function fail(evt) {
    alert(evt.target.error.code);
  }

  function ConnectionApp() {}
  ConnectionApp.prototype = {
    run: function() {
      var that = this,
      buttonCheckConnection = document.getElementById("buttonCheckConnection");
      buttonCheckConnection.addEventListener("click",
      function() {
        that._checkConnection.apply(that, arguments)
      }, false);
      that._checkConnection();
    },

    _checkConnection: function() {
      var that = this;
      networkState = navigator.connection.type;
     
      if(networkState == "none"){
        document.getElementById("content").style.display = 'none';
        document.getElementById("internet-connection").style.display = 'block';
      }
      else{
        document.getElementById("content").style.display = 'block';
        document.getElementById("internet-connection").style.display = 'none'; 
      }
    },      
  }
    $(document).on("click", "a.load-spin", function(e){
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
    });

    
    $("a.terms-conditions").nivoLightbox();

    $ionicLoading.hide();
    //$('select').selectpicker({});
    var stateCallback = function(data) {
      var keys = Object.keys(data);
      $("select#city_id").html("<option value=''>--Por favor seleccione--</option>")
      for (var i = 0; i < keys.length; i++) {
        $("select#city_id").append("<option value='"+keys[i]+"'>"+data[keys[i]]+"</option>")
      };        
      //$("select#city_id").selectpicker('refresh');
      $ionicLoading.hide();
    };

    $("select#state_id").change(function(){
      var states = document.getElementById("state_id");
      var state = states.options[states.selectedIndex].value;
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
      $.ajax({
        type: 'GET',
        url: "http://api.gobiernoabierto.gob.sv/dropdowns/"+state+"/state_cities",
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
          "state": {
            "id": $('select#firstname').val(),
          }
        },
        success: function(data) {
          stateCallback(data);
        },
      });
    });

    $(document).on("click", "#getPhotoFromLibraryButton", function(e){
      e.stopPropagation();
      e.preventDefault();
    });

    $('#information_request').stepy({
      duration: 400,
      legend: true,
      transition: 'fade',
      nextLabel: 'Siguiente',
      select: function(index){
        $("h2").html($("legend#s"+index).text())
      },
      validate: true,
      block: true,
      /*finish: function() {
        $("form#information_request").submit(function(){
        });
      }*/
    });
    var myCallback = function(data) {
      if(data.response == "success"){
        $("#content").html("<p class='denouncement-sent'>Confirme su correo electr&oacute;nico</p><img class='confirm' src='img/icons/bg-confirm-email.jpg'><div class='thanks-message'>Vaya al buzón de entrada de su correo electrónico <b>"+$('#email').val()+"</b> y haga click en el enlace que le hemos enviado.<br/>Tiene 5 días para confirmar su correo electrónico.<br/><b>No olvide revisar la bandeja de SPAM.</b>div>")
      }
      else{
        $(".form-wrapper").html("<p class='denouncement-sent'>La solicitud no pudo ser enviada</p>") 
      }
      $ionicLoading.hide();
    }

    var win = function (r) {
      $("#content").html("<p class='denouncement-sent'>Confirme su correo electr&oacute;nico</p><img class='confirm' src='img/icons/bg-confirm-email.jpg'><div class='thanks-message'>Vaya al buzón de entrada de su correo electrónico <b>"+$('#email').val()+"</b> y haga click en el enlace que le hemos enviado.<br/>Tiene 5 días para confirmar su correo electrónico.<br/><b>No olvide revisar la bandeja de SPAM.</b></div>")
      $ionicLoading.hide();
    }

    var fail = function (error) {
      $(".form-wrapper").html("<p class='denouncement-sent'>La solicitud no pudo ser enviada</p>")
      $ionicLoading.hide();
    }

    $("form#information_request").validate({
      rules: {
        document_type: {
          minlength: 10,
          document_number: {
            depends: function () {
              return $('#information_request select[name="information_request[document_type]"]').val() === 'dui';
            }
          }
        },
        terms: {
          required: true,
        },
        document_number: {
          minlength: 10,
        }
      },

      messages:{
        terms: "T&eacute;rminos y condiciones debe ser aceptado",
        'information_request[requested_information]': {required: "Ingrese la informaci&oacute;n a solicitar"},
        'information_request[firstname]': {required: "Ingrese su nombre"},
        'information_request[lastname]': {required: "Ingrese su apellido"},
        'information_request[address]': {required: "Ingrese su direcci&oacute;n"},
        'information_request[age]': {required: "Ingrese su edad"},
        'information_request[email]': {required: "Ingrese su correo electr&oacute;nico"},
        'information_request[requested_information]': {required: "Ingrese la informaci&oacute;n a solicitar"},
        'information_request[institution_id]': {required: "Seleccione una instituci&oacute;n"},
        'information_request[delivery_way]': {required: "Seleccione una forma de entrega"},
        'information_request[notification_mode]': {required: "Seleccione un m&eacute;todo de notificaci&oacute;n"},
        'information_request[entity_type]': {required: "Seleccione el tipo de persona"},
        'information_request[gender]': {required: "Seleccione el g&eacute;nero"},
        'information_request[nationality]': {required: "Seleccione su nacionalidad"},
        'information_request[residence]': {required: "Seleccione el tipo de residencia"},
        'information_request[occupation_id]': {required: "Seleccione su ocupaci&oacute;n"},
        'information_request[education_level]': {required: "Seleccione su nivel educativo"},
        'information_request[document_type]': {required: "Seleccione el tipo de documento"},
      },

      errorPlacement: function(error, element){
        switch(element.attr('name')){
          case 'information_request[delivery_way]':
          case'information_request[notification_mode]':
          case'information_request[entity_type]':
          case'information_request[gender]':
          case'information_request[nationality]':
          case'information_request[residence]':
          case'information_request[occupation_id]':
          case'information_request[education_level]': 
          case'information_request[document_type]':
          case'information_request[institution_id]':
            $(element).find('option:eq(0)').prop('text', error.text())
            
            break;
          case'information_request[terms]':
            element.closest('label').after(error);
            break;
          default:
            element.attr('placeholder', error.text());
        }
      },
      submitHandler: function(){
        url = 'http://api.gobiernoabierto.gob.sv/informations/requests'; //gobiernoabierto.gob.sv
        $ionicLoading.show({
          content: 'Loading...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 0
        });
        if(localStorage.getItem("denouncement_image")!=null){
          alert("con imagen");
          image_URI = document.getElementById("smallImage");
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName="info-request-"+Date.now();
          options.mimeType="image/jpeg";
          var params = new Object();

          params.requested_information = $('#requested_information').val(),
          params.entity_type = $('#entity_type').val(),
          params.institution_id = $('#institution_id').val(),
          params.delivery_way = $('#delivery_way').val(),
          params.notification_mode = $('#notification_mode').val(),
          params.firstname = $('#firstname').val(),
          params.lastname = $('#lastname').val(),
          params.age = $('#age').val(),
          params.gender = $('#gender').val(),
          params.nationality = $('#nationality').val(),
          params.email = $('#email').val(),
          params.phone = $('#phone').val(),
          params.cellular = $('#cellular').val(),
          params.fax = $('#fax').val(),
          params.address = $('#address').val(),
          params.state_id = $('#state_id').val(),
          params.city_id = $('#city_id').val(),
          params.occupation_id = $('#occupation_id').val(),
          params.educational_level = $('#educational_level').val(),
          params.document_type = $('#document_type').val(),
          params.document_number = $('#document_number').val(),

          options.params = params;
          //alert(JSON.stringify(params, null, 4));
          options.chunkedMode = false;
          var ft = new FileTransfer();
          ft.upload(image_URI.src, url, win, fail, options); 

        }
        else{
          alert("sin imagen")
          $.ajax({
            type: 'GET',
            url: url,
            async: false,
            contentType: "application/json",
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
              "requested_information": $('#requested_information').val(),
              "entity_type": $('#entity_type').val(),
              "institution_id": $('#institution_id').val(),
              "delivery_way": $('#delivery_way').val(),
              "notification_mode": $('#notification_mode').val(),
              "firstname": $('#firstname').val(),
              "lastname": $('#lastname').val(),
              "age": $('#age').val(),
              "gender": $('#gender').val(),
              "nationality": $('#nationality').val(),
              "email": $('#email').val(),
              "phone": $('#phone').val(),
              "cellular": $('#cellular').val(),
              "fax": $('#fax').val(),
              "address": $('#address').val(),
              "state_id": $('#state_id').val(),
              "city_id": $('#city_id').val(),
              "occupation_id": $('#occupation_id').val(),
              "educational_level": $('#educational_level').val(),
              "document_type": $('#document_type').val(),
              "document_number": $('#document_number').val(),
              "terms": $('#terms').val(),
            },
            success: function(data) {
              myCallback(data);
            }
          });
        }
      }  
    });
  });
})

.controller('StationListCtrl', function($scope, $timeout, $ionicLoading) {
  $(function (){

    $(document).on("click", "a.load-spin", function(e){
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
    });
    
    var myCallback = function(data) {
      var zones = new Object();
      zones[2] = 'Central';
      zones[3] = 'Oriental';
      zones[1] = 'Occidental';

      var products = new Object();
      products['GR'] = 'Regular';
      products['GS'] = 'Especial';
      products['DO'] = 'Diesel';

      if(data.establishments){
        if(data.prices_references){
          $("div#route-container").append("<div class='reference'>Precios de referencia:</div>");
          $("div#references_prices").append("<div class='mreference'>Precios de referencia vigentes:<br/><div class='mreference_date'> "+data.prices_references[0].start_at+" - "+data.prices_references[0].end_at+" /"+ new Date().getFullYear()+ "</div><table class='mreference_prices'><tr><th>&nbsp;</th><th>Regular</th><th>Especial</th><th>Diesel</th></tr></table></div>")
          for(var k in zones){
            $("table.mreference_prices").append("<tr class='mrp-item-"+k+"'><td>"+zones[k]+"</td>");
            if(zones.hasOwnProperty(k) && data.prices_references[0].hydro_zone_id == k){
              $("div.reference").append("<div class='main-item'>Zona "+zones[k]+", </div>");
            }
            for(var v in products){
              if(products.hasOwnProperty(v)){
                $.grep(data.prices_references, function (prices) { 
                  if(prices.hydro_zone_id == k && prices.product_code == v){
                    $("tr.mrp-item-"+k+"").append("<td>$"+prices.price+"</td>");
                    if(k == data.prices_references[0].hydro_zone_id && prices.product_code == localStorage.getItem("route_fuel_kind")){
                      $("div.main-item").append("<label>Gasolina "+products[v]+": $"+prices.price+"</label>");
                    }
                  }
                });
              }
            }
          }
        }
        $("div.reference").append("<a class='prices-list' href='#references_prices' data-lightbox-type='inline'>Ver listado completo</a>");
        $("div.reference").append("<div class='reference_comparission'><div><img src='img/icons/mini-arrow-down.png'><label> M&aacute;s bajo que el precio de referencia</label></div><div><img src='img/icons/mini-arrow-up.png'><label>M&aacute;s caro que el precio de referencia</label></div></div></div><div class='clear'>");
        $("a.prices-list").nivoLightbox(); 

        for(var i=0;i<data.establishments.length;i++){

          $("div#route-container").append("<div class='gas-station' id='gas-station-item"+i+"'></div>")
          var obj = data.establishments[i];
          for(var key in obj){
            var attrName = key;
            var attrValue = obj[key];
            switch(attrName){
              case "id":
                var eid = attrValue
              break;              
              case "name":
                var ename = new String(attrValue)
              break;
              case "address":
                var eaddress = new String(attrValue)
              break;
              case "latitude":
                var elatitude = attrValue
              break;
              case "longitude":
                var elongitude = attrValue
              break;
              case "reference_fservice":
                var ereference_fservice = attrValue
              break;
              case "price_full_service":
                var eprice_full_service = attrValue
              break;
              case "price_autoservice":
                var eprice_autoservice = attrValue
              break;
              case "brand":
                var ebrand = attrValue
              break;
            }
          }
          $("div#gas-station-item"+i).append("<div class='gas-station-icon'><img src='img/icons/"+ebrand+".png'/></div><div class='gas-station-info'><label>"+ename+"</label><table><tr><th>Serv. Completo</th><th>Autoservicio</th></tr><tr><td id='fs-"+i+"'>$"+eprice_full_service+"<script>set_icon_reference("+ereference_fservice+","+eprice_full_service+",'fs-"+i+"');</script></td><td id='as-"+i+"'>$"+eprice_autoservice+"<script>set_icon_reference("+ereference_fservice+","+eprice_autoservice+",'as-"+i+"');</script></td></tr></table></div><div class='gas-check-map'><a onclick='event.preventDefault();event.stopPropagation();save_parameters("+eid+","+ebrand+","+eprice_full_service+","+eprice_autoservice+","+ereference_fservice+","+elatitude+","+elongitude+");' href='#' class='spin-to-win'><img src='img/icons/arrow-right.png' /><label>mapa</label></a></div><div class='clear'></div>");
        }
      }
      else{
        $("div#route-container").append("<p>No se pudo obtener la informaci&oacute;n de las estaciones de servicio.</p>")
      }
      $ionicLoading.hide();
    }
    if(localStorage.getItem("route_fuel_kind") && localStorage.getItem("route_distance")){
      $ionicLoading.show({
        content: 'Loading...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 500,
        showDelay: 0
      });
      $.ajax({
        type: 'GET',
        url: "http://api.gobiernoabierto.gob.sv/informations/coords", 
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        timeout: 5000,
        data: {
          "coordinates": {
            "latitude": localStorage.getItem("latitude_coord"),
            "longitude": localStorage.getItem("longitude_coord"),
            "distance": localStorage.getItem("route_distance"),
            "fuel_type": localStorage.getItem("route_fuel_kind")
          }
        },
        jsonp: 'callback',
        success: function(data) {
          myCallback(data);
        },
        error: function (parsedjson, textStatus, errorThrown){
          $("div#route-container").html("<p>No se pudo obtener la informaci&oacute;n de las estaciones de servicio.</p>")
        }
      })
    }
    else{
      window.location.href = "configuration.html?reference=config";
    }
  });
})

.controller('StationDetailCtrl', function($scope, $timeout, $ionicLoading) {

  $(document).on("click", "a.load-spin", function(e){
    $ionicLoading.show({
      content: 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 500,
      showDelay: 0
    });
  });

  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
  }
  mlatitude = parseFloat(getURLParameter('latitude'));
  mlongitude = parseFloat(getURLParameter('longitude'));


  $scope.positions = {
    lat: mlatitude,
    lng: mlongitude,
    zoom: 17
  };

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });


  $(function (){
    var myCallback = function(data) {
      if(data.response == "success"){
        $("div.gas-station").append("<div class='gas-station-icon'><img src='img/icons/"+localStorage.getItem('rbrand')+".png'/></div><div class='gas-station-info'><label>"+data.e_name+"</label><p>"+data.e_address+"</p><table><tr><th>Serv. Completo</th><th>Autoservicio</th><th></th></tr><tr><td id='fullservice-column'>$"+localStorage.getItem('rfull_service')+"</td><td id='autoservice-column'>$"+localStorage.getItem('rautoservice')+"</td></tr></table></div><div class='gas-check-map shareApp'><a href='#'><img src='img/icons/icon-share.png' /></a></div><div class='clear'></div>");
        $("head").append("<link rel='stylesheet' href='css/arthref.min.css' />");
        $("head").append("");   
        $('.shareApp').socialShare({
          social: 'facebook,twitter,waze',
          title: "Consulta las gasolineras con los precios de combustibles mas baratos en @GobAbiertoSV #RutaDelAhorro",
          shareUrl: "http://infoutil.gobiernoabierto.gob.sv/",
          description: "¡Más información pública, transparencia y participación!",
          latitude: data.e_latitude,
          longitude: data.e_longitude 
        }); 
      }
      else{
        //
      }
    };

    $.ajax({
      type: 'GET',
      //url: "http://api.localhost.com:3000/informations/"+localStorage.getItem('rid')+"/gas_establishments",
      url: "http://api.gobiernoabierto.gob.sv/informations/"+localStorage.getItem('rid')+"/gas_establishments",
      async: false,
      contentType: "application/json",
      dataType: 'jsonp',
      data: {
        "informations": {
          "id": localStorage.getItem('rid'),
        }
      },
      jsonp: 'callback',
      success: function(data) {
        myCallback(data);
      },
    });

  });
});