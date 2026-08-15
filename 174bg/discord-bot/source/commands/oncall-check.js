import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { login } from "../controllers/pocketbase.js";

export default {
  data: new SlashCommandBuilder()
    .setName("oncall-check")
    .setDescription("Returns a list of members who are currently on call.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    const date = new Date();
    const dateUTCHours = date.getUTCHours();
    const dateUTCMinutes = date.getUTCMinutes();
    const dateUTCDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][date.getUTCDay()];

    const pb = await login();

    const members = await pb.collection("members").getFullList();

    let membersOnCall = [];

    for (const member of members) {
      try {
        if (member.onCallSchedule) {
          const available =
            member.onCallSchedule[dateUTCDay]?.available || false;

          if (available) {
            const start = member.onCallSchedule[dateUTCDay].start;
            const startHours = start.split(":")[0];
            const startMinutes = start.split(":")[1];
            const end = member.onCallSchedule[dateUTCDay].end;
            const endHours = end.split(":")[0];
            const endMinutes = end.split(":")[1];

            console.log(
              `Checking on-call schedule for member ${member.name}: ${start} - ${end} (UTC)`,
            );

            if (
              (dateUTCHours > startHours ||
                (dateUTCHours === startHours &&
                  dateUTCMinutes >= startMinutes)) &&
              (dateUTCHours < endHours ||
                (dateUTCHours === endHours && dateUTCMinutes <= endMinutes))
            ) {
              membersOnCall.push(member);
            }
          }
        }
      } catch (error) {
        console.error(
          `Error checking on-call schedule for member ${member.name}:`,
          error,
        );
      }
    }

    await interaction.reply({
      content: `${membersOnCall.map((member) => `- <@${member.discordId}>`).join("\n") || "No members are currently on call."}`,
      ephemeral: true,
    });
  },
};
