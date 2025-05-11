xquery version "3.1";

module namespace vet = "http://example.com/veterinary";

declare function vet:get-all() {
  for $a in .//ambulance
  return map {
    "id": string($a/id),
    "name": string($a/hasNameOfPlace),
    "legalEntity": string($a/hasLegalEntity),
    "type": string($a/hasType),
    "location": string($a/hasLocation),
    "address": string($a/hasAddress),
    "latitude": number($a/hasLatitude),
    "longitude": number($a/hasLongitude),
    "dateEstablished": string($a/hasDate)
  }
};

declare function vet:filter-by-type($type as xs:string) {
  for $a in .//ambulance[hasType = $type]
  return map {
    "id": string($a/id),
    "name": string($a/hasNameOfPlace),
    "legalEntity": string($a/hasLegalEntity),
    "type": string($a/hasType),
    "location": string($a/hasLocation),
    "address": string($a/hasAddress),
    "latitude": number($a/hasLatitude),
    "longitude": number($a/hasLongitude),
    "dateEstablished": string($a/hasDate)
  }
};

declare function vet:filter-by-municipality($muni as xs:string) {
  for $a in .//ambulance[hasLocation = $muni]
  return map {
    "id": string($a/id),
    "name": string($a/hasNameOfPlace),
    "legalEntity": string($a/hasLegalEntity),
    "type": string($a/hasType),
    "location": string($a/hasLocation),
    "address": string($a/hasAddress),
    "latitude": number($a/hasLatitude),
    "longitude": number($a/hasLongitude),
    "dateEstablished": string($a/hasDate)
  }
};
