import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {AboutComponent} from "./about/components/about.component";

import {routing, appRoutingProviders} from './app.routing';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpModule
    ],
    declarations: [
        AppComponent,
        AboutComponent,
    ],
    providers: [
        appRoutingProviders,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}