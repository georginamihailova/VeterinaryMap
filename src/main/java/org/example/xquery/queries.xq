xquery version "3.1";

module namespace vet = "http://example.com/veterinary";

declare function vet:get-all() {
    for $a in doc("veterinary.xml")//ambulance
    return map {
        "id": $a/@id/string(),
        "name": $a/veterinary_company/string(),
        "legalEntity": $a/veterinary_company/string(),
        "type": $a/type/string(),
        "location": $a/municipality/string(),
        "address": $a/company_location/string(),
        "latitude": $a/coordinates/@lat/number(),
        "longitude": $a/coordinates/@long/number(),
        "dateEstablished": $a/date_established/string()
    }
};

declare function vet:filter-by-type($type as xs:string) {
    for $a in doc("veterinary.xml")//ambulance[type = $type]
    return map {
        "id": $a/@id/string(),
        "name": $a/veterinary_company/string(),
        "legalEntity": $a/veterinary_company/string(),
        "type": $a/type/string(),
        "location": $a/municipality/string(),
        "address": $a/company_location/string(),
        "latitude": $a/coordinates/@lat/number(),
        "longitude": $a/coordinates/@long/number(),
        "dateEstablished": $a/date_established/string()
    }
};

declare function vet:filter-by-municipality($municipality as xs:string) {
    for $a in doc("veterinary.xml")//ambulance[municipality = $municipality]
    return map {
        "id": $a/@id/string(),
        "name": $a/veterinary_company/string(),
        "legalEntity": $a/veterinary_company/string(),
        "type": $a/type/string(),
        "location": $a/municipality/string(),
        "address": $a/company_location/string(),
        "latitude": $a/coordinates/@lat/number(),
        "longitude": $a/coordinates/@long/number(),
        "dateEstablished": $a/date_established/string()
    }
};