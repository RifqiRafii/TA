$(document).ready(function(){
    let today = new Date()
    let formattedDate = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    $('#date').text(formattedDate)

    $('#updateProfile').click(function(){
        if ((!($("#change-email").val()).includes("@")) || (($("#change-name").val()).trim() == "")) {
            alert("Username atau Email tidak Valid")
        } else {
            $("#name").text($("#change-name").val())
            $("#email").text($("#change-email").val())
        }      
    })
})