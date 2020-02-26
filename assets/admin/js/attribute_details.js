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
              window.location = script_root + "/admin/attributes";
            }
          });
      }
    });
  });
});

