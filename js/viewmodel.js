'use strict';

//define map, center and zoom to KC, and call initMarkers
var initMap = function(){
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.076268, lng: -94.590043},
    zoom: 13,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_CENTER
    }
  });
};

var viewModel = function(){

  var self = this; 

  //constructor for each place with a click eventlistener
  self.place = function(name, lat, long) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      title: name,
      map: self.initMap.map,
    });
    google.maps.event.addListener(this.marker, 'click', function() {
      self.selectPlace(this);
    }.bind(this));
  };

  //animate marker, set content of infowindow
  self.selectPlace = function(place) {
    var x = place.marker;
    x.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      x.setAnimation(null);
    }, 2100);
    self.infowindow.setContent('<div>' + place.name + '</div>');
    self.infowindow.open(self.initMap.map, x);
  }; 

  //updates visibility of each place
  self.updatePlaces = function(){
    var i;
    var placesLength = self.places().length;
    for (i = 0; i < placesLength; i++) {
      var thisPlace = self.places()[i];
      thisPlace.marker.setVisible(false);
    }
    for (i = 0; i < placesLength; i++) {
      var thisPlace = self.visiblePlaces()[i];
      if (thisPlace) {
        thisPlace.marker.setVisible(true);
      }
    }
  };

  //update visibility of menu items
  self.ul = ko.observable(true);

  //initialize map within viewmodel
  self.initMap = new initMap();

  //track the value of the searchbox input
  self.searchBox = ko.observable('');

  //the model
  self.places = ko.observableArray([
    new self.place('801 Chop House', 39.096980, -94.582418),
    new self.place('Grinders', 39.091405, -94.578115),
    new self.place('Jack Stack Barbecue', 39.087237, -94.585817),
    new self.place('Beer Kitchen', 39.052808, -94.591287),
    new self.place('Reserve', 39.100631, -94.580513)
  ]);

  //store length of list
  var fullList = self.places().length;

  //store value of number of menu items not to show
  self.hiddenPlaces = ko.observable(0);

  self.infowindow = new google.maps.InfoWindow();

  //compute an array that only contains the visible places
  self.visiblePlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.places(), function(place) {
      return (
        place.name.toLowerCase().indexOf(self.searchBox().toLowerCase()) >= 0
      );
    });
  }, self);

  //when visible places is updated, update the markers as well
  self.visiblePlaces.subscribe(function() {
    self.updatePlaces();
  });

  self.placeMenu = ko.computed(function(){
    return self.visiblePlaces().slice(self.hiddenPlaces(), fullList);
  });

  self.showMenu = ko.observable(true);

  self.toggleMenu = function() {
    self.showMenu(!self.showMenu());
  };
};

ko.applyBindings(new viewModel());
