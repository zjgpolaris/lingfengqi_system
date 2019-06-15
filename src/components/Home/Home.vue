<template>
    <div id="Home">
        <div id="sidebar">
            <el-menu
            class="nav"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
                <template v-for="(item,index) in nav" >
                    <el-menu-item :index="index+''" :key="index+item.name" @click="goToPath(item.pathName)">
                        <i class="el-icon-setting"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div> 
        <div id="content">
            <router-view></router-view>
        </div>      
    </div>
</template>

<script>
export default {
    data () {
        return {
            nav : [
                {name:'日历管理',pathName:'Daily'},
                {name:'留言管理',pathName:'Message'},
                {name:'类型管理',pathName:'Types'},
                {name:'音频管理',pathName:'Music'},
                {name:'微信端接口',pathName:'Wechat'},
            ]
        }
    },
    methods: {
        goToPath(name){
            this.pushView({name})
        }    
    },
    created () {
        this.$store.dispatch('loadMusicType');
        this.$store.dispatch('loadMusicList')
    }
}
</script>

<style lang="scss" scoped>
    #Home{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex
    }
    #sidebar{
        width: 250px;
        min-width: 250px;
        height: 100%;
        background: #545c64;
        display: flex;
        justify-content: center;
        align-items: center
    }
    .nav{
        border: none;
        width: 80%
    }
    #content{
        width: 100%;
        height: 100%;
        background: rgb(247, 246, 246);
        padding: 10px;
        box-sizing: border-box
    }
    
</style>
