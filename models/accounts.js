import mongoose from "mongoose";

const accountsSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    validate(value) {
      console.log(value);
      if (value < 0) {
        throw new Error("Não e permitido valor negativo");
      }
    },
  },
});

const accountsModel = mongoose.model("accounts", accountsSchema, "accounts");

export { accountsModel };
