// Initialize balances for each user
let balances = {
    admin: 100000,
    admin1: 100000 // Initial balance for admin1
};

// Show account info upon login
function showAccountInfo() {
    document.getElementById('account-info').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if ((username === 'admin' && password === 'admin123') || 
        (username === 'admin1' && password === 'admin123')) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', username);
        showAccountInfo();
        updateDisplayedBalance();
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Update displayed balance based on the current user
function updateDisplayedBalance() {
    const currentUser = localStorage.getItem('currentUser');
    const balance = balances[currentUser];
    document.getElementById('balance').innerText = balance !== undefined ? balance : '0'; // Ensure balance is shown
}

// Transfer funds function
function handleTransfer() {
    const recipient = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currentUser = localStorage.getItem('currentUser');

    if (amount > 0) {
        if (amount <= balances[currentUser]) {
            // Deduct from current user and add to recipient
            balances[currentUser] -= amount;
            balances[recipient] = (balances[recipient] || 100000) + amount; // Initialize if undefined

            // Create transaction records
            const transaction = {
                date: new Date().toISOString().split('T')[0],
                amount: -amount, // Store as negative for sender
                description: `Transfer to ${recipient}`
            };

            const transactionForRecipient = {
                date: new Date().toISOString().split('T')[0],
                amount: amount, // Store as positive for recipient
                description: `Received from ${currentUser}`
            };

            // Store transactions
            const transactions = JSON.parse(localStorage.getItem('transactions')) || {};
            transactions[currentUser] = transactions[currentUser] || [];
            transactions[recipient] = transactions[recipient] || [];

            transactions[currentUser].push(transaction);
            transactions[recipient].push(transactionForRecipient);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Update balances in localStorage
            localStorage.setItem('balances', JSON.stringify(balances)); // Store updated balances
            updateDisplayedBalance(); // Update displayed balance
            document.getElementById('transfer-message').innerText = `Transferred ₹${amount} to ${recipient}.`;

            // Display transactions immediately after transfer
            displayTransactions();
        } else {
            document.getElementById('transfer-message').innerText = "Insufficient balance.";
        }
    } else {
        document.getElementById('transfer-message').innerText = "Invalid amount.";
    }
    return false; // Prevent form submission
}

// Display transaction history
function displayTransactions() {
    const currentUser = localStorage.getItem('currentUser');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || {};
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    (transactions[currentUser] || []).forEach(trans => {
        const transactionElement = document.createElement('div');
        transactionElement.innerText = `${trans.date}: ₹${Math.abs(trans.amount)} - ${trans.description}`;
        transactionElement.className = 'transaction-item';
        transactionList.appendChild(transactionElement);
    });
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
        const storedBalances = JSON.parse(localStorage.getItem('balances'));
        if (storedBalances) {
            balances = storedBalances; // Load balances from localStorage
        }
        const currentUser = localStorage.getItem('currentUser');
        showAccountInfo();
        updateDisplayedBalance();
        displayTransactions(); // Display transaction history on load
    }
});

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    document.getElementById('account-info').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    alert('You have been logged out.');
}
