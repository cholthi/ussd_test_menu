/**
 * Mock user database for the USSD application
 * In a real application, this would be a proper database like Postgres, MySQL, MongoDB etc
 * PIN would be hashed in a real application using a secure hash function
 */

// Initial set of users with enhanced data structure
const users = {
  // Format: MSISDN -> user object
  '211925415377': {
    msisdn: '211925415377',
    name: 'John Doe',
    hasPin: false,
    pin: null,
    isLocked: false,
    preferredLanguage: null,
    attempts: 0,
    // Loan Information
    loan: {
      status: 'Active',
      balance: 150000,
      nextPaymentDate: '2026-02-15',
      monthlyAmount: 25000,
      totalLoan: 500000,
      paidAmount: 350000,
      paymentHistory: [
        { date: '2026-01-15', amount: 25000, status: 'Paid' },
        { date: '2025-12-15', amount: 25000, status: 'Paid' },
        { date: '2025-11-15', amount: 25000, status: 'Paid' }
      ]
    },
    // Account Information
    account: {
      accountNumber: 'ACC001234',
      balance: 75000,
      accountType: 'Savings',
      phoneNumber: '07XX XXX XXX',
      nextDueDate: '20/01/2025',
      nextInstallmentAmount: 4500,
      transactions: [
        { date: '2026-01-15', amount: 1000 },
        { date: '2026-01-01', amount: 1500 },
        { date: '2025-10-15', amount: 1250 },
        { date: '2026-01-28', type: 'Loan Payment', amount: -25000, balance: 75000 },
        { date: '2026-01-25', type: 'Deposit', amount: 50000, balance: 100000 },
        { date: '2026-01-20', type: 'Withdrawal', amount: -15000, balance: 50000 }
      ]
    }
  },
  '211955123456': {
    msisdn: '211955123456',
    name: 'Jane Smith',
    hasPin: false,
    pin: null,
    isLocked: false,
    preferredLanguage: null,
    attempts: 0,
    // Loan Information
    loan: {
      status: 'Completed',
      balance: 0,
      nextPaymentDate: null,
      monthlyAmount: 0,
      totalLoan: 300000,
      paidAmount: 300000,
      paymentHistory: [
        { date: '2025-12-15', amount: 30000, status: 'Final Payment' },
        { date: '2025-11-15', amount: 30000, status: 'Paid' },
        { date: '2025-10-15', amount: 30000, status: 'Paid' }
      ]
    },
    // Account Information
    account: {
      accountNumber: 'ACC005678',
      balance: 125000,
      accountType: 'Current',
      transactions: [
        { date: '2026-01-29', type: 'Business Income', amount: 45000, balance: 125000 },
        { date: '2026-01-25', type: 'Withdrawal', amount: -20000, balance: 80000 },
        { date: '2026-01-20', type: 'Transfer In', amount: 35000, balance: 100000 },
        { date: '2026-01-15', type: 'Service Fee', amount: -500, balance: 65000 }
      ]
    }
  }
};

module.exports = users;
