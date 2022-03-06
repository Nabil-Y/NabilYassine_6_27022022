const path = window.location.href;
const photographerId = parseInt(path.substring(path.lastIndexOf('=')+1));

const photographerData = [];
const photographerMedia = [];

let likeCounter = 0;
let template = "";

async function getPhotographers() {
    await fetch("./data/photographers.json")
        .then(response => response.json())
        .then(data => usePhotographersData(data))
        .catch(error => console.log(error));
        console.log(photographerData); 
}

async function getMedia() {
    await fetch("./data/photographers.json")
        .then(response => response.json())
        .then(data => useMediaData(data))
        .catch(error => console.log(error));
        console.log(photographerMedia);
}


function completePhotographerCard() {
    const section = document.querySelector(".photograph-header");
    const photographer = new PhotographerFactory(photographerData[0]);
    section.innerHTML = photographer.createProfileHTML();
    document.getElementById("price").innerText = `${photographer.price}€/jour`
}

function completeSticky() {
    photographerMedia.forEach(photo => likeCounter += photo.likes);
    document.getElementById("like-counter").innerText = likeCounter;
}


function createGalleryCard() {
    const section = document.querySelector(".gallery-display");
    photographerMedia.forEach( media => {
        const newMedia = new MediaFactory(media);
        template += newMedia.createHTML();
    });
    section.innerHTML = template;
}


// Triage

document.getElementById("filter-select").addEventListener("input", filterGallery);

function filterGallery() {
    const newFilter = document.getElementById("filter-select").value;
    switch(newFilter) {
        case "Popularité":
            sortGallery("likes");
            return console.log("Populaire");
        break;
        case "Date":
            sortGallery("date");
            return console.log("Date");
        break;
        case "Titre":
            sortGallery("title")
            return console.log("Titre")
        break;
        default:
            return console.log("Error, invalid filter value");
        break;
    }  
}

// function comparator(a,b,key) {
//       a.dataset[key] < b.dataset[key] ? -1 
//     : a.dataset[key] > b.dataset[key] ?  1 
//     : 0;
// }

function comparator(a,b) {
    return a-b;
}

function sortGallery(key) {
    const galleryArray = Array.from(document.querySelectorAll(`[data-${key}]`));
    const sortedGallery = galleryArray.sort(comparator);
    sortedGallery.forEach(element => document.querySelector(".gallery-display").appendChild(element));

}

// Likes

function createLikeInteractions() {
    const likeButtons = Array.from(document.querySelectorAll(".likes"));
    const likeCounter = document.getElementById("like-counter");
    likeButtons.forEach(button => button.addEventListener("click", () => {
    if (button.getAttribute("data-liked") === "false") {
        button.closest("article").setAttribute('data-likes', parseInt(button.innerText) + 1);
        button.setAttribute("data-liked", "true");
        button.innerHTML = `${parseInt(button.innerText) + 1} <i class="fa-solid fa-heart"></i>`;
        likeCounter.innerText = parseInt(likeCounter.innerText) + 1 ;
    } else {
        button.closest("article").setAttribute('data-likes', parseInt(button.innerText) - 1);
        button.setAttribute("data-liked", "false");
        button.innerHTML = `${parseInt(button.innerText) - 1} <i class="fa-regular fa-heart"></i>` ;
        likeCounter.innerText = parseInt(likeCounter.innerText) - 1 ;
    }   
} ) )
}


// Initialisation

function usePhotographersData(data) {
    photographerData.push( ...data.photographers.filter(photographer => photographer.id === photographerId ));
    completePhotographerCard();
    createModalEvents();
}

function useMediaData(data) {
    photographerMedia.push( ...data.media.filter( content => content.photographerId === photographerId ))
    completeSticky();
    createGalleryCard();
    createLikeInteractions();
}

function init() {  
    getPhotographers();
    getMedia();
}

init();