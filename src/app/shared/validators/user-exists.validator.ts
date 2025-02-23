import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { of, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators"
import { User } from "../../services/auth/model/types";
import { API_URL } from "../../app.config";

export const userExistValidator = () => {
    const http = inject(HttpClient);
    const baseUrl = inject(API_URL)

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
          return of(null);
        }

        return http.get<User[]>(`${baseUrl}/users`)
          .pipe(
            map(response => {
              const allreadyExists = response.some(user => user.email === control.value);
              return allreadyExists && { userExists: true } || null;
            }),
            catchError(() => of(null))
          );
      };
}
