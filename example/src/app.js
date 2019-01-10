import Load from 'storm-load';
import Tabs from 'storm-tabs';

const onDOMContentLoadedTasks = [() => {

	Load('./js/storm-scroll-spy.standalone.js')
		.then(() => {
			StormScrollSpy.init('.js-scroll-spy', {
				callback: function(next) {
					console.log(next)
				}
			});
			Tabs.init('.js-tabs');
		});
}];

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });
