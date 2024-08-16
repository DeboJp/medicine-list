# models/predict.py
import pickle
import sys
import json
import os
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model

def load_encoders(file_path):
    with open(file_path, 'rb') as file:
        encoders = pickle.load(file)
    return encoders

def preprocess_symptoms(symptoms, label_encoders, columns):
    symptoms += ['unknown'] * (len(columns) - len(symptoms))
    input_data = pd.DataFrame([symptoms], columns=columns)
    for column in input_data.columns:
        if column in label_encoders:
            if 'unknown' not in label_encoders[column].classes_:
                label_encoders[column].classes_ = np.append(label_encoders[column].classes_, 'unknown')
            unseen_labels = set(input_data[column]) - set(label_encoders[column].classes_)
            if unseen_labels:
                label_encoders[column].classes_ = np.append(label_encoders[column].classes_, list(unseen_labels))
            input_data[column] = label_encoders[column].transform(input_data[column])
    input_data = input_data.astype(float)
    return input_data

def predict_disease(symptoms, model, label_encoders, columns, label_encoder_disease):
    input_data = preprocess_symptoms(symptoms, label_encoders, columns)
    prediction = model.predict(input_data)
    top_5_indices = prediction.argsort()[0][-5:][::-1]
    top_5_diseases = label_encoder_disease.inverse_transform(top_5_indices)
    top_5_probabilities = prediction[0][top_5_indices]
    return [(disease, float(prob)) for disease, prob in zip(top_5_diseases, top_5_probabilities)]

if __name__ == "__main__":
    base_path = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_path, 'disease_prediction_model.h5')
    encoders_path = os.path.join(base_path, 'label_encoders.pkl')

    symptoms = sys.argv[1].split(',')
    symptoms = [s.strip() for s in symptoms]

    print("Starting script...")
    # Existing code
    print("Loading model...")
    model = load_model(model_path)
    print("Model loaded.")
    # Rest of your code
    with open(encoders_path, 'rb') as f:
        label_encoders = pickle.load(f)
        label_encoder_disease = pickle.load(f)

    columns = list(label_encoders.keys())
    try:
    # Your existing code
        top_5_predictions = predict_disease(symptoms, model, label_encoders, columns, label_encoder_disease)
        print(json.dumps(top_5_predictions))
    except Exception as e:
        print(f"An error occurred: {e}")
