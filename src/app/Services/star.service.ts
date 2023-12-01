import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constellation } from '../Interfaces/constellation';
import { Universe } from '../Interfaces/universe';
import { Planet } from '../Interfaces/planet';
import { Galaxy } from '../Interfaces/galaxy';
import { Star } from '../Interfaces/star';
import { Reports } from '../Interfaces/reports';
import { Audit } from '../Interfaces/audit';

@Injectable({
  providedIn: 'root'
})
export class StarService {
  url='http://localhost:8000/api/';
  constructor(private http: HttpClient){}

  getAllConstellations() {
    return this.http.get<Constellation[]>(this.url + 'constellations?limit=100&offset=0');
  }

  deleteConstellation(id: string) {
    return this.http.delete(this.url + 'constellations/' + id);
  }

  updateConstellation(id: string, constellation: Constellation) {
    let data = {
      galaxy_id: constellation.galaxy.id,
      name: constellation.name,
      shape: constellation.shape,
      abbreviation: constellation.abbreviation,
      history: constellation.history
    }
    return this.http.put<Constellation>(this.url + 'constellations/' + id, data);
  }

  addConstellation(constellation: Constellation) {
    let data = {
      galaxy_id: constellation.galaxy.id,
      name: constellation.name,
      shape: constellation.shape,
      abbreviation: constellation.abbreviation,
      history: constellation.history
    }
    return this.http.post<Constellation>(this.url + 'constellations', data);
  }
  getAllUniverse() {
    return this.http.get<Universe[]>(this.url + 'universes?limit=100&offset=0');
  }

  deleteUniverse(id: string) {
    return this.http.delete(this.url + 'universes/' + id);
  }

  updateUniverse(id: string, universe: Universe) {
    let data = {
      name: universe.name,
      size: universe.size,
      composition: universe.composition
    };
    return this.http.put<Universe>(this.url + 'universes/' + id, data);
  }

  addUniverse(universe: Universe) {
    let data = {
      name: universe.name,
      size: universe.size,
      composition: universe.composition
    };
    return this.http.post<Universe>(this.url + 'universes', data);
  }
  getAllPlanets() { 
    return this.http.get<Planet[]>(this.url + 'planets?limit=100&offset=0');
  }
  deletePlanet(id: string) {
    return this.http.delete(this.url + 'planets/' + id);
  }
  updatePlanet(id: string, planet: Planet) {
    let data = {
      name: planet.name,
      mass: planet.mass,
      diameter: planet.diameter,
      distance_from_star: planet.distance_from_star,
      surface_temperature: planet.surface_temperature,
      star_id: planet.star.id
    };
    return this.http.put<Planet>(this.url + 'planets/' + id, data);
  }
  addPlanet(planet: Planet) {
    let data = {
      name: planet.name,
      mass: planet.mass,
      diameter: planet.diameter,
      distance_from_star: planet.distance_from_star,
      surface_temperature: planet.surface_temperature,
      star_id: planet.star.id
    };
    return this.http.post<Planet>(this.url + 'planets', data);
  }
  getAllGalaxies() {
    return this.http.get<Galaxy[]>(this.url + 'galaxies?limit=100&offset=0');
  }

  deleteGalaxy(id: string) {
    return this.http.delete(this.url + 'galaxies/' + id);
  }

  updateGalaxy(id: string, galaxy: Galaxy) {
    let data = {
      name: galaxy.name,
      size: galaxy.size,
      shape: galaxy.shape,
      composition: galaxy.composition,
      distance_from_earth: galaxy.distance_from_earth,
      universe_id: galaxy.universe.id
    };
    return this.http.put<Galaxy>(this.url + 'galaxies/' + id, data);
  }
  addGalaxy(galaxy: Galaxy) {
    let data = {
      name: galaxy.name,
      size: galaxy.size,
      shape: galaxy.shape,
      composition: galaxy.composition,
      distance_from_earth: galaxy.distance_from_earth,
      universe_id: galaxy.universe.id
    };
    return this.http.post<Galaxy>(this.url + 'galaxies', data);
  }
  getAllStars() {
    return this.http.get<Star[]>(this.url + 'stars?limit=100&offset=0');
  }
  deleteStar(id: string) {
    return this.http.delete(this.url + 'stars/' + id);
  }
  updateStar(id: string, star: Star) {
    let data = {
      name: star.name,
      spectral_type: star.spectral_type,
      luminosity: star.luminosity,
      distance_from_earth: star.distance_from_earth,
      temperature: star.temperature,
      galaxy_id: star.galaxy.id
    };
    return this.http.put<Star>(this.url + 'stars/' + id, data);
  }
  addStar(star: Star) {
    let data = {
      name: star.name,
      spectral_type: star.spectral_type,
      luminosity: star.luminosity,
      distance_from_earth: star.distance_from_earth,
      temperature: star.temperature,
      galaxy_id: star.galaxy.id
    };
    return this.http.post<Star>(this.url + 'stars', data);
  }

  getExcelReport(uid: string) {
    return this.http.get<Reports>(this.url + "reports/excel?universe_id=" + uid, {})
  }
  getWordReport(uid: string) {
    return this.http.get<Reports>(this.url + "reports/word?universe_id=" + uid, {})
  }

  getAllAudits() {
    return this.http.get<Audit[]>(this.url + "audit?limit=100&offset=0")
  }
}
