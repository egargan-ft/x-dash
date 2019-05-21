/*eslint-disable no-console */

module.exports = (data, { boolean, text, number, object }) => {
	// Public props can be set externally and their values
	// with be used by the component, e.g `playing`
	const PUBLIC = 'Public';
	const PRIVATE = 'Private';

	return {
		title: text('Title', data.title, PUBLIC),
		seriesName: text('Series name', data.seriesName, PUBLIC),
		playing: boolean('Playing', data.playing, PUBLIC),
		expanded: boolean('Expanded', data.expanded, PUBLIC),
		url: text('Audio url', data.url, PUBLIC),
		currentTime: number('Current time', data.currentTime, {}, PRIVATE),
		loading: boolean('Loading', data.loading, PRIVATE),
		trackingContext: object('Tracking Context', data.trackingContext, PUBLIC),
		error: boolean('Error', data.error, PRIVATE),

		onPlayClick: () => console.log('Pressed play'),
		onPauseClick: () => console.log('Pressed pause'),
		onCloseClick: () => console.log('Pressed close'),
	}
};

/*eslint-enable no-console */