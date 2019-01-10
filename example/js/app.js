(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _stormLoad = require('storm-load');

var _stormLoad2 = _interopRequireDefault(_stormLoad);

var _stormTabs = require('storm-tabs');

var _stormTabs2 = _interopRequireDefault(_stormTabs);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {

	(0, _stormLoad2.default)('./js/storm-scroll-spy.standalone.js').then(function () {
		StormScrollSpy.init('.js-scroll-spy', {
			callback: function callback(next) {
				console.log(next);
			}
		});
		_stormTabs2.default.init('.js-tabs');
	});
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"storm-load":2,"storm-tabs":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * @name storm-load: Lightweight promise-based script loader
 * @version 1.0.2: Fri, 09 Mar 2018 16:01:43 GMT
 * @author stormid
 * @license MIT
 */
var create = function create(url) {
	var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	return new Promise(function (resolve, reject) {
		var s = document.createElement('script');
		s.src = url;
		s.async = async;
		s.onload = s.onreadystatechange = function () {
			if (!this.readyState || this.readyState === 'complete') resolve();
		};
		s.onerror = s.onabort = reject;
		document.head.appendChild(s);
	});
};

var synchronous = exports.synchronous = function synchronous(urls) {
	return new Promise(function (resolve, reject) {
		var next = function next() {
			if (!urls.length) return resolve();
			create(urls.shift(), false).then(next).catch(reject);
		};
		next();
	});
};

exports.default = function (urls) {
	var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	urls = [].concat(urls);
	if (!async) return synchronous(urls);

	return Promise.all(urls.map(function (url) {
		return create(url);
	}));
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @name storm-tabs: For multi-panelled content areas
 * @version 1.3.1: Fri, 09 Mar 2018 17:16:25 GMT
 * @author stormid
 * @license MIT
 */
var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Tabs cannot be initialised, no augmentable elements found');

	return els.map(function (el) {
		return Object.assign(Object.create(_componentPrototype2.default), {
			DOMElement: el,
			settings: Object.assign({}, _defaults2.default, el.dataset, opts)
		}).init();
	});
};

exports.default = { init: init };

},{"./lib/component-prototype":4,"./lib/defaults":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var KEY_CODES = {
    SPACE: 32,
    ENTER: 13,
    TAB: 9,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
};

exports.default = {
    init: function init() {
        var _this = this;

        var hash = location.hash.slice(1) || false;

        this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleClass));
        this.panels = this.tabs.map(function (el) {
            return document.getElementById(el.getAttribute('href').substr(1)) || console.error('Tab target not found');
        });
        !!this.tabs.length && this.tabs[0].parentNode.setAttribute('role', 'tablist');
        this.current = this.settings.active;

        if (hash !== false) this.panels.forEach(function (target, i) {
            if (target.getAttribute('id') === hash) _this.current = i;
        });

        this.initAttributes().initTabs().open(this.current);

        return this;
    },
    initAttributes: function initAttributes() {
        var _this2 = this;

        this.tabs.forEach(function (tab, i) {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', false);
            _this2.panels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
            tab.setAttribute('tabindex', '-1');
            _this2.panels[i].setAttribute('role', 'tabpanel');
            _this2.panels[i].setAttribute('hidden', 'hidden');
            _this2.panels[i].setAttribute('tabindex', '-1');
            if (!_this2.panels[i].firstElementChild || _this2.panels[i].firstElementChild.hasAttribute('tabindex')) return;
            _this2.panels[i].firstElementChild.setAttribute('tabindex', '-1');
        });
        return this;
    },
    initTabs: function initTabs() {
        var _this3 = this;

        var change = function change(id) {
            _this3.toggle(id);
            window.setTimeout(function () {
                _this3.tabs[_this3.current].focus();
            }, 16);
        },
            nextId = function nextId() {
            return _this3.current === _this3.tabs.length - 1 ? 0 : _this3.current + 1;
        },
            previousId = function previousId() {
            return _this3.current === 0 ? _this3.tabs.length - 1 : _this3.current - 1;
        };

        this.tabs.forEach(function (el, i) {
            el.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case KEY_CODES.LEFT:
                        change.call(_this3, previousId());
                        break;
                    case KEY_CODES.DOWN:
                        e.preventDefault();
                        e.stopPropagation();
                        _this3.panels[i].focus();
                        break;
                    case KEY_CODES.RIGHT:
                        change.call(_this3, nextId());
                        break;
                    case KEY_CODES.ENTER:
                        change.call(_this3, i);
                        break;
                    case KEY_CODES.SPACE:
                        e.preventDefault();
                        change.call(_this3, i);
                        break;
                    default:
                        break;
                }
            });
            el.addEventListener('click', function (e) {
                e.preventDefault();
                change.call(_this3, i);
            }, false);
        });

        return this;
    },
    change: function change(type, i) {
        this.tabs[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        this.panels[i].classList[type === 'open' ? 'add' : 'remove'](this.settings.currentClass);
        type === 'open' ? this.panels[i].removeAttribute('hidden') : this.panels[i].setAttribute('hidden', 'hidden');
        this.tabs[i].setAttribute('aria-selected', this.tabs[i].getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        (type === 'open' ? this.tabs[i] : this.tabs[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
        (type === 'open' ? this.panels[i] : this.panels[this.current]).setAttribute('tabindex', type === 'open' ? '0' : '-1');
    },
    open: function open(i) {
        this.change('open', i);
        this.current = i;
        return this;
    },
    close: function close(i) {
        this.change('close', i);
        return this;
    },
    toggle: function toggle(i) {
        if (this.current === i) return;

        this.settings.updateURL && window.history && window.history.replaceState({ URL: this.tabs[i].getAttribute('href') }, '', this.tabs[i].getAttribute('href'));
        if (this.current === null) this.open(i);else this.close(this.current).open(i);

        return this;
    }
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    titleClass: '.js-tabs__link',
    currentClass: 'active',
    updateURL: true,
    active: 0
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tbG9hZC9kaXN0L3N0b3JtLWxvYWQuanMiLCJub2RlX21vZHVsZXMvc3Rvcm0tdGFicy9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3N0b3JtLXRhYnMvZGlzdC9saWIvY29tcG9uZW50LXByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9zdG9ybS10YWJzL2Rpc3QvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFBLGFBQUEsUUFBQSxZQUFBLENBQUE7Ozs7QUFDQSxJQUFBLGFBQUEsUUFBQSxZQUFBLENBQUE7Ozs7Ozs7O0FBRUEsSUFBTSwwQkFBMEIsQ0FBQyxZQUFNOztBQUV0QyxFQUFBLEdBQUEsWUFBQSxPQUFBLEVBQUEscUNBQUEsRUFBQSxJQUFBLENBQ08sWUFBTTtBQUNYLGlCQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFzQztBQUNyQyxhQUFVLFNBQUEsUUFBQSxDQUFBLElBQUEsRUFBZTtBQUN4QixZQUFBLEdBQUEsQ0FBQSxJQUFBO0FBQ0E7QUFIb0MsR0FBdEM7QUFLQSxjQUFBLE9BQUEsQ0FBQSxJQUFBLENBQUEsVUFBQTtBQVBGLEVBQUE7QUFGRCxDQUFnQyxDQUFoQzs7QUFhQSxJQUFHLHNCQUFILE1BQUEsRUFBaUMsT0FBQSxnQkFBQSxDQUFBLGtCQUFBLEVBQTRDLFlBQU07QUFBRSx5QkFBQSxPQUFBLENBQWdDLFVBQUEsRUFBQSxFQUFBO0FBQUEsU0FBQSxJQUFBO0FBQWhDLEVBQUE7QUFBcEQsQ0FBQTs7Ozs7Ozs7QUNoQmpDOzs7Ozs7QUFNQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQUMsR0FBRCxFQUF1QjtBQUFBLEtBQWpCLEtBQWlCLHVFQUFULElBQVM7O0FBQ3JDLFFBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUs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QUFLLEtBQUwsQ0FBVyxLQUFLLE9BQWhCLEVBQXlCLElBQXpCLENBQThCLENBQTlCOztBQUVMLGVBQU8sSUFBUDtBQUNIO0FBakdVLEM7Ozs7Ozs7O2tCQ1RBO0FBQ1gsZ0JBQVksZ0JBREQ7QUFFWCxrQkFBYyxRQUZIO0FBR1gsZUFBVyxJQUhBO0FBSVgsWUFBUTtBQUpHLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgTG9hZCBmcm9tICdzdG9ybS1sb2FkJztcbmltcG9ydCBUYWJzIGZyb20gJ3N0b3JtLXRhYnMnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cblx0TG9hZCgnLi9qcy9zdG9ybS1zY3JvbGwtc3B5LnN0YW5kYWxvbmUuanMnKVxuXHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFN0b3JtU2Nyb2xsU3B5LmluaXQoJy5qcy1zY3JvbGwtc3B5Jywge1xuXHRcdFx0XHRjYWxsYmFjazogZnVuY3Rpb24obmV4dCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKG5leHQpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0VGFicy5pbml0KCcuanMtdGFicycpO1xuXHRcdH0pO1xufV07XG5cbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pO1xuIiwiLyoqXG4gKiBAbmFtZSBzdG9ybS1sb2FkOiBMaWdodHdlaWdodCBwcm9taXNlLWJhc2VkIHNjcmlwdCBsb2FkZXJcbiAqIEB2ZXJzaW9uIDEuMC4yOiBGcmksIDA5IE1hciAyMDE4IDE2OjAxOjQzIEdNVFxuICogQGF1dGhvciBzdG9ybWlkXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuY29uc3QgY3JlYXRlID0gKHVybCwgYXN5bmMgPSB0cnVlKSA9PiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0bGV0IHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzLnNyYyA9IHVybDtcblx0XHRzLmFzeW5jID0gYXN5bmM7XG5cdFx0cy5vbmxvYWQgPSBzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCF0aGlzLnJlYWR5U3RhdGUgfHwgdGhpcy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSByZXNvbHZlKCk7XG5cdFx0fTtcblx0XHRzLm9uZXJyb3IgPSBzLm9uYWJvcnQgPSByZWplY3Q7XG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzKTtcblx0fSk7XG59O1xuXG5leHBvcnQgY29uc3Qgc3luY2hyb25vdXMgPSB1cmxzID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRsZXQgbmV4dCA9ICgpID0+IHtcblx0XHRcdGlmICghdXJscy5sZW5ndGgpIHJldHVybiByZXNvbHZlKCk7XG5cdFx0XHRjcmVhdGUodXJscy5zaGlmdCgpLCBmYWxzZSkudGhlbihuZXh0KS5jYXRjaChyZWplY3QpO1xuXHRcdH07XG5cdFx0bmV4dCgpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICh1cmxzLCBhc3luYyA9IHRydWUpID0+IHtcblx0dXJscyA9IFtdLmNvbmNhdCh1cmxzKTtcblx0aWYgKCFhc3luYykgcmV0dXJuIHN5bmNocm9ub3VzKHVybHMpO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gY3JlYXRlKHVybCkpKTtcbn07IiwiLyoqXG4gKiBAbmFtZSBzdG9ybS10YWJzOiBGb3IgbXVsdGktcGFuZWxsZWQgY29udGVudCBhcmVhc1xuICogQHZlcnNpb24gMS4zLjE6IEZyaSwgMDkgTWFyIDIwMTggMTc6MTY6MjUgR01UXG4gKiBAYXV0aG9yIHN0b3JtaWRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RhYnMgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBlbHMubWFwKChlbCkgPT4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRcdERPTUVsZW1lbnQ6IGVsLFxuXHRcdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBlbC5kYXRhc2V0LCBvcHRzKVxuXHRcdH0pLmluaXQoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBLRVlfQ09ERVMgPSB7XG4gICAgU1BBQ0U6IDMyLFxuICAgIEVOVEVSOiAxMyxcbiAgICBUQUI6IDksXG4gICAgTEVGVDogMzcsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpIHx8IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudGFicyA9IFtdLnNsaWNlLmNhbGwodGhpcy5ET01FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy50aXRsZUNsYXNzKSk7XG4gICAgICAgIHRoaXMucGFuZWxzID0gdGhpcy50YWJzLm1hcChlbCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpIHx8IGNvbnNvbGUuZXJyb3IoJ1RhYiB0YXJnZXQgbm90IGZvdW5kJykpO1xuICAgICAgICAhIXRoaXMudGFicy5sZW5ndGggJiYgdGhpcy50YWJzWzBdLnBhcmVudE5vZGUuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zZXR0aW5ncy5hY3RpdmU7XG5cbiAgICAgICAgaWYoaGFzaCAhPT0gZmFsc2UpIHRoaXMucGFuZWxzLmZvckVhY2goKHRhcmdldCwgaSkgPT4geyBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSA9PT0gaGFzaCkgdGhpcy5jdXJyZW50ID0gaTsgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpXG4gICAgICAgICAgICAuaW5pdFRhYnMoKVxuICAgICAgICAgICAgLm9wZW4odGhpcy5jdXJyZW50KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXRBdHRyaWJ1dGVzKCkge1xuICAgICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYicpO1xuICAgICAgICAgICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgdGFiLmdldEF0dHJpYnV0ZSgnaWQnKSk7XG4gICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYnBhbmVsJyk7XG4gICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZCB8fCB0aGlzLnBhbmVsc1tpXS5maXJzdEVsZW1lbnRDaGlsZC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucGFuZWxzW2ldLmZpcnN0RWxlbWVudENoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdFRhYnMoKSB7XG4gICAgICAgIGxldCBjaGFuZ2UgPSBpZCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoaWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy50YWJzW3RoaXMuY3VycmVudF0uZm9jdXMoKTsgfSwgMTYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5leHRJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IHRoaXMudGFicy5sZW5ndGggLSAxID8gMCA6IHRoaXMuY3VycmVudCArIDEpLFxuICAgICAgICAgICAgcHJldmlvdXNJZCA9ICgpID0+ICh0aGlzLmN1cnJlbnQgPT09IDAgPyB0aGlzLnRhYnMubGVuZ3RoIC0gMSA6IHRoaXMuY3VycmVudCAtIDEpO1xuXG4gICAgICAgIHRoaXMudGFicy5mb3JFYWNoKChlbCwgaSkgPT4ge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgcHJldmlvdXNJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLRVlfQ09ERVMuRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhbmVsc1tpXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5SSUdIVDpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgbmV4dElkKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtFWV9DT0RFUy5FTlRFUjpcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlLmNhbGwodGhpcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgS0VZX0NPREVTLlNQQUNFOlxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNoYW5nZS5jYWxsKHRoaXMsIGkpOyAgXG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2hhbmdlKHR5cGUsIGkpIHtcbiAgICAgICAgdGhpcy50YWJzW2ldLmNsYXNzTGlzdFsodHlwZSA9PT0gJ29wZW4nID8gJ2FkZCcgOiAncmVtb3ZlJyldKHRoaXMuc2V0dGluZ3MuY3VycmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5wYW5lbHNbaV0uY2xhc3NMaXN0Wyh0eXBlID09PSAnb3BlbicgPyAnYWRkJyA6ICdyZW1vdmUnKV0odGhpcy5zZXR0aW5ncy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICB0eXBlID09PSAnb3BlbicgPyB0aGlzLnBhbmVsc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpIDogdGhpcy5wYW5lbHNbaV0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCAnaGlkZGVuJyk7XG4gICAgICAgIHRoaXMudGFic1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLnRhYnNbaV0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJyA/ICdmYWxzZScgOiAndHJ1ZScgKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMudGFic1tpXSA6IHRoaXMudGFic1t0aGlzLmN1cnJlbnRdKS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgKHR5cGUgPT09ICdvcGVuJyA/ICcwJyA6ICctMScpKTtcbiAgICAgICAgKHR5cGUgPT09ICdvcGVuJyA/IHRoaXMucGFuZWxzW2ldIDogdGhpcy5wYW5lbHNbdGhpcy5jdXJyZW50XSkuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICh0eXBlID09PSAnb3BlbicgPyAnMCcgOiAnLTEnKSk7XG4gICAgfSxcbiAgICBvcGVuKGkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2UoJ29wZW4nLCBpKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gaTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbG9zZShpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlKCdjbG9zZScsIGkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvZ2dsZShpKSB7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudCA9PT0gaSkgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgKHRoaXMuc2V0dGluZ3MudXBkYXRlVVJMICYmIHdpbmRvdy5oaXN0b3J5KSAmJiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoeyBVUkw6IHRoaXMudGFic1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB9LCAnJywgdGhpcy50YWJzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50ID09PSBudWxsKSB0aGlzLm9wZW4oaSk7XG4gICAgICAgIGVsc2UgdGhpcy5jbG9zZSh0aGlzLmN1cnJlbnQpLm9wZW4oaSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgdGl0bGVDbGFzczogJy5qcy10YWJzX19saW5rJyxcbiAgICBjdXJyZW50Q2xhc3M6ICdhY3RpdmUnLFxuICAgIHVwZGF0ZVVSTDogdHJ1ZSxcbiAgICBhY3RpdmU6IDBcbn07Il19
