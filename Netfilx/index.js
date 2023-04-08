const apikey="bf8964b7681eb8e62d8b7c6d039a79c6";
const endpoint="https://api.themoviedb.org/3/"
// const imgpath="https://www.themoviedb.org/t/p/w440_and_h660_face";
const imgpath = "https://image.tmdb.org/t/p/original";


const apipath={
    fetchAllCategories: `${endpoint}genre/movie/list?api_key=${apikey}`,
    fetchMoviesList:(id) =>`${endpoint}discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${endpoint}trending/all/day?api_key=${apikey}`
}

function init(){
    fetchTrendingMovies()
    fetchAndbulidAllSection();
}
function fetchTrendingMovies(){
    fetchAndBuildMovie(apipath.fetchTrending,'Trending Now')
    .then(list =>{
        const randomIndex=parseInt(Math.random()*list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err =>{
        console.error(err)
    })
}
function buildBannerSection(movie){
    const BannerCont=document.getElementById('banner-section');
    BannerCont.style.backgroundImage=`url('${imgpath}${movie.backdrop_path}')`;

    const div=document.createElement('div');
    div.innerHTML=`
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">Trending in movie | Released - ${movie.release_date}</p>
    <p class="banner_overview">${movie.overview}</p>
    <div class="action-buttons">
        <button class="action-button"><i class="fa-solid fa-play"></i>Play</button>
        <button class="action-button"><i class="fa-sharp fa-solid fa-circle-info"></i>More Info</button>
    </div>
    `;
    div.className="banner-content container";
    BannerCont.append(div)

    
}

function fetchAndbulidAllSection(){
    fetch(apipath.fetchAllCategories)
    .then(res=> res.json())
    .then(res=> {
        const categories=res.genres;
        if(Array.isArray(categories) && categories.length){
           categories.forEach(category=> {
            fetchAndBuildMovie(apipath.fetchMoviesList(category.id),category.name);
           })
        }
        // console.table(category)
    })
    .catch(err=> console.error(err));
}

function fetchAndBuildMovie(fetchUrl, categoryName ){ 
    console.log(fetchUrl,categoryName)
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res =>{
        // console.table(res.results)
        const movies=res.results
        if(Array.isArray(movies) && movies.length){
            BuildMovie(movies.slice(0.6),categoryName)
        }
        return movies;
    })
    .catch(err => console.error(err))
}

function BuildMovie(list,categoryName){
    console.log(list, categoryName)

    const movieCont=document.getElementById('movies-cont')
    
    const moviesListHtml= list.map(item =>{
        return `
        <img class="movie-item" src="${imgpath}${item.backdrop_path}" alt="${item.title}">
        `;
    }).join('');
    const moviesSectionHtml=`
    <h2 class="movie-heading">${categoryName}
        <span class="explore">Explore All</span> </h2>
        <div class="movie-row">
        ${moviesListHtml}
        </div>
    `
    console.log(moviesSectionHtml);

    const div=document.createElement('div');
    div.className="movie-section";
    div.innerHTML=moviesSectionHtml;
    movieCont.append(div);
}


window.addEventListener('load',function()
{
    init();
    window.addEventListener('scroll',function(){
        const header=document.getElementById('header')
        if(window.scrollY > 5)header.classList.add('black-bg')
        else header.classList.remove('black-bg')
    })
  
})
