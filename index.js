const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

const apiUrl = 'https://api.lyrics.ovh';


form.addEventListener("submit", e => {
    e.preventDefault();
    const searchValue = search.value.trim();

    
    if(!searchValue){
        alert("There is nothing to search");
    }
    else{
        searchSong(searchValue);
    }
    document.getElementById("form").reset();
});

async function searchSong(searchValue){
    const searchResult = await fetch(`${apiUrl}/suggest/${searchValue}`)
    const data = await searchResult.json();
    if(data.data.length > 10){
        data.data.length = 10;
    }
    showSongData(data);
};



function showSongData(data){
    result.innerHTML = `
    ${data.data.map(song =>`
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${song.title}</h3>                             
                        <p class="author lead">Album by <span>${song.artist.name}</span></p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button data-artist="${song.artist.name}" data-songTitle="${song.title}" class="btn btn-success">Get Lyrics</button>
                    </div>
                </div>  
                `
                ).join('')}
    `;
};


result.addEventListener("click", e => {
    const clickedEl = e.target;

    if (clickedEl.tagName === "BUTTON"){
        const artist = clickedEl.getAttribute("data-artist");
        const songTitle = clickedEl.getAttribute("data-songTitle");

        getLyrics(artist, songTitle);
    }
});



async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    
    if(data.error){
        alert("No lyrics found");
    }else{
        document.getElementById("lyrics").innerHTML = `<h2 class="text-success mb-4">${songTitle}--<strong>${artist}</strong></h2>
        <pre class="lyric text-white">${data.lyrics}</pre>
        `;
    }
};