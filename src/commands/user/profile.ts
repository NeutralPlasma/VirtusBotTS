import { Command, CommandStore, KlasaUser } from 'klasa';
import { Canvas } from 'canvas-constructor';
import { promises as fsp } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';





const THEMES_FOLDER = join(__dirname, "..", "..", "assets", "design", 'banners');


import type { Message } from '@klasa/core';

export default class extends Command {

	constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_PROFILE_DESCRIPTION'),
		});
	}

	private lightThemeTemplate: Buffer | null = null;
	private darkThemeTemplate: Buffer | null = null;

	async run(message: Message, [prefix]: [string]): Promise<Message[]>{

        const output = await this.showStatus(message, message.author);
		return message.channel.send(mb =>
			mb.addFile(
				{
					name: "profile.png",
					file: output
				}
			));
		
    }
    
    public async showStatus(message: Message, user: KlasaUser){
        const canvas = new Canvas(1024, 480);

		const { settings } = message.author;
		
	
        const money = settings.get("money") || 0;
        const bank = settings.get("bank") || 0;
        const level = settings.get("level") || 0;
        const exp = settings.get("exp") || 0;
        const rank = settings.get("rank") || 0;
		const reputation = settings.get("rep") || 0;
		const themeProfile = settings.get("theme") || 'default';
		const darkTheme = settings.get("dark-theme") || false;

		
		const url = "https://cdn.discordapp.com/data:image/jpeg;" + message.author.avatar;

		const [themeImageSRC, imgAvatarSRC] = await Promise.all([
			fsp.readFile(join(THEMES_FOLDER, `${themeProfile}.png`)),
			fetch(url).then(res => res.buffer())
		]);



		return canvas
			// Images
			.save()
			.createBeveledClip(10, 10, 1024, 480, 8)
			.addImage(darkTheme ? this.darkThemeTemplate! : this.lightThemeTemplate!, 0, 0, 1024, 480)
			.addImage(themeImageSRC, 9, 9, 1024, 480)

			//.clearPixels(10, 10, 186, 371)
			.addCircle(113, 113, 80.5) // Circle for plugin icon
			.resetShadows() // shadow

			.restore()

			// Progress bar
			.setColor(darkTheme ? '#F0F0F0' : '#171717'/*'FF239D'*/)
			.addBeveledRect(227, 451, 25, 9, 4)

			// Name title
			.setTextFont('55px RobotoRegular')
			.setColor(darkTheme ? '#F0F0F0' : '#171717')
			.addResponsiveText(user.username, 327, 63, 306)
			.setTextFont('35px RobotoLight')
			.addText(`#${user.discriminator}`, 327, 105)

			// Statistics Titles
			.addText("REPUTATION", 327, 181)
			.addText("CREDITS", 327, 229)
			.addText("GLOBAL RANK", 327, 276)

			// Experience
			.setTextFont('25px RobotoLight')
			.addText("EXPERIENCE", 227, 440)

			// Statistics Values
			.setTextAlign('right')
			.setTextFont('35px RobotoLight')
			.addText(`${rank}`, 982, 276)
			.addText(`${money} | ${bank}`, 982, 229)
			.addText(`${reputation}`, 982, 181)
			.addText(`${exp}`, 944, 440)

			// Level
			.setTextAlign('center')
			.setTextFont('30px RobotoLight')
			.addText("LEVEL", 964, 58)
			.setTextFont('40px RobotoRegular')
			.addText(`${level}`, 964, 100)

			// Avatar
			.addImage(imgAvatarSRC, 32, 32, 142, 142)
			.toBufferAsync();

	}



	public async init() {
		[
			this.lightThemeTemplate,
			this.darkThemeTemplate,
		] = await Promise.all([
			new Canvas(1024, 480)
				.setAntialiasing('subpixel')
				.setShadowColor('rgba(0, 0, 0, 0.7)')
				.setShadowBlur(7)
				.setColor('#FFFFFF')
				.createBeveledPath(10, 10, 1024, 480, 9)
				.fill()
				.createBeveledClip(10, 10, 1024, 480, 5)

				.clearPixels(10, 10, 186, 371)
				.addCircle(103, 103, 70.5) // Circle for plugin icon
				.resetShadows() // shadow

				.setColor(`#E8E8E8`)
				.addBeveledRect(226, 450, 715, 11, 4)
				.toBufferAsync(),
			new Canvas(1024, 480)
				.setAntialiasing('subpixel')
				.setShadowColor('rgba(0, 0, 0, 0.7)')
				.setShadowBlur(7)
				.setColor('#202225')
				.createBeveledPath(10, 10, 1024, 480, 9)
				.fill()
				.createBeveledClip(10, 10, 1024, 480, 5)

				.clearPixels(10, 10, 186, 371)
				.addCircle(103, 103, 70.5) // Circle for plugin icon
				.resetShadows() // shadow

		
				.setColor(`#2C2F33`)
				.addBeveledRect(226, 450, 715, 11, 4)
				.toBufferAsync(),
		]);
	}

}