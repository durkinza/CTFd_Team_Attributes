import os
from flask import Blueprint
from flask_restx import Api
from CTFd.plugins import register_plugin_assets_directory, register_admin_plugin_script
from CTFd.utils.plugins import override_template, register_script

from . import db_tables
from . import admin_views
from .api_routes import attributes_namespace


def load(app):
	app.db.create_all()
	# get plugin location
	dir_path = os.path.dirname(os.path.realpath(__file__))
	register_plugin_assets_directory(app, base_path="/plugins/CTFd_Team_Attributes/assets/")

	# Admin Pages 
	override_template('view_attributes.html', open(os.path.join(dir_path, 'assets/admin/view_attributes.html')).read())
	override_template('create_attribute.html', open(os.path.join(dir_path, 'assets/admin/create_attribute.html')).read())
	override_template('attribute_details.html', open(os.path.join(dir_path, 'assets/admin/attribute_details.html')).read())
	override_template('set_team_attribute.html', open(os.path.join(dir_path, 'assets/admin/set_team_attribute.html')).read())
	override_template('view_attribute_select_options.html', open(os.path.join(dir_path, 'assets/admin/view_attribute_select_options.html')).read())
	override_template('create_attribute_select_option.html', open(os.path.join(dir_path, 'assets/admin/create_attribute_select_option.html')).read())
	override_template('edit_attribute_select_option.html', open(os.path.join(dir_path, 'assets/admin/edit_attribute_select_option.html')).read())

	# Admin Modals
	override_template('attribute_form.html', open(os.path.join(dir_path, 'assets/admin/modals/attribute_form.html')).read())
	override_template('team_attribute.html', open(os.path.join(dir_path, 'assets/admin/modals/team_attribute.html')).read())
	override_template('attribute_select_option_form.html', open(os.path.join(dir_path, 'assets/admin/modals/attribute_select_option_form.html')).read())


	# Team settings page override
	register_script("/plugins/CTFd_Team_Attributes/assets/teams/js/team_attr.min.js")

	# Blueprint used to access the static_folder directory.
	blueprint = Blueprint(
		"attributes", __name__, template_folder="templates", static_folder="assets"
	)

	api = Blueprint("attributes_api", __name__, url_prefix="/api/v1")
	Attributes_API_v1 = Api(api, version="v1", doc=app.config.get("SWAGGER_UI"))
	Attributes_API_v1.add_namespace(attributes_namespace, "/attributes")
	app.register_blueprint(api)
