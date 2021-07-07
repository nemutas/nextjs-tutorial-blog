import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Date from '../../components/date';
import Layout from '../../components/layout';
import {
	getAllPostIds, getAllPostIdsFromFirebase, getPostData, getPostDataFromFirebase
} from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';

type PropsType = {
	postData: {
		title: string;
		date: string;
		contentHtml: string;
	};
};

export default function Post({ postData }: PropsType) {
	return (
		<Layout>
			<Head>
				<title>{postData.title}</title>
			</Head>

			<article>
				<h1 className={utilStyles.headingXl}>{postData.title}</h1>
				<div className={utilStyles.lightText}>
					<Date dateString={postData.date} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
			</article>
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	// const paths = getAllPostIds();
	const paths = await getAllPostIdsFromFirebase();
	return {
		paths,
		fallback: false
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	// const postData = await getPostData(params.id as string);
	const postData = await getPostDataFromFirebase(params.id as string);
	return {
		props: {
			postData
		}
	};
};
