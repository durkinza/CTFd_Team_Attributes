import os
from CTFd.plugins import register_plugin_assets_directory, register_admin_plugin_script
from CTFd.utils.plugins import override_template
from flask import Blueprint
from flask_restplus import Api

import db_tables
import views
from api_routes import attributes_namespace


def load(app):
	app.db.create_all()
	# get plugin location
	dir_path = os.path.dirname(os.path.realpath(__file__))
	register_plugin_assets_directory(app, base_path="/plugins/CTFd_Team_Attributes/assets/")

	# Pages 
	override_template('view_attributes.html', open(os.path.join(dir_path, 'assets/view_attributes.html')).read())
	override_template('create_attribute.html', open(os.path.join(dir_path, 'assets/create_attribute.html')).read())
	override_template('attribute_details.html', open(os.path.join(dir_path, 'assets/attribute_details.html')).read())
	override_template('set_team_attribute.html', open(os.path.join(dir_path, 'assets/set_team_attribute.html')).read())
	# Modals
	override_template('attribute_form.html', open(os.path.join(dir_path, 'assets/modals/attribute_form.html')).read())
	override_template('team_attribute.html', open(os.path.join(dir_path, 'assets/modals/team_attribute.html')).read())


	# Blueprint used to access the static_folder directory.
	blueprint = Blueprint(
		"attributes", __name__, template_folder="templates", static_folder="assets"
	)

	api = Blueprint("attributes_api", __name__, url_prefix="/api/v1")
	Attributes_API_v1 = Api(api, version="v1", doc=app.config.get("SWAGGER_UI"))
	Attributes_API_v1.add_namespace(attributes_namespace, "/attributes")
	app.register_blueprint(api)
