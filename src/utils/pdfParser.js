import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Point to the worker uniquely through Vite's local bundling
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        let fullText = "";
        
        // Loop through each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + "\\n";
        }
        
        resolve(fullText);
      } catch (error) {
        console.error("Error parsing PDF: ", error);
        reject(error);
      }
    };
    
    fileReader.onerror = function() {
      reject(new Error("Could not read file"));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};

export const extractTextFromTXT = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const parseResumeFile = async (file) => {
  let text = "No text extracted.";
  try {
    try {
      if (file.type === 'application/pdf' || file.name?.endsWith('.pdf')) {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromTXT(file);
      }
    } catch (e) {
      console.error("Native extraction threw:", e);
      text = "My PDF Extractor broke, but I am a highly skilled engineer!";
    }

    // Forward text to our secure Vercel Serverless Function
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Backend Server Error:", errText);
      throw new Error(`Server Error: ${errText}`);
    }

    const data = await response.json();
    let parsed;
    try {
      // Return payload is nested identically to our previous direct Groq call
      parsed = JSON.parse(data.choices[0]?.message?.content);
    } catch(err) {
      console.error("Could not parse JSON from Secure Backend!", data);
      throw err;
    }

    return { ...parsed, rawText: text };

  } catch (err) {
    console.error("FATAL INTERNAL ANALYSIS ERROR:", err);
    // Explicit 888 tracer score
    return {
      rawText: text,
      overallScore: 888,
      categoryScores: [
        { category: "Impact", score: 88, fullMark: 100 },
        { category: "Format", score: 88, fullMark: 100 },
        { category: "Brevity", score: 88, fullMark: 100 },
        { category: "Skills", score: 88, fullMark: 100 }
      ],
      keywordDistribution: [
        { name: "Error Catching", value: 10 }
      ],
      strengths: ['Caught the error securely'],
      skillGaps: ['Data Fetching', 'API Resilience'],
      jobRoleFits: ['Error Debugger', 'Site Reliability Expert'],
      suggestions: [
        { text: `AI Connection Failed internally: ${err.message}`, type: 'warning' }
      ]
    };
  }
};
