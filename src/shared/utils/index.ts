// export { default as jwt } from "./jwt";
export { default as hashing } from "./hashing";
export * from "./enum";

function buildName(text: (string | null | undefined)[]): string {
	let t = text?.filter((e) => e !== undefined);
	return text?.join(" ");
}

function joinWithSpace(
	text: string | null | undefined,
	...texts: (string | null | undefined)[]
) {
	let t = [text, ...texts]?.filter((e) => e !== undefined);
	return t?.join(" ");
}

function concatenate(
	joinChar: string = "",
	...texts: (string | number | null | undefined)[]
) {
	let t = [...texts]?.filter((e) => e !== undefined);
	return t?.join(joinChar);
}

const utils = { buildName, joinWithSpace, concatenate };

export default utils;
