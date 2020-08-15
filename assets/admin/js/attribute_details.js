function htmlentities(s){return s.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {return '&#'+i.charCodeAt(0)+';';});}
$(document).ready(function() {
  $(".edit-attribute").click(function(e) {
    $("#attribute-info-modal").modal("toggle");
  });

  $(".set-team").click(function(e){
    $("#set-team-modal").modal("toggle");
  });

  $(".delete-attribute").click(function(e) {
    CTFd.ui.ezq.ezQuery({
      title: "Delete Attribute",
      body: "Are you sure you want to delete {0}".format(
        "<strong>" + htmlentities(ATTRIBUTE_NAME) + "</strong>"
      ),
      success: function() {
        CTFd.fetch("/api/v1/attributes/" + ATTRIBUTE_ID, {
          method: "DELETE"
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            if (response.success) {
              window.location = CTFd.config.urlRoot + "/admin/attributes";
            }
          });
      }
    });
  });

	$('.team-attr').each(function(index, el){
		$('#delete-team-attr-'+$(el).attr('data-team-attr-id')).click(function(e){
			e.stopPropagation();
			console.log(el);
			var team_attr_id = $(el).attr('data-team-attr-id');
			var team_id = $(el).attr('data-team-id');
			var attr_id = $(el).attr('data-attr-id');
			var team_name = $(el).attr('data-team-name');
			var attr_name = $(el).attr('data-attr-name');
			CTFd.ui.ezq.ezQuery({
				title: "Delete Team's Attribute",
				body: "Are you sure you want to delete {0}'s submission for {1}".format(
					"<strong>"+htmlentities(team_name)+"</strong>", 
					"<strong>"+htmlentities(attr_name)+"</strong>"),
				success: function(){
					CTFd.fetch("/api/v1/attributes/"+attr_id+"/"+team_id, {
						method: "DELETE"
					})
					.then(function(response){
						return response.json();
					})
					.then(function(response){
						if( response.success){
							window.location.reload();
						}
					});
				}
			})
		})
	});

});

