import * as customerAction from './customer.action';
import { Customer } from '../customer.model';
import * as fromRoot from '../../state/app-state';
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

/**
 * Following code is created without using the concept of entity.
 * If you don't want to use entity concept then follow following method.
 * Implementation with "entity" is below these commented lines
 */

/* 
export interface CustomerState {
    customers : Customer[],
    loading: boolean,
    loaded: boolean,
    error: string
}

export interface AppState extends fromRoot.AppState{
    customers: CustomerState
}

const initialState: CustomerState = {
    customers: [],
    loading: false,
    loaded: true,
    error: ""
}

export function customerReducer(state = initialState, action: customerAction.Actions) {
    switch (action.type) {
        case customerAction.CustomerActionTypes.LOAD_CUSTOMERS: {
            return {
                ...state,
                loading: true
            }
        }

        case customerAction.CustomerActionTypes.LOAD_CUSTOMERS_SUCCESS: {
            return {
                ...state,
                loading: false,
                loaded: true,
                customers: action.payload
            }
        }

        case customerAction.CustomerActionTypes.LOAD_CUSTOMERS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false,
                customers: [],
                error: action.payload
            }
        }

        default: {
            return state;
        }
        
    }
} 

//**
// * Selectors definition :-
//**
const getCustomerFeatureState= createFeatureSelector<CustomerState>("customers");

export const getCustomers = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.customers)

export const getCustomersLoading = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.loading)

export const getCustomersLoaded = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.loaded)

export const getError = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.error)
*/


/**
 * Implementation with the concept of entity started.
 */
export interface CustomerState extends EntityState<Customer> {
    selectedCustomerId: number | null;
    loading: boolean,
    loaded: boolean,
    error: string
}

export interface AppState extends fromRoot.AppState{
    customers: CustomerState
}

//used in defining initialState
export const customerAdaptor: EntityAdapter<Customer> = createEntityAdapter<Customer>();

export const defaultCustomer: CustomerState = {
    ids: [],
    entities: {},
    selectedCustomerId: null,
    loading: false,
    loaded: false,
    error: ""
}

const initialState = customerAdaptor.getInitialState(defaultCustomer);

export function customerReducer(state = initialState, action: customerAction.Actions) {
    switch (action.type) {
        
        case customerAction.CustomerActionTypes.LOAD_CUSTOMERS_SUCCESS: {
            return customerAdaptor.addAll(action.payload, {
                ...state,
                loading: false,
                loaded: true
            })
        }

        case customerAction.CustomerActionTypes.LOAD_CUSTOMERS_FAIL: {
            return {
                ...state,
                loading: false,
                loaded: false,
                entities: {},
                error: action.payload
            }
        }

        case customerAction.CustomerActionTypes.LOAD_CUSTOMER_SUCCESS: {
            return customerAdaptor.addOne(action.payload, {
                ...state,
                selectedCustomerId: action.payload.id
            })
        }

        case customerAction.CustomerActionTypes.LOAD_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            }
        }

        case customerAction.CustomerActionTypes.CREATE_CUSTOMER_SUCCESS: {
            return customerAdaptor.addOne(action.payload, state)
        }

        case customerAction.CustomerActionTypes.CREATE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            }
        }

        case customerAction.CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS: {
            return customerAdaptor.updateOne(action.payload, state)
        }

        case customerAction.CustomerActionTypes.UPDATE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            }
        }

        case customerAction.CustomerActionTypes.DELETE_CUSTOMER_SUCCESS: {
            return customerAdaptor.removeOne(action.payload, state)
        }

        case customerAction.CustomerActionTypes.DELETE_CUSTOMER_FAIL: {
            return {
                ...state,
                error: action.payload
            }
        }

        default: {
            return state;
        }
        
    }
} 

/**
 * Selectors definition :-
 */
const getCustomerFeatureState= createFeatureSelector<CustomerState>("customers");

export const getCustomers = createSelector(getCustomerFeatureState, customerAdaptor.getSelectors().selectAll)

export const getCustomersLoading = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.loading)

export const getCustomersLoaded = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.loaded)

export const getError = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.error)

export const getCurrentCustomerId = createSelector(getCustomerFeatureState, (state: CustomerState)=> state.selectedCustomerId)

export const getCurrentCustomer = createSelector(getCustomerFeatureState, getCurrentCustomerId, (state: CustomerState)=> state.entities[state.selectedCustomerId])
