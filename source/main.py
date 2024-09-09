#################################################### Flask Imports
from flask import Flask, render_template, request, session, redirect, url_for, make_response, send_from_directory, abort


#################################################### Draw "The X"
from python.modules.Logger import Log
Log.clear()


#################################################### Initializing File Structure
from python.modules.FileSystem import FileSystem
FileSystem.init()


#################################################### Globals
from python.modules.Globals import Globals

# Prints latest tracked version
Log.center('', '-')
Log.center(Globals.CONF["version"], '-')
Log.center('', '-')


#################################################### Update Logger enabled/disabled after project.json has been loaded
Log.enabled = True if Globals.CONF.get("tools", {}).get("debug") is True else False


#################################################### Setting Up MySQL
from python.modules.MySQL import MySQL
######## If Database Is Enabled
if(
	Globals.CONF.get("database", {}).get("enabled") is True and
	Globals.CONF.get("database", {}).get("MySQL", {}).get("enabled") is True
):
	######## Set Up Connection
	MySQL.init(
		Globals.CONF["database"]["MySQL"]["user"],
		Globals.CONF["database"]["MySQL"]["password"],
		Globals.CONF["database"]["MySQL"]["host"],
		Globals.CONF["database"]["MySQL"]["name"],
		Globals.CONF["database"]["MySQL"]["charset"],
		Globals.CONF["database"]["MySQL"]["collate"]
	)


#################################################### Flask APP
app = Flask(
	__name__,
	root_path = Globals.CONF["flask"]["root_path"],
	template_folder = Globals.CONF["flask"]["template_folder"],
	static_folder = Globals.CONF["flask"]["static_folder"],
	static_url_path = Globals.CONF["flask"]["static_url_path"]
)


#################################################### Secret Key
import os
app.secret_key = os.urandom(24)


#################################################### Permanent session
from datetime import timedelta
app.permanent_session_lifetime = timedelta(days=31)


#################################################### On app start
try:
	from python.modules.on_app_start import init
	init()

except Exception as e: Log.error(e)


#################################################### Default Flask Decorations
from python.modules.routeGuard import routeGuard, routeLogs

def before_first_request():
	try:
		from python.modules.before_first_request import before_first_request
		before_first_request()

	except Exception as e: Log.error(e)

with app.app_context(): before_first_request()

@app.before_request
def before_request():
	routeLogs()
	# routeGuard()

# @app.after_request
# def after_request(response):
	# return response

# @app.teardown_request
# def teardown_request_func(error=None):
	# return None


#################################################### Dynamically Imprting All Pages
from python.pages import *


#################################################### RUN using Flask (For Development)
### Flask server
# if __name__ == "__main__":
	# No SSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True)

	# OpenSSL
	# app.run(host=CONF["URL"]["domain_name"], port=CONF["URL"]["port"], debug=True, threaded=True, ssl_context=('SSL/cert.pem', 'SSL/key.pem'))
