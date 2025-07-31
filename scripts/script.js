let anilistData;
let aniPageMedia;

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    anilistData = data;
}

function handlePageData(data) {
    console.log(data);
    aniPageMedia = data.data.Page.media;
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

async function searchAnimeByString (input) {
    // Here we define our query as a multi-line string
    // Storing it in a separate .graphql/.gql file is also possible
    var query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
        currentPage
        hasNextPage
        perPage
        }
        media (id: $id, search: $search, type: ANIME) {
            id
            title {
                romaji
            }
            coverImage {
                large
            }
            season
            seasonYear
            studios {
                nodes {
                    name
                }
            }
        }
    }
    }
    `;

    var variables = {
        search: input,
        page: 1,
        perPage: 10
    };

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

    await fetch(url, options).then(handleResponse)
        .then(handlePageData)
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
    if (!userInput)
        return
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

// Logs media object contents to console
function printPageMedia(media) {
    console.log(media);
    for (let i = 0; i < media.length; i++) {
        console.log(media[i].title);
    }
}


// Creats DOM elements to display contents of media object
function displaySearchResults (media) {
    eraseSearchResults();
    const pageSearchBox = document.querySelector(".pageSearchBox");
    const searchResultsDiv = document.createElement("div");
    searchResultsDiv.id = "searchResults";
    searchResultsDiv.classList.add("dropdown");
    pageSearchBox.appendChild(searchResultsDiv);

    for (let i = 0; i < media.length; i++) {
        const aniDisplay = document.createElement("div");
        const aniImg = document.createElement("img");
        const aniName = document.createElement("p");

        aniImg.setAttribute('src', media[i].coverImage.large);
        aniName.textContent = media[i].title.romaji;

        aniDisplay.appendChild(aniImg);
        aniDisplay.appendChild(aniName);

        aniDisplay.classList.add("dropdownItem");

        aniDisplay.dataset.coverImage = media[i].coverImage.large;
        aniDisplay.dataset.seasonYear = media[i].seasonYear;
        aniDisplay.dataset.season = media[i].season;
        aniDisplay.dataset.studios = JSON.stringify(media[i].studios.nodes);

        aniDisplay.addEventListener("mouseenter", function (e) {
            e.target.style.backgroundColor = "gray";
        });
        aniDisplay.addEventListener("mouseleave", function (e) {
            e.target.style.backgroundColor = "transparent";
        });
        
        aniDisplay.addEventListener("mousedown", function (e) {
            displayChoiceInGrid(e);
        });

        searchResultsDiv.appendChild(aniDisplay);
    }
}

function TESTcheckStudioMatch (studioList) {
    const row = activeGrid.dataset.row;
    const rowLabel = getRowLabel(parseInt(row)).textContent;

    for (let i = 0; i < studioList.length; i++) {
        if (rowLabel === studioList[i].name)
            return true;
    }
    return false;
}

function displayChoiceInGrid (e) {
    console.log("Choice = ", e.currentTarget);
    const divAniImage = activeGrid.querySelector(".aniImage");
    Object.assign(activeGrid.dataset, e.currentTarget.dataset);
    console.log(TESTcheckStudioMatch(JSON.parse(activeGrid.dataset.studios)));
    divAniImage.setAttribute('src', activeGrid.dataset.coverImage);
}

function eraseSearchResults() {
    if (document.querySelector("#searchResults")) {
        const searchResultsDiv = document.querySelector("#searchResults");
        while (searchResultsDiv.firstChild) {
            searchResultsDiv.removeChild(searchResultsDiv.firstChild);
        }
        searchResultsDiv.remove();
    }
}

const pageSearchBox = document.querySelector(".pageSearchBox");
const searchField = document.querySelector("#searchField");
const gridDivs = document.querySelectorAll("#newStuff > .imgSquare");

function showSearchResults () {
    if (document.querySelector("#searchResults")) {
        const searchResultsDiv = document.querySelector("#searchResults");
        searchResultsDiv.style.display = "flex";
    }
}

function hideSearchResults () {
    if (document.querySelector("#searchResults")) {
        const searchResultsDiv = document.querySelector("#searchResults");
        searchResultsDiv.style.display = "none";
    }
}

function showSearchBox () {
    pageSearchBox.style.visibility = "visible";
    searchField.focus();
}

function hideSearchBox () {
    pageSearchBox.style.visibility = "hidden";
}

pageSearchBox.addEventListener("focusin", showSearchBox);
pageSearchBox.addEventListener("focusout", hideSearchBox);

searchField.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        searchAnimeByString(e.target.value).then( () => {
            printPageMedia(aniPageMedia);
            displaySearchResults(aniPageMedia);
        })
    }
})

let activeGrid;

function getRowLabel (row) {
    if (row === 1)
        return document.querySelector(".rowLabel.row1");
    else if (row === 2)
        return document.querySelector(".rowLabel.row2");
    else
        return document.querySelector(".rowLabel.row3");
}

function getColLabel (col) {
    if (col === 1)
        return document.querySelector(".colLabel.col1");
    else if (col === 2)
        return document.querySelector(".colLabel.col2");
    else
        return document.querySelector(".colLabel.col3");
}

function getUserInputHere (e) {
    activeGrid = e.currentTarget;
    const row = activeGrid.dataset.row;
    const col = activeGrid.dataset.col;
    console.log("coords = (", row, ", ", col, ")");
    const rowLabel = getRowLabel(parseInt(row));
    const colLabel = getColLabel(parseInt(col));
    console.log(rowLabel.textContent);
    showSearchBox();
}

for (let i = 0; i < gridDivs.length; i++) {
    gridDivs[i].addEventListener("click", function (e) {
        getUserInputHere(e);
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