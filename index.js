require("dotenv").config()
const Discord = require("discord.js")
const client = new Discord.Client({ fetchAllMembers: true })
const createCsvWriter = require("csv-writer").createObjectCsvWriter

client.login(process.env.CLIENT_TOKEN)
	.catch(err => console.log('Invalid client token'))

client.on("message", async (msg) => {
	if (msg.content === "/members") {
		let arr = []
		let guild = msg.guild

		guild.members.cache.forEach((member) => {
			arr.push({
				member: member.user.tag,
				joined: member.joinedAt,
			})
		})

		generateCSV(arr)

		await msg.channel.send(
			`Here's a list of all ${guild.memberCount} server members!`,
			{
				files: ["./members.csv"],
			}
		)

	}
})

function generateCSV(arr) {
	const csvWriter = createCsvWriter({
		path: "members.csv",
		header: [
			{ id: "member", title: "Member" },
			{ id: "joined", title: "Date Joined" },
		],
	})

	csvWriter
		.writeRecords(arr)
		.then(() => console.log("\nThe CSV file was written successfully"))
}
