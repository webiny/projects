function Weby() {

	// Prevent calling constructor twice!
	if (_webyId) {
		return;
	}

	var _saveInterval = null;
	var _saveIntervalTime = 15000;
	var _FF = !(window.mozInnerScreenX == null);
	var _widgets = {};
	var _invalidUrls = [];
	var _unknownFileTypes = [];
	var _counter = {};
	var _webyId = false;
	var _webyToolbar = null;
	var _title = 'My Weby';
	var _webySave = new WebySave();
	var _labelTimeout = null;
	var _webyTitle = new WebyTitle();

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

		if (typeof weby != "undefined") {
			var items = weby.content.length;
			_webyId = weby.id;
			_title = weby.title;
			if ('color' in weby.settings) {
				_background = new WebyBackground(weby.settings);
			} else {
				_background = new WebyBackground();
			}

			if ('document' in weby.settings) {
				_documentBackground = new WebyDocumentBackground(weby.settings.document);
			} else {
				_documentBackground = new WebyDocumentBackground();
			}

			_webyToolbar = new WebyToolbar();

			_progress.startLoading();
			if (_background.getImage() != null) {
				items++;
				_progress.setMessage('Loading background...');
				var img = $('<img src="' + _background.getImage() + '" width="1" height="1" style="visibility:hidden"/>')
				img.load(function () {
					$(this).remove();
					_progress.next();
					_background.render();
					_load(weby.content);
				});
				$('body').append(img);
			} else {
				_background.render();
				_load(weby.content);
			}
			_progress.setSteps(items);
			_documentBackground.render();

			// Create periodic save action
			_saveInterval = setInterval(_save, _saveIntervalTime);

			// Catch window close event
			$(window).bind("beforeunload", function () {
				App.getWeby().save(true);
			});
		} else {
			// Setup background
			_background.render();
			_documentBackground.render();
		}
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

	this.getToolbar = function () {
		return _webyToolbar;
	}

	this.getWidgets = function () {
		return _widgets;
	};

	this.getWidget = function (id) {
		if (id in _widgets) {
			return _widgets[id];
		}
		return false;
	};

	this.addWidget = function (widget) {
		_widgets[widget.getId()] = widget;
		return this;
	};

	this.removeWidget = function (id) {
		App.unsetActiveWidget();
		delete _widgets[id];

	};

	this.logInvalidUrl = function (url) {
		_invalidUrls.push(url);
	};

	this.logUnknownFileType = function (url, contentType) {
		_unknownFileTypes.push({
			url: url,
			type: contentType
		});
	};

	this.duplicateWidget = function (widget) {
		var data = widget.save();
		var newWidget = new window[data.common["class"]]();
		widget.deactivate();
		data.common.top = parseInt(data.common.top) + 25;
		data.common.left = parseInt(data.common.left) + 25;
		newWidget.setId(++BaseTool.WIDGET_COUNT).createFromData(data);
		App.setActiveWidget(newWidget);
		newWidget.activate();
		_widgets[newWidget.getId()] = newWidget;
	};

	this.getId = function () {
		return _webyId;
	};

	this.save = function (takeScreenshot) {
		if (!_webyId) {
			return;
		}

		clearTimeout(_labelTimeout);
		var settings = _background.save();
		settings['document'] = _documentBackground.save();

		var data = {
			id: _webyId,
			title: _title,
			content: [],
			settings: settings,
			counter: _counter,
			unknownFileTypes: _unknownFileTypes,
			invalidUrls: _invalidUrls
		};

		if (takeScreenshot != undefined) {
			//data['takeScreenshot'] = true;
		}

		// When saving widgets make sure all of them have width and height property set
		for (var i in _widgets) {
			var widget = _widgets[i];
			if (!widget.isContentLoaded()) {
				continue;
			}
			data.content.push(widget.save());
		}

		var options = {
			url: WEB + 'editor/save/',
			data: data,
			method: 'POST',
			async: takeScreenshot == undefined,
			success: function (data) {
				if (!data.error) {
					// Reset logs
					_counter = {};
					_unknownFileTypes = [];
					_invalidUrls = [];
					_webySave.setMessage('Last saved at ' + data.data.time);
					_labelTimeout = setTimeout(function () {
						_webySave.hide();
					}, 2000)
					clearInterval(_saveInterval);
					_saveInterval = setInterval(_save, _saveIntervalTime);
				}
			}
		};
		_webySave.setMessage('Saving...').show();
		$.ajax(options);

	};

	this.setContainment = function (containment) {
		for (var i in _widgets) {
			_widgets[i].setContainment(containment);
		}
		return this;
	}

	var _load = function (widgets) {

		if (widgets == '') {
			_progress.hideProgress();
            App.fireEvent("weby.loaded");
			return;
		}

		_progress.setMessage('Loading content...');
		var loaded = 0;
		var _checkLoading = function () {
			loaded++;
			_progress.next();
			if (loaded == widgets.length) {
				_progress.setMessage("Done!");
				App.fireEvent("weby.loaded");
				_progress.hideProgress();
			}
		}

		for (var i in widgets) {
			var widgetData = widgets[i];
			var widget = new window[widgetData.common["class"]]();
			var html = widget.setId(++BaseTool.WIDGET_COUNT).createFromData(widgetData).html();
			_widgets[widget.getId()] = widget;

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
			if ('onEditWidgetInserted' in widget) {
				widget.onEditWidgetInserted();
			}
		}
	};

	var _save = function () {
		App.getWeby().save();
	};

	// EVENTS

	this.widgetActivated = function (widget) {
		_webyToolbar.widgetActivated(widget);
	}

	this.toolbarMaximized = this.toolbarMinimized = function (toolbarWrapper) {
		for (var i in _widgets) {
			_widgets[i].setContainment([App.getToolbarWrapper().outerWidth(), App.getHeader().outerHeight()]);
		}
		_background.viewportResize();
	};

	this.widgetActivated = function (widget) {
		_webyToolbar.widgetActivated(widget);
	}

	this.widgetDeactivated = function (widget) {
		_webyToolbar.widgetDeactivated(widget);
	}

	this.widgetCreated = function (widget) {
		var type = widget.constructor.name.replace('Widget', '').toLowerCase();
		if (!_counter.hasOwnProperty(type)) {
			_counter[type] = 0;
		}
		_counter[type]++;
	};

	this.widgetDeleted = function (widget) {
		var type = widget.constructor.name.replace('Widget', '').toLowerCase();
		if (!_counter.hasOwnProperty(type)) {
			_counter[type] = 0;
		}
		_counter[type]--;
	};

	this.widgetDragStop = function (data) {
		_background.widgetDragStop(data);
	}
};
