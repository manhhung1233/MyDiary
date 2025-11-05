const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

export async function fetchDb() {
	const res = await fetch(`${DEFAULT_BASE_URL}/api/db`, { headers: { 'Accept': 'application/json' } });
	if (!res.ok) throw new Error(`Failed to load database.json: ${res.status}`);
	return await res.json();
}

export async function saveDb(db) {
	const res = await fetch(`${DEFAULT_BASE_URL}/api/db`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(db)
	});
	if (!res.ok) throw new Error(`Failed to save database.json: ${res.status}`);
	return await res.json();
}



