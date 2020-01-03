import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { constant } from '../../../environments/constant';
import { Module } from '../model/module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient) {}

  public get selectedModule(): Module {
    return JSON.parse(localStorage.getItem('selectedModule'));
  }

  public set selectedModule(module: Module) {
    localStorage.setItem('selectedModule', JSON.stringify(module));
  }

  private get modules(): Array<Module> {
    return JSON.parse(localStorage.getItem('modules'));
  }

  private set modules(modules: Array<Module>) {
    localStorage.setItem('modules', JSON.stringify(modules));
  }

  public getModule(): Observable<Array<Module>> {
    if (this.modules === null) {
      return this.fetchModule()
        .pipe(
          tap((moduleList: Array<Module>) => {
            this.modules = moduleList;
          })
        );
    }

    return of(this.modules);
  }

  private fetchModule(): Observable<Array<Module>> {
    return this.http.get<Array<Module>>(`${constant.appUrl}/module`);
  }
}
