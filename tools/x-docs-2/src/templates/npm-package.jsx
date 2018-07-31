import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layouts/basic';

const Template = ({ data }) => {
	return (
		<Layout title={data.npmPackage.manifest.name}>
			<div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
		</Layout>
	);
};

export default Template;

export const pageQuery = graphql`
	query($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			html
		}
		npmPackage(fields: { slug: { eq: $slug } }) {
			manifest
		}
	}
`;
