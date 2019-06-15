<template>
    <div id="types">
        <jg-table title="新增音乐类型" width="600px">
            <div slot="jgTable-content">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="音乐类型">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="类型图标">
                        <input type="file" @change="getFile($event)">
                    </el-form-item>
                </el-form>
            </div>
            <div slot="jgTable-foot">
                <el-button type="primary" @click="addNewMessage">新增</el-button>
            </div>
        </jg-table>
        <jg-table title="音乐类型" width="600px" style="margin-top: 20px">
            <table slot="jgTable-content">
                <template v-for="(item,index) in MusicType">
                    <tr :key="index+item">
                        <td>{{item.type}}</td>
                        <td>{{item._id}}</td>
                        <td><el-button type="danger" size="mini" @click="deleteMusicType(item._id,index)">删除</el-button></td>
                    </tr>
                </template>
            </table>
        </jg-table>
    </div>
</template>

<script>
import axios from 'axios'
import {mapGetters,mapMutations} from 'vuex'

export default {
    data () {
        return {
            form : {}
        }
    },
    computed:{
        ...mapGetters(['MusicType'])
    },
    methods: {
        ...mapMutations(['DELETEMUSICTYPE']),
        getFile(ev){
            this.form.icon = ev.target.files[0]
        },
        deleteMusicType(_id){
            this.$http.post(this.$apis.deleteMusicType,{_id}).then((resp)=>{
                console.log(resp);
                this.$store.dispatch('loadMusicType')
            })
        },
        addNewMessage(){
            let formData = new FormData();
            formData.append('type',this.form.type)
            formData.append('icon',this.form.icon);
            let config = {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post(this.$apis.addNewMusicType,formData,config).then((resp)=>{
                console.log(resp);
                this.$store.dispatch('loadMusicType')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    #types{
        width: 100%;
        height: 100%;
    }
</style>
