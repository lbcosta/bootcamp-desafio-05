import { Router } from 'express';
import { uuid } from 'uuidv4';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

// const transactionsRepository = new TransactionsRepository();

interface Transaction {
  id: string;
  title: string;
  value: number;
  type: string;
}

const transactions: Transaction[] = [];

transactionRouter.get('/', (request, response) => {
  try {
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((inc, transaction) => inc + transaction.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((out, transaction) => out + transaction.value, 0);

    return response.json({
      transactions,
      balance: {
        income,
        outcome,
        total: income - outcome,
      },
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    /**
     * type: Tipo da transação -> Income = Depósitos | Outcome = Retiradas
     */
    const { title, value, type } = request.body;

    const transaction = { id: uuid(), title, value, type };

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((inc, t) => inc + t.value, 0);

    const outcome = transactions
      .filter(t => t.type === 'outcome')
      .reduce((out, t) => out + t.value, 0);

    const total = income - outcome;

    if (transaction.type === 'outcome' && total - transaction.value < 0) {
      return response.status(400).json({ error: 'Insufficient Funds' });
    }

    transactions.push(transaction);

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
