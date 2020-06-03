import { Command, CommandStore } from 'klasa';
import fetch from 'node-fetch';
import { Canvas } from 'canvas-constructor';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { TOKENS } from '../../../config';

const COLORS = {
	cloudy: '#7FCAF0',
	day: '#ffd280',
	night: '#4B4C43',
	rain: '#0459F6',
	snow: '#BEF7FE',
	thunderstorm: '#99446B',
	windy: '#BEF7FE',
	storm: '#0459F6',
	mist: '#BEF7FE',
	tornado: '#99446B'
};

// const { parseStringPromise } = require('xml2js');

import type { Message } from '@klasa/core';

export default class extends Command {

	public constructor(store: CommandStore, directory: string, files: string[]) {
		super(store, directory, files, {
			guarded: true,
			description: language => language.get('COMMAND_WEATHER_DESCRIPTION'),
			usage: '<city:string>'
		});
	}

	public async run(message: Message, [query]: [string]): Promise<Message[]> {
		const location = query;


		const data = await (await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${TOKENS.OPENWEATHERAPI}&units=metric`)).json();

		if (data.cod == 404) {
			return message.send(mb =>
				mb.setEmbed(em =>
					em
						.setColor(0x007bff)
						.addField('Error:', `No city with name: "${location}" could be found! ${data.cod}`, false))
			);
		}

		// console.log(data); //Outputs API to console  -- FOR DEBUGGING
		var theme = 'light';
		const fontColor = theme == 'dark' ? '#000' : '#fff';
		const state: string = data.weather[0].main;

		const [conditionBuffer, humidityBuffer, weather] = await Promise.all([
			fsp.readFile(join(__dirname, '..', '..', 'assets', 'images', 'weather', 'main', `${data.weather[0].icon}@2x.png`)),
			fsp.readFile(join(__dirname, '..', '..', 'assets', 'images', 'weather', theme, 'humidity.png')),
			fsp.readFile(join(__dirname, '..', '..', 'assets', 'images', 'weather', 'main', `03d@2x.png`))
		]);


		const canvas = new Canvas(400, 230)
			.save()
			.setShadowColor('rgba(0,0,0,.7)')
			.setShadowBlur(7)
			.setColor(COLORS[this.getTime(data.weather[0].main)])
			.createBeveledPath(10, 10, 380, 220, 5)
			.fill()
			.restore()
		// City Name
			.setTextFont('20px Roboto')
			.setColor(fontColor)
			.addWrappedText(`${data.name}|${data.sys.country}`, 30, 60, 300)

		// Prefecture Name
			.setTextFont('16px Roboto')
			.setColor(theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')
			.addText(state, 30, 30)

		// Temperature
			.setTextFont("48px Roboto'")
			.setColor(fontColor)
			.addText(`${data.main.temp}°C`, 30, 190)

		// Condition
			.setTextFont('16px Roboto')
			.setTextAlign('right')
			.addText(data.weather[0].description, 370, 192)

		// Titles
			.setTextFont("16px Roboto'")
			.addText(`${data.main.humidity}%`, 353, 150)
			.addText(`${data.clouds.all}%`, 353, 171)


		// Icons
			.addImage(conditionBuffer, 325, 31, 48, 48)
			.addImage(humidityBuffer, 358, 138, 13, 13)
				  .addImage(weather, 358, 158, 13, 13);

		return message.send(mb => // Embeded sporočilo
			mb.addFile(
				{
					name: 'Blabla.png',
					file: canvas.toBuffer()
				}
			)
		);
	}


	public getTime(icon: string): string {
		switch (icon) {
			case 'Thunderstorm':
				return 'storm';
			case 'Drizzle':
				return 'rain';
			case 'Rain':
				return 'rain';
			case 'Snow':
				return 'snow';
			case 'Mist':
				return 'mist';
			case 'Smoke':
				return 'mist';
			case 'Haze':
				return 'mist';
			case 'Fog':
				return 'mist';
			case 'Sand':
				return 'mist';
			case 'Dust':
				return 'mist';
			case 'Ash':
				return 'mist';
			case 'Squall':
				return 'mist';
			case 'Tornado':
				return 'tornado';

			default:
				return 'day';
		}
	}

}
