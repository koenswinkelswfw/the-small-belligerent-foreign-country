import styled from 'styled-components'

export const ParentCommonContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: default;
`

export const CommonContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: ${(props) => (props.desktopMobileSv === 'desktop' ? '50%' : '95%')};
	font-size: 1.15em
	padding: 0;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: default;
`

export const OptionsDividerExtraBottom = styled.div`
	height: 0.01875em;
	background-color: #bbbbbb;
	margin: 0.3em auto;
	width: 80%;
`

export const RadioOnOffContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.125em;
	gap: 1em;
	width: auto;
	cursor: default;
	margin: 0;
`

export const ChoiceComponentContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	gap: 0.44em;
	height: 1.9em;
	padding: 0.13em;
	cursor: pointer;
`

export const ComponentContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0;
	cursor: default;
	width: 100%;
	padding: 0 0.25em;
`

export const RadioContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.12em;
	gap: 1em;
	width: auto;
	cursor: default;
	margin: 0;
`

export const InputFormContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	overflow-y: hidden;
	overflow-x: hidden;
	width: ${(props) => (props.desktopMobileSv === 'desktop' ? '70%' : '95%')};
	padding: 0.13em;
	gap: 0.13em;
`

export const InputTextareaContainer = styled.div`
	display: flex;
	justify-content: center;
	padding: 0.13em 0.31em;
	width: 95%;
	align-items: center;
`

export const InputFormTextarea = styled.textarea`
	width: ${(props) => (props.desktopMobileSv === 'desktop' ? '70%' : '95%')};
	font-family: 'Verdana', 'Arial', sans-serif;
	font-size: 1em;
	resize: none;
	overflow-y: scroll;
	overflow-x: auto;
	max-height: 12em;
	padding: 0.31em;
	border: 0.063em solid #ababab;
`

export const ComponentInputFormContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	cursor: pointer;
	gap: 0;
	width: 100%;
	padding: 0;
`

export const RadioContainerInputForm = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1.13em;
	width: 100%;
	padding: 0.13em 0.31em;
`

export const InputFormChoiceComponentContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 0.44em;
	padding: 0.19em;
	height: 1.38em;
	cursor: pointer;
	user-select: none;
	label {
		white-space: nowrap;
	}
`

export const ImageContainer = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0.63em 0;
`

export const StyledLabel = styled.label`
	font-family: Arial, Helvetica, Roboto, sans-serif;
	font-size: 1.35em;
	font-weight: 500;
	color: #333;
	padding: 0.5em;
	cursor: pointer;
`

export const StyledInput = styled.input`
	padding: 0.5em;
	margin: 0.25em;
	border: 0.07em solid #ccc;
	border-radius: 0.3em;
	height: 1.2em;
	width: 1.2em;
`

export const CheckboxComponentContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0;
	gap: 1.5em;
	height: 1.9em;
	padding: 0.13em;
	cursor: pointer;
`
