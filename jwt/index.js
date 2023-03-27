const express = require("express");
const mongoose = require("mongoose");
const {
	signup,
	signin,
	getSecretMessage,
} = require("./controller/userController");
const { verifyUser } = require("./middleware");
const app = express();
app.use(express.json());

const PORT = 8000;
const connection_url =
	"mongodb+srv://justkenndy92:1234@mongoexample.yq1qg8x.mongodb.net/mongoDB2?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
	console.log("Connected to db");
});

app.get("/", (req, res) => res.send("Hello"));
app.get("/signup", signup);
app.get("/signin", signin);
app.get("/user/getSecret", verifyUser, getSecretMessage);
app.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}`);
});
