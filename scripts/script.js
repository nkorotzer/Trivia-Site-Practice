let mainImage = document.querySelector("#mainImage");
let imageCaption = document.querySelector(".textCon");
let changeImageBtn = document.querySelector("#changeImageBtn");
let refreshDataBtn = document.querySelector("#refreshDataBtn");
let seasonText = document.querySelector(".season");
let seasonYearText = document.querySelector(".seasonYear");
let anilistData;

changeImageBtn.addEventListener("click", searchAndRefresh);

refreshDataBtn.addEventListener("click", refreshData);

function searchAndRefresh() {
    let userInput = parseInt(prompt("Enter an anime ID"));
    searchAnimeByID(userInput).then( () => {
        refreshData();
    });
}

function refreshData() {
    printAniData();
    imageCaption.textContent = anilistData.data.Media.title.romaji;
    mainImage.setAttribute('src', anilistData.data.Media.coverImage.medium);
    seasonText.textContent = anilistData.data.Media.season;
    seasonYearText.textContent = anilistData.data.Media.seasonYear;
}

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
                medium
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

function searchAndRefreshHere(e) {
    let userInput = parseInt(prompt("Enter an anime ID"));
    searchAnimeByID(userInput).then( () => {
        refreshDataHere(e);
    });
}

function refreshDataHere(e) {
    const divAniName = e.target.querySelector(".aniName");
    const divAniSeason = e.target.querySelector(".aniSeason");
    const divAniSeasonYear = e.target.querySelector(".aniSeasonYear");
    const divAniImage = e.target.querySelector(".aniImage");

    e.target.dataset.name = anilistData.data.Media.title.romaji;
    e.target.dataset.season = anilistData.data.Media.seasonYear;
    e.target.dataset.seasonYear = anilistData.data.Media.season;
    e.target.dataset.coverImage = anilistData.data.Media.coverImage.medium;

    divAniName.textContent = e.target.dataset.name;
    divAniSeason.textContent = e.target.dataset.season;
    divAniSeasonYear.textContent = e.target.dataset.seasonYear;
    divAniImage.setAttribute('src', e.target.dataset.coverImage);
}

const gridDivs = document.querySelectorAll("#newStuff > div");
for (let i = 0; i < gridDivs.length; i++) {
    gridDivs[i].addEventListener("click", function (e) {
        searchAndRefreshHere(e);
    });

    gridDivs[i].addEventListener("mouseenter", function (e) {
        e.target.style.backgroundColor = "gray";
    });

    gridDivs[i].addEventListener("mouseleave", function (e) {
        e.target.style.backgroundColor = "white";
    });

    const divAniName = document.createElement("p");
    const divAniSeason = document.createElement("p");
    const divAniSeasonYear = document.createElement("p");
    const divAniImage = document.createElement("img");

    divAniName.classList.add("aniName");
    divAniSeason.classList.add("aniSeason");
    divAniSeasonYear.classList.add("aniSeasonYear");
    divAniImage.classList.add("aniImage");

    gridDivs[i].appendChild(divAniImage);
    gridDivs[i].appendChild(divAniName);
    gridDivs[i].appendChild(divAniSeason);
    gridDivs[i].appendChild(divAniSeasonYear);
}