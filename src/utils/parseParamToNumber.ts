export default function parseParamToNumber(param: string | string[] | undefined | null): number {
	return typeof param === 'string' && !Number.isNaN(Number.parseInt(param))
		? Number.parseInt(param)
		: -1;
}
