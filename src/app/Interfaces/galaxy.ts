export interface Galaxy {
    id: string,
    name: string,
    size: number,
    shape: string,
    composition: string,
    distance_from_earth: number,
    universe: {
      id: string,
      name: string,
      size: number,
      composition: string
    }
}
