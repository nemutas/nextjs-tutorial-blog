import path from 'path';
import { TextDecoder } from 'text-encoding';
import { storageNode } from './nodeApp';

export const getArticleText = async (fileName: string) => {
	try {
		const file = await getFile(fileName);
		if (!file) return;

		// ファイル読み込み
		// https://www.pnkts.net/node-js-gcs
		const data = await file.download();
		const contents = data[0];
		const textDecoder = new TextDecoder('utf-8');
		const text = textDecoder.decode(Uint8Array.from(contents).buffer);
		return text;
	} catch (error) {
		console.error({ error });
	}
};

export const getFilePaths = async () => {
	try {
		const bucket = storageNode.bucket(process.env.FIREBASE_STORAGE_BUCKET);
		const files = await bucket.getFiles();

		const result: string[] = [];
		files[0].forEach(file => {
			const filePath = file.name;
			if (path.extname(filePath).toLowerCase() === '.md') {
				result.push(filePath);
			}
		});
		return result;
	} catch (error) {
		console.error({ error });
	}
};

const getFile = async (fileName: string) => {
	try {
		const bucket = storageNode.bucket(process.env.FIREBASE_STORAGE_BUCKET);
		const files = await bucket.getFiles();

		return files[0].find(file => {
			const filePath = file.name;
			return (
				path.extname(filePath).toLowerCase() === '.md' &&
				path.basename(filePath).replace(/\.md$/, '') === fileName.replace(/\.md$/, '')
			);
		});
	} catch (error) {
		console.error({ error });
	}
};
