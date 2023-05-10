import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Subject, Subscription } from 'rxjs';
import { Data } from 'src/data';
import { Address } from '../model/address';
import { CardParams } from '../model/cardParams';
import { CircleNoteParams } from '../model/circle-notes-params';
import { Horaires } from '../model/horaires';
import { Ligne } from '../model/ligne';
import { Pictures } from '../model/pictures';
import { Bar } from '../model/bar';
import { TypePicture } from '../model/typePicture';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';
import { Station } from '../model/station';
import { desktopParams, mobileParams } from '../shared/circleNoteParams';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bars-page',
  templateUrl: './bars-page.component.html',
  styleUrls: ['./bars-page.component.scss']
})
export class BarsPageComponent implements OnInit {
  
  filterSubscriber: Subscription = new Subscription();
  constructor(private data: DatabaseService,
    private placeService: PlacesService, private router: Router) {
      this.filterSubscriber = placeService.setFilterToSave().subscribe((id: string) => {
        this.clearSessionStorageData = false;
        let allTypeSelected: string[] = [];
        let allLigneSelected: string[] = [];
        let allArrondissementSelected: string[] = [];
        let opened: string[] = [];
        let tested: string[] = [];
        let findAll = this.allType.options.find((element: MatOption) => element.value === 0 && element.selected );
        if(findAll == null){
          this.allType.options.forEach((element: MatOption) => {
            if(element.selected)  allTypeSelected.push(element.value);
          });
        } else{
          allTypeSelected.push("0");
        }

        findAll = this.allLigne.options.find((element: MatOption) => element.value === 0 && element.selected );
        if(findAll == null){
          this.allLigne.options.forEach((element: MatOption) => {
            if(element.selected)  allLigneSelected.push(element.value.name);
          });
        } else{
          allLigneSelected.push("0");
        }

        findAll = this.allArrondissement.options.find((element: MatOption) => element.value === 0 && element.selected );
        if(findAll == null){
          this.allArrondissement.options.forEach((element: MatOption) => {
            if(element.selected)  allArrondissementSelected.push(element.value);
          });
        } else{
          allArrondissementSelected.push("0");
        }

        this.opened.options.forEach((element: MatOption) => {
          if(element.selected)  opened.push(element.value);
        });
        this.tested.options.forEach((element: MatOption) => {
          if(element.selected)  tested.push(element.value);
        });
        sessionStorage.setItem("page","Bar");
        sessionStorage.setItem("scrollPosition", JSON.stringify(window.pageYOffset));
        sessionStorage.setItem("orderNote",JSON.stringify(this.orderNote));
        sessionStorage.setItem("orderAlphabetical",JSON.stringify(this.orderAlphabetical));
        sessionStorage.setItem("typeFilter",JSON.stringify(allTypeSelected));
        sessionStorage.setItem("arrondissementFilter",JSON.stringify(allArrondissementSelected));
        sessionStorage.setItem("ligneFilter",JSON.stringify(allLigneSelected));
        sessionStorage.setItem("openedFilter",JSON.stringify(opened));
        sessionStorage.setItem("testedFilter",JSON.stringify(tested));
        router.navigate(['/showed',id]);
      });
    }
  cardParams: CardParams[] = [];
  circleNoteParams: CircleNoteParams
  allPictures: Pictures[] = [];
  randomPosition: any[] = [];

  types:string[] = [];
  typesSelect:string[] = [];
  arrondissements: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  lignes: Ligne[] = [];
  selectAll: boolean = false;
  station: string = "Aucun";
  openedOptions: string[] = ["Ouvert","Fermé"];
  testedOptions: string[] = ["Oui","Non"];
  nothing: boolean = false;
  getData: boolean = false;


  initFilters: boolean = false;
  orderNote: boolean = false;
  orderAlphabetical: boolean = true;
  clearSessionStorageData: boolean = true;
  @ViewChild('allType') allType: MatSelect | undefined;
  @ViewChild('allLigne') allLigne: MatSelect | undefined;
  @ViewChild('allArrondissement') allArrondissement: MatSelect | undefined;
  @ViewChild('opened') opened: MatSelect | undefined;
  @ViewChild('tested') tested: MatSelect | undefined;



  ngOnInit(): void {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(windowHeight > windowWidth){
      this.circleNoteParams = mobileParams;
    } else{
      this.circleNoteParams = desktopParams;
    }
    this.cardParams = [];
    this.types = [];
    let countData: number = 0;
    Data.forEach((type: TypePicture) => {
      if(type.place === "Bar")  this.types.push(type.type);
    });
    this.data.getAllBars().subscribe((bars: Bar[]) => {
      countData++;
      if(countData === 3){
        setTimeout(() => {
          if(sessionStorage.getItem("page") != null && sessionStorage.getItem("page") === "Bar")  this.setFilters();
          else  this.sort(false);
        }, 2000);
      }
    });
    this.data.getAllPictures().subscribe((pictures: Pictures[]) => {
      this.allPictures = pictures;
      countData++;
      if(countData === 3){
        setTimeout(() => {
          if(sessionStorage.getItem("page") != null && sessionStorage.getItem("page") === "Bar")  this.setFilters();
          else  this.sort(false);
        }, 2000);
      }
      this.setRandomPosition();
    });
    this.data.getAllLignes().subscribe((lignes: Ligne[]) => {
      this.lignes = lignes;
      this.lignes.sort((a,b) => {
        if(a.name > b.name) return 1;
        else return -1;
      });
      countData++;
      if(countData === 3){
        setTimeout(() => {
          if(sessionStorage.getItem("page") != null && sessionStorage.getItem("page") === "Bar")  this.setFilters();
          else  this.sort(false);
        }, 2000);
      }
    });
    this.typesSelect = [];
  }

