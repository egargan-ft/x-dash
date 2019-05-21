import {
	REQUEST_PLAY,
	REQUEST_PAUSE,
	PLAY,
	PAUSE,
	ENDED
} from '../player-logic';

export class Notifier {
	
	getFunc(name) {
		return this.notifiers[name] || (() => {});
	}

	setNotifiers (notifiers) {
		this.notifiers = notifiers;
	}

	get tracking () {
		return this.getFunc('tracking');
	}
	get play () {
		return this.getFunc('play');
	}
	get pause () {
		return this.getFunc('pause');
	}
}

const notificationsMiddleware = notifier => (store) => {
	return next => action => {
		switch(action.type) {
			case REQUEST_PLAY:
				notifier.tracking({ action: 'play' });
				break;

			case REQUEST_PAUSE:
				notifier.tracking({ action: 'pause' });
				break;

			case PLAY:
				if (!store.getState().isPlayExternal) {
					notifier.play();
				}
				break;

			case PAUSE:
				if (!store.getState().isPauseExternal) {
					notifier.pause();
				}
				break;

			case ENDED:
				notifier.ended();
				break;
		}
		next(action);
	}
}

export default notificationsMiddleware;