import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { of, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators"
import { User } from "../../services/auth/model/types";

export const userExistValidator = () => {
    const http = inject(HttpClient);

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
          return of(null);
        }
    
        return http.get<User[]>(`http://localhost:3000/users`)
          .pipe(
            map(response => {
              const allreadyExists = response.some(user => user.email === control.value);
              return allreadyExists && { userExists: true } || null;
            }),
            catchError(() => of(null))
          );
      };
}
