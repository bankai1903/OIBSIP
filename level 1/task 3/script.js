document.addEventListener('DOMContentLoaded', () => {
    const tempInput = document.getElementById('tempInput');
    const unitSelect = document.getElementById('unitSelect');
    const convertBtn = document.getElementById('convertBtn');
    const resultArea = document.getElementById('resultArea');
    const resultValue = document.getElementById('resultValue');
    const resultLabel = document.getElementById('resultLabel');
    const errorMsg = document.getElementById('errorMsg');

    const convertTemperature = () => {
        const value = parseFloat(tempInput.value);
        const unit = unitSelect.value;

        // Validation
        if (isNaN(value)) {
            errorMsg.style.display = 'block';
            tempInput.style.borderColor = 'var(--error-color)';
            resultArea.style.visibility = 'hidden';
            return;
        }

        errorMsg.style.display = 'none';
        tempInput.style.borderColor = 'var(--glass-border)';

        let celsius, fahrenheit, kelvin;

        // Perform conversions based on input unit
        switch (unit) {
            case 'celsius':
                celsius = value;
                fahrenheit = (value * 9/5) + 32;
                kelvin = value + 273.15;
                displayResults(fahrenheit, kelvin, '°F', 'K');
                break;
            case 'fahrenheit':
                fahrenheit = value;
                celsius = (value - 32) * 5/9;
                kelvin = (value - 32) * 5/9 + 273.15;
                displayResults(celsius, kelvin, '°C', 'K');
                break;
            case 'kelvin':
                kelvin = value;
                celsius = value - 273.15;
                fahrenheit = (value - 273.15) * 9/5 + 32;
                displayResults(celsius, fahrenheit, '°C', '°F');
                break;
        }
    };

    const displayResults = (res1, res2, unit1, unit2) => {
        // We'll show the main conversion and secondary in a nice format
        // For simplicity and clarity, we'll focus on the primary conversions
        
        resultArea.style.visibility = 'visible';
        resultArea.classList.add('animate-result');
        
        // Formatting to 2 decimal places if needed
        const f1 = Number.isInteger(res1) ? res1 : res1.toFixed(2);
        const f2 = Number.isInteger(res2) ? res2 : res2.toFixed(2);

        resultValue.innerHTML = `
            <div style="font-size: 2.2rem;">${f1}${unit1}</div>
            <div style="font-size: 1.2rem; opacity: 0.7; margin-top: 5px;">${f2}${unit2}</div>
        `;
        
        resultLabel.innerText = 'Converted Values';
    };

    convertBtn.addEventListener('click', convertTemperature);

    // Allow Enter key to trigger conversion
    tempInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertTemperature();
        }
    });

    // Clear error on input
    tempInput.addEventListener('input', () => {
        if (errorMsg.style.display === 'block') {
            errorMsg.style.display = 'none';
            tempInput.style.borderColor = 'var(--glass-border)';
        }
    });
});
