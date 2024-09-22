
// SideBar

function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

// AutoComplete Address and Distance Calculator

let autocompletePickUp;
let autocompleteDestination;
let directionsService;
let distanceMatrixService;

function initAutocomplete() {
  const inputPickUp = document.getElementById("search_pickUp");
  const inputDestination = document.getElementById("search_destination");

  autocompletePickUp = new google.maps.places.Autocomplete(inputPickUp);
  autocompleteDestination = new google.maps.places.Autocomplete(
    inputDestination
  );


  // Initialize the Distance Matrix service
  distanceMatrixService = new google.maps.DistanceMatrixService();

  autocompletePickUp.addListener("place_changed", calculateDistance);
  autocompleteDestination.addListener("place_changed", calculateDistance);

  autocompletePickUp.addListener("place_changed", () => {
    const place = autocompletePickUp.getPlace();
    if (!place.geometry) {
      console.log("No details available for the input: '" + place.name + "'");
      return;
    }
  });

//   Set up the event listener for when the user selects a place in the destination field
  autocompleteDestination.addListener("place_changed", () => {
    const place = autocompleteDestination.getPlace();
    if (!place.geometry) {
      console.log("No details available for the input: '" + place.name + "'");
      return;
    }
  });
}

function calculateDistance() {
  const pickupLocation = autocompletePickUp.getPlace();
  const destinationLocation = autocompleteDestination.getPlace();

//   if (!pickupLocation || !destinationLocation) {
//     alert("Please select both pickup and destination locations.");
//     return;
//   }

  distanceMatrixService.getDistanceMatrix(
    {
      origins: [pickupLocation.geometry.location],
      destinations: [destinationLocation.geometry.location],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC, 
    },
    (response, status) => {
      if (status !== "OK") {
        alert("Error calculating distance: " + status);
        return;
      }

      const distance = response.rows[0].elements[0].distance;
      const duration = response.rows[0].elements[0].duration;

      if (distance) {

        document.getElementById("total_distance").value =
          distance.text + " (" + duration.text + ")";

      } else {
        alert("Unable to calculate distance.");
      }
    }
  );
}
