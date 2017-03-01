declare var _: any;

export class RecommendOptions {
    public min_acousticness : number = null;
    public max_acousticness : number = null;
    public min_danceability : number = null;
    public max_danceability : number = null;
    public min_duration_ms : number = null;
    public max_duration_ms : number = null;
    public min_energy : number = null;
    public max_energy : number = null;
    public min_instrumentalness : number = null;
    public max_instrumentalness : number = null;
    public min_key : number = null;
    public max_key : number = null; 
    public min_liveness : number = null;
    public max_liveness : number = null;
    public min_loudness : number = null;
    public max_loudness : number = null;
    public min_mode : number = null;
    public max_mode : number = null;
    public min_popularity : number = null;
    public max_popularity : number = null;
    public min_speechiness : number = null;
    public max_speechiness : number = null;
    public min_tempo : number = null;
    public max_tempo : number = null;
    public min_time_signature : number = null;
    public max_time_signature : number = null;
    public min_valence : number = null;
    public max_valence : number = null;

    // helper method to see if any property has a value
    public hasValue(){
        return _.some(_.keys(this), x=> this[x] != null);
    }
}