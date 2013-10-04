<?php

namespace App\Handlers;

use App\AppTrait;
use App\Entities\User\UserEntity;
use App\Entities\Weby\WebyEntity;
use App\Lib\AbstractHandler;
use App\Lib\Stats\Stats;
use App\Lib\Traits\UserTrait;
use App\Lib\View;
use Webiny\Component\Http\HttpTrait;
use Webiny\Component\Mailer\MailerTrait;
use Webiny\Component\StdLib\StdObject\StringObject\StringObject;

class UsersHandler extends AbstractHandler
{
    use AppTrait, HttpTrait, UserTrait, MailerTrait;

    /**
     * This will insert logged user into the database on first login to Weby.io
     */
    public function checkUserExists()
    {
        // Get data from OAuth service
        $serviceData = $this->request()->session('oauth_user')->get('oauth2_user');
        $serviceData->serviceUserId = $serviceData->profileId;
        $serviceData->loginIp = $this->request()->getClientIp();

        // Load user by email
        $user = UserEntity::getByEmail($serviceData->email);

        if (!$user) {
            // If user doesn't exist, create him, send him an e-mail,
            // update registered users statistics, create new Weby and then redirect

            $user = new UserEntity();
            $serviceData->username = UserEntity::generateUsername($serviceData->email);
            $user->populate($serviceData)->save();


            // Sending welcome e-mail to our newly created user
            $this->_sendEmail($user);

            // Create new Weby for our new user and redirect him to it
            $weby = new WebyEntity();
            $weby->setUser($this->user())->save();

            // Now update users stats
            Stats::getInstance()->updateRegisteredUsersCount();
            Stats::getInstance()->updateWebiesStats($this->user());

            $this->_notifyLoginNode($user->getId(), $user->getLoginIp());

            // Redirect to editor (if this is new user)
            $this->request()->redirect($weby->getEditorUrl());
        } else {

            // If user exists, then update it's data in Weby database,
            // Saving, so we can sync the data with our database data
            $user->populate($serviceData)->save();
            Stats::getInstance()->updateUsersLoginCount($user);
            $this->_notifyLoginNode($user->getId(), $user->getLoginIp());

            // Redirect to last visited URL
            if (isset($_COOKIE['weby_login_ref'])) {
                $redirectUrl = $_COOKIE['weby_login_ref'];
                unset($_COOKIE['weby_login_ref']);
                $this->request()->redirect($redirectUrl);
            }
            $this->request()->redirect($this->user()->getProfileUrl());
        }
    }

    /**
     * Marks user - has completed introduction tour of Weby.io
     */
    public function markOnboardingDone()
    {
        $this->user()->markOnboardingDone();
        die();
    }

    /**
     * Toggle given Weby (loaded by passed id) from user's favorites list
     */
    public function ajaxToggleFavorite($id)
    {
        $weby = new WebyEntity();
        if (!$weby->load($id)) {
            $this->ajaxResponse(true, 'Could not find Weby!');
        }

        // If we got a valid favorite, that means we are deleting it
        if ($this->user()->inFavorites($weby)) {
            $this->user()->deleteFromFavorites($weby);
        } else {
            // In other case, we are creating a new favorite
            $this->user()->addToFavorites($weby);
        }

        $data = [
            'favoritesCount' => View::formattedNumber($weby->getFavoriteCount()),
            'favoritedBy' => $weby->getUsersFavorited(true)
        ];
        $this->ajaxResponse(false, '', $data);
    }


    /**
     * Toggle given user (loaded by passed id) from logged user's follow list
     */
    public function ajaxToggleFollowing($id)
    {
        $user = new UserEntity();
        if (!$user->load($id)) {
            $this->ajaxResponse(true, 'Could not find user!');
        }
        $this->user()->toggleFollowing($user);

        $this->ajaxResponse(false, '', ['followersCount' => View::formattedNumber($user->getUsersFollowingCount())]);
    }

    /**
     * This sends welcome mail to our newly created user
     * @param UserEntity $user
     */
    private function _sendEmail(UserEntity $user)
    {
        $config = $this->app()->getConfig()->app;
        $mailer = $this->mailer();

        $data = [
            $user->getEmail() => [
                '{fullname}' => $user->getFirstName() . ' ' . $user->getLastName(),
                '{username}' => $user->getUsername(),
                '{email}' => $user->getEmail()
            ]
        ];

        // Let's build our message
        $msg = $mailer->getMessage();
        $msg->setSubject('Welcome to Weby.io!')
            ->setBodyFromTemplate($config->theme_abs_path . 'templates/emails/welcoming.tpl')
            ->setContentType('text/html')
            ->setTo($user->getEmail());

        // Send it
        $mailer->setDecorators($data);
        $mailer->send($msg);
    }

    private function _notifyLoginNode($id, $ip)
    {
        try {
            $fp = @fsockopen($this->app()->getConfig()->app->node_geo_ip, $errno, $errstr);
            if (!$fp) {
                return;
            }

            fwrite($fp, json_encode(['userId' => $id, 'ip' => $ip]));
            fclose($fp);
        } catch (Exception $e) {
            return;
        }
    }
}
