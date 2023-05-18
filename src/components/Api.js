// make api calls

export async function fetchPeopleData() {
  try {
    const response = await fetch('http://api.open-notify.org/astros.json', {referrerPolicy:"unsafe-url"});
    const data = await response.json();
    const length = data.people.length;
    return {data, length};
  } catch (error) {
    console.error('Error fetching text data:', error);
    return [];
  }
}

export async function fetchPlanetsData() {
  const planetIds = ['mercure', 'venus', 'terre', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  const requests = planetIds.map((planetId) => {
    return fetch(`https://api.le-systeme-solaire.net/rest/bodies/${planetId}`)
      .then((response) => response.json());
  });
  
  try {
    const planetData = await Promise.all(requests);
    return planetData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

