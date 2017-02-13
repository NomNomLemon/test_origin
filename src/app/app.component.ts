import {Component, NgZone} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";
declare var $:any;

@Component({
    selector: "app",
    templateUrl: "./static/build/app/app.html"
})
export class AppComponent {
    list:Array<any> = [];
    chosenLogs:Array<any>= [];
    sendObj:any;
    errorText:string = '';
    constructor(private http: Http,
                private zone:NgZone) {
        this.getList();
    }

    getList() {
        this.http.get('/api/tasks/').subscribe((result:Response) => {
                console.log(result.json());
                this.zone.run(() => {
                    this.list = result.json();
                });
            },
            error => {
            });
    }

    static getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    };

    edit(data) {
        $(data).toggle();
        $(data).closest('.caption').find('.senddata').toggle();
        $(data).closest('.caption').find('input').prop('readonly', false).focus();
        $(data).closest('.caption').find('textarea').prop('readonly', false);
    }

    errorShow(error) {
        error._body = JSON.parse(error._body);
        this.errorText = error._body.detail;
        $('#error').modal('show');
    }

    hideCompleted() {
        $('.hideShow').toggle();
        $('.alert-info:not(.alert-danger)').closest('.col-sm-6').toggle();
    };

    sendData(data, id, name, description) {
        $(data).toggle();
        $(data).closest('.caption').find('.edit').toggle();
        $(data).closest('.caption').find('input').prop('readonly', true);
        $(data).closest('.caption').find('textarea').prop('readonly', true);
        console.log(id, description, name);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'X-CSRFToken': AppComponent.getCookie('csrftoken')
        });
        let options = new RequestOptions({headers});
        this.sendObj = {
            //"user": id,
            "name": name,
            "description": description,
            //"status": false
        };
        console.log('sendObj', this.sendObj);
        this.http.put('/api/tasks/' + id + '/', this.sendObj, options).subscribe((result:Response) => {
                this.getList();
            },
            error => {
                error._body = JSON.parse(error._body);
                this.errorText = error._body.detail;
                $('#error').modal('show');
                console.log(error._body.detail);
            });
    };

    addNewTask(description, name) {
        console.log(description, name);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'X-CSRFToken': AppComponent.getCookie('csrftoken')
        });
        let options = new RequestOptions({headers});
        this.sendObj = {
            "name": name,
            "description": description,
            "status": false
        };
        console.log('sendObj', this.sendObj);
        this.http.post('/api/tasks/', this.sendObj, options).subscribe((result:Response) => {
                this.getList();
            },
            error => {
                this.errorShow(error);
            });

    };

    changeStatus(id) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'X-CSRFToken': AppComponent.getCookie('csrftoken')
        });
        let options = new RequestOptions({headers});
        this.http.put('/api/tasks/status/' + id + '/', {status: true}, options)
            .subscribe((result:Response) => {
                console.log(result.json());
            },
            error => {
            });
    }

    deleteTask(id) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'X-CSRFToken': AppComponent.getCookie('csrftoken')
        });
        let options = new RequestOptions({headers});
        this.http.delete('/api/tasks/' + id + '/', options)
            .subscribe((result:Response) => {
                this.getList();
            },
            error => {
                this.errorShow(error);
            });
    }
    modalTaskShow(id) {
        this.chosenLogs = id;
        $('#logs').modal('show');
    }

    textToggle(id) {
        $('.collapse#' + id).closest('.list-group').find('a span').toggle();
    }
}