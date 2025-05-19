import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { city } = body;

      const { data, error } = await supabase
        .from('favorites')
        .insert([{ city }])
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
