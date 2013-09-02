
function Weby() {

	var _FF = !(window.mozInnerScreenX == null);

	/**
	 * Content background
	 */
	var _background = null;

	/**
	 * Document background
	 */
	var _documentBackground = null;

	var _progress = new WebyProgress();

	this.init = function () {
		var items = weby.content.length;

		_background = new WebyBackground(weby.settings);
		_documentBackground = new WebyDocumentBackground(weby.settings.document);

		_progress.startLoading();
		if(_background.getImage() != null){
			items++;
			_progress.setMessage('Loading background...');
			var img = $('<img src="'+_background.getImage()+'" width="1" height="1" style="visibility:hidden"/>')
			img.load(function(){
				$(this).remove();
				_progress.next();
				_background.render();
				if (weby.content.length > 0) {
					_load(weby.content);
				}
			});
			$('body').append(img);
		} else {
			_background.render();
			if (weby.content.length > 0) {
				_load(weby.content);
			}
		}
		_progress.setSteps(items);
		_documentBackground.render();
	};

	/**
	 * Returns a scrollbar width depending on browser
	 */
	this.getScrollBarOffset = function () {
		if (_FF) {
			return 18;
		}
		return 7;
	}

	this.getBackground = function () {
		return _background;
	}

	this.getDocumentBackground = function () {
		return _documentBackground;
	}

	var _load = function (widgets) {

		if (widgets == '') {
			_progress.hideProgress();
			return;
		}

		_progress.setMessage('Loading content...');
		var loaded = 0;
		var _checkLoading = function() {
			loaded++;
			_progress.next();
			if (loaded == widgets.length) {
				_progress.setMessage("Done!");
				$('[type="weby/linkWidgetTemplate"]').remove();
				App.fireEvent("weby.loaded");
				_progress.hideProgress();
			}
		}

		for (var i in widgets) {
			var widgetData = widgets[i];
			var widget = new window[widgetData.common["class"]]();
			var html = widget.createFromData(widgetData);

			// Bind load events
			if (html.find('.widget-body iframe').length > 0) {
				html.find('iframe').load(_checkLoading);
			} else if (html.find('.widget-body img').length > 0) {
				html.find('img').load(_checkLoading);
			} else {
				_checkLoading();
			}

			// Append to DOM
			App.getContent().append(html);
			if ('onWidgetInserted' in widget) {
				widget.onWidgetInserted();
			}
		}
	}
};