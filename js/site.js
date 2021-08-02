// Get values from page
// controller function
function getValues() {
    let loan = {
        amount: 15000,
        term: 60,
        rate: 3.5,
        payment: 0.0,
        totalInterest: 0.0,
        totalCost: 0.0,
        payments: [],
    }

    // get user values from form
    loan.amount = document.getElementById("amount").value;
    loan.term = document.getElementById("term").value;
    loan.rate = document.getElementById("rate").value;

    // parse input to numbers
    loan.amount = Number.parseFloat(loan.amount);
    loan.term = Number.parseInt(loan.term);
    loan.rate = Number.parseFloat(loan.rate);

    // check if input are numbers
    if (Number.parseFloat(loan.amount) && Number.parseInt(loan.term) && Number.parseFloat(loan.rate)) {
        let loanHelper = getPayments(loan);

        displayResults(loanHelper);
    } else {
        alert("You must enter valid numbers");
    }
}

// Calculate loan payments
// logic function
function getPayments(loan) {
    // calculate monthly payments
    loan.payment = calcPayment(loan.amount, loan.rate, loan.term);

    let balance = loan.amount;
    let monthlyInterest = 0.0;
    let monthlyPrincipal = 0.0;
    let totalInterest = 0.0;
    let monthlyRate = calcMonthlyRate(loan.rate);

    // generate payment schedule
    for (let month = 1; month <= loan.term; month++) {
        monthlyInterest = calcMonthlyInterest(balance, monthlyRate);
        monthlyPrincipal = loan.payment - monthlyInterest;
        totalInterest += monthlyInterest;
        balance -= monthlyPrincipal;

        // generate single month payment
        let loanPayment = {
            month: month,
            payment: loan.payment,
            monthlyPrincipal: monthlyPrincipal,
            monthlyInterest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balance,
        }

        // push payments into loan
        loan.payments.push(loanPayment);
    }

    loan.totalInterest = totalInterest;
    loan.totalCost = loan.amount + totalInterest;

    // return loan to view
    return loan;
}

// Display results to page
// view function
function displayResults(loan) {
    //get the table body element from the page
    let tableBody = document.getElementById("results");

    //get the row from the template
    let templateRow = document.getElementById("fbTemplate");

    //clear table first
    tableBody.innerHTML = "";

    // create object for currency formatting
    const currency = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD', minimumFractionDigits: 2});

    for (let i = 0; i < loan.payments.length; i++) {
        const tableRow = document.importNode(templateRow.content, true);
        
        //grab only the columns in the template
        let rowCols = tableRow.querySelectorAll("td");
        
        rowCols[0].textContent = loan.payments[i].month;
        rowCols[1].textContent = currency.format(loan.payments[i].payment);
        rowCols[2].textContent = currency.format(loan.payments[i].monthlyPrincipal);
        rowCols[3].textContent = currency.format(loan.payments[i].monthlyInterest);
        rowCols[4].textContent = currency.format(loan.payments[i].totalInterest);
        rowCols[5].textContent = currency.format(loan.payments[i].balance);

        //add all rows to the table
        tableBody.appendChild(tableRow);
    }
    console.log(loan.payments[1])

    document.getElementById("totalPrincipal").innerHTML = `${currency.format(loan.amount)}`;
    document.getElementById("totalInterest").innerHTML = `${currency.format(loan.totalInterest)}`;
    document.getElementById("totalCost").innerHTML = `${currency.format(loan.totalCost)}`;
    document.getElementById("payment").innerHTML = `${currency.format(loan.payment)}`;
    
}


// Helper functions
function calcPayment(amount, rate, term) {
    let monthlyRate = calcMonthlyRate(rate);

    return (amount * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -term));
}

function calcMonthlyRate(rate) {
    return rate / 1200.0;
}

function calcMonthlyInterest(balance, monthlyRate) {
    return balance * monthlyRate;
}