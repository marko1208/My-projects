'use strict';


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display movements function
const displayMovements = function (movements) {
  containerMovements.innerHTML = ' ';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
   </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const user = 'Steven Thomas Williams'; // STW

const createUserNames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(letter => letter[0])
      .join('');
  });
};

createUserNames(accounts);

// Print Balance function
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
};
// Display Summary function
const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  labelSumOut.textContent = `${Math.abs(outcome)}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((mov, i) => mov >= 1)
    .reduce((acc, deposit) => acc + deposit, 0)
    .toFixed(2);
  labelSumInterest.textContent = `${interest}€`;
};

// Update UI

const updateUI = function (account) {
  displayMovements(account.movements);

  calcPrintBalance(account);

  calcDisplaySummary(account);
};

/// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent from submitting
  e.preventDefault();
  console.log('LOGIN');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';

    // Input pin filed losing focus

    inputLoginPin.blur();

    // Display UI

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  // Prevent from submitting
  e.preventDefault();

  // Elements
  let amount = Number(inputTransferAmount.value);
  let transferId = inputTransferTo.value;

  const reciverAcc = accounts.find(acc => acc.username === transferId);

  // Clear input fileds
  inputTransferAmount.blur();

  inputTransferAmount.value = inputTransferTo.value = '';

  // Display movements

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    // Transfer money
    currentAccount.movements.push(-Math.abs(amount));
    reciverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

// Loan event Handler

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    // Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

// Close account Event Handler

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closeUser = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );

  if (closeUser.pin === Number(inputClosePin.value)) {
    console.log('Obrisi racun');

    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hidee UI
    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});