// Register the service worker for offline support
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
  
  let map, directionsService, directionsRenderer;
  
  // Initialize the map using the Google Maps JavaScript API
  function initMap() {
    // Set a default center (modify as needed for your event area)
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 27.362655243769304, lng: 75.40271982863491 },
      zoom: 16,
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
  
    // Fetch static route data from your backend
    fetch("http://127.0.0.1:3000/api/routes")
      .then((response) => response.json())
      .then((routeData) => {
//        console.log("Route data:", routeData);
  
        // Construct origin, destination, and waypoints from route data
        //const origin = `${routeData.waypoints[0].lat},${routeData.waypoints[0].lng}`;
        const origin = `27.369599,75.413844`;
       // const destination = `${routeData.waypoints[routeData.waypoints.length - 1].lat},${routeData.waypoints[routeData.waypoints.length - 1].lng}`;
        const destination = `27.366637766189836,75.40516360449232`;
        const waypoints = routeData.waypoints
          .slice(1, routeData.waypoints.length - 1)
          .map((wp) => `${wp.lat},${wp.lng}`)
          .join("|");
  
        // Use your backend proxy to get directions (this keeps your API key secure)
        const directionsUrl = `http://127.0.0.1:3000/api/directions?origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
        fetch(directionsUrl)
          .then((res) => res.json())
          .then((directionsData) => {
          
            if (directionsData.status === "OK") {
             
                console.log("directionsData data:", directionsData);
              directionsRenderer.setDirections(directionsData);
            } else {
              console.error("Directions request failed due to", directionsData.status);
            }
          })
          .catch((error) => console.error("Error fetching directions:", error));
      })
      .catch((error) => console.error("Error fetching route data:", error));
  
    // Setup offline download button functionality
    const downloadBtn = document.getElementById("downloadOffline");
    downloadBtn.addEventListener("click", () => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        // Send a message to the service worker to trigger offline caching
        navigator.serviceWorker.controller.postMessage({ action: "downloadOffline" });
        alert("Offline data download initiated.");
      }
    });
  }
  
  // Display an alert if the user goes offline
  window.addEventListener("offline", () => {
    alert("You are offline. Displaying cached data.");
  });
  