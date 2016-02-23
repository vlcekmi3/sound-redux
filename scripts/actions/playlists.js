import {changePlayingSong} from '../actions/player';
import * as types from '../constants/ActionTypes';
import {AUTHED_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';

import {getPlayingPlaylist} from '../utils/PlayerUtils';

export function fetchSongsIfNeeded(playlist) {
    return {
        type: types.FETCH_SONGS,
        playlist
    };
}

export function receiveSongs(entities, songs, playlist, nextUrl, futureUrl) {
    return {
        type: types.RECEIVE_SONGS,
        entities,
        futureUrl,
        nextUrl,
        playlist,
        songs
    };
}

export function removeUnlikedSongsPre() {
    return (dispatch, getState) => {
        const LIKES_PLAYLIST_KEY = 'likes' + AUTHED_PLAYLIST_SUFFIX;
        const {authed, player, playlists} = getState();
        const {currentSongIndex} = player;
        const playingPlaylist = getPlayingPlaylist(player);

        const likedSongs = playlists[LIKES_PLAYLIST_KEY].items
            .filter(songId => songId in authed.likes && authed.likes[songId] === 1);

        if (playingPlaylist === LIKES_PLAYLIST_KEY
        && currentSongIndex >= likedSongs.length) {
            dispatch(changePlayingSong(null));
        }

        dispatch(removeUnlikedSongs(likedSongs));
    };
}

function removeUnlikedSongs(songs) {
    return {
        type: types.REMOVE_UNLIKED_SONGS,
        songs
    };
}

export function requestSongs(playlist) {
    return {
        type: types.REQUEST_SONGS,
        playlist: playlist
    };
}
