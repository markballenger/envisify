import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Log } from './../models';

@Injectable()
export class ConsoleService {

    private _logs: BehaviorSubject<Log[]> = new BehaviorSubject<Log[]>([]);
    public logs: Observable<Log[]> = this._logs.asObservable();

    constructor(){
    }

    public error(text: string, owner: any){
        console.error(text);
        this.push(new Log(text, typeof(owner).name, Log.error));
    }

    public warn(text: string, owner: any){
        this.push(new Log(text, typeof(owner).name, Log.warning));
    }

    public info(text: string, owner: any){
        this.push(new Log(text, typeof(owner).name, Log.info));
    }

    private push(log: Log){
        // let logsValue = this._logs.getValue();
        // logsValue.push(log);
        // this._logs.next(logsValue);
    }
}
