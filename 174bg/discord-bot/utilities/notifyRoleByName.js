export default async (guild, roleName, message) => {
  // get the role by name
  const role = guild.roles.cache.find(
    (role) => role.name.toLowerCase() === roleName.toLowerCase(),
  );

  if (!role) {
    console.error(`Role "${roleName}" not found.`);
    return;
  }

  // get all members with the role
  const membersWithRole = role.members;

  // send a DM to each member with the role
  for (const member of membersWithRole.values()) {
    await member.send(message);
  }
};
