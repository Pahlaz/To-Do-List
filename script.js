(function() {
	'use strict';

	var addItemForm = document.querySelector('#add-item');

	// get the TO DO LIST items from local storage to list object.
	let list = JSON.parse(localStorage.getItem('TODO-LIST') || '[]');

	function attachItemEvents() {
		// attaching event to delete button.
		let deleteBtn = document.querySelector('.delete-btn');

		deleteBtn.addEventListener('click', (e) => {
			deleteItem(e);
		});

		document.querySelectorAll('input[type="checkbox"]')
				.forEach( (checkbox) => {
					checkbox.addEventListener('change', (e) => {
							onChange(e);
						});
				});
	}

	function addItem(id, text, isChecked) {
		let output = document.querySelector('.list__item:first-child');

		let itemTemplate = `
			<div class="list__item" data-id="${id}">
				<input type="checkbox" id="${id}" ${(isChecked)? 'checked':''}>
				<label for="${id}">${text}</label>
				<span class="delete-btn">x</span>
			</div>`;

		output.insertAdjacentHTML('afterend', itemTemplate);
	}

	function deleteItem(e) {
		let delEl = e.target.parentNode;
		let id = delEl.dataset.id;
		
		if (window.confirm("Do you really want to delete this item?")) {
			delEl.parentNode.removeChild(delEl);
			list = list.filter( (el) => el.id != id );
			localStorage.setItem('TODO-LIST', JSON.stringify(list));
		}
	}

	function onChange(e) {
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