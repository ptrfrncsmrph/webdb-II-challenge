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
  const { name } = req.body
  name == null
    ? res.status(400).json({
        message: "Please include a name."
      })
    : db("zoos")
        .insert({ name })
        .catch(_err => {
          res.status(500).json({
            message: "Error inserting zoo."
          })
        })
        .then(([id]) => {
          db("zoos")
            .where({ id })
            .catch(_err => {
              res.status(500).json({
                message: "Error retrieving inserted zoo."
              })
            })
            .then(([zoo]) => {
              res.status(200).json(zoo)
            })
        })
})

router.put("/:id", (req, res) => {
  const { id } = req.params
  const { name } = req.body
  name == null
    ? res.status(400).json({
        message: "Please include a name."
      })
    : db("zoos")
        .where({ id })
        .update({ name })
        .catch(_err => {
          res.status(500).json({
            message: "Error updating zoo."
          })
        })
        .then(num => {
          num == 0
            ? res.status(404).json({
                message: "Invalid ID."
              })
            : db("zoos")
                .where({ id })
                .catch(_err => {
                  res.status(500).json({
                    message: "Error retrieving inserted zoo."
                  })
                })
                .then(([zoo]) => {
                  res.status(200).json(zoo)
                })
        })
})

router.delete("/:id", (req, res) => {
  const { id } = req.params
  db("zoos")
    .where({ id })
    .del()
    .catch(_err => {
      res.status(500).json({
        message: "Error deleting zoo."
      })
    })
    .then(num => {
      num == 0
        ? res.status(404).json({
            message: "Invalid ID."
          })
        : res.status(200).json({
            message: "Zoo was deleted"
          })
    })
})

module.exports = router
