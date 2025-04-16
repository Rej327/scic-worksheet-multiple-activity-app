export const LOCAL_STORAGE_KEYS = {
	title: "draftTitle",
	content: "draftContent",
	pokemonTitle: "draftTitle",
	searchQuery: "draftQuery",
	searchPokemon: "draftPokemonQuery",
};

export const loadFromStorage = (key: string, fallback: string = "") => {
	if (typeof window === "undefined") return fallback;
	return localStorage.getItem(key) || fallback;
};

export const saveToStorage = (key: string, value: string) => {
	if (typeof window !== "undefined") {
		localStorage.setItem(key, value);
	}
};

export const clearStorage = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.title);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.content);
};

export const clearPokemonQuery = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchPokemon);
};

export const clearSearch = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchQuery);
};

export const resetStorage = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.title);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.content);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchQuery);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchPokemon);
};
