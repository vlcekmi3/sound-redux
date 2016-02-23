import {CLIENT_ID} from '../constants/Config';

import {arrayOf, normalize} from 'normalizr';
import {songSchema} from '../constants/Schemas';

import {GENRES_MAP} from '../constants/SongConstants';
import {constructUrl} from '../utils/SongUtils';

export function addCommas(i) {
    if (i === null || i === undefined) {
        return;
    }

    return i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatSongTitle(str) {
    if (!str) {
        return '';
    }

    const arr = str.replace('–', '-').split(' - ');

    return arr[arr.length - 1].split(' (')[0];
}

export function formatSeconds(num) {
    const minutes = padZero(Math.floor(num / 60), 2);
    const seconds = padZero(num % 60, 2);
    return `${minutes}:${seconds}`;
}

export function formatStreamUrl(str) {
    return `${str}?client_id=${CLIENT_ID}`;
}

export function getSocialIcon(service) {
    switch(service) {
    case 'facebook':
        return 'ion-social-facebook';
    case 'twitter':
        return 'ion-social-twitter';
    case 'instagram':
        return 'ion-social-instagram';
    case 'youtube':
        return 'ion-social-youtube';
    case 'hypem':
        return 'ion-heart';
    case 'google_plus':
        return 'ion-social-googleplus';
    case 'spotify':
        return 'ion-music-note';
    case 'songkick':
        return 'ion-music-note';
    case 'soundcloud':
        return 'ion-music-note';
    default:
        return 'ion-ios-world-outline';
    }
}

function padZero(num, size) {
    let s = num + '';
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
}

//
export function formatSongsResponse(json, playlist) {
    let nextUrl = null;
    let futureUrl = null;
    if (json.next_href) {
        nextUrl = json.next_href;
    }

    if (json.future_href) {
        futureUrl = json.future_href;
    }

    const songs = json.collection
        .map(song => song.origin ? song.origin : song)
        .filter(song => {
            if (playlist in GENRES_MAP) {
                return song.streamable && song.kind === 'track' && song.duration < 600000;
            }
            return song.streamable && song.kind === 'track';
        });
    const normalized = normalize(songs, arrayOf(songSchema));
    const result = normalized.result.reduce((arr, songId) => {
        if (arr.indexOf(songId) === -1) {
            arr.push(songId);
        }
        return arr;
    }, []);

    return {
        entities: normalized.entities,
        songs: result,
        playlist: playlist,
        nextUrl: nextUrl,
        futureUrl: futureUrl
    };
}

export function getNextUrl(playlists, playlist) {
    const activePlaylist = playlists[playlist];
    if (!activePlaylist || activePlaylist.nextUrl === false) {
        return constructUrl(playlist);
    }
    return activePlaylist.nextUrl;
}
