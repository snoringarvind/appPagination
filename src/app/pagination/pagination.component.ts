import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { NAMES } from '../mock-names';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  showSelect: boolean = false;

  selectArr: number[] = [];
  numbers: number[] = [];
  rulesPerPage!: number;
  currentPage: number = 1;

  searchObservable!: Observable<any>;

  @Input() names!: any;
  @Output() onValuesChange = new EventEmitter();

  constructor() {}

  searchTerms = new Subject<string>();

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.searchObservable = this.searchTerms.pipe(
      debounceTime(300),

      distinctUntilChanged(),
      switchMap((term: string) => {
        let fr: any = [];
        this.names.filter((v: any, i: any) => {
          if (v.toLocaleLowerCase().includes(term.toLocaleLowerCase())) {
            fr.push(v);
          }
        });
        return of(fr);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes in', changes);
    this.onValuesChange.emit(changes.currentValue);
  }

  setShowSelect() {
    this.showSelect = !this.showSelect;
  }

  newRulesCB(val: any) {
    this.currentPage = val.currentPage;
    this.numbers = val.numbers;

    this.rulesPerPage = val.rulesPerPage;
    this.selectArr = val.selectArr;
    this.onValuesChange.emit(val.values);
  }
}
