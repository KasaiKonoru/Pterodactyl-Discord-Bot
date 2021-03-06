import { JSPteroAPIError } from '@linux123123/jspteroapi';
import { RunFunction } from '../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
    if (!args[0])
        return message.reply('You need to provide the id of the user!');
    try {
        const user = await client.app.getUserInfo(parseInt(args[0]), {
            servers: true,
        });
        let servers = '\u200b';
        user.relationships?.servers.data.forEach((srv, i) => {
            servers += `${i + 1}. ${srv.attributes.name}\n`;
        });
        message.channel.send(
            client.embed({
                title: `User: ${user.username}`,
                description: `${user.first_name} ${user.last_name}`,
                fields: [
                    {
                        name: 'User ID',
                        value: user.id,
                        inline: true,
                    },
                    {
                        name: 'EMAIL',
                        value: user.email,
                        inline: true,
                    },
                    {
                        name: 'ADMIN',
                        value: user.root_admin,
                        inline: true,
                    },
                    {
                        name: 'Servers:',
                        value: servers,
                    },
                ],
                color: message.settings.embedColor,
                timestamp: new Date(),
            }),
        );
    } catch (e) {
        if (e.ERRORS) {
            const err: JSPteroAPIError = e;
            client.logger(JSON.stringify(err), 'error');
            message.reply(
                `There was an error: ${err.ERRORS.join(' ').replaceAll(
                    'resource',
                    'user',
                )}`,
            );
            return;
        }
        client.logger(JSON.stringify(e), 'error');
        message.reply('There was an error while trying to send the message!');
        return;
    }
};
export const name = 'user';

export const conf = {
    aliases: ['usr'],
    permLevel: 'Administrator',
};
export const help = {
    category: 'Pterodactyl',
    description: 'Get the user information',
    usage: 'user <id>',
};
