from app import app
from flask import render_template, jsonify, request # needed to render html files
import requests

@app.route('/')
@app.route('/index')
def index():
    url = "https://raw.githubusercontent.com/guoqi228/json_dataset/master/items.json"
    value = requests.get(url).json()
    return render_template('index.html', value=value)
