from flask import render_template, request, redirect, url_for, Blueprint, current_app as app

from CTFd.models import db, Teams
from CTFd.utils.decorators import authed_only, ratelimit
from CTFd.utils.decorators.modes import require_team_mode
from CTFd.utils import config
from CTFd.utils.user import get_current_user
from CTFd.utils.crypto import verify_password
from CTFd.utils.decorators.visibility import (
    check_account_visibility,
    check_score_visibility,
)
from CTFd.utils.helpers import get_errors

from .db_tables import Attributes, IntersectionTeamAttr
from .admin_views import supported_input_types

# set team view
@app.route('/team')
@authed_only
@require_team_mode
def view_team():
	user = get_current_user()
	if not user.team_id:
		return render_template("teams/team_enrollment.html")

	team_id = user.team_id

	team = Teams.query.filter_by(id=team_id).first_or_404()
	solves = team.get_solves()
	awards = team.get_awards()

	place = team.place
	score = team.score

	attributes = Attributes.query.filter_by(hidden=False).all()

	return render_template(
		"team_private.html",
		solves=solves,
		awards=awards,
		user=user,
		team=team,
		score=score,
		place=place,
		score_frozen=config.is_scoreboard_frozen(),
		attributes=attributes,
		types=supported_input_types
	)
