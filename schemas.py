from marshmallow import validate, ValidationError, pre_load
from marshmallow_sqlalchemy import field_for
from CTFd.utils import get_config
from CTFd.utils.user import is_admin, get_current_user
from CTFd.utils import string_types
from CTFd.models import ma

from .db_tables import Attributes, IntersectionTeamAttr


class AttributesSchema(ma.ModelSchema):
	class Meta:
		model = Attributes
		include_fk = True
		dump_only = ("id")	

	views = {
		"admin": ["id", "name", "type", "default", "hidden", "private"],
		"user": ["id", "name", "type", "default"]
	}
	def __init__(self, view=None, *args, **kwargs):
		if view:
			if isinstance(view, string_types):
				kwargs["only"] = self.views[view]
			elif isinstance(view, list):
				kwargs["only"] = view

		super(AttributesSchema, self).__init__(*args, **kwargs)

class IntersectionTeamAttrSchema(ma.ModelSchema):
	class Meta:
		model = IntersectionTeamAttr
		include_fk = True
		dump_only = ("id")
	views = {
		"admin": ["id", "team_id", "attr_id", "value"],
		"user": ["id", "team_id", "attr_id", "value"]
	}
	def __init__(self, view=None, *args, **kwargs):
		if view:
			if isinstance(view, string_types):
				kwargs["only"] = self.views[view]
			elif isinstance(view, list):
				kwargs["only"] = view

		super(IntersectionTeamAttrSchema, self).__init__(*args, **kwargs)
