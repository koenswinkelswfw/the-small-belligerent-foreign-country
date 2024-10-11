import { probabilities } from './probabilities.js'

let onOffCS
let allSelectCS
let highlightReplacementsCS
let currentUrl = window.location.href
const processedNodes = new WeakSet()

function markAsProcessed(element) {
	try {
		if (element && element.nodeType === Node.ELEMENT_NODE) {
			element.setAttribute('data-processed', 'true')
		}
	} catch (error) {
		// console.error('Error marking element as processed:', error)
	}
}

function isAlreadyProcessed(element) {
	try {
		if (element && element.nodeType === Node.ELEMENT_NODE) {
			if (element.hasAttribute('data-processed')) {
				return true
			}

			let children = element.getElementsByTagName('*')
			for (let i = 0; i < children.length; i++) {
				if (children[i].hasAttribute('data-processed')) {
					return true
				}
			}
		}
		return false
	} catch (error) {
		// console.error('Error checking if element is processed:', error)
		return false
	}
}

function chooseReplacement(replacementOptions) {
	try {
		if (!Array.isArray(replacementOptions) || replacementOptions.length === 0) {
			return ''
		}

		let totalProbability = 0
		replacementOptions.forEach((option) => {
			if (typeof option.probability !== 'number') {
				throw new Error('Invalid probability value')
			}
			totalProbability += option.probability
		})

		if (totalProbability === 0) {
			return null
		}

		let randomPoint = Math.random() * totalProbability
		let cumulativeProbability = 0

		for (let option of replacementOptions) {
			cumulativeProbability += option.probability

			if (randomPoint <= cumulativeProbability) {
				return option.text
			}
		}

		if (replacementOptions[0]) {
			return replacementOptions[0].text
		} else {
			// console.error('No valid replacement options found.')
			return ''
		}
	} catch (error) {
		// console.error('Error in chooseReplacement:', error)
		return ''
	}
}

function detectCase(sentence) {
	try {
		if (!sentence || sentence.length === 0) {
			return 'unknown case'
		}

		sentence = sentence.trim()

		if (sentence.length === 0) {
			return 'unknown case'
		}

		const isAllCaps = (str) => {
			if (!str || str.length === 0) {
				return false
			}
			return str === str.toUpperCase()
		}

		const isTitleCase = (str) => {
			if (!str || str.length === 0) {
				return false
			}
			const titleCaseExceptions = [
				'a',
				'an',
				'and',
				'as',
				'at',
				'but',
				'by',
				'for',
				'in',
				'nor',
				'of',
				'on',
				'or',
				'so',
				'the',
				'to',
				'up',
				'with',
			]

			const words = str.split(' ')
			const nonExceptionWords = words.filter(
				(word) => word && !titleCaseExceptions.includes(word.toLowerCase())
			)
			const capitalizedWords = nonExceptionWords.filter(
				(word) => word && word[0] && word[0] === word[0].toUpperCase()
			)

			return nonExceptionWords.length > 0
				? capitalizedWords.length / nonExceptionWords.length >= 0.75
				: false
		}

		if (isAllCaps(sentence)) {
			return 'all caps'
		} else if (isTitleCase(sentence)) {
			return 'title case'
		} else {
			return 'sentence case'
		}
	} catch (error) {
		// console.error('Error detecting case:', error)
		return 'unknown case'
	}
}

