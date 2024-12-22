const { div, button, h1, p, span, select, option, input, label } = van.tags;

const ThemeToggle = () => {
    const isDark = van.state(true);
    van.derive(() => {
        document.body.className = isDark.val ? 'dark' : 'light';
    });
    return button({
        class: "fixed top-4 right-4 p-2 rounded-full bg-theme-surface0 hover:bg-theme-surface1 transition-colors",
        onclick: () => isDark.val = !isDark.val
    }, span({
        class: "text-2xl"
    }, () => isDark.val ? "🌙" : "☀️"));
};
// RAM size options in GB
const ramSizeOptions = [
    { value: 2, label: "2GB" },
    { value: 4, label: "4GB" },
    { value: 8, label: "8GB" },
    { value: 16, label: "16GB" },
    { value: 32, label: "32GB" },
    { value: 64, label: "64GB" }
];

// zstd compression levels
const zstdLevels = [
    { level: 1, ratio: 2.1 },
    { level: 2, ratio: 2.8 },
    { level: 3, ratio: 3.2 },
    { level: 4, ratio: 3.7 }
];

const getMaxPossibleRAM = (ram, compressionLevel) => {
    const ratio = zstdLevels.find(l => l.level === compressionLevel)?.ratio || 2.1;
    return Math.floor(ram * ratio);
};

