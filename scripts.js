// Array to store NPV values for each project
const projectstotal = [];

// Variable to track the current tab
let currentTab = 0;

// Show the initial tab when the page loads
showTab(currentTab);

// Function to display a specific tab
function showTab(n) {
    // Get all tab elements
    const tabs = document.getElementsByClassName("tab");
    // Display the specified tab
    tabs[n].style.display = "block";

    // Get previous and next buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Hide previous button on first tab, show otherwise
    prevBtn.style.display = n === 0 ? "none" : "inline";

    // Change next button text to "Calculate" on last tab, "Next" otherwise
    nextBtn.innerHTML = n === tabs.length - 1 ? "Calculate" : "Next";

    // Update step indicator
    fixStepIndicator(n);
}

// Function to navigate to the next or previous tab
function nextPrev(n) {
    // Get all tab elements
    const tabs = document.getElementsByClassName("tab");
    // Validate form if navigating forward
    if (n === 1 && !validateForm()) return false;
    // Hide current tab
    tabs[currentTab].style.display = "none";
    // Move to next tab
    currentTab += n;
    // If reached the end of the form
    if (currentTab >= tabs.length) {
        // Calculate NPV and display result
        npv();
        // Change button text to "Restart"
        document.getElementById("nextBtn").innerHTML = "Restart";
        // Hide previous button
        document.getElementById("prevBtn").style.display = "none";
        // Change next button behavior to submit form
        document.getElementById("nextBtn").setAttribute("onclick", "document.getElementById('regForm').submit()");
        return false;
    }
    // Show next tab
    showTab(currentTab);
}

function validateForm() {
    // Get all input fields in the current tab
    const inputs = document.querySelectorAll('.tab')[currentTab].querySelectorAll('input');
    // Check each input field
    for (const input of inputs) {
        // If it's the project name field
        if (input.getAttribute('name') === 'name') {
            // If project name is empty, contains numbers, or starts with a number, fail validation
            if (input.value.trim() === '' || /^\d/.test(input.value)) {
                // Add "invalid" class to input field
                input.classList.add("invalid");
                // Display error message
                alert("Please enter a valid project name that doesn't start with a number.");
                return false;
            }
        } else {
            // If input value is not a valid number
            if (!isValidNumber(input.value)) {
                // Add "invalid" class to input field
                input.classList.add("invalid");
                // Display error message
                alert("Please enter a valid number in all fields.");
                return false;
            }
        }
    }
    // Mark current step as finished and valid
    document.getElementsByClassName("step")[currentTab].classList.add("finish");
    // Calculate Net Cash Flow for the current project
    netcash(currentTab);
    return true;
}


// Function to check if a value is a valid number
function isValidNumber(value) {
    // Use regular expression to check for valid numeric format and Number function to validate
    return /^\s*\d{1,20}(,\d{3})*(\.\d+)?\s*$/.test(value) && !isNaN(Number(value.replace(/,/g, '')));
    
}

// Function to update step indicator
function fixStepIndicator(n) {
    // Get all step elements
    const steps = document.getElementsByClassName("step");
    // Remove "active" class from all steps
    for (let i = 0; i < steps.length; i++) {
        steps[i].className = steps[i].className.replace(" active", "");
    }
    // Add "active" class to current step
    steps[n].className += " active";
}

// Function to calculate Net cashflow for a project
function netcash(projectIndex) {
    // Parse input values, removing commas and converting to float
    const parseInputValue = (inputName) => {
        return parseFloat(document.querySelectorAll("input[name='" + inputName + "']")[projectIndex].value.replace(/,/g, ''));
    };

    // Calculate Net cashflow for each year and sum them up
    const year0 = (parseInputValue('0in') - parseInputValue('0out')) * parseInputValue('0fact');
    const year1 = (parseInputValue('1in') - parseInputValue('1out')) * parseInputValue('1fact');
    const year2 = (parseInputValue('2in') - parseInputValue('2out')) * parseInputValue('2fact');
    const year3 = (parseInputValue('3in') - parseInputValue('3out')) * parseInputValue('3fact');
    const totalcash = year0 + year1 + year2 + year3;
    // Store NPV in the array
    projectstotal[projectIndex] = totalcash;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to format NPV values with commas
function formatWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to display NPV result
function npv() {
    let resultMessage = "<div style='text-align:center; font-weight:bold;'>";

    // Find project with the highest NPV
    const highestNPVProject = projectstotal.reduce((prev, current, index) => {
        if (current > projectstotal[prev]) return index;
        else return prev;
    }, 0);
    const highestNPV = projectstotal[highestNPVProject];
    const highestNPVName = document.getElementById("name" + highestNPVProject).value;

    resultMessage += `The project with the highest NPV is: ${capitalizeFirstLetter(highestNPVName)} with an NPV of £${formatWithCommas(highestNPV.toFixed(2))}<br><br>`;

    resultMessage += "<table style='margin: auto;'><tr><th>Project Name</th><th>Net Present Value</th></tr>";
    // Create an array of objects containing project name, NPV, and original NPV without commas
    const projectsWithNPV = projectstotal.map((npv, index) => ({
        name: capitalizeFirstLetter(document.getElementById("name" + index).value), // Capitalize the project name
        formattedNPV: formatWithCommas(npv.toFixed(2)) // NPV formatted with commas and 2 decimal places
    }));

    // Sort the projects by NPV in descending order
    projectsWithNPV.sort((a, b) => b.npv - a.npv);

    // Iterate through sorted projects
    projectsWithNPV.forEach(project => {
        // Add row to the table for each project
        resultMessage += `<tr><td>${project.name}</td><td>£${project.formattedNPV}</td></tr>`;
    });

    // Close the table tag
    resultMessage += "</table>";
    resultMessage += "</div>";

    // Display result message in the result container
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = resultMessage;
    resultContainer.style.display = "block";
    resultContainer.classList.add("centeredTable");
}














