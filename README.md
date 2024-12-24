# 🎄 Ho Ho Ho - Santa's RAM Giveaway

A web-based zRAM configuration tool that lets you "download more RAM" for Christmas!

## 🎁 Features

- Linux distribution detection
- Customizable zRAM configuration:
  - Base RAM detection
  - Compression level selection with zstd
  - Additional RAM calculation based on compression ratios
- Festive snowfall animation
- Dark/Light theme toggle
- Copy-to-clipboard terminal commands
- Responsive design with Tailwind CSS

## 🎅 Technologies Used

- HTML5
- Alpine.js for a little reactivity
- Tailwind CSS for styling
- Vanilla JavaScript

## 💻 Usage

1. Select your operating system
2. If using Linux, choose your distribution
3. Input your current RAM amount
4. Select desired zstd compression level
5. Choose how much additional RAM you want
6. Get your customized terminal commands!

## How does this work?

- This tool uses zRAM to create a "fake" RAM stick that basically work by "compressing" the contents to fit in your already existing RAM.
- This is surprisingly fast and effective as it doesn't take that many cycles to fetch and write data!

## ⚙️ Installation

Simply clone the repository and open `index.html` in a web browser:

```bash
git clone git@github.com:Smartlinuxcoder/moreRamForChristmas.git
cd moreRamForChristmas
```

## ⚠️ Disclaimer

This tool generates real zRAM configuration commands. While zRAM is a legitimate way to expand your system's memory capacity through compression, please:
- Use caution when running system commands
- Monitor your system's performance after making changes
- Remember that all changes are temporary and reset after a reboot

## 👨‍💻 Development

The project structure includes:
- `index.html` - Main application
- `app.js` - Alpine.js logic
- `quandaledingle.css` - Custom catppuccin styling

## 🤝 Contributing

Send me PRs if you find features or stuff to add!

## 📝 Credits

Created by [Smartlinuxcoder](https://github.com/Smartlinuxcoder)

## 🎮 Fun Facts

- The snowfall animation uses pure CSS
- Contains easter egg messages for Windows and MacOS users

## 📜 License

GNU GPL V3