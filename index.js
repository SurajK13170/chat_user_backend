const expresss = require("express")
const cors = require("cors")
const userRouter = require("./routes/userRoute")
const chatRouter = require("./routes/chatRoute")
const messageRouter = require("./routes/messageRouter")


const mongoose = require("mongoose")
require("dotenv").config()

const app = expresss()
app.use(expresss.json())
app.use(cors())

app.use("/users", userRouter)
app.use("/chats", chatRouter)
app.use("/messages", messageRouter)



const port = 8000


app.listen(port, (req, res) => {
    console.log(`Server is running at port number${port}`)
})

mongoose.connect(process.env.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to Data Base")).catch((err) => console.log("connection failed"))