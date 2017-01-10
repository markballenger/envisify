import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { OnInit, AfterViewInit} from '@angular/core';
import { FocusDirective } from './../../../shared/focus/focus';

declare var _ : any;

@Component({
    selector: 'typeahead',
    templateUrl: './typeahead.html',
    styleUrls: ['./typeahead.scss'],
    providers: [],
    host: {
        '(document:click)': 'onClick($event)',
    }
})
export class Typeahead implements OnInit, AfterViewInit {

    /**
     * The complete list of items.
     */
    @Input() list: any[] = [];

    /** 
     * Input element placeholder text.
     */ 
    @Input() placeholder: string = '';
    
    /**
     * The font awesome addon class 
     */
    //@Input() faClass: string;

    /**
     * The property of a list item that should be used for matching.
     */
    @Input() searchProperty: string = 'name';

    /**
     * The property of a list item that should be displayed.
     */
    @Input() displayProperty: string = 'name';

    /**
     * The maximum number of suggestions to display.
     */
    @Input() maxSuggestions: number = -1;

    /*
    * Specify whether the user should be able to select multiple items
    */
    @Input() enableMultiSelect: boolean = true; 

    /**
     * Event that occurs when a suggestion is selected.
     */
    @Output() suggestionSelected = new EventEmitter<any>();

    /**
     * Handle to the input element.
     */
    @ViewChild('inputElement') private inputElement: any;

    /**
     *  Handle to the container div element
     */
    @ViewChild('container') private containerElement: any;

    /**
     * The displayText value.
     */
    @Input()
    private displayText: string;

    /**
     * Whether or not the filter textbox is focused
     */
    private filterFocused: boolean = false;

    /**
     * The value of the suggestion filter
     */
    private filter: string;

    /**
     * The typeahead element's value. This element is displayed behind the input element.
     */
    private typeahead: string;

    /**
     * The previously entered filter string.
     */
    private previousFilter: string;

    /**
     * The filtered list of suggestions.
     */
    private suggestions: any[] = [];

    /**
     * Indicates whether the suggestions are visible.
     */
    private areSuggestionsVisible: boolean = false;

    /**
     * The currently selected suggestion.
     */
    private selectedSuggestion: any;

    /**
     * Provides support for multi selection
     */ 
    @Input() selectedSuggestions: any[] = [];
    @Output() selectedSuggestionsChange: EventEmitter<any[]> = new EventEmitter<any[]>(); 

    /**
     * The active (highlighted) suggestion.
     */
    private activeSuggestion: any;

    /**
     * Creates and initializes a new typeahead component.
     */
    constructor() {
    }

    /**
     * Implement this interface to execute custom initialization logic after your
     * directive's data-bound properties have been initialized.
     *
     * ngOnInit is called right after the directive's data-bound properties have
     * been checked for the first time, and before any of its
     * children have been checked. It is invoked only once when the directive is
     * instantiated.
     */
    public ngOnInit() {
        if(this.selectedSuggestions){
            this.displayText = this.selectedSuggestions.map(o=>o.displayText).join(', ');
        } else if(this.selectedSuggestion){
            this.displayText = this.selectedSuggestion.displayText;
        }
    }

    public ngAfterViewInit(){
    }

    
    /**
     * 
     */
    onClick(event) {
        
        if(!this.containerElement.nativeElement.contains(event.target)){
            this.areSuggestionsVisible = false;
        }

    }

    /**
     * Called when a keydown event is fired on the input element.
     */
    public inputKeyDown(event: KeyboardEvent) {
        if (event.which === 9 || event.keyCode === 9) { // TAB
            // Only enter this branch if suggestions are displayed
            if (!this.areSuggestionsVisible) {
                return;
            }

            // Select the first suggestion
            this.selectSuggestion(this.activeSuggestion);

            // Remove all but the first suggestion
            this.suggestions.splice(1);

            // Hide the suggestions
            this.areSuggestionsVisible = false;

            event.preventDefault();
        } else if (event.which === 38 || event.keyCode === 38) { // UP
            // Find the active suggestion in the list
            let activeSuggestionIndex = this.getActiveSuggestionIndex();

            // If not found, then activate the first suggestion
            if (activeSuggestionIndex === -1) {
                this.setActiveSuggestion(this.suggestions[0]);
                return;
            }

            if (activeSuggestionIndex === 0) {
                // Go to the last suggestion
                this.setActiveSuggestion(this.suggestions[this.suggestions.length - 1]);
            } else {
                // Decrement the suggestion index
                this.setActiveSuggestion(this.suggestions[activeSuggestionIndex - 1]);
            }
        } else if (event.which === 40 || event.keyCode === 40) { // DOWN
            // Find the active suggestion in the list
            let activeSuggestionIndex = this.getActiveSuggestionIndex();

            // If not found, then activate the first suggestion
            if (activeSuggestionIndex === -1) {
                this.setActiveSuggestion(this.suggestions[0]);
                return;
            }

            if (activeSuggestionIndex === (this.suggestions.length - 1)) {
                // Go to the first suggestion
                this.setActiveSuggestion(this.suggestions[0]);
            } else {
                // Increment the suggestion index
                this.setActiveSuggestion(this.suggestions[activeSuggestionIndex + 1]);
            }
        } else if ((event.which === 10 || event.which === 13 ||
            event.keyCode === 10 || event.keyCode === 13) &&
            this.areSuggestionsVisible) { // ENTER

            // Select the active suggestion
            this.selectSuggestion(this.activeSuggestion);

            // Hide the suggestions
            this.areSuggestionsVisible = false;

            event.preventDefault();
        }
    }

