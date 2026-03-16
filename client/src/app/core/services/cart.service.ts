import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((count, item) => count + item.quantity, 0);
  });
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  });

  getCart(cartId: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + cartId).pipe(
      map((cart) => {
        this.cart.set(cart);
        return cart;
      }),
    );
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: (response) => {
        this.cart.set(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();

    if (this.isProduct(item)) {
      item = this.mapProductItemToCartItem(item);
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }
  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex((i) => i.productId === item.productId);

    if (index === -1) {
      item.quantity = quantity;
      return [...items, item];
    } else {
      items[index].quantity += quantity;
      return items;
    }
  }
  private mapProductItemToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity: 1,
      brand: item.brand,
      type: item.type,
    };
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const itemIndex = cart.items.findIndex((i) => i.productId === productId);
    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > quantity) {
        cart.items[itemIndex].quantity -= quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      if (cart.items.length === 0) {
        this.deleteCart(cart);
      } else {
        this.setCart(cart);
      }
    }
  }

  private deleteCart(cart: Cart) {
    this.http.delete(this.baseUrl + 'cart?id=' + cart.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
