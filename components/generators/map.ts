export interface CreateCallback { (x: number, y: number, contents: number): any };

export default abstract class Map {
	_width: number;
	_height: number;

	constructor(width = 100, height = 100) {
		this._width = width;
		this._height = height;
	};

	abstract create(callback?: CreateCallback): void;

	_fillMap(value: number) {
		let map: number[][] = [];
		for (let i=0;i<this._width;i++) {
			map.push([]);
			for (let j=0;j<this._height;j++) { map[i].push(value); }
		}
		return map;
	}
}