  ngOnDestroy(): void {
    this.filterSubscriber.unsubscribe();
    if(this.clearSessionStorageData){
      sessionStorage.clear();
    }
  }

  setFilters(){
    const typeFilter: string = sessionStorage.getItem("typeFilter");
    const arrondissementFilter: string = sessionStorage.getItem("arrondissementFilter");
    const ligneFilter: string = sessionStorage.getItem("ligneFilter");
    const openedFilter: string = sessionStorage.getItem("openedFilter");
    const testedFilter: string = sessionStorage.getItem("testedFilter");

    if(typeFilter != null){
      const filterValues = JSON.parse(typeFilter);
      this.allType.options.forEach((option: MatOption) => {
        const find: string[] = filterValues.find((element: MatOption) =>  element === option.value);
        if(find != null){
          option.select();
        }
      });
    }
    if(arrondissementFilter != null){
      const filterValues = JSON.parse(arrondissementFilter);
      this.allArrondissement.options.forEach((option: MatOption) => {
        const find: string[] = filterValues.find((element: MatOption) =>  element === option.value);
        if(find != null)  option.select();
      });
    }
    if(ligneFilter != null){
      const filterValues = JSON.parse(ligneFilter);
      this.allLigne.options.forEach((option: MatOption) => {
        const find: string[] = filterValues.find((element: MatOption) =>  element === option.value);
        if(find != null)  option.select();
      });
    }
    if(openedFilter != null){
      const filterValues = JSON.parse(openedFilter);
      this.opened.options.forEach((option: MatOption) => {
        const find: string[] = filterValues.find((element: MatOption) =>  element === option.value);
        if(find != null)  option.select();
      });
    }
    if(testedFilter != null){
      const filterValues = JSON.parse(testedFilter);
      this.tested.options.forEach((option: MatOption) => {
        const find: string[] = filterValues.find((element: MatOption) =>  element === option.value);
        if(find != null)  option.select();
      });
    }

    this.sort(false);
  }

  setRandomPosition(){
    this.allPictures.forEach((element:any) => {
      this.randomPosition.push(Math.floor(Math.random() * 100));
    });
  }

