import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const start = Date.now();
  try {
    const client = await clientPromise;
    const db = client.db('Cluster0');
    const collection = db.collection('drug_list');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const drugs = await collection.find({}).skip(skip).limit(limit).toArray();
    const total = await collection.countDocuments({});

    const duration = Date.now() - start;
    console.log(`API Request Duration: ${duration}ms`);

    res.status(200).json({ total, page, limit, drugs });
  } catch (e) {
    console.error('Error fetching drugs:', e.message);
    console.error(e.stack);
    res.status(500).json({ error: 'Unable to connect to database', details: e.message });
  }
}
