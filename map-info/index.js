const HOST = '127.0.0.1:24050';
const socket = new ReconnectingWebSocket(`ws://${HOST}/ws`);
let mapid = document.getElementById('mapid');

let bg = document.getElementById("mapInfo");
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let mapper = document.getElementById("mapper");
let difficulty = document.getElementById("difficulty");
let length = document.getElementById("length");
let cs = document.getElementById("cs");

let ar = document.getElementById("ar");
let od = document.getElementById("od");
let hp = document.getElementById("hp");
let bpm = document.getElementById("bpm");
let sr = document.getElementById("sr");
let pick = document.getElementById("pick");
let img;
let tempId=-727, tempImg, tempCs, tempAr, tempOd, tempHp, tempBPM, tempSR, tempTitle, tempArtist, tempMapper, tempDifficulty, tempMods, tempLength;
let mappool = {};

// Fetch the mappool once and store it
fetch('../mappool.json')
    .then(response => response.json())
    .then(data => mappool = data)
    .catch(error => console.error('Error loading mappool:', error));

socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (data.menu.mods.str == "") {
        data.menu.mods.str = "NM";
    }
    if (tempId !== data.menu.bm.id || tempArtist !== data.menu.bm.metadata.artist) {
        tempId = data.menu.bm.id
        if (tempId === 0) {
            for (let key in mappool["custom"]) {
                console.log(data.menu.bm.metadata.title.toLowerCase());
                if (data.menu.bm.metadata.title.toLowerCase().includes(key.toLowerCase())) {
                    pick.innerHTML = mappool["custom"][key];
                    break;
                }
            }  
        }
        else if (mappool[data.menu.bm.id] !== undefined) {
            pick.innerHTML = mappool[data.menu.bm.id];
        } else {
            pick.innerHTML = "N/A";
        }
    }
    
    if (tempImg !== data.menu.bm.path.full) {
        tempImg = data.menu.bm.path.full
        img = encodeURIComponent(tempImg).replace(/%2F/g, '/');
        bg.style.backgroundImage = `linear-gradient(to left, rgba(32, 136, 189, 1), 30%, rgba(6, 25, 35, 0.35)), url(\'http://${HOST}/Songs/${img}\')`
    }
    const newTitle = `${data.menu.bm.metadata.title} [${data.menu.bm.metadata.difficulty}]`;
    if (tempTitle !== newTitle) {
        tempTitle = newTitle;
        title.innerHTML = tempTitle;
    }

    if (data.menu.bm.metadata.artist !== tempArtist) {
        tempArtist = data.menu.bm.metadata.artist
        artist.innerHTML = `${tempArtist} `
    }

    if (data.menu.bm.metadata.mapper !== tempMapper) {
        tempMapper = data.menu.bm.metadata.mapper
        mapper.innerHTML = `Mapped by <span class="mapper">${tempMapper}</span>`
    }
    
    const newTime = data.menu.bm.time.full;
    const minutes = Math.floor(newTime / 60000);
    const seconds = Math.floor((newTime % 60000) / 1000);
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (formattedTime !== tempLength) {
        tempLength = formattedTime;
        length.innerHTML = `Length: <span class="value">${tempLength}</span>`
    }
    
    if (data.menu.bm.stats.CS != tempCs) {
        tempCs = data.menu.bm.stats.CS
        cs.innerHTML = `CS: <span class="value">${Math.round(tempCs * 100) / 100}</span>`
    }
    if (data.menu.bm.stats.AR != tempAr) {
        tempAr = data.menu.bm.stats.AR
        ar.innerHTML = `AR: <span class="value">${Math.round(tempAr * 100) / 100}</span>`
    }
    if (data.menu.bm.stats.OD != tempOd) {
        tempOd = data.menu.bm.stats.OD
        od.innerHTML = `OD: <span class="value">${Math.round(tempOd * 100) / 100}</span>`
    }
    if (data.menu.bm.stats.HP != tempHp) {
        tempHp = data.menu.bm.stats.HP
        hp.innerHTML = `HP: <span class="value">${Math.round(tempHp * 100) / 100}</span>`
    }
    if (data.menu.bm.stats.BPM.common != tempBPM) {
        tempBPM = data.menu.bm.stats.BPM.common
        bpm.innerHTML = `BPM: <span class="value">${Math.round(tempBPM * 100) / 100}</span>`
    }
    if (data.menu.bm.stats.fullSR != tempSR) {
        tempSR = data.menu.bm.stats.fullSR
        sr.innerHTML = `SR: <span class="value">${Math.round(tempSR * 100) / 100}*</span>`
    }
    
    
}

