import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SnackbarService } from '../services/snackbar.service';
import { of } from 'rxjs';

export const cartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const snack = inject(SnackbarService);
  const router = inject(Router);

  if (cartService.cart()?.items) {
    return of(true);
  } else {
    snack.error('You do not have items in the cart to continue');
    router.navigateByUrl('/shop');
    return false;
  }

  return true;
};
