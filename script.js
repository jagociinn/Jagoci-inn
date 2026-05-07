<script>

function sendWhatsapp(){

  var nama = document.querySelector('input[placeholder="Nama Lengkap"]').value;
  var email = document.querySelector('input[placeholder="Email"]').value;
  var hp = document.querySelector('input[placeholder="Nomor WhatsApp"]').value;
  var kamar = document.querySelector('select').value;

  var pesan =
  "BOOKING JAGOCI INN%0A%0A" +
  "Nama : " + nama + "%0A" +
  "Email : " + email + "%0A" +
  "WhatsApp : " + hp + "%0A" +
  "Kamar : " + kamar;

  window.open(
  "https://wa.me/628211023580?text=" + pesan,
  "_blank");

}

</script>