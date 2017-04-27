<?php
	$request_post = $_POST;
	// echo "string";
	$ip = $_SERVER['REMOTE_ADDR'];
	// exec("echo " .$ip." > newfile.txt");
	$token = $_POST['token'];
	$phone = $_POST['phone'];
	$context = $_POST['context'];
	$json = file_get_contents('config.config');
	// $file_config = fopen('config.config', 'r') or die('Unable to open file!');
	$decodedData = (array)json_decode($json);
	if ($decodedData[$ip] == $token){
		// echo('python sms.py '.$phone.' '.$context);
		exec("python sms.py ".$phone." ".$context);
		sleep(20);
	}
	else
		echo("sai roi");
?>