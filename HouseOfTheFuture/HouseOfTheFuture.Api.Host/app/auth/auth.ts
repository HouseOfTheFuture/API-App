///// <reference path="../app.ts" />
//module HouseOfTheFuture.Web.Auth {
//    import test = HouseOfTheFuture.Api.Host.Controllers;
//    class LoginController {
//        username: string;
//        password: string;
//        submit = () => {
//            this.$http({
//                method: "POST",
//                url: "account/token",
//                data: $.param({
//                    grant_type: "password",
//                    username: this.username,
//                    password: this.password
//                }),
//                headers: { 'Content-Type': "application/x-www-form-urlencoded" }
//            });
//        }
//    }
//    app.controller("LoginController", LoginController);
//}