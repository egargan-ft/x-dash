const h = require('@financial-times/x-engine');
const Meta = require('./Meta');
const Actions = require('./Actions');
const Container = require('./Container');
const Content = require('./Content');
const Headshot = require('./Headshot');
const Image = require('./Image');
const Status = require('./Status');
const Standfirst = require('./Standfirst');
const Title = require('./Title');

const DefaultFeatures = {
	showMeta: false,
	showTitle: true,
	showStandfirst: false,
	showStatus: false,
	showImage: false,
	showActions: false,
	showHeadshot: false
};

const DefaultOptions = {
	useTitleVariant: false,
	useStandfirstVariant: false,
	useRelativeTime: false,
	useAlternativeConcept: false,
	imageSize: 'Small',
	modifiers: []
};

const Teaser = (props) => {
	props = { ...DefaultFeatures, ...DefaultOptions, ...props };

	return (
		<Container {...props}>
			<Content>
				{props.showMeta ? <Meta {...props} /> : null}
				{props.showTitle ? <Title {...props} /> : null}
				{props.showStandfirst ? <Standfirst {...props} /> : null}
				{props.showStatus ? <Status {...props} /> : null}
				{props.showActions ? <Actions {...props} /> : null}
				{props.showHeadshot ? <Headshot {...props} /> : null}
			</Content>
			{props.showImage ? <Image {...props} /> : null}
		</Container>
	);
};

module.exports = {
	Actions,
	Container,
	Content,
	Headshot,
	Image,
	Meta,
	Standfirst,
	Status,
	Teaser,
	Title
};

module.exports.presets = require('./concerns/presets');