const SantaRamConfigurator = () => {
    const currentOS = van.state("");
    const currentRAM = van.state(0);
    const selectedDistro = van.state("");
    const compressionLevel = van.state(1);
    const desiredRAM = van.state(null);
    const showResults = van.state(false);

    const getZramCommands = (distro, desiredRAMGB, level) => {
        const commands = {
            "Ubuntu/Debian": [
                "sudo apt update",
                "sudo apt install zram-tools",
                `# Setting up zstd compression level ${level}`,
                `echo zstd | sudo tee /sys/block/zram0/comp_algorithm`,
                `echo ${level} | sudo tee /sys/block/zram0/comp_algorithm_level`,
                `# Setting up zram size for ${desiredRAMGB}GB`,
                `echo $((${desiredRAMGB} * 1024 * 1024 * 1024)) | sudo tee /sys/block/zram0/disksize`,
                "sudo mkswap /dev/zram0",
                "sudo swapon /dev/zram0",
            ],
            "Fedora/RHEL": [
                "sudo dnf install zram",
                `# Setting up zstd compression level ${level}`,
                `echo zstd | sudo tee /sys/block/zram0/comp_algorithm`,
                `echo ${level} | sudo tee /sys/block/zram0/comp_algorithm_level`,
                `# Setting up zram size for ${desiredRAMGB}GB`,
                `echo $((${desiredRAMGB} * 1024 * 1024 * 1024)) | sudo tee /sys/block/zram0/disksize`,
                "sudo mkswap /dev/zram0",
                "sudo swapon /dev/zram0",
            ],
            "Arch Linux": [
                "sudo pacman -S zram-generator",
                `# Setting up zstd compression level ${level}`,
                `echo zstd | sudo tee /sys/block/zram0/comp_algorithm`,
                `echo ${level} | sudo tee /sys/block/zram0/comp_algorithm_level`,
                `# Setting up zram size for ${desiredRAMGB}GB`,
                `echo $((${desiredRAMGB} * 1024 * 1024 * 1024)) | sudo tee /sys/block/zram0/disksize`,
                "sudo mkswap /dev/zram0",
                "sudo swapon /dev/zram0",
            ]
        };
        return commands[distro] || [];
    };

    return div({
        class: "bg-theme-surface0 rounded-lg p-6 shadow-xl max-w-2xl mx-auto mt-8"
    }, [
        h1({ class: "text-4xl font-bold mb-6 text-center" }, `🎅 Download some ram for Christmas!`),

        // OS Selection
        div({ class: "mb-6" }, [
            p({ class: "text-xl mb-2" }, "What operating system are you using?"),
            div({ class: "space-y-2" }, 
                ["Windows", "Linux", "MacOS"].map(os =>
                    label({ class: "flex items-center space-x-2" }, [
                        input({
                            type: "radio",
                            name: "os",
                            value: os,
                            onchange: (e) => {
                                currentOS.val = e.target.value;
                                showResults.val = false;
                            }
                        }),
                        span({}, os)
                    ])
                )
            )
        ]),
        () => {
            if (currentOS.val === "MacOS") {
                return div({
                    class: "bg-theme-red/20 p-4 rounded-lg mb-6"
                }, [
                    p({ class: "font-bold" }, "🎅 Santa's Advice:"),
                    p({}, "Ho ho ho! MacOS is not yet supported for this :)")
                ]);
            } else if (currentOS.val === "Windows") {
                return div({
                    class: "bg-theme-red/20 p-4 rounded-lg mb-6"
                }, [
                    p({ class: "font-bold" }, "🎅 Santa's Advice:"),
                    p({}, "Ho ho ho! Stinky Windows users can't receive the gift of zRAM! Switch to linux :3")
                ]);
            } else if (currentOS.val === "Linux") {
                return div({
                    class: "space-y-6"
                }, [
                    // Linux Distribution
                    div({ class: "mb-6" }, [
                        p({ class: "text-xl mb-2" }, "Which Linux distribution are you using?"),
                        select({
                            class: "w-full p-2 rounded-lg bg-theme-surface1",
                            onchange: (e) => {
                                selectedDistro.val = e.target.value;
                                showResults.val = false;
                            }
                        }, [
                            option({ value: "", disabled: true, selected: true }, "Select your distribution"),
                            ...Object.keys({
                                "Ubuntu/Debian": null,
                                "Fedora/RHEL": null,
                                "Arch Linux": null
                            }).map(distro => option({ value: distro }, distro))
                        ])
                    ]),
                    // Current RAM
                    div({ class: "mb-6" }, [
                        p({ class: "text-xl mb-2" }, "How much RAM do you currently have?"),
                        div({ class: "grid grid-cols-3 gap-2" },
                            ramSizeOptions.map(option =>
                                label({ class: "flex items-center space-x-2 p-2 border rounded hover:bg-theme-surface1" }, [
                                    input({
                                        type: "radio",
                                        name: "currentRam",
                                        value: option.value,
                                        onchange: (e) => currentRAM.val = parseInt(e.target.value)
                                    }),
                                    span({}, option.label)
                                ])
                            )
                        )
                    ]),

                    // Compression Level
                    div({ class: "mb-6" }, [
                        p({ class: "text-xl mb-2" }, "Select zstd compression level:"),
                        p({ class: "text-l mb-2" }, "The higher the level, the more ram you get!"),
                        div({ class: "grid grid-cols-4 gap-2" },
                            zstdLevels.map(({ level, ratio }) =>
                                button({
                                    class: () => `p-2 border rounded hover:bg-theme-surface1 ${compressionLevel.val === level ? 'bg-theme-surface2' : ''}`,
                                    onclick: () => {
                                        compressionLevel.val = level;
                                        showResults.val = false;
                                    }
                                }, [
                                    div({}, `Level ${level}`),
                                    div({ class: "text-sm" }, `${ratio}x ratio`)
                                ])
                            )
                        )
                    ]),

                    // RAM Selection
                    div({ class: "mb-6" }, [
                        p({ class: "text-xl mb-2" },
                            () => `Select additional RAM (Max ${getMaxPossibleRAM(currentRAM.val, compressionLevel.val)}GB with current compression):`
                        ),
                        div({ class: "grid grid-cols-4 gap-2" },
                            [1, 2, 4, 8, 16, 32, 48, 64, 128].filter(ram => ram <= getMaxPossibleRAM(currentRAM.val, compressionLevel.val)).map(ram =>
                                button({
                                    class: () => `p-2 border rounded hover:bg-theme-surface1 ${desiredRAM.val === ram ? 'bg-theme-surface2' : ''}`,
                                    onclick: () => {
                                        desiredRAM.val = ram;
                                        showResults.val = true;
                                    }
                                }, `${ram}GB`)
                            )
                        )
                    ]),

                    // Results
                    () => showResults.val && selectedDistro.val && div({
                        class: "mt-6 p-4 bg-theme-surface1 rounded-lg"
                    }, [
                        h1({ class: "text-2xl font-bold mb-4" }, "🎁 Before I ask Santa, is this all correct?"),
                        p({ class: "mb-2" }, `Base RAM: ${currentRAM.val}GB`),
                        p({ class: "mb-2" }, `Additional RAM: ${desiredRAM.val}GB`),
                        p({ class: "mb-2" }, `Compression: zstd level ${compressionLevel.val} (ratio: ${zstdLevels.find(l => l.level === compressionLevel.val).ratio}x)`),
                        p({ class: "mb-4" }, "Run these commands in your terminal:"),
                        div({ class: "bg-theme-surface2 p-4 rounded-lg font-mono whitespace-pre" },
                            getZramCommands(selectedDistro.val, desiredRAM.val, compressionLevel.val).join('\n')
                        ),
                        div({ class: "mt-4 bg-theme-yellow/20 p-4 rounded-lg" }, [
                            p({ class: "font-bold" }, "🎅 Santa's Tips:"),
                            p({}, "• Your free ram will show up immediately"),
                            p({}, "• If your system feels funky, don't worry, changes reset after a reboot"),
                            p({}, "• Monitor your system's performance with 'free -h' command"),
                            p({}, "• Have fun with your new ram!")
                        ])
                    ])
                ]);
            }
            return null;
        }
    ]);

};


const SnowflakeAnimation = () => {
    const snowflakes = Array(50).fill().map(() => ({
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 7
    }));
    return div({
        class: "fixed inset-0 pointer-events-none"
    }, snowflakes.map(flake =>
        div({
            class: "absolute text-theme-blue animate-fall",
            style: `
          top: -10%;
          left: ${flake.left}%;
          animation-duration: ${flake.animationDuration}s;
          animation-delay: ${Math.random() * 5}s;
        `
        }, "❄️")
    ));
};

const App = () => div({
    class: "min-h-screen bg-theme-base text-theme-text transition-colors duration-300 p-4"
}, [
    ThemeToggle(),
    SnowflakeAnimation(),
    SantaRamConfigurator()
]);

van.add(document.body, App());

