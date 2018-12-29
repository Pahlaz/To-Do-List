class Settings {
  constructor() {
    this.settingsPopupEl = document.querySelector('#settingsPopup')
    this.settingsCacheObj = JSON.parse(localStorage.getItem('TODO-LIST-Settings') || '{}')
    this.themeOptionsListEL = document.querySelectorAll('.themeOptions input')

    this.closeSettingsPopup = this.closeSettingsPopup.bind(this)
    this.openSettingsPopup = this.openSettingsPopup.bind(this)
    
    this.attachEvents()
    this.cacheData = JSON.stringify(this.settingsCacheObj)
  }

  attachEvents() {
    this.settingsPopupEl.querySelector('.toggleMenuBtn.close').addEventListener('click', this.closeSettingsPopup)
    document.querySelector('#settingsLink').addEventListener('click', this.openSettingsPopup)

    this.themeOptionsListEL.forEach((option) => {
      option.addEventListener('change', (event) => this.theme = event.target.value)
    })
  }

  // sets theme value in UI (setings popup)
  set theme(themeName) {
    for(let option of this.themeOptionsListEL) {
      if(option.value == themeName) {
        option.checked = true

        // applying theme to UI
        document.querySelector('body').classList = ''
        document.querySelector('body').classList.add(`theme-${themeName}`);

        // updating theme in local storage
        this.settingsCacheObj.theme = themeName
        localStorage.setItem('TODO-LIST-Settings', JSON.stringify(this.settingsCacheObj))

        return
      }
    }
  }

  // sets options list value in UI
  set optionsList(optionsListObj) {
    document.querySelectorAll('#optionsList input').forEach((input) => {
      if(optionsListObj[input.value]) 
        input.checked = true;
    })
  }

  openSettingsPopup() {
    // closing nav menu
		document.querySelector('#navMenu').style.margin = '0px 0px 0px -300px';

		// showing settings popup
		this.settingsPopupEl.style.display = 'block';
  }

  closeSettingsPopup() {
    // hiding overlay and settings popup
    document.querySelector('#overlay').style.display = 'none';
    this.settingsPopupEl.style.display = 'none';
    
    // enabling scrolling
		document.querySelector('html').classList.remove('blockScroll');
  }

  set cacheData(cacheDataObj) {
    if(cacheDataObj == '{}') {
      this.settingsCacheObj = {
        theme: 'dark',
        optionsList: {
          checkedItemsToBottom: false,
          gDrive: false
        }
      }
      
      // store settings in localStorage
      localStorage.setItem('TODO-LIST-Settings', JSON.stringify(this.settingsCacheObj))
    }

    // applying settings to UI
    this.theme = this.settingsCacheObj.theme
    this.optionsList = this.settingsCacheObj.optionsList
  }
}

new Settings();