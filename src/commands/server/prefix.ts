import { Command, CommandStore } from 'klasa';


import type { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_LEVEL_DESCRIPTION'),
			usage: '[reset|prefix:str{1,10}]'
		});
	}

	async run(message: Message, [prefix]: [string]): Promise<Message[]> {

        if(prefix === "reset"){
            await message.guild.settings.update('prefix', "!");
            prefix = "!";
        }else{
            await message.guild.settings.update('prefix', prefix);
        }

        return message.send(mb => 
            mb.setEmbed(em =>
                em
                    .setColor(0x007bff)
                    .addField("Update:", `Changed prefix to: "${prefix}"`, false)));
	}
}