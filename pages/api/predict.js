import path from 'path';
import { PythonShell } from 'python-shell';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { symptoms } = req.body;

    try {
      console.log('Running Python script for predictions...');
      
      const options = {
        scriptPath: path.resolve('./models'),
        args: [symptoms.join(',')],
        pythonOptions: ['-u'], // unbuffered output to capture print statements immediately
      };

      let pythonOutput = [];

      const pyshell = new PythonShell('predict.py', options);

      // Capture stdout
      pyshell.on('message', (message) => {
        console.log(`Python output: ${message}`);
        pythonOutput.push(message);
      });

      // Capture stderr
      pyshell.on('stderr', (stderr) => {
        console.error(`Python error: ${stderr}`);
      });

      // Handle end of the Python script
      pyshell.end((err, code, signal) => {
        if (err) {
          console.error('Error running Python script:', err);
          return res.status(500).json({ error: 'Error running Python script' });
        }

        console.log('Python script finished with code', code, 'and signal', signal);

        // Extract the line that contains JSON (this assumes JSON is on a single line)
        const jsonLine = pythonOutput.find(line => line.trim().startsWith('[['));

        if (!jsonLine) {
          console.error('No valid JSON output from Python script');
          return res.status(500).json({ error: 'No valid JSON output from Python script' });
        }

        try {
          const predictions = JSON.parse(jsonLine);
          console.log('Predictions:', predictions);
          
          // Send the predictions along with additional metadata
          return res.status(200).json({
            predictions,
            symptoms: symptoms.join(', '),  // Include the original symptoms
            executedAt: new Date().toISOString(),  // Include the execution timestamp
            scriptOutput: pythonOutput.join('\n')  // Optionally include the full script output
          });
        } catch (parseError) {
          console.error('Error parsing Python script output:', parseError);
          return res.status(500).json({ error: 'Error parsing Python script output' });
        }
      });
      
    } catch (error) {
      console.error('Error in prediction handler:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
