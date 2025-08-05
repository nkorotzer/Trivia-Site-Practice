let anilistData;
let aniPageMedia;
let studioSearchData;
let activeGrid;
const pageSearchBox = document.querySelector(".pageSearchBox");
const searchField = document.querySelector("#searchField");

// Only called by searchAnimeByString
function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

// Unused function called by searchAnimeByID
function handleData(data) {
    console.log(data);
    anilistData = data;
}

// Only called by searchAnimeByString
function handlePageData(data) {
    console.log(data);
    aniPageMedia = data.data.Page.media;
}

// Only called by searchStudioByString
function handleStudioData(data) {
    console.log("studio data = ", data.data.Page.studios);
    studioSearchData = data.data.Page.studios;
}

// Only called by searchAnimeByString
function handleError(error) {
    alert('Error, check console');
    console.error(error);
}

// Unused function that queries Anilist API with a specific ID number
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

// Function that builds and sends API request to Anilist
// Takes in a string to search for anime titles
// Returned data is a page of results from Anilist
// Calls handleResponse, handlePageData, and handleError as needed
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

async function searchStudioByString (input) {
    // Here we define our query as a multi-line string
    // Storing it in a separate .graphql/.gql file is also possible
    var query = `
    query ($page: Int, $perPage: Int, $search: String) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                currentPage
                hasNextPage
                perPage
            }
            studios(search: $search) {
                name
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
        .then(handleStudioData)
        .catch(handleError);
}

// Unused function for printing the results from the Anilist API to console
function printAniData() {
    console.log("anilist data = ", anilistData.data);
    console.log("anilist media = ", anilistData.data.Media);
    console.log("anilist id = ", anilistData.data.Media.id);
    console.log("anilist title = ", anilistData.data.Media.title.romaji);
}

// Unused function to search for an anime by its ID
function searchAndRefreshHere(place) {
    let userInput = parseInt(prompt("Enter an anime ID"));
    if (!userInput)
        return
    searchAnimeByID(userInput).then( () => {
        refreshDataHere(place);
    });
}

// Unused function to display data in the provided element (should be an imgSquare in the grid)
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
            displayResult();
        });

        searchResultsDiv.appendChild(aniDisplay);
    }
}

function displayResult () {
    let correct = checkChoiceCorrectness(activeGrid.dataset.studios, activeGrid.dataset.seasonYear);
    if (correct) {
        activeGrid.style.backgroundColor = "green";
    }
    else {
        activeGrid.style.backgroundColor = "red";
    }

    // cloning activeGrid node removes all event listeners
    // this prevents the user from changing their choice
    let newGrid = activeGrid.cloneNode(true);
    activeGrid.parentNode.replaceChild(newGrid, activeGrid);
}

function checkChoiceCorrectness (studios, year) {
    let correctStudio = false;
    let correctYear = false;

    const studioList = JSON.parse(studios);
    const row = activeGrid.dataset.row;
    const col = activeGrid.dataset.col;
    const rowLabel = getRowLabel(parseInt(row)).textContent;
    const colLabel = getColLabel(parseInt(col)).textContent;

    for (let i = 0; i < studioList.length; i++) {
        if (studioList[i].name === rowLabel || studioList[i].name === colLabel)
            correctStudio = true;
    }

    if (year === colLabel || year === rowLabel)
        correctYear = true;

    return correctStudio & correctYear;
}

function displayChoiceInGrid (e) {
    console.log("Choice = ", e.currentTarget);
    const divAniImage = activeGrid.querySelector(".aniImage");

    Object.assign(activeGrid.dataset, e.currentTarget.dataset);

    divAniImage.setAttribute('src', activeGrid.dataset.coverImage);

    console.log(checkChoiceCorrectness(activeGrid.dataset.studios, activeGrid.dataset.seasonYear));
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
    searchField.value = "";
    searchField.focus();
}

function hideSearchBox () {
    pageSearchBox.style.visibility = "hidden";
}

// Grabs user input in searchField, then passes it to searchAnimeByString
// The results returned from the Anilist API are printed to console
// then, they're displayed as a list in the searchResults box
searchField.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        searchAnimeByString(e.target.value).then( () => {
            printPageMedia(aniPageMedia);
            displaySearchResults(aniPageMedia);
        })
    }
})

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
    showSearchBox();
}

function createGridItems () {
    const gridDivs = document.querySelectorAll("#newStuff > .imgSquare");

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

        const divAniImage = document.createElement("img");

        divAniImage.classList.add("aniImage");

        gridDivs[i].appendChild(divAniImage);
        gridDivs[i].style.backgroundColor = "white";
    }
}

function deleteGridItems () {
    const gridDivs = document.querySelectorAll("#newStuff > .imgSquare");

    for (let i = 0; i < gridDivs.length; i++) {
        while (gridDivs[i].firstChild) {
            gridDivs[i].removeChild(gridDivs[i].firstChild);
        }
    }
}

function resetGridItems () {
    deleteGridItems();
    createGridItems();
}

const resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener("click", resetGridItems);
pageSearchBox.addEventListener("focusin", showSearchBox);
pageSearchBox.addEventListener("focusout", hideSearchBox);

createGridItems();

const pageUrl = new URL(window.location)

function updateUrl (paramName, paramVal) {
    pageUrl.searchParams.append(paramName, paramVal)
    history.pushState({}, "", pageUrl);
    console.log(pageUrl);
}

function clearAllUrlParams () {
    // trying to use URLSearchParams wasn't working, but this does
    pageUrl.search = "";
}

function TESTaddRowLabelsToUrl () {
    const rowLabels = document.querySelectorAll("#newStuff > .rowLabel");
    for (let i = 0; i < rowLabels.length; i++) {
        updateUrl("row", rowLabels[i].textContent);
    }
}

function TESTaddColLabelstoUrl () {
    const colLabels = document.querySelectorAll("#newStuff > .colLabel");
    for (let i = 0; i < colLabels.length; i++) {
        updateUrl("col", colLabels[i].textContent);
    }
}

function TESTaddLabelsToUrl () {
    clearAllUrlParams();
    TESTaddRowLabelsToUrl();
    TESTaddColLabelstoUrl();
}


const urlBtn = document.querySelector("#urlBtn");
urlBtn.addEventListener("click", TESTaddLabelsToUrl);

// Given a DOM element (a row or col label element), get user input, then search
// anilist for a studio with the given name, and set the label text content 
function setLabelStudio (labelElem) {
    let userInput = prompt("Enter new value");
    if (userInput) {  
        searchStudioByString(userInput).then( () => {
            if (studioSearchData.length !== 0) {
                console.log(studioSearchData[0].name)
                console.log(labelElem)
                labelElem.textContent = studioSearchData[0].name;
            }
            else
                window.alert("Couldn't find a studio called \'" + userInput + "\'.");
        });
    }
}

function setLabelYear (labelElem) {
    const userInput = prompt("Enter year");
    if (userInput)
        labelElem.textContent = userInput;
}

function addHoverHighlighting (elem) {
    elem.addEventListener("mouseenter", function (e) {
        e.target.style.backgroundColor = "lightgray";
    });

    elem.addEventListener("mouseleave", function (e) {
        e.target.style.backgroundColor = "transparent";
    });
}

const labels = document.querySelectorAll(".colLabel, .rowLabel");
for (let i = 0; i < labels.length; i++) {
    labels[i].addEventListener("click", function (e) {
            const labelSelectContainer = document.createElement("ul");
            const labelSelectStudio = document.createElement("li");
            const labelSelectYear = document.createElement("li");

            labelSelectStudio.textContent = "Studio";
            labelSelectStudio.style.backgroundColor = "transparent";
            addHoverHighlighting(labelSelectStudio);

            labelSelectYear.textContent = "Year";
            labelSelectYear.style.backgroundColor = "transparent";
            addHoverHighlighting(labelSelectYear);

            labelSelectContainer.style.position = "absolute";
            labelSelectContainer.style.zIndex = "1";
            labelSelectContainer.style.border = "solid black 1px";
            labelSelectContainer.style.backgroundColor = "white";
            labelSelectContainer.style.top = "15";
            labelSelectContainer.classList.add("selectCon");

            labelSelectStudio.addEventListener("click", function (e) {
                setLabelStudio(e.currentTarget.parentNode.parentNode);
            });

            labelSelectYear.addEventListener("click", function (e) {
                setLabelYear(e.currentTarget.parentNode.parentNode);
            });

            labelSelectContainer.appendChild(labelSelectStudio);
            labelSelectContainer.appendChild(labelSelectYear);
            
            labels[i].appendChild(labelSelectContainer);
    });

    labels[i].addEventListener("mouseleave", function (e) {
        const selectCon = e.target.querySelector(".selectCon");
        if (selectCon)
            e.target.removeChild(selectCon);
    });
}