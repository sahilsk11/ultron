import requests
import passwords

def add_daily_weight_entry(weight: float, bmi: float, muscle_mass: float, body_fat: float, bone_mass: float):
  endpoint = "https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight"
  headers = {
      "Authorization": "Bearer " + passwords.airtable_dream_base()
  }
  data = {
      "records": [
          {
              "fields": {
                  "weight (lbs)": weight,
                  "bmi": bmi,
                  "body fat": body_fat,
                  "muscle mass": muscle_mass,
                  "bone mass": bone_mass
              }
          }
      ]
  }
  requests.post(endpoint, headers=headers)
