/*
e8542494
27d27563
"12855f1e"
*/
const apiKey = 'e8542494';
let currentPosterHover = null;
let posterThings;
let movies = {};
let titles = [];
let page = 1;
let title = '';
let index = 0;
let genreId = 0;
let genreSelected = 'Horror';
let titlesString = localStorage.getItem('titles');
titles = JSON.parse(titlesString);
let titlesPerPage = 15;
let searchResults = [];
let posterNum = 0;

function resetGlobals () {
    return;
    currentPosterHover = null;
    posterThings;
    movies = {};
    titles = [];
    page = 1;
    title = '';
    index = 0;
    genreId = 0;
    genreSelected = 'Horror';
    titlesString = localStorage.getItem('titles');
    titles = JSON.parse(titlesString);
    titlesPerPage = 15;
    searchResults = [];
    posterNum = 0;
}

/*
{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}
*/

const main = Q('.genres');
let genres = [
    {
        name: "Action",
        id: 28,
        image: "./assets/images/action.jpg"
    },
    {
        name: "Comedy",
        id: 35,
        image: "./assets/images/comedy.jpg"
    },
    {
        name: "Crime",
        id: 80,
        image: "./assets/images/crime.jpg"
    },
    {
        name: "Drama",
        id: 18,
        image: "./assets/images/drama.jpg"
    },
    {
        name: "Horror",
        id: 27,
        image: "./assets/images/horror.jpg"
    },
    {
        name: "Science Fiction",
        id: 878,
        image: "./assets/images/science-fiction.jpg"
    },
    {
        name: "Fantasy",
        id: 14,
        image: "./assets/images/fantasy.jpg"
    },
    {
        name: "Family",
        id: 10751,
        image: "./assets/images/family.jpg"
    },
    {
        name: "Western",
        id: 37,
        image: "./assets/images/western.jpg"
    },
]


Q('.header__form').addEventListener('submit', formHandler);
Q('.header__home-anchor').addEventListener('click', goHome);

function goHome (e) {
    e.stopPropagation();
    Q('.posters').innerHTML = '';
    Q('.genres').style.display = 'block';
    Q('.main__title').innerText = 'genres';
    resetGlobals();
}

function formHandler (e) {
    e.preventDefault();
    getMovieListByTitle (e.target.chosen.value);
}

function createGenreCard (index, parent) {
    const genreCard = C(parent, "div", "genres__card");
    const ticket = C(genreCard, "p", "genres__display-movies");
    ticket.innerHTML = '<i class="fa-solid fa-ticket fa-3x"></i>';
    ticket.addEventListener ('click', (e) => {
        genreId = genres[index].id;
        genreSelected = genres[index].name;
        page = 1;
        showMovieList (e);
    })
    const genreTitleContainer = C(genreCard, "div", "genres__title-container");
    const image = C(genreTitleContainer, 'img', "genres__image", "", {src: genres[index].image, alt: "yeah"});
    const genreTitle = C(genreTitleContainer, "h1", "genres__title", genres[index].name);
}

function buildGenresPage (parent) {
    titles = [];

    const genresCards = C(parent, 'div', 'genres__cards');
    Q('.main__title').innerText = 'Genres';

    for (let i = 0; i < genres.length; i++) {
        createGenreCard(i, genresCards); 
    }
 
    // debug only
    // parent.style.display = 'none';
    // showPosters();
}


