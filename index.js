const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const compression = require("compression");
const { PORT, NODE_ENV } = require("./config");
const gigRoutes = require("./routes/api/gigRoutes");
const paymentRoutes = require("./routes/api/paymentRoutes");
const orderRoutes = require("./routes/api/orderRoutes");
const Conversation = require('./models/Conversation')
const Message = require('./models/Message')
require("dotenv").config();
const http = require("http")
app.use(bodyParser.json({ limit: '30mb', extended: false }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: false }))

const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
})

let users = [];

io.on("connection", (socket) => {
	socket.emit("me", socket.id)
	socket.on("createConversion", async (data) => {
		const conversations = await Conversation.find({
			members: { $in: [data.receiverID] },
		});
		if (conversations[0] == undefined) {
			const conversation = new Conversation({
				members: [data.senderID, data.receiverID],
			});
			conversation.save()
		}
		else {
			let modifiedConversations = await Promise.all(
				conversations.map(async item => {
					try {
						let messages = await Message.find({
							conversationID: item._id,
						});
						return { ...item.toJSON(), messages: messages };
					} catch (err) {
						throw err;
					}
				})
			);
			console.log(modifiedConversations)
			socket.emit("recivedConversion", modifiedConversations)
		}
	})
	socket.on("sendMessage", async (data) => {
		users.find((user) => user.userId === userId);
		io.to(user.socketId).emit("getMessage", {
			senderId,
			text,
		});
		const message = new Message(data)
		const savedMessage = await message.save()
		socket.emit("recivedMessage", savedMessage)
	})
	socket.on("addUser", (userId) => {
		!users.some((user) => user.userId === userId) &&
			users.push({ userId, socketId: socket.id });
		io.emit("getUsers", users);
	});

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})


const isProduction = NODE_ENV === "production";

if (!isProduction) {
	require("dotenv").config();
}
app.use(compression()); // gzip compress responses
require("./startup/logging")(); // logging to files
require("./startup/db")(); // database connection
require("./startup/session")(app); // Initialized session for authentication
require("./startup/securityHeaders")(app); // Setting security headers with helmet module
require("./startup/routes")(app); // Initializing all api routes

if (isProduction) {
	app.use(express.static("client/build"));

	app.get("*", (_, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
} else {
	app.use(express.static("../public"));
	app.get("/", (req, res) => {
		res.send("hello");
	});
	app.use("/api/gig", gigRoutes);
	app.use("/api/orders", orderRoutes);
	app.use("/api/payments", paymentRoutes);
}

server.listen(PORT, () => {
	console.log(`> 🚀 Server is running on port ${PORT}...`);
});
