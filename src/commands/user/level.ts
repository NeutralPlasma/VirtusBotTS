import { Command, CommandStore } from 'klasa';


import type { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_LEVEL_DESCRIPTION'),
			usage: '[user:string]'
		});
	}

	async run(message: Message, [query]: [string]): Promise<Message[]> {

        const location = !query ? "" : query; 

        return message.send(mb => 
                mb.setEmbed(em =>
                    em
                        .setColor(0x007bff)
                        .addField("Error:", `DA: "${location}" ne`, false))
        );
	}
}