const keywordRegex =
	/\b(prime minister of Israel|the israeli military's|the israeli military’s|the israeli government|israeli prime minister|israeli defense forces|israeli defense force|israel defense forces|the israeli military|israeli spokesperson|israeli government's|israeli government’s|israel defense force|israeli settlements|the israeli army's|the israeli army’s|israeli government|israel's military|israel’s military|the israeli army|israeli soldiers|israeli settlers|israeli official|israeli military|southern israel|northern israel|israel's army's|israel’s army’s|Israeli attack|western israel|israeli troops|eastern israel|israel's army|israel’s army|israeli army|netanyahu|israelis'|israelis’|israel's|israel’s|israelis|i.d.f.'s|i.d.f.’s|israeli|israel|i.d.f.|idf's|idf’s|idf)\b/gi

function applyFormatting(replacement, fullSentence, offset) {
	try {
		if (typeof replacement !== 'string' || typeof fullSentence !== 'string') {
			return replacement
		}

		const trimmedSentence = fullSentence.trim()
		const caseType = detectCase(trimmedSentence)
		const firstNonWhitespaceIndex = fullSentence.search(/\S/)
		const isAtSentenceStart = offset === firstNonWhitespaceIndex

		let words = replacement.split(' ')
		let formattedWords = words.map((word, index) => {
			if (!word || word.length === 0) {
				return word
			}

			if (word === word.toLowerCase()) {
				if (caseType === 'title case') {
					return word.charAt(0).toUpperCase() + word.slice(1)
				} else if (
					caseType === 'sentence case' &&
					isAtSentenceStart &&
					index === 0
				) {
					return word.charAt(0).toUpperCase() + word.slice(1)
				} else if (caseType === 'all caps') {
					return word.toUpperCase()
				}
			}

			return word
		})

		return formattedWords.join(' ')
	} catch (error) {
		// console.error('Error in applyFormatting:', error)
		return replacement
	}
}

function highlightReplacement(replacement, originalKeyword) {
	try {
		let lowerCaseReplacement = replacement ? replacement.toLowerCase() : ''
		let lowerCaseOriginal = originalKeyword ? originalKeyword.toLowerCase() : ''

		if (lowerCaseReplacement !== lowerCaseOriginal && highlightReplacementsCS) {
			const span = document.createElement('span')
			span.style.backgroundColor = 'rgba(255, 255, 102, 0.3)'
			span.setAttribute('data-processed', 'true')
			span.innerHTML = replacement
			return span.outerHTML
		} else {
			return replacement
		}
	} catch (error) {
		// console.error('Error in highlightReplacement:', error)
		return replacement
	}
}

function replaceUsingTreeWalker(observer) {
	try {
		const walker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			null,
			false
		)
		const nodesToProcess = []

		while (walker.nextNode()) {
			let node = walker.currentNode

			if (
				processedNodes.has(node) ||
				isUserInputElement(node) ||
				isAlreadyProcessed(node.parentNode)
			) {
				continue
			}

			if (node.parentNode && keywordRegex.test(node.nodeValue)) {
				nodesToProcess.push(node)
			}
		}

		if (observer) {
			observer.disconnect()
		}

		nodesToProcess.forEach((node) => {
			try {
				let originalText = node.nodeValue
				let newText = originalText.replace(
					keywordRegex,
					(fullMatch, ...args) => {
						const offset = args[args.length - 2]
						const keyword = fullMatch

						let baseKeyword = keyword.toLowerCase()
						let replacementOptions = getReplacements(baseKeyword)

						let replacement = chooseReplacement(replacementOptions)
						replacement = applyFormatting(replacement, originalText, offset)

						replacement = highlightReplacement(replacement, keyword)

						return replacement
					}
				)

				if (originalText !== newText) {
					let replacementNode = document.createElement('span')
					replacementNode.innerHTML = newText
					node.replaceWith(replacementNode)
					processedNodes.add(replacementNode)

					markAsProcessed(replacementNode.parentNode)
					markAsProcessed(replacementNode)
				} else {
				}
			} catch (error) {
				// console.error('Error processing node:', node, 'Error:', error)
			}
		})

		if (observer) {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			})
		}
	} catch (error) {
		// console.error('Error in replaceUsingTreeWalker:', error)
		if (observer) {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			})
		}
	}
}

function processNewNode(newNode) {
	try {
		if (newNode.nodeType === Node.TEXT_NODE) {
			if (
				processedNodes.has(newNode) ||
				isAlreadyProcessed(newNode.parentNode)
			) {
				return
			}

			if (keywordRegex.test(newNode.nodeValue)) {
				try {
					let originalText = newNode.nodeValue
					let newText = originalText.replace(
						keywordRegex,
						(fullMatch, ...args) => {
							const offset = args[args.length - 2]
							const keyword = fullMatch

							let baseKeyword = keyword.toLowerCase()
							let replacementOptions = getReplacements(baseKeyword)

							let replacement = chooseReplacement(replacementOptions)
							replacement = applyFormatting(replacement, originalText, offset)

							replacement = highlightReplacement(replacement, keyword)

							return replacement
						}
					)

					if (originalText !== newText) {
						let replacementNode = document.createElement('span')
						replacementNode.innerHTML = newText

						newNode.replaceWith(replacementNode)
						processedNodes.add(replacementNode)

						markAsProcessed(replacementNode.parentNode)
						markAsProcessed(replacementNode)
					}
				} catch (error) {
					// console.error('Error processing text node:', newNode, 'Error:', error)
				}
			} else {
			}
		} else if (
			newNode.nodeType === Node.ELEMENT_NODE &&
			newNode.childNodes.length > 0
		) {
			const walker = document.createTreeWalker(
				newNode,
				NodeFilter.SHOW_TEXT,
				null,
				false
			)
			const textNodes = []

			while (walker.nextNode()) {
				textNodes.push(walker.currentNode)
			}

			textNodes.forEach((textNode) => {
				processNewNode(textNode)
			})
		}
	} catch (error) {
		// console.error('Error processing new node:', newNode, 'Error:', error)
	}
}

