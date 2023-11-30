export interface Planet {
    id: string,
    name: string,
    mass: number,
    diameter: number,
    distance_from_star: number,
    surface_temperature: number,
    star: {
      id: string,
      name: string
    }
}
