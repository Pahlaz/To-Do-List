(function() {
	'use strict';

	let addItemForm = document.querySelector('#add-item'),
			contextMenu = document.querySelector('#context-menu'),
			navMenuEl = document.querySelector('#navMenu'),
			settingsPopupEl = document.querySelector('#settingsPopup'),
			overlayEl = document.querySelector('#overlay');

	// get the TO DO LIST items from local storage to list object.
	let list = JSON.parse(localStorage.getItem('TODO-LIST') || '[]');

	function attachItemEvents() {
		document.querySelectorAll('input[type="checkbox"]')
				.forEach( (checkbox) => {
					checkbox.addEventListener('change', (e) => {
							toggleListItemState(e);
						});
				});

		document.querySelectorAll(".list__item").forEach( (item) => {
			item.addEventListener('contextmenu', (event) => {
				openCustomContexMenu(event)
			})
		})
		
	}

	function openCustomContexMenu(event) {
		event.preventDefault();

		contextMenu.style.display = 'block';
		contextMenu.style.top = mouseY(event) + 'px';
		contextMenu.style.left = mouseX(event) + 'px';

		contextMenu.dataset.id = event.target.id;

		window.event.returnValue = false;
	}

	function addItem(id, text, isChecked) {
		let output = document.querySelector('.list__itemAdd');

		let itemTemplate = `
			<div class="list__item" id="${id}">
				<input type="checkbox" id="${id}" ${(isChecked)? 'checked':''}>
				<label for="${id}">${text}</label>
				<input type="text" id="edit-item-field" />
			</div>`;

		output.insertAdjacentHTML('afterend', itemTemplate);
	}

	function deleteItem(id) {
		let item = document.querySelector('#'+id);

		if (window.confirm("Do you really want to delete this item?")) {
			item.parentNode.removeChild(item);
			list = list.filter( (el) => el.id != id );
			localStorage.setItem('TODO-LIST', JSON.stringify(list));
		}
	}

	function toggleListItemState(e) {
		for(let i in list) {
			if(list[i].id == e.target.id) {
				list[i].isChecked = e.target.checked;
			}
		}

		localStorage.setItem('TODO-LIST', JSON.stringify(list));
	}

	// if local storage has TO DO LIST.
	if(list.length > 0) {
		for(let item of list) {
			addItem(item.id, item.text, item.isChecked);
			attachItemEvents();
		}
	}

	addItemForm.addEventListener('submit', function(e) {
		e.preventDefault();

		let id = '_' + Math.random().toString(36).substr(2, 9);
		let text = document.querySelector('input').value;
		let isChecked = false;

		// add TO DO ITEM to list object and local storage.
		list.push({'id': id, 'text': text, 'isChecked': isChecked});
		localStorage.setItem('TODO-LIST', JSON.stringify(list));

		// add TO DO ITEM to UI(list).
		addItem(id, text, isChecked);

		attachItemEvents();

		this.reset();
	});

	function mouseX(evt) {
		if (evt.pageX) {
				return evt.pageX;
		} else if (evt.clientX) {
				return evt.clientX + (document.documentElement.scrollLeft ?
				document.documentElement.scrollLeft :
				document.body.scrollLeft);
		} else {
				return null;
		}
	}
	function mouseY(evt) {
			if (evt.pageY) {
					return evt.pageY;
			} else if (evt.clientY) {
					return evt.clientY + (document.documentElement.scrollTop ?
					document.documentElement.scrollTop :
					document.body.scrollTop);
			} else {
					return null;
			}
	}

	document.addEventListener('click', (event) => {
		contextMenu.style.display = 'none';
	});

	contextMenu.querySelector('#delete-item-button').addEventListener('click', (event) => {
		let itemID = event.target.parentNode.parentNode.dataset.id;

		deleteItem(itemID);
	})

	contextMenu.querySelector('#edit-item-button').addEventListener('click', (event) => {
		let itemID = event.target.parentNode.parentNode.dataset.id;

		// TO DO : on clicking edit button user should be able to edit the item in place
		alert('comming soon');
	})
	
	document.querySelector('header .toggleMenuBtn').addEventListener('click', () => {
		// showing nav menu and overlay
		navMenuEl.style.margin = '0px';
		overlayEl.style.display = 'block';

		// blocking scrolling
		document.querySelector('html').classList.add('blockScroll');
	});

	document.querySelector('#navMenu__controls .toggleMenuBtn.close').addEventListener('click', () => {
		// hiding nav menu and overlay
		navMenuEl.style.margin = '0px 0px 0px -300px';
		overlayEl.style.display = 'none';

		// enabling scrolling
		document.querySelector('html').classList.remove('blockScroll');
	});

	overlayEl.addEventListener('click', () => {
		// closing mav menu on clicking outside
		navMenuEl.style.margin = '0px 0px 0px -300px';
		overlayEl.style.display = 'none';

		// close settings popup if open
		if(settingsPopupEl.style.display != 'none') {
			settingsPopupEl.style.display = 'none';
		}

		// enabling scrolling
		document.querySelector('html').classList.remove('blockScroll');
	})

	document.querySelector('#help').addEventListener('click', () => {
		// TO DO: add help functionality
		alert('Feature Comming Soon');
	});

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/To-Do-List/service-worker.js', {scope: '/To-Do-List/'})
			.then( (registration) => {  
				console.log('[ServiceWorker] Registration successful with scope:) ',    registration.scope);

				if(!navigator.serviceWorker.controller) return;

				if(registration.waiting) {
					console.log('[ServiceWorker] Update Found :)');
				}
			}).catch( (err) => { 
				console.log('[ServiceWorker] Registration failed:( ', err);  
			}); 
	}

})();