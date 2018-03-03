import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2'
import { Observable } from 'rxjs/Observable';
import {SuiDropdownModule, SuiSelectModule, SuiAccordionModule} from 'ng2-semantic-ui';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'firebase/storage'
import { Horse } from '../horse'
import { AngularFireAuth } from 'angularfire2/auth'
import 'rxjs/rx'
import {ActivatedRoute} from '@angular/router';
import { auth } from 'firebase';
import { isNumber } from 'util';
//import { CookieService } from 'ngx-cookie';


class PriceFilter{
  constructor(min: number, max: number) {
    this.max = max;
    this.min = min;
  }
  max: number;
  min: number;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent {
  private itemsCollection: AngularFirestoreCollection<Horse>;
  items: Observable<Horse[]>;
  firebase:FirebaseApp;
  areaFilters$: BehaviorSubject<string[]|null>;
  horseTypeFilters$: BehaviorSubject<string[]|null>;
  priceFilters$: BehaviorSubject<PriceFilter[]|null>;
  gaitFilters$: BehaviorSubject<string[]|null>;
  fragment: string;
  collapse: boolean = true;
  searchable: boolean;
  isLoading: boolean;
  starredHorses: any;

  priceFilter: number[];

  public checkChange(t: boolean, horseType: string){
    var temp = this.horseTypeFilters$.value;
    if(t){
      if(temp == null){
        temp = [horseType];
      }else{
        temp.push(horseType);
      }
       }
    else{
     temp = temp.filter(x => x != horseType);
    }
    this.horseTypeFilters$.next(temp);
  }

  public checkRegionChange(t: boolean, region: string){
    var temp = this.areaFilters$.value;
    if(t){
      if(temp == null){
        temp = [region];
      }else{

        temp.push(region);
      }
       }
    else{
     temp = temp.filter(x => x != region);
    }
    this.areaFilters$.next(temp);
  }


  public checkPriceChange(t: boolean, min: number, max:number){
    var temp = this.priceFilters$.value;
    if(t){
      if(temp == null){
        temp = [new PriceFilter(min,max)];
      }else{
        temp.push(new PriceFilter(min, max));
      }
        
       }
    else{
     temp = temp.filter(x => x.max != max && x.min != min);
    }
    this.priceFilters$.next(temp);
  }

  // public setStarHorse(h: Horse){
  //   if(!h.isStarred){
  //     this.cookieService.put(h.id, h.id);
  //     h.isStarred = true;
  //   }
  //   else{
  //     this.cookieService.remove(h.id);
  //     h.isStarred = false;
  //   }
  // }

  areaOptions: string[] = ["København", "Sjælland", "Sønderjylland", "Fyn", "Nordjylland"];
  areaSelected: string[] = [];

  horseTypeOptions: string[] = ["Hingst", "Vallak", "Føl", "Unghest"];
  horseTypeSelected: string[] = [];

  gaitOptions: string[] = ["4-gænger", "4½-gænger", "5-gænger"];
  gaitSelected: string[] = [];

  priceOptions: string[] = ["Alle", "0 - 20.000", "20.000 - 40.000", "40.000 - 80.000", "80.000+"];
  priceSelected: string[] = [];

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore, firebaseApp: FirebaseApp, public route:  ActivatedRoute) {
    this.areaFilters$ = new BehaviorSubject(null);
    this.horseTypeFilters$ = new BehaviorSubject(null);
    this.priceFilters$ = new BehaviorSubject(null);
    this.gaitFilters$ = new BehaviorSubject(null);

    this.isLoading = true;
    //this.starredHorses = cookieService.getAll();

    this.items = afs.collection<Horse>('horses', ref => ref.orderBy('lastUpdated', "desc")).valueChanges().combineLatest(
        this.gaitFilters$,
        (horses: Horse[], gaitFilters: string[]) => {
          if(gaitFilters && gaitFilters.length > 0){
            return horses.filter(h => gaitFilters.includes(h.gaitType));
          }  
          return horses;
        });
    
      this.items = this.items.combineLatest(
        this.horseTypeFilters$,
        (horses: Horse[], horseTypeFilters: string[]) => {
          if(horseTypeFilters && horseTypeFilters.length > 0){
            return horses.filter(h => horseTypeFilters.includes(h.genderType));
          }  
          return horses;
        });

        this.items = this.items.combineLatest(
          this.areaFilters$,
          (horses: Horse[], areaFilters: string[]) => {
            if(areaFilters && areaFilters.length > 0){
              return horses.filter(h => areaFilters.includes(h.area));
            }  
            return horses;
          });
  

        this.items = this.items.combineLatest(
          this.priceFilters$,
          (horses: Horse[], priceFilters: PriceFilter[]) => {
            if(priceFilters && priceFilters.length > 0){
              var temp = [];
              horses.forEach(h => {
                priceFilters.forEach(p => {
                    
                    if(h.price > p.min && h.price < p.max){
                      temp.push(h);
                    }
                });
              });
              return temp;
            }  
            return horses;
          });
      
    this.items.subscribe(x => {this.isLoading = false;
      if(this.starredHorses != null)
      this.starredHorses.forEach(y =>{
        x.filter(i => i.id == y)[0].isStarred = true;
      });
    })

    this.afs = afs;
  }

  gaitChange(selectedGaits: string[]){
      this.gaitFilters$.next(selectedGaits);
  }

  areaChange(selectedAreas: string[]){
      this.areaFilters$.next(selectedAreas);
  }

  horseTypeChange(selectedHorseTypes: string[]){
    this.horseTypeFilters$.next(selectedHorseTypes);
  }

  scollToSearch(){
    document.getElementById("search").scrollIntoView({behavior: "smooth"});
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) { }
  }

  logout(){
    this.auth.auth.signOut();
  }

}
