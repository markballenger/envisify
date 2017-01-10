import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
    
    constructor(){

    }

    // 
    // pulls a value out of the route parameters
    //   and rmeoved it from the window.location.href 
    //
    public extractFromRoute(queryName: string): string{
        let result = this.getQueryFromUrl(queryName, window.location.href); 

        // if we found a token, we have it now so strip it out of the fragment 
        if(result != null){
            result = decodeURIComponent(result);
            window.location.href = window.location.href.replace(`${queryName}=${result}`, '');
            return result;
        }
        return null;  
    }

    //
    // finds query value in the given url and returns it
    //
    public getQueryFromUrl(queryName: string, urlString: string): string{
        let regex = new RegExp(queryName + '=([^;]+)', 'i');
        let match = regex.exec(urlString); 
        let result = match ? match[1] : null; 
        return result;
    }
}
  