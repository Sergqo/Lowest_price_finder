from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from pydantic import BaseModel
import json
from pydantic import ValidationError
from typing import List


class Product(BaseModel):
    name: str
    price: float
    url: str
    used_API: str

class Recommendations(BaseModel):
    products: List[Product]

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/api/search', methods=['GET'])
def search_products():
    limit = 5
    keyword = request.args.get('keyword')

    products = analyze_prices(limit, keyword)
    
    return jsonify({'products': products})

def analyze_prices(limit, keyword):
    prompt = f"Can you use other API's like amazon, ebay and others to find the {limit} cheapest options that are not older than a few weeks for this product: `{keyword}`?" 

    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0,
        response_format=Recommendations
    )

    try:
        first_response = response.choices[0].message

        content = first_response.content

        response_data = json.loads(content)

        results = response_data.get('products', [])

    except (ValidationError, json.JSONDecodeError) as e:
        print(f"Error parsing recommendations: {e}")
        return []
        
    return results

if __name__ == '__main__':
    app.run(debug=True)
