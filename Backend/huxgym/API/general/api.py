import requests
import json
from decouple import config

class API:

    url = "https://curp-renapo.p.rapidapi.com/v1/curp"

    headers = {
        'content-type': "application/json",
        'x-rapidapi-host': config('x_rapidapi_host'),
        'x-rapidapi-key': config('x_rapidapi_key') 
        }

    def validate_curp(self, payload):
        response = requests.request("POST", self.url, data=json.dumps(payload), headers=self.headers)
        return (response.text, False) if response.status_code == 200 else (response, True)