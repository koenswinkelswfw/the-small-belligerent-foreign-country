# Small Belligerent Foreign Country (extension for chrome-based browsers)

## Overview

Listening to US politicians and commentators it often seems as if one of the primary purposes of the American government is to look out for the interests of Israel. The "Small Belligerent Foreign Country" chrome extension (SBFC) serves to occasionally remind the reader that Israel is in fact a separate country that is not part of the United States and whose interests do not necessarily coincide with those of the United States. 

The extension does this by probabilistically replacing Israel-related keywords on webpages with alternative formulations. 

Note that the extension is intended as **political satire**, and should not be taken too seriously or misinterpreted.

---

## Installation Instructions

If you are a non-technical user and just want to install the extension quickly, you can download the **sbfc.zip** file which is the zipped 'dist' foler, and upload it to Chrome. Follow these steps:

### 1. Download the Extension
- In the repository, click on the **sbfc.zip** file.
- Click on the three horizontal dots in the top right of the screen.
- Click on **download**.

### 2. Extract the Files
- Extract or unpack the zip file, which will create a `dist` folder.

### 3. Open Chrome Extension Manager
- Open Chrome and go to `chrome://extensions/` (or click the three dots in the top-right corner of Chrome, then go to **More Tools > Extensions**).
- Enable **Developer Mode** by toggling the switch in the top-right corner.

### 4. Load the Extension
- Click the **Load unpacked** button in the top-left corner of the Extensions page.
- Navigate to the folder where you extracted the SBFC.zip file and hence created the `dist` folder.
- Select the `dist` folder.

### 5. Activate the Extension
- The extension will now appear in your list of installed Chrome extensions.
- Make sure it’s **enabled** and ready to use!

### 6. Options
- After the extension has been installed the Options page opens where you can turn the extension on or off, and where you can specify the websites that you want the extension to run on or not run on. By default 'all' is selected which means the extension runs on all websites.
- When the extension is enabled, you will find that on websites various Israel-related keywords will be occassionally replaced by alternative formulations that serve as useful reminders to the reader, most notably of the fact that Israel is not actually part of the United States. 
- The frequency by which keywords are replaced is probabilistically determined but will tend towards 1 out of every 7 instances.
- The specific phrases that replace the keywords are in turn probabilistically chosen from a range of options.
---

## Viewing the Source Code

If you'd like to inspect the source code to verify the behavior of the extension, you can do so by checking out the `src/` folder of the repository. This folder contains the uncompiled source code, including:

- **background.js**: The background script using service workers.
- **content.js**: The content script that runs on the web pages.
- **options.jsx**: The React-based options page.

---

## Building the Extension Yourself (Optional)

If you'd like to verify that the `dist/` folder matches what is generated from the source code, or you just want to build the extension yourself, you can follow the steps below.

### Prerequisites

To build the extension yourself, you will need to have the following installed on your machine:

- **Node.js**: You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: This comes bundled with Node.js.

### Steps to Build the Extension

1. **Download the Source Code**:
   - You can download the source code by clicking the green **Code** button on the repository's main page, and selecting **Download ZIP**, or clone it using Git:

     ```bash
     git clone https://github.com/koenswinkelswfw/the-small-belligerent-foreign-country.git
     ```

2. **Install the Necessary Build Tools**:
   - The project uses Webpack to bundle the JavaScript files and Babel to transpile modern JavaScript/JSX into a format that can run in the browser.
   
   - After downloading or cloning the repository, navigate to the project directory in your terminal and run the following command to install the necessary dependencies (Webpack, Babel, and others):

     ```bash
     npm install
     ```

   This will install all dependencies defined in the `package.json`, including:
   - **Webpack**: For bundling the files.
   - **Babel**: For transpiling React (JSX) and modern JavaScript.
   - Other dependencies used during the build process.

3. **Build the Extension**:
   - After the dependencies are installed, you can build the extension by running:

     ```bash
     npm run build
     ```

   This command will use Webpack to bundle the code and output the result into the `dist/` folder.

4. **Verify the Build**:
   - You can now compare the `dist/` folder you generated with the one included in the repository. You can use file comparison tools like `diff` (Linux/macOS) or [WinMerge](https://winmerge.org/) (Windows) to ensure there are no differences between the two folders.

5. **Load the Built Extension in Chrome**
If you'd like to load the extension you just built, follow these steps:

1. Navigate to `chrome://extensions/` in Chrome.
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select your newly built `dist/` folder.
