# import necessary for bare flask app
from flask import Flask
from flask_bootstrap import Bootstrap

# application variables
app = Flask(__name__)
boostrap = Bootstrap(app)

# routes must be set after app variable is set
from app import routes
