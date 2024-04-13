import sys
import pandas as pd
from pymongo import MongoClient
import pymongo
import re

# take passed variable values 
ExcelFile = sys.argv[1]
section = sys.argv[2]
palier  = sys.argv[3]
specialite = sys.argv[4]

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydb']
enseignements = db['enseignements']
profs = db['profs']

# Read Excel file
excel_data = pd.read_excel(ExcelFile, header=None)
def get_id_creneau(excel_data, col_index,row_index):
    # Extract IdCreneau from the specified column index
    day = excel_data.iloc[row_index, 0]
    
    # Mapping for day of the week
    day_mapping = {
         1: "Samedi",
        2: "Dimanche",
        3: "Lundi",
        4: "Mardi",
        5: "Mercredi",
        6: "Jeudi",
    }
    val_list = list(day_mapping.values())
    key_list = list(day_mapping.keys())


    # Get the day of the week
    position = val_list.index(day)

    # Concatenate day with col_index to create IdCreneau
    IdCreneau = f"{key_list[position]}{col_index}"

    return IdCreneau

def search_prof_by_name(nom, prenom):
    # Search for the professor using nom and prenom
    result = profs.find_one({
        'nom': nom,
        'prenom': prenom
    }, {'MatriculeProf': 1, '_id': 0})  # Projection to include only MatriculeProf field
    if result:
        return result['MatriculeProf']
    else:
        return None
# Define function to extract data and fill collection
def fill_collection(excel_data):
    rows, cols = excel_data.shape
    for col_index in range(1, cols):  # Start from 1 to skip the first column
        for row_index in range(8, rows, 2):  # Iterate over rows skipping every other row

            salle = excel_data.iloc[row_index, col_index]  # Extract salle from the current row
            data = excel_data.iloc[row_index + 1, col_index]
            if data.strip():  # Check if data is not an empty string
                # Split data by space and filter out empty strings
                current_day = pd.isna(excel_data.iloc[row_index, 0])
                if current_day == False:
                    IdCreneau = get_id_creneau(excel_data, col_index,row_index)  # Extract IdCreneau from the first row
                    print(IdCreneau)

                parts = [part for part in data.split(' ') if part]
                seance, module, groupe, *name_parts = parts[:5]
                match = re.search(r'\d+', groupe)
                if match:
                    groupe = match.group()
                    
                # Replace groupe with None if seance is "Cours"
                if seance=="Cours":
                    parts.insert(2,None)
                    seance, module, groupe, *name_parts = parts[:5]

                    
                # Check if name_parts contains a single element "/"
                if len(name_parts) == 1 and name_parts[0] == '/':
                    prenom = ''  # Empty first name
                    nom = ''  # Empty last name
                else:
                    nom = ' '.join(name_parts[:-1]).rstrip(',')  # Join remaining values as first name and remove trailing comma
                    prenom = name_parts[-1]  # Last value as last name
                # Print extracted information
                matricule_prof = search_prof_by_name(nom, prenom)
                if matricule_prof:
                    print("MatriculeProf:", matricule_prof)
                else:
                    print("Professor not found")

                document = {
                "IdCreneau": IdCreneau,
                "module": module,
                "groupe": groupe,
                "MatriculeProf": matricule_prof,
                "salle": salle,
                "section": section,  # Assuming these values are constant
                "palier": palier,
                "specialite": specialite
                }
                print(document)
                enseignements.insert_one(document)


# Fill collection with data
fill_collection(excel_data)


# Close MongoDB connection
client.close()
