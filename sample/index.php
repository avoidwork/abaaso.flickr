<?php
$date = new DateTime();
$date->modify("+30 minutes");
header('Allow: GET');
header('Expires: '.$date->format(DATE_RFC822));
?>
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" /> 
<meta name="description" content="" /> 
<?php
if (eregi("MSIE", getenv("HTTP_USER_AGENT")) || eregi("Internet Explorer", getenv("HTTP_USER_AGENT"))) {
  $match   = preg_match('/MSIE ([0-9]\.[0-9])/', $_SERVER['HTTP_USER_AGENT'], $reg);
  $version = ($match == 0) ? -1 : floatval($reg[1]);
  echo "<meta http-equiv=\"X-UA-Compatible\" content=\"IE={$version}\" />";
}
?>
<meta name="viewport" content="width=1024; maximum-scale=1.0; user-scalable=1;" />
<link rel="shortcut icon" type="image/ico" href="images/favicon.png" />
<script type="text/javascript" src="assets/abaaso-min.js"></script>
<script type="text/javascript" src="assets/abaaso.fx-min.js"></script>
<script type="text/javascript" src="assets/abaaso.flickr-min.js"></script>
<script type="text/javascript" src="assets/dashboard.js"></script>
</head>
<body>
<div id="info">
	<h1><a href="mailto:you@domain.com">Your Name</a></h1>
	<h2>Copyright &copy <span id="year"></span></h2>
</div>
<div id="nav">
  <a id="slideshow" href="javascript:void(0)">Start</a> <a id="prev" href="javascript:void(0)">Previous</a> <a id="next" href="javascript:void(0)">Next</a>
</div>
<div id="photo"></div>
<div id="cover"></div>
</body>
</html>
