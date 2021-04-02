Warning: This plugin is no longer maintained.
Team/User attributes are now a built-in feature of CTFd.

# CTFd Team Attributes

Adds dynamic Attributes to CTFd Teams 


## Installing

To install this plugin to your CTFd instance, clone the repo into you ctfd plugins folder.

```sh
cd <CTFd_root_folder>/CTFd/plugins/
```

```sh
git clone git@github.com:durkinza/CTFd_Team_Attributes.git
```

Finally restart/start your CTFd instance.

## Admins interface

![Admins attributes interface](imgs/Admin-attributes-page.png)

Admins can pick from different data types for the attributes, including Text, textarea, checkbox, secret (uses password type, but does not encrypt, yet), and Numbers.

Admins can choose a couple view options for each attribute

Hidden attributes are only editable/visiable by admin users.

Private attributes can be viewed/edited by the teams and admins, but cannot be viewed by other teams or public users.

Public attribtues can be viewed by anyone, but can only be edited by the team and admins.

Frozen attributes can only be edited by Admins, but can be viewed based on the options set above.


## Teams interface

For Private or public attributes, Teams can edit the addtribute on their team's profile page.
![Teams profile page](imgs/Teams-page.png)


Teams can pick which attribute they want to edit
![Teams attributes](imgs/Teams-attributes.png)
- Hidden attributes will not be shown
- Frozen attributes will be shown as diabled forms


Teams can submit data in the datatype of that attribute
![Teams edit attributes](imgs/Teams-edit-attributes.png)


## API Endpoints

There are a lot of helpful api endpoints to work with team attributes.
- `/api/v1/attributes` ['GET', 'POST']
  - Admins can view / create new attributes
  - Teams can view available attributes
- `/api/v1/attributes/<int:attr_id>` ['GET', 'PATCH', 'DELETE']
  - Admins can view / update / remove attributes
  - Teams can view attributes
- `/api/v1/attributes/<int:attr_id>/<int:team_id>` ['GET', 'POST', 'PATCH', 'DELETE']
  - Admins can view / create / update / remove a team's attributes
  - Teams can view / create / update / remove their own attributes
  - Teams can view other team's non-private attributes
  - For this endpoint, the PATCH method can be used to create or update a team's attribute
- `/api/v1/attributes/teams` ['GET']
  - Admins can view all team's attributes
  - Teams can view all non-private attributes
- `/api/v1/attributes/team/<int:team_id>` ['GET']
  - Admins can view a team's attributes
  - Teams can view a team's non-private attributes
- `/api/v1/attributes/team/me` ['GET']
  - Admins and teams can view their own attributes
- `/api/v1/attribtues/<int:attr_id>/options` ['GET', 'POST']
  - Admins can view / create dropdown options for an attribute
  - Teams can view the dropdown options for an attribute
- `/api/v1/attributes/<int:attr_id>/options/<int:option_id>` ['GET', 'PATCH', 'DELETE']
  - Admins can view / update / remove a dropdown option for an attribute
  - Teams can view the dropdown option
