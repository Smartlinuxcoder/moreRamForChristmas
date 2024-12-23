document.addEventListener('alpine:init', () => {
    console.log('Oh hi hello hi curious person');
    Alpine.data('ramConfigurator', () => ({
        isDark: true,
        currentOS: '',
        currentRAM: 0,
        selectedDistro: '',
        compressionLevel: 1,
        desiredRAM: null,
        showResults: false,

        ramSizeOptions: [
            { value: 2, label: "2GB" },
            { value: 4, label: "4GB" },
            { value: 8, label: "8GB" },
            { value: 12, label: "12GB" },
            { value: 16, label: "16GB" },
            { value: 32, label: "32GB" },
            { value: 64, label: "64GB" }
        ],

        zstdLevels: [
            { level: 1, ratio: 2.1 },
            { level: 2, ratio: 2.8 },
            { level: 3, ratio: 3.2 },
            { level: 4, ratio: 3.7 }
        ],

        snowflakes: Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: 3 + Math.random() * 7,
            delay: Math.random() * 5
        })),


        toggleTheme() {
            this.isDark = !this.isDark;
            document.body.className = this.isDark ? 'dark' : 'light';
        },

        getMaxPossibleRAM() {
            const ratio = this.zstdLevels.find(l => l.level === this.compressionLevel)?.ratio || 2.1;
            return Math.floor(this.currentRAM * ratio);
        },

        getCurrentCompressionRatio() {
            return this.zstdLevels.find(l => l.level === this.compressionLevel)?.ratio || 2.1;
        },

        availableRAMOptions() {
            const maxRAM = this.getMaxPossibleRAM();
            return [1, 2, 4, 8, 16, 32, 48, 64, 128, this.getMaxPossibleRAM()].filter(ram => ram <= maxRAM);
        },

        selectDesiredRAM(ram) {
            this.desiredRAM = ram;
            this.showResults = true;
        },

        getZramCommands() {
            const commands = {
                "Ubuntu/Debian": [
                    "# Disable the zramswap service",
                    "sudo systemctl stop zramswap",
                    "# Load the zram kernel module",
                    "sudo modprobe zram",
                    `echo ${this.desiredRAM}G | sudo tee /sys/block/zram0/disksize`,
                    "# Initialize ZRAM swap space",
                    "sudo mkswap /dev/zram0",
                    "# Enable ZRAM swap",
                    "sudo swapon /dev/zram0",
                ],
                "Fedora/RHEL": [
                    "sudo dnf install zram",
                    "# Load the zram kernel module",
                    "sudo modprobe zram",
                    `# Setting up zram size for ${this.desiredRAM}GB`,
                    `echo $((${this.desiredRAM} * 1024 * 1024 * 1024)) | sudo tee /sys/block/zram0/disksize`,
                    "sudo mkswap /dev/zram0",
                    "sudo swapon /dev/zram0"
                ],
                "Arch Linux": [
                    "sudo modprobe zram",
                    `# Setting up zram size for ${this.desiredRAM}GB`,
                    `sudo zramctl /dev/zram0 --algorithm zstd --size ${this.desiredRAM}GiB`,
                    `sudo mkswap -U clear /dev/zram0`,
                    "sudo swapon --discard --priority 100 /dev/zram0",
                ],
                "NixOS": [
                    "# Enable the zram module",
                    "sudo modprobe zram",
                    `# Setting up zram size for ${this.desiredRAM}GB`,
                    `echo $((${this.desiredRAM} * 1024 * 1024 * 1024)) | sudo tee /sys/block/zram0/disksize`,
                    "sudo mkswap /dev/zram0",
                    "sudo swapon /dev/zram0"
                ]
            };
            return commands[this.selectedDistro]?.join('\n') || '';
        },

        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }));
});