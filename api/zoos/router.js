const router = require("express").Router()
const knex = require("knex")

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
}

const db = knex(knexConfig)

router.get("/", (_req, res) => {
  db("zoos")
    .catch(err => {
      res.status(500).json(err)
    })
    .then(zoos => {
      res.status(200).json(zoos)
    })
})

router.get("/:id", (_req, res) => {
  const { id } = req.params
  db("zoos")
    .where({ id })
    .catch(err => {
      res.status(404).json(err)
    })
    .then(([zoo]) => {
      res.status(200).json(zoo)
    })
})

router.post("/", (req, res) => {
  db("zoos")
    .insert(req.body)
    .catch(err => {
      res.status(404).json(err)
    })
    .then(([id]) => {
      db("zoos")
        .where({ id })
        .catch(err => {
          res.status(500).json(err)
        })
        .then(([zoo]) => {
          res.status(200).json(zoo)
        })
    })
})

router.put("/:id", (req, res) => {})

router.delete("/:id", (req, res) => {})

module.exports = router
