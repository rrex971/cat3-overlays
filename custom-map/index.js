const HOST = '127.0.0.1:24050';
const socket = new ReconnectingWebSocket(`ws://${HOST}/ws`);
let overlay = document.getElementById('custom');

let tempId=-727, tempArtist;
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

    if (tempId !== data.menu.bm.id || tempArtist !== data.menu.bm.metadata.artist) {
        tempId = data.menu.bm.id
        tempArtist = data.menu.bm.metadata.artist;
        if (tempId === 0) {
            for (let key in mappool["custom"]) {
                console.log(data.menu.bm.metadata.title.toLowerCase());
                if (data.menu.bm.metadata.title.toLowerCase().includes(key.toLowerCase())) {
                    overlay.style.visibility = "visible";
                }
            }  
        }
        else {
            overlay.style.visibility = "hidden";
        }
    }
    
    
}

