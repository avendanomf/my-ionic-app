import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      // Intento inmediato
      const currentUser = this.firebaseSvc.getAuth().currentUser;
      if (currentUser) {
        resolve(true);
        return;
      }

      // Esperar cambio de estado
      const unsubscribe = this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        unsubscribe();
        if (auth) {
          resolve(true);
        } else {
          this.firebaseSvc.signOut();
          resolve(false);
        }
      });

      // Timeout de seguridad
      setTimeout(() => {
        unsubscribe();
        // Si hay un usuario en localStorage, intentamos dejarlo pasar para no bloquear
        const user = localStorage.getItem('user');
        if (user) resolve(true);
        else {
          this.firebaseSvc.signOut();
          resolve(false);
        }
      }, 3000);
    });
  }


};
