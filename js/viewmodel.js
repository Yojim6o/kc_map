'use strict';

//set map variable
var map;

//define map, center and zoom to KC, and call initMarkers
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.076268, lng: -94.590043},
      zoom: 13,
      mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.BOTTOM_CENTER
      }
  });
  initMarkers(places);
}

//create markers for each place in the model
function initMarkers(places) {
  for (var i = 0; i < places.length; i++) {
    places[i].holdMarker = new google.maps.Marker({
      position: new google.maps.LatLng(places[i].lat, places[i].long),
      title: places[i].name,
      map: map
    });

    var infowindow = new google.maps.InfoWindow();

    //if marker is clicked, display its info window
    google.maps.event.addListener(places[i].holdMarker, 'click', (function(place, i) {
      return function () {
        animateMarker(place, i);
        infowindow.setContent(places[i].name);
        infowindow.open(map,this);
      };
    })(places[i].holdMarker, i));

    //if nav tool is clicked, display info window above marker
    var searchNav = $('#spot' + i);
    searchNav.click((function(place, i) {
      return function() {
        animateMarker(place, i);
        infowindow.setContent(places[i].name);
        infowindow.open(map,place);
      };
    })(places[i].holdMarker, i));

  };
}

function animateMarker(place, i) {
  place.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    place.setAnimation(null);
  }, 2100);
}

//update the visibility of each marker
function updateMarkers() {
  for (var i=0; i < places.length; i++) {
    if (places[i].live === true) {
      places[i].holdMarker.setMap(map);
    }
    else {
      places[i].holdMarker.setMap(null);
    }
  }
}

//the viewmodel object with search bar input set to no value.
var viewModel = {
  query: ko.observable(''),
};

//set the model to computed observable and immediately invoke
viewModel.places = ko.pureComputed(function() {
  var self = this;
  var search = self.query().toLowerCase();
  return ko.utils.arrayFilter(places, function(place) {
    if (place.name.toLowerCase().indexOf(search) >=0) {
      place.live = true;
      return place.visible(true);
    }
    else {
      place.live = false;
      updateMarkers();
      return place.visible(false);
    }
  });
}, viewModel);

//ready aim fire KO
ko.applyBindings(viewModel);

//bind a keyup function to the search bar that invokes the function updateMarkers
$("#input").keyup(function() {
  updateMarkers();
});

//toggle the visibility of side bar when clicking hamburger icon
$("#hamburger").click(function () {
  if ( $('#sidebar').css('z-index') == 0) {
    $('#sidebar').css('z-index', 10);
  } else {
    $('#sidebar').css('z-index', 0);
  };
});
