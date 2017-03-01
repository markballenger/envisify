// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

// rxjs
//import 'rxjs';
// todo: when closer to production ready, specify only our needed operators explicitly
// todo: move these imports to a rx-operators.ts file
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/pairwise';

import '@angularclass/hmr';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...
import 'jquery/dist/jquery.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/js/bootstrap.js';

//import 'holderjs/holder.js';
//import 'isotope-layout/dist/isotope.pkgd.js'; using cdn for now instead
import 'lodash';
import 'd3/d3.js'; //using cdn for now instead
import 'font-awesome/css/font-awesome.css';
import 'color-string';
import 'color-convert';
import 'color';
import 'query-string';
//import 'fittext/dist/jquery.fittext.js';