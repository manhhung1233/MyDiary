const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

async function ensureDbFile() {
	try {
		await fs.access(DB_PATH);
	} catch {
		const initial = {
			users: [],
			diaries: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
	}
}

async function readDb() {
	await ensureDbFile();
	const content = await fs.readFile(DB_PATH, 'utf8');
	return JSON.parse(content || '{}');
}

async function writeDb(db) {
	const data = { ...db, updatedAt: new Date().toISOString() };
	await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
	return data;
}

app.get('/api/db', async (req, res) => {
	try {
		const db = await readDb();
		res.json(db);
	} catch (err) {
		res.status(500).json({ error: 'Failed to read database', details: String(err) });
	}
});

app.post('/api/db', async (req, res) => {
	try {
		if (!req.body || typeof req.body !== 'object') {
			return res.status(400).json({ error: 'Body must be a JSON object' });
		}
		const saved = await writeDb(req.body);
		res.json(saved);
	} catch (err) {
		res.status(500).json({ error: 'Failed to write database', details: String(err) });
	}
});

// Simple healthcheck
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log(`Database JSON server running on http://localhost:${PORT}`);
});



