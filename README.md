#Kansas City Map

This is a map project I'm currently working as part of the Udacity Front-End Web Developer Nanodegree. Visit Udacity.com to learn more about their program.

https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001

The project is work-in-progress.

## How to Use

1. Clone the repo with your terminal: `git clone git@github.com:Yojim6o/KCmap.git`
2. Open the folder kc_map/ and open index.html in the browser of your choice.
3. Use the search bar to filter your search based on the name of the place you're looking for
4. Click on either the name on the list or a marker on the map to view information about the place.
5. If available, you can view the menu or reserve seating at the place you are viewing by clicking on the appropriate links.


Todo:

	3. Google Maps API request must retrieve data asynchronously
    
    4. Google Maps error handling works, but it uses jQuery to update the DOM which is not allowed for this project.

    	But the instructions for this project specify that all DOM updates should be done using Knockout.js so this function won't meet the project requirements

		You could try to refactor your code to use a Knockout binding for this error message. Just remember that Knockout.js won't work until the ko.bindings have been applied – and right now your bindings are applied in your initMap() function which only runs when Google Maps data has been successfully returned.

		The easy solution here is to swap out the DOM message for an alert() box. Not quite as elegant, but effective for meeting the project requirements.
    
    5. Foursquare API also needs error handling. One way to do this is to chain .fail() to your $.getJSON function.

    6. testing for venue.reservations instead of venue.reservations.url

          if (venue.menu.url && venue.reservations) {

	7. remove style="color: white" from your ul tag. It's not doing anything here.

	8. instead of

        html, body {
              ...
       }

		it should be:

        html,
        body {
              ...
       }

    9. Always put a blank line (two line breaks) between rules. css

    10. You should consider replacing your ids with classes or adding classes to your HTML tags

    11. Unless necessary (for example, with helper classes), do not use element names in conjunction with IDs or classes.


	