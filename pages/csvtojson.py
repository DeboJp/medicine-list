import pandas as pd

# Load the CSV file
df = pd.read_csv('drug_list.csv')

# Convert the DataFrame to JSON
json_data = df.to_json('drug_list.json', orient='records', lines=True)

print("CSV data has been converted to JSON and saved as 'drug_list.json'.")
