export async function getLocationFromNavigator() {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
