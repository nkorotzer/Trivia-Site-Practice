let mainImage = document.querySelector("#mainImage");
let imageCaption = document.querySelector(".textCon");
let changeImageBtn = document.querySelector("#changeImageBtn");

changeImageBtn.addEventListener("click", function () {
    if (mainImage.getAttribute('src') === "./images/sun.jfif") {
        mainImage.setAttribute('src', "./images/fez.jfif");
        mainImage.setAttribute('alt', "A fez");
        imageCaption.textContent = "A fez";
    }
    else {
        mainImage.setAttribute('src', "./images/sun.jfif");
        mainImage.setAttribute('alt', "A sun hat");
        imageCaption.textContent = "A sun hat";
    }
})

let anilistData

// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
var query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    id
    title {
      romaji
      english
      native
    }
  }
}
`;

// Define our query variables and values that will be used in the query request
var variables = {
    id: 15125
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
fetch(url, options).then(handleResponse)
    .then(handleData)
    .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
    anilistData = data;
    printAniData();
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}

function printAniData() {
    console.log("anilist data = ", anilistData.data);
    console.log("anilist media = ", anilistData.data.Media);
    console.log("anilist id = ", anilistData.data.Media.id);
    console.log("anilist title = ", anilistData.data.Media.title.romaji);
}
