from flask_restplus import Namespace, Resource
from flask import session, jsonify, request, abort

from CTFd.cache import cache, make_cache_key
from CTFd.utils import get_config
from CTFd.utils.modes import get_model, TEAMS_MODE
from CTFd.utils.user import get_current_team, authed, is_admin
from CTFd.utils.decorators import (
    during_ctf_time_only,
	admins_only,
	is_admin
)
from CTFd.utils.decorators.visibility import (
	check_account_visibility
)
from CTFd.utils.config.visibility import (
    accounts_visible
)
from sqlalchemy.sql import or_, and_, any_

from db_tables import db, Attributes, IntersectionTeamAttr
from schemas import AttributesSchema, IntersectionTeamAttrSchema
from admin_views import supported_input_types

attributes_namespace = Namespace('attributes', description="Endpoint to retrieve Team Attributes")


@attributes_namespace.route('')
class AttributeList(Resource):
	@check_account_visibility
	def get(self):
		if is_admin():
			attrs = Attributes.query
		else:
			attrs = Attributes.query.filter_by(hidden=False)
		view = AttributesSchema.views.get(session.get("type", "user"))
		response = AttributesSchema(view=view, many=True).dump(attrs)
		if response.errors:
			return {"success": False, "errors": response.errors}, 400

		response = {
			'success':True,
			'data': response.data
		}
		return response

	@admins_only
	def post(self):
		req = request.get_json()
		schema = AttributesSchema() 
		response = schema.load(req)
		if response.errors:
			return {"success": False, "errors": response.errors}, 400
		db.session.add(response.data)
		db.session.commit()
		response = schema.dump(response.data)
		db.session.close()
		return {"success": True, "data": response.data}


@attributes_namespace.route('/<int:attr_id>')
@attributes_namespace.param("attr_id", "Attribute ID")
class Attribute(Resource):
	@check_account_visibility
	def get(self, attr_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()
		
		if (attr.hidden) and is_admin() is False:
			abort(404)

		view = AttributesSchema.views.get(session.get("type", "user"))
		response = AttributesSchema(view=view).dump(attr)

		if response.errors:
			return {"success": False, "errors": response.errors}, 400

		return {"success": True, "data": response.data}

	@admins_only
	def patch(self, attr_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()
		data = request.get_json()
		data["id"] = attr_id
		schema = AttributesSchema(view="admin", instance=attr, partial=True)

		response = schema.load(data)
		if response.errors:
			return {"success": False, "errors": response.errors}, 400

		response = schema.dump(response.data)
		db.session.commit()
		db.session.close()

		return {"success": True, "data": response.data}

	@admins_only
	def delete(self, attr_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()

		db.session.delete(attr)
		db.session.commit()
		db.session.close()

		return {"success": True}


@attributes_namespace.route('/<int:attr_id>/<int:team_id>')
@attributes_namespace.param("attr_id", "Attribute ID")
@attributes_namespace.param("team_id", "Team ID")
class New_Team_Attribute(Resource):
	@check_account_visibility
	def get(self, attr_id, team_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()
		if (attr.hidden) and is_admin() is False:
			abort(404)

		intersec = IntersectionTeamAttr.query.filter_by(attr_id=attr_id).filter_by(team_id = team_id).first_or_404()
		if (attr.private) and is_admin() is False:
			t = get_current_team()
			if not( authed() and t and t.id == intersec.team_id):
				abort(404)

		view = IntersectionTeamAttrSchema.views.get(session.get("type", "user"))
		response = IntersectionTeamAttrSchema(view=view).dump(intersec)


		if response.errors:
			return {"success": False, "errors": response.errors}, 400

		if supported_input_types[attr.type] == "checkbox":
			if intersec.value and intersec.value != "false":
				response.data["value"] = True
			else:
				response.data["value"] = False

		return {"success": True, "data": response.data}

	def post(self, attr_id, team_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()

		if (attr.hidden) and is_admin() is False:
			abort(404)

		req = request.get_json()
		if supported_input_types[attr.type] == "checkbox":
			if req["value"] == True:
				req["value"]="true"
			else:
				req["value"]="false"

		if "value" not in req:
			req["value"] = ""

		intersec = IntersectionTeamAttr.query.filter_by(attr_id=attr_id).filter_by(team_id=team_id)
		if intersec.count() > 0:
			intersec = intersec.first_or_404()
			req["id"] = intersec.id


		schema = IntersectionTeamAttrSchema() 
		response = schema.load(req)
		if response.errors:
			return {"success": False, "errors": response.errors}, 400
		db.session.add(response.data)
		db.session.commit()
		response = schema.dump(response.data)
		db.session.close()
		return {"success": True, "data": response.data}

	def patch(self, attr_id, team_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()

		if (attr.hidden) and is_admin() is False:
			abort(404)

		data = request.get_json()

		intersec = IntersectionTeamAttr.query.filter_by(attr_id=attr_id).filter_by(team_id=team_id)
		if intersec.count() > 0:
			intersec = intersec.first_or_404()
			data["id"] = intersec.id
		else:
			if "id" in data:
				del data["id"]

		data["attr_id"] = attr_id
		data["team_id"] = team_id

		if supported_input_types[attr.type] == "checkbox":
			if data["value"] == True:
				data["value"]="true"
			else:
				data["value"]="false"

		if "value" not in data:
			data["value"] = ""
		data["value"] = data["value"].replace('<', '&lt;').replace('>', '&gt;')

		view = IntersectionTeamAttrSchema.views.get(session.get("type", "user"))
		schema = IntersectionTeamAttrSchema(view=view)

		response = schema.load(data)
		if response.errors:
			return {"success": False, "errors": response.errors}, 400
		response = schema.dump(response.data)
		db.session.commit()
		db.session.close()

		return {"success": True, "data": response.data}


	def delete(self, attr_id, team_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()

		if (attr.hidden) and is_admin() is False:
			abort(404)

		intersec = IntersectionTeamAttr.query.filter_by(attr_id=attr_id).filter_by(team_id=team_id).first_or_404()

		db.session.delete(intersec)
		db.session.commit()
		db.session.close()

		return {"success": True}


