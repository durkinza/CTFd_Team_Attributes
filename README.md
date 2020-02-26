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
