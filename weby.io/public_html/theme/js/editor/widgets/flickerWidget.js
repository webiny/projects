function FlickerWidget() {

	this._flickerCode = '';
	this._widgetClass = 'flicker-widget';
	this._parseErrorMessage = 'We couldn\'t insert your Flickr photo. Please try a different one.';
	this._loadingMessage = 'Loading your Flickr photo...';
	this._inputElement = 'textarea';

	this._resizableOptions = {
		minWidth:300,
		minHeight:150
	}

	this.getHTML = function () {
		this._html = '<textarea placeholder="Paste your Flickr embed code">'+test+'</textarea>' +
			'<span class="message"></span>';
		return BaseWidget.prototype.getHTML.call(this);
	};

	this.onWidgetInserted = function () {
		var $this = this;
		BaseWidget.prototype.onWidgetInserted.call(this);
		App.deactivateTool();
		this.input().focus();
		this.hideResizeHandle();
		this.input().bind("blur keydown", function (e) {
			// If key was pressed and it is not ENTER
			if (e.type == "keydown" && e.keyCode != 13) {
				return;
			}
			e.preventDefault();
			var val = $.trim($this.input().val());
			if (val != '') {
				var parser = new FlickerParser();
				if(($this._flickerCode = parser.parse(val))){
					$this.body().html($this._getEmbedCode());
					$this.html().resizable("option", "alsoResize", "#flickr-image-"+$this._id);
					return $this.contentLoaded().showResizeHandle();
				}

				$this.message().html($this._parseErrorMessage);
				$this.input().val('');
			}
		});
	}

	/**
	 * EDIT methods
	 */

	this.getSaveData = function () {
		return {
			flickerCode: this._flickerCode
		}
	}

	this.getEditHTML = function () {
		this._html = this._getEmbedCode();
		return BaseWidget.prototype.getHTML.call(this);
	};

	this._getEmbedCode = function () {
		var code = $(this._flickerCode);
		code.find('img').prop("id", "flickr-image-"+this._id);
		return code;
	}

	this.onEditWidgetInserted = function(){
		this.html().resizable("option", "alsoResize", "#flickr-image-"+this._id);
		this.body('img').css({
			width: this._width,
			height: this._height
		});
	}

	var test = '<a href="http://www.flickr.com/photos/expeditions/9571701710/" title="Yes, I Got Soaked!  :) by Laura Travels, on Flickr"><img src="http://farm8.staticflickr.com/7355/9571701710_77bf085723.jpg" width="500" height="333" alt="Yes, I Got Soaked!  :)"></a>';
}

FlickerWidget.prototype = new BaseWidget();
FlickerWidget.prototype.constructor = FlickerWidget;