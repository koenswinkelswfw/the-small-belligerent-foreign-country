function getFromChromeStorage(keys) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				/*	console.error(
					new Error(
						`Failed to get data from Chrome storage: ${chrome.runtime.lastError.message}`
					)
				)*/
				reject(chrome.runtime.lastError)
			} else {
				resolve(result)
			}
		})
	})
}

function setToChromeStorage(data) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(data, () => {
			if (chrome.runtime.lastError) {
				/*	console.error(
					new Error(
						`Failed to set data to Chrome storage: ${chrome.runtime.lastError.message}`
					)
				)*/
				reject(chrome.runtime.lastError)
			} else {
				resolve()
			}
		})
	})
}

async function setInitialValuesAndUpdateKeyWords() {
	const defaultValues = {
		onOff: 'on',
		websiteList: ['https://www.example.com'],
		inputAreaText: 'https://www.example.com',
		includeExclude: 'exclude',
		allSelect: 'all',
		desktopMobile: 'desktop',
		highlightReplacements: false,
	}

	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)

	if (isMobile) {
		defaultValues.desktopMobile = 'mobile'
	}

	const keys = Object.keys(defaultValues)

	try {
		const currentValues = await getFromChromeStorage(keys)

		const valuesToStore = {}
		for (const key of keys) {
			if (!currentValues.hasOwnProperty(key)) {
				valuesToStore[key] = defaultValues[key]
			}
		}

		if (Object.keys(valuesToStore).length > 0) {
			await setToChromeStorage(valuesToStore)
		}
	} catch (error) {
		/* console.error(
			new Error(`Error in setInitialValuesAndUpdateKeyWords: ${error.message}`)
		)*/
	}
}

function openOptions() {
	const optionsSBFC = chrome.runtime.getURL('OptionsSBFC.html')
	chrome.tabs.create({ url: optionsSBFC })
}

chrome.action.onClicked.addListener(() => {
	const optionsSBFC = chrome.runtime.getURL('OptionsSBFC.html')
	chrome.tabs.create({ url: optionsSBFC })
})

chrome.runtime.onInstalled.addListener(async (details) => {
	if (details.reason === 'install') {
		try {
			const optionsSBFC = chrome.runtime.getURL('OptionsSBFC.html')
			chrome.tabs.create({ url: optionsSBFC })

			setInitialValuesAndUpdateKeyWords()
		} catch (error) {
			/*	console.error(
				new Error(`Error during initialization: ${error.message}`)
			)*/
		}
	}
})
