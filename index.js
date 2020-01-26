function CityMap(citiesToInit) {
    this.cities = [];
    if (typeof citiesToInit === "string") {
        let normalizeStrToArr = citiesToInit.replace(/\"/g, "").split(";");
        normalizeStrToArr.pop();
        normalizeStrToArr.map((city) => {
            let cityFields = city.split(",");
            let cityToAdd = new City(cityFields[0].trim(), cityFields[1].trim(), parseFloat(cityFields[2]), parseFloat(cityFields[3]));
            this.cities.push(cityToAdd);
        });
    } else {
        this.cities = citiesToInit;
    }

    this.getCityClosestTo = (latitude, longitude) => {
        let currentClosestDistance = Number.MAX_SAFE_INTEGER;
        let currentClosestCity = null;
        this.cities.map((city) => {
            let distanceLong = Math.abs(city.longitude - longitude);
            let distanceLat = Math.abs(city.latitude - latitude);
            let distance = Math.sqrt(Math.pow(distanceLong, 2) + Math.pow(distanceLat, 2));
            if (distance < currentClosestDistance) {
                currentClosestDistance = distance;
                currentClosestCity = city.name;
            }
        });
        return currentClosestCity;
    };

    this.getSouthernmostCity = () => {
        let currentSouthernmost = 90;
        let currentSouthernmostCity = null;
        this.cities.map((city) => {
            if (city.latitude < currentSouthernmost) {
                currentSouthernmost = city.latitude;
                currentSouthernmostCity = city.name;
            }
        });
        return currentSouthernmostCity;
    };

    this.getNorthernmostCity = () => {
        let currentNorthernmost = -90;
        let currentNorthernmostCity = null;
        this.cities.map((city) => {
            if (city.latitude > currentNorthernmost) {
                currentNorthernmost = city.latitude;
                currentNorthernmostCity = city.name;
            }
        });
        return currentNorthernmostCity;
    };

    this.getEasternmostCity = () => {
        let currentEasternmost = -180;
        let currentEasternmostCity = null;
        this.cities.map((city) => {
            if (city.longitude > currentEasternmost) {
                currentEasternmost = city.longitude;
                currentEasternmostCity = city.name;
            }
        });
        return currentEasternmostCity;
    };

    this.getWesternmostCity = () => {
        let currentWesternmostValue = 180;
        let currentWesternmostCity = null;
        this.cities.map((city) => {
            if (city.longitude < currentWesternmostValue) {
                currentWesternmostValue = city.longitude;
                currentWesternmostCity = city.name;
            }
        });
        return currentWesternmostCity;
    };

    this.getStateAbbreviations = () => {
        let statesAbbreviations = [];
        this.cities.map((city) => {
            if (!statesAbbreviations.includes(city.abbr)) {
                statesAbbreviations.push(city.abbr);
            }
        });
        let stateAbbreviationsAsString = statesAbbreviations.join();
        stateAbbreviationsAsString = stateAbbreviationsAsString.replace((/,/g), " ");
        return stateAbbreviationsAsString;
    };

    this.findCitiesByState = (inputSearch) => {
        let foundCities = [];
        this.cities.map((city) => {
            if (city.abbr.toUpperCase() === inputSearch.toUpperCase()) {
                foundCities.push(city.name);
            }
        });
        return foundCities;
    };

    this.addCity = (cityName, abbr, latitude, longitude) => {
        let addedCity = new City(cityName, abbr, latitude, longitude);
        this.cities.push(addedCity);
    };

    this.getCitiesDataForExport = () => {
        return this.cities;
    };

    this.getCityCount = () => {
        return this.cities.length;
    };
}

function City(name, abbr, latitude, longitude) {
    this.name = name;
    this.abbr = abbr;
    this.latitude = latitude;
    this.longitude = longitude;
}

let cityMap;

let addToLocalStorage = () => {
    localStorage.setItem("cities", JSON.stringify(cityMap.getCitiesDataForExport()));
};

let operationsWithCities = document.getElementById("operations-with-cities");

let addToConstructor = () => {
    let allCities = document.getElementById("all-cities").value;
    if (allCities !== "") {
        cityMap = new CityMap(allCities);
        addToLocalStorage();
        operationsWithCities.classList.remove("hide");
        alert("Города добавлены");
    } else {
        alert("Введите строку с городами");
    }

};
let btnAllCities = document.getElementById("btn-all-cities");
btnAllCities.addEventListener("click", addToConstructor);

let searchCityForOption = () => {
    let option = document.getElementById("option").value;
    let resultCityForOption = document.getElementById("result-city-for-option");
    if (option === "northern") {
        resultCityForOption.innerText = "City: " + cityMap.getNorthernmostCity();
    } else if (option === "southern") {
        resultCityForOption.innerText = "City: " + cityMap.getSouthernmostCity();
    } else if (option === "eastern") {
        resultCityForOption.innerText = "City: " + cityMap.getEasternmostCity();
    } else if (option === "western") {
        resultCityForOption.innerText = "City: " + cityMap.getWesternmostCity();
    }

};
let btnCityForOption = document.getElementById("btn-city-for-option");
btnCityForOption.addEventListener("click", searchCityForOption);

let searchClosestCity = () => {
    let latitudeFromUser = document.getElementById("latitude-from-user").value;
    let longitudeFromUser = document.getElementById("longitude-from-user").value;
    let resultClosestCity = document.getElementById("result-closest-city");
    if (latitudeFromUser !== "" && longitudeFromUser !== "") {
        resultClosestCity.innerText = cityMap.getCityClosestTo(latitudeFromUser, longitudeFromUser);
    } else if (latitudeFromUser === "" && longitudeFromUser === "") {
        alert("Введите данные");
    } else if (latitudeFromUser === "" || longitudeFromUser === "") {
        alert("Недостаточно данных");
    }
};
let btnCityForLocation = document.getElementById("btn-city-for-location");
btnCityForLocation.addEventListener("click", searchClosestCity);

let showAbbr = () => {
    let resultAbbr = document.getElementById("result-abbr");
    resultAbbr.innerText = cityMap.getStateAbbreviations();
};
let btnShowAbbr = document.getElementById("btn-show-abbr");
btnShowAbbr.addEventListener("click", showAbbr);

let searchCity = () => {
    let inputSearch = document.getElementById("search").value;
    let divForResult = document.getElementById("result-for-search");
    if (inputSearch !== "") {
        divForResult.innerHTML = "";
        let persistedCitiesName = cityMap.findCitiesByState(inputSearch);
        persistedCitiesName.map((cityName) => {
            divForResult.innerHTML += "<br>City: " + cityName + "<br>";
        })
    } else {
        alert("Заполните поле!");
    }
};
let btnSearch = document.getElementById("btn-search");
btnSearch.addEventListener("click", searchCity);

let addNewCity = () => {
    let cityName = document.getElementById("city").value;
    let abbr = document.getElementById("abbr").value;
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;
    if (cityName !== "" && abbr !== "" && latitude !== "" && longitude !== "") {
        cityMap.addCity(cityName, abbr, latitude, longitude);
        alert("Город " + cityName + " добавлен");
    } else {
        alert("Введите данные");
    }
    addToLocalStorage();
};
let btnAddCity = document.getElementById("btn-add-city");
btnAddCity.addEventListener("click", addNewCity);


window.onload = () => {
    let persistedCities = [];
    let localStorageItem = localStorage.getItem("cities");
    if (localStorageItem) {
        persistedCities = JSON.parse(localStorageItem);
    }
    cityMap = new CityMap(persistedCities);

    if (cityMap) {
        if (cityMap.getCityCount() > 0) {
            operationsWithCities.classList.remove("hide");
        } else {
            operationsWithCities.classList.add("hide");
        }
    }
};

