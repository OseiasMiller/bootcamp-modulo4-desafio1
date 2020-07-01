import express from "express";
import { accountsModel } from "../models/accounts.js";

const router = express.Router();

// router.get("/", async (_, res) => {
//   res.send(accounts);
// });

router.put("/depositar/:agencia/:conta", async (req, res) => {
  const { agencia, conta } = req.params;
  const { balance } = req.body;
  try {
    const account = await accountsModel.findOneAndUpdate(
      {
        agencia: agencia,
        conta: conta,
      },
      {
        $inc: { balance: balance },
      },
      { new: true }
    );

    if (!account) {
      res.send(`Agencia: ${agencia} e Conta: ${conta} não encontrado`);
    }

    res.send(account);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/saldo/:agencia/:conta", async (req, res) => {
  const { agencia, conta } = req.params;
  try {
    const saldoConta = await saldo(agencia, conta);
    if (!saldoConta) {
      throw new Error(`Agencia: ${agencia} e Conta: ${conta} não encontrado`);
    }

    res.send({ saldo: saldoConta });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/excluir/:agencia/:conta", async (req, res) => {
  const { agencia, conta } = req.params;
  try {
    const account = await accountsModel.findOneAndDelete({
      agencia: agencia,
      conta: conta,
    });

    const accounts = await accountsModel.find({ agencia: agencia });

    res.send(accounts);
  } catch (Error) {
    res.status(500).send(error.message);
  }
});

router.get("/mediaSaldo/:agencia", async (req, res) => {
  const { agencia, conta } = req.params;
  const accounts = await accountsModel.aggregate([
    // { $match: { agencia: agencia } },
    {
      $group: {
        _id: "$agencia",
        media: { $avg: "$balance" },
      },
    },
  ]);

  res.send(accounts);
});

router.get("/menorSaldo/:limit", async (req, res) => {
  const { limit } = req.params;
  const accounts = await accountsModel
    .find({})
    .sort({ balance: 1 })
    .limit(parseInt(limit));
  res.send(accounts);
});

router.get("/maiorSaldo/:limit", async (req, res) => {
  const { limit } = req.params;
  const accounts = await accountsModel
    .find({})
    .sort({ balance: -1, name: -1 })
    .limit(parseInt(limit));
  res.send(accounts);
});

router.put("/sacar/:agencia/:conta", async (req, res) => {
  const { agencia, conta } = req.params;
  let { balance } = req.body;

  try {
    balance = balance + 1;
    const saldoConta = await saldo(agencia, conta);
    if (saldoConta) {
      if (saldoConta - balance < 0) {
        throw new Error("Saldo Insuficiente");
      }
    } else {
      throw new Error(`Agencia: ${agencia} e Conta: ${conta} não encontrado`);
    }

    balance *= -1;

    const account = await accountsModel.findOneAndUpdate(
      {
        agencia: agencia,
        conta: conta,
      },
      {
        $inc: { balance: balance },
      },
      { new: true }
    );

    if (!account) {
      throw new Error(`Agencia: ${agencia} e Conta: ${conta} não encontrado`);
    }

    res.send(account);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const saldo = async (agencia, conta) => {
  const account = await accountsModel.findOne(
    {
      agencia: agencia,
      conta: conta,
    },
    { balance: 1, _id: 0 }
  );
  if (!account) {
    return null;
  } else {
    return account.balance;
  }
};

export { router as accountsRouter };
