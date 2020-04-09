const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

// /api/accounts

////////////////////////////////////////////////////////////////
// Gets

// done
router.get("/", (req, res) => {
  db("accounts")
    .then((accounts) => {
      res.status(200).json(accounts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// done
router.get("/:id", validateAccountId, (req, res) => {
  db("accounts")
    .where("id", req.params.id)
    .first()
    .then((account) => {
      res.status(200).json(account);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

////////////////////////////////////////////////////////////////
// Post

// done
router.post("/", validateAccount, (req, res) => {
  const accountData = req.body;

  db("accounts")
    .insert(accountData)
    .then((account) => {
      res.status(201).json(account);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error posting account.", err });
    });
});

////////////////////////////////////////////////////////////////
// Put

// done
router.put("/:id", validateAccountId, validateAccount, (req, res) => {
  const changes = req.body;

  db("accounts")
    .where({ id: req.params.id })
    .update(changes)
    .then((account) => {
      res.json({ Updated: account });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating account.", err });
    });
});

////////////////////////////////////////////////////////////////
// Delete

// done
router.delete("/:id", validateAccountId, (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then((count) => {
      res.status(200).json({ message: "Account deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting account.", err });
    });
});

////////////////////////////////////////////////////////////////
// middleware

function validateAccountId(req, res, next) {
  db("accounts")
    .where("id", req.params.id)
    .first()
    .then((account) => {
      if (account) {
        req.account = account;
        next();
      } else {
        res.status(404).json({ error: `Account not found.` });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

function validateAccount(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Request missing account data." });
  } else if (req.body.name === undefined || req.body.budget === undefined) {
    res.status(400).json({
      error: "Request must include name and budget fields.",
    });
  } else {
    next();
  }
}

module.exports = router;
