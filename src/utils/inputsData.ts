export const LOCAL_STORAGE_KEYS = {
	title: "draftTitle",
	content: "draftContent",
	level: "draftLevel",
	todoTitle: "draftTodoTitle",
	todoContent: "draftTodoContent",
	pokemonTitle: "draftTitle",
	searchQuery: "draftQuery",
	searchPokemon: "draftPokemonQuery",
	searchDrive: "draftSearchDrive",
	addFood: "draftAddFood",
	addPokemon: "draftAddPokemon",
	addDrive: "draftAddDrive",
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

export const clearTodoStorage = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.todoTitle);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.todoContent);
};

export const clearAddDrive = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addDrive);
};

export const clearAddPokemon = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addPokemon);
};

export const clearAddFood = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addFood);
};

export const clearSearch = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchQuery);
};

export const resetStorage = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEYS.title);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.content);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchQuery);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchPokemon);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addFood);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addPokemon);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.todoTitle);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.todoContent);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.searchDrive);
	localStorage.removeItem(LOCAL_STORAGE_KEYS.addDrive);
	localStorage.removeItem("sortBy");
	localStorage.removeItem("orderBy");
};
