/**
 * Typical example of app state interface
 */
// import { AppReducer } from "../app.reducer";
// import { CustomerReducer } from "../customers/state/customer.reducer";

// export interface AppState {
//     app: AppReducer,
//     customers: CustomerReducer
// }

/**
 * However we are creating a small project with only one state i.e Customer state and we don't have even AppReducer.So we don't need such configuration.
 * Only Initialization will be enough.
 */

export interface AppState {}