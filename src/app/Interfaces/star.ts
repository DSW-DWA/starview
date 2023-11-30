export interface Star {
    id: string,
    name: string,
    spectral_type: string,
    luminosity: number,
    distance_from_earth: number,
    temperature: number,
    galaxy: {
      id: string,
      name: string
    }
}
