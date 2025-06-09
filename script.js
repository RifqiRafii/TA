$(document).ready(function(){
    $('#updateProfile').click(function(){
        if ((!($("#change-email").val()).includes("@")) || (($("#change-name").val()).trim() == "")) {
            alert("Username atau Email tidak Valid")
        } else {
            $("#name").text($("#change-name").val())
            $("#email").text($("#change-email").val())
        }      
    })
})