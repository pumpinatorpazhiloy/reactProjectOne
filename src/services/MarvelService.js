class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=a7864a4171d61771951e77711ae62481';
	_baseOffset = 210;

	getResourse = async (url) => {
		let res = await fetch(url);

		if(!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`)
		}

		return await res.json();
	}

	getAllCharacters = async (offset = this._baseOffset) => {
		const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
		);
		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`
		);
		return this._transformCharacter(res.data.results[0]);
	}

	_transformCharacter = (char) => {
		if(char.description.length > 220) {
			char.description = char.description.slice(0, 220) + '...'
		}

		// description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
		
		const imgPath = char.thumbnail.path;
		const imgExtension = char.thumbnail.extension;
		
		return {
			id: char.id,
			name: char.name,
			description: char.description || 'No data found',
			thumbnail: `${imgPath}.${imgExtension}`,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}
}

export default MarvelService;