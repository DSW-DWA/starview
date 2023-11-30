export interface Constellation {
    id: string,
    name: string,
    shape: string,
    abbreviation: string,
    history: string,
    galaxy: {
      id: string,
      name: string
    }
}
