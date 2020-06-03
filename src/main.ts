import { KlasaClient } from 'klasa';
import * as CONFIG from '../config';
import { Canvas } from 'canvas-constructor';
import { join } from 'path';
Canvas
	.registerFont(join(__dirname, 'assets', 'fonts', 'Roboto-Regular.ttf'), 'RobotoRegular')
	.registerFont(join(__dirname, 'assets', 'fonts', 'NotoEmoji.ttf'), 'RobotoRegular')
	.registerFont(join(__dirname, 'assets', 'fonts', 'NotoSans-Regular.ttf'), 'RobotoRegular')
	.registerFont(join(__dirname, 'assets', 'fonts', 'Roboto-Light.ttf'), 'RobotoLight')
	.registerFont(join(__dirname, 'assets', 'fonts', 'Family-Friends.ttf'), 'FamilyFriends');

const clasa = new KlasaClient({
	commands: {
		prefix: CONFIG.PREFIX
	},
	providers: {
		default: 'json'
	}
});

clasa.token = CONFIG.TOKENS.BOT_TOKEN;
clasa.connect();
