import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { last } from 'rxjs/operators';

@Directive({
  selector: '[appPagination]',
  exportAs: 'appPagination',
})
export class PaginationDirective implements OnInit {
  constructor() {}

  // a temporary array to hold values, since it will change because of slicing for pagination
  values: any = [];

  //*can change the values of values per page
  rulesPerPage: number = 5;

  // if array is empty load the Ogrules
  searchTermsArray: string[] = [];

  // to iterate and show a moving list of numbers in pagination
  numbers: number[] = [];

  // permanet array to hold numbers, since numbers will change (because of search results)
  ogNumbers: number[] = [];

  //* can change the value of no of btns to show.
  OgNoBtns: number = 5;

  //to change no-btns to show, beacause of search results.
  noBtns: number = this.OgNoBtns;

  // to show dialog
  showDialog: boolean = false;

  // to set a range for <select> html
  selectArr: number[] = [];

  searchResults: any = [];

  searchInput!: string;

  lastStartIndex: number = 0;

  // to store the last page number before the search results
  lastSearchPage!: number;

  //local vairable, not binded
  currentPage: number = 1;

  totalPages!: number;

  lastSearchStartIndex!: number;

  // a permanent array to hold values, since the values[] array will change when we use splice for pagination.
  @Input() OgValues!: any;
  @Input() searchTerms!: Observable<any>;
  @Input() searchObservable!: Observable<any>;
  @Output() newRules = new EventEmitter();

  ngOnInit() {
    this.initOgValues(this.OgValues);

    this.searchTerms.subscribe((term) => {
      if (term && this.searchTermsArray.length == 0) {
        this.lastSearchPage = this.currentPage;
        this.lastSearchStartIndex = this.lastStartIndex;
      }
      if (term == '') {
        this.searchTermsArray = [];
      } else {
        this.searchTermsArray[0] = term;
      }
    });

    this.searchObservable.subscribe((res) => {
      this.currentPage = 1;
      this.searchResults = res;

      if (this.searchTermsArray.length == 0) {
        this.currentPage = this.lastSearchPage;
        this.lastStartIndex = this.lastSearchStartIndex;
        this.searchResults = this.OgValues;

        //order-1
        this.setTotalPages(this.searchResults);

        //order-2
        this.setNoBtns(this.totalPages, this.currentPage);
      } else {
        const x = this.searchTermsArray;
        if ([...x[0]].length === 1) {
          this.lastStartIndex = 0;
        }

        //order-1
        this.setTotalPages(this.searchResults);

        //order-2
        this.setNoBtns(this.totalPages, 1);
      }

      //order-3
      this.sliceValues(this.searchResults);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes in', changes);
  }

  setPage(val: number) {
    this.currentPage = val;
    this.onPageChange(this.currentPage);
  }

  first() {
    this.setPage(1);
  }

  prev() {
    this.setPage(Math.max(1, this.currentPage - 1));
  }

  next() {
    this.setPage(Math.min(this.totalPages, this.currentPage + 1));
  }

  last() {
    this.setPage(this.totalPages);
  }

  OnClick(val: number, event: any) {
    this.setPage(val);
  }

  // -x-x-x-x

  // To set a range for <select> in html
  setSelectArr() {
    const defRulesPerPage = [5, 10, 25, 50, 100, 250, 500];
    this.selectArr = [];

    let x = this.OgValues.length - this.lastStartIndex;

    // let last = this.currentPage * this.rulesPerPage;

    for (let i = 0; i < defRulesPerPage.length; i++) {
      if (defRulesPerPage[i] >= x) {
        this.selectArr.push(defRulesPerPage[i]);
        break;
      } else {
        this.selectArr.push(defRulesPerPage[i]);
      }
    }

    this.newRules.emit({
      values: this.values,
      selectArr: this.selectArr,
      numbers: this.numbers,
      rulesPerPage: this.rulesPerPage,
      currentPage: this.currentPage,
    });
  }

  // To set pagination values for getValues/add values/update-values
  initOgValues(val: any[]) {
    //order-1
    this.setTotalPages(val);

    this.ogNumbers = Array(this.totalPages)
      .fill(0)
      .map((v, i) => i + 1);

    //order-2
    this.setNoBtns(this.totalPages, this.currentPage);

    //order-3
    this.sliceValues(val);
  }

  // To set number of total pages according to no. of values
  setTotalPages(val: any[]) {
    this.totalPages = Math.ceil(val.length / this.rulesPerPage);
  }

  // To set no.of btns, b/w a range of min and max(fix value)
  setNoBtns(totalPages: number, currentPage: number) {
    this.noBtns = Math.min(totalPages, this.OgNoBtns);

    this.numbers = this.ogNumbers.slice(
      Math.min(
        currentPage - 1 > 2 ? currentPage - 3 : 0,
        totalPages - this.noBtns
      ),
      Math.min(
        currentPage - 1 < 3 ? this.noBtns : currentPage - 1 + this.noBtns - 2,
        totalPages
      )
    );
  }

  // To set current page value from directive emit
  onPageChange(e: number) {
    // this.INDEX = false;
    this.currentPage = e;

    this.lastStartIndex = (this.currentPage - 1) * this.rulesPerPage;

    this.setNoBtns(this.totalPages, this.currentPage);

    if (this.searchTermsArray.length === 0) {
      this.sliceValues(this.OgValues);
    } else {
      this.sliceValues(this.searchResults);
    }
  }

  // To slice values according to page-no and no. of values per page
  sliceValues(val: any[]) {
    const lastIndex = this.lastStartIndex + this.rulesPerPage;

    this.values = val.slice(this.lastStartIndex, lastIndex);

    console.log('start index==', this.lastStartIndex);
    console.log('last index', lastIndex);

    this.setSelectArr();
  }

  onRulePerPageChange(e: any) {
    const val = Number(e.target.dataset.value);
    this.rulesPerPage = val;

    // --
    //* we will need to update the pageNo on rulesPerPage change.
    const c = Math.max(
      Math.min(
        Math.ceil(this.lastStartIndex / this.rulesPerPage) + 1,
        this.totalPages
      ),
      1
    );
    this.currentPage = c;
    // --

    this.setNoBtns(this.totalPages, this.currentPage);

    if (this.searchTermsArray.length == 0) {
      this.setTotalPages(this.OgValues);
      this.sliceValues(this.OgValues);
    } else {
      this.setTotalPages(this.searchResults);
      this.sliceValues(this.searchResults);
    }
  }
}
