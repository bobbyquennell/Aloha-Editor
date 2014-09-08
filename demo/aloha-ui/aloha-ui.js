(function (aloha) {
	'use strict';
	
	var Fn = aloha.fn;
	var Dom = aloha.dom;
	var Keys = aloha.keys;
	var Editor = aloha.editor;
	var Editing = aloha.editing;
	var Events = aloha.events;
	var Selections = aloha.selections;
	var Boundaries = aloha.boundaries;
	var Traversing = aloha.traversing;
	var Arrays = aloha.arrays;
	var ACTION_CLASS_PREFIX = 'aloha-action-format-';

	/**
	 * jQuery-like wrapper for document.querySelectorAll
	 * Will accept a selector string and return an array
	 * of found DOM nodes or an empty array
	 *
	 * @param  {string} selector
	 * @return {Array<Element>}
	 */
	function $(selector) {
		return Arrays.coerce(document.querySelectorAll(selector));
	}

	/**
	 * Attach event handlers to an array of elements
	 *
	 * @param {Array<Element>} elements
	 * @param {string}         event
	 * @param {function}       handler
	 */
	function on(elements, event, handler) {
		elements.forEach(function (element) {
			Events.add(element, event, handler);
		});
	}

	/**
	 * Remove a class from an array of elements
	 *
	 * @param {Array<Element>} elements
	 * @param {string}         className
	 */
	function removeClass(elements, className) {
		elements.forEach(function (element) {
			Dom.removeClass(element, className);
		});
	}

	/**
	 * Update an attribute for an array of elements
	 *
	 * @param {Array<Element>} elements
	 * @param {string}         name
	 * @param {string}         value
	 */
	function setAttr(elements, name, value) {
		elements.forEach(function (element) {
			Dom.setAttr(element, name, value);
		});
	}

	/**
	 * Executes an action object as generated by parseAction() which looks like
	 * one of the following:
	 *
	 * {
	 *    format : 'B'
	 * }
	 *
	 * or even a compound of operations ...
	 *
	 * {
	 *    format     : 'B',
	 *    style      : true,
	 *    styleName  : 'background',
	 *    styleValue : 'red'
	 * }
	 *
	 * @private
	 * @param  {!Object.<string, ?>} action
	 * @param  {!Array.<Boundary>}   boundaries
	 * @return {Array.<Boundaries>}
	 */
	function execute(action, boundaries) {
		if (action.format) {
			boundaries = Editing.format(
				boundaries[0],
				boundaries[1],
				action.format
			);
		}
		if (action.unformat) {
			['B', 'I', 'U'].forEach(function (format) {
				boundaries = Editing.unformat(
					boundaries[0],
					boundaries[1],
					format
				);				
			});
		}
		if (action.style) {
			boundaries = Editing.style(
				boundaries[0],
				boundaries[1],
				action.styleName,
				action.styleValue
			);
		}
		if (action.classes) {
			boundaries = Editing.className(
				boundaries[0],
				boundaries[1],
				action.className
			);
		}
		return boundaries;
	}

	/**
	 * TODO not finished. this is a simplified implementation
	 * as not all actions are formatting actions
	 *
	 * Extracts the intended aloha action from a dom element.
	 * Will look through the classes to find an aloha-action-* class, which is
	 * then transformed into an action object that looks like the following:
	 * { format: true, node: 'b' }
	 *
	 * @private
	 * @param  {!Element} element
	 * @return {?Object}
	 */
	function parseAction(element) {
		var action = {};
		var match;
		Dom.childAndParentsUntil(element, function (element) {
			if (element.className) {
				match = element.className.match(/aloha-action-(\w+)(-(\w+))?/);
			}
			if (match || Dom.hasClass(element, 'aloha-ui')) {
				return true;
			} else {
				return false;
			}
		});
		if (match) {
			action[match[1]] = match[3] || true;
		}
		return action;
	}

	/**
	 * Transforms an array of dom nodes into an array of node names
	 * for faster iteration, eg:
	 *
	 * [text, h1, text, p] // array contains DOM nodes
	 *
	 * will return:
	 *
	 * ['P', '#text', 'H1']
	 *
	 * Duplicate entries will be removed, as displayed in the example
	 * above.
	 *
	 * @private
	 * @param {!Array.<Element>} nodes
	 * @return {Array.<string>}
	 */
	function uniqueNodeNames(nodes) {
		var i = nodes.length;
		var arr = [];
		var added = {};
		while (i--) {
			if (!added[nodes[i].nodeName]) {
				arr.push(nodes[i].nodeName);
				added[nodes[i].nodeName] = true;
			}
		}
		return arr;
	}

	/**
	 * Positions the given toolbar element to point to the anchor element in the
	 * document.
	 *
	 * @param  {!Element} toolbar
	 * @param  {!Element} anchor
	 */
	function positionToolbar(toolbar, anchor) {
		var box = aloha.carets.box(Boundaries.range(
			Boundaries.create(anchor, 0),
			Boundaries.create(anchor, 1)
		));
		var center = Math.round(box.left + (box.width / 2));
		var win = Dom.documentWindow(anchor.ownerDocument);
		var windowWidth = win.innerWidth;
		var toolbarWidth = parseInt(Dom.getComputedStyle(toolbar, 'width'), 10);
		var buffer = 10;
		var xMin = buffer;
		var xMax = (windowWidth - toolbarWidth) - buffer;
		var x = Math.min(xMax, Math.max(xMin, center - (toolbarWidth / 2)));
		var y = box.top + box.height + buffer;
		Dom.setStyle(toolbar, 'left', x + 'px');
		Dom.setStyle(toolbar, 'top', y + 'px');
		var arrow = toolbar.querySelector('.aloha-arrow-up');
		var arrowOffset = (x <= xMin || x >= xMax)
		                ? (center - x) + 'px'
		                : 'auto';
		Dom.setStyle(arrow, 'margin-left', arrowOffset);
	}

	function notAnchor(node) { return 'A' !== node.nodeName; }
	function hasClass(className, node) { return Dom.hasClass(node, className); }

	var LinksUI = {

		/**
		 * Opens the given context toolbar for editing the given anchor.
		 *
		 * @param  {!Element} toolbar
		 * @param  {!Element} anchor
		 */
		open: function (toolbar, anchor) {
			var href = Dom.getAttr(anchor, 'href');
			removeClass($('.aloha-active'), 'aloha-active');
			Dom.addClass(anchor, 'aloha-active');
			Dom.addClass(toolbar, 'opened');
			positionToolbar(toolbar, anchor);
			toolbar.querySelector('input').value = href;
			setAttr($('a.aloha-link-follow'), 'href', href);
		},

		/**
		 * Closes the context toolbar.
		 *
		 * @param  {!Element} toolbar
		 * @param  {!Element} anchor
		 */
		close: function(toolbar, anchor) {
			removeClass($('.aloha-active'), 'aloha-active');
			Dom.removeClass(toolbar, 'opened');
		},

		/**
		 * Retrieves a toolbar element from the given document if one exists.
		 *
		 * @param  {!Document} doc
		 * @param  {?Element}
		 */
		toolbar: function (doc) {
			var toolbar = doc.querySelector('.aloha-link-toolbar');
			return (toolbar && Dom.hasClass(toolbar.parentNode, 'aloha-3d'))
				 ? toolbar.parentNode
				 : toolbar;
		},

		/**
		 * Returns the element or its first ancestor that has a 'aloha-ui'
		 * class, if any.
		 *
		 * @param  {!Element} element
		 * @param  {?Element}
		 */
		closestToolbar: function (element) {
			var toolbar = Dom.upWhile(element, Fn.complement(Fn.partial(hasClass, 'aloha-ui')));
			return (toolbar && Dom.hasClass(toolbar.parentNode, 'aloha-3d'))
				 ? toolbar.parentNode
				 : toolbar;
		},

		/**
		 * Handles user interaction on the context toolbar.
		 *
		 * @param  {!Element} element
		 * @param  {!Element} anchor
		 * @param  {!Event}   event
		 */
		interact: function(toolbar, anchor, event) {
			setAttr($('a.aloha-active, a.aloha-link-follow'), 'href', toolbar.querySelector('input').value);
			if (Keys.CODES.hash === event.keycode) {
				// TODO dropdown menu of internal headers and anchors
			}
		},

		/**
		 * inserts a link at the event's boundary position
		 *
		 * @param {!Event} event
		 * @return {Event} event
		 */
		insertLink: function (event) {
			var boundaries = event.selection.boundaries;
			if (Arrays.equal(boundaries[0], boundaries[1])) {
				boundaries = Traversing.expand(boundaries[0], boundaries[1], 'word');
			}
			boundaries = Editing.wrap('A', boundaries[0], boundaries[1]);
			boundaries[0] = Boundaries.next(boundaries[0]);
			boundaries[1] = Boundaries.fromEndOfNode(boundaries[0])[0];
			//var href = Dom.getAttr(Boundaries.container(boundaries[0]), 'href');
			event.selection.boundaries = boundaries;
			LinksUI.open(
				LinksUI.toolbar(event.nativeEvent.target.ownerDocument),
				Boundaries.container(boundaries[0])
			);
			$('.aloha-link-toolbar input[name=href]')[0].focus();
			return event;
		}
	};

	/**
	 * Links-specific UI handling.
	 *
	 * @param {!Event} event
	 */
	function handleLinks(event) {
		var boundaries = event.selection.boundaries;
		var cac = Boundaries.commonContainer(boundaries[0], boundaries[1]);
		var anchor = Dom.upWhile(cac, notAnchor);
		var toolbar = LinksUI.toolbar(event.nativeEvent.target.ownerDocument);
		if (!toolbar) {
			return;
		}
		if (anchor) {
			return LinksUI.open(toolbar, anchor);
		}
		if (toolbar === LinksUI.closestToolbar(event.nativeEvent.target)) {
			return LinksUI.interact(toolbar, anchor, event);
		}
		return LinksUI.close(toolbar, anchor);
	}

	/**
	 * Updates the ui according to current state overrides.
	 *
	 * Sets to active all ui toolbar elements that match the current overrides.
	 *
	 * @private
	 * @param {!Array.<Boundary>} boundries
	 */
	function handleFormats(boundaries) {
		var doc = Boundaries.document(boundaries[0]);
		var formatNodes = uniqueNodeNames(Dom.childAndParentsUntilIncl(
			Boundaries.container(boundaries[0]),
			function (node) {
				return node.parentNode && Dom.isEditingHost(node.parentNode);
			}
		));

		/**
		 * Finds the root ul of a bootstrap dropdown menu
		 * starting from an entry node within the menu.
		 * Returns true until the node is found. Meant to
		 * be used with Dom.upWhile().
		 *
		 * @private
		 * @param {!Node} node
		 * @return {boolean}
		 */
		function isDropdownUl(node) {
			return Array.prototype.indexOf.call(node.classList, 'dropdown-menu') === -1;
		}

		Array.prototype.forEach.call(
			doc.querySelectorAll('.aloha-ui .active'),
			function (node) {
				Dom.removeClass(node, 'active');
			}
		);

		formatNodes.forEach(function (format) {
			// update buttons
			var buttons = doc.querySelectorAll('.aloha-ui .' + ACTION_CLASS_PREFIX + format),
				i = buttons.length;
			while (i--) {
				buttons[i].className += ' active';
			}

			// update dropdowns
			var dropdownEntries = doc
				.querySelectorAll('.aloha-ui .dropdown-menu .' + ACTION_CLASS_PREFIX + format),
				dropdownRoot;
			i = dropdownEntries.length;
			var activeDropdowns = doc.querySelectorAll('.aloha-ui .dropdown-toggle .active');
			if (activeDropdowns.length > 0) {
				activeDropdowns.forEach(function (node) {
					Dom.removeClass('active');
				});
			}
			if (i > 0) {
				var parents = Dom.parentsUntilIncl(dropdownEntries[0], function (node) {
					return Dom.hasClass(node, 'btn-group');
				});
				var btnGroup = Arrays.last(parents);
				Dom.addClass(btnGroup.querySelector('.dropdown-toggle'), 'active');
			}
			while (i--) {
				dropdownRoot = Dom.upWhile(dropdownEntries[i], isDropdownUl).parentNode;
				dropdownRoot.querySelector('.dropdown-toggle').firstChild.data =
					dropdownEntries[i].innerText + ' ';
			}
		});
	}

	on([document], 'click', function (event) {
		var ui = Dom.upWhile(event.target, function (node) {
			return Dom.hasClass(node, 'aloha-ui');
		});

		if (!ui) {
			Editor.selection.boundaries = null;
			Array.prototype.forEach.call(
				document.querySelectorAll('.aloha-ui .active'),
				function (node) {
					Dom.removeClass(node, 'active');
				}
			);
		}
	});

	on($('.aloha-ui'), 'click', function (event) {
		var selection = Editor.selection;
		var action = parseAction(event.target);
		if (action && selection.boundaries) {
			var boundaries = execute(action, selection.boundaries);
			Selections.select(selection, boundaries[0], boundaries[1], selection.focus);
		}
	});

	var shortcutHandlers = {
		'keydown': {
			// meta+k
			'meta+75' : LinksUI.insertLink,
			'ctrl+75' : LinksUI.insertLink
		}
	};

	/**
	 * Handles UI updates invoked by event
	 *
	 * @param  {!AlohaEvent} event
	 * @return {AlohaEvent}
	 */
	function handleUi(event) {
		var shortcutHandler = Keys.shortcutHandler(event, shortcutHandlers);
		if (shortcutHandler) {
			return shortcutHandler(event);
		}
		if ('keyup' === event.type || 'click' === event.type) {
			handleLinks(event);
			handleFormats(event.selection.boundaries);
		}
		return event;
	}

	aloha.editor.stack.unshift(handleUi);
}(window.aloha));
