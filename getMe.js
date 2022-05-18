const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token =
	"BQCYOH3v9ui4L4Tlr7ScrDdf-IaIR-CYEikLBUPyw7TFdVtwxCJ6TiFsN3ixMKD0GRZ4gPvtz8HBWylMgbwBOtWbq_lHJWhX6f_4yJxGyRmij3EG0W6mn0AfdLWUD79xPMOzvGfHoNU-DUnHq0E8gKMMfdVFCt3NDAPX52vubGp1XzmsewaHHbrLBWj53GLgVH1DHIuH0uCUTwrwR4FuFoadIwadkf1wvWULvUcdjWgnWCwXdAa_Nko0lgrROy_WqX7semvTX8VERzwqjOLbJUhwIMSI9l0s1g";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();
