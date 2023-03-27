const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signup = async (req, res) => {
	const { name, isAdmin, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser)
			return res.status(400).json({ message: "User already exists." });

		const hashedPassword = await bcrypt.hash(password, 12);
		const result = await User.create({
			name,
			isAdmin,
			email,
			password: hashedPassword,
		});
		const token = jwt.sign(
			{ email: result.email, id: result._id },
			"secret_passphrase"
		);
		res.status(200).json({ result, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong." });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (!existingUser)
			return res.status(404).json({ message: "User does not exist" });

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);
		if (!isPasswordCorrect)
			return res.status(404).json({ message: "Wrong Password" });

		const token = jwt.sign(
			{ email: existingUser.email, id: existingUser._id },
			"secret_passphrase",
			{ expiresIn: "3h" }
		);
		res.status(200).json({ result: existingUser, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

const getSecretMessage = async (req, res) => {
	const verify = jwt.verify(req.token, "secret_passphrase");
	console.log(verify);
	const existingUser = await User.findOne({ email: verify.email });
	const isAdmin = existingUser.isAdmin;
	if (isAdmin) {
		res.status(200).json({ msg: "This is the secret msg" });
	} else {
		res
			.status(200)
			.json({ msg: "This message can only be requested by admins" });
	}
};
module.exports = { signup, signin, getSecretMessage };
