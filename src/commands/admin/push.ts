import { Command, CommandStore } from 'klasa';
import { Canvas } from 'canvas-constructor';
import fetch from 'node-fetch';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { Message} from '@klasa/core';


const THEMES_FOLDER = join(__dirname, "..", "..", "assets", "public", 'img', 'banners');

//import { TOKENS } from '../../../config';

/*
	Design taken from: https://github.com/skyra-project/skyra
*/


export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_PLUGIN_DESCRIPTION'),
            usage: '<plugin:string>',
            permissionLevel: 6
		});
    }
    
    private lightThemeTemplate: Buffer | null = null;
	private darkThemeTemplate: Buffer | null = null;

	public async run(message: Message, [query]: [string]): Promise<Message[]> {
		const plugin = !query ? '' : query;

        const output = await this.showInfo(message, plugin);
        message.delete();
        return message.send(mb =>
            mb
                .addFile({
					name: 'stats.png',
					file: output.canvas.toBuffer()
				})
                .setEmbed(em =>
                    em
                        .setColor(0xffa033)
                        .setImage('attachment://stats.png')
                        .addField(`**Update for ${output.name}**`, `Download: ${output.download} \n`, false)
        ));
    }
    
    public async showInfo(message: Message, plugin: string){

		const data = await (await fetch(`https://songoda.com/api/v2/products/${this.getPlugin(plugin.toLowerCase())}`)).json();
		

        const [themeImageSRC, pluginIcon] = await Promise.all([
            fsp.readFile(join(THEMES_FOLDER, `0w1p27.png`)),
			fetch(data.data.icon).then(res => res.buffer())
        ]);
        
    

        const canvas = new Canvas(740, 391);
        const status:String = data.data.versions[0].status
        var darkTheme = false;

        canvas
            .save()
            .createBeveledClip(10, 10, 720, 371, 8)
            .addImage(themeImageSRC, 9, 9, 188, 373)
			.restore()
            .addImage(darkTheme ? this.darkThemeTemplate! : this.lightThemeTemplate!, 0, 0, 740, 391)

            // Name title
			.setTextFont('35px RobotoRegular')
			.setColor(darkTheme ? '#F0F0F0' : '#171717')
			.addResponsiveText(data.data.name, 227, 73, 306)
			.setTextFont('25px RobotoLight')
            .addText(`Version: ${data.data.versions[0].version} - ${status.toUpperCase()}`, 227, 105)

            // Progress bar
			//.setColor('FF239D')
			//.addBeveledRect(227, 352, progressBar, 9, 3)

            // UPDATELOG
            .addText("Update log:", 20, 200)
            .setTextAlign('left')
            .setTextFont('15px RobotoLight')
            .addText(`${data.data.versions[0].changelog.plain}`, 20, 220, 700)
            
            // Statistics Titles
			//.addText("DOWNLOADS", 227, 276)
			//.addText("VIEWS", 227, 229)
            //.addText("RATING", 227, 181)
            
            // Statistics Values
			//.setTextAlign('right')
			//.setTextFont('25px RobotoLight')
			//.addText(`${data.data.downloads}`, 594, 276)
			//.addText(`${data.data.views}`, 594, 229)
            //.addText(`${data.data.rating} | 5.0`, 594, 181)
            
            // Plugin icon
			.addImage(pluginIcon, 42, 42, 122, 122, { type: 'round', radius: 61 })
            

            const obj = {
                canvas: canvas,
                version: data.data.versions[0].version,
                name: data.data.name,
                download: data.data.versions[0].download
    
            }
            return obj;
    }


    public async init() {
		[
			this.lightThemeTemplate,
			this.darkThemeTemplate
		] = await Promise.all([
			new Canvas(740, 391)
				.setAntialiasing('subpixel') // antialising
				.setShadowColor('rgba(0, 0, 0, 0.7)') // shadow for text
				.setShadowBlur(7) // blur effect of shadow
				.setColor('#FFFFFF') // color of canvas
				.createBeveledPath(10, 10, 720, 371, 8)
				.fill()
				.createBeveledClip(10, 10, 720, 371, 5)
				//.clearPixels(10, 10, 186, 371)
				.addCircle(103, 103, 60.5) // Circle for plugin icon
				.resetShadows() // shadow
				.setColor(`#E8E8E8`)
				//.addBeveledRect(226, 351, 366, 11, 4)
				.toBufferAsync(),
			new Canvas(740, 391)
				.setAntialiasing('subpixel') // antialising
				.setShadowColor('rgba(0, 0, 0, 0.7)') // shadow for text
				.setShadowBlur(7) // blur effect of shadow
				.setColor('#202225') // color of canvas
				.createBeveledPath(10, 10, 720, 371, 8)
				.fill()
				.createBeveledClip(10, 10, 720, 371, 5)
				//.clearPixels(10, 10, 186, 371)
				.addCircle(103, 103, 60.5) // Circle for plugin icon
				.resetShadows() // shadow
				.setColor(`#2C2F33`)
				//.addBeveledRect(226, 351, 366, 11, 4)
				.toBufferAsync()
        ]);
    }

    public getPlugin(plugin: string): string {
		switch (plugin) {
			case '405': // SIMPLE BEACONS
                return "simplebeacons-plugin-that-controls-beacons";
            case 'simplebeacons':
                return "simplebeacons-plugin-that-controls-beacons";

            case 'simplecrops': // SIMPLE CROPS
                return 'simplecrops-simplecrops-make-custom-crops';
            case '117':
                return 'simplecrops-simplecrops-make-custom-crops';
                
            case 'holographicplaceholders': // HOLOGRAPHIC PLACEHOLDERS
                return 'holographicdisplays-extension-baltop-extension-for-holograms';

            case '142':
                return 'holographicdisplays-extension-baltop-extension-for-holograms';

			default:
				return plugin;
		}
	}
}
