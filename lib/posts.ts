import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import remark from 'remark';
import html from 'remark-html';
import { getArticleText, getFilePaths } from '../firebase/nodeFunctions';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map(fileName => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '');

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf8');

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...(matterResult.data as { date: string; title: string })
		};
	});
	// Sort posts by date
	return allPostsData.sort(({ date: a }, { date: b }) => {
		if (a < b) {
			return 1;
		} else if (a > b) {
			return -1;
		} else {
			return 0;
		}
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);

	// Returns an array that looks like this:
	// [
	//   {
	//     params: {
	//       id: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       id: 'pre-rendering'
	//     }
	//   }
	// ]
	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, '')
			}
		};
	});
}

export async function getPostData(id: string) {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, 'utf8');

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	const processedContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processedContent.toString();

	// Combine the data with the id and contentHtml
	return {
		id,
		contentHtml,
		...(matterResult.data as { date: string; title: string })
	};
}

// =================================================
// Get Contents From Firebase Storage

export async function getSortedPostsDataFromFirebase() {
	const filePaths = await getFilePaths();

	const allPostsData = await Promise.all(
		filePaths.map(async filePath => {
			const fileName = path.basename(filePath);
			const id = fileName.replace(/\.md$/, '');

			const fileContents = await getArticleText(fileName);

			const matterResult = matter(fileContents);

			return {
				id,
				...(matterResult.data as { date: string; title: string })
			};
		})
	);

	// Sort posts by date
	return allPostsData.sort(({ date: a }, { date: b }) => {
		if (a < b) {
			return 1;
		} else if (a > b) {
			return -1;
		} else {
			return 0;
		}
	});
}

export async function getAllPostIdsFromFirebase() {
	const filePaths = await getFilePaths();

	const fileNames = filePaths.map(fp => path.basename(fp));

	return fileNames.map(fileName => {
		return {
			params: {
				id: fileName.replace(/\.md$/, '')
			}
		};
	});
}

export async function getPostDataFromFirebase(id: string) {
	const fileContents = await getArticleText(id);

	const matterResult = matter(fileContents);

	const processedContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		...(matterResult.data as { date: string; title: string })
	};
}
