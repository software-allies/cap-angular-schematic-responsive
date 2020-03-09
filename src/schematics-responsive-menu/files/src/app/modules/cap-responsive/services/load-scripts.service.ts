import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';


interface Scripts {
    name: string;
    src: string;
}  
const ScriptStore: Scripts[] = [
    { name: 'webslidemenu', src: '../../../assets/webslidemenu/webslidemenu.js' },
];


@Injectable({
    providedIn: 'root'
})
export class LoadScriptService {

    private scripts: any = {};

    constructor(@Inject(DOCUMENT) private document: Document) {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }

    load(...scripts: string[]) {
        var promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    loadScript(name: string) {
    return new Promise((resolve, reject) => {
        //resolve if already loaded
        if (this.scripts[name].loaded) {
            resolve({script: name, loaded: true, status: 'Already Loaded'});
        }
        else {
            //load script
            let script:any = this.document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.scripts[name].src;
            script.async = true;
            script.defer = true;
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        this.scripts[name].loaded = true;
                        resolve({script: name, loaded: true, status: 'Loaded'});
                    }
                };
            } else {  //Others
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                };
            }
            script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
            this.document.getElementsByTagName('head')[0].appendChild(script);
        }
    });
}

}