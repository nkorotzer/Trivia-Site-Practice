let anilistData;

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    anilistData = data;
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}

async function searchAnimeByID (id) {
    // Here we define our query as a multi-line string
    // Storing it in a separate .graphql/.gql file is also possible
    var query = `
    query ($id: Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            id
            coverImage {
                large
            }
            title {
            romaji
            english
            native
            }
            season
            seasonYear
        }
    }
    `;

    // Define our query variables and values that will be used in the query request
    var variables = {
        id,
    };

    // Define the config we'll need for our Api request
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };
    
    // Make the HTTP Api request
    await fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);
}

function printAniData() {
    console.log("anilist data = ", anilistData.data);
    console.log("anilist media = ", anilistData.data.Media);
    console.log("anilist id = ", anilistData.data.Media.id);
    console.log("anilist title = ", anilistData.data.Media.title.romaji);
}

function searchAndRefreshHere(place) {
    let userInput = parseInt(prompt("Enter an anime ID"));
    searchAnimeByID(userInput).then( () => {
        refreshDataHere(place);
    });
}

function refreshDataHere(place) {
    // const divAniName = place.querySelector(".aniName");
    // const divAniSeason = place.querySelector(".aniSeason");
    // const divAniSeasonYear = place.querySelector(".aniSeasonYear");
    const divAniImage = place.querySelector(".aniImage");

    // place.dataset.name = anilistData.data.Media.title.romaji;
    // place.dataset.season = anilistData.data.Media.season;
    // place.dataset.seasonYear = anilistData.data.Media.seasonYear;
    place.dataset.coverImage = anilistData.data.Media.coverImage.large;

    // divAniName.textContent = place.dataset.name;
    // divAniSeason.textContent = place.dataset.season;
    // divAniSeasonYear.textContent = place.dataset.seasonYear;
    divAniImage.setAttribute('src', place.dataset.coverImage);
}

const gridDivs = document.querySelectorAll("#newStuff > .imgSquare");
for (let i = 0; i < gridDivs.length; i++) {
    gridDivs[i].addEventListener("click", function (e) {
        searchAndRefreshHere(e.currentTarget);
    });

    gridDivs[i].addEventListener("mouseenter", function (e) {
        e.target.style.backgroundColor = "gray";
    });

    gridDivs[i].addEventListener("mouseleave", function (e) {
        e.target.style.backgroundColor = "white";
    });

    // const divAniName = document.createElement("p");
    // const divAniSeason = document.createElement("p");
    // const divAniSeasonYear = document.createElement("p");
    const divAniImage = document.createElement("img");

    // divAniName.classList.add("aniName");
    // divAniSeason.classList.add("aniSeason");
    // divAniSeasonYear.classList.add("aniSeasonYear");
    divAniImage.classList.add("aniImage");

    gridDivs[i].appendChild(divAniImage);
    // gridDivs[i].appendChild(divAniName);
    // gridDivs[i].appendChild(divAniSeason);
    // gridDivs[i].appendChild(divAniSeasonYear);
}