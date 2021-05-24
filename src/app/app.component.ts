import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NAMES } from './mock-names';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges, AfterViewInit {
  title = 'pagination';
  names!: any[];
  slicedNames!: any[];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    let x: any = NAMES.split('\n');
    this.names = x;
    console.log(this.names);
    console.log(this.names.length);
  }

  onValuesChange(val: any[]) {
    this.slicedNames = val;
  }

  ngOnChanges() {}
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
