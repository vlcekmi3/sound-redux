import { take, call, put } from 'redux-saga/effects';
import { takeEvery, takeLatest } from 'redux-saga';

import * as types from '../constants/ActionTypes'
import * as actions from '../actions/playlists';

import * as utils from '../utils/FormatUtils';

function fetchSongsApi(url) {
	return fetch(url)
		.then(response => response.json())
		.catch(err => {
			throw err;
		});
}

export default function* saga(getState) {
	yield* takeLatest(types.FETCH_SONGS, fetchSongs, getState);
}

function* fetchSongs(getState, action) {
	const playlist = action.playlist
	const {playlists} = getState()

	if (shouldFetchSongs(playlists, playlist)) {
		yield put(actions.requestSongs(action.playlist))
		const data = yield call(fetchSongsApi, utils.getNextUrl(playlists, playlist), playlist)
		const formattedData = utils.formatSongsResponse(data, playlist);
		yield put(actions.receiveSongs(formattedData.entities, formattedData.songs, formattedData.playlist, formattedData.nextUrl, formattedData.futureUrl))
	}
}

// helpers
function shouldFetchSongs(playlists, playlist) {
	const activePlaylist = playlists[playlist];
	if (!activePlaylist || !activePlaylist.isFetching && (activePlaylist.nextUrl !== null)) {
		return true;
	}

	return false;
}
