/**
 * Messages all members of a specific role in a Discord guild by the role's name.
 * 
 * @param {Guild} guild The Discord guild.
 * @param {string} roleName The name of the role.
 * @param {string} message The message to send.
 * 
 * @returns {Promise<{successes: Array, failures: Array}>} The results of the messaging attempts.
 */
export default async function messageMembersByRoleName(guild, roleName, message) {
  const role = guild.roles.cache.find(
    (role) => role.name.toLowerCase() === roleName.toLowerCase(),
  );

  if (!role) throw new Error(`Role "${roleName}" not found.`);

  let successes = [];
  let failures = [];

  for (const member of role.members.values()) {
    try {
      let result = await member.send(message);
      successes.push(result);
    } catch (error) {
      failures.push({ member, error });
    }
  }

  return { successes, failures };
}
