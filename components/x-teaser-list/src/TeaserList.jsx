import { h } from '@financial-times/x-engine';
import { ArticleSaveButton } from '@financial-times/x-article-save-button';
import { Teaser, presets } from '@financial-times/x-teaser';
import classNames from 'classnames';
import styles from './TeaserList.scss';

const TeaserList = ({ items = [], showSaveButtons = true }) => (
	<div className={classNames(styles.teaserList)}>
		<ul className={classNames(styles.list)}>
		{items.map(item => {
			return (
				<li
					key={item.id}
					className={classNames(styles.listItem, { [styles.listItemWithActions]: showSaveButtons })}
				>
					<div className={classNames(styles.listItem__article)}>
						<Teaser
							{...item}
							{...presets.Small}
							theme="teaser-list"
						/>
					</div>
					{showSaveButtons && <div className={classNames(styles.listItem__actions)}>
						<ArticleSaveButton
							id={`${item.id}-save-button`}
							contentId={item.id}
							contentTitle={item.title}
							csrfToken="dummy-token"
							saved={true}
						/>
					</div>}
				</li>
			);
		})}
		</ul>
	</div>
);

export { TeaserList };
