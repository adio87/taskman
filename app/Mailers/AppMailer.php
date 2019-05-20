<?php
namespace App\Mailers;

use Mail;
use App\User;

class AppMailer
{
    /**
     * The Laravel Mailer instance.
     *
     * @var Mail
     */
    protected $mailer;
    /**
     * The sender of the email.
     *
     * @var string
     */
    protected $from = 'fkeller@keller-it.ch';
    /**
     * The sender of the name.
     *
     * @var string
     */
    protected $name = 'Taskman';
    /**
     * The recipient of the email.
     *
     * @var string
     */
    protected $to;
    /**
     * The name of recipient of the email.
     *
     * @var string
     */
    protected $to_name = 'Dear Customer';
    /**
     * The subject of the email.
     *
     * @var string
     */
    protected $subject;
    /**
     * The view for the email.
     *
     * @var string
     */
    protected $view;
    /**
     * The data associated with the view for the email.
     *
     * @var array
     */
    protected $data = [];
    /**
     * The template for the email.
     *
     * @var object
     */
    protected $template;
    /**
     * Path to the file that will be attached.
     *
     */
    protected $pathToFile;
    /**
     * Create a new app mailer instance.
     *
     */
    public function __construct()
    {
    }
    /**
     * Prepare sending data.
     * @param $user
     *
     */
    public function prepareSendingHeaders($user = false)
    {
        $this->from = \Config::get('global')['admin_email'];
        $this->name = \Config::get('global')['admin_name'];
        if (!$user) {
            $this->to = \Config::get('global')['contact_email'];
            $this->to_name = \Config::get('global')['admin_name'];
        } else {
            $this->to = $user->email;
            $this->to_name = $user->name;
        }
    }

    /**
     * Deliver the contact form.
     *
     * @param  User $user
     * @param  $subject
     * @param  $template
     * @param  array $post
     * @return array
     */
    public function send(User $user, $subject, $template = false, $post = [])
    {
        $this->prepareSendingHeaders($user);
        $this->subject = $subject;
        $this->template = $template;
        $this->data = compact('post', 'subject');
        if ($template && !env('APP_DEBUG'))
            return $this->deliver();
        return [];
    }

    /**
     * Deliver the email.
     *
     * @return array
     */
    public function deliver()
    {
        return Mail::send($this->template, $this->data, function ($message) {
            $message->from($this->from, $this->name);
            $message->subject($this->subject);
            $message->to($this->to, $this->to_name);
        });
    }
    /**
     * Deliver the email with attaches.
     *
     * @return array
     */
    public function deliverWithAttaches()
    {
        return Mail::send($this->template, $this->data, function ($message) {
            $message->from($this->from, $this->name);
            $message->subject($this->subject);
            $message->to($this->to, $this->to_name);
            $message->attach($this->pathToFile);
        });
    }
}