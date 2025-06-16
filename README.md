# Prompt Enhancer Extension

A browser extension that enhances prompts for better interaction with AI models and language processing systems.

## Features

- Popup interface for quick prompt enhancement
- Customizable options page for user preferences
- Background processing for seamless operation

## Project Structure

```
├── manifest.json         # Extension manifest file
├── background/          
│   └── background.js    # Background script
├── icons/
│   └── logo.png        # Extension icon
├── options/            # Options page
│   ├── options.css
│   ├── options.html
│   └── options.js
└── popup/              # Popup interface
    ├── popup.css
    ├── popup.html
    └── popup.js
```

## Installation

1. Clone this repository
2. Open your browser's extension management page
   - Chrome: `chrome://extensions`
   - Firefox: `about:addons`
   - Edge: `edge://extensions`
3. Enable Developer Mode
4. Click "Load unpacked" and select the extension directory

## Development

The extension consists of three main components:

1. **Popup Interface**: The main user interface that appears when clicking the extension icon
2. **Options Page**: Allows users to customize extension settings
3. **Background Script**: Handles background processing and extension logic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
