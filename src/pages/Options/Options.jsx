import world from '../../public/images/world.png'
import React, { useEffect, useState, useRef } from 'react'
import './options.css'
import validator from 'validator'

import {
	ParentCommonContainer,
	CommonContainer,
	OptionsDividerExtraBottom,
	RadioOnOffContainer,
	ChoiceComponentContainer,
	ComponentContainer,
	RadioContainer,
	InputFormContainer,
	InputTextareaContainer,
	InputFormTextarea,
	ComponentInputFormContainer,
	RadioContainerInputForm,
	InputFormChoiceComponentContainer,
	ImageContainer,
	StyledLabel,
	StyledInput,
} from './StyledComponents.js'

const Options = () => {
	const [onOffSv, setOnOffSv] = useState(null)
	const [allSelectSv, setAllSelectSv] = useState(null)
	const [websiteListSv, setWebsiteListSv] = useState(null)
	const [showInputForm, setShowInputForm] = useState(null)
	const [inputAreaTextSv, setInputAreaTextSv] = useState(null)
	const [includeExcludeSv, setIncludeExcludeSv] = useState(null)
	const [desktopMobileSv, setDesktopMobileSv] = useState(null)
	const inputAreaTextSvRef = useRef(inputAreaTextSv)

	const stateSetters = {
		desktopMobile: setDesktopMobileSv,
		onOff: setOnOffSv,
		websiteList: setWebsiteListSv,
		inputAreaText: setInputAreaTextSv,
		allSelect: setAllSelectSv,
		includeExclude: setIncludeExcludeSv,
	}

	function getChromeStorageItems(keys) {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(keys, (result) => {
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError)
				}
				resolve(result)
			})
		})
	}

	const retrieveAndSetState = async () => {
		try {
			const result = await getChromeStorageItems(Object.keys(stateSetters))

			for (const key in result) {
				if (result.hasOwnProperty(key)) {
					const setStateFunc = stateSetters[key]

					if (setStateFunc) {
						setStateFunc(result[key])
					}
				}
			}
		} catch (error) {}
	}

	useEffect(() => {
		const init = async () => {
			await retrieveAndSetState()
		}

		init()
	}, [])

	const handleInputChange = (e) => {
		const { type, value, name } = e.target

		const updateStateAndChromeStorage = (stateUpdater, newValue) => {
			stateUpdater(newValue)

			chrome.storage.local.set({ [name]: newValue }, () => {
				if (chrome.runtime.lastError) {
				}
			})
		}

		if (type === 'radio') {
			const stateSetter = stateSetters[name]
			if (stateSetter) {
				updateStateAndChromeStorage(stateSetter, value)
			} else {
			}
		}
	}

	useEffect(() => {
		inputAreaTextSvRef.current = inputAreaTextSv
	}, [inputAreaTextSv])

	const filterValidUrls = (urlList) => {
		if (!Array.isArray(urlList)) {
			return []
		}

		const urlOptions = {
			require_protocol: false,
			require_valid_protocol: true,
			allow_underscores: false,
			allow_trailing_dot: false,
			disallow_auth: true,
		}

		const tldRegex = /\.[a-z]{2,}$/i

		return urlList.filter((url) => {
			const trimmedUrl = url.trim()
			return (
				validator.isURL(trimmedUrl, urlOptions) && tldRegex.test(trimmedUrl)
			)
		})
	}

	const removeProtocolAndWWW = (url) =>
		url.replace(/(https?:\/\/)?(www\.)?/i, '')

	const handleSave = (inputAreaTextSv, setWebsiteListSv, filterValidUrls) => {
		const splitByComma = inputAreaTextSv.split(',')
		const splitByLine = splitByComma.map((item) => item.split('\n')).flat()
		const trimmedItems = splitByLine.map((item) => item.trim())
		const validUrls = filterValidUrls(trimmedItems)
		const cleanedUrls = validUrls.map(removeProtocolAndWWW)
		const uniqueValidUrls = [...new Set(cleanedUrls)]
		console.log('uniqueURls: ', uniqueValidUrls)

		chrome.storage.local.set({ websiteList: uniqueValidUrls }, () => {
			if (chrome.runtime.lastError) {
				/*	console.error(
					new Error('Error updating Chrome storage in handleSave.')
				)*/
			}
		})

		setWebsiteListSv(uniqueValidUrls)
	}

	const handleChangeAndToggle = (e) => {
		if (allSelectSv === 'select') {
			setAllSelectSv('all')
			chrome.storage.local.set({ allSelect: 'all' })
		}

		if (showInputForm) {
			handleSave(inputAreaTextSv, setWebsiteListSv, filterValidUrls)
			setShowInputForm(false)
		}
	}

	const handleToggleInputForm = (e) => {
		e.preventDefault()
		if (showInputForm) {
			handleSave(inputAreaTextSv, setWebsiteListSv, filterValidUrls)
			setShowInputForm(false)
		} else {
			setShowInputForm(true)
		}
	}

	const handleSelectInput = () => {
		if (allSelectSv === 'all') {
			if (showInputForm) {
				handleSave(inputAreaTextSv, setWebsiteListSv, filterValidUrls)
				setAllSelectSv('select')
				chrome.storage.local.set({ allSelect: 'select' })
			} else {
				setAllSelectSv('select')
				chrome.storage.local.set({ allSelect: 'select' })
			}
		} else if (allSelectSv === 'select' && showInputForm) {
			handleSave(inputAreaTextSv, setWebsiteListSv, filterValidUrls)
			chrome.storage.local.set({ allSelect: 'select' })
		}
	}

	const handleAllInput = () => {
		if (allSelectSv === 'select') {
			handleSave(inputAreaTextSv, setWebsiteListSv, filterValidUrls)
			setAllSelectSv('all')
			chrome.storage.local.set({ allSelect: 'all' })
		}
	}

	const openTab = (url) => {
		window.open(url, '_blank')

		window.close()
	}

	let typeTimer

	const handleOnChange = (e) => {
		const newText = e.target.value
		setInputAreaTextSv(newText)

		const splitByComma = newText.split(',')
		const splitByLine = splitByComma.map((item) => item.split('\n')).flat()
		const trimmedItems = splitByLine.map((item) => item.trim())
		const validUrls = filterValidUrls(trimmedItems)
		const cleanedUrls = validUrls.map(removeProtocolAndWWW)
		const uniqueValidUrls = [...new Set(cleanedUrls)]

		chrome.storage.local.set({ websiteList: uniqueValidUrls }, () => {
			if (chrome.runtime.lastError) {
				/*console.error(
					new Error('Error updating Chrome storage in handleOnChange.')
				)*/
			}
		})

		clearTimeout(typeTimer)
		typeTimer = setTimeout(() => {
			chrome.storage.local.set({ inputAreaText: newText }, () => {
				if (chrome.runtime.lastError) {
					/* console.error(
						new Error('Error updating Chrome storage for inputAreaText.')
					)*/
				}
			})
		}, 300)
	}

	const rows = 5

	useEffect(() => {
		if (Array.isArray(websiteListSv)) {
			const text = websiteListSv.join('\n')
			setInputAreaTextSv(text + '\n')
		}
	}, [websiteListSv])

	return (
		<div className="options-root">
			<ParentCommonContainer>
				<CommonContainer desktopMobileSv={desktopMobileSv}>
					<h1>The Small Belligerent Foreign Country</h1>
					<OptionsDividerExtraBottom />
					<RadioOnOffContainer>
						<ChoiceComponentContainer>
							<StyledLabel htmlFor="on">on</StyledLabel>
							<StyledInput
								type="radio"
								id="on"
								name="onOff"
								value="on"
								checked={onOffSv === 'on'}
								onChange={handleInputChange}
							/>
						</ChoiceComponentContainer>
						<ChoiceComponentContainer>
							<StyledLabel htmlFor="off">off</StyledLabel>
							<StyledInput
								type="radio"
								id="off"
								name="onOff"
								value="off"
								checked={onOffSv === 'off'}
								onChange={handleInputChange}
							/>
						</ChoiceComponentContainer>
					</RadioOnOffContainer>

					<OptionsDividerExtraBottom />
					<ComponentContainer>
						<RadioContainer>
							<ChoiceComponentContainer>
								<StyledLabel htmlFor="allWebsites">all URLs</StyledLabel>
								<StyledInput
									type="radio"
									id="allWebsites"
									name="allSelect"
									value="all"
									checked={allSelectSv === 'all'}
									onChange={handleChangeAndToggle}
								/>
							</ChoiceComponentContainer>
							<ChoiceComponentContainer>
								<StyledLabel htmlFor="selectWebsites">
									<a href="#" onClick={(e) => handleToggleInputForm(e)}>
										select URLs
									</a>
								</StyledLabel>
								<StyledInput
									type="radio"
									id="selectWebsites"
									name="allSelect"
									value="select"
									checked={allSelectSv === 'select'}
									onChange={handleSelectInput}
								/>
							</ChoiceComponentContainer>
						</RadioContainer>

						{showInputForm && (
							<InputFormContainer desktopMobileSv={desktopMobileSv}>
								<InputTextareaContainer>
									<InputFormTextarea
										desktopMobileSv={desktopMobileSv}
										rows={rows}
										value={inputAreaTextSv}
										onChange={handleOnChange}
									/>
								</InputTextareaContainer>
								<ComponentInputFormContainer>
									<RadioContainerInputForm>
										<InputFormChoiceComponentContainer
											style={{ opacity: allSelectSv === 'all' ? 0.3 : 1 }}
										>
											<StyledLabel htmlFor="include">run only on</StyledLabel>
											<StyledInput
												type="radio"
												id="include"
												name="includeExclude"
												value="include"
												checked={includeExcludeSv === 'include'}
												onChange={handleInputChange}
												disabled={allSelectSv === 'all'}
											/>
										</InputFormChoiceComponentContainer>
										<InputFormChoiceComponentContainer
											style={{ opacity: allSelectSv === 'all' ? 0.3 : 1 }}
										>
											<StyledLabel htmlFor="exclude">don't run on</StyledLabel>
											<StyledInput
												type="radio"
												id="exclude"
												name="includeExclude"
												value="exclude"
												checked={includeExcludeSv === 'exclude'}
												onChange={handleInputChange}
												disabled={allSelectSv === 'all'}
											/>
										</InputFormChoiceComponentContainer>
									</RadioContainerInputForm>
								</ComponentInputFormContainer>
							</InputFormContainer>
						)}
					</ComponentContainer>
					<ImageContainer>
						<img src={world} alt="world" />
					</ImageContainer>
				</CommonContainer>
			</ParentCommonContainer>
		</div>
	)
}

export default Options
