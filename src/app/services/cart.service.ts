import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {CartItem} from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  /**
   * Subject is a subclass of Observable.
   * We can use Subject to publish events in our code
   * The event will be sent to all of the subscribers
   * ! Does not keep a buffer of previous events
   * ! Subscriber only receives new events after they are subscribed
   */

  /**
   * ReplaySubject is a subclass of Subject,
   * it will also "replay events" for new subscribers who join later
   * ! Keep a buffer of previous events and send to new subscribers
   * ! Subscriber receives a replay of all previous events once subscribed
   */

  /**
   * BehaviorSubjects are useful for representing "values over time".
   * ! It will only retrieve the latest message/event
   * ! Subscriber receives the latest event sent prior to subscribing once subscribed
   * For instance, an event stream of birthdays is a Subject,
   * but the stream of a person's age would be a BehaviorSubject
   */

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currCartItem of this.cartItems) {
      totalPriceValue += currCartItem.unitPrice * currCartItem.quantity;
      totalQuantityValue += currCartItem.quantity;
    }
    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


}
