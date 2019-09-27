import os
from flask import render_template, request, current_app as app
from CTFd.utils.decorators import admins_only, is_admin
from CTFd.models import db, Teams

from db_tables import Attributes, IntersectionTeamAttr

supported_input_types = {
	"Checkbox":"checkbox",
	"Text":"text",
	"Secret": "password",
	"Text Area": "textarea"
}

# set views
@app.route('/admin/attributes', methods=['GET'])
@admins_only
def view_attributes():
	page = abs(request.args.get("page", 1, type=int))
	page = abs(int(page))
	results_per_page = 50
	page_start = results_per_page * (page - 1)
	page_end = results_per_page * (page - 1) + results_per_page
	
	attributes = Attributes.query.order_by(Attributes.id.asc()).all()
	count = db.session.query(db.func.count(Attributes.id)).first()[0]
	pages = int(count / results_per_page) + (count % results_per_page > 0)

	return render_template(
		"view_attributes.html", 
		attributes = attributes,
		curr_page = page,
		pages = pages,
		types = supported_input_types 
	)

@app.route('/admin/attributes/new', methods=['GET'])
@admins_only
def create_attribute():
	return render_template(
		'create_attribute.html',
		types = supported_input_types 
	)

@app.route('/admin/attributes/<int:attribute_id>', methods=['GET'])
@admins_only
def attribute_details(attribute_id):
	attribute = Attributes.query.filter_by(id=attribute_id).first_or_404()

	teams = IntersectionTeamAttr.query.filter_by(attr_id=attribute_id).all()
	
	teams_list = Teams.query.all()
	
	return render_template(
		'attribute_details.html',
		attribute = attribute,
		teams = teams,
		teams_list = teams_list,
		types = supported_input_types 
	)

@app.route('/admin/attributes/<int:attribute_id>/<int:team_id>', methods=['GET'])
@admins_only
def set_team_attribute(attribute_id, team_id):
	attribute = Attributes.query.filter_by(id=attribute_id).first_or_404()

	team = IntersectionTeamAttr.query.filter_by(attr_id=attribute_id).filter_by(team_id=team_id).first_or_404()
	
	return render_template(
		'set_team_attribute.html',
		attribute = attribute,
		team = team,
		types = supported_input_types 
	)
