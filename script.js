/* script.js */

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        codeEditor: document.getElementById('code-editor'),
        previewFrame: document.getElementById('preview-frame'),
        consoleOutput: document.getElementById('console-output'),
        runBtn: document.getElementById('run-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        resetBtn: document.getElementById('reset-btn'),
        aiChat: document.getElementById('ai-chat'),
        aiInput: document.getElementById('ai-input'),
        aiSend: document.getElementById('ai-send'),
        notificationArea: document.getElementById('notification-area'),
    };

    const initialCode = `<!DOCTYPE html>
<html>
<head>
    <title>My Awesome Page</title>
    <style>
        body {
            background: linear-gradient(to right, #8a2be2, #00f0ff);
            color: white;
            font-family: Arial, sans-serif;
            padding: 1rem;
        }
        h1 {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body>
    <h1>Welcome to NovaCode!</h1>
    <p>Edit this code to see live changes in the preview panel →</p>
</body>
</html>`;

    // --- Main Initialization ---
    function init() {
        initTheme();
        initEditor();
        initAI();
        initConsole();
        initKeyboardShortcuts();
        
        // Initial run of the default code
        setTimeout(runCode, 300);
    }

    // --- Theme Switcher ---
    function initTheme() {
        elements.themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    // --- Code Editor Functionality ---
    function initEditor() {
        elements.codeEditor.value = initialCode;
        elements.runBtn.addEventListener('click', runCode);
        elements.copyBtn.addEventListener('click', copyCode);
        elements.downloadBtn.addEventListener('click', downloadCode);
        elements.resetBtn.addEventListener('click', resetCode);
            const clearBtn = document.getElementById('clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (confirm('Clear all code from the editor?')) {
                        elements.codeEditor.value = '';
                        runCode();
                        showNotification('All code cleared.', 'info');
                    }
                });
            }
    }

    function runCode() {
        const code = elements.codeEditor.value;
        try {
            elements.previewFrame.srcdoc = code;
            logToConsole('Code executed successfully!', 'success');
        } catch (error) {
            logToConsole(`Error: ${error.message}`, 'error');
        }
    }
    
    function copyCode() {
        navigator.clipboard.writeText(elements.codeEditor.value)
            .then(() => showNotification('Code copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy code.', 'error'));
    }

    function downloadCode() {
        const code = elements.codeEditor.value;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'novacode_index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Download started: novacode_index.html', 'info');
    }

    function resetCode() {
        if (confirm('Are you sure you want to reset the editor?')) {
            elements.codeEditor.value = initialCode;
            runCode();
            logToConsole('Editor has been reset.', 'info');
        }
    }
    
    // --- Console ---
    function initConsole() {
        logToConsole('Ready to execute your code...');
    }

    function logToConsole(message, type = 'default') {
        const colors = {
            default: 'text-gray-400',
            success: 'text-green-400',
            error: 'text-red-400',
            info: 'text-purple-400',
        };
        const entry = document.createElement('div');
        entry.className = colors[type];
        entry.textContent = `> ${message}`;
        elements.consoleOutput.appendChild(entry);
        elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
    }

    // --- AI Assistant ---
    function initAI() {
        addMessageToAI('Welcome to NovaCode! I can help you debug, explain, or enhance your code. Try asking me "How can I add a button?"', 'ai');
        elements.aiSend.addEventListener('click', handleAISubmit);
        elements.aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAISubmit();
            }
        });
    }

    function handleAISubmit() {
        const question = elements.aiInput.value.trim();
        if (question === '') return;

        addMessageToAI(question, 'user');
        elements.aiInput.value = '';

        // Simulate AI thinking and response
        setTimeout(() => {
            const responses = [
                "Based on your code, I recommend adding responsive meta tags to your head section for better mobile display.",
                "You could enhance the visual appeal by adding a subtle animation to your heading elements using CSS.",
                "Let me help you debug. A common issue is selector specificity in CSS. Make sure your styles are targeting the correct elements.",
                "Here's a tip: Try using CSS variables for your color scheme to make theme changes easier in the future.",
                "Consider adding some padding to your body element for better spacing on all devices."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToAI(randomResponse, 'ai');
        }, 1200);
    }
    
    function addMessageToAI(message, sender) {
        const messageWrapper = document.createElement('div');
        const iconClass = sender === 'ai' ? 'fa-robot' : 'fa-user';
        const gradientClass = sender === 'ai' 
            ? 'from-purple-500 to-pink-500' 
            : 'from-blue-500 to-teal-500';
        const alignment = sender === 'ai' ? '' : 'ml-8';
        
        messageWrapper.className = `bg-gray-500/10 p-3 rounded-lg text-sm ${alignment} ai-message`;
        messageWrapper.innerHTML = `
            <div class="flex items-center mb-1">
                <div class="w-6 h-6 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center mr-2 flex-shrink-0">
                    <i class="fas ${iconClass} text-xs"></i>
                </div>
                <span class="font-semibold">${sender === 'ai' ? 'NovaAI' : 'You'}</span>
            </div>
            <p class="pl-8 -mt-1">${message}</p>
        `;
        elements.aiChat.appendChild(messageWrapper);
        elements.aiChat.scrollTop = elements.aiChat.scrollHeight;
    }
    
    // --- Keyboard Shortcuts ---
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to Download/Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                downloadCode();
            }
            // Ctrl+Enter to Run
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                runCode();
            }
        });
    }

    // --- UI Notifications ---
    function showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500/80',
            error: 'bg-red-500/80',
            info: 'bg-blue-500/80',
        };
        const notification = document.createElement('div');
        notification.className = `text-white px-4 py-2 rounded-lg shadow-lg animate-pulse ${colors[type]}`;
        notification.textContent = message;
        elements.notificationArea.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // --- Start the application ---
    init();

        // --- Menu Bar Functionality ---
        function initMenuBar() {
            // Select all menu buttons and dropdowns
            const menuGroups = document.querySelectorAll('.menu-bar .group');
            let openDropdown = null;

            menuGroups.forEach(group => {
                const button = group.querySelector('button');
                const dropdown = group.querySelector('div.absolute');
                if (!button || !dropdown) return;

                // Open/close dropdown on button click
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close any other open dropdown
                    if (openDropdown && openDropdown !== dropdown) {
                        openDropdown.classList.remove('!opacity-100', '!pointer-events-auto');
                    }
                    // Toggle current dropdown
                    const isOpen = dropdown.classList.contains('!opacity-100');
                    dropdown.classList.toggle('!opacity-100', !isOpen);
                    dropdown.classList.toggle('!pointer-events-auto', !isOpen);
                    openDropdown = !isOpen ? dropdown : null;
                });
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                if (openDropdown) {
                    openDropdown.classList.remove('!opacity-100', '!pointer-events-auto');
                    openDropdown = null;
                }
            });

            // Close dropdowns on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && openDropdown) {
                    openDropdown.classList.remove('!opacity-100', '!pointer-events-auto');
                    openDropdown = null;
                }
            });
        }

        // Initialize menu bar after DOM is ready
        initMenuBar();

            // --- Menu Actions ---
            function initMenuActions() {
                // File menu
                document.querySelectorAll('.menu-bar a').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        const text = item.textContent.trim();
                        switch (text) {
                            case 'New':
                                if (confirm('Start a new file? Unsaved changes will be lost.')) {
                                    elements.codeEditor.value = initialCode;
                                    runCode();
                                    showNotification('New file created.', 'info');
                                }
                                break;
                            case 'Open':
                                showNotification('Open is not implemented in browser version.', 'error');
                                break;
                            case 'Save':
                                downloadCode();
                                break;
                            case 'Export':
                                downloadCode();
                                break;
                            case 'Undo':
                                document.execCommand('undo');
                                showNotification('Undo action performed.', 'info');
                                break;
                            case 'Redo':
                                document.execCommand('redo');
                                showNotification('Redo action performed.', 'info');
                                break;
                            case 'Cut':
                                elements.codeEditor.select();
                                document.execCommand('cut');
                                showNotification('Cut to clipboard.', 'info');
                                break;
                            case 'Copy':
                                elements.codeEditor.select();
                                document.execCommand('copy');
                                showNotification('Copied to clipboard.', 'info');
                                break;
                            case 'Paste':
                                elements.codeEditor.focus();
                                document.execCommand('paste');
                                showNotification('Paste from clipboard.', 'info');
                                break;
                            case 'Toggle Sidebar':
                                const sidebar = document.querySelector('.sidebar');
                                if (sidebar) sidebar.classList.toggle('hidden');
                                showNotification('Sidebar toggled.', 'info');
                                break;
                            case 'Zen Mode':
                                document.body.classList.toggle('zen-mode');
                                showNotification('Zen mode toggled.', 'info');
                                break;
                            case 'Full Screen':
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                                showNotification('Full screen toggled.', 'info');
                                break;
                            case 'Docs':
                                window.open('https://your-docs-link.com', '_blank');
                                break;
                            case 'Keyboard Shortcuts':
                                showNotification('Ctrl+S: Save, Ctrl+Enter: Run', 'info');
                                break;
                            case 'About':
                                showNotification('NovaCode Editor v1.0', 'info');
                                break;
                        }
                    });
                });
            }
            initMenuActions();
    
});

