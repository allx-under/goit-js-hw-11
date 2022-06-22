import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const KEY = "28193181-1d0a0826250053d79f38b5461";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn:document.querySelector('.load-more')
}

let page = 1;
let searchContent = "";

refs.searchForm.addEventListener('submit', inInputSearch)
refs.loadMoreBtn.addEventListener('click', showMoreOnClick)

async function getData(content) {

    const response = await axios.get(`${BASE_URL}/?key=${KEY}&q=${content}&image_type=photo&orientation=horizontal&safesearch=true&&page=${page}&per_page=40`);
    return response;
    
}

async function inInputSearch(e) {
    e.preventDefault();
    resetIfNewInput(e);

    searchContent = e.target.elements.searchQuery.value;
    
    try {
        const { data } = await getData(searchContent);
        renderResults(data);
         if (data.hits.length === 0) {
        return Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        refs.loadMoreBtn.classList.remove('is-hidden');
        addSimpleLigthBox();
    } catch (error) {
        console.log(error)
        
    }
    refs.searchForm.reset();
    page += 1;
}

async function showMoreOnClick() {
    try {
        const { data } = await getData(searchContent);
        renderResults(data);
        addSimpleLigthBox()
        if (data.hits.length < 40) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notify.failure("We're sorry, but you've reached the end of search results.")
        }
        page += 1;
    
    } catch (error) {
        console.log(error)
        
    }
}

function renderResults(data) {
    const galleryItems = data.hits.map(hit => {
            const {webformatURL,largeImageURL,tags, likes,views,comments,downloads } = hit;
           return `<div class="photo-card">
                <a href="${largeImageURL}"><img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" width=300px height=280px /></a>
                <div class="info">
                <p class="info-item">
                <b>Likes</b>${likes}
                </p>
                <p class="info-item">
                <b>Views</b>${views}
                </p>
                <p class="info-item">
                <b>Comments</b>${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>${downloads}
                </p>
                </div>
                </div>`
        }
        ).join('');
        refs.gallery.insertAdjacentHTML('beforeend',galleryItems);
}

function resetIfNewInput(event) {
    if (searchContent !== event.target.elements.searchQuery.value) {
        page = 1;
        refs.gallery.innerHTML = "";
        refs.loadMoreBtn.classList.add('is-hidden')
    }
}

function addSimpleLigthBox() {
    let gallery = new SimpleLightbox('.photo-card a')
}


