require("dotenv").config()
const { Client } = require("discord.js")
const ObjectsToCsv = require("objects-to-csv")
const client = new Client({ fetchAllMembers: true })

client.login(process.env.CLIENT_TOKEN)
	.catch(err => console.log("Invalid client token"))

client.on("ready", () => {
	console.log("Discord Members Bot ready")
})

client.on("message", async (msg) => {
	// Only allow this command from admins
	if (msg.member && msg.member.hasPermission(["ADMINISTRATOR"])) {
		// Listen for message that says "/members" (not case sensitive)
		if (msg.content.toLowerCase() === "$members") {
			generateCsvOfMembers(msg)
		}
	}
})

async function generateCsvOfMembers(msg) {
	let members = []
	let guild = msg.guild

	guild.members.cache.forEach((member) => {
		members.push({
			member: member.user.tag,
			joined: member.joinedAt,
		})
	})

	const csv = new ObjectsToCsv(members)
	await csv.toDisk("./members.csv")
		.then(() => {
			msg.channel.send(`Here's a list of all ${guild.memberCount} server members!`, { files: ["./members.csv"] })
		})
		.catch((err) => {
			console.log("Error getting a list of Discord guild members.", err)
			msg.channel.send("Error getting the members of this server.")
		})
}
