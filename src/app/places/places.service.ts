import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1', 'Sydney Mansion', 'In the heart of the city', 'https://i.ytimg.com/vi/d4IXyYHMew4/hqdefault.jpg', 100),
    new Place('p2', 'Melbourne Mansion', 'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg', 200),
    new Place('p3', 'Brisbane Mansion', 'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg', 200),
    new Place('p4', 'Adelaide Mansion', 'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg', 200),
    new Place('p5', 'Perth Mansion', 'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg', 200),
    new Place('p6', 'Darwin Mansion', 'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg', 200)
  ] ;

  get places(){
    return [...this._places];
  }

  getPlace(id: string){
    return this._places.find(p => p.id === id);
  }
  constructor() { }
}
