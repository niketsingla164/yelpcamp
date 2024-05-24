mapboxgl.accessToken = mapbox_Token;
  
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: coordinates,
    zoom: 12,
  });
  map.addControl(new mapboxgl.NavigationControl(),'bottom-right')
  new mapboxgl.Marker()
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({offset : 25})
    .setHTML(`<h3>${title}</h3>`)
  ).addTo(map)
