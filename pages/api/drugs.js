// import fs from 'fs';
// import path from 'path';

// export default function handler(req, res) {
//   const filePath = path.resolve('public', 'drug_list.json');
//   const jsonData = fs.readFileSync(filePath, 'utf8');
//   const data = JSON.parse(jsonData);
//   res.status(200).json(data);
// }
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('Cluster0');
    const collection = db.collection('drug_list');
    const drugs = await collection.find({}).toArray();
    res.status(200).json(drugs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to connect to database' });
  }
}
