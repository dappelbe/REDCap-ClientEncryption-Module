//-- ============================================================================= --//
//-- Look to see if we have the secret phrase set or if we should ignore for this  --//
//-- session                                                                       --//
//-- ============================================================================= --//
$().ready(function () {
    var haveSecretPhase = $.cookie('REDCapClientEncryption');
    var ignoreSecretPhrase = $.cookie('REDCapClientEncryption-Ignore');
    if (typeof haveSecretPhase === "undefined" && typeof ignoreSecretPhrase === "undefined") {
        simpleDialog('<div style=\'margin:10px 0;font-size:13px;\'>Please provide your sites passphrase (note: this will be stored as a session cookie so you will not need to reenter whilst logged in)<p>Site Passphrase<input id="mypassphrase" /></p><p>If you do not have a pass phrase click cancel</p></div>','Enter Passphrase',null,null,null,'Cancel',function(){ SetEncryptionCookie( $('#mypassphrase').val() ); },'Save Passphrase');
        var passPhrase = $.cookie('REDCapClientEncryption');
        if ( typeof passPhrase === "undefined" ) {
            $.cookie('REDCapClientEncryption-Ignore', '1');
        }
    }
    tidyEncryptedFields();
});

/***
 * Summary: Set a session cookie that will hold the secret key
 *
 * @param secretPhrase
 * @constructor
 */
function SetEncryptionCookie( secretPhrase ) {
    if ( secretPhrase.length > 0 ) {
        $.cookie('REDCapClientEncryption', secretPhrase);
    } else {
        $.cookie('REDCapClientEncryption-Ignore', '1');
    }
}

/***
 * Summary: Function to hide the REDCap Field and display a field that will not be stored in the database, but displays the decrypted value.
 *
 * @param inputFld the "name" of the field to extract
 * @constructor
 */
function EncryptMyField( inputFld ) {
    var passPhrase = $.cookie('REDCapClientEncryption');
    //-- Hide the field that we are interested in
    $('[name="' + inputFld + '"]').attr("type","hidden");
    //-- Add a dummy field that can hold the input
    var fld2Add = '<input id="dec_' + inputFld + '" type="text">';
    $('[name="' + inputFld + '"]').parent().append( fld2Add );
    //-- Look to see if we have a field with data
    var myId = "#dec_" + inputFld;
    var encrypted = $('[name="' + inputFld + '"]').val();
    encrypted = encrypted.substring(10);
    if ( encrypted.length > 0 && passPhrase.length > 0 ) {
        var decrypted = CryptoJS.AES.decrypt(encrypted, passPhrase);
        $(myId).val( decrypted.toString(CryptoJS.enc.Utf8) );
    }
    //-- Add the code to copy the data back to the actual fld
    $(myId).blur(function(){
        var decVal = $(this).val();
        if ( decVal.length > 0  && passPhrase.length > 0 ) {
            var encVal = CryptoJS.AES.encrypt(decVal, passPhrase);
            $('[name="' + inputFld + '"]').val("decryptMe:" + encVal.toString());
        }
    });
}

//-- ============================================================================= --//
//-- Decipher our text in the page displays                                        --//
//-- ============================================================================= --//
function tidyEncryptedFields() {
    var passPhrase = $.cookie('REDCapClientEncryption');
    if ( typeof passPhrase !== "undefined") {
        //-- look for any text that starts <b>decryptMe: - Record Home page and Instrument display page
        //-- Now decrypt the string
        $('b').each(function () {
            if ($(this).text().indexOf('decryptMe:') == 0) {
                var startIdx = $(this).text().indexOf('decryptMe:');
                var endIdx = $(this).text().length;
                var encText = $(this).text().substring(startIdx + 10, endIdx);
                var decrypted = CryptoJS.AES.decrypt(encText, passPhrase).toString(CryptoJS.enc.Utf8);
                $(this).text($(this).text().replace('decryptMe:' + encText, decrypted));
            }
        });
        //-- look for any text that starts - Record Status Dashboard
        //-- Now decrypt the string
        $('span.crl').each(function () {
            if ($(this).text().indexOf('decryptMe:') > 0) {
                var startIdx = $(this).text().indexOf('decryptMe:');
                var endIdx = $(this).text().length - 1;
                var encText = $(this).text().substring(startIdx + 10, endIdx);
                var decrypted = CryptoJS.AES.decrypt(encText, passPhrase).toString(CryptoJS.enc.Utf8);
                $(this).text($(this).text().replace('decryptMe:' + encText, decrypted));
            }
        });
        //-- look for any text that starts - Option list on Add/Edit Record page <select id="record"
        //-- Now decrypt the string
        $('#record > option').each(function () {
            if (this.text.indexOf('decryptMe:') > 0) {
                var startIdx = this.text.indexOf('decryptMe:');
                var endIdx = this.text.length - 1;
                var encText = this.text.substring(startIdx + 10, endIdx);
                var decrypted = CryptoJS.AES.decrypt(encText, passPhrase).toString(CryptoJS.enc.Utf8);
                this.text = this.text.replace('decryptMe:' + encText, decrypted);
            }
        });
    }
}