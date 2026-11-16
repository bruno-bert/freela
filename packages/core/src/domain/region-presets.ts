import type { Region } from './model';
export interface RegionPreset { id: string; name: string; country: string; region: Region; sourceUrl: string; }
export const regionPresets: RegionPreset[] = [
  {
    "id": "nyc",
    "name": "New York · Flatiron / NoMad",
    "country": "US",
    "region": {
      "latitude": 40.7411,
      "longitude": -73.9897,
      "radius": 1200
    },
    "sourceUrl": "https://flatironnomad.nyc/things-to-do/district-guide/"
  },
  {
    "id": "austin",
    "name": "Austin · South Congress",
    "country": "US",
    "region": {
      "latitude": 30.2492,
      "longitude": -97.75,
      "radius": 1500
    },
    "sourceUrl": "https://www.austintexas.org/explore/entertainment-districts/south-congress/"
  },
  {
    "id": "toronto",
    "name": "Toronto · Queen West",
    "country": "CA",
    "region": {
      "latitude": 43.6469,
      "longitude": -79.4073,
      "radius": 1500
    },
    "sourceUrl": "https://www.destinationtoronto.com/neighbourhoods/westside/queen-west/"
  },
  {
    "id": "vancouver",
    "name": "Vancouver · Mount Pleasant",
    "country": "CA",
    "region": {
      "latitude": 49.262,
      "longitude": -123.1,
      "radius": 1500
    },
    "sourceUrl": "https://www.destinationvancouver.com/neighbourhoods/mount-pleasant"
  },
  {
    "id": "dublin",
    "name": "Dublin · Creative Quarter",
    "country": "IE",
    "region": {
      "latitude": 53.3418,
      "longitude": -6.2645,
      "radius": 1000
    },
    "sourceUrl": "https://www.visitdublin.com/guides/dublin-shopping-streets"
  },
  {
    "id": "cork",
    "name": "Cork · Oliver Plunkett Street",
    "country": "IE",
    "region": {
      "latitude": 51.897,
      "longitude": -8.4713,
      "radius": 1000
    },
    "sourceUrl": "https://www.discoverireland.ie/cork/keane-s-jewellers-cork"
  },
  {
    "id": "amsterdam",
    "name": "Amsterdam · De Pijp",
    "country": "NL",
    "region": {
      "latitude": 52.3546,
      "longitude": 4.8933,
      "radius": 1200
    },
    "sourceUrl": "https://www.iamsterdam.com/en/explore/neighbourhoods/de-pijp/things-to-do"
  },
  {
    "id": "rotterdam",
    "name": "Rotterdam · Witte de With",
    "country": "NL",
    "region": {
      "latitude": 51.9144,
      "longitude": 4.4773,
      "radius": 1000
    },
    "sourceUrl": "https://www.rotterdam.info/en/visit/guide/urban-rotterdam-ultimate-sneaker-haven"
  }
];
export const defaultRegion = regionPresets[0].region;
