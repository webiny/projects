<?php

namespace App\Lib;

use App\AppTrait;
use App\Lib\View;
use Webiny\Component\Security\SecurityTrait;
use Webiny\StdLib\SingletonTrait;
use Webiny\StdLib\StdLibTrait;
use App\Entities\User\UserEntity;

abstract class AbstractHandler
{
    use AppTrait, StdLibTrait, SecurityTrait;

    private $_dataContainer = array();
    private $_template = '';
    private $_templatePath = '';

    public function __construct() {
        $this->_template = Router::getInstance()->getMethod();
        $handlerTemplate = Router::getInstance()->getHandler()->explode('\\')->last()->replace('Handler', '')->caseLower();
        $this->_templatePath = 'templates/' . $handlerTemplate;
    }

    public function output() {
        View::getInstance()->display($this->_template, $this->_dataContainer, $this->_templatePath);
    }

    public function setTemplatePath($dir) {
        $this->_templatePath = removeTrailingSlash($dir) . '/';
    }

    public function setTemplate($template) {
        $this->_template = $template;
    }

    public function __set($name, $value) {
        $this->_dataContainer[$name] = $value;
    }

    public function __get($name) {
        if(isset($this->_dataContainer[$name])) {
            return $this->_dataContainer[$name];
        }

        return null;
    }

    /**
     * Ajax response
     *
     * @param Boolean $error
     * @param String  $msg  (OPTIONAL)
     * @param Array   $data (OPTIONAL)
     */
    public function ajaxResponse($error, $msg = '', $data = array()) {
        $response = array(
            'error' => $error,
            'msg'   => $msg,
            'data'  => $data
        );

        header('Content-type: application/json; charset=utf-8;');
        die(json_encode($response));
    }

}