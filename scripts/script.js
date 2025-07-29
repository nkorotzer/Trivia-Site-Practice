let mainImage = document.querySelector("#mainImage");
let imageCaption = document.querySelector(".textCon");
let changeImageBtn = document.querySelector("#changeImageBtn");
let refreshDataBtn = document.querySelector("#refreshDataBtn");
let seasonText = document.querySelector(".season");
let seasonYearText = document.querySelector(".seasonYear");
let anilistData;

changeImageBtn.addEventListener("click", function () {
    let userInput = parseInt(prompt("Enter an anime ID"));
    searchAnimeByID(userInput).then( () => {
        refreshData();
    });
});

refreshDataBtn.addEventListener("click", refreshData);

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