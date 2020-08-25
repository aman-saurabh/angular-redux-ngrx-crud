import { Injectable } from "@angular/core";
import { Actions, Effect, ofType, act } from "@ngrx/effects";

import { of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";

import { CustomerService } from "../customer.service";
import * as customerAction from "../state/customer.action";
import { Customer } from "../customer.model";

@Injectable()
export class CustomerEffect {
    constructor(private actions$: Actions, private customerService: CustomerService) { }

    @Effect()
    loadCustomers$ = this.actions$.pipe(
        ofType<customerAction.LoadCustomers>(
            customerAction.CustomerActionTypes.LOAD_CUSTOMERS
        ),
        mergeMap((actions: customerAction.LoadCustomers) =>
            this.customerService.getCustomers().pipe(
                map(
                    (customers: Customer[]) => new customerAction.LoadCustomersSuccess(customers)
                ),
                catchError(err => of(new customerAction.LoadCustomersFail(err)))
            )
        )
    );

    @Effect()
    loadCustomer$ = this.actions$.pipe(
        ofType<customerAction.LoadCustomer>(
            customerAction.CustomerActionTypes.LOAD_CUSTOMER
        ),
        mergeMap((action: customerAction.LoadCustomer) =>
            this.customerService.getCustomerById(action.payload).pipe(
                map(
                    (customer: Customer) => new customerAction.LoadCustomerSuccess(customer)
                ),
                catchError(err => of(new customerAction.LoadCustomerFail(err)))
            )
        )
    );

    @Effect()
    createCustomer$ = this.actions$.pipe(
        ofType<customerAction.CreateCustomer>(
            customerAction.CustomerActionTypes.CREATE_CUSTOMER
        ),
        map((action: customerAction.CreateCustomer) => action.payload),
        mergeMap((customer: Customer) =>
            this.customerService.createCustomer(customer).pipe(
                map(
                    (newCustomer: Customer) => new customerAction.CreateCustomerSuccess(newCustomer)
                ),
                catchError(err => of(new customerAction.DeleteCustomerFail(err)))
            )
        )
    );

    @Effect()
    updateCustomer$ = this.actions$.pipe(
        ofType<customerAction.UpdateCustomer>(
            customerAction.CustomerActionTypes.UPDATE_CUSTOMER
        ),
        map((action: customerAction.UpdateCustomer) => action.payload),
        mergeMap((customer: Customer) =>
            this.customerService.updateCustomer(customer).pipe(
                map(
                    (updateCustomer: Customer) => new customerAction.UpdateCustomerSuccess({
                        id: updateCustomer.id,
                        changes: updateCustomer
                    })
                ),
                catchError(err => of(new customerAction.DeleteCustomerFail(err)))
            )
        )
    );

    @Effect()
    deleteCustomer$ = this.actions$.pipe(
        ofType<customerAction.DeleteCustomer>(
            customerAction.CustomerActionTypes.DELETE_CUSTOMER
        ),
        map((action: customerAction.DeleteCustomer) => action.payload),
        mergeMap((id: number) =>
            this.customerService.deleteCustomer(id).pipe(
                map(
                    () => new customerAction.DeleteCustomerSuccess(id)
                ),
                catchError(err => of(new customerAction.DeleteCustomerFail(err)))
            )
        )
    );
}

