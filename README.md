The Small Belligerent Foreign Country Extension
Overview

"The Small Belligerent Foreign Country", or SBFC, is a chrome-based browser extension that probabilistically replaces Israel-related keywords on a webpage with alternative terms that remind the reader that Israel is not actually part of the United States. 

The extension is intended as political satire, and should not be taken too seriously or be misinterpreted. 

Installation Instructions
If you are a non-technical user and just want to install the extension quickly, you can download the dist folder directly and upload it to Chrome. Follow these steps:

1. Download the dist Folder
Go to the dist folder on GitHub.

Click on the dist folder.

Click the Download button (or right-click on the folder and select "Download ZIP").



2. Extract the Files (If Downloaded as ZIP)
If the files are downloaded as a ZIP, extract them to a folder on your computer.
3. Open Chrome Extension Manager
Open Chrome and go to chrome://extensions/ (or click the three dots in the top-right corner of Chrome, then go to More Tools > Extensions).
Enable Developer Mode by toggling the switch in the top-right corner.
4. Load the Extension
Click the Load unpacked button in the top-left corner of the Extensions page.
Navigate to the folder where you extracted or downloaded the dist folder.
Select the dist/ folder.
5. Activate the Extension
The extension will now appear in your list of installed Chrome extensions.
Make sure it’s enabled and ready to use!

Viewing the Source Code
If you'd like to inspect the source code to verify the behavior of the extension, you can do so by checking out the src/ folder of the repository. This folder contains the uncompiled source code, including:

background.js: The background script using service workers.
content.js: The content script that runs on the web pages.
options.jsx: The React-based options page.

Building the Extension Yourself (Optional)
If you'd like to verify that the dist/ folder matches what is generated from the source code, or you just want to build the extension yourself, you can follow the steps below.

Prerequisites
To build the extension yourself, you will need to have the following installed on your machine:

Node.js: You can download it from nodejs.org.
npm: This comes bundled with Node.js.
Steps to Build the Extension
Download the Source Code:

You can download the source code by clicking the green Code button on the repository's main page, and selecting Download ZIP or clone it using Git:
bash
Copy code
git clone https://github.com/koenswinkelswfw/the-small-belligerent-foreign-country.git
Install the Necessary Build Tools: The project uses Webpack to bundle the JavaScript files and Babel to transpile modern JavaScript/JSX into a format that can run in the browser.

After downloading or cloning the repository, navigate to the project directory in your terminal and run the following command to install the necessary dependencies (Webpack, Babel, and others):

bash
Copy code
npm install
This will install all dependencies defined in the package.json, including:

Webpack: For bundling the files.
Babel: For transpiling React (JSX) and modern JavaScript.
Other dependencies used during the build process.
Build the Extension: After the dependencies are installed, you can build the extension by running:

bash
Copy code
npm run build
This command will use Webpack to bundle the code and output the result into the dist/ folder.

Verify the Build: You can now compare the dist/ folder you generated with the one included in the repository. You can use file comparison tools like diff (Linux/macOS) or WinMerge (Windows) to ensure there are no differences between the two folders.

Optional: Load the Built Extension in Chrome
If you'd like to load the extension you just built, follow these steps:

Navigate to chrome://extensions/ in Chrome.
Enable Developer Mode.
Click Load unpacked and select your newly built dist/ folder.

Disclaimer
This extension is intended for entertainment purposes only. It modifies text on web pages in a humorous way and is not meant to be taken seriously. Please use it with that understanding in mind.