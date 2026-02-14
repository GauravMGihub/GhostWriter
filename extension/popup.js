// It fetches your data and injects a script into the current tab.

document.getElementById('fillBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = "Fetching data...";

    try {
        // 1. Get data from your Localhost Backend
        const response = await fetch('http://localhost:5000/api/profile');
        const data = await response.json();

        // 2. Find the current active tab in Chrome
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // 3. Inject the "filler script" into that tab
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: autoFillScript,   // The function below to run inside the page
            args: [data]            // Pass the DB data to that function
        });

        statusDiv.textContent = "✅ Injected!";
    } catch (error) {
        statusDiv.textContent = "❌ Error: Could not connect to backend.";
        console.error(error);
    }
});


// --- THIS FUNCTION RUNS INSIDE THE WEBPAGE (NAUKRI, GOOGLE FORMS, ETC) ---


function autoFillScript(profile) {
    console.log("👻 GhostWriter is scanning the page...");

    // Helper to fill a single field safely

    const fillInput = (keywords, value) => {
        if (!value) return;

        // Find all inputs and textareas
        const inputs = document.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            // Get the input's "fingerprint" (id, name, placeholder, label)
            const name = (input.name || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const type = (input.type || '').toLowerCase();
    // Skip hidden fields or checkboxes for now
            if (type === 'hidden' || type === 'checkbox' || type === 'radio') return;
    // Check if any keyword matches
            const isMatch = keywords.some(key => 
                name.includes(key) || id.includes(key) || placeholder.includes(key)
            );
            if (isMatch) {
                input.value = value;
            
                // 2. DISPATCH EVENTS (Crucial for React/Angular sites like Naukri!)
                // Without this, the website won't "know" you typed anything.
            
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));

                // 3. Visual feedback (Turn it light blue)
                input.style.backgroundColor = "#e6f7ff";
                input.style.border = "2px solid #007bff";
            }
        });
    };

    // --- MAPPING LOGIC ---
    // We map your DB fields to common HTML keywords

    fillInput(['first', 'fname', 'given'], profile.firstName);
    fillInput(['last', 'lname', 'surname'], profile.lastName);
    fillInput(['email', 'mail'], profile.email);
    fillInput(['phone', 'mobile', 'contact', 'tel'], profile.phone);
    fillInput(['linkedin', 'link'], profile.linkedin);
    fillInput(['github', 'git', 'repo'], profile.github);

    alert("👻 GhostWriter finished filling!");

}