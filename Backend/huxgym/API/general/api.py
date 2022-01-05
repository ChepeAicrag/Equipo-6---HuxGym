import requests
from decouple import config

class API:


    url = "https://curp-mexico1.p.rapidapi.com/porCurp/"

    headers = {
        'content-type': "application/json",
        'x-rapidapi-host': config('x_rapidapi_host'),
        'x-rapidapi-key': config('x_rapidapi_key') 
        }

    def validate_curp(self, curp):
        response = requests.request("GET", self.url + curp, headers=self.headers)
        return (response.json()['datos'], False) if response.status_code == 200 else ("No se pudo obtener el curp", True)