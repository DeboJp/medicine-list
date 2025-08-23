# Medicine List – Intelligent Drug Information & Symptom Prediction Platform

![Demo](https://github.com/user-attachments/assets/807edb1f-7d7f-4d09-b0e7-c4e4f56a6ae5)

---

## Summary

Medicine List was envisioned as a **bridge between data-driven prediction and accessible healthcare knowledge**. The goal was to create a personalized, technically rigorous platform where a user could input symptoms, receive probabilistic disease predictions, and immediately explore verified drug information alongside practical precautions. At its heart, the project is both a technical experiment in fusing **Next.js, TensorFlow, and live FDA APIs**, and a humble attempt at addressing the disconnection many feel when navigating complex medical access and information.

---

## Overview

**Medicine List** is a full-stack web application built with **Next.js** and **Tailwind CSS** that bridges three pillars of healthcare technology:  

1. **Drug knowledge base** — Interactive browsing of drug information, curated and formatted for readability.  
2. **Symptom-driven prediction** — A TensorFlow-backed pipeline predicts the top 5 probable diseases from user-entered symptoms, with associated probabilities.  
3. **Real-time external integration** — Live queries to **OpenFDA’s drug API** for verified, up-to-date pharmacological data.  

The platform combines **client-side interactivity**, **Node.js serverless APIs**, and a **Python/TensorFlow model** to make drug and disease information both accessible and clinically contextual.

---

## System Architecture

### 1. Front-End (Next.js + Tailwind CSS)
- **Pages & Navigation**: Implemented via the Next.js page router.  
  - `/` → Paginated drug list (MongoDB-backed).  
  - `/search` → FDA API drug lookup.  
  - `/home` → Symptom-based prediction.  
- **Components**:
  - `MedicineCard.js` parses and renders structured HTML-like content from database entries.  
  - `Layout.js` + `Navbar.js` provide a responsive shell with Tailwind utilities.  
- **Styling**: Strict linting enforced via `stylelint` + Prettier + Tailwind config (`.stylelintrc.json`).  

### 2. Back-End (Next.js API Routes)
- **Database Layer** (`pages/api/drugs.js`):  
  Connects to a MongoDB Atlas cluster with retry-safe configuration (`lib/mongodb.js`). Exposes paginated drug lists via REST API.  

- **Prediction Layer** (`pages/api/predict.js`):  
  - Wraps Python inference (`models/predict.py`) via **python-shell**.  
  - Accepts JSON `{ symptoms: [...] }` → forwards to TensorFlow model → returns ranked predictions with metadata:
    ```json
    {
      "predictions": [["Malaria", 0.73], ["Typhoid", 0.15], ...],
      "symptoms": "fever, headache",
      "executedAt": "2025-08-22T21:30:00Z"
    }
    ```
  - Captures stdout, stderr, and script logs for debugging.

### 3. Machine Learning Layer (Python/TensorFlow)
- **Model (`predict.py`)**:
  - Loads **disease_prediction_model.h5** and label encoders.  
  - Preprocesses user input into a structured vector, padding unknown values:
 
    $$
    x \in \mathbb{R}^d, \quad x_j = \text{encoded symptom severity for feature } j
    $$
    
  - Returns top-5 diseases sorted by probability:
 
    
$$ \hat{y}_{1:5} = \text{Top-5}\big(\text{softmax}(Wx + b)\big) $$

- **Encoders (`label_encoders.pkl`)**: Persist categorical encoders for reproducible mapping between text inputs and numeric tensors.

- **Preprocessing**:
  - User symptoms: `"fever:10, headache:5"` → normalized categorical encodings.  
  - Padding of unknown tokens ensures model dimensional consistency.  

### 4. External Integration
- **OpenFDA Search API** (`pages/search.js`):  
  Dynamically fetches structured JSON from FDA’s drug label dataset:
  - Queries: `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"aspirin"`.  
  - Renders nested keys recursively for display.  
- **CSV Knowledge Base** (`public/Disease precaution.csv`):  
  Provides precautionary recommendations for 40+ diseases. Used for educational reinforcement of predictions.

---

## Core Features

1. **Paginated Medicine Database**  
   - Powered by MongoDB, queried via `api/drugs`.  
   - Displays structured fields: usage, precautions, side effects, etc.  

2. **Symptom → Disease Prediction**  
   - Users input symptom severities (1–10 scale).  
   - Backend runs TensorFlow model + scikit-learn encoders.  
   - Returns top-5 most probable diseases with calibrated probabilities.  

3. **FDA Integration**  
   - Real-time search across FDA’s authoritative drug label database.  
   - Educational disclaimer included (non-clinical use).  

4. **UI Enhancements**  
   - Tailwind-based responsive design.  
   - Interactive cards with forward/backward pagination (`MedicineCard.js`).  
   - Search suggestions with autocomplete-style placeholders.  
   - Debug outputs logged for transparency (`console.log` instrumentation).

---

## Technical Choices (What, How, Why)

- **Next.js** — Hybrid SSR/CSR framework for minimal latency and SEO-friendly drug pages.  
- **MongoDB Atlas** — Schema-flexible storage for drug entries; JSON-aligned schema avoids SQL rigidity.  
- **TensorFlow** — Neural classifier leverages symptom vectors for non-linear decision boundaries.  
- **Pickle Encoders** — Guarantees categorical consistency between training and inference.  
- **Python-Shell** — Lightweight Node ↔ Python bridge; avoids containerization overhead.  
- **Tailwind CSS + ESLint + Stylelint** — Strict visual and code consistency.  
- **OpenFDA API** — Live integration ensures external validation of internal database.  

---

## Mathematical Backbone

### Multi-Class Softmax Classifier
Given input vector $x$ and model parameters $(W, b)$:  

$$
p(y=k \mid x) = \frac{\exp(W_k^\top x + b_k)}{\sum_{j=1}^K \exp(W_j^\top x + b_j)}.
$$

### Top-k Ranking
The API sorts predictions via:

$$
\hat{y}_{1:k} = \text{argsort}(p(y \mid x))[-k:][::-1].
$$

---

## Directory Structure
``` charp
debojp-medicine-list/
├── components/           # Navbar, Layout, MedicineCard
├── lib/                  # MongoDB connection helper
├── models/               # ML artifacts (H5, encoders, predict.py)
├── pages/                # Next.js routes
│   ├── api/              # Serverless APIs: drugs, predict
│   ├── search.js         # FDA integration
│   ├── home.js           # Symptom → disease predictions
│   ├── index.js          # Paginated medicine list
│   └── medicines.js      # Alternate view
├── public/               # CSV knowledge base
├── styles/               # Tailwind config
└── package.json
```


---

## Limits & Future Directions

- **Limits**:
  - Training Data heavily scewed, not best for training (note: Always study data before training).
  - Prediction model accuracy depends heavily on encoder fidelity; unseen symptom terms degrade output.  
  - FDA API rate limits constrain high-volume queries.  
  - Python-shell bridge may bottleneck at scale.

- **Future Extensions**:  
  - Replace Python-shell with **gRPC** or containerized inference microservice.  
  - Fine-tune neural models with embeddings (e.g., BERT) to capture semantic similarity in symptoms.  
  - Expand to treatment recommendation and drug-interaction checks.  
  - Integrate precaution CSV directly into predictive explanations (“If prediction = malaria, precautions = …”).  
