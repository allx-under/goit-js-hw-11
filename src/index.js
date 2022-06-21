import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const KEY = "28193181-1d0a0826250053d79f38b5461";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery')
}



refs.searchForm.addEventListener('submit', inInputSearch)

async function getData(content) {

    const response = await axios.get(`${BASE_URL}/?key=${KEY}&q=${content}&image_type=photo&orientation=horizontal&safesearch=true`);
    return response;
    
}

async function inInputSearch(e) {
    e.preventDefault();
    const searchContent = e.target.elements.searchQuery.value;
    try {
        const { data } = await getData(searchContent);

        const galleryItems = data.hits.map(hit => {
            const {webformatURL,largeImageURL,tags, likes,views,comments,downloads } = hit;
           return `<div class="photo-card">
                <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info">
                <p class="info-item">
                <b>Likes${likes}</b>
                </p>
                <p class="info-item">
                <b>Views${views}</b>
                </p>
                <p class="info-item">
                <b>Comments${comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads${downloads}</b>
                </p>
                </div>
                </div>`
        }
        ).join('');
        refs.gallery.innerHTML = galleryItems;
        let gallery = new SimpleLightbox('.photo-card a');
        showMsgInCaseNoResults(data.hits.length)

    } catch (error) {
        console.log(error)
        
    }
    refs.searchForm.reset();
}

function renderResults() {
    
}

function showMsgInCaseNoResults(array) {
    if (array === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
}


