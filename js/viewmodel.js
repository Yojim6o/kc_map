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
    self.infowindow.setContent('<div>' + contentString() + '</div>');
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

  //update visibility of menu items to the DOM
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

  self.the4Sstring = '';

  this.get4Sinfo = function(place){
      var url = 'https://api.foursquare.com/v2/venues/search?client_id=' +
          'CTMPH2WR0Z3U2DKN33AV0LEGI1RQBM5SCLZBOSHKOVAY4SUA' +
          '&client_secret=2QGAAF3EERLHRTMLOLK5OAHSMGOJNAI1KFYYYHEECO2L0XEU' + 'v=20130815' +
          '&ll=' + place.lat() + ',' +
          place.long() + '&query=\'' + place.name + '\'&limit=1';

      $.getJSON(url).done(function(response){
          self.the4Sstring = '<p>Foursquare info:<br>';
          var venue = response.response.venues[0];
          var venueId = venue.id;

          var venueName = venue.name;
          if (venueName !== null && venueName !== undefined){
              self.the4Sstring = self.the4Sstring + 'name: ' +
                  venueName + '<br>';
          }
          var phoneNum = venue.contact.formattedPhone;
          if (phoneNum !== null && phoneNum !== undefined){
              self.the4Sstring = self.the4Sstring + 'phone: ' +
                  phoneNum + '<br>';
          }
          var twitterId = venue.contact.twitter;
          if (twitterId !== null && twitterId !== undefined){
              self.the4Sstring = self.the4Sstring + 'twitter name: ' +
                  twitterId + '<br>';
          }
          var address = venue.location.formattedAddress;
          if (address !== null && address !== undefined){
              self.the4Sstring = self.the4Sstring + 'address: ' +
                  address + '<br>';
          }
          var checkinCount = venue.stats.checkinsCount;
          if (checkinCount !== null && checkinCount !== undefined){
              self.the4Sstring = self.the4Sstring + '# of checkins: ' +
                  checkinCount + '<br>';
          }
          var tipCount = venue.stats.tipCount;
          if (tipCount > 0) {
              self.get4Stips(venueId, place);
          }
          else{
              self.the4Sstring = self.the4Sstring + '</p>';
          }
      })
      .fail(function(){
          self.the4Sstring = 'Fouresquare data request failed';
          console.log('Fouresquare failed to load information' + 
              'attempting to load error we can get into info window');              
      });
  };

  this.get4Stips = function(venueId, place){
      var url ='https://api.foursquare.com/v2/venues/' + venueId + '/tips' +
          '?client_id=CTMPH2WR0Z3U2DKN33AV0LEGI1RQBM5SCLZBOSHKOVAY4SUA' +
          '&client_secret=2QGAAF3EERLHRTMLOLK5OAHSMGOJNAI1KFYYYHEECO2L0XEU';

      $.getJSON(url).done(function(response){
          var tipCount = Math.min(self.max4Stips,
              response.response.tips.count);
          self.the4Sstring = self.the4Sstring + '<br> <ul>';
          for(var i=0;i<tipCount;i++){
              self.the4Sstring = self.the4Sstring + '<li>' +
                  response.response.tips.items[i].text + '</li>';
          }
          self.the4Sstring = self.the4Sstring + '</ul></p>';
          self.infowindow.setContent(self.contentString(false));
      });
  };

  self.contentString = function(){
      var retStr = '<div>' +
          self.the4Sstring + '</div>';
      return retStr;
  };

  //store length of list
  var fullList = self.places().length;

  //store value of number of menu items not to show
  self.hiddenPlaces = ko.observable(0);

  //create container for infowindows
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

  //return visible places to the side menu
  self.placeMenu = ko.computed(function(){
    return self.visiblePlaces().slice(self.hiddenPlaces(), fullList);
  });

  //track the visibility of the sidemenu
  self.showMenu = ko.observable(true);

  //toggle the visibility of the sidemenu
  self.toggleMenu = function() {
    self.showMenu(!self.showMenu());
  };
};

ko.applyBindings(new viewModel());
