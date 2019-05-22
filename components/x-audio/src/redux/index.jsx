import { h, Component } from '@financial-times/x-engine';
import * as PropTypes from 'prop-types';
import { actions, initialState } from './player-logic';
import createStore from './store';

function wrapWithDispatch ({ dispatch }, actionsMap) {
	return Object.keys(actionsMap).reduce((acc, actionName) => ({
		...acc,
		[actionName]: (...args) => dispatch(actionsMap[actionName](...args))
	}), {});
}

export default function connectPlayer (Player) {
	const store = createStore();

	const playerActions = wrapWithDispatch(store, {
		onPlayClick: actions.requestPlay,
		onPauseClick: actions.requestPause,
		loadMedia: actions.loadMedia,
		willClose: actions.willClose
	});

	class ConnectedPlayer extends Component {
		constructor(props) {
			super(props);
			this.unsubscribe = store.subscribe(this.storeUpdated.bind(this));
			this.state = initialState;
		}

		componentDidMount() {
			const { playing, url, trackingContext } = this.props;
			console.log("component did mount")
			console.log(playing)
			//todo: if playing or autoplay maybe - focus on thingy. what ends up in audio though?
			//what is the send-through? bool option? function?
			//fires? when? everytime?

			playerActions.loadMedia({ url, trackingContext, autoplay: playing });
			// thing.focus();
		}

		componentWillUnmount() {
			playerActions.willClose();
			this.unsubscribe();
		}

		storeUpdated() {
			const nextState = store.getState();

			if (this.lastState !== nextState) {
				this.setState(nextState);
				this.lastState = nextState;
			}
		}

		componentDidUpdate(prevProps, prevState) {
			const { url, trackingContext } = this.props;
			if (prevProps.url !== url) {
				playerActions.loadMedia({ url, trackingContext, autoplay: true });
				return;
			}

			if (this.playingStateAndPropsNeedSync()) {
				this.updatePlayingStateFromProps(prevProps);
				this.notifyPlayingState(prevState);
			}

			if (this.audioHasEnded(prevState)) {
				this.props.notifiers.ended();
			}
		}

		audioHasEnded(prevState) {
			return !prevState.ended && this.state.ended === true;
		}

		playingStateAndPropsNeedSync() {
			return this.state.playing !== this.props.playing;
		}

		updatePlayingStateFromProps(prevProps) {
			if (!prevProps.playing && this.props.playing) {
				playerActions.onPlayClick();
			} else if (prevProps.playing && !this.props.playing) {
				playerActions.onPauseClick();
			}
		}

		notifyPlayingState(prevState) {
			if (!prevState.playing && this.state.playing) {
				this.props.notifiers.play();
			} else if (prevState.playing && !this.state.playing) {
				this.props.notifiers.pause();
			}
		}

		render() {
			const { title, seriesName, onCloseClick, expanded } = this.props;
			const { playing, currentTime, loading, duration, error } = this.state;
			return <Player
				{...playerActions}
				{...{
					playing,
					title,
					seriesName,
					onCloseClick,
					duration,
					currentTime,
					expanded,
					loading,
					error
				}}
			/>;
		}
	}

	ConnectedPlayer.defaultProps = {
		notifiers: {
			pause: () => {},
			play: () => {},
			ended: () => {}
		},
		onCloseClick: () => {},
	}
	ConnectedPlayer.propTypes = {
		notifiers: PropTypes.shape({
			play: PropTypes.func,
			pause: PropTypes.func
		}),
		onCloseClick: PropTypes.func,
		trackingContext: PropTypes.shape({
			contentId: PropTypes.string,
			playerType: PropTypes.string,
			audioSubtype: PropTypes.string
		}).isRequired
	}

	return ConnectedPlayer;
}
