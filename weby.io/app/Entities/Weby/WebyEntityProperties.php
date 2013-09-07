<?php

namespace App\Entities\Weby;


use App\Entities\User\UserEntity;

abstract class WebyEntityProperties extends WebyEntityStorage
{

    /**
     * Total count of times somebody put this Weby to his favorite's list
     */
    protected $_favoriteCount = null;

    /**
     * Here we can store the time when this Weby was added to favorites (used by users favorites section, when
     * opening his favorites dialog, then he can see when he added something to his favorites list)
     */
    protected $_addedToFavoritesTime = null;

    /**
     * @return int
     */
    public function getSlug()
    {
        return $this->_slug;
    }

    /**
     * Holds array of widget objects
     * @var array
     */
    protected $_widgets = array();

    /**
     * Returns array of Widget objects
     * @return array
     */
    public function getWidgets()
    {
        return $this->_widgets;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->_content;
    }

	/**
	 * @return string
	 */
	public function getSettings()
	{
		return $this->_settings;
	}

    /**
     * @return string
     */
    public function getCreatedOn()
    {
        return $this->_createdOn;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->_id;
    }

    /**
     * @return string
     */
    public function getModifiedOn()
    {
        return $this->_modifiedOn;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->_title;
    }

	/**
	 * @return string
	 */
	public function getStorageFolder()
	{
		return $this->_storage;
	}

    /**
     * @return UserEntity
     */
    public function getUser()
    {
        if (!$this->_user instanceof UserEntity) {
            $user = new UserEntity();
            $user->load($this->_user);
            $this->_user = $user;
        }
        return $this->_user;
    }

    /**
     * @return null
     */
    public function getHitCount()
    {
        return $this->_hitCount;
    }

    /**
     * Returns count of total times this Weby was put on someone's favorites list
     * @return bool|Mixed|null
     */
    public function getFavoriteCount()
    {
        if(!$this->_favoriteCount) {
            $this->_favoriteCount = $this->_sqlGetFavoriteCount();
        }
        return $this->_favoriteCount;
    }

    /**
     * @return mixed
     */
    public function getAddedToFavoritesTime()
    {
        return $this->_addedToFavoritesTime;
    }

    /**
     * Gets share counts for every social service (Facebook, Google, Twitter)
     * @return Array Array with keys [facebook], [google] & [twitter], and counts as values
     */
    public function getShareCount() {
        // First, try to get data from cache or social service
        $social = SocialData::getInstance();
        $data = $social->getAllShareCount($this);

        // If that didn't succeed for some reason, return database data
        return $data ? $data : unserialize($this->_shareCount);
    }

    /**
     * @param \App\Entities\User\UserEntity $user
     * @return $this
     */
    public function setUser(UserEntity $user)
    {
        $this->_user = $user;
        return $this;
    }

    /**
     * Sets new sharing counts data
     * @param $counts
     * @return $this
     */
    public function setShareCount($counts) {
        $this->_shareCount = is_array($counts) ? serialize($counts) : $counts;
        return $this;
    }

    /**
     * Sets the time when this Weby was added to favorites (used by Favorites section)
     * @param $time
     * @return $this
     */
    public function setAddedToFavoritesTime($time) {
        $this->_addedToFavoritesTime = $time;
        return $this;
    }
}