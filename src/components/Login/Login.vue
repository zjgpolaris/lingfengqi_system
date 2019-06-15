<template>
    <div id="login">
        <div id="container">
            <span style="font-size:30px;margin-bottom:10px">Polaris</span>
            <el-form status-icon label-width="90px" :model="userInfo" :rules="rules" ref="userInfo">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userInfo.password"></el-input>
                </el-form-item>
                <el-form-item label="验证码">
                    <div class="dynamic">
                        <div v-html="DynamicSvg" @click="changeDynamic"></div>
                        <el-input style="margin-left:5px" v-model="Dynamic"></el-input>
                    </div>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="success" >注册</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        userInfo: {
          username: '',
          password: '',
        },
        DynamicCode : '',
        DynamicSvg:'',
        Dynamic:'',
        rules : {
            username : [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
            ],
            password : [
                { required: true, message: '密码不能为空', trigger: 'blur' },
            ]
        }
      }
    },
    methods:{
        login(){
            if(this.DynamicCode.toLowerCase()===this.Dynamic.toLowerCase()){
                this.$refs['userInfo'].validate((valid) => {
                    if (valid) {
                        this.$http.post(this.$apis.signin,this.userInfo).then((resp)=>{
                            var token =resp.data.token;
                            var success = resp.data.success;
                            if(success){
                                localStorage.setItem('token',token);
                                var query = this.$route.query;
                                if(query.redirect){
                                    this.$router.push({path:query.redirect})
                                }else{
                                    this.$router.push({path:'/'})
                                }
                            }else{
                                 this.$message.error('登录失败');
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }else{
                this.$message('验证码错误')
                this.changeDynamic()
            }
        },
        changeDynamic(){
            this.$http.get(this.$apis.checkDynamicCode).then((resp)=>{
            this.DynamicCode = resp.data.data.text;
            this.DynamicSvg = resp.data.data.data
        })
        }
    },
    mounted(){
        this.changeDynamic()
    }
}
</script>

<style lang="scss" scoped>
    #login{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #container{
        width: 30%;
        height: 30%;
        min-width: 420px;
        min-height: 320px;
        border-radius: 5px;
        box-shadow: 0 0 5px 2px lightskyblue;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        form{
            width: 90%;
        }
    }
    .dynamic{
        display: flex
    }
</style>
