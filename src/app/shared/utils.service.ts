import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
    
    constructor(){

    }

    // 
    // pulls a value out of the route parameters 
    //
    public extractFromRoute(queryName: string): string{
        let regex = new RegExp(queryName + '=([^;]+)', 'i');
        let match = regex.exec(window.location.href); 
        let result = match ? match[1] : null; 
        

        // if we found a token, we have it now so strip it out of the fragment 
        if(result != null){
            result = decodeURIComponent(result);
            window.location.href = window.location.href.replace(`${queryName}=${result}`, '');
            return result;
        }
        return null;  
    }
}
  