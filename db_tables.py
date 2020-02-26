from flask import render_template, request

from CTFd.models import db, Teams

from CTFd import utils


class AttributesSelectOptions(db.Model):
	__tablename__ = "attributesSelectOptions"
	id = db.Column(db.Integer, primary_key=True)
	attr_id = db.Column(db.Integer, db.ForeignKey("attributes.id", ondelete="CASCADE"))
	name = db.Column(db.Text)
	value = db.Column(db.Text)

	def __init__(self, **kwargs):
		super(AttributesSelectOptions, self).__init__(**kwargs)
	
	def __repr__(self):
		return "<AttrOption id{0} attr{1}>".format(self.id, self.attr_id)

class Attributes(db.Model):
	__tablename__ = "attributes"

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.Text)
	type = db.Column(db.Text, default="checkbox")
	default = db.Column(db.Text, default="")
	hidden = db.Column(db.Boolean, default=False)
	private = db.Column(db.Boolean, default=True)
	frozen = db.Column(db.Boolean, default=False)
	
	teams = db.relationship("IntersectionTeamAttr", backref="attribute", foreign_keys="IntersectionTeamAttr.attr_id")


	def get_team_value(self, team_id):
		intersec = IntersectionTeamAttr.query.filter_by(attr_id=self.id).filter_by(team_id=team_id)
		if intersec.count() > 0:
			return intersec.one()
		return None

	def get_options(self):
		intersec = AttributesSelectOptions.query.filter_by(attr_id=self.id)
		return intersec.all()

	def __init__(self, **kwargs):
		super(Attributes, self).__init__(**kwargs)
	
	def __repr__(self):
		return "<Attribute %r>" % self.name 

class IntersectionTeamAttr(db.Model):
	__tablename__ = "intersecTeamAttr"
	id = db.Column(db.Integer, primary_key=True)
	team_id = db.Column(db.Integer, db.ForeignKey("teams.id", ondelete="CASCADE"))
	attr_id = db.Column(db.Integer, db.ForeignKey("attributes.id", ondelete="CASCADE"))
	value = db.Column(db.Text)

	team = db.relationship("Teams", foreign_keys="IntersectionTeamAttr.team_id", lazy="select")

	def __init__(self, **kwargs):
		super(IntersectionTeamAttr, self).__init__(**kwargs)
	
	def __repr__(self):
		return "<IntTeamAttr team{0} attr{1}>".format(self.team_id, self.attr_id)
