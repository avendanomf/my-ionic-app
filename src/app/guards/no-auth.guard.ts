import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class noAuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve) => {
      // Usar currentUser inmediatamente si ya está disponible para mayor velocidad
      const user = this.firebaseSvc.getAuth().currentUser;
      if (user) {
        this.utilsSvc.RouterLink('/main/conteo-cho');
        resolve(false);
        return;
      }

      // Si no, esperar al cambio de estado con un timeout de seguridad
      const unsubscribe = this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        unsubscribe();
        if (!auth) {
          resolve(true);
        } else {
          this.utilsSvc.RouterLink('/main/conteo-cho');
          resolve(false);
        }
      });

      // Timeout de 3 segundos para no bloquear la app si hay mala conexión
      setTimeout(() => {
        unsubscribe();
        resolve(true); // Dejar pasar al login por defecto si falla la verificación
      }, 3000);
    });
  }


};
