import { Injectable } from '@angular/core';
import { RecommendOptions } from './../models';
import { Observable, BehaviorSubject } from 'rxjs';

export class RecommendOptionsService {

    public min_acousticness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_acousticness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_danceability: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_danceability: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_duration_ms: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_duration_ms: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_energy: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_energy: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_instrumentalness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_instrumentalness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_key: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_key: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_liveness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_liveness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_loudness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_loudness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_mode: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_mode: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_popularity: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_popularity: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_speechiness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_speechiness: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_tempo: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_tempo: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_time_signature: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_time_signature: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public max_valence: BehaviorSubject<number> = new BehaviorSubject<number>(null);
    public min_valence: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    public change: Observable<RecommendOptions> = Observable
        .combineLatest(
        this.min_acousticness,
        this.max_acousticness,
        this.min_danceability,
        this.max_danceability,
        this.min_duration_ms,
        this.max_duration_ms,
        this.min_energy,
        this.max_energy,
        this.min_instrumentalness,
        this.max_instrumentalness,
        this.min_key,
        this.max_key,
        this.min_liveness,
        this.max_liveness,
        this.min_loudness,
        this.max_loudness,
        this.min_mode,
        this.max_mode,
        this.min_popularity,
        this.max_popularity,
        this.min_speechiness,
        this.max_speechiness,
        this.min_tempo,
        this.max_tempo,
        this.min_time_signature,
        this.max_time_signature,
        this.max_valence,
        this.min_valence)
        .debounceTime(100)
        .map(x=>{
            let options = new RecommendOptions();
            options.min_acousticness = x[0];
            options.max_acousticness = x[1];
            options.min_danceability = x[2];
            options.max_danceability = x[3];
            options.min_duration_ms = x[4];
            options.max_duration_ms = x[5];
            options.min_energy = x[6];
            options.max_energy = x[7];
            options.min_instrumentalness = x[8];
            options.max_instrumentalness = x[9];
            options.min_key = x[10];
            options.max_key = x[11];
            options.min_liveness = x[12];
            options.max_liveness = x[13];
            options.min_loudness = x[14];
            options.max_loudness = x[15];
            options.min_mode = x[16];
            options.max_mode = x[17];
            options.min_popularity = x[18];
            options.max_popularity = x[19];
            options.min_speechiness = x[20];
            options.max_speechiness = x[21];
            options.min_tempo = x[22];
            options.max_tempo = x[23];
            options.min_time_signature = x[24];
            options.max_time_signature = x[25];
            options.max_valence = x[26];
            options.min_valence = x[27];
            return options;
        });

    constructor(){

    }

    public presetDanceParty(){
        this.min_danceability.next(.8);
        this.min_popularity.next(.7);
        this.max_instrumentalness.next(.6);
        this.min_energy.next(.6);
        this.max_duration_ms.next(1000*60*5);
        this.min_tempo.next(110);
        this.min_time_signature.next(4);
        this.max_time_signature.next(4);
    }

    public presetChill(){
        this.max_danceability.next(.8);
        this.max_energy.next(.6);
        this.max_tempo.next(130);
        //this.max_loudness.next()
    }

    public presetLive(){
        this.min_liveness.next(.8);
    }

}