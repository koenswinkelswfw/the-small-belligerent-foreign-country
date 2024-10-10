import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  .options-root *, .options-root *::before, .options-root *::after {
    box-sizing: border-box;
  }

  .options-root html {
    font-size: 16px;
  }

  .options-root body {
    font-size: 1.2em;
    box-sizing: border-box;
    font-family: 'Roboto', Arial, sans-serif; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    overflow-y: visible;
    margin: auto;
    padding: 0.2em;
    width: auto;
    min-width: unset;
  }

  .options-root table {
    border-collapse: collapse;
    border-spacing: 0;
  }


`

export default GlobalStyle
