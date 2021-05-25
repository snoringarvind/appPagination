<h1>App Pagination</h1>
<p>You can visulaize you data-sets via infinite scroll or in the form of pages. But since the data can easily get pretty huge for infinite scrolling, we can use pagination for such scenarios. This App Pagination directive helps you to create pages for your data. All you have to do is insert this directive in your template file and it returns a call-back with the current page number and sliced values. </p>

<h2>Angular Version</h2>
<p>This Angular directive is created using Angular 12+ .</p>

<h2>How to install</h2>

```
npm i snoring-pagination
```

<h2>How to use</h2>

<ol>

<li>
<h4>Add pagination directive to your div element</h4>

```ruby
  <div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    >
  </div>
```

</li>

<li>
<h4>Pass your [data] on which you want to implement your pagination. The data should be in the form of an array.</h4>

<p>The <em>values</em> is your data variable.</p>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
  >
</div>
```

</li>

<li>
<h4>Adding buttons to navigate forward and backward</h4>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
  >

  <button class='page-first-btn' (click)='pagination.first()'> << </button>
  <button class='page-prev-btn' (click)='pagination.prev()'>   <  </button>
  <button class='page-next-btn' (click)='pagination.next()'>   > </button>
  <button class='page-last-btn' (click)='pagination.last()'>   >> </button>

</div>
```

</li>

<li>
<h4>Adding clickable page number buttons and also highlighting the current page number.</h4>
<p>Five clickable buttons are displayed with the curren page button in the middle.</p>
<p>The variables <em>currentPage</em> and <em>btnNosArr</em> we get from the call-back, which we will cover later.</p>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
  >

  <div *ngFor="let number of btnNosArr">
      <button
        (click)="pagination.OnClick(number, $event)"
        [ngClass]="{
          'active-page': currentPage === number,
          'page-btn': true
        }"
      >
        {{ number }}
      </button>
  </div>

</div>
```

</li>

<li>
<h4>Adding an input element to jump to the desired page number.</h4>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
  >

  <div>
    <input
      name="input"
      [ngModel]="currentPage"
      (keyup.enter)="pagination.change($event)"
      />

  </div>

</div>
```

</li>

<li>
<h4>Adding a  dropdown to select the number of data-values on each page. The default selection is [5, 10, 25, 50 ,100, 250, 500] but you can also pass your own selection range.</h4>

<p>The variable <em>selectArr</em> we get from the call-back, which we will cover later.</p>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
    [pageRangeArr]="[5, 20, 30, 40, 50]"
  >

  <select (click)="pagination.onRulePerPageChange($event)">
    <option
      *ngFor="let i of selectArr"
      [value]="[i]"
      [ngClass]="{
      selected: rulesPerPage === i,
      option: 'true'
      }"
    >
      {{ i }}
    </option>
  </select>

</div>
```

</li>

<li>
<h4>Adding a call-back function for new sliced values inside our respective component.ts file.</h4>

<h5>component.ts </h5>
  
```ruby
    newRulesCB(val: any) {
      this.currentPage = val.currentPage;
      this.btnNosArr = val.btnNosArr;
      this.rulesPerPage = val.rulesPerPage;
      this.selectArr = val.newPageRangeArr;
      this.slicedValues = val.valuesArr;
    }
```

<h5>component.html</h5>

<p>The variable <em>slicedValues</em> contains our new sliced data for the current page.</p>

```ruby
<div
    class="pagination"
    snoringPagination
    #pagination="snoringPagination"
    [valuesArr]="values"
    [pageRangeArr]="[5, 20, 30, 40, 50]"
    (newRules)="newRulesCB($event)"
  >
</div>
```

</li>

<li>
<h4>Adding a search box to filter the data. (Optional)</h4>
<h5>component.ts</h5>
<p>Here we create Observables for searchTerms to pass the seach-term and SearchObservable to pass the latest search request.</p>
<p>You can look more about creating search observables on <a href='https://angular.io/guide/practical-observable-usage'>Angular Documentation</a></p>

```ruby
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
```

<h5>component.html</h5>

```ruby
<div>
    <input #searchBox (input)="search(searchBox.value)" />
</div>
```

</li>
</ol>
