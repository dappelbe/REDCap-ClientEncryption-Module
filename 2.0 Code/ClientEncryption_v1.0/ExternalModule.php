<?php


namespace ClientEncryption\ExternalModule;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;
use Form;
Use Stanford\Utility\ActionTagHelper;
use REDCap;

class ExternalModule extends AbstractExternalModule
{
    /**
     * Summary: This function will add code to the top of every page in the project.
     * @inheritDoc
     * @param $project_id
     */
    function hook_every_page_top($project_id)
    {
        global $Proj;
        $settings = array();
        $instrument = $_GET['page'];
        foreach (array_keys($Proj->forms[$instrument]['fields']) as $field_name) {
            $field_info = $Proj->metadata[$field_name];
            $tags = $field_info['misc'];
            if (  strpos($tags,"@ENCRYPTFIELD") !== false ) {
                echo '<script>$().ready(function(){ EncryptMyField("' . $field_name . '")});</script>';
            }
        }
        //-- ================================================================ --//
        //-- Add the required JS files                                        --//
        //-- ================================================================ --//
        $this->includeJs('scripts/crypto-js/3.1.2/rollups/aes.js');
        $this->includeJs('scripts/jquery.cookie.js');
        $this->includeJs('scripts/ClientEncryption_v1.0.0.js');
    }

    /**
     * Includes a local JS file.
     *
     * @param string $path
     *   The relative path to the js file.
     */
    protected function includeJs($path) {
        // For shib installations, it is necessary to use the API endpoint for resources
        global $auth_meth;
        $ext_path = $auth_meth == 'shibboleth' ? $this->getUrl($path, true, true) : $this->getUrl($path);
        echo '<script src="' . $ext_path . '"></script>';
    }
    /**
     * Includes a local JS file.
     *
     * @param string $path
     *   The relative path to the js file.
     */
    protected function includeCss($path) {
        // For shib installations, it is necessary to use the API endpoint for resources
        global $auth_meth;
        $ext_path = $auth_meth == 'shibboleth' ? $this->getUrl($path, true, true) : $this->getUrl($path);
        echo '<link rel="stylesheet" href="' . $ext_path . '"/>';
    }
}