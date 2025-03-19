# YouTube Subtitle Helper

This is a Chrome extension for adding custom subtitle functionality to YouTube videos.

## Features

- Support for displaying custom subtitles on YouTube videos
- Support for multiple languages (English, Chinese, Japanese)
- Adjustable subtitle position
- Simple and easy-to-use interface

## Installation Instructions

1. Clone or download this repository to your local machine
2. Open Chrome browser and go to the extensions management page (chrome://extensions/)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked extension"
5. Select the root directory of this project

## How to Use

1. After installing the extension, an extension icon will appear on YouTube video pages
2. Click the icon to open the control panel
3. Use the buttons in the control panel to enable/disable subtitles
4. Use the dropdown menu to select the subtitle language

## Project Structure

```
youtube-translation/
├── manifest.json    # Chrome extension configuration file
├── popup.html       # Extension popup interface
├── popup.js         # Popup interaction logic
├── content.js       # Main functionality code injected into YouTube pages
├── styles.css       # Style file
├── icons/           # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md        # Project documentation
```

## Development Plans

- [ ] Add subtitle upload functionality
- [ ] Support for more languages
- [ ] Add subtitle style customization
- [ ] Support for subtitle timeline adjustment

## Contribution Guidelines

Pull Requests and Issues are welcome to help improve this project.

## License

MIT License