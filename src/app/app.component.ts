import { Component, OnChanges, OnInit, VERSION } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DATA } from './mock-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges, AfterViewInit {
  title = 'pagination';
  data!: any[];
  slicedNames: any[] = [];
  showSelect: boolean = false;

  selectArr: number[] = [];
  btnNosArr: number[] = [];
  rulesPerPage!: number;
  currentPage: number = 1;

  searchObservable!: Observable<any>;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    console.log(this.slicedNames);
    let x: any = DATA.split('\n');
    this.data = x;
    console.log(this.data);
    console.log(this.data.length);

    this.searchObservable = this.searchTerms.pipe(
      debounceTime(300),

      distinctUntilChanged(),
      switchMap((term: string) => {
        let fr: any = [];
        this.data.filter((v: any, i: any) => {
          if (v.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
            fr.push(v);
          }
        });
        return of(fr);
      })
    );
  }

  ngOnChanges() {}

  onValuesChange(val: any[]) {
    this.slicedNames = val;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  searchTerms = new Subject<string>();

  search(term: string) {
    this.searchTerms.next(term);
  }

  newRulesCB(val: any) {
    this.currentPage = val.currentPage;
    this.btnNosArr = val.btnNosArr;

    this.rulesPerPage = val.rulesPerPage;
    this.selectArr = val.newPageRangeArr;
    this.slicedNames = val.valuesArr;

    console.log('asasas', this.currentPage);
    console.log(val);
    console.log(this.rulesPerPage);
  }
}
