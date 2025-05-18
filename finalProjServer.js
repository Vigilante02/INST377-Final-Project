import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve static files from /public
app.use(express.static('public'));

// override root to serve our renamed index
app.get('/', (_, res) => {
  res.sendFile(path.resolve('public', 'finalProjIndex.html'));
});

// custom routes to match renamed files
app.get('/about', (_, res) => {
  res.sendFile(path.resolve('public', 'finalProjAbout.html'));
});
app.get('/dashboard', (_, res) => {
  res.sendFile(path.resolve('public', 'finalProjDashboard.html'));
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET data from Supabase
app.get('/api/favorites', async (_, res) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new favorite city to Supabase
app.post('/api/favorites', async (req, res) => {
  const { city } = req.body;
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ city }])
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