    /**
     * Sets the active (highlighted) suggestion.
     */
    public setActiveSuggestion(suggestion: any) {
        this.activeSuggestion = suggestion;
        this.populateTypeahead();
    }

    /**
     * Gets the index of the active suggestion within the suggestions list.
     */
    public getActiveSuggestionIndex() {
        let activeSuggestionIndex = -1;
        if (this.activeSuggestion != null) {
            activeSuggestionIndex = this.indexOfObject(this.suggestions,
                this.searchProperty, this.activeSuggestion[this.searchProperty]);
        }
        return activeSuggestionIndex;
    }

    /**
     * Gets the index of an object in a list by matching a property value.
     */
    public indexOfObject(array: any[], property: string, value: string) {
        if (array == null || array.length === 0) {
            return -1;
        }
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i][property] != null && array[i][property] === value) {
                index = i;
            }
        }
        return index;
    }

    /**
     * Called when a keyup event is fired on the input element.
     */
    public inputKeyUp(event: KeyboardEvent) {
        // Ignore TAB, UP, and DOWN since they are processed by the keydown handler
        if (event.which === 9 || event.keyCode === 9 ||
            event.which === 38 || event.keyCode === 38 ||
            event.which === 40 || event.keyCode === 40) {
            return;
        }

        // When the filter is cleared
        if (this.filter == null || this.filter.length === 0) {
            this.typeahead = '';
            this.populateSuggestions();
            return;
        }

        // If the suggestion matches the filter, then return
        if (this.selectedSuggestion != null) {
            if (this.selectedSuggestion[this.displayProperty] === this.filter) {
                return;
            }
        }

        // If current input does not equal previous input, then populate the suggestions
        if (this.filter !== this.previousFilter) {
            this.previousFilter = this.filter;
            this.populateSuggestions();
            this.populateTypeahead();
        }
    }

    /**
     * Called when a focus event is fired on the input element.
     */
    public inputFocus(event: FocusEvent) {
        
        // if the dropdown is open and the user clicks here, just close the dropdown and be done
        if(this.areSuggestionsVisible) {
            this.areSuggestionsVisible = false;
            this.filter = null;
            return;
        }

        // If the element is receiving focus and it has a selection, then
        // clear the selection. This helps prevent partial editing
        if (this.selectedSuggestion != null) {
            this.filter = null;
            this.selectSuggestion(null);
            this.populateTypeahead();
        }
        
        // this code is goofy, but it works for the
        this.filterFocused = false;
        window.setTimeout( () => this.filterFocused = true, 500);

        // Re-populate the suggestions
        this.populateSuggestions();

        // Set the typeahead to a slice of the first suggestion
        this.populateTypeahead();

        // Show/hide the suggestions
        this.areSuggestionsVisible = true;

        
    }

    /**
     * Called when a blur event is fired on the input element.
     */
    public inputBlur(event: Event) {
        this.typeahead = '';
        //this.areSuggestionsVisible = false;
    }

    /**
     * Called when a mouseover event is fired on a suggestion element.
     */
    public suggestionMouseOver(suggestion: any) {
        this.setActiveSuggestion(suggestion);
    }

    /**
     * Called when a mousedown event is fired on a suggestion element.
     */
    public suggestionMouseDown(suggestion: any) {
        this.selectSuggestion(suggestion);
    }

    /**
     * Called when a mouseout event is fired on the suggestions element.
     */
    public suggestionsMouseOut(event: MouseEvent) {
        this.setActiveSuggestion(null);
    }

    /**
     * 
     */
    public suggestionsMouseLeave(event: MouseEvent){
        //this.areSuggestionsVisible = false; 
    }

    /**
     * Fills the suggestions list with items matching the input pattern.
     */
    public populateSuggestions() {
        
        // Capture variables scoped to the component
        let searchProperty = this.searchProperty;
        let filter = this.filter;

        // Confirm that we have a search property
        if (searchProperty == null || searchProperty.length === 0) {
            console.error('The input attribute `searchProperty` must be provided');
            return;
        }

        // Handle empty filter
        if (filter == null || filter.length === 0) {
            // No input yet
            this.suggestions = this.list;
            this.areSuggestionsVisible = true;
            return;
        }

        // Check that we have data
        if (this.list == null || this.list.length === 0) {
            return;
        }

        // Filter the suggestions
        this.suggestions = this.list.filter(item => {
                if(item[searchProperty] && filter){
                    return item[searchProperty].toLowerCase().indexOf(filter.toLowerCase()) > -1 || this.isSelected(item);
                }
            }
        );

        // Limit the suggestions (if applicable)
        if (this.maxSuggestions > -1) {
            this.suggestions = this.suggestions.slice(0, this.maxSuggestions);
        }

        if (this.suggestions.length === 0) {
            // No suggestions, so clear the typeahead
            this.typeahead = '';
        } else {
            // Set the typeahead value
            this.populateTypeahead();
            // Make the first suggestion active
            this.activeSuggestion = this.suggestions[0];
        }
    }

    /**
     * Sets the typeahead input element's value based on the active suggestion.
     */
    public populateTypeahead() {
        // Clear the typeahead when there is no active suggestion
        if (this.activeSuggestion == null || !this.areSuggestionsVisible) {
            this.typeahead = '';
            return;
        }
        // Set the typeahead value
        this.typeahead = (this.filter || '') + (this.activeSuggestion[this.displayProperty] || '').slice((this.filter || '').length);
    }

    /**
     * whether the suggestion is in the list of selected suggestions
     */
    public isSelected(suggestion){
        return _.some(this.selectedSuggestions, n=> n.name === suggestion.name);
    }

    /**
     * Selects a suggestion.
     */
    public selectSuggestion(suggestion: any) {
        // Set the variable
        this.selectedSuggestion = suggestion;

        if(!this.enableMultiSelect){
            this.selectedSuggestions = [];
            // hide suggestions for non-multiselect after a selection has been made 
            this.areSuggestionsVisible = false;
        }

        // update the multi selection array accordingly
        if(suggestion){
            if(!_.some(this.selectedSuggestions, x=> x.name === suggestion.name)){
                this.selectedSuggestions.push(suggestion);
            } else{
                let index = _.findIndex(this.selectedSuggestions, x=>x.name===suggestion.name);
                this.selectedSuggestions.splice(index, 1);
            }
        }

        // Hide the suggestions
        //this.areSuggestionsVisible = false;

        // Notify the parent component
        this.suggestionSelected.emit(this.selectedSuggestions);
        this.selectedSuggestionsChange.emit(this.selectedSuggestions);

        // Other form operations
        if (this.selectedSuggestion != null) {
            
            // Set the values of the input elements
            //this.input = suggestion[this.displayProperty];
            this.displayText = this.selectedSuggestions.map(o=>o.displayText).join(', ');
            
            this.typeahead = suggestion[this.displayProperty];

            // Blur the input so we can "lock" the selected suggestion
            this.blurInputElement();
        }
    }

    /**
     * SelectAll 
     */
    public selectAll(){
        this.selectedSuggestions = [];
        this.suggestions.forEach(suggestion => {
            this.selectSuggestion(suggestion);
        });
    }

    /**
     * SelectNone
     */
    public selectNone(){
        this.selectedSuggestions = [];
        this.displayText = '';

        if(!this.enableMultiSelect){
            this.areSuggestionsVisible = false;
        }

        // Notify the parent component
        //this.suggestionSelected.emit(this.selectedSuggestions);
        this.selectedSuggestionsChange.emit(this.selectedSuggestions);
    }

    /**
     * Blurs the input element in order to "lock" the value and prevent partial editing.
     */
    public blurInputElement() {
        if (this.inputElement && this.inputElement.nativeElement) {
            this.inputElement.nativeElement.blur();
        }
    }

    /**
     * Indicates whether a suggestion has been selected.
     */
    public hasSelection() {
        return this.selectedSuggestion != null;
    }
}
