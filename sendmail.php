<?php
$to = "pixeloved@gmail.com";
$subject = "Email from site";
$body = $_POST['message'];
$headers = 'From: '.$_POST['name'].' <'.$_POST['email'].'>';

//$to = "wojciech.zardewialy@gmail.com";
//$body = "Hi,\n\nHow are you?";

if (mail($to, $subject, $body, $headers)) {
  echo("<p>Message successfully sent!</p>");
} else {
  echo("<p>Message delivery failed.</p>");
}

?>

<script type="text/javascript">
window.location = "http://pixelove.me"
</script>