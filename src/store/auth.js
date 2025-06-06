import axios from "axios";
import Cookies from "js-cookie";

export default {
namespaced: true,
    state() {
    return {
        token: null,
        tokenExpirationDate: null,
        userLogin: {},
        isLogin: false,
    }
    },
    mutations: {
        setToken(state, {idToken, expiresIn}){
            state.token = idToken;
            state.tokenExpirationDate = expiresIn;
            Cookies.set("tokenExpirationDate", expiresIn);
            Cookies.set("jwt", idToken);
        },
        setUserLogin(state, {userData, loginStatus}){
            state.userLogin = userData;
            state.isLogin = loginStatus;
        },
        setUserLogout(state){
            state.userLogin = {};
            state.isLogin = false;
            state.token = null;
            state.tokenExpirationDate = null;
            Cookies.remove("tokenExpirationDate");
            Cookies.remove("jwt");
            Cookies.remove("UID");
        }
    },
    actions: {
        async getLoginData({commit, dispatch}, payload) {
            const APIkey = "AIzaSyCFCmEZMFWBY5qn3G424FGL8YwbsCb3vbU";
            const authURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
            try {
                const {data} = await axios.post(authURL + APIkey, {
                    email : payload.email,
                    password : payload.password,
                    returnSecureToken : true
                });
                commit("setToken", {
                    idToken: data.idToken,
                    expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000
                });
                await dispatch("getUser", data.localId);
            }
            catch (error) {
                console.log(error);
            }
        },
        async getUser({commit, state}, payload) {
            try {
                // Changed a bit so that login doesnt get the whole user data ut only the one that is needed, code recommended by copilot
                const {data} = await axios.get(`https://vue-js-project-3dc39-default-rtdb.firebaseio.com/user.json?auth=${state.token}`);
                for (let key in data) {
                    if (data[key].userId === payload) {
                        Cookies.set("UID", data[key].userId);
                        commit("setUserLogin", {userData: data[key], loginStatus: true});
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async getRegisterData({commit, dispatch}, payload) {
            const APIkey = "AIzaSyCFCmEZMFWBY5qn3G424FGL8YwbsCb3vbU";
            const authURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
            try {
                const {data} = await axios.post(authURL + APIkey, {
                    email : payload.email,
                    password : payload.password,
                    returnSecureToken : true
                });
                commit("setToken", {
                    idToken: data.idToken,
                    expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000
                });
                const newUserData = {
                    userId: data.localId, firstname: payload.firstname, lastname: payload.lastname, username: payload.username, email: payload.email, imageLink: payload.imageLink,
                }
                Cookies.set("UID", newUserData.userId);
                await dispatch("addNewUser", newUserData);
            }
            catch (error) {
                console.log(error);
            }
        },
        async addNewUser({commit, state}, payload) {
            try {
                const {data} = await axios.post(`https://vue-js-project-3dc39-default-rtdb.firebaseio.com/user.json?auth=${state.token}`, payload);
                commit("setUserLogin", {userData: payload, loginStatus: true});
            }
            catch (error) {
                console.log(error);
            }
        },
    }
}