  toggleAllType() {
    if(this.allType != null){
      if (!this.selectAll) {
        this.allType.options.forEach(element => element.select());
      } else {
        this.allType.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllLigne() {
    if(this.allLigne != null){
      if (!this.selectAll) {
        this.allLigne.options.forEach(element => element.select());
      } else {
        this.allLigne.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  toggleAllArrondissement() {
    if(this.allArrondissement != null){
      if (!this.selectAll) {
        this.allArrondissement.options.forEach(element => element.select());
      } else {
        this.allArrondissement.options.forEach(element => element.deselect());
      }
    }
    this.selectAll = !this.selectAll;
  }

  setCardParams(data: any[]){
    if(data.length === 0)  this.nothing = true;
    else{
      this.nothing = false;

      this.cardParams = [];
      let triggerSort: Subject<boolean> = new Subject();
      data.forEach((place: Bar,index: number) => {
        let params: CardParams = {
          pictures: [],
          circleNoteParams: this.circleNoteParams,
          stationsInPlace: [],
          lignesInStation: [],
          addresses: [],
          horaires: [],
          data: place
        }
        this.data.getAllInfosOfPlace(place.id).subscribe((res: any) => {
          params.pictures = res.pictures;
          params.stationsInPlace = res.stationsInPlace;
          params.lignesInStation = res.lignesInStation;
          params.horaires = res.horaires;
          params.addresses = res.addresses;
          this.cardParams.push(params);
          if(index === data.length -1){
            triggerSort.next(true);
          }
        });
      });

      triggerSort.subscribe(() => {
        const noteSorter: string = sessionStorage.getItem("orderNote");
        const alphabeticalSorter: string = sessionStorage.getItem("orderAlphabetical");  
        if(noteSorter != null){
          const filterValues = JSON.parse(noteSorter);
          if(filterValues)  this.cardParams.sort(this.compareNote);
        }
        if(alphabeticalSorter != null){
          const filterValues = JSON.parse(alphabeticalSorter);
          if(filterValues)  this.cardParams.sort(this.compareOrder);
        }
        this.nothing = false;
        this.getData = true;
      });
    }
    
    
  }

  scroll(){
    if(!this.initFilters){
      const scroll: number = JSON.parse(sessionStorage.getItem("scrollPosition"));
      this.initFilters = true;
      setTimeout(() => {
        window.scrollBy({
          left: 0,
          top: scroll,
          behavior: 'smooth'
        });
      },0);
    }
  }

  sort(event: boolean){
    if(!event){
      this.cardParams = [];
      let arr: any[] = [];
      let types: any[] = [];
      let lignes: Ligne[] = [];
      let op: any[] = [];
      let test: any[] = [];

      this.allLigne?.options.forEach(element => {
        if(element.value !== "0" && element.selected){
          lignes.push(element.value);
        }
      })
      this.allArrondissement?.options.forEach(element => {
        if(element.value !== "0" && element.selected){
          arr.push(element.value);
        }
      });

      this.allType?.options.forEach(element => {
        if(element.value !== "0" && element.selected){
          types.push(element.value);
        }
      });

      this.opened?.options.forEach(element => {
        if(element.value !== "0" && element.selected){
          op.push(element.value);
        }
      });

      this.tested?.options.forEach(element => {
        if(element.value !== "0" && element.selected){
          test.push(element.value);
        }
      });
      if(op.length == 0)  op = ["Ouvert","Fermé"];
      if(test.length === 0) test = ["Oui","Non"];
      if(arr.length === 0)  arr = this.arrondissements;
      if(types.length === 0) types = this.types;
      if(lignes.length === 0){
        this.allLigne?.options.forEach(element => {
          if(element.value !== "0"){
            lignes.push(element.value);
          }
        })
      }

      let allBars: Bar[] = [];
      let getAllBarsFiltered: Subject<Bar[]> = new Subject();
      let getAllBarsByLigne: Subject<Bar[]> = new Subject();
      let getAllBarsBeforeHoraires: Subject<Bar[]> = new Subject();
      lignes.forEach((ligne: Ligne,index: number) => {
        this.data.getBarsByLigne(ligne.name,null).subscribe((bars: Bar[]) => {
          allBars.push(...bars);
          if(index === lignes.length -1){
            allBars = this.placeService.removeDuplicate(allBars);
            getAllBarsByLigne.next(allBars);
          }
        });
      });

      getAllBarsByLigne.subscribe((bars: Bar[]) => {
        let filteredByTypeAndArrbar: Bar[] = [];
        bars.forEach((bar:Bar, index: number) => {
          let pushArr = false;
          let pushType = false;
          if(arr.length === 0)  pushArr = true;
          if(types.length === 0)  pushType = true;
          arr.forEach(a => {
            if(bar.arrondissement === a)  pushArr = true;
          });
          types.forEach(t => {
            if(bar.type === t)  pushType = true;
          });
          if(pushArr && pushType) filteredByTypeAndArrbar.push(bar);
          if(index === allBars.length -1){
            getAllBarsBeforeHoraires.next(filteredByTypeAndArrbar);
          }
        });
      });

      getAllBarsBeforeHoraires.subscribe((bars: Bar[]) => {
        let filteredBar: Bar[] = [];
        bars.forEach((bar: Bar, index: number) => {
          let pushOp: boolean = false;
          let pushTest: boolean = false;
          this.data.getHorairesOfPlace(bar.id).subscribe((horaires: Horaires[]) => {
            op.forEach(o => {
              let bool = true;
              if(o === "Fermé") bool = false;
              const isOpened: boolean = this.placeService.isOpened(horaires);
              if(isOpened === bool) pushOp = true;
            });
            test.forEach(t => {
              let bool = true;
              if(t === "Non") bool = false;
              if(bar.tested === bool) pushTest = true;
            });
            if(pushOp && pushTest) filteredBar.push(bar);
            if(index === bars.length -1){
              filteredBar = this.placeService.removeDuplicate(filteredBar);
              getAllBarsFiltered.next(filteredBar);
            }
          });
        });
      });

      getAllBarsFiltered.subscribe((bars: Bar[]) => {
        if(bars.length === 0)  this.nothing = true;
        else  this.nothing = false;
        this.setCardParams(bars);
      });
    } 
  }

  sortByOrder(){
    this.cardParams.sort(this.compareOrder);
  }

  sortByNote(){
    this.cardParams.sort(this.compareNote);
  }

  compareNote(a: CardParams,b: CardParams){
    let comparison = 0;
    if(a.data.note_globale > b.data.note_globale) comparison = -1;
    else  comparison = 1;

    return comparison;
  }

  compareOrder(a: CardParams,b: CardParams){
    let comparison = 0;
    if(a.data.name.toUpperCase() > b.data.name.toUpperCase()) comparison = 1;
    else  comparison = -1;

    return comparison;
  }

  changeToolTip(ligne: any,bar: any){
    if(bar.lignes.get(ligne) != undefined)  this.station = bar.lignes.get(ligne)!;
    else this.station = "Aucun";
  }

}
