// intial state
export const initialState = {
	playing: false,
	loading: false,
	currentTime: 0,
	ended: false
}

// reducer
export function reducer (state = initialState, action) {
	switch (action.type) {
		case 'PLAY':
			return { ...state, playing: true, ended: false };
		case 'PAUSE':
			return { ...state, playing: false };
		case 'LOADING':
			return { ...state, loading: true };
		case 'LOADED':
			return { ...state, loading: false };
		case 'UPDATE_CURRENT_TIME':
			return { ...state, currentTime: action.currentTime };
		case 'ENDED':
			return { ...state, ended: true };
		case 'REQUEST_PLAY':
			return { ...state, ended: false };
		default:
			return state;
	}
}


// actions
export const actions = {
	loadMedia: ({ url, metadata }) => ({
		type: 'LOAD_MEDIA',
		url,
		metadata
	}),
	play: () => ({
		type: 'PLAY'
	}),
	pause: () => ({
		type: 'PAUSE'
	}),
	requestPlay: () => ({
		type: 'REQUEST_PLAY'
	}),
	requestPause: () => ({
		type: 'REQUEST_PAUSE'
	}),
	loading: () => ({
		type: 'LOADING'
	}),
	loaded: () => ({
		type: 'LOADED'
	}),
	updateCurrentTime: ({ currentTime }) => ({
		type: 'UPDATE_CURRENT_TIME',
		currentTime
	}),
	ended: () => ({
		type: 'ENDED'
	})
}


// middleware
export const middleware = (store, audio = new Audio()) => {

	audio.preload = 'metadata';

	// debuging
	[
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'progress',
		'canplay',
		'canplaythrough'
	].forEach(evtName => {
		audio.addEventListener(evtName, () => {
			// console.log('audio eventy', evtName);
		});
	});

	audio.addEventListener('play', () => store.dispatch(actions.play()));

	audio.addEventListener('pause', () => store.dispatch(actions.pause()));

	// loading / loaded events
	audio.addEventListener('waiting', () => store.dispatch(actions.loading()));
	audio.addEventListener('stalled', () => store.dispatch(actions.loading()));
	audio.addEventListener('loadstart', () => store.dispatch(actions.loading()));
	audio.addEventListener('loadedmetadata', () => store.dispatch(actions.loading()));
	audio.addEventListener('loadeddata', () => store.dispatch(actions.loading()));
	audio.addEventListener('canplay', () => store.dispatch(actions.loaded()));

	audio.addEventListener('timeupdate', () => {
		const state = store.getState();
		const newCurrentTime = Math.floor(audio.currentTime);

		if (state.currentTime !== newCurrentTime) {
			store.dispatch(actions.updateCurrentTime({ currentTime: newCurrentTime }));
		}
	});

	audio.addEventListener('ended', () => store.dispatch(actions.ended()));

	return next => action => {
		switch (action.type) {
			case 'LOAD_MEDIA':
				audio.src = action.url;
				// setup tracking
				break;
			case 'REQUEST_PLAY':
				audio.play();
				break;
			case 'REQUEST_PAUSE':
				audio.pause();
				break;
		}
		next(action);
	}
}

// debug
