import { fetchDb, saveDb } from './api';

export async function loadServerDbToLocal() {
	try {
		const db = await fetchDb();
		if (Array.isArray(db.users)) {
			localStorage.setItem('users', JSON.stringify(db.users));
		}
		if (Array.isArray(db.diaries)) {
			localStorage.setItem('diaries', JSON.stringify(db.diaries));
		}
	} catch (e) {
		console.warn('Could not load server DB, using local data if present.', e);
	}
}

export async function writeLocalToServer() {
	const users = JSON.parse(localStorage.getItem('users') || '[]');
	const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
	const now = new Date().toISOString();
	const db = { users, diaries, updatedAt: now };
	return await saveDb(db);
}

export async function mergeAndSaveToServer(partial) {
	const current = await (async () => {
		try { return await fetchDb(); } catch { return {}; }
	})();
	const users = Array.isArray(partial.users) ? partial.users : (current.users || JSON.parse(localStorage.getItem('users') || '[]'));
	const diaries = Array.isArray(partial.diaries) ? partial.diaries : (current.diaries || JSON.parse(localStorage.getItem('diaries') || '[]'));
	return await saveDb({ ...current, users, diaries });
}



