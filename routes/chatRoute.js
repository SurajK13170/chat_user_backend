const express = require("express")
const { creatChat, findUserChat, findChat } = require("../controller/chatController")
const router = express.Router()


router.post("/", creatChat)
router.get("/:userId", findUserChat)
router.get("/find/:firstId/:secondId", findChat)

module.exports = router