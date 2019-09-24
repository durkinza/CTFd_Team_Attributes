from flask_restplus import Namespace, Resource
from flask import session, jsonify, request

from CTFd.cache import cache, make_cache_key
from CTFd.utils import get_config
from CTFd.utils.modes import get_model, TEAMS_MODE
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

attributes_namespace = Namespace('attributes', description="Endpoint to retrieve Team Attributes")


@attributes_namespace.route('')
class AttributeList(Resource):
	@check_account_visibility
	@cache.cached(timeout=60, key_prefix=make_cache_key)
	def get(self):
		attrs = Attributes.query.filter_by(hidden=False).all()

		view = AttributesSchema.views.get(session.get("type", "user"))
		schema = AttributesSchema(view=view)
		response = schema.dump(Attributes)
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
		schema = AttributesSchema(view=view)
		response = schema.dump(Attributes)

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

		view = IntersectionTeamAttrSchema.views.get(session.get("type", "user"))
		schema = IntersectionTeamAttrSchema(view=view)
		response = schema.dump(IntersectionTeamAttr)

		if response.errors:
			return {"success": False, "errors": response.errors}, 400

		return {"success": True, "data": response.data}

	def post(self, attr_id, team_id):
		attr = Attributes.query.filter_by(id=attr_id).first_or_404()

		if (attr.hidden) and is_admin() is False:
			abort(404)

		req = request.get_json()
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

		intersec = IntersectionTeamAttr.query.filter_by(attr_id=attr_id).filter_by(team_id=team_id).first_or_404()
		data = request.get_json()
		data["attr_id"] = attr_id
		data["team_id"] = team_id

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


