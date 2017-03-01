export class Log {
    
    static info: number = 0;
    static debug: number = 1;
    static warning: number = 2;
    static error: number = 3; 

    public time: Date;
    
    constructor(public text: string, public type: string, public level: number){
        this.time = new Date();
    }
}