function showMovieList () {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=15f23bd062900538ef836210f0220b7c&with_genres=${genreId}&page=${page}`;
    console.log("showMovieList", url);
    
    let request = {
        url: url,
        method: 'get'
    }

    axios(request)
    .then (response => {
        console.log ('showMovieList - then', response)
        movies = response.data.results;
        title = movies[index++].title;
        getMovieList(); 
    })
    .catch (error => {
        console.log(error);
    })
}

function turnOffError() {
    Q('.header__error').classList.remove('header__error--fade-in');
}

function getMovieListByTitle (search) {
    let request = {};
    
    request = {
        method: 'get',
        url: "https://www.omdbapi.com/",
        params: {
            apikey: apiKey,
            s: search
        }
    }
    
    console.log ('getMovieList', 'pre-axios')
    axios(request)
    .then (response => {
        console.log ('movieSearchResult', response.data.Search);
        searchResults = response.data.Search;
        if (!searchResults || searchResults.length === 0) {
            // alert ("There are no movies with that search criteria.");
            const headerError = Q('.header__error');
            console.log (headerError);
            headerError.classList.add('header__error--fade-in');
            setTimeout(turnOffError, 5000);
            return;
        }
        title = searchResults.pop().Title;
        console.log (title);
        // alert ("here you go")
        titles = [];
        getSearchTitles ();
    })
    .catch (error => {
        console.log(error);
    })
}

function getSearchTitles () {
    request = {
        method: 'get',
        url: "https://www.omdbapi.com/",
        params: {
            apikey: apiKey,
            t: title
        }
    }
    genreSelected = "Searched"
    console.log ('getMovieList', 'pre-axios')
    axios(request)
    .then (response => {
        console.log (response);
        titles.push(response.data);
        console.log ('getMovieList - push', titles);
        if (searchResults.length) {
            title = searchResults.pop().Title;    
            getSearchTitles();
        } else {
            console.log (titles);
            gotTitles ();
        }
    })
    .catch (error => {
        console.log(error);
    })
}

function getMovieList () {
    let request = {};
    
        request = {
            method: 'get',
            url: "https://www.omdbapi.com/",
            params: {
                apikey: apiKey,
                t: title
            }
        }
    
    console.log ('getMovieList', 'pre-axios')
    axios(request)
    .then (response => {
        console.log (response);
        titles.push(response.data);
        console.log ('getMovieList - push', titles);
        if (titles.length < titlesPerPage) {
            if (index < 20) {
                title = movies[index++].title;    
                getMovieList ();
            } else {
                ++page;
                index = 0;
                showMovieList();    
            }
        } else {
            gotTitles ();
        }
    })
    .catch (error => {
        console.log(error);
    })
}

function gotTitles () {
    const parent = Q('.genres');
    parent.style.display = "none";
    
    //debugging only
    // localStorage.setItem('titles', JSON.stringify(titles));
    showPosters(parent);
}

function showPosters() {
    console.log(titles);

    Q('.main__title').innerText = `${genreSelected} Movies`;
    
    const main = Q('main');
    
    posters = Q('.posters');
    posters.innerHTML = '';

    for (let i = 0; i < titles.length; ++i) {
        if (titles[i].Poster === "N/A") continue;
        
        if (titles[i].Title === undefined) continue;
        //.flip-card
        let posterContainer = C(posters, 'div', 'posters__poster-container');
        
        //.flip-card-inner
        const posterCardInner = C(posterContainer, 'div', 'posters__card-inner');
        
        //.flip-card-front
        const posterCardFront = C(posterCardInner, 'div', 'posters__card-front')
        C(posterCardFront, 'img', 'posters__poster', '', {
            src: titles[i].Poster,
            alt: titles[i].Title
        })

        //.flip-card-back
        const posterCardBack = C(posterCardInner, 'div', 'posters__card-back');
        const plot = C(posterCardBack, 'p', 'posters__plot', titles[i].Plot)
        const actors = C(posterCardBack, 'p', 'posters__label', 'Actors:');
        C(posterCardBack, 'p', 'posters__value', titles[i].Actors);

        const year = C(posterCardBack, 'p', 'posters__label', 'Year:');
        C(posterCardBack, 'p', 'posters__value', titles[i].Year);
        if (titles[i].BoxOffice !== "N/A") {
            const boxOffice = C (posterCardBack, 'p', 'posters__label', 'Box Office:');
            C (posterCardBack, 'p', 'posters__value', titles[i].BoxOffice);
        }
        const rating = C(posterCardBack, 'p', 'posters__label', "Rating:");
        C(posterCardBack, 'p', 'posters__value', titles[i].imdbRating);
        console.log (titles[i]);
    }     
}



buildGenresPage(main)

// debugging only

//showPosters (Q('.genres'));


// animation for posters

function slideThePoster (e) {
    let target = e.target;
    // return previous image back to original position
    // if (target.classList.contains('posters__poster')) {
    //     target = target.parentElement;
    // }
    
    if (currentPosterHover === target) return;

    console.log ('slideThePoster', currentPosterHover, target);

    if (currentPosterHover !== null) {
        currentPosterHover.classList.remove('posters__poster--slide');
    }

    // slide the current photo into position
    target.classList.add('posters__poster--slide');
    currentPosterHover = target;
    
    e.stopPropagation();
    return false;
}

function returnThePoster () {
    if (currentPosterHover !== null) currentPosterHover.classList.remove('posters__poster--slide');
    currentPosterHover = null;
}

