from flask import render_template, request

from CTFd.models import db, Teams

from CTFd import utils


class Attributes(db.Model):
	__tablename__ = "attributes"

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.Text)
	type = db.Column(db.Text, default="checkbox")
	default = db.Column(db.Text, default="")
	hidden = db.Column(db.Boolean, default=False)

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
