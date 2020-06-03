import { Language, LanguageStore, LanguageValue } from 'klasa';

export default class extends Language {

	public language: Record<string, LanguageValue> & { DEFAULT: (term: string) => string };

	public constructor(store: LanguageStore, directory: string, file: string[]) {
		super(store, directory, file);
		this.language = {
			DEFAULT: (key): string => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion

			COMMAND_BLABLA: 'ya',
			COMMAND_WEATHER_DESCRIPTION: 'Get weather of specific city.'
		};
	}

	public async init(): Promise<void> {
		await super.init();
	}

}
