import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  private _places = new BehaviorSubject<Place[]> ([
    new Place('p1', 'Sydney Mansion',
    'In the heart of the city', 'https://i.ytimg.com/vi/d4IXyYHMew4/hqdefault.jpg',
    100,
    new Date('2019-01-01'),
    new Date('2019-12-31'),
    'abc'),
    new Place('p2', 'Melbourne Mansion',
    'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg',
    200,
    new Date('2019-01-01'),
    new Date('2019-12-31'),
    'def'),
    new Place('p3', 'Brisbane Mansion',
    'In the heart of the town', 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg',
    200,
    new Date('2019-01-01'),
    new Date('2019-12-31'),
    'gef')
  ]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id) };
    }));
    //return this._places.find(p => p.id === id);
  }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData }>('https://myionic-363fb.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(new Place (
                                  key,
                                  resData[key].title,
                                  resData[key].description,
                                  resData[key].imageUrl,
                                  resData[key].price,
                                  new Date(resData[key].availableFrom),
                                  new Date(resData[key].availableTo),
                                  resData[key].userId))
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place (
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(`https://myionic-363fb.firebaseio.com/offered-places/${placeId}.json`,
        {
          ...updatedPlaces[updatedPlaceIndex], id: null
        });
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
      );
  }

  addPlace(
          title: string,
          description: string,
          price: number,
          dateFrom: Date,
          dateTo: Date  ) {
            let genId: string;
            const newPlace = new Place(Math.random().toString(), title,
                  description, 'https://i.ytimg.com/vi/3_RqeIYi7dQ/hqdefault.jpg',
                  price, dateFrom, dateTo, this.authService.userId);

            return this.http.post<{name: string}>('https://myionic-363fb.firebaseio.com/offered-places.json', {...newPlace, id: null})
            .pipe(switchMap(resData => {
              genId = resData.name;
              return this.places;
            }),
            take(1),
            tap(places => {
              newPlace.id = genId;
              this._places.next(places.concat(newPlace));
            }));
            //.subscribe(resData => {
            //  console.log(resData.name);
            //});

            //this.places.pipe(take(1)).subscribe(places => {
            //    this._places.next(places.concat(newPlace));
            //  });
  }


  
}
