# REDCAP_ClientEncryption
This project adds a mechanism for encrypting and decrypting fields for use within REDCap.

By adding the actiontag @ENCRYPTFIELD has the effect of hiding the field that REDCap uses to store data.
The data stored in this field will be encrypted, but the displayed data will be decrypted, if the decryption key is 
available within the browsers session then the stored text will be decrypted.

Any changes to the displayed input box will be encrypted as soon as the users cursor leaves the input box.
 