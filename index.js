import express from "express";
import { accountsRouter } from "./routes/accountsRouter.js";
import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://teste:helena2@cluster0.z9bdh.mongodb.net/bank?retryWrites=true&w=majority",
      { useUnifiedTopology: true, useNewUrlParser: true }
    );
  } catch (error) {
    console.log("Erro ao conectar no banco", error);
  }
})();

const app = express();

app.use(express.json());

app.use(accountsRouter);

app.listen(3000, () => {
  console.log("Servidor up");
});
