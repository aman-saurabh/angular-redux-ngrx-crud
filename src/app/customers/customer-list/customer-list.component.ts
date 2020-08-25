import { Component, OnInit } from '@angular/core';
import { Store, select } from "@ngrx/store";
import * as customerAction from "../state/customer.action";
import { Observable } from "rxjs";
import * as fromCustomer from "../state/customer.reducer";
import { Customer } from "../customer.model";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  // customers;           
  //Note that with this customer you can't apply async pipe in html.
  
  customers$: Observable<Customer[]>;
  error$: Observable<String>;
  constructor(private store: Store<fromCustomer.AppState>) { }

  ngOnInit(): void {
    //Uncomment and Call this method id you don't want to use selectors concept.
    //this.getCustormersWithoutSelectors();
    
    this.getCustormersUsingSelectors();
  }

  getCustormersUsingSelectors(){
    this.store.dispatch(new customerAction.LoadCustomers());
    this.customers$ = this.store.select(fromCustomer.getCustomers);
    this.error$ = this.store.pipe(select(fromCustomer.getError));
  }

  getCustormersWithoutSelectors(){
    // this.store.dispatch(new customerAction.LoadCustomers());
    // this.store.subscribe(state =>{
    //   console.log(state.customers);      
    //   this.customers = state.customers.customers;
    // })
  }  

  deleteCustomer(customer: Customer) {
    if (confirm("Are You Sure You want to Delete the User?")) {
      this.store.dispatch(new customerAction.DeleteCustomer(customer.id));
    }
  }

  editCustomer(customer: Customer) {
    this.store.dispatch(new customerAction.LoadCustomer(customer.id));
  }

}
