import { probabilities } from './probabilities.js'

let onOffCS
let allSelectCS
let currentUrl = window.location.href
const processedNodes = new WeakSet()

function chooseReplacement(replacementOptions) {
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

	return replacementOptions[0].text
}

function detectCase(sentence) {
	if (!sentence || sentence.length === 0) {
		return 'unknown case'
	}

	sentence = sentence.trim()

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
}

const keywordRegex =
	/\b(prime minister of Israel|the israeli military's|the israeli government|israeli prime minister|israeli defense forces|israeli defense force|israel defense forces|the israeli military|israeli spokesperson|israeli government's|israel defense force|israeli settlements|the israeli army's|israeli government|israel's military|the israeli army|israeli soldiers|israeli settlers|israeli official|israeli military|southern israel|northern israel|israel's army's|western israel|israeli troops|eastern israel|israel's army|israeli army|netanyahu|israelis'|israel's|israelis|i.d.f.'s|israeli|israel|i.d.f.|idf's|idf)\b/gi

function applyFormatting(replacement, fullSentence, offset) {
	if (typeof replacement !== 'string' || typeof fullSentence !== 'string') {
		/* console.error('Invalid replacement or fullSentence provided:', {
			replacement,
			fullSentence,
		})*/
		return replacement
	}

	if (!replacement || replacement.length === 0) {
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
}

function isUserInputElement(node) {
	// Check if the node itself is a text node and has a parent node
	if (node.nodeType !== Node.TEXT_NODE || !node.parentNode) return false

	// Traverse up through the parents to check if it's within an input, textarea, or contenteditable element
	let currentElement = node.parentNode

	while (currentElement) {
		if (
			currentElement.nodeName === 'INPUT' ||
			currentElement.nodeName === 'TEXTAREA' ||
			currentElement.isContentEditable
		) {
			return true // The node is inside an input-related or contenteditable element
		}

		// Move up to the next parent node
		currentElement = currentElement.parentNode
	}

	// If none of these conditions are met, it's not a user input element
	return false
}

function replaceUsingTreeWalker(observer) {
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null,
		false
	)

	const nodesToProcess = []

	while (walker.nextNode()) {
		let node = walker.currentNode

		// Skip nodes that are already processed or are inside user-input elements
		if (processedNodes.has(node) || isUserInputElement(node)) {
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
			let newText = originalText.replace(keywordRegex, (fullMatch, ...args) => {
				const offset = args[args.length - 2]
				const keyword = fullMatch

				let baseKeyword = keyword.toLowerCase()
				let replacementOptions = getReplacements(baseKeyword)

				let replacement = chooseReplacement(replacementOptions)

				replacement = applyFormatting(replacement, originalText, offset)

				return replacement
			})

			if (originalText !== newText) {
				node.nodeValue = newText
				processedNodes.add(node)
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
}

function getReplacements(keyword) {
	return probabilities[keyword]
}

function processNewNode(newNode) {
	if (newNode.nodeType === Node.TEXT_NODE) {
		if (processedNodes.has(newNode)) {
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

						return replacement
					}
				)

				if (originalText !== newText) {
					newNode.nodeValue = newText
					processedNodes.add(newNode)
				}
			} catch (error) {
				// console.error('Error processing text node:', newNode, 'Error:', error)
			}
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
}

function observeMutations() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((newNode) => {
					processNewNode(newNode)
				})
			} else if (mutation.type === 'characterData') {
				processNewNode(mutation.target)
			}
		})
	})

	replaceUsingTreeWalker(observer)

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
	})
}

function getChromeLocalStorage(keys) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(keys, function (result) {
			if (chrome.runtime.lastError) {
				/*	console.error(
					'Failed to retrieve data from Chrome local storage:',
					chrome.runtime.lastError.message
				)*/
				reject(chrome.runtime.lastError)
			} else {
				if (Object.keys(result).length === 0 && keys.length > 0) {
					//		console.error('No data found for specified keys:', keys)
					reject(new Error('No data found for specified keys'))
				} else {
					resolve(result)
				}
			}
		})
	})
}

async function getGoing() {
	const keys = ['websiteList', 'allSelect', 'includeExclude', 'onOff']

	try {
		let result
		const maxAttempts = 40
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			result = await getChromeLocalStorage(keys)
			let missingKeys = keys.filter((key) => result[key] === undefined)
			if (missingKeys.length === 0) break

			await new Promise((resolve) => setTimeout(resolve, 1500))
		}

		if (!result || keys.some((key) => result[key] === undefined)) {
			//	console.error('Failed to retrieve all required keys:', keys)
			return
		}

		onOffCS = result.onOff
		allSelectCS = result.allSelect

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
		//	console.error('Error during initialization:', error)
	}
}

getGoing()

window.addEventListener('popstate', () => {
	try {
		getGoing()
	} catch (error) {
		//	console.error('Error when handling popstate event:', error)
	}
})