function observeMutations() {
	try {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				try {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						mutation.addedNodes.forEach((newNode) => {
							processNewNode(newNode)
						})
					} else if (mutation.type === 'characterData') {
						processNewNode(mutation.target)
					}
				} catch (error) {
					// console.error('Error handling mutation:', error)
				}
			})
		})

		replaceUsingTreeWalker(observer)

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
		})
	} catch (error) {
		// console.error('Error in observeMutations:', error)
	}
}

function isUserInputElement(node) {
	try {
		if (node.nodeType !== Node.TEXT_NODE || !node.parentNode) return false

		let currentElement = node.parentNode

		while (currentElement) {
			if (
				currentElement.nodeName === 'INPUT' ||
				currentElement.nodeName === 'TEXTAREA' ||
				currentElement.isContentEditable
			) {
				return true
			}

			currentElement = currentElement.parentNode
		}

		return false
	} catch (error) {
		// console.error('Error in isUserInputElement:', error)
		return false
	}
}

function getReplacements(keyword) {
	try {
		const replacements = probabilities[keyword]
		if (!replacements) {
			// console.warn(`No replacements found for keyword: ${keyword}`)
			return []
		}
		return replacements
	} catch (error) {
		// console.error('Error in getReplacements:', error)
		return []
	}
}

function getChromeLocalStorage(keys) {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.get(keys, function (result) {
				if (chrome.runtime.lastError) {
					/*error(
						'Failed to retrieve data from Chrome local storage:',
						chrome.runtime.lastError.message
					)*/
					reject(chrome.runtime.lastError)
				} else {
					if (Object.keys(result).length === 0 && keys.length > 0) {
						//	console.error('No data found for specified keys:', keys)
						reject(new Error('No data found for specified keys'))
					} else {
						resolve(result)
					}
				}
			})
		} catch (error) {
			//	console.error('Error in getChromeLocalStorage:', error)
			reject(error)
		}
	})
}

async function getGoing() {
	const keys = [
		'websiteList',
		'allSelect',
		'includeExclude',
		'onOff',
		'highlightReplacements',
	]

	try {
		let result
		const maxAttempts = 40

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			result = await getChromeLocalStorage(keys)
			let missingKeys = keys.filter((key) => result[key] === undefined)
			if (missingKeys.length === 0) break

			// console.warn(`Attempt ${attempt + 1}: Missing keys: ${missingKeys}`)
			await new Promise((resolve) => setTimeout(resolve, 1500))
		}

		if (!result || keys.some((key) => result[key] === undefined)) {
			/* console.error(
				'Failed to retrieve all required keys after multiple attempts:',
				keys
			)*/
			return
		}

		onOffCS = result.onOff
		allSelectCS = result.allSelect
		highlightReplacementsCS = result.highlightReplacements

		if (onOffCS === 'off') return

		const isListNotEmpty =
			Array.isArray(result.websiteList) && result.websiteList.length > 0

		const isUrlInList = result.websiteList.some((site) =>
			currentUrl.includes(site)
		)

		if (onOffCS === 'off') {
			return
		}

		if (
			allSelectCS === 'select' &&
			((isListNotEmpty && result.includeExclude === 'exclude' && isUrlInList) ||
				(isListNotEmpty && result.includeExclude === 'include' && !isUrlInList))
		) {
			return
		}

		replaceUsingTreeWalker()
		observeMutations()
	} catch (error) {
		// console.error('Error during initialization in getGoing:', error)
	}
}

getGoing()

window.addEventListener('popstate', () => {
	try {
		getGoing()
	} catch (error) {
		// console.error('Error when handling popstate event:', error)
	}
})
