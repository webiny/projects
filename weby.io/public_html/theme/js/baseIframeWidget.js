var BaseIframeWidget = function () {

	this._inputElement = 'input';
	this._parseErrorMessage = '';
	this._alsoResize = false;
	this._aspectRatio = false;
	this._customOnLoadHandler = false;
	this._isContentLoaded = false;

	this._resizableOptions = {
		start: function (event, ui) {
			$(this).find('.widget-body').prepend('<div class="overlay"></div>');
			App.fireEvent("widget.resize.start", {element: $(this), event: event, ui: ui});
		},
		stop: function (event, ui) {
			App.fireEvent("widget.resize.stop", {element: $(this), event: event, ui: ui});
			$(this).find('.overlay').remove();
			$(this).css('height', 'auto');
		},
		resize: function (event, ui) {
			$(this).find('.overlay').css('height', $(this).height()).css('width', $(this).width());
		}
	};

	this.init = function(){
		BaseWidget.prototype.init.call(this);
	}

	this.onActivate = function(){
		if(!this._isContentLoaded){
			this._html.find(this._inputElement).focus();
		}
	}

	this.onWidgetInserted = function () {
		var $this = this;

		BaseWidget.prototype.onWidgetInserted.call(this);

		this.hideResizeHandle();

		this._html.find(this._inputElement).blur(function () {
			var input = $(this);
			if (input.val() != '') {
				var iframe = $this.getIframe(input.val())
				if (!iframe) {
					$this._html.find('.message').html($this._parseErrorMessage);
					input.val('').focus();
					return;
				}

				var iframeWidth = $(iframe).attr("width");
				var iframeHeight = $(iframe).attr("height");

				iframe = $(iframe)[0];
				iframe.setAttribute("width", 0);
				iframe.setAttribute("height", 0);

				input.hide();
				$this._html.find('.message').hide();
				$(iframe).insertBefore(input);

				// Append LOADING screen (move to BaseWidget)
				$this._html.find('.widget-body').prepend('<div class="loading">' + $this._loadingMessage +
					'<br /><span>This may take a few moments, please be patient.</span></div>');
				if (!$this._customOnLoadHandler) {
					$('#' + $(iframe).attr('id')).bind('load', function () {
						$(iframe).attr("width", iframeWidth).attr("height", iframeHeight);
						$this._html.find('.loading').remove();
						input.remove();
						$this.showResizeHandle();
						$this._html.find('.message').remove();
						$this._isContentLoaded = true;
					});
				}

				if ($this._alsoResize) {
					$this._html.resizable("option", "alsoResize", $this._alsoResize);
				}
				if ($this._aspectRatio) {
					$this._html.resizable("option", "aspectRatio", $this._aspectRatio);
				}
				App.fireEvent("widget.resize.stop", {element: $this._html});
			}
		});

		App.deactivateTool();
		this._html.find($this._inputElement).focus();
	}
}

BaseIframeWidget.prototype = new BaseWidget();
BaseIframeWidget.prototype.constructor = BaseIframeWidget;