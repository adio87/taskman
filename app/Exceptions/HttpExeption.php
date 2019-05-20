<?php

namespace App\Exceptions;

use Exception;

class HttpException extends Exception
{
    public function __construct($message, $code, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
