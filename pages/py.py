# import requests

# def get_drug_info(drug_name):
#     url = f'https://api.fda.gov/drug/label.json?search=openfda.brand_name:"{drug_name}"'
#     response = requests.get(url)
#     if response.status_code == 200:
#         return response.json()
#     else:
#         return None

# drug_name = "vasopressin"
# drug_info = get_drug_info(drug_name)
# if drug_info:
#     print(drug_info)
# else:
#     print("No information found for this drug.")
