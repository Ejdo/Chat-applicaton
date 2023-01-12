"use strict";(globalThis["webpackChunkslate_messenger"]=globalThis["webpackChunkslate_messenger"]||[]).push([[641],{3641:(e,s,l)=>{l.r(s),l.d(s,{default:()=>b});var a=l(9835);const t=(0,a._)("h1",{class:"text-center"},"Register",-1),r={class:"column justify-center q-gutter-xs q-my-xl"},o={class:"row justify-between content-between"},n={class:"column wrap content-center",style:{margin:"15px 35px"}};function i(e,s,l,i,d,u){const c=(0,a.up)("q-input"),m=(0,a.up)("q-icon"),p=(0,a.up)("q-btn");return(0,a.wg)(),(0,a.iD)(a.HY,null,[t,(0,a._)("div",r,[(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.email,"onUpdate:modelValue":s[0]||(s[0]=s=>e.credentials.email=s),class:"col-12",label:"Email",type:"email",rules:e.emailRules},null,8,["modelValue","rules"]),(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.username,"onUpdate:modelValue":s[1]||(s[1]=s=>e.credentials.username=s),class:"col-12",label:"Username",rules:[e=>e.length>=4||"Minimal length is 4",e=>/([A-Za-z0-9-_]+$)/.test(e)||"Special characters not allowed"]},null,8,["modelValue","rules"]),(0,a._)("div",o,[(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.firstName,"onUpdate:modelValue":s[2]||(s[2]=s=>e.credentials.firstName=s),class:"col-sm col-grow q-mr-sm-md",label:"First name",rules:[e=>e.length>=4||"Minimal length is 4",e=>/([A-Za-z]+$)/.test(e)||"Special characters or numbers not allowed"]},null,8,["modelValue","rules"]),(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.lastName,"onUpdate:modelValue":s[3]||(s[3]=s=>e.credentials.lastName=s),class:"col-sm col-grow",label:"Last name",rules:[e=>e.length>=4||"Minimal length is 4",e=>/([A-Za-z]+$)/.test(e)||"Special characters or numbers not allowed"]},null,8,["modelValue","rules"])]),(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.password,"onUpdate:modelValue":s[5]||(s[5]=s=>e.credentials.password=s),class:"col-12",type:e.isPwd?"password":"text",label:"Password",error:!e.passwordsMatch,rules:e.passwordRules},{append:(0,a.w5)((()=>[(0,a.Wm)(m,{name:e.isPwd?"visibility_off":"visibility",class:"cursor-pointer",onClick:s[4]||(s[4]=s=>e.isPwd=!e.isPwd)},null,8,["name"])])),error:(0,a.w5)((()=>[(0,a.Uk)(" Passwords dont match ")])),_:1},8,["modelValue","type","error","rules"]),(0,a.Wm)(c,{outlined:"",modelValue:e.credentials.passwordConfirmation,"onUpdate:modelValue":s[7]||(s[7]=s=>e.credentials.passwordConfirmation=s),class:"col-12",type:e.isPwd?"password":"text",label:"Repeat password",error:!e.passwordsMatch,rules:e.passwordRules},{append:(0,a.w5)((()=>[(0,a.Wm)(m,{name:e.isPwd?"visibility_off":"visibility",class:"cursor-pointer",onClick:s[6]||(s[6]=s=>e.isPwd=!e.isPwd)},null,8,["name"])])),error:(0,a.w5)((()=>[(0,a.Uk)(" Passwords dont match ")])),_:1},8,["modelValue","type","error","rules"])]),(0,a._)("div",n,[(0,a.Wm)(p,{class:"shadow-4 q-px-xl",color:"primary","text-color":"white","no-caps":"",label:"Register",onClick:e.onSubmit,style:{"font-size":"20px"}},null,8,["onClick"]),(0,a.Wm)(p,{to:{name:"login"},flat:"","no-caps":"",ripple:!1,color:"light-blue-10",label:"Back"})])],64)}const d=(0,a.aZ)({name:"RegisterPage",data(){return{credentials:{email:"",password:"",passwordConfirmation:"",username:"",firstName:"",lastName:""},isPwd:!0,emailRules:[e=>/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)||"Email is invalid"],passwordRules:[e=>e.length>=8||"Password too short"]}},computed:{redirectTo(){return{name:"login"}},passwordsMatch(){return this.credentials.password===this.credentials.passwordConfirmation},loading(){return"pending"===this.$store.state.auth.status}},methods:{onSubmit(){this.$store.dispatch("auth/register",this.credentials).then((()=>this.$router.push(this.redirectTo)))}}});var u=l(1639),c=l(6611),m=l(2857),p=l(4455),w=l(9984),h=l.n(w);const g=(0,u.Z)(d,[["render",i]]),b=g;h()(d,"components",{QInput:c.Z,QIcon:m.Z,QBtn:p.Z})}}]);