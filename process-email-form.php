<?php
// process-email-form.php

	$errors         = array();      // array to hold validation errors
	$data           = array();      // array to pass back data

// validate the variables ======================================================
    // if any of these variables don't exist, add an error to our $errors array

    if (empty($_POST['name'])){
        $errors['name'] = 'Need Name';
    }else{
        $name = $_POST['name'];
    }

    if (empty($_POST['email'])){
        $errors['email'] = 'Need Email';
    }else{
        $email = $_POST['email'];
    }

    if (empty($_POST['message'])){
        $errors['message'] = 'Need Message';
    }else{
        $message = $_POST['message'];
    }

	$from = 'From: '.$_POST['name'].'<'.$email.'>';
	$to = 'contact@raccwebchallenge.com'; 
	$subject = 'Message from 2018 RACC Website Challenge ';
	// return a response ===========================================================

    // if there are any errors in our errors array, return a success boolean of false
    if ( ! empty($errors)) {

        // if there are items in our errors array, return those errors
        $data['success'] = false;
        $data['errors']  = $errors;
		 
    } else {

        // if there are no errors process our form, then return a message

        // DO ALL YOUR FORM PROCESSING HERE
        // THIS CAN BE WHATEVER YOU WANT TO DO (LOGIN, SAVE, UPDATE, WHATEVER)

        // show a message of success and provide a true success variable
        $data['success'] = true;
        $data['message'] = 'Success!';
		
		 $body ="From: $name\n E-Mail: $email\n Message:\n $message";
// If there are no errors, send the email
	if (mail ($to, $subject, $body, $from)) {
		$data['email_sent'] = true;
	} else {
		$data['email_sent'] = false;
	}
		 
    }

    // return all our data to an AJAX call
    echo json_encode($data);

?>